import React, { useState, useEffect } from 'react'
import {
  Star,
  Search,
  Trash2,
  CheckCircle2,
  XCircle,
  Check,
} from 'lucide-react'
import { reviewService, productService } from '@/services'
import type { ProductReview } from '@/types'
import { formatDate } from '@/utils'
import { useToastStore } from '@/store'

interface ManagedReview extends ProductReview {
  status?: 'approved' | 'pending' | 'rejected'
  productName?: string
  productImage?: string
}

export const AdminReviewsPage: React.FC = () => {
  const { showToast } = useToastStore()

  const [reviews, setReviews] = useState<ManagedReview[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all')
  const [starFilter, setStarFilter] = useState<number | 'all'>('all')

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [revs, prodsRes] = await Promise.all([
        reviewService.getReviews(),
        productService.getProducts({ limit: 100 }),
      ])

      const enhanced: ManagedReview[] = revs.map((r, idx) => {
        const prod = prodsRes.items.find((p) => p.id === r.productId)
        return {
          ...r,
          status: idx === 0 ? 'pending' : 'approved',
          productName: prod?.name || 'Sản phẩm công nghệ NOVA',
          productImage: prod?.thumbnail || prod?.images[0],
        }
      })

      setReviews(enhanced)
    } catch (err) {
      console.error('Error fetching reviews for admin:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Approve
  const handleApprove = (id: string, userName: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    )
    showToast(`Đã duyệt đánh giá của "${userName}" hiển thị công khai!`, 'success')
  }

  // Reject / Hide
  const handleReject = (id: string, userName: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    )
    showToast(`Đã từ chối/ẩn đánh giá của "${userName}"`, 'warning')
  }

  // Delete
  const handleDelete = async (id: string, userName: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nhận xét của "${userName}"?`)) return

    try {
      await reviewService.deleteReview(id)
      setReviews((prev) => prev.filter((r) => r.id !== id))
      showToast('Đã xóa đánh giá thành công', 'info')
    } catch {
      showToast('Không thể xóa nhận xét lúc này', 'error')
    }
  }

  // Filter
  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      r.userName.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q) ||
      (r.productName && r.productName.toLowerCase().includes(q))

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    const matchesStar = starFilter === 'all' || r.rating === starFilter

    return matchesQuery && matchesStatus && matchesStar
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Kiểm Duyệt Đánh Giá Khách Hàng
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Duyệt hoặc ẩn các nhận xét của người mua để bảo đảm tính minh bạch và văn minh
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo người đánh giá, nội dung, sản phẩm..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'approved' | 'pending' | 'rejected')}
            className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">Tất cả trạng thái kiểm duyệt</option>
            <option value="approved">Đã duyệt hiển thị</option>
            <option value="pending">Chờ kiểm duyệt</option>
            <option value="rejected">Bị ẩn / Từ chối</option>
          </select>

          {/* Star Filter */}
          <select
            value={starFilter}
            onChange={(e) => setStarFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">Tất cả số sao</option>
            <option value="5">5 sao ★★★★★</option>
            <option value="4">4 sao ★★★★</option>
            <option value="3">3 sao ★★★</option>
            <option value="2">2 sao ★★</option>
            <option value="1">1 sao ★</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border">
            Đang tải dữ liệu nhận xét...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border">
            Không tìm thấy nhận xét nào thỏa mãn bộ lọc.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-5 rounded-3xl border transition-all bg-white shadow-xs space-y-4 ${
                rev.status === 'pending'
                  ? 'border-amber-300 ring-2 ring-amber-400/20'
                  : rev.status === 'rejected'
                  ? 'border-slate-200 opacity-60 bg-slate-50/50'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* User & Product Info */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={
                      rev.userAvatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'
                    }
                    alt={rev.userName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0"
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {rev.userName}
                      </span>
                      {rev.orderVerified && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Đã mua tại NOVA
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
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
                      <span className="text-[11px] text-slate-400">• {formatDate(rev.createdAt, true)}</span>
                    </div>

                    {/* Associated Product */}
                    {rev.productName && (
                      <p className="text-xs text-indigo-600 font-semibold pt-1">
                        Sản phẩm: {rev.productName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {rev.status === 'approved' && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã hiển thị</span>
                    </span>
                  )}
                  {rev.status === 'pending' && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Chờ duyệt
                    </span>
                  )}
                  {rev.status === 'rejected' && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                      Bị ẩn
                    </span>
                  )}
                </div>
              </div>

              {/* Comment Content */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                &quot;{rev.comment}&quot;
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(rev.id, rev.userName)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Duyệt công khai</span>
                    </button>
                  )}
                  {rev.status !== 'rejected' && (
                    <button
                      onClick={() => handleReject(rev.id, rev.userName)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-200 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Ẩn nhận xét</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(rev.id, rev.userName)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Xóa nhận xét vĩnh viễn"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
