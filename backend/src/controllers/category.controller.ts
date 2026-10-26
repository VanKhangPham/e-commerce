import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class CategoryController {
  static getAllCategories = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await CategoryService.getAllCategories();
    return ApiResponse.success({
      res,
      data: categories,
    });
  });

  static getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
    const category = await CategoryService.getCategoryBySlug(req.params.slug);
    return ApiResponse.success({
      res,
      data: category,
    });
  });
}
