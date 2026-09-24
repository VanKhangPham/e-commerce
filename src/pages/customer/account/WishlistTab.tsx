import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2, ArrowRight } from 'lucide-react'
import { useWishlistStore, useToastStore } from '@/store'
import { productService } from '@/services'
import type { Product } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductSkeleton } from '@/components/feedback/ProductSkeleton'

export const WishlistTab: React.FC = () => {
  const { wishlistIds, clearWishlist } = useWishlistStore()
  const { showToast } = useToastStore()

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true)
      try {
        const res = await productService.getProducts({ limit: 50 })
        setProducts(res.items.filter((p) => wishlistIds.includes(p.id)))
      } catch (err) {
        console.error('Error loading wishlist in account:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadWishlist()
  }, [wishlistIds])

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ sản phẩm yêu thích?')) {
      clearWishlist()
      showToast('Đã xóa tất cả sản phẩm khỏi danh sách yêu thích', 'info')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Sản Phẩm Yêu Thích</h2>
          <p className="text-xs text-slate-500 mt-1">
            Danh sách thiết bị bạn đã lưu để theo dõi ưu đãi và mua sắm sau
          </p>
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

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ProductSkeleton count={3} />
        </div>
      ) : products.length === 0 ? (
        <div className="p-10 bg-white rounded-3xl border border-slate-200/80 text-center">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Chưa có sản phẩm yêu thích nào
          </h3>
          <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
            Bấm vào biểu tượng trái tim trên các sản phẩm công nghệ bạn yêu thích để lưu lại đây.
          </p>
          <Link
            to="/san-pham"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            <span>Khám phá sản phẩm ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
