import type { Category } from '@/types'

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Điện Thoại & Tablet',
    slug: 'dien-thoai-tablet',
    description: 'Smartphone, máy tính bảng đỉnh cao công nghệ từ Apple, Samsung, Xiaomi.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    iconName: 'Smartphone',
    productCount: 8,
  },
  {
    id: 'cat-2',
    name: 'Laptop & Máy Tính',
    slug: 'laptop-may-tinh',
    description: 'Máy tính xách tay mỏng nhẹ, laptop gaming và máy trạm đồ họa chuyên nghiệp.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
    iconName: 'Laptop',
    productCount: 6,
  },
  {
    id: 'cat-3',
    name: 'Tai Nghe & Âm Thanh',
    slug: 'am-thanh-tai-nghe',
    description: 'Tai nghe chống ồn, loa bluetooth cao cấp mang đến trải nghiệm âm thanh sống động.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    iconName: 'Headphones',
    productCount: 5,
  },
  {
    id: 'cat-4',
    name: 'Đồng Hồ Thông Minh',
    slug: 'dong-ho-thong-minh',
    description: 'Smartwatch theo dõi sức khỏe, định vị GPS, thời lượng pin bền bỉ.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    iconName: 'Watch',
    productCount: 4,
  },
  {
    id: 'cat-5',
    name: 'Phụ Kiện Công Nghệ',
    slug: 'phu-kien-cong-nghe',
    description: 'Củ sạc nhanh GaN, pin sạc dự phòng, cáp sạc bọc dù và bàn phím cơ.',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop',
    iconName: 'Zap',
    productCount: 5,
  },
]
