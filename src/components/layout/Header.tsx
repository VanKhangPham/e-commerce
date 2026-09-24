import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  ChevronDown,
  Phone,
  ShieldCheck,
  Truck,
  Sparkles,
  LogOut,
  Package,
  Settings,
  LayoutDashboard,
} from 'lucide-react'
import { useAuthStore, useCartStore, useWishlistStore, useToastStore } from '@/store'
import { productService } from '@/services'
import type { Category, Product } from '@/types'
import { formatCurrency } from '@/utils'

interface HeaderProps {
  onOpenMobileMenu: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, isAuthenticated, logout } = useAuthStore()
  const { getItemCount, openCartDrawer } = useCartStore()
  const { wishlistIds } = useWishlistStore()
  const { showToast } = useToastStore()

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Categories for dropdown
  const [categories, setCategories] = useState<Category[]>([])
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const cartCount = getItemCount()
  const wishlistCount = wishlistIds.length

  useEffect(() => {
    productService.getCategories().then((res) => setCategories(res))
  }, [])

  // Close dropdowns on route change
  useEffect(() => {
    setShowSearchDropdown(false)
    setIsCategoryMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [location.pathname])

  // Handle live search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true)
        const res = await productService.getProducts({ search: searchQuery.trim(), limit: 5 })
        setSearchResults(res.items)
        setIsSearching(false)
        setShowSearchDropdown(true)
      } else {
        setSearchResults([])
        setShowSearchDropdown(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSearchDropdown(false)
      navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
    showToast('Đã đăng xuất tài khoản thành công', 'info')
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-200 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 overflow-hidden">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <Truck className="w-3.5 h-3.5" />
              <span>Miễn phí vận chuyển toàn quốc cho đơn từ 2.000.000₫</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>100% Chính hãng bảo hành 12 tháng</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a
              href="tel:19008899"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span className="font-semibold text-slate-200">Hotline: 1900 8899</span>
            </a>
            <span className="hidden sm:inline text-slate-700">|</span>
            <Link
              to="/chinh-sach/tra-cuu"
              className="hidden sm:inline hover:text-white transition-colors"
            >
              Tra cứu đơn hàng
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Mở menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xl tracking-tight shadow-md group-hover:scale-105 transition-transform duration-300">
              N
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                NOVA
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Commerce
              </span>
            </div>
          </Link>

          {/* Search Bar with Live Suggestions */}
          <div ref={searchRef} className="relative flex-1 max-w-xl mx-2 hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchDropdown(true)
                }}
                placeholder="Tìm kiếm điện thoại, laptop, tai nghe Sony, phụ kiện..."
                className="w-full pl-11 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-full hover:bg-slate-800 transition-colors"
              >
                Tìm kiếm
              </button>
            </form>

            {/* Live Suggestions Dropdown */}
            {showSearchDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Gợi ý sản phẩm phù hợp</span>
                  {isSearching && <span className="text-indigo-600 animate-pulse">Đang tìm...</span>}
                </div>
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/san-pham/${product.slug}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-3.5 p-3 hover:bg-slate-50 transition-colors group"
                      >
                        <img
                          src={product.thumbnail}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-100 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-bold text-slate-900">
                              {formatCurrency(product.price)}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-xs text-slate-400 line-through">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                    <div className="p-2.5 bg-slate-50 text-center">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        Xem tất cả kết quả cho &quot;{searchQuery}&quot; &rarr;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
                    Không tìm thấy sản phẩm nào khớp với &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Wishlist Icon */}
            <Link
              to="/yeu-thich"
              className="relative p-2.5 rounded-full text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors group"
              title="Danh sách yêu thích"
            >
              <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon & Drawer Trigger */}
            <button
              onClick={openCartDrawer}
              className="relative p-2.5 rounded-full text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors group"
              title="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-slate-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account Menu */}
            <div ref={userMenuRef} className="relative">
              {isAuthenticated && currentUser ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <img
                    src={
                      currentUser.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
                    }
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <span className="hidden md:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/dang-nhap"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Đăng nhập</span>
                  </Link>
                  <Link
                    to="/dang-ky"
                    className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm hover:shadow"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && isAuthenticated && currentUser && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs text-slate-400 font-medium">Đã đăng nhập với tư cách</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    <div className="mt-1.5">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                        {currentUser.role === 'admin' ? 'Quản trị viên' : 'Khách hàng thân thiết'}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    {currentUser.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Trang Quản Trị Admin</span>
                      </Link>
                    )}
                    <Link
                      to="/tai-khoan"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Thông tin tài khoản</span>
                    </Link>
                    <Link
                      to="/tai-khoan/don-hang"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>Lịch sử đơn hàng</span>
                    </Link>
                    <Link
                      to="/tai-khoan/so-dia-chi"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Sổ địa chỉ nhận hàng</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 h-12 border-t border-slate-100 text-sm font-semibold text-slate-600">
          <Link
            to="/"
            className={`hover:text-slate-900 transition-colors ${
              location.pathname === '/' ? 'text-slate-900 font-bold' : ''
            }`}
          >
            Trang chủ
          </Link>

          {/* Categories Mega Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsCategoryMenuOpen(true)}
            onMouseLeave={() => setIsCategoryMenuOpen(false)}
          >
            <Link
              to="/san-pham"
              className={`flex items-center gap-1 hover:text-slate-900 transition-colors ${
                location.pathname.startsWith('/san-pham') ? 'text-slate-900 font-bold' : ''
              }`}
            >
              <span>Tất cả sản phẩm</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </Link>

            {isCategoryMenuOpen && (
              <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/danh-muc/${cat.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-colors text-xs font-semibold"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded-full bg-slate-100">
                      {cat.productCount}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/san-pham?filter=sale"
            className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Khuyến mãi sốc</span>
          </Link>

          <Link
            to="/tin-tuc"
            className={`hover:text-slate-900 transition-colors ${
              location.pathname.startsWith('/tin-tuc') ? 'text-slate-900 font-bold' : ''
            }`}
          >
            Tin tức & Công nghệ
          </Link>

          <Link
            to="/gioi-thieu"
            className={`hover:text-slate-900 transition-colors ${
              location.pathname === '/gioi-thieu' ? 'text-slate-900 font-bold' : ''
            }`}
          >
            Về chúng tôi
          </Link>

          <Link
            to="/lien-he"
            className={`hover:text-slate-900 transition-colors ${
              location.pathname === '/lien-he' ? 'text-slate-900 font-bold' : ''
            }`}
          >
            Liên hệ
          </Link>

          <div className="ml-auto text-xs text-slate-400 font-medium">
            Hỗ trợ khách hàng: <span className="font-bold text-slate-700">support@nova.vn</span>
          </div>
        </nav>
      </div>
    </header>
  )
}
