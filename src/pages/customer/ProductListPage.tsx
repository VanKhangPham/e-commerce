import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import {
  Grid,
  List,
  Filter,
  X,
  RotateCcw,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  PackageX,
} from 'lucide-react'
import { productService } from '@/services'
import type { Category, FilterParams, Product, SortOption } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductSkeleton } from '@/components/feedback/ProductSkeleton'
import { formatCurrency } from '@/utils'

export const ProductListPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>()
  const [searchParams, setSearchParams] = useSearchParams()

  // Layout View mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Data states
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Filter & Sort states from URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentSort = (searchParams.get('sortBy') as SortOption) || 'newest'
  const brandParam = searchParams.get('brand') || ''
  const minPriceParam = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : undefined
  const maxPriceParam = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : undefined
  const ratingParam = searchParams.get('rating') ? parseInt(searchParams.get('rating')!, 10) : undefined
  const inStockParam = searchParams.get('inStock') === 'true'
  const isSaleParam = searchParams.get('filter') === 'sale'

  // Available brands
  const brandList = ['Apple', 'Samsung', 'Sony', 'Dell', 'Anker', 'Keychron', 'Logitech', 'Sonos', 'Marshall', 'ASUS', 'Garmin', 'Shargeek']

  // Price presets
  const pricePresets = [
    { label: 'Tất cả mức giá', min: undefined, max: undefined },
    { label: 'Dưới 2.000.000₫', min: 0, max: 2000000 },
    { label: 'Từ 2 - 10 triệu', min: 2000000, max: 10000000 },
    { label: 'Từ 10 - 25 triệu', min: 10000000, max: 25000000 },
    { label: 'Trên 25 triệu', min: 25000000, max: undefined },
  ]

  // Custom price input local state
  const [customMin, setCustomMin] = useState<string>(minPriceParam ? String(minPriceParam) : '')
  const [customMax, setCustomMax] = useState<string>(maxPriceParam ? String(maxPriceParam) : '')

  // Load categories
  useEffect(() => {
    productService.getCategories().then((res) => {
      setCategories(res)
      if (slug) {
        const found = res.find((c) => c.slug === slug)
        setCurrentCategory(found || null)
      } else {
        setCurrentCategory(null)
      }
    })
  }, [slug])

  // Load products based on filter changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const params: FilterParams = {
          categorySlug: slug,
          brand: brandParam || undefined,
          minPrice: minPriceParam,
          maxPrice: maxPriceParam,
          rating: ratingParam,
          inStockOnly: inStockParam || undefined,
          sortBy: currentSort,
          page: currentPage,
          limit: 12,
        }

        const res = await productService.getProducts(params)
        let filteredItems = res.items
        if (isSaleParam) {
          filteredItems = filteredItems.filter((p) => p.discountPercentage > 0 || p.isFlashSale)
        }
        setProducts(filteredItems)
        setTotalItems(isSaleParam ? filteredItems.length : res.totalItems)
        setTotalPages(res.totalPages)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [slug, brandParam, minPriceParam, maxPriceParam, ratingParam, inStockParam, currentSort, currentPage, isSaleParam])

  // Helper to update query params
  const updateQueryParam = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '') {
        nextParams.delete(key)
      } else {
        nextParams.set(key, val)
      }
    })
    // Reset to page 1 on filter change if not specifically updating page
    if (!updates.page) {
      nextParams.delete('page')
    }
    setSearchParams(nextParams)
  }

  const handleResetFilters = () => {
    setCustomMin('')
    setCustomMax('')
    const nextParams = new URLSearchParams()
    if (searchParams.get('sortBy')) {
      nextParams.set('sortBy', searchParams.get('sortBy')!)
    }
    setSearchParams(nextParams)
  }

  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault()
    const minVal = customMin ? parseInt(customMin, 10) : null
    const maxVal = customMax ? parseInt(customMax, 10) : null
    updateQueryParam({
      minPrice: minVal ? String(minVal) : null,
      maxPrice: maxVal ? String(maxVal) : null,
    })
  }

  const activeFilterCount = [
    brandParam,
    minPriceParam,
    maxPriceParam,
    ratingParam,
    inStockParam,
    isSaleParam,
  ].filter(Boolean).length

  // Render Filters Block (reused in desktop sidebar and mobile modal)
  const renderFilterControls = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
          Danh Mục
        </h4>
        <div className="space-y-1.5">
          <Link
            to="/san-pham"
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              !slug
                ? 'bg-slate-900 text-white font-bold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span>Tất cả danh mục</span>
            <span className="text-[10px] opacity-80">
              {categories.reduce((acc, c) => acc + c.productCount, 0)}
            </span>
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/danh-muc/${cat.slug}`}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                slug === cat.slug
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-80">{cat.productCount}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
          Thương Hiệu
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {brandList.map((brand) => {
            const isChecked = brandParam.toLowerCase() === brand.toLowerCase()
            return (
              <label
                key={brand}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => updateQueryParam({ brand: isChecked ? null : brand })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
                />
                <span className={isChecked ? 'font-bold text-indigo-600' : ''}>{brand}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Price Presets */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
          Khoảng Giá
        </h4>
        <div className="space-y-1">
          {pricePresets.map((preset, idx) => {
            const isSelected =
              minPriceParam === preset.min && maxPriceParam === preset.max
            return (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  updateQueryParam({
                    minPrice: preset.min !== undefined ? String(preset.min) : null,
                    maxPrice: preset.max !== undefined ? String(preset.max) : null,
                  })
                }
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {preset.label}
              </button>
            )
          })}
        </div>

        {/* Custom Price Range */}
        <form onSubmit={handleApplyCustomPrice} className="mt-3 pt-3 border-t border-slate-100 space-y-2">
          <p className="text-[11px] text-slate-400 font-medium">Hoặc nhập khoảng giá (VNĐ):</p>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={customMin}
              onChange={(e) => setCustomMin(e.target.value)}
              placeholder="Từ"
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="number"
              value={customMax}
              onChange={(e) => setCustomMax(e.target.value)}
              placeholder="Đến"
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
          >
            Áp dụng giá
          </button>
        </form>
      </div>

      {/* Rating Filter */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
          Đánh Giá
        </h4>
        <div className="space-y-1">
          {[5, 4, 3].map((stars) => {
            const isSelected = ratingParam === stars
            return (
              <button
                key={stars}
                type="button"
                onClick={() => updateQueryParam({ rating: isSelected ? null : String(stars) })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                  isSelected ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < stars ? 'fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-slate-700 text-xs ml-1.5">
                    {stars === 5 ? '5 sao' : `Từ ${stars} sao`}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* In Stock & Sale Checkboxes */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
          <input
            type="checkbox"
            checked={inStockParam}
            onChange={() => updateQueryParam({ inStock: inStockParam ? null : 'true' })}
            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
          />
          <span>Chỉ xem sản phẩm còn hàng</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
          <input
            type="checkbox"
            checked={isSaleParam}
            onChange={() => updateQueryParam({ filter: isSaleParam ? null : 'sale' })}
            className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 border-slate-300"
          />
          <span className="text-rose-600 font-bold">Chỉ sản phẩm đang giảm giá</span>
        </label>
      </div>

      {/* Reset Filter Button */}
      {activeFilterCount > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleResetFilters}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa tất cả bộ lọc ({activeFilterCount})</span>
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Page Header / Breadcrumbs */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link to="/" className="hover:text-slate-700">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to="/san-pham" className="hover:text-slate-700">
            Sản phẩm
          </Link>
          {currentCategory && (
            <>
              <span>/</span>
              <span className="text-slate-900 font-semibold">{currentCategory.name}</span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {currentCategory ? currentCategory.name : isSaleParam ? 'Sản Phẩm Đang Khuyến Mãi' : 'Tất Cả Sản Phẩm'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {currentCategory
                ? currentCategory.description
                : 'Khám phá thế giới công nghệ đẳng cấp với đa dạng mẫu mã và bảo hành chính hãng.'}
            </p>
          </div>

          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
            Hiển thị <span className="font-bold text-slate-800">{products.length}</span> trên{' '}
            <span className="font-bold text-slate-800">{totalItems}</span> sản phẩm
          </span>
        </div>
      </div>

      {/* Control Bar: Mobile Filter Button, Sorting, View Toggle */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 mb-6">
        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Bộ lọc {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
        </button>

        {/* Desktop Active Filters Chips */}
        <div className="hidden lg:flex items-center gap-2 flex-1 overflow-x-auto py-1">
          {brandParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium">
              Hãng: <span className="font-bold">{brandParam}</span>
              <button onClick={() => updateQueryParam({ brand: null })}>
                <X className="w-3.5 h-3.5 text-slate-500 hover:text-slate-800" />
              </button>
            </span>
          )}
          {(minPriceParam || maxPriceParam) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium">
              Giá:{' '}
              <span className="font-bold">
                {minPriceParam ? formatCurrency(minPriceParam) : '0₫'} -{' '}
                {maxPriceParam ? formatCurrency(maxPriceParam) : 'Tối đa'}
              </span>
              <button onClick={() => updateQueryParam({ minPrice: null, maxPrice: null })}>
                <X className="w-3.5 h-3.5 text-slate-500 hover:text-slate-800" />
              </button>
            </span>
          )}
          {ratingParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium">
              Từ {ratingParam} sao
              <button onClick={() => updateQueryParam({ rating: null })}>
                <X className="w-3.5 h-3.5 text-slate-500 hover:text-slate-800" />
              </button>
            </span>
          )}
          {inStockParam && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium">
              Còn hàng
              <button onClick={() => updateQueryParam({ inStock: null })}>
                <X className="w-3.5 h-3.5 text-slate-500 hover:text-slate-800" />
              </button>
            </span>
          )}
          {activeFilterCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-rose-600 hover:underline whitespace-nowrap ml-2"
            >
              Đặt lại
            </button>
          )}
        </div>

        {/* Right: Sorting & View Toggle */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-slate-500 font-medium">Sắp xếp:</span>
            <div className="relative">
              <select
                value={currentSort}
                onChange={(e) => updateQueryParam({ sortBy: e.target.value as SortOption })}
                className="appearance-none bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="popularity">Bán chạy nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="rating-desc">Đánh giá cao nhất</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Grid / List Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Xem dạng lưới"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Xem dạng danh sách"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products Output */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-800" />
                <h3 className="text-sm font-bold text-slate-900">Bộ Lọc Tìm Kiếm</h3>
              </div>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                  {activeFilterCount}
                </span>
              )}
            </div>

            {renderFilterControls()}
          </div>
        </aside>

        {/* Product Cards Grid Area */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div
              className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'
              }`}
            >
              <ProductSkeleton count={6} layout={viewMode} />
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Không tìm thấy sản phẩm phù hợp
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Rất tiếc, không có sản phẩm nào thỏa mãn các tiêu chí lọc hiện tại của bạn. Vui lòng thử xóa bộ lọc hoặc tìm kiếm sản phẩm khác.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
              >
                Đặt lại tất cả bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-4 sm:gap-6 ${
                  viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'
                }`}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} layout={viewMode} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateQueryParam({ page: String(currentPage - 1) })}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Trang trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1
                    const isActive = pageNum === currentPage
                    return (
                      <button
                        key={pageNum}
                        onClick={() => updateQueryParam({ page: String(pageNum) })}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => updateQueryParam({ page: String(currentPage + 1) })}
                    disabled={currentPage >= totalPages}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Trang sau"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-900" />
                <h3 className="text-sm font-bold text-slate-900">Bộ Lọc Sản Phẩm</h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filters */}
            <div className="flex-1 overflow-y-auto p-4">
              {renderFilterControls()}
            </div>

            {/* Apply Button */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-md"
              >
                Xem kết quả ({products.length} sản phẩm)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
