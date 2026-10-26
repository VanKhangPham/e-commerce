import React, { useState, useEffect } from 'react'
import {
  Search,
  Eye,
  X,
  CreditCard,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { orderService } from '@/services'
import type { Order, OrderStatus } from '@/types'
import { formatCurrency, formatDate } from '@/utils'
import { useToastStore } from '@/store'

const statusBadgeMap: Record<OrderStatus, { text: string; bg: string; textCol: string }> = {
  pending: { text: 'Chờ xác nhận', bg: 'bg-amber-50 border-amber-200', textCol: 'text-amber-800' },
  processing: { text: 'Đang đóng gói', bg: 'bg-blue-50 border-blue-200', textCol: 'text-blue-800' },
  shipping: { text: 'Đang vận chuyển', bg: 'bg-indigo-50 border-indigo-200', textCol: 'text-indigo-800' },
  delivered: { text: 'Giao thành công', bg: 'bg-emerald-50 border-emerald-200', textCol: 'text-emerald-800' },
  cancelled: { text: 'Đã hủy đơn', bg: 'bg-rose-50 border-rose-200', textCol: 'text-rose-800' },
}

export const AdminOrdersPage: React.FC = () => {
  const { showToast } = useToastStore()

  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const data = await orderService.getOrders()
      setOrders(data)
    } catch (err) {
      console.error('Error fetching orders for admin:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  // Update order status handler
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, newStatus)
      if (updated) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)))
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updated)
        }
        showToast(
          `Đã chuyển trạng thái đơn hàng #${updated.orderNumber} sang "${statusBadgeMap[newStatus].text}"`,
          'success'
        )
      }
    } catch {
      showToast('Không thể cập nhật trạng thái đơn hàng', 'error')
    }
  }

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q)

    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter

    return matchesQuery && matchesStatus
  })

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const statusTabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ duyệt' },
    { key: 'processing', label: 'Đang đóng gói' },
    { key: 'shipping', label: 'Đang vận chuyển' },
    { key: 'delivered', label: 'Thành công' },
    { key: 'cancelled', label: 'Đã hủy' },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Quản Lý Đơn Hàng & Vận Chuyển
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Xử lý đơn đặt hàng, cập nhật hành trình giao vận và quản lý thanh toán
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {statusTabs.map((st) => (
            <button
              key={st.key}
              onClick={() => {
                setStatusFilter(st.key)
                setCurrentPage(1)
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === st.key
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Tìm theo mã đơn (#NOVA-...), tên khách, SĐT..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Mã đơn</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Ngày đặt</th>
                <th className="p-4">Số món</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4">Thanh toán</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ord) => {
                  const badge = statusBadgeMap[ord.orderStatus] || statusBadgeMap.pending

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-black text-slate-900 whitespace-nowrap">
                        #{ord.orderNumber}
                      </td>

                      <td className="p-4 text-slate-700 whitespace-nowrap">
                        <p className="font-bold text-slate-900">{ord.customerName}</p>
                        <span className="text-[11px] text-slate-400">{ord.customerPhone}</span>
                      </td>

                      <td className="p-4 text-slate-500 whitespace-nowrap">
                        {formatDate(ord.createdAt)}
                      </td>

                      <td className="p-4 font-semibold text-slate-700 whitespace-nowrap">
                        {ord.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm
                      </td>

                      <td className="p-4 font-black text-slate-900 whitespace-nowrap">
                        {formatCurrency(ord.totalAmount)}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {ord.paymentStatus === 'paid' ? 'Đã thu tiền' : 'Chờ thu (COD)'}
                        </span>
                      </td>

                      {/* Status Dropdown selector right on table */}
                      <td className="p-4 whitespace-nowrap">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) =>
                            handleUpdateStatus(ord.id, e.target.value as OrderStatus)
                          }
                          className={`text-xs font-bold py-1.5 px-2.5 rounded-xl border focus:outline-none cursor-pointer ${badge.bg} ${badge.textCol}`}
                        >
                          <option value="pending">Chờ xác nhận</option>
                          <option value="processing">Đang đóng gói</option>
                          <option value="shipping">Đang vận chuyển</option>
                          <option value="delivered">Giao thành công</option>
                          <option value="cancelled">Hủy đơn hàng</option>
                        </select>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Xem chi tiết đơn"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} trên tổng{' '}
              {filteredOrders.length} đơn hàng
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-bold text-slate-900">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Admin Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Hồ Sơ Đơn Hàng #{selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-slate-400">
                  Ngày đặt: {formatDate(selectedOrder.createdAt, true)}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Change Status Fast Control in Modal */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 block">
                  Trạng Thái Xử Lý Đơn Hàng:
                </span>
                <span className="text-slate-500">
                  Cập nhật để gửi thông báo tự động đến khách hàng
                </span>
              </div>

              <select
                value={selectedOrder.orderStatus}
                onChange={(e) =>
                  handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)
                }
                className="py-2 px-3 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="pending">Chờ xác nhận</option>
                <option value="processing">Đang đóng gói</option>
                <option value="shipping">Đang vận chuyển</option>
                <option value="delivered">Giao thành công</option>
                <option value="cancelled">Hủy đơn hàng</option>
              </select>
            </div>

            {/* Recipient & Payment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>Địa Chỉ Giao Hàng</span>
                </div>
                <p className="font-semibold text-slate-800">
                  {selectedOrder.shippingAddress.fullName} - {selectedOrder.shippingAddress.phone}
                </p>
                <p className="text-slate-500">
                  {selectedOrder.shippingAddress.addressDetail}, {selectedOrder.shippingAddress.ward},{' '}
                  {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.province}
                </p>
                {selectedOrder.note && (
                  <p className="text-slate-500 italic mt-1">Ghi chú: {selectedOrder.note}</p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Hình Thức Thanh Toán</span>
                </div>
                <p className="font-semibold text-slate-800 uppercase">
                  {selectedOrder.paymentMethod}
                </p>
                <p className="text-slate-500">
                  Trạng thái tiền: <strong>{selectedOrder.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thu COD'}</strong>
                </p>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Các sản phẩm trong đơn ({selectedOrder.items.length})
              </h4>
              <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="p-3 flex items-center justify-between">
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

            {/* Total breakdown */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Tạm tính</span>
                <span className="font-bold text-slate-900">{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Phí vận chuyển</span>
                <span className="font-bold text-slate-900">
                  {selectedOrder.shippingFee === 0 ? 'Miễn phí' : formatCurrency(selectedOrder.shippingFee)}
                </span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>Mã giảm giá ({selectedOrder.couponCode})</span>
                  <span>-{formatCurrency(selectedOrder.discountAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-black text-slate-900">
                <span>Tổng giá trị đơn</span>
                <span className="text-base text-indigo-600">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
