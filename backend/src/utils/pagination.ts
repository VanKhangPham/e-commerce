import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../config/constants.js';
import { PaginationMeta } from './ApiResponse.js';

export interface PaginationParams {
  page?: string | number;
  limit?: string | number;
}

export const getPagination = (params: PaginationParams) => {
  const page = Math.max(1, parseInt(String(params.page || DEFAULT_PAGE), 10) || DEFAULT_PAGE);
  const rawLimit = parseInt(String(params.limit || DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
  const limit = Math.min(Math.max(1, rawLimit), MAX_LIMIT);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const createPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
};
