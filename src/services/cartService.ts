import { api } from './httpClient'

export interface BackendCartResponse {
  id: string
  items: Array<{
    id: string
    productId: string
    variantId?: string | null
    quantity: number
    product: {
      id: string
      name: string
      slug: string
      price: number
      originalPrice: number
      thumbnail: string
      stock: number
    }
    selectedVariant?: {
      id: string
      name: string
      value: string
      type: string
      priceModifier: number
    } | null
    unitPrice: number
    totalPrice: number
  }>
  totalQuantity: number
  subtotal: number
}

export interface BackendWishlistResponseItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    thumbnail: string
    categoryName?: string
  }
  createdAt: string
}

export const cartService = {
  /**
   * Fetch current user's cart from backend
   */
  async getCart(): Promise<BackendCartResponse> {
    const res = await api.get<BackendCartResponse>('/cart')
    return res.data
  },

  /**
   * Add item to backend cart
   */
  async addToCart(
    productId: string,
    variantId?: string | null,
    quantity = 1
  ): Promise<BackendCartResponse> {
    const res = await api.post<BackendCartResponse>('/cart', {
      productId,
      variantId: variantId || null,
      quantity,
    })
    return res.data
  },

  /**
   * Update item quantity in backend cart
   */
  async updateQuantity(itemId: string, quantity: number): Promise<BackendCartResponse> {
    const res = await api.put<BackendCartResponse>(`/cart/${itemId}`, { quantity })
    return res.data
  },

  /**
   * Remove item from backend cart
   */
  async removeFromCart(itemId: string): Promise<BackendCartResponse> {
    const res = await api.delete<BackendCartResponse>(`/cart/${itemId}`)
    return res.data
  },

  /**
   * Clear entire backend cart
   */
  async clearCart(): Promise<void> {
    await api.delete('/cart')
  },

  /**
   * Fetch user's wishlist product IDs from backend
   */
  async getWishlist(): Promise<string[]> {
    const res = await api.get<BackendWishlistResponseItem[]>('/wishlist')
    return (res.data || []).map((item) => item.productId)
  },

  /**
   * Add product to backend wishlist
   */
  async addToWishlist(productId: string): Promise<void> {
    await api.post('/wishlist', { productId })
  },

  /**
   * Remove product from backend wishlist
   */
  async removeFromWishlist(productId: string): Promise<void> {
    await api.delete(`/wishlist/${productId}`)
  },
}
