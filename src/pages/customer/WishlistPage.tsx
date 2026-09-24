import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2, ArrowRight } from 'lucide-react'
import { useWishlistStore, useToastStore } from '@/store'
import { productService } from '@/services'
import type { Product } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductSkeleton } from '@/components/feedback/ProductSkeleton'

export const WishlistPage: React.FC = () => {
  const { wishlistIds, clearWishlist } = useWishlistStore()
  const { showToast } = useToastStore()

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadWishlistProducts = async () => {
      setIsLoading(true)
      try {
        const allRes = await productService.getProducts({ limit: 50 })
        const filtered = allRes.items.filter((p) => wishlistIds.includes(p.id))
        setProducts(filtered)
      } catch (err) {
        console.error('Error loading wishlist products:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadWishlistProducts()
  }, [wishlistIds])

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm yêu thích?')) {
      clearWishlist()
      showToast('Đã xóa toàn bộ sản phẩm khỏi danh sách yêu thích', 'info')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link to="/" className="hover:text-slate-700">Trang chủ</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Sản phẩm yêu thích ({wishlistIds.length})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Danh Sách Sản Phẩm Yêu Thích</span>
          </h1>
        </div>

        {products.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa tất cả</span>
          </button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <ProductSkeleton count={4} />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center my-8">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-1">
            Chưa có sản phẩm nào trong danh sách yêu thích
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
            Hãy bấm vào biểu tượng trái tim trên các sản phẩm bạn quan tâm để lưu lại và theo dõi giá bất cứ lúc nào.
          </p>
          <Link
            to="/san-pham"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span>Khám phá sản phẩm ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
