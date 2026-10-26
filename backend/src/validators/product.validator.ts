import { z } from 'zod';

export const listProductsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  categoryId: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  rating: z.string().optional(),
  sort: z.string().optional(), // 'price-asc', 'price-desc', 'newest', 'rating', 'popular'
  isFeatured: z.string().optional(),
  isFlashSale: z.string().optional(),
});

const variantItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên biến thể không được để trống'),
  type: z.enum(['COLOR', 'SIZE', 'VERSION']).default('COLOR'),
  value: z.string().min(1, 'Giá trị biến thể không được để trống'),
  priceModifier: z.number().int().default(0),
  inStock: z.boolean().default(true),
  sku: z.string().optional().nullable(),
});

const specificationItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên thông số không được để trống'),
  value: z.string().min(1, 'Giá trị thông số không được để trống'),
});

const imageItemSchema = z.object({
  url: z.string().url('Đường dẫn hình ảnh không hợp lệ'),
  order: z.number().int().default(0),
  isPrimary: z.boolean().default(false),
});

export const createProductSchema = z.object({
  name: z.string().min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự').max(200, 'Tên sản phẩm quá dài'),
  slug: z.string().min(2, 'Slug sản phẩm không được để trống'),
  price: z.number().int().positive('Giá sản phẩm phải lớn hơn 0'),
  originalPrice: z.number().int().positive('Giá gốc sản phẩm phải lớn hơn 0'),
  categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
  brand: z.string().min(1, 'Thương hiệu không được để trống'),
  shortDescription: z.string().min(5, 'Mô tả ngắn phải có ít nhất 5 ký tự'),
  description: z.string().min(10, 'Mô tả chi tiết phải có ít nhất 10 ký tự'),
  stock: z.number().int().min(0, 'Số lượng tồn kho không được âm'),
  thumbnail: z.string().url('Đường dẫn ảnh thu nhỏ không hợp lệ'),
  isFeatured: z.boolean().optional().default(false),
  isBestSeller: z.boolean().optional().default(false),
  isFlashSale: z.boolean().optional().default(false),
  flashSaleEndsAt: z.string().datetime().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  images: z.array(imageItemSchema).optional().default([]),
  variants: z.array(variantItemSchema).optional().default([]),
  specifications: z.array(specificationItemSchema).optional().default([]),
});

export const updateProductSchema = createProductSchema.partial();
