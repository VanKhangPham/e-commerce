import { mockProducts, mockCategories } from '@/data'
import type { Category, FilterParams, PaginatedResult, Product } from '@/types'
import { fakeDelay, getStoredData, setStoredData } from './apiHelper'

const STORAGE_KEY_PRODUCTS = 'nova_products_data'
const STORAGE_KEY_CATEGORIES = 'nova_categories_data'

function loadProducts(): Product[] {
  return getStoredData<Product[]>(STORAGE_KEY_PRODUCTS, mockProducts)
}

function saveProducts(products: Product[]): void {
  setStoredData(STORAGE_KEY_PRODUCTS, products)
}

function loadCategories(): Category[] {
  return getStoredData<Category[]>(STORAGE_KEY_CATEGORIES, mockCategories)
}

function saveCategories(categories: Category[]): void {
  setStoredData(STORAGE_KEY_CATEGORIES, categories)
}

export const productService = {
  async getProducts(params?: FilterParams): Promise<PaginatedResult<Product>> {
    await fakeDelay(300)
    let list = loadProducts()

    if (params?.search) {
      const q = params.search.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (params?.categorySlug) {
      const cats = loadCategories()
      const targetCat = cats.find((c) => c.slug === params.categorySlug)
      if (targetCat) {
        list = list.filter((p) => p.categoryId === targetCat.id)
      }
    }

    if (params?.categoryId) {
      list = list.filter((p) => p.categoryId === params.categoryId)
    }

    if (params?.brand) {
      list = list.filter((p) => p.brand.toLowerCase() === params.brand?.toLowerCase())
    }

    if (params?.minPrice !== undefined) {
      list = list.filter((p) => p.price >= (params.minPrice ?? 0))
    }

    if (params?.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= (params.maxPrice ?? Infinity))
    }

    if (params?.rating !== undefined) {
      list = list.filter((p) => p.rating >= (params.rating ?? 0))
    }

    if (params?.inStockOnly) {
      list = list.filter((p) => p.stock > 0)
    }

    // Sorting
    switch (params?.sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating-desc':
        list.sort((a, b) => b.rating - a.rating)
        break
      case 'popularity':
        list.sort((a, b) => b.soldCount - a.soldCount)
        break
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    const page = params?.page || 1
    const limit = params?.limit || 12
    const totalItems = list.length
    const totalPages = Math.ceil(totalItems / limit)
    const startIndex = (page - 1) * limit
    const items = list.slice(startIndex, startIndex + limit)

    return {
      items,
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    await fakeDelay(250)
    const list = loadProducts()
    return list.find((p) => p.slug === slug) || null
  },

  async getProductById(id: string): Promise<Product | null> {
    await fakeDelay(200)
    const list = loadProducts()
    return list.find((p) => p.id === id) || null
  },

  async getFeaturedProducts(): Promise<Product[]> {
    await fakeDelay(200)
    const list = loadProducts()
    return list.filter((p) => p.isFeatured).slice(0, 8)
  },

  async getBestSellerProducts(): Promise<Product[]> {
    await fakeDelay(200)
    const list = loadProducts()
    return list.filter((p) => p.isBestSeller).slice(0, 8)
  },

  async getFlashSaleProducts(): Promise<Product[]> {
    await fakeDelay(200)
    const list = loadProducts()
    return list.filter((p) => p.isFlashSale).slice(0, 6)
  },

  async getRelatedProducts(productId: string, categoryId: string, limit = 4): Promise<Product[]> {
    await fakeDelay(200)
    const list = loadProducts()
    return list
      .filter((p) => p.id !== productId && p.categoryId === categoryId)
      .slice(0, limit)
  },

  async getCategories(): Promise<Category[]> {
    await fakeDelay(150)
    const categories = loadCategories()
    const products = loadProducts()
    // dynamically compute productCount
    return categories.map((cat) => ({
      ...cat,
      productCount: products.filter((p) => p.categoryId === cat.id).length,
    }))
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    await fakeDelay(150)
    const categories = await this.getCategories()
    return categories.find((c) => c.slug === slug) || null
  },

  // Admin CRUD for Products
  async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    await fakeDelay(400)
    const list = loadProducts()
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    list.unshift(newProduct)
    saveProducts(list)
    return newProduct
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await fakeDelay(400)
    const list = loadProducts()
    const index = list.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error('Sản phẩm không tồn tại')
    }
    list[index] = { ...list[index], ...updates }
    saveProducts(list)
    return list[index]
  },

  async deleteProduct(id: string): Promise<boolean> {
    await fakeDelay(300)
    const list = loadProducts()
    const filtered = list.filter((p) => p.id !== id)
    saveProducts(filtered)
    return true
  },

  // Admin CRUD for Categories
  async createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    await fakeDelay(300)
    const list = loadCategories()
    const newCat: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    }
    list.push(newCat)
    saveCategories(list)
    return newCat
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    await fakeDelay(300)
    const list = loadCategories()
    const index = list.findIndex((c) => c.id === id)
    if (index === -1) {
      throw new Error('Danh mục không tồn tại')
    }
    list[index] = { ...list[index], ...updates }
    saveCategories(list)
    return list[index]
  },

  async deleteCategory(id: string): Promise<boolean> {
    await fakeDelay(300)
    const list = loadCategories()
    const filtered = list.filter((c) => c.id !== id)
    saveCategories(filtered)
    return true
  },
}
