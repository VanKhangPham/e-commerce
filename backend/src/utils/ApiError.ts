export class ApiError extends Error {
  public statusCode: number;
  public errors: unknown[];
  public isOperational: boolean;

  constructor(statusCode: number, message: string, errors: unknown[] = [], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Yêu cầu không hợp lệ', errors: unknown[] = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Chưa xác thực hoặc phiên đăng nhập đã hết hạn') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Bạn không có quyền truy cập tài nguyên này') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Không tìm thấy dữ liệu yêu cầu') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Dữ liệu đã tồn tại hoặc xảy ra xung đột') {
    return new ApiError(409, message);
  }

  static internal(message = 'Đã có lỗi hệ thống xảy ra, vui lòng thử lại sau') {
    return new ApiError(500, message);
  }
}
