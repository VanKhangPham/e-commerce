import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react'
import { mockBlogPosts } from './BlogPage'
import { formatDate } from '@/utils'
import { useToastStore } from '@/store'

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { showToast } = useToastStore()

  const post = mockBlogPosts.find((p) => p.slug === slug) || mockBlogPosts[0]
  const relatedPosts = mockBlogPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast('Đã sao chép liên kết bài viết vào bộ nhớ tạm', 'info')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-200">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-slate-700">Trang chủ</Link>
          <span>/</span>
          <Link to="/bai-viet" className="hover:text-slate-700">Tin tức công nghệ</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{post.categoryName}</span>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Chia sẻ</span>
        </button>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 inline-block uppercase tracking-wider">
          {post.categoryName}
        </span>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
          {post.title}
        </h1>

        {/* Author & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div>
              <p className="font-bold text-slate-900">{post.authorName}</p>
              <span className="text-[11px] text-slate-400">Chuyên gia đánh giá công nghệ tại NOVA</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(post.publishedAt, true)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{post.readTime}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      <div className="rounded-3xl overflow-hidden aspect-video bg-slate-100 shadow-md">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Rich Article Body */}
      <div className="space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
        <p className="font-semibold text-slate-900 text-base sm:text-lg leading-relaxed">
          {post.excerpt}
        </p>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-4">
          1. Thiết kế Titan thế hệ mới và Trải nghiệm cầm nắm thực tế
        </h2>
        <p>
          Điểm nhấn đầu tiên khi cầm trên tay siêu phẩm năm nay chính là trọng lượng được tối ưu hóa đáng kinh ngạc. Khung viền Titan cấp độ 5 không chỉ mang lại độ cứng cáp và khả năng chống trầy xước tuyệt hảo mà còn giúp tổng thể máy nhẹ hơn rõ rệt so với các thế hệ khung thép trước đây. Các cạnh viền được bo cong nhẹ nhàng, loại bỏ hoàn toàn cảm giác cấn tay khi sử dụng liên tục trong nhiều giờ liền.
        </p>

        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 space-y-2">
          <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Điểm Nhấn Công Nghệ Đột Phá</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nút điều khiển Camera Control mới hoạt động dựa trên cảm ứng lực điện dung kết hợp phản hồi rung Haptic Engine, cho phép chuyển đổi mượt mà giữa các chế độ chụp, zoom quang học và phơi sáng chỉ bằng thao tác vuốt ngón tay nhẹ nhàng.
          </p>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-4">
          2. Sức mạnh vi xử lý và Hiệu năng thực chiến với tác vụ nặng
        </h2>
        <p>
          Được xây dựng trên tiến trình 3nm thế hệ thứ hai, con chip mới mang lại hiệu suất đơn nhân và đa nhân vượt trội hơn 20%, trong khi lượng tiêu thụ điện năng giảm đến 30%. Các tác vụ xuất video 4K ProRes chuẩn điện ảnh hay chơi các tựa game đồ họa Console AAA đều diễn ra vô cùng mượt mà mà không hề bị sụt giảm khung hình hay quá nhiệt.
        </p>

        {/* Pros & Cons Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-200 space-y-2 text-xs">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ưu Điểm Nổi Bật:</span>
            </h4>
            <ul className="space-y-1 text-emerald-800 list-disc list-inside">
              <li>Màn hình sáng 2000 nits hiển thị rõ ràng ngoài trời nắng gắt</li>
              <li>Thời lượng pin kéo dài hơn 33 giờ sử dụng liên tục</li>
              <li>Nút Camera Control tiện lợi cho người sáng tạo nội dung</li>
              <li>Hỗ trợ sạc nhanh 50% chỉ trong 30 phút</li>
            </ul>
          </div>

          <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900">Điểm Cần Cân Nhắc:</h4>
            <ul className="space-y-1 text-slate-600 list-disc list-inside">
              <li>Mức giá khởi điểm phân khúc cao cấp</li>
              <li>Kích thước màn hình lớn cần thời gian làm quen</li>
              <li>Cần củ sạc công suất từ 30W trở lên để đạt tốc độ tối đa</li>
            </ul>
          </div>
        </div>

        {/* In-article Product Recommendation CTA */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 my-8 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
              Sản phẩm có sẵn tại NOVA
            </span>
            <p className="text-base font-black">Khám phá siêu phẩm chính hãng bảo hành 12 tháng</p>
            <p className="text-xs text-slate-300">Nhận ngay voucher 500.000₫ và trả góp 0% khi mua tại NOVA.</p>
          </div>
          <Link
            to="/san-pham"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-colors whitespace-nowrap shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Xem giá ưu đãi</span>
          </Link>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 pt-4">
          3. Kết luận: Có nên nâng cấp ngay lúc này?
        </h2>
        <p>
          Nếu bạn đang tìm kiếm một thiết bị toàn diện về cả thiết kế cao cấp, hệ thống camera đỉnh cao lẫn thời lượng pin bền bỉ suốt cả ngày dài, đây chắc chắn là khoản đầu tư xứng đáng cho công việc và trải nghiệm giải trí trong ít nhất 3 - 4 năm tới.
        </p>
      </div>

      {/* Author Bio Card */}
      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 flex items-center gap-4 text-xs">
        <img
          src={post.authorAvatar}
          alt={post.authorName}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0"
        />
        <div className="space-y-1">
          <p className="font-bold text-slate-900">{post.authorName}</p>
          <p className="text-slate-500">
            Biên tập viên công nghệ cao cấp với hơn 8 năm kinh nghiệm đánh giá các thiết bị flagship di động và thiết bị âm thanh chuẩn phòng thu.
          </p>
        </div>
      </div>

      {/* Related Posts */}
      <div className="pt-8 border-t border-slate-200 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900">Bài Viết Liên Quan</h3>
          <Link
            to="/bai-viet"
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedPosts.map((rel) => (
            <Link
              key={rel.id}
              to={`/bai-viet/${rel.slug}`}
              className="group p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all space-y-2.5"
            >
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={rel.coverImage}
                  alt={rel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                {rel.title}
              </h4>
              <span className="text-[10px] text-slate-400 block">{formatDate(rel.publishedAt)}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-4 text-center">
        <Link
          to="/bai-viet"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang danh sách bài viết</span>
        </Link>
      </div>
    </div>
  )
}
