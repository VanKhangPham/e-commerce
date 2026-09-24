import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  User,
  Package,
  MapPin,
  Heart,
  KeyRound,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { useAuthStore, useWishlistStore, useToastStore } from '@/store'
import { ProfileTab } from './ProfileTab'
import { OrdersTab } from './OrdersTab'
import { AddressesTab } from './AddressesTab'
import { WishlistTab } from './WishlistTab'
import { ChangePasswordTab } from './ChangePasswordTab'

export const AccountDashboard: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout } = useAuthStore()
  const { wishlistIds } = useWishlistStore()
  const { showToast } = useToastStore()

  // Determine active tab from pathname
  const path = location.pathname
  let activeTab: 'profile' | 'orders' | 'addresses' | 'wishlist' | 'password' = 'profile'

  if (path.includes('/don-hang')) {
    activeTab = 'orders'
  } else if (path.includes('/so-dia-chi')) {
    activeTab = 'addresses'
  } else if (path.includes('/yeu-thich')) {
    activeTab = 'wishlist'
  } else if (path.includes('/doi-mat-khau')) {
    activeTab = 'password'
  }

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?')) {
      logout()
      showToast('Đã đăng xuất tài khoản thành công', 'info')
      navigate('/')
    }
  }

  const navItems = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      path: '/tai-khoan',
      icon: User,
    },
    {
      key: 'orders',
      label: 'Lịch sử đơn hàng',
      path: '/tai-khoan/don-hang',
      icon: Package,
    },
    {
      key: 'addresses',
      label: 'Sổ địa chỉ nhận hàng',
      path: '/tai-khoan/so-dia-chi',
      icon: MapPin,
      badge: currentUser?.addresses?.length,
    },
    {
      key: 'wishlist',
      label: 'Sản phẩm yêu thích',
      path: '/tai-khoan/yeu-thich',
      icon: Heart,
      badge: wishlistIds.length,
    },
    {
      key: 'password',
      label: 'Đổi mật khẩu',
      path: '/tai-khoan/doi-mat-khau',
      icon: KeyRound,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link to="/" className="hover:text-slate-700">Trang chủ</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Tài khoản của tôi</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Account Navigation Sidebar */}
        <aside className="lg:col-span-4 space-y-4 sticky top-24">
          {/* User Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs text-center space-y-3">
            <div className="relative inline-block mx-auto">
              <img
                src={
                  currentUser?.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
                }
                alt={currentUser?.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-50 shadow-md mx-auto"
              />
              <span className="absolute bottom-0 right-0 p-1 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div>
              <h1 className="text-base font-black text-slate-900">{currentUser?.name}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser?.email}</p>
              <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Khách Hàng Thân Thiết VIP</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-3 shadow-xs space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.key

              return (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight
                      className={`w-3.5 h-3.5 ${
                        isActive ? 'text-white/60' : 'text-slate-300'
                      }`}
                    />
                  </div>
                </Link>
              )
            })}

            {/* Logout button */}
            <div className="pt-2 border-t border-slate-100 mt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Đăng xuất tài khoản</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-rose-300" />
              </button>
            </div>
          </div>
        </aside>

        {/* Right Column: Tab Content */}
        <main className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs min-h-[500px]">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'addresses' && <AddressesTab />}
          {activeTab === 'wishlist' && <WishlistTab />}
          {activeTab === 'password' && <ChangePasswordTab />}
        </main>
      </div>
    </div>
  )
}
