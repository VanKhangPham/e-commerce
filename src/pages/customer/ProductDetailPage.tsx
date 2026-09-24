import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  Zap,
  Check,
  Plus,
  Minus,
  Share2,
  ChevronRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { productService, reviewService } from '@/services'
import type { Product, ProductReview, ProductVariant } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'
import { formatCurrency, formatDate } from '@/utils'
import { useCartStore, useWishlistStore, useToastStore, useAuthStore } from '@/store'

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const { addItem, openCartDrawer } = useCartStore()
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { showToast } = useToastStore()
  const { currentUser } = useAuthStore()

  // States
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Interactive UI States
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc')

  // New review form state
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  // Fetch product data
  useEffect(() => {
    const loadProductData = async () => {
      if (!slug) return
      setIsLoading(true)
      try {
        const found = await productService.getProductBySlug(slug)
        if (found) {
          setProduct(found)
          setSelectedImage(found.images[0] || found.thumbnail)
          setSelectedVariant(found.variants?.[0] || null)
          setQuantity(1)

          // Load related & reviews
          const [rel, revs] = await Promise.all([
            productService.getRelatedProducts(found.id, found.categoryId, 4),
            reviewService.getReviews(found.id),
          ])
          setRelatedProducts(rel)
          setReviews(revs)
        } else {
          setProduct(null)
        }
      } catch (err) {
        console.error('Error fetching product detail:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProductData()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-6 bg-slate-100 rounded-3xl aspect-square" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-8 bg-slate-100 rounded w-3/4" />
            <div className="h-6 bg-slate-100 rounded w-1/3" />
            <div className="h-24 bg-slate-100 rounded" />
            <div className="h-12 bg-slate-100 rounded w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-xs text-slate-500 mb-6">
          Sản phẩm có thể đã ngừng kinh doanh hoặc đường dẫn không chính xác.
        </p>
        <Link
          to="/san-pham"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
        >
          Khám phá danh sách sản phẩm
        </Link>
      </div>
    )
  }

  const isFavorited = isInWishlist(product.id)
  const currentPrice = product.price + (selectedVariant?.priceModifier || 0)
  const currentOriginalPrice = product.originalPrice + (selectedVariant?.priceModifier || 0)
  const saveAmount = currentOriginalPrice - currentPrice

  const handleAddToCart = () => {
    addItem(product, selectedVariant || undefined, quantity)
    showToast(`Đã thêm ${quantity}x "${product.name}" vào giỏ hàng`, 'success')
    openCartDrawer()
  }

  const handleBuyNow = () => {
    addItem(product, selectedVariant || undefined, quantity)
    navigate('/thanh-toan')
  }

  const handleToggleWishlist = () => {
    const added = toggleWishlist(product.id)
    if (added) {
      showToast('Đã thêm sản phẩm vào danh sách yêu thích', 'success')
    } else {
      showToast('Đã xóa khỏi danh sách yêu thích', 'info')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast('Đã sao chép liên kết sản phẩm vào bộ nhớ tạm', 'info')
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmittingReview(true)
    try {
      const added = await reviewService.addReview({
        productId: product.id,
        userId: currentUser?.id || 'guest',
        userName: currentUser?.name || 'Khách Hàng NOVA',
        userAvatar: currentUser?.avatar,
        rating: newRating,
        comment: newComment.trim(),
        orderVerified: !!currentUser,
      })

      setReviews([added, ...reviews])
      setNewComment('')
      showToast('Cảm ơn bạn! Đánh giá đã được ghi nhận thành công.', 'success')
    } catch {
      showToast('Không thể gửi đánh giá lúc này, vui lòng thử lại sau.', 'error')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 flex-wrap">
        <Link to="/" className="hover:text-slate-700">Trang chủ</Link>
        <span>/</span>
        <Link to="/san-pham" className="hover:text-slate-700">Sản phẩm</Link>
        <span>/</span>
        <Link to={`/danh-muc/${product.categoryId}`} className="hover:text-slate-700">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-14 border-b border-slate-200">
        {/* Left: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Big Featured Image */}
          <div className="relative aspect-square w-full rounded-3xl bg-white border border-slate-200/80 p-8 flex items-center justify-center overflow-hidden shadow-xs">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain transition-all duration-300 transform hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
              {product.discountPercentage > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-sm">
                  TIẾT KIỆM {product.discountPercentage}%
                </span>
              )}
              {product.isFlashSale && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white flex items-center gap-1 shadow-sm">
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Flash Sale Giá Tốt</span>
                </span>
              )}
            </div>

            {/* Favorite & Share Buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors shadow-xs"
                title="Chia sẻ sản phẩm"
                aria-label="Chia sẻ"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-2.5 rounded-full transition-colors shadow-xs ${
                  isFavorited
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    : 'bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                }`}
                title={isFavorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                aria-label="Yêu thích"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Thumbnails Strip */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-20 rounded-2xl p-2 bg-white border flex-shrink-0 transition-all ${
                  selectedImage === img
                    ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-sm'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Specifications & Purchasing Controls */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Brand & Stock */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-xs text-slate-400">Mã SKU: {selectedVariant?.sku || product.id}</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Sold */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-slate-800 ml-1">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-slate-600 hover:text-indigo-600 font-medium underline"
              >
                {reviews.length} đánh giá khách hàng
              </button>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">Đã bán {product.soldCount}</span>
            </div>

            {/* Pricing Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {formatCurrency(currentPrice)}
                </span>
                {currentOriginalPrice > currentPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatCurrency(currentOriginalPrice)}
                  </span>
                )}
                {saveAmount > 0 && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-700">
                    Tiết kiệm {formatCurrency(saveAmount)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Đã bao gồm VAT 10% • Miễn phí vận chuyển cho đơn từ 2.000.000₫
              </p>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Lựa chọn phân loại:
                  </span>
                  <span className="text-xs text-indigo-600 font-semibold">
                    {selectedVariant?.name}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {v.type === 'color' && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: v.value }}
                          />
                        )}
                        <span>{v.name}</span>
                        {v.priceModifier > 0 && (
                          <span className="text-[10px] opacity-80">
                            +{formatCurrency(v.priceModifier)}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & CTAs */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Số lượng:
                </span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl border-2 border-slate-900 text-slate-900 font-bold text-xs hover:bg-slate-900 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md hover:shadow-indigo-600/25 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Mua Ngay Giao Tận Nơi</span>
                </button>
              </div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 p-3 mt-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="p-2 space-y-1">
              <Truck className="w-4 h-4 text-indigo-600 mx-auto" />
              <p className="text-[11px] font-bold text-slate-800">Giao nhanh 2h</p>
              <p className="text-[10px] text-slate-400">Nội thành HCM & HN</p>
            </div>
            <div className="p-2 space-y-1 border-x border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto" />
              <p className="text-[11px] font-bold text-slate-800">Chính hãng 100%</p>
              <p className="text-[10px] text-slate-400">Bảo hành 12 tháng</p>
            </div>
            <div className="p-2 space-y-1">
              <RotateCcw className="w-4 h-4 text-sky-600 mx-auto" />
              <p className="text-[11px] font-bold text-slate-800">Đổi trả 30 ngày</p>
              <p className="text-[10px] text-slate-400">Lỗi 1 đổi 1 tận nhà</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description / Specs / Reviews */}
      <div className="py-12">
        <div className="flex items-center gap-4 border-b border-slate-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'desc'
                ? 'text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-slate-900'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Mô Tả Sản Phẩm
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'specs'
                ? 'text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-slate-900'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Thông Số Kỹ Thuật
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'reviews'
                ? 'text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-slate-900'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Đánh Giá & Nhận Xét ({reviews.length})
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'desc' && (
          <div className="max-w-4xl space-y-4 text-sm text-slate-700 leading-relaxed">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Giới thiệu chi tiết {product.name}
            </h3>
            <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Tab 2: Specifications Table */}
        {activeTab === 'specs' && (
          <div className="max-w-3xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Bảng thông số kỹ thuật chi tiết
            </h3>
            <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
              {product.specifications.map((spec, idx) => (
                <div key={idx} className="flex p-3.5 even:bg-slate-50">
                  <span className="w-1/3 font-bold text-slate-800">{spec.name}</span>
                  <span className="w-2/3 text-slate-600 font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Reviews & Add Review Form */}
        {activeTab === 'reviews' && (
          <div className="max-w-4xl space-y-8">
            {/* Reviews Overview Header */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <span className="text-4xl font-black text-slate-900 block">
                    {product.rating.toFixed(1)}
                  </span>
                  <div className="flex text-amber-400 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {reviews.length} nhận xét
                  </span>
                </div>
                <div className="text-xs text-slate-600 border-l border-slate-200 pl-4 space-y-1">
                  <p className="font-semibold text-slate-900">100% Khách Hàng Hài Lòng</p>
                  <p className="text-slate-500">Mọi đánh giá đều được xác thực từ đơn mua thực tế tại NOVA.</p>
                </div>
              </div>
            </div>

            {/* Submit New Review Form */}
            <form
              onSubmit={handleSubmitReview}
              className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4"
            >
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Viết nhận xét của bạn về sản phẩm này</span>
              </h4>

              {/* Star Picker */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">Đánh giá sao:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-600 ml-2">{newRating} sao</span>
              </div>

              {/* Comment text */}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm thực tế của bạn về chất lượng máy, đóng gói, giao hàng..."
                rows={3}
                required
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />

              <button
                type="submit"
                disabled={isSubmittingReview || !newComment.trim()}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"
              >
                {isSubmittingReview ? 'Đang gửi đánh giá...' : 'Gửi Đánh Giá Ngay'}
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'}
                        alt={rev.userName}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                          {rev.orderVerified && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Đã mua tại NOVA
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{formatDate(rev.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pl-12">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-black text-slate-900">Sản Phẩm Tương Tự Bạn Có Thể Thích</h2>
            </div>
            <Link
              to={`/danh-muc/${product.categoryId}`}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>Xem thêm cùng danh mục</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
