import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID không được để trống'),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug không được để trống'),
});

export const paginationQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
