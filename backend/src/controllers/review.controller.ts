import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export class ReviewController {
  // Public: Get reviews for a product
  static getProductReviews = asyncHandler(async (req: Request, res: Response) => {
    const reviews = await ReviewService.getProductReviews(req.params.productId);
    return ApiResponse.success({
      res,
      data: reviews,
    });
  });

  // Authenticated user: Create review
  static createReview = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const review = await ReviewService.createReview(req.user.id, req.body);
    return ApiResponse.created({
      res,
      message: 'Gửi đánh giá thành công! Cảm ơn nhận xét của bạn.',
      data: review,
    });
  });

  // Authenticated user: Update review
  static updateReview = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const updated = await ReviewService.updateReview(req.user.id, req.params.id, req.body);
    return ApiResponse.success({
      res,
      message: 'Cập nhật đánh giá thành công',
      data: updated,
    });
  });

  // Authenticated user: Delete review
  static deleteReview = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const result = await ReviewService.deleteReview(req.user.id, req.params.id);
    return ApiResponse.success({
      res,
      message: result.message,
      data: null,
    });
  });
}
