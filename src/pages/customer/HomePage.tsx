import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Flame,
  ChevronRight,
  Clock,
  Star,
  CheckCircle2,
  TrendingUp,
  Headphones,
  Smartphone,
  Laptop,
  Watch,
} from 'lucide-react'
import { productService } from '@/services'
import type { Category, Product } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductSkeleton } from '@/components/feedback/ProductSkeleton'
import { useToastStore } from '@/store'

const categoryIcons: Record<string, React.ElementType> = {
  'cat-1': Smartphone,
  'cat-2': Laptop,
  'cat-3': Headphones,
  'cat-4': Watch,
  'cat-5': Zap,
}

export const HomePage: React.FC = () => {
  const { showToast } = useToastStore()

  // State
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('')

  // Hero Carousel State
  const [activeSlide, setActiveSlide] = useState(0)
  const heroSlides = [
    {
      badge: 'FLAGSHIP 2026 MỚI RA MẮT',
      title: 'iPhone 16 Pro Max',
      highlight: 'Sức Mạnh Titan. Trí Tuệ Apple.',
      description: 'Chip A18 Pro tiến trình 3nm tối thượng, nút Camera Control thế hệ mới và thời lượng pin kỷ lục.',
      price: '34.990.000₫',
      oldPrice: '36.990.000₫',
      link: '/san-pham/iphone-16-pro-max-256gb',
      bgGradient: 'from-slate-950 via-slate-900 to-indigo-950',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
    },
    {
      badge: 'ĐỈNH CAO GALAXY AI',
      title: 'Samsung S25 Ultra 5G',
      highlight: 'Trí Tuệ Nhân Tạo Không Giới Hạn.',
      description: 'Khung viền Titan siêu bền, camera mắt thần 200MP bắt trọn màn đêm cùng bút S-Pen quyền năng.',
      price: '33.990.000₫',
      oldPrice: '37.490.000₫',
      link: '/san-pham/samsung-galaxy-s25-ultra-512gb',
      bgGradient: 'from-slate-950 via-slate-900 to-slate-800',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop',
    },
    {
      badge: 'CỖ MÁY PRO TỐI THƯỢNG',
      title: 'MacBook Pro 16" M4 Pro',
      highlight: 'Sức Mạnh Cho Nhà Sáng Tạo.',
      description: 'Màn hình Liquid Retina XDR 120Hz rực rỡ, pin 24 giờ liên tục và cổng kết nối Thunderbolt 5 tốc độ cao.',
      price: '64.990.000₫',
      oldPrice: '69.990.000₫',
      link: '/san-pham/macbook-pro-16-inch-m4-pro',
      bgGradient: 'from-zinc-950 via-slate-900 to-blue-950',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop',
    },
  ]

  // Flash Sale Countdown Timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 24, minutes: 0, seconds: 0 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-advance hero carousel
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(slideTimer)
  }, [heroSlides.length])

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [cats, feat, best, flash] = await Promise.all([
          productService.getCategories(),
          productService.getFeaturedProducts(),
          productService.getBestSellerProducts(),
          productService.getFlashSaleProducts(),
        ])
        setCategories(cats)
        setFeaturedProducts(feat)
        setBestSellers(best)
        setFlashSaleProducts(flash)
      } catch (err) {
        console.error('Failed to load homepage data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newsletterEmail.trim()) {
      showToast('Đăng ký nhận bản tin NOVA thành công! Voucher 500k đã gửi vào email.', 'success')
      setNewsletterEmail('')
    }
  }

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SLIDER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[460px] sm:min-h-[520px] flex items-center">
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} transition-opacity duration-700 ease-in-out flex items-center ${
                activeSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-white z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-300 text-xs font-extrabold tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{slide.badge}</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                    {slide.title} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-200 to-emerald-300">
                      {slide.highlight}
                    </span>
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                    {slide.description}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      {slide.price}
                    </span>
                    <span className="text-sm text-slate-400 line-through">{slide.oldPrice}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      to={slide.link}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                      <span>Mua ngay ưu đãi</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/san-pham"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-sm transition-all border border-white/20"
                    >
                      <span>Xem tất cả sản phẩm</span>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 hidden lg:flex justify-center relative">
                  <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-3xl p-4 flex items-center justify-center">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  activeSlide === idx ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. TRUST COMMITMENTS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3.5 p-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Giao Siêu Tốc 2 Giờ</p>
              <p className="text-[11px] text-slate-500">Miễn phí cho đơn từ 2.000.000₫</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">100% Chính Hãng</p>
              <p className="text-[11px] text-slate-500">Bảo hành 12 tháng tại hãng</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Đổi Trả Trong 30 Ngày</p>
              <p className="text-[11px] text-slate-500">Lỗi 1 đổi 1 nhanh chóng</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">Hỗ Trợ Kỹ Thuật 24/7</p>
              <p className="text-[11px] text-slate-500">Tổng đài 1900 8899 miễn cước</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Danh Mục Sản Phẩm</h2>
            <p className="text-xs text-slate-500 mt-1">Lựa chọn ngành hàng công nghệ phù hợp với nhu cầu</p>
          </div>
          <Link
            to="/san-pham"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id] || Smartphone
            return (
              <Link
                key={cat.id}
                to={`/danh-muc/${cat.slug}`}
                className="group p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors flex items-center justify-center mb-3.5 shadow-xs">
                  <Icon className="w-7 h-7 transition-transform group-hover:scale-110" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-1">
                  {cat.productCount} sản phẩm
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 4. FLASH SALE SECTION WITH LIVE COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          {/* Header & Countdown */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white text-rose-600 rounded-2xl shadow-md">
                <Flame className="w-6 h-6 fill-rose-600 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">FLASH SALE GIÁ SỐC</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white uppercase tracking-wider">
                    Đang Diễn Ra
                  </span>
                </div>
                <p className="text-xs text-rose-100 mt-0.5">Số lượng có hạn, ưu đãi kết thúc sau:</p>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-white/80" />
              <div className="flex items-center gap-1.5 font-mono text-xs font-black">
                <span className="bg-slate-950/80 text-white px-3 py-1.5 rounded-xl shadow-xs">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-white font-bold">:</span>
                <span className="bg-slate-950/80 text-white px-3 py-1.5 rounded-xl shadow-xs">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-white font-bold">:</span>
                <span className="bg-slate-950/80 text-white px-3 py-1.5 rounded-xl shadow-xs">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Flash Sale Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {isLoading ? (
              <ProductSkeleton count={4} />
            ) : (
              flashSaleProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="text-slate-900">
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 5. BEST SELLING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Sản Phẩm Bán Chạy Nhất</h2>
              <p className="text-xs text-slate-500 mt-0.5">Các thiết bị công nghệ được cộng đồng tin dùng nhiều nhất</p>
            </div>
          </div>
          <Link
            to="/san-pham?sortBy=popularity"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>Xem thêm</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading ? (
            <ProductSkeleton count={4} />
          ) : (
            bestSellers.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* 6. PROMOTIONAL FEATURED BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Apple Ecosystem */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between min-h-[260px] group shadow-lg">
            <div className="relative z-10 space-y-2 max-w-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400">
                Hệ Sinh Thái Apple
              </span>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Đồng Bộ Đỉnh Cao Cho Công Việc
              </h3>
              <p className="text-xs text-slate-300">
                Giảm thêm 1.000.000₫ khi mua kèm Combo iPhone, MacBook và Apple Watch.
              </p>
            </div>
            <div className="relative z-10 pt-6">
              <Link
                to="/san-pham?brand=Apple"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
              >
                <span>Khám phá ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-25 group-hover:opacity-40 transition-opacity bg-radial from-indigo-500 to-transparent" />
          </div>

          {/* Card 2: Audio & Accessories */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between min-h-[260px] group shadow-lg">
            <div className="relative z-10 space-y-2 max-w-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
                Âm Thanh Đỉnh Cao
              </span>
              <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                Sony & Marshall Chất Âm Huyền Thoại
              </h3>
              <p className="text-xs text-slate-300">
                Khử tiếng ồn chủ động ANC chuẩn phòng thu, tặng kèm bao da bảo vệ cao cấp.
              </p>
            </div>
            <div className="relative z-10 pt-6">
              <Link
                to="/danh-muc/am-thanh-tai-nghe"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
              >
                <span>Khám phá ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-25 group-hover:opacity-40 transition-opacity bg-radial from-emerald-500 to-transparent" />
          </div>
        </div>
      </section>

      {/* 7. ALL FEATURED PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Gợi Ý Cho Bạn</h2>
              <p className="text-xs text-slate-500 mt-0.5">Sản phẩm công nghệ nổi bật được chuyên gia NOVA đề xuất</p>
            </div>
          </div>
          <Link
            to="/san-pham"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>Xem tất cả ({featuredProducts.length}+)</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading ? (
            <ProductSkeleton count={8} />
          ) : (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* 8. BRAND PARTNERS LOGO WALL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Thương hiệu công nghệ đối tác chính hãng
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all">
            <span className="text-lg font-black text-slate-800 tracking-tight">APPLE</span>
            <span className="text-lg font-black text-slate-800 tracking-tight">SAMSUNG</span>
            <span className="text-lg font-black text-slate-800 tracking-tight">SONY</span>
            <span className="text-lg font-black text-slate-800 tracking-tight">DELL</span>
            <span className="text-lg font-black text-slate-800 tracking-tight">ANKER</span>
            <span className="text-lg font-black text-slate-800 tracking-tight">KEYCHRON</span>
            <span className="text-lg font-black text-slate-800 tracking-tight">LOGITECH</span>
            <span className="text-lg font-black text-slate-800 tracking-tight">MARSHALL</span>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS / CUSTOMER FEEDBACK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">Khách Hàng Nói Gì Về NOVA?</h2>
          <p className="text-xs text-slate-500 mt-1">Hơn 50.000+ khách hàng tin tưởng và hài lòng với chất lượng dịch vụ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              &quot;Giao hàng siêu tốc chỉ 1 giờ tại Quận 1. Máy iPhone 16 Pro Max nguyên seal nguyên kiện, nhân viên tư vấn nhiệt tình hướng dẫn chuyển dữ liệu.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
                alt="Khách hàng"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Nguyễn Văn Hùng</p>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã mua iPhone 16 Pro Max
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              &quot;Chống ồn của Sony XM5 mua ở NOVA cực êm, đi công tác máy bay không hề bị ù tai. Được áp mã FREESHIP và giảm ngay 500k qua VNPAY.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
                alt="Khách hàng"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Trần Thị Mai</p>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã mua Sony WH-1000XM5
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center text-amber-400 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              &quot;Bàn phím cơ Keychron Q1 Pro đầm nặng tay, gõ rất sướng. Đóng gói 3 lớp chống sốc vô cùng cẩn thận, sẽ tiếp tục ủng hộ NOVA.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100&auto=format&fit=crop"
                alt="Khách hàng"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Lê Hoàng Nam</p>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã mua Keychron Q1 Pro
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. NEWSLETTER SIGNUP BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Đăng ký thành viên NOVA VIP
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Nhận Voucher 500.000₫ & Thông Báo Flash Sale Sớm Nhất
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              Đăng ký để trở thành người đầu tiên trải nghiệm các siêu phẩm công nghệ và nhận mã giảm giá độc quyền mỗi tuần.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Nhập địa chỉ email của bạn..."
                required
                className="flex-1 px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-full text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-slate-950 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors shadow-md"
              >
                Đăng ký ngay
              </button>
            </form>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/20 to-transparent pointer-events-none" />
        </div>
      </section>
    </div>
  )
}
