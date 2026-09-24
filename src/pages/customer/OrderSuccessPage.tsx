import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  CheckCircle2,
  Package,
  CreditCard,
  MapPin,
  Home,
} from 'lucide-react'
import { orderService } from '@/services'
import type { Order } from '@/types'
import { formatCurrency, formatDate } from '@/utils'

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('orderNumber') || ''

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) {
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const found = await orderService.getOrderByNumber(orderNumber)
        setOrder(found)
      } catch (err) {
        console.error('Error fetching order confirmation:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderNumber])

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-pulse space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto" />
        <div className="h-6 bg-slate-100 rounded w-1/3 mx-auto" />
        <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs text-center space-y-6">
        {/* Celebration Header */}
        <div className="space-y-3">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Cảm ơn bạn đã tin tưởng mua sắm tại NOVA Commerce. Chúng tôi đã nhận được đơn hàng và đang tiến hành xử lý để bàn giao cho đối tác vận chuyển.
          </p>
        </div>

        {/* Order Identifier & Status */}
        {order ? (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Mã Đơn Hàng
                </span>
                <span className="text-sm font-black text-slate-900">{order.orderNumber}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Trạng Thái
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {order.orderStatus === 'pending' && 'Chờ xác nhận'}
                  {order.orderStatus === 'processing' && 'Đang đóng gói'}
                  {order.orderStatus === 'shipping' && 'Đang giao hàng'}
                  {order.orderStatus === 'delivered' && 'Giao thành công'}
                </span>
              </div>
            </div>

            {/* Recipient & Payment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>Địa Chỉ Nhận Hàng</span>
                </div>
                <p className="text-slate-700 font-medium">
                  {order.shippingAddress.fullName} ({order.shippingAddress.phone})
                </p>
                <p className="text-slate-500">
                  {order.shippingAddress.addressDetail}, {order.shippingAddress.ward},{' '}
                  {order.shippingAddress.district}, {order.shippingAddress.province}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Thanh Toán & Giao Hàng</span>
                </div>
                <p className="text-slate-700 font-medium uppercase">
                  {order.paymentMethod === 'cod' && 'Thanh toán khi nhận hàng (COD)'}
                  {order.paymentMethod === 'banking' && 'Chuyển khoản ngân hàng'}
                  {order.paymentMethod === 'momo' && 'Ví MoMo'}
                  {order.paymentMethod === 'vnpay' && 'VNPAY-QR'}
                </p>
                <p className="text-slate-500">
                  Ngày đặt: {formatDate(order.createdAt, true)}
                </p>
              </div>
            </div>

            {/* Items Purchased List */}
            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs font-bold text-slate-900 mb-2">Sản phẩm đã đặt:</p>
              <div className="divide-y divide-slate-100">
                {order.items.map((it) => (
                  <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={it.image}
                        alt={it.productName}
                        className="w-10 h-10 object-contain rounded-lg border bg-white p-1"
                      />
                      <div className="truncate">
                        <p className="font-semibold text-slate-800 truncate">{it.productName}</p>
                        <p className="text-[11px] text-slate-400">Số lượng: x{it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 whitespace-nowrap ml-3">
                      {formatCurrency(it.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grand Total */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Tổng thanh toán:</span>
              <span className="text-base font-black text-indigo-600">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
            Mã đơn hàng: <strong className="text-slate-900">{orderNumber}</strong>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/tai-khoan/don-hang"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Package className="w-4 h-4" />
            <span>Theo dõi đơn hàng trong tài khoản</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-800 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
