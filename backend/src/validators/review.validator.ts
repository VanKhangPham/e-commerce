import { z } from 'zod';

export const createReviewSchema = z.object({
  productId: z.string().min(1, 'ID sản phẩm không được để trống'),
  rating: z.number().int().min(1, 'Đánh giá tối thiểu là 1 sao').max(5, 'Đánh giá tối đa là 5 sao'),
  comment: z.string().min(5, 'Nội dung đánh giá phải có ít nhất 5 ký tự').max(1000, 'Nội dung đánh giá quá dài'),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(5).max(1000).optional(),
});
