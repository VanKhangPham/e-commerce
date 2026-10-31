import { create } from 'zustand'
import { cartService } from '@/services'
import { useAuthStore } from './useAuthStore'

const STORAGE_KEY = 'nova_wishlist_ids'

interface WishlistState {
  wishlistIds: string[]
  isLoading: boolean
  toggleWishlist: (productId: string) => boolean // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  syncWithBackend: () => Promise<void>
}

function loadInitialWishlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveWishlist(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch (e) {
    console.error('Failed to save wishlist:', e)
  }
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: loadInitialWishlist(),
  isLoading: false,

  syncWithBackend: async () => {
    const isAuth = useAuthStore.getState().isAuthenticated
    if (!isAuth) return

    set({ isLoading: true })
    try {
      // 1. Push any local wishlist items to server
      const localIds = get().wishlistIds
      for (const id of localIds) {
        try {
          await cartService.addToWishlist(id)
        } catch {
          // Ignore duplicates
        }
      }

      // 2. Fetch all user favorites from server
      const serverIds = await cartService.getWishlist()
      saveWishlist(serverIds)
      set({ wishlistIds: serverIds })
    } catch (err) {
      console.warn('Failed to sync wishlist with backend:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  toggleWishlist: (productId: string) => {
    const current = get().wishlistIds
    const exists = current.includes(productId)
    let updated: string[]

    if (exists) {
      updated = current.filter((id) => id !== productId)
    } else {
      updated = [...current, productId]
    }

    saveWishlist(updated)
    set({ wishlistIds: updated })

    // Sync to backend if authenticated
    const isAuth = useAuthStore.getState().isAuthenticated
    if (isAuth) {
      if (exists) {
        cartService.removeFromWishlist(productId).catch((e) => {
          console.warn('Failed to remove from backend wishlist:', e)
        })
      } else {
        cartService.addToWishlist(productId).catch((e) => {
          console.warn('Failed to add to backend wishlist:', e)
        })
      }
    }

    return !exists
  },

  isInWishlist: (productId: string) => {
    return get().wishlistIds.includes(productId)
  },

  clearWishlist: () => {
    saveWishlist([])
    set({ wishlistIds: [] })
  },
}))
