import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên người nhận không được để trống'),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại nhận hàng không hợp lệ'),
  email: z.string().email('Email người nhận không đúng định dạng').optional().or(z.literal('')),
  province: z.string().min(1, 'Tỉnh/Thành phố không được để trống'),
  district: z.string().min(1, 'Quận/Huyện không được để trống'),
  ward: z.string().min(1, 'Phường/Xã không được để trống'),
  addressDetail: z.string().min(5, 'Địa chỉ cụ thể phải có ít nhất 5 ký tự'),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Tên khách hàng phải có ít nhất 2 ký tự'),
  customerPhone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  customerEmail: z.string().email('Email không đúng định dạng'),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['COD', 'BANKING', 'MOMO', 'VNPAY']).default('COD'),
  couponCode: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'], {
    errorMap: () => ({ message: 'Trạng thái đơn hàng không hợp lệ' }),
  }),
  note: z.string().optional(),
});
