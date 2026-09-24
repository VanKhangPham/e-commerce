export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  items: T[]
  totalItems: number
  totalPages: number
  currentPage: number
  limit: number
}

export type SortOption =
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'popularity'

export interface FilterParams {
  categorySlug?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  rating?: number
  inStockOnly?: boolean
  search?: string
  sortBy?: SortOption
  page?: number
  limit?: number
}
