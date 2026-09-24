import { create } from 'zustand'

const STORAGE_KEY = 'nova_wishlist_ids'

interface WishlistState {
  wishlistIds: string[]
  toggleWishlist: (productId: string) => boolean // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

function loadInitialWishlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : ['prod-1', 'prod-5'] // default sample favorites
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
