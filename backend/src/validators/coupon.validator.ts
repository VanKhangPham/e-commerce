import { z } from 'zod';

export const validateCouponSchema = z.object({
  code: z.string().min(1, 'Mã giảm giá không được để trống'),
  cartTotal: z.number().int().min(0, 'Tổng giá trị giỏ hàng không hợp lệ'),
});

export const createCouponSchema = z.object({
  code: z.string().min(3, 'Mã giảm giá phải có ít nhất 3 ký tự').toUpperCase(),
  description: z.string().min(5, 'Mô tả mã giảm giá phải có ít nhất 5 ký tự'),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().int().positive('Giá trị giảm phải lớn hơn 0'),
  minOrderValue: z.number().int().min(0).default(0),
  maxDiscount: z.number().int().positive().optional().nullable(),
  expiryDate: z.string().datetime({ message: 'Thời hạn phải là định dạng ISO date hợp lệ' }),
  usageLimit: z.number().int().positive().default(100),
  isActive: z.boolean().default(true),
});

export const updateCouponSchema = createCouponSchema.partial();
