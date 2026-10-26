import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'ID sản phẩm không được để trống'),
  variantId: z.string().optional().nullable(),
  quantity: z.number().int().min(1, 'Số lượng tối thiểu là 1').default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Số lượng tối thiểu là 1'),
});

export const addToWishlistSchema = z.object({
  productId: z.string().min(1, 'ID sản phẩm không được để trống'),
});
