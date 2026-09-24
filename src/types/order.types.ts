export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'

export type PaymentMethod = 'cod' | 'banking' | 'momo' | 'vnpay'

export type PaymentStatus = 'pending' | 'paid' | 'failed'

export interface ShippingAddress {
  fullName: string
  phone: string
  email: string
  province: string
  district: string
  ward: string
  addressDetail: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productSlug: string
  image: string
  price: number
  quantity: number
  selectedVariantName?: string
  totalPrice: number
}

export interface OrderTimelineEvent {
  status: OrderStatus
  timestamp: string
  note: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  shippingAddress: ShippingAddress
  items: OrderItem[]
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  subtotal: number
  discountAmount: number
  shippingFee: number
  totalAmount: number
  couponCode?: string
  note?: string
  createdAt: string
  updatedAt: string
  timeline: OrderTimelineEvent[]
}
