import { mockOrders } from '@/data'
import type { Order, OrderStatus } from '@/types'
import { fakeDelay, getStoredData, setStoredData } from './apiHelper'

const STORAGE_KEY_ORDERS = 'nova_orders_data'

function loadOrders(): Order[] {
  return getStoredData<Order[]>(STORAGE_KEY_ORDERS, mockOrders)
}

function saveOrders(orders: Order[]): void {
  setStoredData(STORAGE_KEY_ORDERS, orders)
}

export const orderService = {
  async getOrders(userId?: string): Promise<Order[]> {
    await fakeDelay(300)
    const list = loadOrders()
    if (userId) {
      return list.filter((o) => o.customerId === userId)
    }
    return list
  },

  async getOrderById(id: string): Promise<Order | null> {
    await fakeDelay(200)
    const list = loadOrders()
    return list.find((o) => o.id === id) || null
  },

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    await fakeDelay(200)
    const list = loadOrders()
    return list.find((o) => o.orderNumber === orderNumber) || null
  },

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline'>): Promise<Order> {
    await fakeDelay(500)
    const list = loadOrders()
    const now = new Date()
    const timestampStr = now.toISOString()
    const dateCode = now.toISOString().slice(0, 10).replace(/-/g, '')
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const orderNumber = `NOVA-${dateCode}-${randomSuffix}`

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: timestampStr,
      updatedAt: timestampStr,
      timeline: [
        {
          status: 'pending',
          timestamp: timestampStr,
          note: 'Đơn hàng được khởi tạo thành công trên hệ thống',
        },
      ],
    }

    list.unshift(newOrder)
    saveOrders(list)
    return newOrder
  },

  async updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
    await fakeDelay(350)
    const list = loadOrders()
    const index = list.findIndex((o) => o.id === id)
    if (index === -1) {
      throw new Error('Đơn hàng không tồn tại')
    }

    const currentOrder = list[index]
    const timestamp = new Date().toISOString()
    const statusNoteMap: Record<OrderStatus, string> = {
      pending: 'Đơn hàng chờ xác nhận',
      processing: 'Đơn hàng đã được duyệt, kho NOVA đang đóng gói',
      shipping: 'Đơn hàng đã được bàn giao cho đơn vị vận chuyển',
      delivered: 'Giao hàng thành công tới khách hàng',
      cancelled: 'Đơn hàng đã bị hủy',
    }

    const updatedOrder: Order = {
      ...currentOrder,
      orderStatus: status,
      paymentStatus: status === 'delivered' ? 'paid' : currentOrder.paymentStatus,
      updatedAt: timestamp,
      timeline: [
        ...currentOrder.timeline,
        {
          status,
          timestamp,
          note: note || statusNoteMap[status] || `Trạng thái cập nhật: ${status}`,
        },
      ],
    }

    list[index] = updatedOrder
    saveOrders(list)
    return updatedOrder
  },
}
