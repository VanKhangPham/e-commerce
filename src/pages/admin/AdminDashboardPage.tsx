import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  DollarSign,
  ShoppingBag,
  Package,
  ArrowUpRight,
  Plus,
  Ticket,
  Eye,
  Clock,
  Users,
  Loader2,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { adminService, orderService } from '@/services'
import type { DashboardStats } from '@/services/adminService'
import type { Order, OrderStatus } from '@/types'
import { formatCurrency, formatDate } from '@/utils'

const statusBadgeMap: Record<OrderStatus, { text: string; bg: string; textCol: string }> = {
  pending: { text: 'Chờ xác nhận', bg: 'bg-amber-50 border-amber-200', textCol: 'text-amber-800' },
  processing: { text: 'Đang đóng gói', bg: 'bg-blue-50 border-blue-200', textCol: 'text-blue-800' },
  shipping: { text: 'Đang vận chuyển', bg: 'bg-indigo-50 border-indigo-200', textCol: 'text-indigo-800' },
  delivered: { text: 'Giao thành công', bg: 'bg-emerald-50 border-emerald-200', textCol: 'text-emerald-800' },
  cancelled: { text: 'Đã hủy đơn', bg: 'bg-rose-50 border-rose-200', textCol: 'text-rose-800' },
}

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      try {
        const [dashboardStats, ordersList] = await Promise.all([
          adminService.getDashboardStats(),
          orderService.getOrders(),
        ])

        setStats(dashboardStats)
        setRecentOrders(ordersList.slice(0, 5))
      } catch (err) {
        console.error('Error loading dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  // Derive values from stats, with fallbacks
  const totalRevenue = stats?.kpis.totalRevenue ?? 0
  const totalOrdersCount = stats?.kpis.totalOrders ?? 0
  const totalProductsCount = stats?.kpis.totalProducts ?? 0
  const totalCustomersCount = stats?.kpis.totalCustomers ?? 0

  const revenueData = stats?.monthlyRevenue ?? []
  const categorySalesData = (stats?.categorySales ?? []).map((c) => ({
    name: c.name,
    sales: c.sales,
  }))
  const topProducts = stats?.topProducts ?? []

  // Count pending orders from the fetched recent orders
  const pendingOrdersCount = recentOrders.filter((o) => o.orderStatus === 'pending').length

  // Find leading category
  const leadingCategory = categorySalesData.length > 0
    ? categorySalesData.reduce((best, c) => (c.sales > best.sales ? c : best), categorySalesData[0])
    : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-sm text-slate-500">Đang tải dữ liệu dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Tổng Quan Điều Hành NOVA
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Chào mừng trở lại! Dưới đây là báo cáo thời gian thực về tình hình kinh doanh của hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/san-pham"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm</span>
          </Link>
          <Link
            to="/admin/ma-giam-gia"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Ticket className="w-4 h-4" />
            <span>Tạo Voucher</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng Doanh Thu
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">
              {formatCurrency(totalRevenue)}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="flex items-center text-emerald-600 font-bold">
                <ArrowUpRight className="w-4 h-4" /> Tổng cộng
              </span>
              <span className="text-slate-400">tất cả đơn thành công</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng Đơn Hàng
            </span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">
              {totalOrdersCount} đơn
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="flex items-center text-emerald-600 font-bold">
                <ArrowUpRight className="w-4 h-4" /> Tất cả
              </span>
              <span className="text-slate-400">đơn hàng trong hệ thống</span>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sản Phẩm Đang Bán
            </span>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">
              {totalProductsCount} thiết bị
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="flex items-center text-sky-600 font-bold">
                <Users className="w-4 h-4" /> {totalCustomersCount}
              </span>
              <span className="text-slate-400">khách hàng đã đăng ký</span>
            </div>
          </div>
        </div>

        {/* Pending Orders Action */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Cần Xử Lý Ngay
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900">
              {pendingOrdersCount} đơn chờ duyệt
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <Link
                to="/admin/don-hang?status=pending"
                className="font-bold text-indigo-600 hover:underline"
              >
                Xử lý giao hàng ngay →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row: Revenue Area Chart + Category Sales Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue Trend Area Chart (8 Columns) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Biểu Đồ Doanh Thu 2026</h2>
              <p className="text-xs text-slate-400">Xu hướng doanh thu bán hàng 12 tháng gần nhất (VNĐ)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
              <span className="text-xs font-bold text-slate-700">Doanh thu thuần</span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(val) => `${val / 1000000}M`}
                  />
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(val: any) => [formatCurrency(Number(val) || 0), 'Doanh thu']}
                    labelFormatter={(lbl) => `Tháng ${lbl}`}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Chưa có dữ liệu doanh thu
              </div>
            )}
          </div>
        </div>

        {/* Right: Sales by Category Bar Chart (4 Columns) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Sản Lượng Theo Ngành</h2>
            <p className="text-xs text-slate-400">Số lượng thiết bị bán ra theo danh mục</p>
          </div>

          <div className="h-60 w-full">
            {categorySalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySalesData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(val: any) => [`${val} sản phẩm`, 'Đã bán']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="sales" fill="#0284c7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                Chưa có dữ liệu danh mục
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              {leadingCategory
                ? <>Ngành dẫn đầu: <strong>{leadingCategory.name} ({leadingCategory.sales} máy)</strong></>
                : 'Chưa có dữ liệu'}
            </span>
            <Link to="/admin/danh-muc" className="text-indigo-600 font-bold hover:underline">
              Chi tiết →
            </Link>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Orders (7 cols) + Top Selling Products (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Đơn Hàng Gần Đây</h2>
              <p className="text-xs text-slate-400">Các giao dịch phát sinh mới nhất trên hệ thống</p>
            </div>
            <Link
              to="/admin/don-hang"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Xem tất cả ({totalOrdersCount}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">Mã đơn</th>
                  <th className="p-3">Khách hàng</th>
                  <th className="p-3">Tổng tiền</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3 rounded-r-xl text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.length > 0 ? (
                  recentOrders.map((ord) => {
                    const badge = statusBadgeMap[ord.orderStatus] || statusBadgeMap.pending

                    return (
                      <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                          #{ord.orderNumber}
                        </td>
                        <td className="p-3 text-slate-700">
                          <p className="font-semibold text-slate-900">{ord.customerName}</p>
                          <span className="text-[10px] text-slate-400">{formatDate(ord.createdAt)}</span>
                        </td>
                        <td className="p-3 font-black text-slate-900 whitespace-nowrap">
                          {formatCurrency(ord.totalAmount)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.textCol}`}
                          >
                            {badge.text}
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <Link
                            to={`/admin/don-hang`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 inline-block transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400">
                      Chưa có đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top-Selling Products */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Sản Phẩm Bán Chạy</h2>
              <p className="text-xs text-slate-400">Top 5 thiết bị đạt lượng bán kỷ lục</p>
            </div>
            <Link
              to="/admin/san-pham"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Xem kho hàng →
            </Link>
          </div>

          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-5 text-center text-xs font-black text-slate-400">
                    #{idx + 1}
                  </span>
                  <img
                    src={p.thumbnail}
                    alt={p.name}
                    className="w-11 h-11 object-contain rounded-xl bg-slate-50 border p-1 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                    <span className="text-[11px] text-slate-400">
                      Kho còn: <strong>{p.stock}</strong> máy
                    </span>
                  </div>
                </div>

                <div className="text-right whitespace-nowrap ml-3">
                  <span className="text-xs font-black text-slate-900 block">
                    {formatCurrency(p.price)}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">
                    Đã bán {p.soldCount}
                  </span>
                </div>
              </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 text-sm">
                Chưa có dữ liệu sản phẩm
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
