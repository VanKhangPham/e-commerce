import { create } from 'zustand'
import { authService } from '@/services'
import { api } from '@/services/httpClient'
import type { AuthSession, UserProfile, UserRole } from '@/types'

const STORAGE_KEY_AUTH = 'nova_auth_session'

interface AuthState {
  currentUser: UserProfile | null
  token: string | null
  refreshToken: string | null
  role: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (email: string, pass: string, role?: UserRole) => Promise<UserProfile>
  loginDemo: (role: 'user' | 'admin') => Promise<UserProfile>
  register: (name: string, email: string, pass: string, phone: string) => Promise<UserProfile>
  logout: () => void
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
}

interface StoredSession extends AuthSession {
  refreshToken?: string
}

function loadInitialSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH)
    if (!raw) return null
    const session = JSON.parse(raw) as StoredSession
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(STORAGE_KEY_AUTH)
      return null
    }
    return session
  } catch {
    return null
  }
}

const initialSession = loadInitialSession()

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: initialSession?.user || null,
  token: initialSession?.token || null,
  refreshToken: initialSession?.refreshToken || null,
  role: initialSession?.role || null,
  isAuthenticated: !!initialSession?.token,
  isLoading: false,

  login: async (email: string, pass: string, role?: UserRole) => {
    set({ isLoading: true })
    try {
      const res = await authService.login(email, pass, role)
      const session: StoredSession = {
        token: res.token,
        refreshToken: res.refreshToken,
        user: res.user,
        role: res.user.role,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      }
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session))
      set({
        currentUser: res.user,
        token: res.token,
        refreshToken: res.refreshToken,
        role: res.user.role,
        isAuthenticated: true,
        isLoading: false,
      })
      return res.user
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  loginDemo: async (role: 'user' | 'admin') => {
    set({ isLoading: true })
    try {
      const email = role === 'admin' ? 'admin@nova.vn' : 'user@nova.vn'
      const pass = role === 'admin' ? 'admin123' : 'user123'
      const res = await authService.login(email, pass, role)
      const session: StoredSession = {
        token: res.token,
        refreshToken: res.refreshToken,
        user: res.user,
        role: res.user.role,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      }
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session))
      set({
        currentUser: res.user,
        token: res.token,
        refreshToken: res.refreshToken,
        role: res.user.role,
        isAuthenticated: true,
        isLoading: false,
      })
      return res.user
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (name: string, email: string, pass: string, phone: string) => {
    set({ isLoading: true })
    try {
      const res = await authService.register({ name, email, password: pass, phone })
      const session: StoredSession = {
        token: res.token,
        refreshToken: res.refreshToken,
        user: res.user,
        role: res.user.role,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      }
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session))
      set({
        currentUser: res.user,
        token: res.token,
        refreshToken: res.refreshToken,
        role: res.user.role,
        isAuthenticated: true,
        isLoading: false,
      })
      return res.user
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    // Attempt server-side logout (fire-and-forget)
    const currentRefreshToken = get().refreshToken
    if (currentRefreshToken) {
      api.post('/auth/logout', { refreshToken: currentRefreshToken }).catch(() => {
        // Ignore errors — we're logging out anyway
      })
    }

    localStorage.removeItem(STORAGE_KEY_AUTH)
    set({
      currentUser: null,
      token: null,
      refreshToken: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },

  updateUserProfile: async (updates: Partial<UserProfile>) => {
    const user = get().currentUser
    if (!user) return
    set({ isLoading: true })
    try {
      const updatedUser = await authService.updateProfile(user.id, updates)
      const session = loadInitialSession()
      if (session) {
        session.user = updatedUser
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session))
      }
      set({ currentUser: updatedUser, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
}))
