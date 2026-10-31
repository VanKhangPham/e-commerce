import type { Coupon } from '@/types'
import { api } from './httpClient'

interface BackendCoupon {
  id: string
  code: string
  description: string
  discountType: string
  discountValue: number
  minOrderValue: number
  maxDiscount?: number | null
  expiryDate: string
  usageLimit: number
  usageCount: number
  isActive: boolean
}

interface ValidateCouponResponse {
  id: string
  code: string
  description: string
  discountType: string
  discountValue: number
  discountAmount: number
  minOrderValue: number
  maxDiscount?: number | null
  expiryDate: string
}

function formatCoupon(c: BackendCoupon): Coupon {
  return {
    id: c.id,
    code: c.code,
    description: c.description,
    discountType: (c.discountType?.toLowerCase() === 'fixed' ? 'fixed' : 'percentage'),
    discountValue: c.discountValue,
    minOrderValue: c.minOrderValue,
    maxDiscount: c.maxDiscount || undefined,
    expiryDate: c.expiryDate,
    usageLimit: c.usageLimit,
    usageCount: c.usageCount,
    isActive: c.isActive,
  }
}

export const couponService = {
  /**
   * Get all coupons (for Admin or coupon listings)
   */
  async getCoupons(): Promise<Coupon[]> {
    const res = await api.get<BackendCoupon[]>('/admin/coupons')
    return (res.data || []).map(formatCoupon)
  },

  /**
   * Validate coupon code against cart total
   */
  async validateCoupon(
    code: string,
    orderTotal: number
  ): Promise<{
    isValid: boolean
    coupon?: Coupon
    discountAmount: number
    message: string
  }> {
    try {
      const res = await api.post<ValidateCouponResponse>('/coupons/validate', {
        code: code.trim().toUpperCase(),
        cartTotal: Math.round(orderTotal),
      })

      const validated = res.data
      const fullCoupon: Coupon = {
        id: validated.id,
        code: validated.code,
        description: validated.description,
        discountType: validated.discountType === 'fixed' ? 'fixed' : 'percentage',
        discountValue: validated.discountValue,
        minOrderValue: validated.minOrderValue,
        maxDiscount: validated.maxDiscount || undefined,
        expiryDate: validated.expiryDate,
        usageLimit: 1000,
        usageCount: 0,
        isActive: true,
      }

      return {
        isValid: true,
        coupon: fullCoupon,
        discountAmount: validated.discountAmount,
        message: res.message || 'Áp dụng mã giảm giá thành công!',
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Mã giảm giá không hợp lệ'
      return {
        isValid: false,
        discountAmount: 0,
        message: msg,
      }
    }
  },

  /**
   * Admin: Create new coupon
   */
  async createCoupon(data: Omit<Coupon, 'id' | 'usageCount'>): Promise<Coupon> {
    const payload = {
      code: data.code.trim().toUpperCase(),
      description: data.description,
      discountType: data.discountType.toUpperCase(),
      discountValue: data.discountValue,
      minOrderValue: data.minOrderValue,
      maxDiscount: data.maxDiscount || null,
      expiryDate: data.expiryDate,
      usageLimit: data.usageLimit,
      isActive: data.isActive,
    }

    const res = await api.post<BackendCoupon>('/admin/coupons', payload)
    return formatCoupon(res.data)
  },

  /**
   * Admin: Update coupon
   */
  async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
    const payload: Record<string, unknown> = { ...updates }
    if (updates.discountType) {
      payload.discountType = updates.discountType.toUpperCase()
    }
    if (updates.code) {
      payload.code = updates.code.toUpperCase()
    }

    const res = await api.put<BackendCoupon>(`/admin/coupons/${id}`, payload)
    return formatCoupon(res.data)
  },

  /**
   * Admin: Delete coupon
   */
  async deleteCoupon(id: string): Promise<boolean> {
    await api.delete(`/admin/coupons/${id}`)
    return true
  },
}
