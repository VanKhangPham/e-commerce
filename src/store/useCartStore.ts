import { create } from 'zustand'
import type { CartItem, CartSummary, Coupon, Product, ProductVariant } from '@/types'
import { cartService, type BackendCartResponse } from '@/services'
import { useAuthStore } from './useAuthStore'

const STORAGE_KEY_CART = 'nova_cart_items'
const STORAGE_KEY_COUPON = 'nova_applied_coupon'

interface CartState {
  items: CartItem[]
  appliedCoupon: Coupon | null
  isCartDrawerOpen: boolean
  isLoading: boolean

  // Actions
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
  openCartDrawer: () => void
  closeCartDrawer: () => void
  getSummary: () => CartSummary
  getItemCount: () => number
  syncWithBackend: () => Promise<void>
}

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CART)
    if (raw) return JSON.parse(raw)
    return []
  } catch {
    return []
  }
}

function loadInitialCoupon(): Coupon | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COUPON)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items))
  } catch (e) {
    console.error('Failed to save cart to storage:', e)
  }
}

function saveCouponToStorage(coupon: Coupon | null): void {
  try {
    if (coupon) {
      localStorage.setItem(STORAGE_KEY_COUPON, JSON.stringify(coupon))
    } else {
      localStorage.removeItem(STORAGE_KEY_COUPON)
    }
  } catch (e) {
    console.error('Failed to save coupon to storage:', e)
  }
}

function formatBackendCartItem(item: BackendCartResponse['items'][0]): CartItem {
  return {
    id: item.id,
    productId: item.productId,
    productName: item.product.name,
    productSlug: item.product.slug,
    image: item.product.thumbnail,
    price: item.unitPrice,
    originalPrice: item.product.originalPrice,
    quantity: item.quantity,
    selectedVariant: item.selectedVariant
      ? {
          id: item.selectedVariant.id,
          name: item.selectedVariant.name,
          type: item.selectedVariant.type.toLowerCase() as 'color' | 'size' | 'version',
          value: item.selectedVariant.value,
          priceModifier: item.selectedVariant.priceModifier,
          inStock: true,
          sku: '',
        }
      : undefined,
    stock: item.product.stock,
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadInitialCart(),
  appliedCoupon: loadInitialCoupon(),
  isCartDrawerOpen: false,
  isLoading: false,

  syncWithBackend: async () => {
    const isAuth = useAuthStore.getState().isAuthenticated
    if (!isAuth) return

    set({ isLoading: true })
    try {
      // 1. If we have local guest items, push them to backend
      const localItems = get().items
      if (localItems.length > 0) {
        for (const it of localItems) {
          try {
            await cartService.addToCart(it.productId, it.selectedVariant?.id, it.quantity)
          } catch {
            // Ignore duplicate/conflict errors during batch push
          }
        }
      }

      // 2. Fetch authoritative cart from server
      const serverCart = await cartService.getCart()
      const formatted = serverCart.items.map(formatBackendCartItem)
      saveCartToStorage(formatted)
      set({ items: formatted })
    } catch (err) {
      console.warn('Failed to sync cart with backend:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  addItem: (product: Product, variant?: ProductVariant, quantity = 1) => {
    const current = get().items
    const variantId = variant?.id || 'default'
    const finalPrice = product.price + (variant?.priceModifier || 0)
    const existingIndex = current.findIndex(
      (item) => item.productId === product.id && (item.selectedVariant?.id || 'default') === variantId
    )

    let updated: CartItem[]
    if (existingIndex > -1) {
      updated = [...current]
      const existing = updated[existingIndex]
      const newQty = Math.min(existing.quantity + quantity, product.stock)
      updated[existingIndex] = {
        ...existing,
        quantity: newQty,
      }
    } else {
      const newItem: CartItem = {
        id: `cart-${product.id}-${variantId}-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        image: product.thumbnail || product.images[0],
        price: finalPrice,
        originalPrice: product.originalPrice + (variant?.priceModifier || 0),
        quantity: Math.min(quantity, product.stock),
        selectedVariant: variant,
        stock: product.stock,
      }
      updated = [newItem, ...current]
    }

    saveCartToStorage(updated)
    set({ items: updated })

    // Sync to backend if logged in
    const isAuth = useAuthStore.getState().isAuthenticated
    if (isAuth) {
      cartService.addToCart(product.id, variant?.id, quantity).catch((e) => {
        console.warn('Failed to add item to backend cart:', e)
      })
    }
  },

  removeItem: (itemId: string) => {
    const updated = get().items.filter((item) => item.id !== itemId)
    saveCartToStorage(updated)
    set({ items: updated })

    const isAuth = useAuthStore.getState().isAuthenticated
    if (isAuth) {
      cartService.removeFromCart(itemId).catch((e) => {
        console.warn('Failed to remove item from backend cart:', e)
      })
    }
  },

  updateQuantity: (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(itemId)
      return
    }

    const updated = get().items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: Math.min(quantity, item.stock),
        }
      }
      return item
    })

    saveCartToStorage(updated)
    set({ items: updated })

    const isAuth = useAuthStore.getState().isAuthenticated
    if (isAuth) {
      cartService.updateQuantity(itemId, quantity).catch((e) => {
        console.warn('Failed to update quantity in backend cart:', e)
      })
    }
  },

  clearCart: () => {
    saveCartToStorage([])
    saveCouponToStorage(null)
    set({ items: [], appliedCoupon: null })

    const isAuth = useAuthStore.getState().isAuthenticated
    if (isAuth) {
      cartService.clearCart().catch((e) => {
        console.warn('Failed to clear backend cart:', e)
      })
    }
  },

  applyCoupon: (coupon: Coupon) => {
    saveCouponToStorage(coupon)
    set({ appliedCoupon: coupon })
  },

  removeCoupon: () => {
    saveCouponToStorage(null)
    set({ appliedCoupon: null })
  },

  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),

  getSummary: (): CartSummary => {
    const { items, appliedCoupon } = get()
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Base shipping fee: 30.000₫, free if subtotal >= 2.000.000₫ or cart empty
    const shippingFee = items.length === 0 ? 0 : subtotal >= 2000000 ? 0 : 30000

    let discountAmount = 0
    if (appliedCoupon && subtotal >= appliedCoupon.minOrderValue) {
      if (appliedCoupon.code === 'FREESHIP') {
        discountAmount = shippingFee
      } else if (appliedCoupon.discountType === 'percentage') {
        discountAmount = (subtotal * appliedCoupon.discountValue) / 100
        if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
          discountAmount = appliedCoupon.maxDiscount
        }
      } else {
        discountAmount = appliedCoupon.discountValue
      }
    }

    const total = Math.max(0, subtotal - discountAmount + shippingFee)

    return {
      subtotal,
      shippingFee,
      discountAmount,
      total,
      appliedCoupon: appliedCoupon || undefined,
    }
  },

  getItemCount: (): number => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0)
  },
}))
