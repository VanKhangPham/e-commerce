import type { Order, OrderItem, OrderStatus, OrderTimelineEvent, PaymentMethod, PaymentStatus, ShippingAddress } from '@/types'
import { api, getAuthToken, HttpError } from './httpClient'

interface BackendTimelineItem {
  status: string
  note: string
  createdAt: string
}

interface BackendOrderItem {
  id: string
  productId: string | null
  productName: string
  productSlug: string
  image: string
  price: number
  quantity: number
  selectedVariantName?: string | null
  totalPrice: number
}

interface BackendOrder {
  id: string
  orderNumber: string
  userId: string | null
  customerName: string
  customerPhone: string
  customerEmail: string
  shippingAddress: ShippingAddress
  items: BackendOrderItem[]
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  subtotal: number
  discountAmount: number
  shippingFee: number
  totalAmount: number
  couponCode?: string | null
  note?: string | null
  createdAt: string
  updatedAt: string
  timeline?: BackendTimelineItem[]
}

const statusMapToFrontend: Record<string, OrderStatus> = {
  PENDING: 'pending',
  CONFIRMED: 'processing',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

const statusMapToBackend: Record<OrderStatus, string> = {
  pending: 'PENDING',
  processing: 'CONFIRMED',
  shipping: 'SHIPPING',
  delivered: 'DELIVERED',
  cancelled: 'CANCELLED',
}

function formatOrder(o: BackendOrder): Order {
  const timeline: OrderTimelineEvent[] = (o.timeline || []).map((t) => ({
    status: statusMapToFrontend[t.status.toUpperCase()] || 'pending',
    timestamp: t.createdAt,
    note: t.note,
  }))

  const items: OrderItem[] = (o.items || []).map((item) => ({
    id: item.id,
    productId: item.productId || '',
    productName: item.productName,
    productSlug: item.productSlug,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    selectedVariantName: item.selectedVariantName || undefined,
    totalPrice: item.totalPrice,
  }))

  const rawStatus = o.orderStatus?.toUpperCase() || 'PENDING'
  const orderStatus: OrderStatus = statusMapToFrontend[rawStatus] || 'pending'

  return {
    id: o.id,
    orderNumber: o.orderNumber,
    customerId: o.userId || '',
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    customerEmail: o.customerEmail,
    shippingAddress: o.shippingAddress,
    items,
    paymentMethod: (o.paymentMethod?.toLowerCase() || 'cod') as PaymentMethod,
    paymentStatus: (o.paymentStatus?.toLowerCase() || 'pending') as PaymentStatus,
    orderStatus,
    subtotal: o.subtotal,
    discountAmount: o.discountAmount,
    shippingFee: o.shippingFee,
    totalAmount: o.totalAmount,
    couponCode: o.couponCode || undefined,
    note: o.note || undefined,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    timeline,
  }
}

function isCurrentSessionAdmin(): boolean {
  try {
    const raw = localStorage.getItem('nova_auth_session')
    if (!raw) return false
    const session = JSON.parse(raw)
    return session.role === 'admin'
  } catch {
    return false
  }
}

export const orderService = {
  /**
   * Fetch orders. Routes to /admin/orders if admin session, else /user/orders
   */
  async getOrders(userId?: string): Promise<Order[]> {
    const isAdmin = isCurrentSessionAdmin()
    const token = getAuthToken()

    if (!token) {
      return []
    }

    if (isAdmin && !userId) {
      const res = await api.get<BackendOrder[]>('/admin/orders?limit=100')
      return (res.data || []).map(formatOrder)
    } else {
      const res = await api.get<BackendOrder[]>('/user/orders?limit=50')
      const orders = (res.data || []).map(formatOrder)
      if (userId) {
        return orders.filter((o) => o.customerId === userId)
      }
      return orders
    }
  },

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    const isAdmin = isCurrentSessionAdmin()
    const endpoint = isAdmin ? `/admin/orders/${id}` : `/user/orders/${id}`

    try {
      const res = await api.get<BackendOrder>(endpoint)
      return formatOrder(res.data)
    } catch (err: unknown) {
      if (err instanceof HttpError && err.statusCode === 404) {
        return null
      }
      throw err
    }
  },

  /**
   * Get order by orderNumber
   */
  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const all = await this.getOrders()
    return all.find((o) => o.orderNumber === orderNumber) || null
  },

  /**
   * Create order from checkout
   */
  async createOrder(
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline'>
  ): Promise<Order> {
    const payload = {
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      shippingAddress: {
        fullName: orderData.shippingAddress.fullName,
        phone: orderData.shippingAddress.phone,
        email: orderData.shippingAddress.email || orderData.customerEmail,
        province: orderData.shippingAddress.province,
        district: orderData.shippingAddress.district,
        ward: orderData.shippingAddress.ward,
        addressDetail: orderData.shippingAddress.addressDetail,
      },
      paymentMethod: orderData.paymentMethod.toUpperCase(),
      couponCode: orderData.couponCode || null,
      note: orderData.note || null,
      items: (orderData.items || []).map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
      })),
    }

    const res = await api.post<BackendOrder>('/user/orders', payload)
    return formatOrder(res.data)
  },

  /**
   * Admin: Update order status
   */
  async updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
    const backendStatus = statusMapToBackend[status] || 'PENDING'
    const res = await api.patch<BackendOrder>(`/admin/orders/${id}/status`, {
      status: backendStatus,
      note,
    })
    return formatOrder(res.data)
  },

  /**
   * Customer: Cancel order
   */
  async cancelOrder(id: string, reason?: string): Promise<Order> {
    const res = await api.post<BackendOrder>(`/user/orders/${id}/cancel`, {
      reason,
    })
    return formatOrder(res.data)
  },
}
