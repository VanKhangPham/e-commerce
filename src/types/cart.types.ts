import type { ProductVariant } from './product.types'

export interface CartItem {
  id: string
  productId: string
  productName: string
  productSlug: string
  image: string
  price: number
  originalPrice: number
  quantity: number
  selectedVariant?: ProductVariant
  stock: number
}

export interface Coupon {
  id: string
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minOrderValue: number
  maxDiscount?: number
  expiryDate: string
  usageLimit: number
  usageCount: number
  isActive: boolean
}

export interface CartSummary {
  subtotal: number
  discountAmount: number
  shippingFee: number
  total: number
  appliedCoupon?: Coupon | null
}
