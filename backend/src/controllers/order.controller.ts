import { Request, Response } from 'express';
import { OrderService } from '../services/order.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export class OrderController {
  // Create Order from Cart
  static createOrder = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const order = await OrderService.createOrder(req.user.id, req.body);
    return ApiResponse.created({
      res,
      message: 'Đặt hàng thành công! Mã đơn hàng của bạn là ' + order.orderNumber,
      data: order,
    });
  });

  // Get My Orders
  static getMyOrders = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const { orders, pagination } = await OrderService.getMyOrders(req.user.id, req.query);
    return ApiResponse.success({
      res,
      data: orders,
      pagination,
    });
  });

  // Get Order Detail
  static getOrderDetail = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const order = await OrderService.getOrderDetail(req.user.id, req.params.id);
    return ApiResponse.success({
      res,
      data: order,
    });
  });

  // Cancel Order
  static cancelOrder = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const { reason } = req.body;
    const cancelled = await OrderService.cancelOrder(req.user.id, req.params.id, reason);
    return ApiResponse.success({
      res,
      message: 'Hủy đơn hàng thành công',
      data: cancelled,
    });
  });
}
