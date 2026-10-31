import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination, createPaginationMeta } from '../utils/pagination.js';

export interface ProductFilterQuery {
  page?: string | number;
  limit?: string | number;
  search?: string;
  category?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  rating?: string | number;
  sort?: string;
  isFeatured?: string | boolean;
  isFlashSale?: string | boolean;
}

export class ProductService {
  // 1. List Products with search, filters, sort, pagination
  static async listProducts(query: ProductFilterQuery) {
    const { page, limit, skip } = getPagination(query);

    const where: Prisma.ProductWhereInput = {};

    // Search by name or brand or tag
    if (query.search && query.search.trim() !== '') {
      const keyword = query.search.trim();
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { brand: { contains: keyword, mode: 'insensitive' } },
        { tags: { has: keyword } },
      ];
    }

    // Category filter by ID or slug
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    } else if (query.category) {
      where.category = { slug: query.category };
    }

    // Brand filter
    if (query.brand) {
      where.brand = { equals: query.brand, mode: 'insensitive' };
    }

    // Price range filter
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = parseInt(String(query.minPrice), 10);
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = parseInt(String(query.maxPrice), 10);
      }
    }

    // Rating filter
    if (query.rating !== undefined) {
      where.rating = { gte: parseFloat(String(query.rating)) };
    }

    // Featured filter
    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured === true || query.isFeatured === 'true';
    }

    // Flash sale filter
    if (query.isFlashSale !== undefined) {
      where.isFlashSale = query.isFlashSale === true || query.isFlashSale === 'true';
    }

    // Sort options
    let orderBy: Prisma.ProductOrderByWithRelationInput;
    switch (query.sort) {
      case 'price-asc':
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'popular':
      case 'best-seller':
        orderBy = { soldCount: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: { order: 'asc' },
          },
          variants: true,
          specifications: true,
        },
      }),
    ]);

    // Format products to match frontend Product interface
    const formattedProducts = products.map((p) => ({
      ...p,
      categoryName: p.category.name,
      images: p.images.map((img) => img.url),
    }));

    const pagination = createPaginationMeta(total, page, limit);

    return {
      products: formattedProducts,
      pagination,
    };
  }

  // 2. Get Product Detail by ID
  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        variants: true,
        specifications: true,
        reviews: {
          where: { approved: true },
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw ApiError.notFound('Không tìm thấy sản phẩm yêu cầu');
    }

    return {
      ...product,
      categoryName: product.category.name,
      images: product.images.map((img) => img.url),
    };
  }

  // 3. Get Product Detail by Slug
  static async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        variants: true,
        specifications: true,
        reviews: {
          where: { approved: true },
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw ApiError.notFound('Không tìm thấy sản phẩm với slug này');
    }

    return {
      ...product,
      categoryName: product.category.name,
      images: product.images.map((img) => img.url),
    };
  }

  // 4. Get Related Products
  static async getRelatedProducts(productId: string, limit = 4) {
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    });

    if (!currentProduct) {
      throw ApiError.notFound('Không tìm thấy sản phẩm');
    }

    const related = await prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId,
        id: { not: productId },
      },
      take: limit,
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        variants: true,
        specifications: true,
      },
    });

    return related.map((p) => ({
      ...p,
      categoryName: p.category.name,
      images: p.images.map((img) => img.url),
    }));
  }

  // 5. Search Suggestions
  static async getSearchSuggestions(keyword: string) {
    if (!keyword || keyword.trim() === '') {
      return [];
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: keyword.trim(), mode: 'insensitive' } },
          { brand: { contains: keyword.trim(), mode: 'insensitive' } },
        ],
      },
      take: 6,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        thumbnail: true,
        brand: true,
      },
    });

    return products;
  }
}
