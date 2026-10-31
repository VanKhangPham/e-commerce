import type { ProductReview } from '@/types'
import { api } from './httpClient'

interface BackendReview {
  id: string
  productId: string
  userId: string
  userName?: string
  userAvatar?: string | null
  user?: { id: string; name: string; avatar?: string | null }
  rating: number
  comment: string
  createdAt: string
  approved: boolean
  orderVerified?: boolean
}

function formatReview(r: BackendReview): ProductReview {
  return {
    id: r.id,
    productId: r.productId,
    userId: r.userId,
    userName: r.userName || r.user?.name || 'Khách hàng NOVA',
    userAvatar: r.userAvatar || r.user?.avatar || undefined,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt || new Date().toISOString(),
    approved: Boolean(r.approved),
    orderVerified: Boolean(r.orderVerified),
  }
}

export const reviewService = {
  /**
   * Get reviews for a product (or all reviews for admin)
   */
  async getReviews(productId?: string): Promise<ProductReview[]> {
    if (productId) {
      const res = await api.get<BackendReview[]>(`/reviews/product/${productId}`)
      return (res.data || []).map(formatReview)
    } else {
      const res = await api.get<BackendReview[]>('/admin/reviews?limit=100')
      return (res.data || []).map(formatReview)
    }
  },

  /**
   * Get all reviews for admin panel
   */
  async getAllReviewsAdmin(): Promise<ProductReview[]> {
    return this.getReviews()
  },

  /**
   * Add a review (Authenticated user)
   */
  async addReview(data: Omit<ProductReview, 'id' | 'createdAt' | 'approved'>): Promise<ProductReview> {
    const res = await api.post<BackendReview>('/reviews', {
      productId: data.productId,
      rating: data.rating,
      comment: data.comment,
    })
    return formatReview(res.data)
  },

  /**
   * Admin: Approve or reject review
   */
  async toggleReviewApproval(reviewId: string): Promise<ProductReview> {
    const all = await this.getAllReviewsAdmin()
    const target = all.find((r) => r.id === reviewId)
    const newApprovedState = target ? !target.approved : true

    const res = await api.patch<BackendReview>(`/admin/reviews/${reviewId}/approve`, {
      approved: newApprovedState,
    })
    return formatReview(res.data)
  },

  /**
   * Delete review
   */
  async deleteReview(reviewId: string): Promise<boolean> {
    await api.delete(`/admin/reviews/${reviewId}`)
    return true
  },
}
