import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = (process.env.NODE_ENV || 'development') === 'development';
const configuredMaxFileSize = Number.parseInt(process.env.MAX_FILE_SIZE || '5242880', 10);

if (!Number.isSafeInteger(configuredMaxFileSize) || configuredMaxFileSize <= 0) {
  throw new Error('Cấu hình lỗi: MAX_FILE_SIZE phải là số nguyên dương tính bằng byte.');
}

const maxFileSize =
  process.env.VERCEL === '1'
    ? Math.min(configuredMaxFileSize, 4 * 1024 * 1024)
    : configuredMaxFileSize;

// Bắt buộc phải có, thiếu là báo lỗi rõ ràng (mọi môi trường)
function requireEnv(name: string, hint?: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Cấu hình Supabase lỗi: Thiếu biến môi trường ${name} trong file .env.` +
        (hint ? ` ${hint}` : '')
    );
  }
  return value;
}

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

// Kiểm tra SUPABASE_URL hợp lệ
const supabaseUrl = requireEnv(
  'SUPABASE_URL',
  'Lấy ở Supabase Dashboard → Project Settings → API (dạng https://xxxx.supabase.co).'
);
try {
  new URL(supabaseUrl);
} catch {
  throw new Error(
    `Cấu hình Supabase lỗi: SUPABASE_URL không phải URL hợp lệ (đang là "${supabaseUrl}").`
  );
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
  MAX_FILE_SIZE: maxFileSize,

  SUPABASE_URL: supabaseUrl,
  SUPABASE_SERVICE_ROLE_KEY: requireEnv(
    'SUPABASE_SERVICE_ROLE_KEY',
    'Lấy ở Supabase Dashboard → Project Settings → API (chỉ dùng ở server, không đưa lên client).'
  ),
  SUPABASE_STORAGE_BUCKET: requireEnv(
    'SUPABASE_STORAGE_BUCKET',
    'Ví dụ: nova-image (phải khớp chính xác tên bucket đã tạo).'
  ),

  isDevelopment,
  isProduction,
};