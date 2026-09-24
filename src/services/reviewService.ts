import { mockReviews } from '@/data'
import type { ProductReview } from '@/types'
import { fakeDelay, getStoredData, setStoredData } from './apiHelper'

const STORAGE_KEY_REVIEWS = 'nova_reviews_data'

function loadReviews(): ProductReview[] {
  return getStoredData<ProductReview[]>(STORAGE_KEY_REVIEWS, mockReviews)
}

function saveReviews(reviews: ProductReview[]): void {
  setStoredData(STORAGE_KEY_REVIEWS, reviews)
}

export const reviewService = {
  async getReviews(productId?: string): Promise<ProductReview[]> {
    await fakeDelay(200)
    const list = loadReviews()
    if (productId) {
      return list.filter((r) => r.productId === productId && r.approved)
    }
    return list
  },

  async getAllReviewsAdmin(): Promise<ProductReview[]> {
    await fakeDelay(250)
    return loadReviews()
  },

  async addReview(data: Omit<ProductReview, 'id' | 'createdAt' | 'approved'>): Promise<ProductReview> {
    await fakeDelay(350)
    const list = loadReviews()
    const newReview: ProductReview = {
      ...data,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      approved: true, // auto approve in mock mode
    }
    list.unshift(newReview)
    saveReviews(list)
    return newReview
  },

  async toggleReviewApproval(reviewId: string): Promise<ProductReview> {
    await fakeDelay(250)
    const list = loadReviews()
    const index = list.findIndex((r) => r.id === reviewId)
    if (index === -1) {
      throw new Error('Đánh giá không tồn tại')
    }
    list[index].approved = !list[index].approved
    saveReviews(list)
    return list[index]
  },

  async deleteReview(reviewId: string): Promise<boolean> {
    await fakeDelay(250)
    const list = loadReviews()
    const filtered = list.filter((r) => r.id !== reviewId)
    saveReviews(filtered)
    return true
  },
}
