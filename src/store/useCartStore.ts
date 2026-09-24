import { create } from 'zustand'
import type { CartItem, CartSummary, Coupon, Product, ProductVariant } from '@/types'

const STORAGE_KEY_CART = 'nova_cart_items'
const STORAGE_KEY_COUPON = 'nova_applied_coupon'

interface CartState {
  items: CartItem[]
  appliedCoupon: Coupon | null
  isCartDrawerOpen: boolean

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
}

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CART)
    if (raw) return JSON.parse(raw)
    // Sample pre-loaded cart item for instant testing
    return [
      {
        id: 'cart-init-1',
        productId: 'prod-5',
        productName: 'Sony WH-1000XM5 Tai Nghe Chống Ồn Cao Cấp - Đen',
        productSlug: 'sony-wh-1000xm5-chong-on',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop',
        price: 6990000,
        originalPrice: 8490000,
        quantity: 1,
        selectedVariant: {
          id: 'v-5-1',
          name: 'Đen Huyền Bí',
          type: 'color',
          value: '#111827',
          priceModifier: 0,
          inStock: true,
          sku: 'SONY-XM5-BLK',
        },
        stock: 45,
      },
    ]
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

export const useCartStore = create<CartState>((set, get) => ({
  items: loadInitialCart(),
  appliedCoupon: loadInitialCoupon(),
  isCartDrawerOpen: false,

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
  },

  removeItem: (itemId: string) => {
    const updated = get().items.filter((item) => item.id !== itemId)
    saveCartToStorage(updated)
    set({ items: updated })
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
  },

  clearCart: () => {
    saveCartToStorage([])
    saveCouponToStorage(null)
    set({ items: [], appliedCoupon: null })
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
    let shippingFee = items.length === 0 ? 0 : subtotal >= 2000000 ? 0 : 30000

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

    // Safety clamps
    discountAmount = Math.min(discountAmount, subtotal + shippingFee)
    const total = Math.max(0, subtotal + shippingFee - discountAmount)

    return {
      subtotal,
      discountAmount,
      shippingFee,
      total,
      appliedCoupon,
    }
  },

  getItemCount: (): number => {
    return get().items.reduce((count, item) => count + item.quantity, 0)
  },
}))
