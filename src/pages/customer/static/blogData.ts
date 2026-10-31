export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: 'review' | 'news' | 'tips'
  categoryName: string
  coverImage: string
  authorName: string
  authorAvatar: string
  publishedAt: string
  readTime: string
  isFeatured?: boolean
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'danh-gia-chi-tiet-iphone-16-pro-max',
    title: 'Đánh Giá Chi Tiết iPhone 16 Pro Max Sau 1 Tháng: Camera Control và A18 Pro Có Xứng Đáng?',
    excerpt: 'Trải nghiệm thực tế thời lượng pin kỷ lục 33 tiếng, khả năng quay video 4K 120fps chuẩn điện ảnh và nút Camera Control thế hệ mới trên siêu phẩm Titan.',
    category: 'review',
    categoryName: 'Đánh Giá Sản Phẩm',
    coverImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop',
    authorName: 'Hoàng Long',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    publishedAt: '2026-09-15T08:00:00Z',
    readTime: '6 phút đọc',
    isFeatured: true,
  },
  {
    id: 'post-2',
    slug: 'so-sanh-galaxy-s25-ultra-va-iphone-16-pro-max',
    title: 'So Sánh Flagship 2026: Samsung Galaxy S25 Ultra Đối Đầu Trực Diện iPhone 16 Pro Max',
    excerpt: 'Cân đo đong đếm sức mạnh camera 200MP zoom quang 10x, bút S-Pen quyền năng so với sự mượt mà tối ưu của iOS 18 và hệ sinh thái Apple.',
    category: 'review',
    categoryName: 'Đánh Giá Sản Phẩm',
    coverImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop',
    authorName: 'Minh Tuấn',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100&auto=format&fit=crop',
    publishedAt: '2026-09-18T10:30:00Z',
    readTime: '8 phút đọc',
  },
  {
    id: 'post-3',
    slug: 'top-tai-nghe-chong-on-tot-nhat-2026',
    title: 'Top 5 Tai Nghe Chống Ồn ANC Đáng Mua Nhất Cho Dân Văn Phòng và Du Lịch 2026',
    excerpt: 'Sony WH-1000XM5, Marshall Major IV hay AirPods Pro 2? Đâu là sự lựa chọn hoàn hảo nhất cho đôi tai của bạn với ngân sách hợp lý.',
    category: 'tips',
    categoryName: 'Tư Vấn Chọn Mua',
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    authorName: 'Thùy Chi',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    publishedAt: '2026-09-20T14:15:00Z',
    readTime: '5 phút đọc',
  },
  {
    id: 'post-4',
    slug: 'meo-tang-tuoi-tho-pin-macbook-m4',
    title: '7 Mẹo Giúp Kéo Dài Tuổi Thọ Pin MacBook M4 Cực Kỳ Hiệu Quả Không Phải Ai Cũng Biết',
    excerpt: 'Tối ưu hóa chu kỳ sạc pin với tính năng Optimized Battery Charging, kiểm soát ứng dụng ngốn điện ngầm và nhiệt độ máy chuẩn chuyên gia.',
    category: 'tips',
    categoryName: 'Thủ Thuật Công Nghệ',
    coverImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    authorName: 'Quốc Bảo',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop',
    publishedAt: '2026-09-21T09:00:00Z',
    readTime: '4 phút đọc',
  },
  {
    id: 'post-5',
    slug: 'vi-sao-ban-phim-co-keychron-q1-pro-duoc-ua-chuong',
    title: 'Vì Sao Bàn Phím Cơ Custom Keychron Q1 Pro Lại Được Giới Lập Trình Viên Săn Đón?',
    excerpt: 'Thiết kế nhôm nguyên khối CNC, kết nối không dây Bluetooth 5.1 đa thiết bị và switch hot-swap gõ cực êm mang lại cảm hứng sáng tạo bất tận.',
    category: 'review',
    categoryName: 'Đánh Giá Sản Phẩm',
    coverImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop',
    authorName: 'Đức Huy',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
    publishedAt: '2026-09-22T16:40:00Z',
    readTime: '5 phút đọc',
  },
  {
    id: 'post-6',
    slug: 'apple-intelligence-tieng-viet-ra-mat',
    title: 'Apple Intelligence Hỗ Trợ Tiếng Việt: Trí Tuệ Nhân Tạo Trên iPhone Thay Đổi Cuộc Sống Thế Nào?',
    excerpt: 'Trải nghiệm tính năng tóm tắt thông báo thông minh, tạo ảnh độc bản bằng Genmoji và trợ lý ảo Siri thế hệ mới hiểu ngữ cảnh tiếng Việt chuẩn xác.',
    category: 'news',
    categoryName: 'Tin Công Nghệ',
    coverImage: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=800&auto=format&fit=crop',
    authorName: 'Hoàng Long',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    publishedAt: '2026-09-23T11:00:00Z',
    readTime: '7 phút đọc',
  },
]
