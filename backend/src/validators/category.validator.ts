import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Tên danh mục phải có ít nhất 2 ký tự').max(100, 'Tên danh mục quá dài'),
  slug: z.string().min(2, 'Slug danh mục không được để trống'),
  description: z.string().optional().nullable(),
  image: z.string().url('Đường dẫn hình ảnh không hợp lệ').optional().nullable(),
});

export const updateCategorySchema = createCategorySchema.partial();
