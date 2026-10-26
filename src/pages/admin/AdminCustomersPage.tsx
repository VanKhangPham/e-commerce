import React, { useState, useEffect } from 'react'
import {
  Search,
  Eye,
  Lock,
  Unlock,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { mockUsers } from '@/data'
import { orderService } from '@/services'
import type { UserProfile, Order } from '@/types'
import { formatCurrency, formatDate } from '@/utils'
import { useToastStore } from '@/store'

interface ManagedCustomer extends UserProfile {
  isBlocked?: boolean
  totalSpent?: number
  totalOrders?: number
}

export const AdminCustomersPage: React.FC = () => {
  const { showToast } = useToastStore()

  const [customers, setCustomers] = useState<ManagedCustomer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Customer Detail Modal
  const [selectedCustomer, setSelectedCustomer] = useState<ManagedCustomer | null>(null)

  useEffect(() => {
    const loadCustomerData = async () => {
      setIsLoading(true)
      try {
        const storedUsersStr = localStorage.getItem('nova_users_accounts')
        const allUsers: UserProfile[] = storedUsersStr ? JSON.parse(storedUsersStr) : mockUsers
        const allOrders = await orderService.getOrders()
        setOrders(allOrders)

        // Only show users with role 'user'
        const customerList: ManagedCustomer[] = allUsers
          .filter((u) => u.role === 'user')
          .map((u) => {
            const userOrders = allOrders.filter((o) => o.customerId === u.id)
            const totalSpent = userOrders.reduce((sum, o) => sum + (o.orderStatus !== 'cancelled' ? o.totalAmount : 0), 0)
            return {
              ...u,
              isBlocked: false,
              totalOrders: userOrders.length,
              totalSpent,
            }
          })

        setCustomers(customerList)
      } catch (err) {
        console.error('Error fetching customers:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomerData()
  }, [])

  // Toggle Lock / Unlock
  const handleToggleBlock = (id: string, name: string, currentBlocked: boolean) => {
    const actionText = currentBlocked ? 'mở khóa' : 'tạm khóa'
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản của "${name}"?`)) return

    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isBlocked: !currentBlocked } : c))
    )

    if (selectedCustomer?.id === id) {
      setSelectedCustomer((prev) => prev ? { ...prev, isBlocked: !currentBlocked } : null)
    }

    showToast(
      currentBlocked
        ? `Đã mở khóa tài khoản "${name}" thành công!`
        : `Đã tạm khóa tài khoản "${name}"!`,
      currentBlocked ? 'success' : 'warning'
    )
  }

  // Filter
  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q))

    let matchesStatus = true
    if (statusFilter === 'active') matchesStatus = !c.isBlocked
    if (statusFilter === 'blocked') matchesStatus = !!c.isBlocked

    return matchesQuery && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const customerOrders = selectedCustomer
    ? orders.filter((o) => o.customerId === selectedCustomer.id)
    : []

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Quản Lý Khách Hàng Thành Viên
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Xem thông tin khách hàng, lịch sử mua hàng tích lũy và kiểm soát trạng thái tài khoản
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Tìm theo tên, email, số điện thoại..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any)
              setCurrentPage(1)
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="blocked">Đang bị khóa</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Liên hệ</th>
                <th className="p-4">Ngày đăng ký</th>
                <th className="p-4">Đơn hàng</th>
                <th className="p-4">Tổng chi tiêu</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Không tìm thấy khách hàng nào.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            cust.avatar ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'
                          }
                          alt={cust.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{cust.name}</p>
                          <span className="text-[10px] text-indigo-600 font-semibold">
                            Thành Viên VIP
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600 whitespace-nowrap">
                      <p className="font-semibold text-slate-800">{cust.email}</p>
                      <span className="text-[11px] text-slate-400">{cust.phone || 'Chưa cập nhật'}</span>
                    </td>

                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {formatDate(cust.createdAt)}
                    </td>

                    <td className="p-4 font-bold text-slate-700 whitespace-nowrap">
                      {cust.totalOrders || 0} đơn
                    </td>

                    <td className="p-4 font-black text-slate-900 whitespace-nowrap">
                      {formatCurrency(cust.totalSpent || 0)}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {cust.isBlocked ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Đã khóa
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Hoạt động
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Xem hồ sơ & Lịch sử đơn"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleBlock(cust.id, cust.name, !!cust.isBlocked)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            cust.isBlocked
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title={cust.isBlocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                        >
                          {cust.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} trên tổng{' '}
              {filteredCustomers.length} khách hàng
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

      {/* Customer Detail Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedCustomer(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Hồ Sơ Chi Tiết Khách Hàng
              </h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Banner */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img
                src={
                  selectedCustomer.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'
                }
                alt={selectedCustomer.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
              <div className="flex-1 space-y-1 text-xs">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-base font-black text-slate-900">{selectedCustomer.name}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedCustomer.isBlocked
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {selectedCustomer.isBlocked ? 'Đang bị khóa' : 'Đang hoạt động'}
                  </span>
                </div>
                <p className="text-slate-500">{selectedCustomer.email} • {selectedCustomer.phone || 'Chưa có SĐT'}</p>
                <p className="text-[11px] text-slate-400">
                  Ngày tham gia: {formatDate(selectedCustomer.createdAt, true)}
                </p>
              </div>

              <button
                onClick={() =>
                  handleToggleBlock(
                    selectedCustomer.id,
                    selectedCustomer.name,
                    !!selectedCustomer.isBlocked
                  )
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  selectedCustomer.isBlocked
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
              >
                {selectedCustomer.isBlocked ? 'Mở Khóa Tài Khoản' : 'Khóa Tài Khoản'}
              </button>
            </div>

            {/* Metric Totals */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                <span className="text-[10px] font-bold text-indigo-700 uppercase">
                  Tổng đơn hàng đã đặt
                </span>
                <span className="text-lg font-black text-slate-900 block mt-0.5">
                  {customerOrders.length} đơn
                </span>
              </div>
              <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">
                  Tổng giá trị mua sắm
                </span>
                <span className="text-lg font-black text-emerald-800 block mt-0.5">
                  {formatCurrency(selectedCustomer.totalSpent || 0)}
                </span>
              </div>
            </div>

            {/* Customer Order History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                Lịch sử mua sắm gần đây
              </h4>
              {customerOrders.length === 0 ? (
                <p className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                  Khách hàng chưa phát sinh đơn hàng nào.
                </p>
              ) : (
                <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
                  {customerOrders.map((ord) => (
                    <div key={ord.id} className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDate(ord.createdAt)} • {ord.items.length} món
                        </span>
                      </div>
                      <span className="font-black text-slate-900">
                        {formatCurrency(ord.totalAmount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
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
