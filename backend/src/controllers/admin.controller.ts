import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { OrderStatus } from '@prisma/client';

export class AdminController {
  // Dashboard
  static getDashboard = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await AdminService.getDashboardStats();
    return ApiResponse.success({
      res,
      data: stats,
    });
  });

  // Products
  static listProducts = asyncHandler(async (req: Request, res: Response) => {
    const { products, pagination } = await AdminService.listProducts(req.query);
    return ApiResponse.success({
      res,
      data: products,
      pagination,
    });
  });

  static createProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await AdminService.createProduct(req.body);
    return ApiResponse.created({
      res,
      message: 'Tạo sản phẩm mới thành công',
      data: product,
    });
  });

  static updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const updated = await AdminService.updateProduct(req.params.id, req.body);
    return ApiResponse.success({
      res,
      message: 'Cập nhật sản phẩm thành công',
      data: updated,
    });
  });

  static deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.deleteProduct(req.params.id);
    return ApiResponse.success({
      res,
      message: result.message,
      data: null,
    });
  });

  // Image Upload
  static uploadImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw ApiError.badRequest('Vui lòng chọn tập tin hình ảnh để tải lên');
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return ApiResponse.created({
      res,
      message: 'Tải lên hình ảnh thành công',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
      },
    });
  });

  // Categories
  static listCategories = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await AdminService.listCategories();
    return ApiResponse.success({
      res,
      data: categories,
    });
  });

  static createCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await AdminService.createCategory(req.body);
    return ApiResponse.created({
      res,
      message: 'Tạo danh mục mới thành công',
      data: category,
    });
  });

  static updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const updated = await AdminService.updateCategory(req.params.id, req.body);
    return ApiResponse.success({
      res,
      message: 'Cập nhật danh mục thành công',
      data: updated,
    });
  });

  static deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.deleteCategory(req.params.id);
    return ApiResponse.success({
      res,
      message: result.message,
      data: null,
    });
  });

  // Orders
  static listOrders = asyncHandler(async (req: Request, res: Response) => {
    const { orders, pagination } = await AdminService.listOrders(req.query);
    return ApiResponse.success({
      res,
      data: orders,
      pagination,
    });
  });

  static getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const order = await AdminService.getOrderById(req.params.id);
    return ApiResponse.success({
      res,
      data: order,
    });
  });

  static updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status, note } = req.body;
    const updated = await AdminService.updateOrderStatus(req.params.id, status as OrderStatus, note);
    return ApiResponse.success({
      res,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: updated,
    });
  });

  // Customers
  static listCustomers = asyncHandler(async (req: Request, res: Response) => {
    const { customers, pagination } = await AdminService.listCustomers(req.query);
    return ApiResponse.success({
      res,
      data: customers,
      pagination,
    });
  });

  static getCustomerDetail = asyncHandler(async (req: Request, res: Response) => {
    const customer = await AdminService.getCustomerDetail(req.params.id);
    return ApiResponse.success({
      res,
      data: customer,
    });
  });

  static toggleBlockCustomer = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.toggleBlockCustomer(req.params.id);
    return ApiResponse.success({
      res,
      message: result.message,
      data: result.user,
    });
  });

  // Coupons
  static listCoupons = asyncHandler(async (_req: Request, res: Response) => {
    const coupons = await AdminService.listCoupons();
    return ApiResponse.success({
      res,
      data: coupons,
    });
  });

  static createCoupon = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await AdminService.createCoupon(req.body);
    return ApiResponse.created({
      res,
      message: 'Tạo mã giảm giá mới thành công',
      data: coupon,
    });
  });

  static updateCoupon = asyncHandler(async (req: Request, res: Response) => {
    const updated = await AdminService.updateCoupon(req.params.id, req.body);
    return ApiResponse.success({
      res,
      message: 'Cập nhật mã giảm giá thành công',
      data: updated,
    });
  });

  static deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.deleteCoupon(req.params.id);
    return ApiResponse.success({
      res,
      message: result.message,
      data: null,
    });
  });

  // Reviews
  static listReviews = asyncHandler(async (req: Request, res: Response) => {
    const { reviews, pagination } = await AdminService.listReviews(req.query);
    return ApiResponse.success({
      res,
      data: reviews,
      pagination,
    });
  });

  static approveReview = asyncHandler(async (req: Request, res: Response) => {
    const { approved } = req.body;
    const result = await AdminService.approveReview(req.params.id, approved ?? true);
    return ApiResponse.success({
      res,
      message: result.message,
      data: result.review,
    });
  });

  static deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.deleteReview(req.params.id);
    return ApiResponse.success({
      res,
      message: result.message,
      data: null,
    });
  });

  // Store Settings
  static getSettings = asyncHandler(async (_req: Request, res: Response) => {
    const settings = await AdminService.getStoreSettings();
    return ApiResponse.success({
      res,
      data: settings,
    });
  });

  static updateSettings = asyncHandler(async (req: Request, res: Response) => {
    const updated = await AdminService.updateStoreSettings(req.body);
    return ApiResponse.success({
      res,
      message: 'Cập nhật cấu hình cửa hàng thành công',
      data: updated,
    });
  });
}
