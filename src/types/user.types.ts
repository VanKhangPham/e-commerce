export type UserRole = 'user' | 'admin'

export interface SavedAddress {
  id: string
  fullName: string
  phone: string
  province: string
  district: string
  ward: string
  addressDetail: string
  isDefault: boolean
}

export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  role: UserRole
  isBlocked?: boolean
  orderCount?: number
  totalSpent?: number
  addresses: SavedAddress[]
  createdAt: string
}

export interface AuthSession {
  token: string
  user: UserProfile
  role: UserRole
  expiresAt: number
}
