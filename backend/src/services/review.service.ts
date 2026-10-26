import { OrderStatus } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';

export class ReviewService {
  // 1. Get approved reviews for a product
  static async getProductReviews(productId: string) {
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        approved: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      userId: r.userId,
      userName: r.user.name,
      userAvatar: r.user.avatar,
      rating: r.rating,
      comment: r.comment,
      approved: r.approved,
      orderVerified: r.orderVerified,
      createdAt: r.createdAt,
    }));
  }

  // 2. Create Review (Customer) - checks purchase verification
  static async createReview(
    userId: string,
    data: { productId: string; rating: number; comment: string }
  ) {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw ApiError.notFound('Không tìm thấy sản phẩm');
    }

    // Check if user has purchased this product
    const deliveredOrder = await prisma.order.findFirst({
      where: {
        userId,
        orderStatus: OrderStatus.DELIVERED,
        items: {
          some: { productId: data.productId },
        },
      },
    });

    const isVerifiedPurchase = Boolean(deliveredOrder);

    // Create review
    const review = await prisma.review.create({
      data: {
        productId: data.productId,
        userId,
        rating: data.rating,
        comment: data.comment,
        approved: true, // auto approve or moderator review
        orderVerified: isVerifiedPurchase,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Update product average rating & review count
    const stats = await prisma.review.aggregate({
      where: { productId: data.productId, approved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: data.productId },
      data: {
        rating: stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : 5.0,
        reviewCount: stats._count.rating,
      },
    });

    return {
      id: review.id,
      productId: review.productId,
      userId: review.userId,
      userName: review.user.name,
      userAvatar: review.user.avatar,
      rating: review.rating,
      comment: review.comment,
      approved: review.approved,
      orderVerified: review.orderVerified,
      createdAt: review.createdAt,
    };
  }

  // 3. Update my review
  static async updateReview(
    userId: string,
    reviewId: string,
    data: { rating?: number; comment?: string }
  ) {
    const review = await prisma.review.findFirst({
      where: { id: reviewId, userId },
    });

    if (!review) {
      throw ApiError.notFound('Không tìm thấy đánh giá của bạn');
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data,
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    if (data.rating) {
      const stats = await prisma.review.aggregate({
        where: { productId: review.productId, approved: true },
        _avg: { rating: true },
      });
      await prisma.product.update({
        where: { id: review.productId },
        data: {
          rating: stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : 5.0,
        },
      });
    }

    return updated;
  }

  // 4. Delete my review
  static async deleteReview(userId: string, reviewId: string) {
    const review = await prisma.review.findFirst({
      where: { id: reviewId, userId },
    });

    if (!review) {
      throw ApiError.notFound('Không tìm thấy đánh giá cần xóa');
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Update product rating and count
    const stats = await prisma.review.aggregate({
      where: { productId: review.productId, approved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : 5.0,
        reviewCount: stats._count.rating,
      },
    });

    return { message: 'Đã xóa đánh giá thành công' };
  }
}
