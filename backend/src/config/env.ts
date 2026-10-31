import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = (process.env.NODE_ENV || 'development') === 'development';

// In production, enforce strong secrets and valid database URL
if (isProduction) {
  if (
    !process.env.JWT_ACCESS_SECRET ||
    process.env.JWT_ACCESS_SECRET.length < 32 ||
    process.env.JWT_ACCESS_SECRET.includes('nova_super_secure')
  ) {
    throw new Error(
      'Cấu hình bảo mật lỗi: Môi trường Production bắt buộc phải cấu hình JWT_ACCESS_SECRET riêng biệt, an toàn (tối thiểu 32 ký tự).'
    );
  }

  if (
    !process.env.JWT_REFRESH_SECRET ||
    process.env.JWT_REFRESH_SECRET.length < 32 ||
    process.env.JWT_REFRESH_SECRET.includes('nova_super_secure')
  ) {
    throw new Error(
      'Cấu hình bảo mật lỗi: Môi trường Production bắt buộc phải cấu hình JWT_REFRESH_SECRET riêng biệt, an toàn (tối thiểu 32 ký tự).'
    );
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('Cấu hình cơ sở dữ liệu lỗi: Thiếu biến môi trường DATABASE_URL trong Production.');
  }
}

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://nova_admin:nova_secret_2026@localhost:5432/nova_commerce_db?schema=public',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'nova_super_secure_access_secret_key_2026_xyz',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'nova_super_secure_refresh_secret_key_2026_xyz',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
  isDevelopment,
  isProduction,
};
