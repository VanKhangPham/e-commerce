import type { Category, FilterParams, PaginatedResult, Product } from '@/types'
import { api, HttpError } from './httpClient'

interface BackendProductRaw {
  id: string
  name: string
  slug: string
  price: number
  originalPrice: number
  discountPercentage: number
  rating: number
  reviewCount: number
  stock: number
  soldCount: number
  images: Array<string | { url: string }>
  thumbnail: string
  categoryId: string
  categoryName?: string
  category?: { id: string; name: string; slug: string }
  brand: string
  shortDescription: string
  description: string
  specifications?: Array<{ name: string; value: string }>
  variants?: Array<{
    id: string
    name: string
    type: string
    value: string
    priceModifier: number
    inStock: boolean
    sku?: string | null
  }>
  isFeatured?: boolean
  isBestSeller?: boolean
  isFlashSale?: boolean
  flashSaleEndsAt?: string | null
  tags?: string[]
  createdAt: string
}

function formatProduct(p: BackendProductRaw): Product {
  const normalizedImages: string[] = (p.images || []).map((img) =>
    typeof img === 'string' ? img : img.url
  )

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    originalPrice: p.originalPrice || p.price,
    discountPercentage: p.discountPercentage || 0,
    rating: p.rating || 5,
    reviewCount: p.reviewCount || 0,
    stock: p.stock || 0,
    soldCount: p.soldCount || 0,
    images: normalizedImages.length > 0 ? normalizedImages : [p.thumbnail],
    thumbnail: p.thumbnail,
    categoryId: p.categoryId,
    categoryName: p.categoryName || p.category?.name || 'Khác',
    brand: p.brand || 'NOVA',
    shortDescription: p.shortDescription || '',
    description: p.description || '',
    specifications: (p.specifications || []).map((s) => ({
      name: s.name,
      value: s.value,
    })),
    variants: (p.variants || []).map((v) => ({
      id: v.id,
      name: v.name,
      type: v.type.toLowerCase() as 'color' | 'size' | 'version',
      value: v.value,
      priceModifier: v.priceModifier || 0,
      inStock: Boolean(v.inStock),
      sku: v.sku || undefined,
    })),
    isFeatured: Boolean(p.isFeatured),
    isBestSeller: Boolean(p.isBestSeller),
    isFlashSale: Boolean(p.isFlashSale),
    flashSaleEndsAt: p.flashSaleEndsAt || undefined,
    tags: p.tags || [],
    createdAt: p.createdAt || new Date().toISOString(),
  }
}

interface BackendCategoryRaw {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  iconName?: string | null
  productCount?: number
  _count?: { products: number }
}

function formatCategory(c: BackendCategoryRaw): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || undefined,
    image: c.image || undefined,
    iconName: c.iconName || 'Smartphone',
    productCount: c.productCount ?? c._count?.products ?? 0,
  }
}

export const productService = {
  /**
   * Fetch paginated products with search, filter, and sorting
   */
  async getProducts(params?: FilterParams): Promise<PaginatedResult<Product>> {
    const q = new URLSearchParams()

    if (params?.page) q.set('page', String(params.page))
    if (params?.limit) q.set('limit', String(params.limit))
    if (params?.search) q.set('search', params.search)
    if (params?.categoryId) q.set('categoryId', params.categoryId)
    if (params?.categorySlug) q.set('category', params.categorySlug)
    if (params?.brand) q.set('brand', params.brand)
    if (params?.minPrice !== undefined) q.set('minPrice', String(params.minPrice))
    if (params?.maxPrice !== undefined) q.set('maxPrice', String(params.maxPrice))
    if (params?.rating !== undefined) q.set('rating', String(params.rating))

    // Sort mapping
    if (params?.sortBy) {
      const sortMap: Record<string, string> = {
        'price-asc': 'price-asc',
        'price-desc': 'price-desc',
        'rating-desc': 'rating',
        popularity: 'popular',
        newest: 'newest',
      }
      q.set('sort', sortMap[params.sortBy] || 'newest')
    }

    const endpoint = `/products?${q.toString()}`
    const res = await api.get<BackendProductRaw[]>(endpoint)

    const items = (res.data || []).map(formatProduct)
    const pagination = res.pagination

    return {
      items,
      totalItems: pagination?.total || items.length,
      totalPages: pagination?.totalPages || 1,
      currentPage: pagination?.page || 1,
      limit: pagination?.limit || params?.limit || 12,
    }
  },

  /**
   * Get single product by slug
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const res = await api.get<BackendProductRaw>(`/products/slug/${slug}`)
      return formatProduct(res.data)
    } catch (err: unknown) {
      if (err instanceof HttpError && err.statusCode === 404) {
        return null
      }
      throw err
    }
  },

  /**
   * Get single product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await api.get<BackendProductRaw>(`/products/${id}`)
      return formatProduct(res.data)
    } catch (err: unknown) {
      if (err instanceof HttpError && err.statusCode === 404) {
        return null
      }
      throw err
    }
  },

  /**
   * Get featured products for homepage
   */
  async getFeaturedProducts(): Promise<Product[]> {
    const res = await api.get<BackendProductRaw[]>('/products?isFeatured=true&limit=8')
    return (res.data || []).map(formatProduct)
  },

  /**
   * Get best seller products for homepage
   */
  async getBestSellerProducts(): Promise<Product[]> {
    const res = await api.get<BackendProductRaw[]>('/products?sort=popular&limit=8')
    return (res.data || []).map(formatProduct)
  },

  /**
   * Get flash sale products
   */
  async getFlashSaleProducts(): Promise<Product[]> {
    const res = await api.get<BackendProductRaw[]>('/products?isFlashSale=true&limit=6')
    return (res.data || []).map(formatProduct)
  },

  /**
   * Get related products
   */
  async getRelatedProducts(productId: string, _categoryId?: string, limit = 4): Promise<Product[]> {
    try {
      const res = await api.get<BackendProductRaw[]>(`/products/${productId}/related?limit=${limit}`)
      return (res.data || []).map(formatProduct)
    } catch {
      return []
    }
  },

  /**
   * Get all product categories
   */
  async getCategories(): Promise<Category[]> {
    const res = await api.get<BackendCategoryRaw[]>('/categories')
    return (res.data || []).map(formatCategory)
  },

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const res = await api.get<BackendCategoryRaw>(`/categories/${slug}`)
      return formatCategory(res.data)
    } catch (err: unknown) {
      if (err instanceof HttpError && err.statusCode === 404) {
        return null
      }
      throw err
    }
  },

  // --- Admin CRUD Operations ---

  /**
   * Admin: Create new product
   */
  async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const payload = {
      name: productData.name,
      slug: productData.slug,
      price: productData.price,
      originalPrice: productData.originalPrice,
      categoryId: productData.categoryId,
      brand: productData.brand,
      shortDescription: productData.shortDescription,
      description: productData.description,
      stock: productData.stock,
      thumbnail: productData.thumbnail || productData.images[0],
      isFeatured: Boolean(productData.isFeatured),
      isBestSeller: Boolean(productData.isBestSeller),
      isFlashSale: Boolean(productData.isFlashSale),
      tags: productData.tags || [],
      images: (productData.images || []).map((url, idx) => ({
        url,
        order: idx,
        isPrimary: idx === 0,
      })),
      variants: (productData.variants || []).map((v) => ({
        name: v.name,
        type: (v.type?.toUpperCase() === 'SIZE' || v.type?.toUpperCase() === 'VERSION' ? v.type.toUpperCase() : 'COLOR'),
        value: v.value,
        priceModifier: v.priceModifier || 0,
        inStock: v.inStock ?? true,
        sku: v.sku || null,
      })),
      specifications: productData.specifications || [],
    }

    const res = await api.post<BackendProductRaw>('/admin/products', payload)
    return formatProduct(res.data)
  },

  /**
   * Admin: Update product
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const payload: Record<string, unknown> = { ...updates }

    if (updates.images) {
      payload.images = updates.images.map((url, idx) => ({
        url,
        order: idx,
        isPrimary: idx === 0,
      }))
    }

    if (updates.variants) {
      payload.variants = updates.variants.map((v) => ({
        name: v.name,
        type: (v.type?.toUpperCase() === 'SIZE' || v.type?.toUpperCase() === 'VERSION' ? v.type.toUpperCase() : 'COLOR'),
        value: v.value,
        priceModifier: v.priceModifier || 0,
        inStock: v.inStock ?? true,
        sku: v.sku || null,
      }))
    }

    const res = await api.put<BackendProductRaw>(`/admin/products/${id}`, payload)
    return formatProduct(res.data)
  },

  /**
   * Admin: Delete product
   */
  async deleteProduct(id: string): Promise<boolean> {
    await api.delete(`/admin/products/${id}`)
    return true
  },

  /**
   * Admin: Create category
   */
  async createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    const res = await api.post<BackendCategoryRaw>('/admin/categories', {
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description || null,
      image: categoryData.image || null,
    })
    return formatCategory(res.data)
  },

  /**
   * Admin: Update category
   */
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const res = await api.put<BackendCategoryRaw>(`/admin/categories/${id}`, updates)
    return formatCategory(res.data)
  },

  /**
   * Admin: Delete category
   */
  async deleteCategory(id: string): Promise<boolean> {
    await api.delete(`/admin/categories/${id}`)
    return true
  },
}
