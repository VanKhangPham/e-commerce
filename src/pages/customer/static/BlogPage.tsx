import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { formatDate } from '@/utils'
import { mockBlogPosts, type BlogPost } from './blogData'

export type { BlogPost }

export const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const featuredPost = mockBlogPosts.find((p) => p.isFeatured) || mockBlogPosts[0]

  const filteredPosts = mockBlogPosts.filter((post) => {
    const matchesCat =
      selectedCategory === 'all' || post.category === selectedCategory
    const q = searchQuery.toLowerCase().trim()
    const matchesQ =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q)
    return matchesCat && matchesQ
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
          Chuyên trang tin tức & công nghệ
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          NOVA Tech Insights
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Cập nhật xu hướng công nghệ mới nhất, đánh giá chuyên sâu từ góc nhìn chuyên gia và chia sẻ mẹo sử dụng thiết bị hiệu quả.
        </p>

        {/* Search Input */}
        <div className="pt-4 max-w-md mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết, mẹo, đánh giá sản phẩm..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-full text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Featured Main Post (only when not searching) */}
      {!searchQuery && selectedCategory === 'all' && featuredPost && (
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl text-white grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 aspect-video lg:aspect-auto h-full overflow-hidden">
            <img
              src={featuredPost.coverImage}
              alt={featuredPost.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="lg:col-span-5 p-6 sm:p-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BÀI VIẾT TIÊU ĐIỂM</span>
            </div>

            <Link to={`/bai-viet/${featuredPost.slug}`}>
              <h2 className="text-xl sm:text-2xl font-black hover:text-indigo-300 transition-colors leading-tight">
                {featuredPost.title}
              </h2>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
              {featuredPost.excerpt}
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <img
                src={featuredPost.authorAvatar}
                alt={featuredPost.authorName}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
              />
              <span>{featuredPost.authorName}</span>
              <span>•</span>
              <span>{formatDate(featuredPost.publishedAt)}</span>
              <span>•</span>
              <span>{featuredPost.readTime}</span>
            </div>

            <div className="pt-2">
              <Link
                to={`/bai-viet/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
              >
                <span>Đọc bài viết đầy đủ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Tất cả bài viết
          </button>
          <button
            onClick={() => setSelectedCategory('review')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              selectedCategory === 'review'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Đánh giá sản phẩm
          </button>
          <button
            onClick={() => setSelectedCategory('news')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              selectedCategory === 'news'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Tin công nghệ
          </button>
          <button
            onClick={() => setSelectedCategory('tips')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              selectedCategory === 'tips'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Thủ thuật & Mẹo hay
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Hiển thị <strong>{filteredPosts.length}</strong> bài viết
        </span>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <Link to={`/bai-viet/${post.slug}`} className="block relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold bg-slate-900/80 text-white backdrop-blur-md uppercase tracking-wider">
                  {post.categoryName}
                </span>
              </Link>

              {/* Content Details */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTime}</span>
                </div>

                <Link to={`/bai-viet/${post.slug}`}>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Author Strip & Read More */}
            <div className="p-5 pt-0 border-t border-slate-50 flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                />
                <span className="text-[11px] font-semibold text-slate-700">{post.authorName}</span>
              </div>

              <Link
                to={`/bai-viet/${post.slug}`}
                className="text-xs font-bold text-indigo-600 group-hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Chi tiết</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
