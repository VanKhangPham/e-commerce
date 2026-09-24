import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Grid, List, PackageX, ChevronLeft, ChevronRight } from 'lucide-react'
import { productService } from '@/services'
import type { Product, SortOption } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductSkeleton } from '@/components/feedback/ProductSkeleton'

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const sortBy = (searchParams.get('sortBy') as SortOption) || 'newest'
  const page = parseInt(searchParams.get('page') || '1', 10)

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [products, setProducts] = useState<Product[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true)
      try {
        const res = await productService.getProducts({
          search: query,
          sortBy,
          page,
          limit: 12,
        })
        setProducts(res.items)
        setTotalItems(res.totalItems)
        setTotalPages(res.totalPages)
      } catch (err) {
        console.error('Error fetching search results:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (query.trim()) {
      fetchSearchResults()
    } else {
      setProducts([])
      setTotalItems(0)
      setIsLoading(false)
    }
  }, [query, sortBy, page])

  const handleSortChange = (newSort: string) => {
    const next = new URLSearchParams(searchParams)
    next.set('sortBy', newSort)
    next.delete('page')
    setSearchParams(next)
  }

  const handlePageChange = (newPage: number) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(newPage))
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link to="/" className="hover:text-slate-700">Trang chủ</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Tìm kiếm</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
              <Search className="w-6 h-6 text-indigo-600" />
              <span>Kết quả tìm kiếm cho: &quot;{query}&quot;</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Tìm thấy <span className="font-bold text-slate-900">{totalItems}</span> sản phẩm phù hợp
            </p>
          </div>

          {/* Sort & View Mode */}
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-bold text-slate-800 py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="popularity">Bán chạy nhất</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="rating-desc">Đánh giá cao nhất</option>
            </select>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product List Output */}
      {isLoading ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1'}`}>
          <ProductSkeleton count={8} layout={viewMode} />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center my-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <PackageX className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-1">
            Không tìm thấy kết quả nào cho &quot;{query}&quot;
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
            Hãy thử kiểm tra lại chính tả từ khóa hoặc tìm kiếm danh mục chung hơn như &quot;iPhone&quot;, &quot;Sony&quot;, &quot;Laptop&quot;.
          </p>
          <Link
            to="/san-pham"
            className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Khám phá tất cả sản phẩm
          </Link>
        </div>
      ) : (
        <>
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} layout={viewMode} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold ${
                    page === i + 1
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
