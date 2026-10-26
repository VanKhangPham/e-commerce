import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
}

export class ApiResponse {
  static success<T>({
    res,
    statusCode = 200,
    message = 'Thành công',
    data,
    pagination,
  }: ApiResponseOptions<T>) {
    return res.status(statusCode).json({
      success: true,
      message,
      data: data !== undefined ? data : null,
      ...(pagination && { pagination }),
    });
  }

  static created<T>({
    res,
    message = 'Tạo mới thành công',
    data,
  }: Omit<ApiResponseOptions<T>, 'statusCode'>) {
    return ApiResponse.success({
      res,
      statusCode: 201,
      message,
      data,
    });
  }
}
