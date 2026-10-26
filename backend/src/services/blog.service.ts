import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination, createPaginationMeta } from '../utils/pagination.js';

export class BlogService {
  static async listPosts(query: { page?: string; limit?: string; category?: string; search?: string }) {
    const { page, limit, skip } = getPagination(query);

    const where: Record<string, unknown> = {};

    if (query.category && query.category !== 'all') {
      where.category = query.category;
    }

    if (query.search && query.search.trim() !== '') {
      where.OR = [
        { title: { contains: query.search.trim(), mode: 'insensitive' } },
        { excerpt: { contains: query.search.trim(), mode: 'insensitive' } },
      ];
    }

    const [total, posts] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      posts,
      pagination: createPaginationMeta(total, page, limit),
    };
  }

  static async getPostBySlug(slug: string) {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      throw ApiError.notFound('Không tìm thấy bài viết yêu cầu');
    }

    return post;
  }
}
