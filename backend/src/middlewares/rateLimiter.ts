import rateLimit from 'express-rate-limit';

// General API rate limiter: 300 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau 15 phút.',
  },
});

// Stricter rate limiter for authentication routes: 20 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Quá nhiều lần thử đăng nhập/đăng ký không thành công. Vui lòng chờ 15 phút trước khi thử lại.',
  },
});
