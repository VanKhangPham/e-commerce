import type { UserProfile, UserRole } from '@/types'
import { api, HttpError } from './httpClient'

interface BackendUser {
  id: string
  name: string
  email: string
  phone?: string | null
  avatar?: string | null
  role: string
  isBlocked?: boolean
  orderCount?: number
  totalSpent?: number
  addresses?: Array<{
    id: string
    fullName: string
    phone: string
    province: string
    district: string
    ward: string
    addressDetail: string
    isDefault: boolean
  }>
  createdAt: string
}

interface AuthResponse {
  user: BackendUser
  accessToken: string
  refreshToken: string
}

function formatUserProfile(u: BackendUser): UserProfile {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    avatar: u.avatar || undefined,
    role: (u.role?.toLowerCase() === 'admin' ? 'admin' : 'user') as UserRole,
    isBlocked: Boolean(u.isBlocked),
    orderCount: u.orderCount ?? 0,
    totalSpent: u.totalSpent ?? 0,
    addresses: (u.addresses || []).map((a) => ({
      id: a.id,
      fullName: a.fullName,
      phone: a.phone,
      province: a.province,
      district: a.district,
      ward: a.ward,
      addressDetail: a.addressDetail,
      isDefault: Boolean(a.isDefault),
    })),
    createdAt: u.createdAt || new Date().toISOString(),
  }
}

export const authService = {
  /**
   * Log in user or admin
   */
  async login(
    email: string,
    pass: string,
    expectedRole?: UserRole
  ): Promise<{ user: UserProfile; token: string; refreshToken: string }> {
    const isAdmin = expectedRole === 'admin'
    const endpoint = isAdmin ? '/admin/auth/login' : '/auth/login'

    const res = await api.post<AuthResponse>(endpoint, {
      email: email.trim().toLowerCase(),
      password: pass,
    })

    const user = formatUserProfile(res.data.user)
    return {
      user,
      token: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    }
  },

  /**
   * Register customer account
   */
  async register(data: {
    name: string
    email: string
    password: string
    phone: string
  }): Promise<{ user: UserProfile; token: string; refreshToken: string }> {
    const res = await api.post<AuthResponse>('/auth/register', {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      phone: data.phone.trim(),
    })

    const user = formatUserProfile(res.data.user)
    return {
      user,
      token: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    }
  },

  /**
   * Request password reset link
   */
  async forgotPassword(email: string): Promise<boolean> {
    await api.post('/auth/forgot-password', {
      email: email.trim().toLowerCase(),
    })
    return true
  },

  /**
   * Change current user's password
   */
  async changePassword(_userId: string, oldPass: string, newPass: string): Promise<boolean> {
    await api.put('/user/change-password', {
      currentPassword: oldPass,
      newPassword: newPass,
    })
    return true
  },

  /**
   * Get all registered customers for administration
   */
  async getUsers(): Promise<UserProfile[]> {
    try {
      const res = await api.get<BackendUser[]>('/admin/customers?limit=100')
      return res.data.map(formatUserProfile)
    } catch (err) {
      if (err instanceof HttpError && err.statusCode === 403) {
        return []
      }
      throw err
    }
  },

  /**
   * Toggle block/unblock a customer account
   */
  async toggleBlockCustomer(id: string): Promise<{ isBlocked: boolean; message: string }> {
    const res = await api.patch<{ isBlocked: boolean }>(`/admin/customers/${id}/toggle-block`)
    return {
      isBlocked: res.data.isBlocked,
      message: res.message || 'Thành công',
    }
  },

  /**
   * Fetch current user profile from server
   */
  async getProfile(): Promise<UserProfile> {
    const res = await api.get<BackendUser>('/user/profile')
    return formatUserProfile(res.data)
  },

  /**
   * Update current user profile
   */
  async updateProfile(_userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await api.put<BackendUser>('/user/profile', {
      name: updates.name,
      phone: updates.phone,
      avatar: updates.avatar,
    })
    return formatUserProfile(res.data)
  },
}
