import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập địa chỉ email').email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
    email: z.string().min(1, 'Vui lòng nhập địa chỉ email').email('Email không đúng định dạng'),
    phone: z
      .string()
      .min(10, 'Số điện thoại không hợp lệ')
      .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại Việt Nam không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập địa chỉ email').email('Email không đúng định dạng'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
    confirmNewPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Mật khẩu xác nhận không trùng khớp',
    path: ['confirmNewPassword'],
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ và tên người nhận'),
  phone: z
    .string()
    .min(10, 'Số điện thoại không hợp lệ')
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại Việt Nam không hợp lệ'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
  province: z.string().min(1, 'Vui lòng chọn Tỉnh / Thành phố'),
  district: z.string().min(1, 'Vui lòng chọn Quận / Huyện'),
  ward: z.string().min(1, 'Vui lòng chọn Phường / Xã'),
  addressDetail: z.string().min(5, 'Vui lòng nhập địa chỉ cụ thể (số nhà, tên đường)'),
  paymentMethod: z.enum(['cod', 'banking', 'momo', 'vnpay'], {
    message: 'Vui lòng chọn phương thức thanh toán',
  }),
  note: z.string().optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ tên người nhận'),
  phone: z
    .string()
    .min(10, 'Số điện thoại không hợp lệ')
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
  province: z.string().min(1, 'Vui lòng nhập Tỉnh / Thành phố'),
  district: z.string().min(1, 'Vui lòng nhập Quận / Huyện'),
  ward: z.string().min(1, 'Vui lòng nhập Phường / Xã'),
  addressDetail: z.string().min(5, 'Vui lòng nhập địa chỉ chi tiết'),
  isDefault: z.boolean().default(false),
})

export type AddressFormData = z.infer<typeof addressSchema>
