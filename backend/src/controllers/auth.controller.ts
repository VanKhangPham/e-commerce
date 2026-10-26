import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export class AuthController {
  // Customer Register
  static register = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    return ApiResponse.created({
      res,
      message: 'Đăng ký tài khoản thành công',
      data: result,
    });
  });

  // Customer Login
  static login = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    return ApiResponse.success({
      res,
      message: 'Đăng nhập thành công',
      data: result,
    });
  });

  // Admin Login
  static adminLogin = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.adminLogin(req.body);
    return ApiResponse.success({
      res,
      message: 'Đăng nhập quản trị viên thành công',
      data: result,
    });
  });

  // Refresh Token
  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refreshTokens(refreshToken);
    return ApiResponse.success({
      res,
      message: 'Làm mới token thành công',
      data: tokens,
    });
  });

  // Logout
  static logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    return ApiResponse.success({
      res,
      message: 'Đăng xuất thành công',
      data: null,
    });
  });

  // Forgot Password
  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);
    return ApiResponse.success({
      res,
      message: result.message,
      data: result,
    });
  });

  // Reset Password
  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    const result = await AuthService.resetPassword(email, newPassword);
    return ApiResponse.success({
      res,
      message: result.message,
      data: null,
    });
  });

  // Get Current Profile
  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const profile = await AuthService.getProfile(req.user.id);
    return ApiResponse.success({
      res,
      data: profile,
    });
  });

  // Update Profile
  static updateProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const updated = await AuthService.updateProfile(req.user.id, req.body);
    return ApiResponse.success({
      res,
      message: 'Cập nhật thông tin thành công',
      data: updated,
    });
  });

  // Change Password
  static changePassword = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const { currentPassword, newPassword } = req.body;
    const result = await AuthService.changePassword(req.user.id, currentPassword, newPassword);
    return ApiResponse.success({
      res,
      message: result.message,
      data: null,
    });
  });

  // Upload Avatar
  static uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    if (!req.file) {
      throw ApiError.badRequest('Vui lòng chọn tập tin ảnh đại diện');
    }

    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const updated = await AuthService.updateProfile(req.user.id, { avatar: avatarUrl });

    return ApiResponse.success({
      res,
      message: 'Tải lên ảnh đại diện thành công',
      data: { avatar: avatarUrl, user: updated },
    });
  });

  // Address Handlers
  static getAddresses = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const addresses = await AuthService.getAddresses(req.user.id);
    return ApiResponse.success({
      res,
      data: addresses,
    });
  });

  static createAddress = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const address = await AuthService.createAddress(req.user.id, req.body);
    return ApiResponse.created({
      res,
      message: 'Thêm địa chỉ giao hàng thành công',
      data: address,
    });
  });

  static updateAddress = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const address = await AuthService.updateAddress(req.user.id, req.params.id, req.body);
    return ApiResponse.success({
      res,
      message: 'Cập nhật địa chỉ thành công',
      data: address,
    });
  });

  static deleteAddress = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const result = await AuthService.deleteAddress(req.user.id, req.params.id);
    return ApiResponse.success({
      res,
      message: result.message,
      data: null,
    });
  });

  static setDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const address = await AuthService.setDefaultAddress(req.user.id, req.params.id);
    return ApiResponse.success({
      res,
      message: 'Đặt địa chỉ mặc định thành công',
      data: address,
    });
  });
}
