import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';

export const requireRole = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Vui lòng đăng nhập'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden('Bạn không có quyền thực hiện hành động này (Yêu cầu quyền Quản trị viên)')
      );
    }

    next();
  };
};
