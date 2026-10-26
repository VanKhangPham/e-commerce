import { Request, Response } from 'express';
import { CouponService } from '../services/coupon.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class CouponController {
  static validateCoupon = asyncHandler(async (req: Request, res: Response) => {
    const { code, cartTotal } = req.body;
    const result = await CouponService.validateCoupon(code, cartTotal);
    return ApiResponse.success({
      res,
      message: 'Áp dụng mã giảm giá thành công',
      data: result,
    });
  });
}
