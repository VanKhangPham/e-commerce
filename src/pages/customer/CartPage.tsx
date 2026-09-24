import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  X,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import { useCartStore, useToastStore } from '@/store'
import { couponService } from '@/services'
import { formatCurrency } from '@/utils'

export const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    items,
    appliedCoupon,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    getSummary,
  } = useCartStore()
  const { showToast } = useToastStore()

  const [couponCodeInput, setCouponCodeInput] = useState('')
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)

  const summary = getSummary()

  // Free shipping threshold: 2.000.000₫
  const freeShippingThreshold = 2000000
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - summary.subtotal)
  const shippingProgress = Math.min(100, Math.round((summary.subtotal / freeShippingThreshold) * 100))

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponCodeInput).trim()
    if (!code) {
      showToast('Vui lòng nhập mã giảm giá', 'warning')
      return
    }

    setIsValidatingCoupon(true)
    try {
      const res = await couponService.validateCoupon(code, summary.subtotal)
      if (res.isValid && res.coupon) {
        applyCoupon(res.coupon)
        showToast(res.message, 'success')
        setCouponCodeInput('')
      } else {
        showToast(res.message, 'error')
      }
    } catch {
      showToast('Không thể kiểm tra mã giảm giá lúc này', 'error')
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    showToast('Đã hủy áp dụng mã giảm giá', 'info')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-10 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            Giỏ Hàng Của Bạn Đang Trống
          </h1>
          <p className="text-xs text-slate-500 mb-8 leading-relaxed">
            Bạn chưa chọn sản phẩm nào vào giỏ hàng. Hãy khám phá hàng ngàn siêu phẩm công nghệ chính hãng giá tốt tại NOVA.
          </p>
          <Link
            to="/san-pham"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all shadow-md hover:scale-105"
          >
            <span>Khám phá sản phẩm ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Breadcrumb & Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link to="/" className="hover:text-slate-700">Trang chủ</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Giỏ hàng ({items.length})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Giỏ Hàng Mua Sắm
          </h1>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?')) {
              clearCart()
              showToast('Đã xóa toàn bộ giỏ hàng', 'info')
            }
          }}
          className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Xóa tất cả</span>
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs mb-8">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-indigo-600" />
            {remainingForFreeShipping === 0 ? (
              <span className="text-emerald-600 font-bold">
                Chúc mừng! Bạn đã được MIỄN PHÍ VẬN CHUYỂN toàn quốc.
              </span>
            ) : (
              <span>
                Mua thêm <strong className="text-indigo-600">{formatCurrency(remainingForFreeShipping)}</strong> để được Miễn Phí Vận Chuyển
              </span>
            )}
          </span>
          <span className="font-bold text-slate-900">{shippingProgress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${shippingProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Items Table + Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {items.map((item) => {
              const itemTotal = item.price * item.quantity

              return (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                  {/* Thumbnail */}
                  <Link to={`/san-pham/${item.productSlug}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-2xl bg-slate-50 border border-slate-100 p-2"
                    />
                  </Link>

                  {/* Title & Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/san-pham/${item.productSlug}`}
                      className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2"
                    >
                      {item.productName}
                    </Link>

                    {item.selectedVariant && (
                      <p className="text-xs text-slate-500 mt-1">
                        Phân loại: <span className="font-semibold text-slate-700">{item.selectedVariant.name}</span>
                      </p>
                    )}

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-sm font-extrabold text-slate-900">
                        {formatCurrency(item.price)}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-4">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label="Giảm"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label="Tăng"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right sm:w-28">
                      <span className="text-sm sm:text-base font-black text-slate-900 block">
                        {formatCurrency(itemTotal)}
                      </span>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/san-pham"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tiếp tục tìm kiếm sản phẩm</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Tag className="w-4 h-4 text-indigo-600" />
              <span>Mã Giảm Giá / Voucher</span>
            </div>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{appliedCoupon.code}</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 mt-0.5">
                    {appliedCoupon.description}
                  </p>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
                  title="Hủy mã"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleApplyCoupon()
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  placeholder="Nhập mã (VD: NOVANEW)"
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase placeholder:normal-case placeholder:font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <button
                  type="submit"
                  disabled={isValidatingCoupon || !couponCodeInput.trim()}
                  className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  {isValidatingCoupon ? 'Đang áp dụng...' : 'Áp dụng'}
                </button>
              </form>
            )}

            {/* Quick Coupons Suggestions */}
            {!appliedCoupon && (
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                  Mã ưu đãi gợi ý cho bạn:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon('NOVANEW')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 transition-colors"
                  >
                    NOVANEW (-10%)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon('FREESHIP')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 transition-colors"
                  >
                    FREESHIP (-30k)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon('SALE500K')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 transition-colors"
                  >
                    SALE500K (-500k)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Box */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Tóm Tắt Đơn Hàng
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Tạm tính hàng ({items.reduce((s, i) => s + i.quantity, 0)} món)</span>
                <span className="font-bold text-slate-900">{formatCurrency(summary.subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Phí vận chuyển dự kiến</span>
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
                <div>
                  <span className="text-sm font-extrabold block">Tổng số tiền thanh toán</span>
                  <span className="text-[10px] text-slate-400 font-normal">Đã bao gồm VAT 10%</span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-indigo-600">
                  {formatCurrency(summary.total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/thanh-toan')}
              className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              <span>Tiến Hành Đặt Hàng & Thanh Toán</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Bảo mật thanh toán chuẩn mã hóa 256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Tích lũy điểm thưởng thành viên NOVA Loyalty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
