export interface ProductVariant {
  id: string
  name: string
  type: 'color' | 'size' | 'version'
  value: string
  priceModifier: number
  inStock: boolean
  sku: string
}

export interface ProductSpecification {
  name: string
  value: string
}

export interface ProductReview {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: string
  approved: boolean
  orderVerified: boolean
}

export interface Product {
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
  images: string[]
  thumbnail: string
  categoryId: string
  categoryName: string
  brand: string
  shortDescription: string
  description: string
  specifications: ProductSpecification[]
  variants: ProductVariant[]
  isFeatured?: boolean
  isBestSeller?: boolean
  isFlashSale?: boolean
  flashSaleEndsAt?: string
  tags: string[]
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  iconName?: string
  productCount: number
}
