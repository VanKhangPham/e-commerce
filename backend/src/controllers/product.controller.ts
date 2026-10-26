import { Request, Response } from 'express';
import { ProductService } from '../services/product.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class ProductController {
  static listProducts = asyncHandler(async (req: Request, res: Response) => {
    const { products, pagination } = await ProductService.listProducts(req.query);
    return ApiResponse.success({
      res,
      data: products,
      pagination,
    });
  });

  static getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.getProductById(req.params.id);
    return ApiResponse.success({
      res,
      data: product,
    });
  });

  static getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.getProductBySlug(req.params.slug);
    return ApiResponse.success({
      res,
      data: product,
    });
  });

  static getRelatedProducts = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 4;
    const related = await ProductService.getRelatedProducts(req.params.id, limit);
    return ApiResponse.success({
      res,
      data: related,
    });
  });

  static getSearchSuggestions = asyncHandler(async (req: Request, res: Response) => {
    const keyword = String(req.query.q || req.query.keyword || '');
    const suggestions = await ProductService.getSearchSuggestions(keyword);
    return ApiResponse.success({
      res,
      data: suggestions,
    });
  });
}
