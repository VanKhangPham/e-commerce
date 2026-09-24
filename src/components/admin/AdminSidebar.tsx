import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Settings,
  ExternalLink,
  LogOut,
  X,
} from 'lucide-react'
import { useAuthStore, useToastStore } from '@/store'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  name: string
  path: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { name: 'Tổng quan (Dashboard)', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Quản lý sản phẩm', path: '/admin/san-pham', icon: Package },
  { name: 'Quản lý danh mục', path: '/admin/danh-muc', icon: Layers },
  { name: 'Quản lý đơn hàng', path: '/admin/don-hang', icon: ShoppingBag },
  { name: 'Quản lý khách hàng', path: '/admin/khach-hang', icon: Users },
  { name: 'Mã giảm giá (Coupons)', path: '/admin/ma-giam-gia', icon: Tag },
  { name: 'Quản lý đánh giá', path: '/admin/danh-gia', icon: Star },
  { name: 'Cài đặt hệ thống', path: '/admin/cai-dat', icon: Settings },
]

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout } = useAuthStore()
  const { showToast } = useToastStore()

  const handleLogout = () => {
    logout()
    showToast('Đã đăng xuất khỏi tài khoản Quản trị', 'info')
    navigate('/admin/dang-nhap')
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
              N
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-white tracking-tight leading-tight">
                NOVA Admin
              </span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                Management Portal
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Điều hành & Nghiệp vụ
          </p>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path))

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Bottom Store Link & User Profile */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
          {/* Quick link to live store */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Xem website bán hàng</span>
            </span>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
              Khách hàng
            </span>
          </Link>

          {/* Admin user card */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={
                  currentUser?.avatar ||
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
                }
                alt="Admin avatar"
                className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {currentUser?.name || 'Ban Quản Trị'}
                </p>
                <p className="text-[10px] text-indigo-400 font-medium truncate">Quản trị viên</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Đăng xuất Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
