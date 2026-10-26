import { Request, Response } from 'express';
import { CartService } from '../services/cart.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export class CartController {
  // Cart Handlers
  static getCart = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const cart = await CartService.getCart(req.user.id);
    return ApiResponse.success({
      res,
      data: cart,
    });
  });

  static addToCart = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const { productId, variantId, quantity } = req.body;
    const cart = await CartService.addToCart(req.user.id, productId, variantId, quantity);
    return ApiResponse.success({
      res,
      message: 'Đã thêm sản phẩm vào giỏ hàng',
      data: cart,
    });
  });

  static updateQuantity = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cart = await CartService.updateCartItemQuantity(req.user.id, itemId, quantity);
    return ApiResponse.success({
      res,
      message: 'Cập nhật số lượng thành công',
      data: cart,
    });
  });

  static removeFromCart = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const { itemId } = req.params;
    const cart = await CartService.removeFromCart(req.user.id, itemId);
    return ApiResponse.success({
      res,
      message: 'Đã xóa sản phẩm khỏi giỏ hàng',
      data: cart,
    });
  });

  static clearCart = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const result = await CartService.clearCart(req.user.id);
    return ApiResponse.success({
      res,
      message: result.message,
      data: null,
    });
  });

  // Wishlist Handlers
  static getWishlist = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const wishlist = await CartService.getWishlist(req.user.id);
    return ApiResponse.success({
      res,
      data: wishlist,
    });
  });

  static addToWishlist = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const { productId } = req.body;
    const result = await CartService.addToWishlist(req.user.id, productId);
    return ApiResponse.success({
      res,
      message: result.message,
      data: null,
    });
  });

  static removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const { productId } = req.params;
    const result = await CartService.removeFromWishlist(req.user.id, productId);
    return ApiResponse.success({
      res,
      message: result.message,
      data: null,
    });
  });
}
