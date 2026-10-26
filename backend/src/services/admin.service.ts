import { OrderStatus, Prisma, Role, CouponType, VariantType } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination, createPaginationMeta } from '../utils/pagination.js';

export class AdminService {
  // 1. Dashboard Statistics
  static async getDashboardStats() {
    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      revenueResult,
      deliveredOrders,
      recentOrders,
      topProducts,
      categories,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: Role.USER } }),
      prisma.order.aggregate({
        where: { orderStatus: { not: OrderStatus.CANCELLED } },
        _sum: { totalAmount: true },
      }),
      prisma.order.findMany({
        where: { orderStatus: { not: OrderStatus.CANCELLED } },
        select: { createdAt: true, totalAmount: true },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { soldCount: 'desc' },
        select: {
          id: true,
          name: true,
          thumbnail: true,
          price: true,
          soldCount: true,
          stock: true,
        },
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { products: true } },
          products: {
            select: { soldCount: true, price: true },
          },
        },
      }),
    ]);

    const totalRevenue = revenueResult._sum.totalAmount || 0;

    // Aggregate monthly revenue for the last 12 months
    const monthlyRevenueMap: Record<string, number> = {};
    const months = [
      'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
      'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
    ];
    months.forEach((m) => (monthlyRevenueMap[m] = 0));

    deliveredOrders.forEach((o) => {
      const monthIndex = new Date(o.createdAt).getMonth();
      const monthKey = months[monthIndex];
      monthlyRevenueMap[monthKey] = (monthlyRevenueMap[monthKey] || 0) + o.totalAmount;
    });

    const monthlyRevenue = months.map((month) => ({
      month,
      revenue: monthlyRevenueMap[month],
    }));

    // Sales by Category
    const categorySales = categories.map((c) => {
      const sales = c.products.reduce((acc, p) => acc + p.soldCount, 0);
      return {
        name: c.name,
        sales,
        productCount: c._count.products,
      };
    });

    return {
      kpis: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
      },
      monthlyRevenue,
      categorySales,
      topProducts,
      recentOrders,
    };
  }

  // 2. Products CRUD
  static async listProducts(query: {
    page?: string;
    limit?: string;
    search?: string;
    categoryId?: string;
    stockStatus?: 'in_stock' | 'out_of_stock' | 'low_stock';
  }) {
    const { page, limit, skip } = getPagination(query);
    const where: Prisma.ProductWhereInput = {};

    if (query.search && query.search.trim() !== '') {
      where.OR = [
        { name: { contains: query.search.trim(), mode: 'insensitive' } },
        { brand: { contains: query.search.trim(), mode: 'insensitive' } },
      ];
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.stockStatus === 'out_of_stock') {
      where.stock = { equals: 0 };
    } else if (query.stockStatus === 'low_stock') {
      where.stock = { gt: 0, lte: 10 };
    } else if (query.stockStatus === 'in_stock') {
      where.stock = { gt: 0 };
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true } },
          images: { orderBy: { order: 'asc' } },
          variants: true,
          specifications: true,
        },
      }),
    ]);

    const formatted = products.map((p) => ({
      ...p,
      categoryName: p.category.name,
      images: p.images.map((img) => img.url),
    }));

    return {
      products: formatted,
      pagination: createPaginationMeta(total, page, limit),
    };
  }

  static async createProduct(data: {
    name: string;
    slug: string;
    price: number;
    originalPrice: number;
    categoryId: string;
    brand: string;
    shortDescription: string;
    description: string;
    stock: number;
    thumbnail: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isFlashSale?: boolean;
    flashSaleEndsAt?: string | null;
    tags?: string[];
    images?: Array<{ url: string; order?: number; isPrimary?: boolean }>;
    variants?: Array<{
      name: string;
      type?: 'COLOR' | 'SIZE' | 'VERSION';
      value: string;
      priceModifier?: number;
      inStock?: boolean;
      sku?: string | null;
    }>;
    specifications?: Array<{ name: string; value: string }>;
  }) {
    const existingSlug = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existingSlug) {
      throw ApiError.conflict('Slug sản phẩm này đã tồn tại, vui lòng chọn slug khác');
    }

    const discountPercentage =
      data.originalPrice > data.price
        ? Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100)
        : 0;

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        price: data.price,
        originalPrice: data.originalPrice,
        discountPercentage,
        categoryId: data.categoryId,
        brand: data.brand,
        shortDescription: data.shortDescription,
        description: data.description,
        stock: data.stock,
        thumbnail: data.thumbnail,
        isFeatured: data.isFeatured ?? false,
        isBestSeller: data.isBestSeller ?? false,
        isFlashSale: data.isFlashSale ?? false,
        flashSaleEndsAt: data.flashSaleEndsAt ? new Date(data.flashSaleEndsAt) : null,
        tags: data.tags || [],
        images: {
          create: (data.images || []).map((img, index) => ({
            url: img.url,
            order: img.order ?? index,
            isPrimary: img.isPrimary ?? index === 0,
          })),
        },
        variants: {
          create: (data.variants || []).map((v) => ({
            name: v.name,
            type: (v.type as VariantType) || VariantType.COLOR,
            value: v.value,
            priceModifier: v.priceModifier ?? 0,
            inStock: v.inStock ?? true,
            sku: v.sku || null,
          })),
        },
        specifications: {
          create: (data.specifications || []).map((s) => ({
            name: s.name,
            value: s.value,
          })),
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
        specifications: true,
      },
    });

    return product;
  }

  static async updateProduct(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      price: number;
      originalPrice: number;
      categoryId: string;
      brand: string;
      shortDescription: string;
      description: string;
      stock: number;
      thumbnail: string;
      isFeatured: boolean;
      isBestSeller: boolean;
      isFlashSale: boolean;
      flashSaleEndsAt: string | null;
      tags: string[];
      images: Array<{ url: string; order?: number; isPrimary?: boolean }>;
      variants: Array<{
        name: string;
        type?: 'COLOR' | 'SIZE' | 'VERSION';
        value: string;
        priceModifier?: number;
        inStock?: boolean;
        sku?: string | null;
      }>;
      specifications: Array<{ name: string; value: string }>;
    }>
  ) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound('Không tìm thấy sản phẩm cần cập nhật');
    }

    if (data.slug && data.slug !== existing.slug) {
      const duplicateSlug = await prisma.product.findUnique({ where: { slug: data.slug } });
      if (duplicateSlug) {
        throw ApiError.conflict('Slug mới đã được sử dụng bởi sản phẩm khác');
      }
    }

    const price = data.price ?? existing.price;
    const originalPrice = data.originalPrice ?? existing.originalPrice;
    const discountPercentage =
      originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return prisma.$transaction(async (tx) => {
      // Re-create images if provided
      if (data.images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: data.images.map((img, idx) => ({
            productId: id,
            url: img.url,
            order: img.order ?? idx,
            isPrimary: img.isPrimary ?? idx === 0,
          })),
        });
      }

      // Re-create variants if provided
      if (data.variants) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        await tx.productVariant.createMany({
          data: data.variants.map((v) => ({
            productId: id,
            name: v.name,
            type: (v.type as VariantType) || VariantType.COLOR,
            value: v.value,
            priceModifier: v.priceModifier ?? 0,
            inStock: v.inStock ?? true,
            sku: v.sku || null,
          })),
        });
      }

      // Re-create specifications if provided
      if (data.specifications) {
        await tx.productSpecification.deleteMany({ where: { productId: id } });
        await tx.productSpecification.createMany({
          data: data.specifications.map((s) => ({
            productId: id,
            name: s.name,
            value: s.value,
          })),
        });
      }

      const updated = await tx.product.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.slug && { slug: data.slug }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.originalPrice !== undefined && { originalPrice: data.originalPrice }),
          discountPercentage,
          ...(data.categoryId && { categoryId: data.categoryId }),
          ...(data.brand && { brand: data.brand }),
          ...(data.shortDescription && { shortDescription: data.shortDescription }),
          ...(data.description && { description: data.description }),
          ...(data.stock !== undefined && { stock: data.stock }),
          ...(data.thumbnail && { thumbnail: data.thumbnail }),
          ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
          ...(data.isBestSeller !== undefined && { isBestSeller: data.isBestSeller }),
          ...(data.isFlashSale !== undefined && { isFlashSale: data.isFlashSale }),
          ...(data.flashSaleEndsAt !== undefined && {
            flashSaleEndsAt: data.flashSaleEndsAt ? new Date(data.flashSaleEndsAt) : null,
          }),
          ...(data.tags && { tags: data.tags }),
        },
        include: {
          category: true,
          images: { orderBy: { order: 'asc' } },
          variants: true,
          specifications: true,
        },
      });

      return updated;
    });
  }

  static async deleteProduct(id: string) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound('Không tìm thấy sản phẩm cần xóa');
    }

    await prisma.product.delete({ where: { id } });
    return { message: 'Xóa sản phẩm thành công' };
  }

  // 3. Categories Management
  static async listCategories() {
    return prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  static async createCategory(data: {
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
  }) {
    const existingSlug = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (existingSlug) {
      throw ApiError.conflict('Slug danh mục này đã tồn tại');
    }

    return prisma.category.create({
      data,
    });
  }

  static async updateCategory(
    id: string,
    data: Partial<{ name: string; slug: string; description: string | null; image: string | null }>
  ) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound('Không tìm thấy danh mục');
    }

    if (data.slug && data.slug !== existing.slug) {
      const duplicateSlug = await prisma.category.findUnique({ where: { slug: data.slug } });
      if (duplicateSlug) {
        throw ApiError.conflict('Slug mới đã được sử dụng bởi danh mục khác');
      }
    }

    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(id: string) {
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw ApiError.badRequest(
        `Không thể xóa danh mục này vì đang có ${productCount} sản phẩm liên kết`
      );
    }

    await prisma.category.delete({ where: { id } });
    return { message: 'Xóa danh mục thành công' };
  }

  // 4. Orders Management
  static async listOrders(query: {
    page?: string;
    limit?: string;
    status?: OrderStatus;
    search?: string;
  }) {
    const { page, limit, skip } = getPagination(query);
    const where: Prisma.OrderWhereInput = {};

    if (query.status) {
      where.orderStatus = query.status;
    }

    if (query.search && query.search.trim() !== '') {
      where.OR = [
        { orderNumber: { contains: query.search.trim(), mode: 'insensitive' } },
        { customerName: { contains: query.search.trim(), mode: 'insensitive' } },
        { customerPhone: { contains: query.search.trim(), mode: 'insensitive' } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          items: true,
          timeline: { orderBy: { createdAt: 'asc' } },
        },
      }),
    ]);

    return {
      orders,
      pagination: createPaginationMeta(total, page, limit),
    };
  }

  static async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        timeline: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!order) {
      throw ApiError.notFound('Không tìm thấy thông tin đơn hàng');
    }

    return order;
  }

  static async updateOrderStatus(
    id: string,
    newStatus: OrderStatus,
    note?: string
  ) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw ApiError.notFound('Không tìm thấy đơn hàng');
    }

    // Status transition validation:
    // PENDING -> CONFIRMED, CANCELLED
    // CONFIRMED -> SHIPPING, CANCELLED
    // SHIPPING -> DELIVERED, CANCELLED
    // DELIVERED -> no change
    // CANCELLED -> no change
    if (order.orderStatus === OrderStatus.DELIVERED) {
      throw ApiError.badRequest('Đơn hàng đã được giao thành công, không thể thay đổi trạng thái');
    }

    if (order.orderStatus === OrderStatus.CANCELLED) {
      throw ApiError.badRequest('Đơn hàng đã bị hủy, không thể kích hoạt lại trạng thái');
    }

    // Default note mappings
    const statusNotes: Record<OrderStatus, string> = {
      PENDING: 'Đơn hàng ở trạng thái chờ xử lý',
      CONFIRMED: 'Đã xác nhận đơn hàng và chuẩn bị xuất kho',
      SHIPPING: 'Đơn hàng đang được đơn vị vận chuyển giao tới khách hàng',
      DELIVERED: 'Đã giao hàng thành công',
      CANCELLED: 'Đơn hàng đã bị hủy bởi quản trị viên',
    };

    const finalNote = note || statusNotes[newStatus];

    return prisma.$transaction(async (tx) => {
      // If transitioning to CANCELLED, restore stock
      if (newStatus === OrderStatus.CANCELLED) {
        for (const item of order.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { increment: item.quantity },
                soldCount: { decrement: item.quantity },
              },
            });
          }
        }

        if (order.couponCode) {
          await tx.coupon.updateMany({
            where: { code: order.couponCode, usageCount: { gt: 0 } },
            data: { usageCount: { decrement: 1 } },
          });
        }
      }

      const updated = await tx.order.update({
        where: { id },
        data: {
          orderStatus: newStatus,
          ...(newStatus === OrderStatus.DELIVERED && {
            paymentStatus: 'PAID',
          }),
          timeline: {
            create: {
              status: newStatus,
              note: finalNote,
            },
          },
        },
        include: {
          items: true,
          timeline: { orderBy: { createdAt: 'asc' } },
        },
      });

      return updated;
    });
  }

  // 5. Customers Management
  static async listCustomers(query: { page?: string; limit?: string; search?: string }) {
    const { page, limit, skip } = getPagination(query);
    const where: Prisma.UserWhereInput = { role: Role.USER };

    if (query.search && query.search.trim() !== '') {
      where.OR = [
        { name: { contains: query.search.trim(), mode: 'insensitive' } },
        { email: { contains: query.search.trim(), mode: 'insensitive' } },
        { phone: { contains: query.search.trim(), mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          role: true,
          isBlocked: true,
          createdAt: true,
          _count: { select: { orders: true } },
          orders: {
            select: { totalAmount: true },
          },
        },
      }),
    ]);

    const formatted = users.map((u) => {
      const totalSpent = u.orders.reduce((acc, o) => acc + o.totalAmount, 0);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        avatar: u.avatar,
        role: u.role,
        isBlocked: u.isBlocked,
        createdAt: u.createdAt,
        orderCount: u._count.orders,
        totalSpent,
      };
    });

    return {
      customers: formatted,
      pagination: createPaginationMeta(total, page, limit),
    };
  }

  static async getCustomerDetail(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        isBlocked: true,
        createdAt: true,
        addresses: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          include: { items: true },
        },
      },
    });

    if (!user) {
      throw ApiError.notFound('Không tìm thấy thông tin khách hàng');
    }

    return user;
  }

  static async toggleBlockCustomer(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw ApiError.notFound('Không tìm thấy người dùng');
    }

    if (user.role === Role.ADMIN) {
      throw ApiError.badRequest('Không thể khóa tài khoản quản trị viên');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isBlocked: !user.isBlocked },
      select: { id: true, name: true, email: true, isBlocked: true },
    });

    return {
      message: updated.isBlocked ? 'Đã khóa tài khoản khách hàng thành công' : 'Đã mở khóa tài khoản khách hàng',
      user: updated,
    };
  }

  // 6. Coupons Management
  static async listCoupons() {
    return prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createCoupon(data: {
    code: string;
    description: string;
    discountType: CouponType;
    discountValue: number;
    minOrderValue?: number;
    maxDiscount?: number | null;
    expiryDate: string;
    usageLimit?: number;
    isActive?: boolean;
  }) {
    const existing = await prisma.coupon.findUnique({ where: { code: data.code.toUpperCase() } });
    if (existing) {
      throw ApiError.conflict('Mã giảm giá này đã tồn tại');
    }

    return prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderValue: data.minOrderValue ?? 0,
        maxDiscount: data.maxDiscount || null,
        expiryDate: new Date(data.expiryDate),
        usageLimit: data.usageLimit ?? 100,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async updateCoupon(
    id: string,
    data: Partial<{
      code: string;
      description: string;
      discountType: CouponType;
      discountValue: number;
      minOrderValue: number;
      maxDiscount: number | null;
      expiryDate: string;
      usageLimit: number;
      isActive: boolean;
    }>
  ) {
    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound('Không tìm thấy mã giảm giá');
    }

    if (data.code && data.code.toUpperCase() !== existing.code) {
      const duplicate = await prisma.coupon.findUnique({ where: { code: data.code.toUpperCase() } });
      if (duplicate) {
        throw ApiError.conflict('Mã giảm giá mới đã được sử dụng');
      }
    }

    return prisma.coupon.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code.toUpperCase() }),
        ...(data.description && { description: data.description }),
        ...(data.discountType && { discountType: data.discountType }),
        ...(data.discountValue !== undefined && { discountValue: data.discountValue }),
        ...(data.minOrderValue !== undefined && { minOrderValue: data.minOrderValue }),
        ...(data.maxDiscount !== undefined && { maxDiscount: data.maxDiscount }),
        ...(data.expiryDate && { expiryDate: new Date(data.expiryDate) }),
        ...(data.usageLimit !== undefined && { usageLimit: data.usageLimit }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }

  static async deleteCoupon(id: string) {
    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      throw ApiError.notFound('Không tìm thấy mã giảm giá');
    }

    await prisma.coupon.delete({ where: { id } });
    return { message: 'Đã xóa mã giảm giá thành công' };
  }

  // 7. Reviews Moderation
  static async listReviews(query: { page?: string; limit?: string; approved?: string }) {
    const { page, limit, skip } = getPagination(query);
    const where: Prisma.ReviewWhereInput = {};

    if (query.approved !== undefined) {
      where.approved = query.approved === 'true';
    }

    const [total, reviews] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          product: { select: { id: true, name: true, thumbnail: true } },
          user: { select: { id: true, name: true, avatar: true, email: true } },
        },
      }),
    ]);

    return {
      reviews,
      pagination: createPaginationMeta(total, page, limit),
    };
  }

  static async approveReview(id: string, approved: boolean) {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw ApiError.notFound('Không tìm thấy đánh giá');
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { approved },
    });

    // Recalculate product rating
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

    return {
      message: approved ? 'Đã duyệt đánh giá thành công' : 'Đã bỏ duyệt đánh giá',
      review: updated,
    };
  }

  static async deleteReview(id: string) {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw ApiError.notFound('Không tìm thấy đánh giá cần xóa');
    }

    await prisma.review.delete({ where: { id } });

    // Recalculate product rating
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

  // 8. Store Settings
  static async getStoreSettings() {
    return prisma.storeSetting.findUnique({
      where: { id: 'default' },
    });
  }

  static async updateStoreSettings(data: {
    storeName?: string;
    hotline?: string;
    email?: string;
    address?: string;
    slogan?: string | null;
    standardShippingFee?: number;
    freeShippingThreshold?: number;
    enableCOD?: boolean;
    enableBanking?: boolean;
    enableMoMo?: boolean;
    enableVNPay?: boolean;
    notifyOrderEmail?: boolean;
    notifyLowStock?: boolean;
    notifyAdminTelegram?: boolean;
  }) {
    return prisma.storeSetting.upsert({
      where: { id: 'default' },
      update: data,
      create: {
        id: 'default',
        storeName: data.storeName || 'NOVA Commerce',
        hotline: data.hotline || '1900 6868',
        email: data.email || 'support@nova.vn',
        address: data.address || 'Hà Nội',
        ...data,
      },
    });
  }
}
