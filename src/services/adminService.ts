import { api } from './httpClient'

export interface StoreSettings {
  storeName: string
  hotline: string
  email: string
  address: string
  slogan: string
  standardShippingFee: number
  freeShippingThreshold: number
  enableCOD: boolean
  enableBanking: boolean
  enableMoMo: boolean
  enableVNPay: boolean
  notifyOrderEmail: boolean
  notifyLowStock: boolean
  notifyAdminTelegram: boolean
}

export interface DashboardStats {
  kpis: {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number
    totalProducts: number
  }
  monthlyRevenue: Array<{ month: string; revenue: number }>
  categorySales: Array<{ name: string; sales: number; productCount: number }>
  topProducts: Array<{
    id: string
    name: string
    thumbnail: string
    price: number
    soldCount: number
    stock: number
  }>
  recentOrders: unknown[]
}

export const adminService = {
  /**
   * Get overall Dashboard KPIs & charts
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await api.get<DashboardStats>('/admin/dashboard')
    return res.data
  },

  /**
   * Get store settings
   */
  async getSettings(): Promise<StoreSettings> {
    const res = await api.get<StoreSettings>('/admin/settings')
    return res.data
  },

  /**
   * Update store settings
   */
  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const res = await api.put<StoreSettings>('/admin/settings', settings)
    return res.data
  },

  /**
   * Upload image to server
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', file)
    const res = await api.post<{ url: string }>('/admin/upload', formData)
    return res.data.url
  },
}
