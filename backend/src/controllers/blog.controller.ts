import { Request, Response } from 'express';
import { BlogService } from '../services/blog.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class BlogController {
  static listPosts = asyncHandler(async (req: Request, res: Response) => {
    const { posts, pagination } = await BlogService.listPosts(req.query);
    return ApiResponse.success({
      res,
      data: posts,
      pagination,
    });
  });

  static getPostBySlug = asyncHandler(async (req: Request, res: Response) => {
    const post = await BlogService.getPostBySlug(req.params.slug);
    return ApiResponse.success({
      res,
      data: post,
    });
  });
}
