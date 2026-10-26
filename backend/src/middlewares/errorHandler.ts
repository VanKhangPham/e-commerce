import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { MulterError } from 'multer';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Không tìm thấy đường dẫn: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  // 1. Handled operational ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      ...(env.isDevelopment && { stack: err.stack }),
    });
  }

  // 2. Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại',
      errors: formattedErrors,
      ...(env.isDevelopment && { stack: err.stack }),
    });
  }

  // 3. Prisma Client Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target)
        ? (err.meta?.target as string[]).join(', ')
        : 'trường này';
      return res.status(409).json({
        success: false,
        message: `Dữ liệu đã tồn tại trong hệ thống (${target})`,
        errors: [{ code: err.code, meta: err.meta }],
        ...(env.isDevelopment && { stack: err.stack }),
      });
    }

    // Record to update/delete not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Bản ghi yêu cầu không tồn tại trong hệ thống',
        errors: [{ code: err.code, meta: err.meta }],
        ...(env.isDevelopment && { stack: err.stack }),
      });
    }

    // Foreign key constraint failed
    if (err.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu liên quan không hợp lệ hoặc không tồn tại',
        errors: [{ code: err.code, meta: err.meta }],
        ...(env.isDevelopment && { stack: err.stack }),
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Thao tác cơ sở dữ liệu không hợp lệ',
      errors: [{ code: err.code, meta: err.meta }],
      ...(env.isDevelopment && { stack: err.stack }),
    });
  }

  // 4. Multer upload errors
  if (err instanceof MulterError) {
    let message = 'Lỗi tải lên tập tin';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Kích thước tập tin vượt quá giới hạn cho phép (tối đa 5MB)';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Trường tập tin tải lên không hợp lệ';
    }
    return res.status(400).json({
      success: false,
      message,
      errors: [{ code: err.code }],
      ...(env.isDevelopment && { stack: err.stack }),
    });
  }

  // 5. JWT errors
  if (err instanceof Error && (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')) {
    return res.status(401).json({
      success: false,
      message: err.name === 'TokenExpiredError' ? 'Phiên đăng nhập đã hết hạn' : 'Token không hợp lệ',
      ...(env.isDevelopment && { stack: err.stack }),
    });
  }

  // 6. Generic unhandled error
  console.error('Unhandled Server Error:', err);

  const message = env.isProduction
    ? 'Đã có lỗi xảy ra trên hệ thống, vui lòng thử lại sau'
    : err instanceof Error
    ? err.message
    : 'Lỗi máy chủ không xác định';

  return res.status(500).json({
    success: false,
    message,
    ...(env.isDevelopment && err instanceof Error && { stack: err.stack }),
  });
};
