import { OrderStatus, PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { CouponService } from './coupon.service.js';
import { getPagination, createPaginationMeta } from '../utils/pagination.js';

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    email?: string;
    province: string;
    district: string;
    ward: string;
    addressDetail: string;
  };
  paymentMethod: 'COD' | 'BANKING' | 'MOMO' | 'VNPAY';
  couponCode?: string | null;
  note?: string | null;
}

export class OrderService {
  // 1. Create Order from Cart using Prisma Transaction
  static async createOrder(userId: string, data: CreateOrderInput) {
    // Fetch cart items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { variants: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw ApiError.badRequest('Giỏ hàng của bạn đang trống, không thể tạo đơn hàng');
    }

    // Fetch store settings for shipping calculation
    const settings = await prisma.storeSetting.findUnique({
      where: { id: 'default' },
    });

    const standardShippingFee = settings?.standardShippingFee ?? 30000;
    const freeShippingThreshold = settings?.freeShippingThreshold ?? 2000000;

    // Execute atomic transaction
    const createdOrder = await prisma.$transaction(async (tx) => {
      // Step A: Validate stock and calculate subtotal
      let subtotal = 0;
      const orderItemsData: Array<{
        productId: string;
        productName: string;
        productSlug: string;
        image: string;
        price: number;
        quantity: number;
        selectedVariantName: string | null;
        totalPrice: number;
      }> = [];

      for (const item of cart.items) {
        // Query fresh stock inside transaction
        const freshProduct = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!freshProduct) {
          throw ApiError.badRequest(`Sản phẩm "${item.product.name}" không còn tồn tại`);
        }

        if (freshProduct.stock < item.quantity) {
          throw ApiError.badRequest(
            `Sản phẩm "${freshProduct.name}" không đủ số lượng trong kho (Còn ${freshProduct.stock} sản phẩm)`
          );
        }

        const selectedVariant = item.variantId
          ? item.product.variants.find((v) => v.id === item.variantId)
          : null;

        const unitPrice = freshProduct.price + (selectedVariant ? selectedVariant.priceModifier : 0);
        const itemTotal = unitPrice * item.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
          productId: freshProduct.id,
          productName: freshProduct.name,
          productSlug: freshProduct.slug,
          image: freshProduct.thumbnail,
          price: unitPrice,
          quantity: item.quantity,
          selectedVariantName: selectedVariant ? selectedVariant.name : null,
          totalPrice: itemTotal,
        });

        // Decrement product stock and increment sold count
        await tx.product.update({
          where: { id: freshProduct.id },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        });
      }

      // Step B: Calculate Shipping Fee
      const shippingFee = subtotal >= freeShippingThreshold ? 0 : standardShippingFee;

      // Step C: Apply Coupon if provided
      let discountAmount = 0;
      let appliedCouponCode: string | null = null;

      if (data.couponCode && data.couponCode.trim() !== '') {
        const couponResult = await CouponService.validateCoupon(data.couponCode, subtotal);
        discountAmount = couponResult.discountAmount;
        appliedCouponCode = couponResult.code;

        // Increment coupon usage count
        await tx.coupon.update({
          where: { id: couponResult.id },
          data: { usageCount: { increment: 1 } },
        });
      }

      const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

      // Step D: Generate Unique Order Number
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `NOVA-${dateStr}-${randomSuffix}`;

      // Step E: Create Order with Items and initial Timeline
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
          shippingAddress: data.shippingAddress as unknown as Prisma.InputJsonValue,
          paymentMethod: data.paymentMethod as PaymentMethod,
          paymentStatus: PaymentStatus.PENDING,
          orderStatus: OrderStatus.PENDING,
          subtotal,
          shippingFee,
          discountAmount,
          totalAmount,
          couponCode: appliedCouponCode,
          note: data.note || null,
          items: {
            create: orderItemsData,
          },
          timeline: {
            create: [
              {
                status: OrderStatus.PENDING,
                note: 'Đơn hàng đã được tạo thành công trên hệ thống',
              },
            ],
          },
        },
        include: {
          items: true,
          timeline: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      // Step F: Clear user's cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });

    return createdOrder;
  }

  // 2. Get My Orders (Customer)
  static async getMyOrders(userId: string, query: { page?: string; limit?: string }) {
    const { page, limit, skip } = getPagination(query);

    const [total, orders] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.findMany({
        where: { userId },
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

  // 3. Get Order Detail by ID (Customer ownership verified)
  static async getOrderDetail(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: true,
        timeline: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!order) {
      throw ApiError.notFound('Không tìm thấy thông tin đơn hàng này');
    }

    return order;
  }

  // 4. Cancel Order (Customer - only when PENDING)
  static async cancelOrder(userId: string, orderId: string, reason?: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true },
    });

    if (!order) {
      throw ApiError.notFound('Không tìm thấy đơn hàng cần hủy');
    }

    if (order.orderStatus !== OrderStatus.PENDING) {
      throw ApiError.badRequest('Chỉ có thể hủy đơn hàng khi trạng thái là Chờ xử lý (PENDING)');
    }

    const cancelledOrder = await prisma.$transaction(async (tx) => {
      // Restore stock for all products in the order
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

      // If coupon was used, decrement its usage count
      if (order.couponCode) {
        await tx.coupon.updateMany({
          where: { code: order.couponCode, usageCount: { gt: 0 } },
          data: { usageCount: { decrement: 1 } },
        });
      }

      // Update order status
      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          orderStatus: OrderStatus.CANCELLED,
          timeline: {
            create: {
              status: OrderStatus.CANCELLED,
              note: reason ? `Khách hàng đã hủy đơn. Lý do: ${reason}` : 'Khách hàng đã hủy đơn',
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

    return cancelledOrder;
  }
}
