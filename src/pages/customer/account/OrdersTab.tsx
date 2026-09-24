import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  ChevronRight,
  ShoppingBag,
  PackageX,
  CreditCard,
} from 'lucide-react'
import { orderService } from '@/services'
import type { Order, OrderStatus } from '@/types'
import { formatCurrency, formatDate } from '@/utils'
import { OrderDetailModal } from './OrderDetailModal'
import { useAuthStore } from '@/store'

const statusBadgeMap: Record<OrderStatus, { text: string; bg: string; textCol: string }> = {
  pending: { text: 'Chờ xác nhận', bg: 'bg-amber-50 border-amber-200', textCol: 'text-amber-800' },
  processing: { text: 'Đang xử lý đóng gói', bg: 'bg-blue-50 border-blue-200', textCol: 'text-blue-800' },
  shipping: { text: 'Đang giao hàng', bg: 'bg-indigo-50 border-indigo-200', textCol: 'text-indigo-800' },
  delivered: { text: 'Giao hàng thành công', bg: 'bg-emerald-50 border-emerald-200', textCol: 'text-emerald-800' },
  cancelled: { text: 'Đã hủy đơn', bg: 'bg-rose-50 border-rose-200', textCol: 'text-rose-800' },
}

export const OrdersTab: React.FC = () => {
  const { currentUser } = useAuthStore()

  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchUserOrders = async () => {
      setIsLoading(true)
      try {
        const res = await orderService.getOrders(currentUser?.id)
        setOrders(res)
      } catch (err) {
        console.error('Error fetching user orders:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserOrders()
  }, [currentUser?.id])

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === 'all' || order.orderStatus === selectedStatus
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.items.some((it) => it.productName.toLowerCase().includes(q))
    return matchesStatus && matchesQuery
  })

  const statusFilters = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'processing', label: 'Đang chuẩn bị' },
    { key: 'shipping', label: 'Đang giao hàng' },
    { key: 'delivered', label: 'Đã giao' },
    { key: 'cancelled', label: 'Đã hủy' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900">Lịch Sử Đơn Hàng</h2>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi hành trình vận chuyển và quản lý các đơn hàng bạn đã đặt tại NOVA
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {statusFilters.map((st) => (
            <button
              key={st.key}
              onClick={() => setSelectedStatus(st.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedStatus === st.key
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search within orders */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã đơn hàng (#NOVA-...) hoặc tên sản phẩm..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-3xl border border-slate-200 animate-pulse space-y-4"
            >
              <div className="h-4 bg-slate-100 rounded w-1/3" />
              <div className="h-16 bg-slate-100 rounded" />
              <div className="h-6 bg-slate-100 rounded w-1/4 ml-auto" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Không có đơn hàng nào
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Bạn chưa có đơn hàng nào trong mục này. Hãy trải nghiệm mua sắm thiết bị công nghệ chính hãng ngay!
          </p>
          <Link
            to="/san-pham"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mua sắm ngay</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const badge = statusBadgeMap[order.orderStatus] || statusBadgeMap.pending

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Order Top Strip */}
                <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-900">#{order.orderNumber}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{formatDate(order.createdAt, true)}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full font-bold border ${badge.bg} ${badge.textCol}`}
                  >
                    {badge.text}
                  </span>
                </div>

                {/* Items in this order */}
                <div className="p-4 sm:p-5 divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-14 h-14 object-contain rounded-xl border bg-slate-50 p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/san-pham/${item.productSlug}`}
                          className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                        >
                          {item.productName}
                        </Link>
                        {item.selectedVariantName && (
                          <p className="text-[11px] text-slate-500">
                            Phân loại: {item.selectedVariantName}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 mt-0.5">Số lượng: x{item.quantity}</p>
                      </div>

                      <div className="text-right text-xs font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer Total & Actions */}
                <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span>Phương thức: </span>
                    <strong className="text-slate-900 uppercase">
                      {order.paymentMethod}
                    </strong>
                    <span className="text-slate-300">•</span>
                    <span>Tổng tiền: </span>
                    <span className="text-base font-black text-indigo-600">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveModalOrder(order)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <span>Xem chi tiết & Hành trình đơn</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {activeModalOrder && (
        <OrderDetailModal
          order={activeModalOrder}
          onClose={() => setActiveModalOrder(null)}
        />
      )}
    </div>
  )
}
