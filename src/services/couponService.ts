import { mockCoupons } from '@/data'
import type { Coupon } from '@/types'
import { fakeDelay, getStoredData, setStoredData } from './apiHelper'

const STORAGE_KEY_COUPONS = 'nova_coupons_data'

function loadCoupons(): Coupon[] {
  return getStoredData<Coupon[]>(STORAGE_KEY_COUPONS, mockCoupons)
}

function saveCoupons(coupons: Coupon[]): void {
  setStoredData(STORAGE_KEY_COUPONS, coupons)
}

export const couponService = {
  async getCoupons(): Promise<Coupon[]> {
    await fakeDelay(200)
    return loadCoupons()
  },

  async validateCoupon(
    code: string,
    orderTotal: number
  ): Promise<{
    isValid: boolean
    coupon?: Coupon
    discountAmount: number
    message: string
  }> {
    await fakeDelay(250)
    const list = loadCoupons()
    const cleanCode = code.trim().toUpperCase()
    const found = list.find((c) => c.code.toUpperCase() === cleanCode)

    if (!found) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'Mã giảm giá không tồn tại hoặc đã hết hạn.',
      }
    }

    if (!found.isActive) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'Mã giảm giá hiện đang tạm ngưng sử dụng.',
      }
    }

    const now = new Date()
    const expiry = new Date(found.expiryDate)
    if (now > expiry) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'Mã giảm giá đã quá hạn sử dụng.',
      }
    }

    if (found.usageCount >= found.usageLimit) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'Mã giảm giá đã hết lượt sử dụng.',
      }
    }

    if (orderTotal < found.minOrderValue) {
      return {
        isValid: false,
        discountAmount: 0,
        message: `Đơn hàng tối thiểu để áp dụng mã là ${new Intl.NumberFormat('vi-VN').format(found.minOrderValue)}₫`,
      }
    }

    let discount = 0
    if (found.discountType === 'percentage') {
      discount = (orderTotal * found.discountValue) / 100
      if (found.maxDiscount && discount > found.maxDiscount) {
        discount = found.maxDiscount
      }
    } else {
      discount = found.discountValue
    }

    // Discount cannot exceed order total
    discount = Math.min(discount, orderTotal)

    return {
      isValid: true,
      coupon: found,
      discountAmount: discount,
      message: 'Áp dụng mã giảm giá thành công!',
    }
  },

  async createCoupon(data: Omit<Coupon, 'id' | 'usageCount'>): Promise<Coupon> {
    await fakeDelay(350)
    const list = loadCoupons()
    const newCoupon: Coupon = {
      ...data,
      id: `c-${Date.now()}`,
      code: data.code.trim().toUpperCase(),
      usageCount: 0,
    }
    list.unshift(newCoupon)
    saveCoupons(list)
    return newCoupon
  },

  async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
    await fakeDelay(300)
    const list = loadCoupons()
    const index = list.findIndex((c) => c.id === id)
    if (index === -1) {
      throw new Error('Mã giảm giá không tồn tại')
    }
    list[index] = { ...list[index], ...updates }
    saveCoupons(list)
    return list[index]
  },

  async deleteCoupon(id: string): Promise<boolean> {
    await fakeDelay(250)
    const list = loadCoupons()
    const filtered = list.filter((c) => c.id !== id)
    saveCoupons(filtered)
    return true
  },
}
