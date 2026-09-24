import React from 'react'
import {
  X,
  Package,
  MapPin,
  CreditCard,
  ShoppingBag,
} from 'lucide-react'
import type { Order, OrderStatus } from '@/types'
import { formatCurrency, formatDate } from '@/utils'
import { useCartStore, useToastStore } from '@/store'
import { productService } from '@/services'

interface OrderDetailModalProps {
  order: Order | null
  onClose: () => void
}

const statusBadgeMap: Record<OrderStatus, { text: string; bg: string; textCol: string }> = {
  pending: { text: 'Chờ xác nhận', bg: 'bg-amber-50 border-amber-200', textCol: 'text-amber-800' },
  processing: { text: 'Đang xử lý đóng gói', bg: 'bg-blue-50 border-blue-200', textCol: 'text-blue-800' },
  shipping: { text: 'Đang giao hàng', bg: 'bg-indigo-50 border-indigo-200', textCol: 'text-indigo-800' },
  delivered: { text: 'Giao hàng thành công', bg: 'bg-emerald-50 border-emerald-200', textCol: 'text-emerald-800' },
  cancelled: { text: 'Đã hủy đơn', bg: 'bg-rose-50 border-rose-200', textCol: 'text-rose-800' },
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  const { addItem, openCartDrawer } = useCartStore()
  const { showToast } = useToastStore()

  if (!order) return null

  const statusBadge = statusBadgeMap[order.orderStatus] || statusBadgeMap.pending

  const handleReorder = async () => {
    try {
      for (const item of order.items) {
        const product = await productService.getProductById(item.productId)
        if (product) {
          addItem(product, undefined, item.quantity)
        }
      }
      showToast('Đã thêm toàn bộ sản phẩm vào giỏ hàng!', 'success')
      openCartDrawer()
      onClose()
    } catch {
      showToast('Không thể thêm sản phẩm vào giỏ', 'error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Chi Tiết Đơn Hàng #{order.orderNumber}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ngày đặt: {formatDate(order.createdAt, true)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status & Timeline */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Trạng Thái Hiện Tại:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.bg} ${statusBadge.textCol}`}
            >
              {statusBadge.text}
            </span>
          </div>

          {/* Timeline events */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Lịch sử hành trình đơn hàng:
            </p>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-white" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-900">{event.note}</p>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(event.timestamp, true)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Địa Chỉ Giao Hàng</span>
            </div>
            <p className="font-semibold text-slate-800">
              {order.shippingAddress.fullName} - {order.shippingAddress.phone}
            </p>
            <p className="text-slate-500">
              {order.shippingAddress.addressDetail}, {order.shippingAddress.ward},{' '}
              {order.shippingAddress.district}, {order.shippingAddress.province}
            </p>
            {order.note && (
              <p className="text-slate-500 italic mt-1">Ghi chú: {order.note}</p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Phương Thức Thanh Toán</span>
            </div>
            <p className="font-semibold text-slate-800 uppercase">
              {order.paymentMethod === 'cod' && 'Thanh toán khi nhận hàng (COD)'}
              {order.paymentMethod === 'banking' && 'Chuyển khoản ngân hàng'}
              {order.paymentMethod === 'momo' && 'Ví điện tử MoMo'}
              {order.paymentMethod === 'vnpay' && 'VNPAY-QR'}
            </p>
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                order.paymentStatus === 'paid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
            </span>
          </div>
        </div>

        {/* Items Purchased List */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            Danh sách sản phẩm ({order.items.length})
          </h3>
          <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {order.items.map((it) => (
              <div key={it.id} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={it.image}
                    alt={it.productName}
                    className="w-12 h-12 object-contain rounded-xl border bg-slate-50 p-1 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{it.productName}</p>
                    {it.selectedVariantName && (
                      <p className="text-[11px] text-slate-400">
                        Phân loại: {it.selectedVariantName}
                      </p>
                    )}
                    <p className="text-slate-500">
                      {formatCurrency(it.price)} x {it.quantity}
                    </p>
                  </div>
                </div>

                <span className="font-black text-slate-900 whitespace-nowrap ml-3">
                  {formatCurrency(it.totalPrice)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Totals */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span>Tạm tính hàng</span>
            <span className="font-bold text-slate-900">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-600">
            <span>Phí vận chuyển</span>
            <span className="font-bold text-slate-900">
              {order.shippingFee === 0 ? 'Miễn phí' : formatCurrency(order.shippingFee)}
            </span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex items-center justify-between text-emerald-600 font-semibold">
              <span>Mã giảm giá ({order.couponCode || 'Đã áp dụng'})</span>
              <span>-{formatCurrency(order.discountAmount)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-black text-slate-900">
            <span>Tổng thanh toán</span>
            <span className="text-base text-indigo-600">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            Đóng
          </button>

          <button
            onClick={handleReorder}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mua Lại Đơn Này</span>
          </button>
        </div>
      </div>
    </div>
  )
}
