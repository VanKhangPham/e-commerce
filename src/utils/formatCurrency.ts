/**
 * Formats a number into Vietnamese Dong currency format (e.g., 1.250.000₫)
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '0₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('VND', '₫')
    .replace(/\s+/g, '')
}
