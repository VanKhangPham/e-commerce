import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star, Zap } from 'lucide-react'
import type { Product } from '@/types'
import { formatCurrency } from '@/utils'
import { useCartStore, useWishlistStore, useToastStore } from '@/store'

interface ProductCardProps {
  product: Product
  layout?: 'grid' | 'list'
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { addItem, openCartDrawer } = useCartStore()
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { showToast } = useToastStore()

  const isFavorited = isInWishlist(product.id)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const added = toggleWishlist(product.id)
    if (added) {
      showToast(`Đã thêm "${product.name}" vào danh sách yêu thích`, 'success')
    } else {
      showToast(`Đã xóa khỏi danh sách yêu thích`, 'info')
    }
  }

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const defaultVariant = product.variants?.[0]
    addItem(product, defaultVariant, 1)
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success')
    openCartDrawer()
  }

  if (layout === 'list') {
    return (
      <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-4 transition-all duration-300 hover:shadow-xl hover:border-slate-300 flex flex-col sm:flex-row gap-5">
        {/* Thumbnail Container */}
        <div className="relative w-full sm:w-56 h-52 sm:h-auto flex-shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3">
          <img
            src={product.thumbnail || product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
            {product.discountPercentage > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-600 text-white shadow-sm">
                -{product.discountPercentage}%
              </span>
            )}
            {product.isFlashSale && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1 shadow-sm">
                <Zap className="w-3 h-3 fill-white" />
                <span>Flash Sale</span>
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 shadow-sm ${
              isFavorited
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                : 'bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white'
            }`}
            title={isFavorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            aria-label="Yêu thích"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Content Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                {product.brand}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">{product.categoryName}</span>
            </div>

            <Link to={`/san-pham/${product.slug}`}>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Rating & Sold count */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-xs font-bold text-slate-800 ml-1">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-slate-400">({product.reviewCount} đánh giá)</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">Đã bán {product.soldCount}</span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-slate-900">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/san-pham/${product.slug}`}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Xem chi tiết
              </Link>
              <button
                onClick={handleQuickAddToCart}
                disabled={product.stock === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default Grid Layout
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-slate-300 flex flex-col justify-between">
      <div>
        {/* Image & Badges */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-50 p-4 flex items-center justify-center">
          <Link to={`/san-pham/${product.slug}`} className="w-full h-full flex items-center justify-center">
            <img
              src={product.thumbnail || product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-108"
              loading="lazy"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start pointer-events-none">
            {product.discountPercentage > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-sm">
                -{product.discountPercentage}%
              </span>
            )}
            {product.isFlashSale && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1 shadow-sm">
                <Zap className="w-2.5 h-2.5 fill-white" />
                <span>Flash</span>
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 shadow-sm ${
              isFavorited
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                : 'bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white'
            }`}
            title={isFavorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
            aria-label="Yêu thích"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-600' : ''}`} />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-4">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-bold uppercase tracking-wider text-indigo-600">{product.brand}</span>
            <span className="text-slate-400 text-[10px]">Đã bán {product.soldCount}</span>
          </div>

          <Link to={`/san-pham/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-xs font-bold text-slate-800 ml-1">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="p-4 pt-0">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-extrabold text-slate-900">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          onClick={handleQuickAddToCart}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}</span>
        </button>
      </div>
    </div>
  )
}
