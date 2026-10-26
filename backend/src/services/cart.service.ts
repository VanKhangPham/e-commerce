import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';

export class CartService {
  // Ensure user has a cart record
  private static async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    return cart;
  }

  // 1. Get user cart
  static async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        product: {
          include: {
            variants: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedItems = items.map((item) => {
      const selectedVariant = item.variantId
        ? item.product.variants.find((v) => v.id === item.variantId)
        : null;

      const unitPrice = item.product.price + (selectedVariant ? selectedVariant.priceModifier : 0);
      const totalPrice = unitPrice * item.quantity;

      return {
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          thumbnail: item.product.thumbnail,
          stock: item.product.stock,
        },
        selectedVariant: selectedVariant
          ? {
              id: selectedVariant.id,
              name: selectedVariant.name,
              value: selectedVariant.value,
              type: selectedVariant.type,
              priceModifier: selectedVariant.priceModifier,
            }
          : null,
        unitPrice,
        totalPrice,
      };
    });

    const totalQuantity = formattedItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = formattedItems.reduce((acc, item) => acc + item.totalPrice, 0);

    return {
      id: cart.id,
      items: formattedItems,
      totalQuantity,
      subtotal,
    };
  }

  // 2. Add item to cart
  static async addToCart(
    userId: string,
    productId: string,
    variantId?: string | null,
    quantity = 1
  ) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });

    if (!product) {
      throw ApiError.notFound('Không tìm thấy sản phẩm');
    }

    if (product.stock < quantity) {
      throw ApiError.badRequest(`Sản phẩm không đủ số lượng trong kho (Còn ${product.stock} sản phẩm)`);
    }

    if (variantId) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant) {
        throw ApiError.badRequest('Biến thể sản phẩm không hợp lệ');
      }
      if (!variant.inStock) {
        throw ApiError.badRequest('Biến thể đã tạm hết hàng');
      }
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw ApiError.badRequest(
          `Bạn đã có ${existingItem.quantity} sản phẩm này trong giỏ. Kho chỉ còn ${product.stock} sản phẩm`
        );
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  // 3. Update cart item quantity
  static async updateCartItemQuantity(userId: string, itemId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { product: true },
    });

    if (!item) {
      throw ApiError.notFound('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return this.getCart(userId);
    }

    if (quantity > item.product.stock) {
      throw ApiError.badRequest(`Số lượng vượt quá tồn kho (Còn ${item.product.stock} sản phẩm)`);
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  // 4. Remove item from cart
  static async removeFromCart(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw ApiError.notFound('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(userId);
  }

  // 5. Clear cart
  static async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { message: 'Đã xóa toàn bộ sản phẩm trong giỏ hàng' };
  }

  // 6. Wishlist: Get items
  static async getWishlist(userId: string) {
    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((w) => ({
      id: w.id,
      productId: w.productId,
      product: {
        ...w.product,
        categoryName: w.product.category.name,
      },
      createdAt: w.createdAt,
    }));
  }

  // 7. Wishlist: Add item
  static async addToWishlist(userId: string, productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw ApiError.notFound('Không tìm thấy sản phẩm');
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      return { message: 'Sản phẩm đã có trong danh sách yêu thích' };
    }

    await prisma.wishlistItem.create({
      data: { userId, productId },
    });

    return { message: 'Đã thêm vào danh sách yêu thích thành công' };
  }

  // 8. Wishlist: Remove item
  static async removeFromWishlist(userId: string, productId: string) {
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (!existing) {
      throw ApiError.notFound('Sản phẩm không có trong danh sách yêu thích');
    }

    await prisma.wishlistItem.delete({
      where: { id: existing.id },
    });

    return { message: 'Đã xóa sản phẩm khỏi danh sách yêu thích' };
  }
}
