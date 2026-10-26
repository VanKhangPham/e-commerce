import { CouponType } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';

export class CouponService {
  static async validateCoupon(code: string, cartTotal: number) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      throw ApiError.notFound('Mã giảm giá không tồn tại');
    }

    if (!coupon.isActive) {
      throw ApiError.badRequest('Mã giảm giá hiện đang bị tạm khóa');
    }

    const now = new Date();
    if (new Date(coupon.expiryDate) < now) {
      throw ApiError.badRequest('Mã giảm giá đã hết hạn sử dụng');
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      throw ApiError.badRequest('Mã giảm giá đã hết lượt sử dụng');
    }

    if (cartTotal < coupon.minOrderValue) {
      throw ApiError.badRequest(
        `Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã này (Tối thiểu ${coupon.minOrderValue.toLocaleString('vi-VN')}₫)`
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === CouponType.PERCENTAGE) {
      discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount does not exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    return {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType.toLowerCase(),
      discountValue: coupon.discountValue,
      discountAmount,
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount,
      expiryDate: coupon.expiryDate,
    };
  }
}
