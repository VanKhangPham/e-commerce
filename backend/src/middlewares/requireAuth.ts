import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/tokenUtils.js';
import { prisma } from '../config/prisma.js';

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Vui lòng đăng nhập để tiếp tục');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Token xác thực không hợp lệ');
    }

    const decoded = verifyAccessToken(token);

    // Verify user exists and is not blocked
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        isBlocked: true,
      },
    });

    if (!user) {
      throw ApiError.unauthorized('Tài khoản không tồn tại hoặc đã bị xóa');
    }

    if (user.isBlocked) {
      throw ApiError.forbidden('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ ban quản trị');
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    next(error);
  }
};
