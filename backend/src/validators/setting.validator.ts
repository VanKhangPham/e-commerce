import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(100),
  email: z.string().email('Địa chỉ email không đúng định dạng'),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ').optional().or(z.literal('')),
  subject: z.string().min(3, 'Tiêu đề liên hệ phải có ít nhất 3 ký tự'),
  message: z.string().min(10, 'Nội dung tin nhắn phải có ít nhất 10 ký tự'),
});

export const newsletterSchema = z.object({
  email: z.string().email('Địa chỉ email không đúng định dạng'),
});

export const updateStoreSettingSchema = z.object({
  storeName: z.string().min(2, 'Tên cửa hàng không được để trống').optional(),
  hotline: z.string().min(8, 'Hotline không hợp lệ').optional(),
  email: z.string().email('Email cửa hàng không hợp lệ').optional(),
  address: z.string().min(5, 'Địa chỉ không được để trống').optional(),
  slogan: z.string().optional().nullable(),
  standardShippingFee: z.number().int().min(0).optional(),
  freeShippingThreshold: z.number().int().min(0).optional(),
  enableCOD: z.boolean().optional(),
  enableBanking: z.boolean().optional(),
  enableMoMo: z.boolean().optional(),
  enableVNPay: z.boolean().optional(),
  notifyOrderEmail: z.boolean().optional(),
  notifyLowStock: z.boolean().optional(),
  notifyAdminTelegram: z.boolean().optional(),
});
