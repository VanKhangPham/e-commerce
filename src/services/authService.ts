import { mockUsers, type MockUserRecord } from '@/data'
import type { UserProfile, UserRole } from '@/types'
import { fakeDelay, getStoredData, setStoredData } from './apiHelper'

const STORAGE_KEY_USERS = 'nova_users_accounts'

function loadUsers(): MockUserRecord[] {
  return getStoredData<MockUserRecord[]>(STORAGE_KEY_USERS, mockUsers)
}

function saveUsers(users: MockUserRecord[]): void {
  setStoredData(STORAGE_KEY_USERS, users)
}

export const authService = {
  async login(
    email: string,
    pass: string,
    expectedRole?: UserRole
  ): Promise<{ user: UserProfile; token: string }> {
    await fakeDelay(400)
    const list = loadUsers()
    const cleanEmail = email.trim().toLowerCase()

    const found = list.find((u) => u.email.toLowerCase() === cleanEmail)
    if (!found) {
      throw new Error('Email hoặc mật khẩu không chính xác.')
    }

    if (found.passwordHash !== pass) {
      throw new Error('Email hoặc mật khẩu không chính xác.')
    }

    if (expectedRole && found.role !== expectedRole) {
      if (expectedRole === 'admin') {
        throw new Error('Tài khoản này không có quyền truy cập khu vực Quản trị.')
      } else {
        throw new Error('Tài khoản không phù hợp với phân hệ khách hàng.')
      }
    }

    // Strip passwordHash before returning
    const { passwordHash: _, ...userProfile } = found
    const token = `mock-jwt-token-${userProfile.id}-${Date.now()}`

    return { user: userProfile, token }
  },

  async register(data: {
    name: string
    email: string
    password: string
    phone: string
  }): Promise<{ user: UserProfile; token: string }> {
    await fakeDelay(500)
    const list = loadUsers()
    const cleanEmail = data.email.trim().toLowerCase()

    const exists = list.some((u) => u.email.toLowerCase() === cleanEmail)
    if (exists) {
      throw new Error('Email này đã được sử dụng để đăng ký tài khoản.')
    }

    const newUser: MockUserRecord = {
      id: `usr-customer-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      passwordHash: data.password,
      phone: data.phone.trim(),
      role: 'user',
      addresses: [],
      createdAt: new Date().toISOString(),
    }

    list.push(newUser)
    saveUsers(list)

    const { passwordHash: _, ...userProfile } = newUser
    const token = `mock-jwt-token-${userProfile.id}-${Date.now()}`

    return { user: userProfile, token }
  },

  async forgotPassword(email: string): Promise<boolean> {
    await fakeDelay(400)
    const list = loadUsers()
    const cleanEmail = email.trim().toLowerCase()
    const found = list.some((u) => u.email.toLowerCase() === cleanEmail)
    if (!found) {
      throw new Error('Email không tồn tại trên hệ thống NOVA.')
    }
    return true
  },

  async changePassword(userId: string, oldPass: string, newPass: string): Promise<boolean> {
    await fakeDelay(400)
    const list = loadUsers()
    const index = list.findIndex((u) => u.id === userId)
    if (index === -1) {
      throw new Error('Tài khoản không tồn tại.')
    }

    if (list[index].passwordHash !== oldPass) {
      throw new Error('Mật khẩu hiện tại không đúng.')
    }

    list[index].passwordHash = newPass
    saveUsers(list)
    return true
  },

  async getUsers(): Promise<UserProfile[]> {
    await fakeDelay(250)
    const list = loadUsers()
    return list.map(({ passwordHash: _, ...profile }) => profile)
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    await fakeDelay(350)
    const list = loadUsers()
    const index = list.findIndex((u) => u.id === userId)
    if (index === -1) {
      throw new Error('Không tìm thấy thông tin người dùng.')
    }

    const updated = {
      ...list[index],
      ...updates,
    }

    list[index] = updated
    saveUsers(list)

    const { passwordHash: _, ...profile } = updated
    return profile
  },
}
