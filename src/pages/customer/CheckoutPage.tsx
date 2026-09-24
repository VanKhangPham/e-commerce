import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Building,
  Smartphone,
  QrCode,
  DollarSign,
} from 'lucide-react'
import { useCartStore, useAuthStore, useToastStore } from '@/store'
import { orderService } from '@/services'
import { checkoutSchema, type CheckoutFormData } from '@/utils'
import { formatCurrency } from '@/utils'
import type { PaymentMethod } from '@/types'

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { items, getSummary, clearCart } = useCartStore()
  const { currentUser } = useAuthStore()
  const { showToast } = useToastStore()

  // Steps: 1 = Shipping info, 2 = Payment method, 3 = Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const summary = getSummary()

  // Default address autofill if user has saved addresses
  const defaultSavedAddress = currentUser?.addresses?.find((a) => a.isDefault) || currentUser?.addresses?.[0]

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: currentUser?.name || defaultSavedAddress?.fullName || '',
      phone: currentUser?.phone || defaultSavedAddress?.phone || '',
      email: currentUser?.email || '',
      province: defaultSavedAddress?.province || 'Thành phố Hồ Chí Minh',
      district: defaultSavedAddress?.district || 'Quận 1',
      ward: defaultSavedAddress?.ward || 'Phường Bến Nghé',
      addressDetail: defaultSavedAddress?.addressDetail || '',
      paymentMethod: 'cod',
      note: '',
    },
  })

  const selectedPaymentMethod = watch('paymentMethod')

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-black text-slate-900 mb-2">Giỏ hàng trống</h2>
        <p className="text-xs text-slate-500 mb-6">
          Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.
        </p>
        <Link
          to="/san-pham"
          className="px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-xs"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    )
  }

  // Handle final order submission
  const onSubmitOrder = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    try {
      const orderItems = items.map((item) => ({
        id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        selectedVariantName: item.selectedVariant?.name,
        totalPrice: item.price * item.quantity,
      }))

      const created = await orderService.createOrder({
        customerId: currentUser?.id || 'guest',
        customerName: data.fullName,
        customerPhone: data.phone,
        customerEmail: data.email,
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          province: data.province,
          district: data.district,
          ward: data.ward,
          addressDetail: data.addressDetail,
        },
        items: orderItems,
        paymentMethod: data.paymentMethod as PaymentMethod,
        paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'paid',
        orderStatus: 'pending',
        subtotal: summary.subtotal,
        discountAmount: summary.discountAmount,
        shippingFee: summary.shippingFee,
        totalAmount: summary.total,
        couponCode: summary.appliedCoupon?.code,
        note: data.note,
      })

      clearCart()
      showToast('Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại NOVA.', 'success')
      navigate(`/thanh-toan/thanh-cong?orderNumber=${created.orderNumber}`)
    } catch {
      showToast('Có lỗi xảy ra trong quá trình đặt hàng, vui lòng thử lại', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Checkout Progress Stepper */}
      <div className="mb-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-slate-900 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
          />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center">
            <button
              onClick={() => setCurrentStep(1)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 1
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border-2 border-slate-300 text-slate-400'
              }`}
            >
              1
            </button>
            <span className="text-[11px] font-bold text-slate-800 mt-2">Giao Hàng</span>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center">
            <button
              onClick={() => setCurrentStep(2)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep >= 2
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border-2 border-slate-300 text-slate-400'
              }`}
            >
              2
            </button>
            <span className="text-[11px] font-bold text-slate-800 mt-2">Thanh Toán</span>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center">
            <button
              onClick={() => setCurrentStep(3)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                currentStep === 3
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border-2 border-slate-300 text-slate-400'
              }`}
            >
              3
            </button>
            <span className="text-[11px] font-bold text-slate-800 mt-2">Xác Nhận</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitOrder)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form Area: 8 Columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-900">
                      Bước 1: Thông Tin Giao Hàng
                    </h2>
                  </div>
                </div>

                {/* Saved addresses shortcut */}
                {currentUser?.addresses && currentUser.addresses.length > 0 && (
                  <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl">
                    <span className="text-xs font-bold text-indigo-900 block mb-2">
                      Sử dụng địa chỉ đã lưu trong sổ địa chỉ:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.addresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => {
                            setValue('fullName', addr.fullName)
                            setValue('phone', addr.phone)
                            setValue('province', addr.province)
                            setValue('district', addr.district)
                            setValue('ward', addr.ward)
                            setValue('addressDetail', addr.addressDetail)
                            showToast(`Đã điền địa chỉ: ${addr.district}, ${addr.province}`, 'info')
                          }}
                          className="px-3 py-1.5 bg-white border border-indigo-200 rounded-xl text-xs font-semibold text-indigo-800 hover:bg-indigo-600 hover:text-white transition-colors"
                        >
                          {addr.fullName} - {addr.district}, {addr.province}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Họ và tên người nhận *</label>
                    <input
                      type="text"
                      {...register('fullName')}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Số điện thoại liên hệ *</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="0908123456"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-rose-600">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Email nhận hóa đơn điện tử *</label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="email@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Province */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Tỉnh / Thành phố *</label>
                    <input
                      type="text"
                      {...register('province')}
                      placeholder="TP. Hồ Chí Minh"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {errors.province && (
                      <p className="text-[11px] text-rose-600">{errors.province.message}</p>
                    )}
                  </div>

                  {/* District */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Quận / Huyện *</label>
                    <input
                      type="text"
                      {...register('district')}
                      placeholder="Quận 1"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {errors.district && (
                      <p className="text-[11px] text-rose-600">{errors.district.message}</p>
                    )}
                  </div>

                  {/* Ward */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Phường / Xã *</label>
                    <input
                      type="text"
                      {...register('ward')}
                      placeholder="Phường Bến Nghé"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {errors.ward && (
                      <p className="text-[11px] text-rose-600">{errors.ward.message}</p>
                    )}
                  </div>

                  {/* Detail Address */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Địa chỉ cụ thể (Số nhà, tên đường, tòa nhà) *</label>
                    <input
                      type="text"
                      {...register('addressDetail')}
                      placeholder="Số 123 Đường Lê Lợi, Tòa nhà Saigon Center"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    {errors.addressDetail && (
                      <p className="text-[11px] text-rose-600">{errors.addressDetail.message}</p>
                    )}
                  </div>

                  {/* Note */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Ghi chú giao hàng (Tuỳ chọn)</label>
                    <textarea
                      {...register('note')}
                      rows={2}
                      placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao 15 phút..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <span>Tiếp tục: Chọn phương thức thanh toán</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Payment Method */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-900">
                      Bước 2: Phương Thức Thanh Toán
                    </h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Option 1: COD */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedPaymentMethod === 'cod'
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value="cod"
                      {...register('paymentMethod')}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Thanh toán khi nhận hàng (COD)
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Phổ biến
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Kiểm tra hàng trước khi thanh toán tiền mặt cho nhân viên giao hàng.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Banking Transfer */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedPaymentMethod === 'banking'
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value="banking"
                      {...register('paymentMethod')}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-sky-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Chuyển khoản ngân hàng trực tiếp
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Chuyển khoản qua số tài khoản ngân hàng Vietcombank / Techcombank / MB Bank.
                      </p>
                      {selectedPaymentMethod === 'banking' && (
                        <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                          <p><strong>Ngân hàng:</strong> Techcombank (Chi nhánh Sài Gòn)</p>
                          <p><strong>Số tài khoản:</strong> 1903 8888 9999</p>
                          <p><strong>Chủ tài khoản:</strong> CÔNG TY CỔ PHẦN CÔNG NGHỆ NOVA</p>
                          <p className="text-indigo-600 font-medium">Nội dung CK: [Số Điện Thoại] NOVA</p>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option 3: MoMo */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedPaymentMethod === 'momo'
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value="momo"
                      {...register('paymentMethod')}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-rose-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Ví Điện Tử MoMo
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Quét mã QR MoMo hoặc thanh toán trực tiếp qua ứng dụng MoMo trên điện thoại.
                      </p>
                    </div>
                  </label>

                  {/* Option 4: VNPAY */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedPaymentMethod === 'vnpay'
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value="vnpay"
                      {...register('paymentMethod')}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Cổng thanh toán VNPAY-QR
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          Hơn 40 ngân hàng
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Quét mã VNPAY-QR bằng ứng dụng ngân hàng di động bất kỳ.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại thông tin giao hàng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <span>Tiếp tục: Xem lại & Đặt hàng</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Final Confirmation */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-base font-bold text-slate-900">
                      Bước 3: Xác Nhận Đơn Hàng Của Bạn
                    </h2>
                  </div>
                </div>

                {/* Items Purchased List */}
                <div className="divide-y divide-slate-100 border rounded-2xl border-slate-200 p-4">
                  {items.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-14 h-14 object-contain rounded-xl bg-slate-50 border p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {item.productName}
                        </p>
                        {item.selectedVariant && (
                          <p className="text-[11px] text-slate-500">
                            Phân loại: {item.selectedVariant.name}
                          </p>
                        )}
                        <p className="text-xs text-slate-500">Số lượng: x{item.quantity}</p>
                      </div>
                      <div className="text-right text-xs font-bold text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Địa Chỉ Giao Hàng:</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-indigo-600 hover:underline"
                      >
                        Sửa
                      </button>
                    </div>
                    <p className="font-semibold text-slate-800">{watch('fullName')} - {watch('phone')}</p>
                    <p className="text-slate-600">
                      {watch('addressDetail')}, {watch('ward')}, {watch('district')}, {watch('province')}
                    </p>
                    {watch('note') && (
                      <p className="text-slate-500 italic mt-1">Ghi chú: {watch('note')}</p>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Phương Thức Thanh Toán:</span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-indigo-600 hover:underline"
                      >
                        Sửa
                      </button>
                    </div>
                    <p className="font-semibold text-indigo-700 uppercase">
                      {selectedPaymentMethod === 'cod' && 'Thanh toán tiền mặt khi nhận hàng (COD)'}
                      {selectedPaymentMethod === 'banking' && 'Chuyển khoản ngân hàng'}
                      {selectedPaymentMethod === 'momo' && 'Ví điện tử MoMo'}
                      {selectedPaymentMethod === 'vnpay' && 'Cổng thanh toán VNPAY-QR'}
                    </p>
                    <p className="text-slate-500">Thời gian giao dự kiến: 1 - 2 ngày làm việc</p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại chọn thanh toán</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Đang tạo đơn hàng...' : 'Xác Nhận Đặt Hàng Ngay'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Column: 4 Columns */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 sticky top-24">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Chi Tiết Thanh Toán
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Tạm tính ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)</span>
                  <span className="font-bold text-slate-900">{formatCurrency(summary.subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-bold text-slate-900">
                    {summary.shippingFee === 0 ? (
                      <span className="text-emerald-600">Miễn phí</span>
                    ) : (
                      formatCurrency(summary.shippingFee)
                    )}
                  </span>
                </div>

                {summary.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold">
                    <span>Mã giảm giá ({summary.appliedCoupon?.code})</span>
                    <span>-{formatCurrency(summary.discountAmount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between text-slate-900">
                  <span className="text-sm font-extrabold">Tổng thanh toán</span>
                  <span className="text-xl sm:text-2xl font-black text-indigo-600">
                    {formatCurrency(summary.total)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-500 space-y-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>Đồng kiểm hàng trước khi thanh toán COD</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Đổi trả 30 ngày nếu phát sinh lỗi nhà sản xuất</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
