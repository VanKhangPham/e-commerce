import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User, Package, MapPin, KeyRound, LogOut } from 'lucide-react'
import { useAuthStore, useToastStore } from '@/store'

export const AccountDashboard: React.FC = () => {
  const { currentUser, logout } = useAuthStore()
  const { showToast } = useToastStore()
  const location = useLocation()

  const tabs = [
    { name: 'Hồ sơ cá nhân', path: '/tai-khoan', icon: User },
    { name: 'Lịch sử đơn hàng', path: '/tai-khoan/don-hang', icon: Package },
    { name: 'Sổ địa chỉ', path: '/tai-khoan/so-dia-chi', icon: MapPin },
    { name: 'Đổi mật khẩu', path: '/tai-khoan/doi-mat-khau', icon: KeyRound },
  ]

  const handleLogout = () => {
    logout()
    showToast('Đã đăng xuất tài khoản', 'info')
  }

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Account Sidebar Navigation */}
        <aside className="space-y-2">
          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs mb-4 flex items-center gap-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'}
              alt={currentUser?.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-50"
            />
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 truncate">{currentUser?.name}</h2>
              <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-2 shadow-xs space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = location.pathname === tab.path
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
            <h1 className="text-lg font-bold text-slate-900 mb-2">Quản Lý Tài Khoản</h1>
            <p className="text-xs text-slate-500 mb-6">
              Xem và cập nhật thông tin cá nhân, địa chỉ nhận hàng và theo dõi đơn mua (Sẽ hoàn thiện chi tiết tại Bước 4.e).
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600">
              Chào mừng bạn đến với trang quản lý tài khoản cá nhân.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
