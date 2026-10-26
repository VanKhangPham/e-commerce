export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 12;
export const MAX_LIMIT = 50;

export const STANDARD_SHIPPING_FEE = 30000;
export const FREE_SHIPPING_THRESHOLD = 2000000;

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export const PAYMENT_METHOD = {
  COD: 'COD',
  BANKING: 'BANKING',
  MOMO: 'MOMO',
  VNPAY: 'VNPAY',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
} as const;

export const ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export const COUPON_TYPE = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED: 'FIXED',
} as const;
