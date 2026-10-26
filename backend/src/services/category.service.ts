import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';

export class CategoryService {
  // 1. Get all categories with product count
  static async getAllCategories() {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      productCount: c._count.products,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }

  // 2. Get category by slug
  static async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw ApiError.notFound('Không tìm thấy danh mục yêu cầu');
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      productCount: category._count.products,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
