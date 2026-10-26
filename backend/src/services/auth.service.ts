import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from '../utils/tokenUtils.js';

export class AuthService {
  // 1. Customer Register
  static async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw ApiError.conflict('Email này đã được sử dụng trong hệ thống');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: hashedPassword,
        phone: data.phone || null,
        role: 'USER',
        cart: {
          create: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Save refresh token hash in DB
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  // 2. Customer Login
  static async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      throw ApiError.badRequest('Email hoặc mật khẩu không chính xác');
    }

    if (user.role === 'ADMIN') {
      throw ApiError.forbidden('Tài khoản quản trị viên vui lòng đăng nhập tại trang quản trị (/admin/login)');
    }

    if (user.isBlocked) {
      throw ApiError.forbidden('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw ApiError.badRequest('Email hoặc mật khẩu không chính xác');
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  // 3. Admin Login
  static async adminLogin(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      throw ApiError.badRequest('Tài khoản hoặc mật khẩu quản trị không chính xác');
    }

    if (user.role !== 'ADMIN') {
      throw ApiError.forbidden('Tài khoản không có quyền truy cập trang quản trị');
    }

    if (user.isBlocked) {
      throw ApiError.forbidden('Tài khoản quản trị này đã bị vô hiệu hóa');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw ApiError.badRequest('Tài khoản hoặc mật khẩu quản trị không chính xác');
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  // 4. Refresh Token
  static async refreshTokens(rawRefreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      throw ApiError.unauthorized('Phiên làm việc đã hết hạn hoặc không hợp lệ');
    }

    const tokenHash = hashToken(rawRefreshToken);

    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        userId: payload.userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: true,
      },
    });

    if (!storedToken || !storedToken.user) {
      throw ApiError.unauthorized('Phiên đăng nhập đã bị hủy hoặc không tồn tại');
    }

    if (storedToken.user.isBlocked) {
      throw ApiError.forbidden('Tài khoản đã bị tạm khóa');
    }

    // Revoke old refresh token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Generate new pair
    const accessToken = generateAccessToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    const newTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: storedToken.user.id,
        tokenHash: newTokenHash,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  // 5. Logout
  static async logout(rawRefreshToken?: string) {
    if (rawRefreshToken) {
      const tokenHash = hashToken(rawRefreshToken);
      await prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    return { success: true };
  }

  // 6. Forgot Password (mock email reset link)
  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Return success to avoid email enumeration
      return { message: 'Nếu email tồn tại trong hệ thống, hướng dẫn khôi phục mật khẩu đã được gửi' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log(`[PASSWORD RESET LINK MOCK] Link khôi phục cho ${email}: http://localhost:5173/reset-password?token=${resetToken}`);

    return {
      message: 'Nếu email tồn tại trong hệ thống, hướng dẫn khôi phục mật khẩu đã được gửi',
      mockResetToken: resetToken,
    };
  }

  // 7. Reset Password
  static async resetPassword(email: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw ApiError.notFound('Không tìm thấy tài khoản với email này');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Revoke all existing refresh tokens
    await prisma.refreshToken.updateMany({
      where: { userId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới' };
  }

  // 8. Get Profile
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        addresses: {
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        },
      },
    });

    if (!user) {
      throw ApiError.notFound('Không tìm thấy thông tin người dùng');
    }

    return user;
  }

  // 9. Update Profile
  static async updateProfile(
    userId: string,
    data: { name?: string; phone?: string; avatar?: string }
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  // 10. Change Password
  static async changePassword(
    userId: string,
    currentPass: string,
    newPass: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ApiError.notFound('Tài khoản không tồn tại');
    }

    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) {
      throw ApiError.badRequest('Mật khẩu hiện tại không chính xác');
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Đổi mật khẩu thành công' };
  }

  // 11. Address Operations
  static async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  static async createAddress(
    userId: string,
    data: {
      fullName: string;
      phone: string;
      province: string;
      district: string;
      ward: string;
      addressDetail: string;
      isDefault?: boolean;
    }
  ) {
    // If setting as default or if first address, set others to false
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const addressCount = await prisma.address.count({ where: { userId } });

    return prisma.address.create({
      data: {
        ...data,
        isDefault: data.isDefault ?? addressCount === 0,
        userId,
      },
    });
  }

  static async updateAddress(
    userId: string,
    addressId: string,
    data: Partial<{
      fullName: string;
      phone: string;
      province: string;
      district: string;
      ward: string;
      addressDetail: string;
      isDefault: boolean;
    }>
  ) {
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw ApiError.notFound('Không tìm thấy địa chỉ này');
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, id: { not: addressId } },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  static async deleteAddress(userId: string, addressId: string) {
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw ApiError.notFound('Không tìm thấy địa chỉ cần xóa');
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    // If deleted address was default, make the most recent one default
    if (existing.isDefault) {
      const remaining = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (remaining) {
        await prisma.address.update({
          where: { id: remaining.id },
          data: { isDefault: true },
        });
      }
    }

    return { message: 'Xóa địa chỉ thành công' };
  }

  static async setDefaultAddress(userId: string, addressId: string) {
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) {
      throw ApiError.notFound('Không tìm thấy địa chỉ này');
    }

    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    return prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}
