import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  X,
  Search,
  ChevronRight,
  User,
  ShoppingBag,
  Heart,
  Phone,
  Sparkles,
  LogOut,
  Package,
  LayoutDashboard,
} from 'lucide-react'
import { useAuthStore, useCartStore, useWishlistStore, useToastStore } from '@/store'
import { productService } from '@/services'
import type { Category } from '@/types'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { currentUser, isAuthenticated, logout } = useAuthStore()
  const { getItemCount } = useCartStore()
  const { wishlistIds } = useWishlistStore()
  const { showToast } = useToastStore()

  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    productService.getCategories().then((res) => setCategories(res))
  }, [])

  if (!isOpen) return null

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onClose()
      navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
    showToast('Đã đăng xuất thành công', 'info')
    onClose()
    navigate('/')
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl flex flex-col z-10">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-base">
              N
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">NOVA</span>
          </Link>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="p-4 border-b border-slate-100">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/yeu-thich"
              onClick={onClose}
              className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Yêu thích ({wishlistIds.length})</span>
            </Link>
            <Link
              to="/gio-hang"
              onClick={onClose}
              className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-indigo-500" />
              <span>Giỏ hàng ({getItemCount()})</span>
            </Link>
          </div>

          {/* Categories */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Danh mục nổi bật
            </p>
            <div className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/danh-muc/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Site Navigation */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Trang thông tin
            </p>
            <div className="space-y-1">
              <Link
                to="/san-pham"
                onClick={onClose}
                className="block p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                Tất cả sản phẩm
              </Link>
              <Link
                to="/san-pham?filter=sale"
                onClick={onClose}
                className="flex items-center gap-1.5 p-2.5 rounded-xl hover:bg-rose-50 text-xs font-bold text-rose-600"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Khuyến mãi đặc biệt</span>
              </Link>
              <Link
                to="/tin-tuc"
                onClick={onClose}
                className="block p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                Tin tức & Xu hướng
              </Link>
              <Link
                to="/gioi-thieu"
                onClick={onClose}
                className="block p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                Về chúng tôi
              </Link>
              <Link
                to="/lien-he"
                onClick={onClose}
                className="block p-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                Liên hệ hỗ trợ
              </Link>
            </div>
          </div>
        </div>

        {/* User Account / Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          {isAuthenticated && currentUser ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    currentUser.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
                  }
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-white shadow-sm"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {currentUser.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={onClose}
                    className="col-span-2 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Trang Quản Trị</span>
                  </Link>
                )}
                <Link
                  to="/tai-khoan"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Tài khoản</span>
                </Link>
                <Link
                  to="/tai-khoan/don-hang"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Đơn mua</span>
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/dang-nhap"
                onClick={onClose}
                className="w-full flex items-center justify-center py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Đăng nhập
              </Link>
              <Link
                to="/dang-ky"
                onClick={onClose}
                className="w-full flex items-center justify-center py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-bold"
              >
                Đăng ký tài khoản
              </Link>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Hotline hỗ trợ:</span>
            <a href="tel:19008899" className="font-bold text-slate-900 flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-500" />
              <span>1900 8899</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
