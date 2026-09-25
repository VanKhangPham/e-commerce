import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Menu, Bell, Globe, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store'

interface AdminHeaderProps {
  onToggleSidebar: () => void
}

const sectionTitleMap: Record<string, string> = {
  '/admin/dashboard': 'Bảng Điều Khiển Tổng Quan',
  '/admin/san-pham': 'Quản Lý Danh Sách Sản Phẩm',
  '/admin/danh-muc': 'Quản Lý Danh Mục Ngành Hàng',
  '/admin/don-hang': 'Quản Lý Đơn Hàng & Vận Chuyển',
  '/admin/khach-hang': 'Quản Lý Hồ Sơ Khách Hàng',
  '/admin/ma-giam-gia': 'Quản Lý Mã Giảm Giá & Ưu Đãi',
  '/admin/danh-gia': 'Kiểm Duyệt Bình Luận & Đánh Giá',
  '/admin/cai-dat': 'Cài Đặt Cửa Hàng & Cấu Hình Hệ Thống',
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const location = useLocation()
  const { currentUser } = useAuthStore()
  const [showNotifications, setShowNotifications] = useState(false)

  const currentTitle =
    sectionTitleMap[location.pathname] || 'Trang Quản Trị Hệ Thống NOVA'

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Mở menu quản trị"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="hidden sm:inline font-semibold text-slate-400">Admin</span>
          <ChevronRight className="hidden sm:inline w-3 h-3 text-slate-300" />
          <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Right: Quick actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick link to storefront */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
          title="Mở website bán hàng trong tab mới"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Vào Cửa Hàng</span>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Thông báo"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Thông báo mới</span>
                <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer">
                  Đã đọc tất cả
                </span>
              </div>
              <div className="divide-y divide-slate-50 py-1 text-xs">
                <div className="py-2">
                  <p className="font-semibold text-slate-800">Đơn hàng mới #NOVA-20260922-3329</p>
                  <p className="text-[11px] text-slate-400">Khách hàng Lê Hoàng Nam vừa đặt hàng 4.370.000₫</p>
                  <span className="text-[10px] text-slate-400">10 phút trước</span>
                </div>
                <div className="py-2">
                  <p className="font-semibold text-slate-800">Đánh giá mới chờ duyệt</p>
                  <p className="text-[11px] text-slate-400">Phạm Văn Khang đánh giá 5 sao cho iPhone 16 Pro Max</p>
                  <span className="text-[10px] text-slate-400">1 giờ trước</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User preview */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={
              currentUser?.avatar ||
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
            }
            alt={currentUser?.name || 'Admin'}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-600/20"
          />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {currentUser?.name || 'Quản trị viên'}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Đang trực tuyến
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
