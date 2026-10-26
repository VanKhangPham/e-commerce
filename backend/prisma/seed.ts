import { PrismaClient, Role, OrderStatus, PaymentMethod, PaymentStatus, CouponType, VariantType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Bắt đầu Seeding Dữ Liệu NOVA Commerce ---');

  // 1. Clean existing records in safe order
  await prisma.orderTimeline.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.productSpecification.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.storeSetting.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✓ Đã xóa sạch dữ liệu cũ');

  // 2. Create Store Settings
  await prisma.storeSetting.create({
    data: {
      id: 'default',
      storeName: 'NOVA Commerce',
      hotline: '1900 6868',
      email: 'support@nova.vn',
      address: 'Tầng 18, Keangnam Landmark 72, Đường Phạm Hùng, Q. Cầu Giấy, Hà Nội',
      slogan: 'Hệ thống bán lẻ thiết bị công nghệ hàng đầu Việt Nam',
      standardShippingFee: 30000,
      freeShippingThreshold: 2000000,
      enableCOD: true,
      enableBanking: true,
      enableMoMo: true,
      enableVNPay: true,
      notifyOrderEmail: true,
      notifyLowStock: true,
      notifyAdminTelegram: false,
    },
  });
  console.log('✓ Đã tạo cài đặt hệ thống');

  // 3. Create Users
  const customerPassword = await bcrypt.hash('user123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);
  const commonPassword = await bcrypt.hash('pass123', 10);

  const customerUser = await prisma.user.create({
    data: {
      id: 'usr-customer-1',
      name: 'Phạm Văn Khang',
      email: 'user@nova.vn',
      password: customerPassword,
      phone: '0908123456',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      role: Role.USER,
      cart: { create: {} },
      addresses: {
        create: [
          {
            id: 'addr-1',
            fullName: 'Phạm Văn Khang',
            phone: '0908123456',
            province: 'Thành phố Hồ Chí Minh',
            district: 'Quận 1',
            ward: 'Phường Bến Nghé',
            addressDetail: 'Số 123 Đường Lê Lợi, Tòa nhà Saigon Center',
            isDefault: true,
          },
          {
            id: 'addr-2',
            fullName: 'Phạm Văn Khang (Nhà riêng)',
            phone: '0908123456',
            province: 'Thành phố Hồ Chí Minh',
            district: 'Quận 7',
            ward: 'Phường Tân Phong',
            addressDetail: 'Căn hộ B-1204, Chung cư Sky Garden 3, Đường Nguyễn Văn Linh',
            isDefault: false,
          },
        ],
      },
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      id: 'usr-admin-1',
      name: 'Quản Trị Viên NOVA',
      email: 'admin@nova.vn',
      password: adminPassword,
      phone: '0988776655',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
      role: Role.ADMIN,
      cart: { create: {} },
      addresses: {
        create: [
          {
            id: 'addr-admin',
            fullName: 'Trụ Sở NOVA Commerce',
            phone: '0988776655',
            province: 'Thành phố Hà Nội',
            district: 'Quận Cầu Giấy',
            ward: 'Phường Dịch Vọng Hậu',
            addressDetail: 'Tầng 18, Keangnam Landmark 72, Đường Phạm Hùng',
            isDefault: true,
          },
        ],
      },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      id: 'usr-customer-2',
      name: 'Trần Thị Mai',
      email: 'tran.mai@gmail.com',
      password: commonPassword,
      phone: '0912345678',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
      role: Role.USER,
      cart: { create: {} },
      addresses: {
        create: [
          {
            id: 'addr-3',
            fullName: 'Trần Thị Mai',
            phone: '0912345678',
            province: 'Thành phố Hà Nội',
            district: 'Quận Ba Đình',
            ward: 'Phường Kim Mã',
            addressDetail: 'Số 45 Ngõ 12 Đội Cấn',
            isDefault: true,
          },
        ],
      },
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      id: 'usr-customer-3',
      name: 'Lê Hoàng Nam',
      email: 'nam.lehoang@gmail.com',
      password: commonPassword,
      phone: '0933557799',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
      role: Role.USER,
      cart: { create: {} },
      addresses: {
        create: [
          {
            id: 'addr-4',
            fullName: 'Lê Hoàng Nam',
            phone: '0933557799',
            province: 'Thành phố Đà Nẵng',
            district: 'Quận Hải Châu',
            ward: 'Phường Thạch Thang',
            addressDetail: 'Số 88 Đường Bạch Đằng',
            isDefault: true,
          },
        ],
      },
    },
  });

  console.log('✓ Đã tạo 4 tài khoản người dùng (bao gồm demo user@nova.vn và admin@nova.vn)');

  // 4. Create Categories
  const cat1 = await prisma.category.create({
    data: {
      id: 'cat-1',
      name: 'Điện Thoại & Tablet',
      slug: 'dien-thoai-tablet',
      description: 'Smartphone, máy tính bảng đỉnh cao công nghệ từ Apple, Samsung, Xiaomi.',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    },
  });

  const cat2 = await prisma.category.create({
    data: {
      id: 'cat-2',
      name: 'Laptop & Máy Tính',
      slug: 'laptop-may-tinh',
      description: 'Máy tính xách tay mỏng nhẹ, laptop gaming và máy trạm đồ họa chuyên nghiệp.',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
    },
  });

  const cat3 = await prisma.category.create({
    data: {
      id: 'cat-3',
      name: 'Tai Nghe & Âm Thanh',
      slug: 'am-thanh-tai-nghe',
      description: 'Tai nghe chống ồn, loa bluetooth cao cấp mang đến trải nghiệm âm thanh sống động.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    },
  });

  const cat4 = await prisma.category.create({
    data: {
      id: 'cat-4',
      name: 'Đồng Hồ Thông Minh',
      slug: 'dong-ho-thong-minh',
      description: 'Smartwatch theo dõi sức khỏe, định vị GPS, thời lượng pin bền bỉ.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    },
  });

  const cat5 = await prisma.category.create({
    data: {
      id: 'cat-5',
      name: 'Phụ Kiện Công Nghệ',
      slug: 'phu-kien-cong-nghe',
      description: 'Củ sạc nhanh GaN, pin sạc dự phòng, cáp sạc bọc dù và bàn phím cơ.',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop',
    },
  });

  console.log('✓ Đã tạo 5 danh mục sản phẩm');

  // 5. Create Products with Variants, Specifications, Images
  // Product 1: iPhone 16 Pro Max
  const prod1 = await prisma.product.create({
    data: {
      id: 'prod-1',
      name: 'iPhone 16 Pro Max 256GB - Titan Tự Nhiên',
      slug: 'iphone-16-pro-max-256gb',
      price: 34990000,
      originalPrice: 36990000,
      discountPercentage: 5,
      rating: 4.9,
      reviewCount: 142,
      stock: 25,
      soldCount: 88,
      thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop',
      categoryId: cat1.id,
      brand: 'Apple',
      shortDescription: 'Siêu phẩm công nghệ đột phá với chip Apple A18 Pro, khung viền Titan chuẩn hàng không vũ trụ và nút điều khiển camera chuyên biệt.',
      description: 'iPhone 16 Pro Max sở hữu thiết kế titan nhẹ và bền bỉ, màn hình Super Retina XDR 6.9 inch lớn nhất từng có với viền mỏng ấn tượng. Sức mạnh từ chip A18 Pro mang đến hiệu năng đồ họa đỉnh cao, hỗ trợ Apple Intelligence toàn diện.',
      isFeatured: true,
      isBestSeller: true,
      isFlashSale: false,
      tags: ['Apple', 'iPhone', 'Titanium', 'A18 Pro', 'Flagship'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop', order: 1, isPrimary: false },
          { url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1000&auto=format&fit=crop', order: 2, isPrimary: false },
        ],
      },
      variants: {
        create: [
          { name: 'Titan Tự Nhiên', type: VariantType.COLOR, value: '#A89F91', priceModifier: 0, inStock: true, sku: 'IP16PM-NAT-256' },
          { name: 'Titan Sa Mạc', type: VariantType.COLOR, value: '#CDB79E', priceModifier: 0, inStock: true, sku: 'IP16PM-DES-256' },
          { name: 'Titan Đen', type: VariantType.COLOR, value: '#3C3B3D', priceModifier: 0, inStock: true, sku: 'IP16PM-BLK-256' },
          { name: 'Titan Trắng', type: VariantType.COLOR, value: '#F2F1ED', priceModifier: 0, inStock: true, sku: 'IP16PM-WHT-256' },
        ],
      },
      specifications: {
        create: [
          { name: 'Màn hình', value: '6.9 inch Super Retina XDR OLED, 120Hz ProMotion' },
          { name: 'Chip xử lý', value: 'Apple A18 Pro (3nm)' },
          { name: 'Bộ nhớ trong', value: '256 GB' },
          { name: 'Camera sau', value: '48MP Chính + 48MP Góc siêu rộng + 12MP Tele 5x' },
          { name: 'Chất liệu khung', value: 'Titanium Grade 5' },
        ],
      },
    },
  });

  // Product 2: Samsung Galaxy S25 Ultra
  const prod2 = await prisma.product.create({
    data: {
      id: 'prod-2',
      name: 'Samsung Galaxy S25 Ultra 5G 512GB - Xám Titan',
      slug: 'samsung-galaxy-s25-ultra-512gb',
      price: 33990000,
      originalPrice: 37490000,
      discountPercentage: 9,
      rating: 4.8,
      reviewCount: 96,
      stock: 18,
      soldCount: 65,
      thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop',
      categoryId: cat1.id,
      brand: 'Samsung',
      shortDescription: 'Đỉnh cao trí tuệ nhân tạo Galaxy AI thế hệ mới, camera mắt thần bóng đêm 200MP cùng bút S-Pen quyền năng.',
      description: 'Galaxy S25 Ultra tiếp tục khẳng định vị thế dẫn đầu trong thế giới Android với vi xử lý Snapdragon 8 Elite tối ưu hiệu năng gaming và xử lý AI tức thì.',
      isFeatured: true,
      isBestSeller: true,
      isFlashSale: true,
      flashSaleEndsAt: new Date(Date.now() + 86400000 * 5),
      tags: ['Samsung', 'Galaxy AI', 'S-Pen', 'Snapdragon 8 Elite'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1000&auto=format&fit=crop', order: 1, isPrimary: false },
        ],
      },
      variants: {
        create: [
          { name: 'Xám Titan', type: VariantType.COLOR, value: '#717378', priceModifier: 0, inStock: true, sku: 'S25U-GRY-512' },
          { name: 'Đen Titan', type: VariantType.COLOR, value: '#242526', priceModifier: 0, inStock: true, sku: 'S25U-BLK-512' },
        ],
      },
      specifications: {
        create: [
          { name: 'Màn hình', value: '6.8 inch Dynamic AMOLED 2X, QHD+, 120Hz' },
          { name: 'Vi xử lý', value: 'Snapdragon 8 Elite for Galaxy' },
          { name: 'RAM / Bộ nhớ', value: '12GB / 512GB' },
          { name: 'Camera', value: '200MP + 50MP + 50MP + 10MP' },
        ],
      },
    },
  });

  // Product 3: MacBook Pro 16 inch M4 Pro
  await prisma.product.create({
    data: {
      id: 'prod-3',
      name: 'MacBook Pro 16 inch M4 Pro (36GB RAM / 512GB SSD)',
      slug: 'macbook-pro-16-inch-m4-pro',
      price: 64990000,
      originalPrice: 69990000,
      discountPercentage: 7,
      rating: 5.0,
      reviewCount: 48,
      stock: 12,
      soldCount: 34,
      thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
      categoryId: cat2.id,
      brand: 'Apple',
      shortDescription: 'Cỗ máy trạm di động tối thượng dành cho các chuyên gia sáng tạo, lập trình viên và kiến trúc sư.',
      description: 'MacBook Pro 16 inch trang bị chip M4 Pro hoàn toàn mới đem lại hiệu suất CPU và GPU bứt phá ngoạn mục cùng thời lượng pin lên đến 24 giờ.',
      isFeatured: true,
      isBestSeller: true,
      isFlashSale: false,
      tags: ['MacBook', 'Apple', 'M4 Pro', 'Laptop'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
        ],
      },
      variants: {
        create: [
          { name: 'Space Black', type: VariantType.COLOR, value: '#2E2D32', priceModifier: 0, inStock: true, sku: 'MBP16-M4P-BLK' },
          { name: 'Silver', type: VariantType.COLOR, value: '#E3E4E5', priceModifier: 0, inStock: true, sku: 'MBP16-M4P-SLV' },
        ],
      },
      specifications: {
        create: [
          { name: 'Màn hình', value: '16.2 inch Liquid Retina XDR (3456 x 2234), 120Hz ProMotion' },
          { name: 'CPU', value: 'Apple M4 Pro 14-core CPU' },
          { name: 'RAM', value: '36GB Unified Memory' },
          { name: 'Ổ cứng', value: '512GB SSD chuẩn PCIe Gen 4' },
        ],
      },
    },
  });

  // Product 4: Dell XPS 14 OLED
  await prisma.product.create({
    data: {
      id: 'prod-4',
      name: 'Dell XPS 14 9440 Intel Core Ultra 7 / 32GB / 1TB / RTX 4050 3.2K OLED Touch',
      slug: 'dell-xps-14-9440-oled',
      price: 52990000,
      originalPrice: 56990000,
      discountPercentage: 7,
      rating: 4.7,
      reviewCount: 31,
      stock: 14,
      soldCount: 22,
      thumbnail: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop',
      categoryId: cat2.id,
      brand: 'Dell',
      shortDescription: 'Tuyệt tác thiết kế laptop Windows tương lai với phím cảm ứng điện dung vô hình và màn hình vô cực OLED 3.2K sắc nét.',
      description: 'Dell XPS 14 mới đại diện cho đỉnh cao thiết kế đương đại được chế tác từ nhôm nguyên khối gia công CNC chính xác và kính cường lực Gorilla Glass 3.',
      isFeatured: false,
      isBestSeller: false,
      isFlashSale: false,
      tags: ['Dell', 'XPS', 'OLED', 'RTX 4050'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
        ],
      },
      specifications: {
        create: [
          { name: 'Màn hình', value: '14.5 inch 3.2K OLED (3200 x 2000), 120Hz, Touch' },
          { name: 'CPU', value: 'Intel Core Ultra 7 155H (16 nhân 22 luồng, NPU Intel AI)' },
          { name: 'RAM', value: '32GB LPDDR5X 7467MHz' },
        ],
      },
    },
  });

  // Product 5: Sony WH-1000XM5
  const prod5 = await prisma.product.create({
    data: {
      id: 'prod-5',
      name: 'Sony WH-1000XM5 Tai Nghe Chống Ồn Cao Cấp - Đen',
      slug: 'sony-wh-1000xm5-chong-on',
      price: 6990000,
      originalPrice: 8490000,
      discountPercentage: 18,
      rating: 4.9,
      reviewCount: 215,
      stock: 40,
      soldCount: 198,
      thumbnail: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop',
      categoryId: cat3.id,
      brand: 'Sony',
      shortDescription: 'Tai nghe chụp tai chống ồn hàng đầu thị trường với 8 micro kép và 2 bộ xử lý âm thanh độc quyền V1 + QN1.',
      description: 'Sony WH-1000XM5 sở hữu công nghệ chống ồn Auto NC Optimizer tự động thích ứng với môi trường xung quanh mang lại không gian tĩnh lặng tuyệt đối.',
      isFeatured: true,
      isBestSeller: true,
      isFlashSale: true,
      flashSaleEndsAt: new Date(Date.now() + 86400000 * 3),
      tags: ['Sony', 'Headphones', 'NoiseCancelling', 'HiResAudio'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
        ],
      },
      variants: {
        create: [
          { name: 'Đen Huyền Bí', type: VariantType.COLOR, value: '#1A1A1A', priceModifier: 0, inStock: true, sku: 'WHXM5-BLK' },
          { name: 'Bạc Ánh Kim', type: VariantType.COLOR, value: '#D8D4CD', priceModifier: 0, inStock: true, sku: 'WHXM5-SLV' },
        ],
      },
      specifications: {
        create: [
          { name: 'Driver', value: '30mm sợi carbon siêu nhẹ' },
          { name: 'Thời lượng pin', value: '30 giờ (bật ANC), 40 giờ (tắt ANC)' },
          { name: 'Trọng lượng', value: '250 g' },
        ],
      },
    },
  });

  // Product 6: Marshall Stanmore III
  await prisma.product.create({
    data: {
      id: 'prod-6',
      name: 'Loa Bluetooth Marshall Stanmore III - Âm Thanh Huyền Thoại Anh Quốc',
      slug: 'loa-bluetooth-marshall-stanmore-iii',
      price: 9490000,
      originalPrice: 10490000,
      discountPercentage: 10,
      rating: 4.8,
      reviewCount: 78,
      stock: 20,
      soldCount: 52,
      thumbnail: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop',
      categoryId: cat3.id,
      brand: 'Marshall',
      shortDescription: 'Chiếc loa để bàn phong cách cổ điển biểu tượng với sân khấu âm thanh mở rộng hơn bao giờ hết.',
      description: 'Stanmore III mang đến chất âm Marshall đặc trưng ngập tràn không gian phòng khách của bạn với bộ loa trầm 50W Class D và hai loa tweeter 15W Class D.',
      isFeatured: false,
      isBestSeller: true,
      isFlashSale: false,
      tags: ['Marshall', 'Speaker', 'Bluetooth', 'Vintage'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
        ],
      },
      variants: {
        create: [
          { name: 'Black (Đen)', type: VariantType.COLOR, value: '#111111', priceModifier: 0, inStock: true, sku: 'MS-STAN3-BLK' },
          { name: 'Cream (Kem)', type: VariantType.COLOR, value: '#E6DECB', priceModifier: 0, inStock: true, sku: 'MS-STAN3-CRM' },
        ],
      },
      specifications: {
        create: [
          { name: 'Công suất', value: '80 Watt (1 Woofer 50W + 2 Tweeter 15W)' },
          { name: 'Dải tần', value: '45 - 20.000 Hz' },
          { name: 'Kết nối', value: 'Bluetooth 5.2, AUX 3.5mm, RCA' },
        ],
      },
    },
  });

  // Product 7: Apple Watch Ultra 2
  await prisma.product.create({
    data: {
      id: 'prod-7',
      name: 'Apple Watch Ultra 2 GPS + Cellular 49mm Vỏ Titan - Dây Quấn Alpine',
      slug: 'apple-watch-ultra-2-titanium-49mm',
      price: 21490000,
      originalPrice: 22990000,
      discountPercentage: 7,
      rating: 4.9,
      reviewCount: 110,
      stock: 15,
      soldCount: 76,
      thumbnail: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?q=80&w=600&auto=format&fit=crop',
      categoryId: cat4.id,
      brand: 'Apple',
      shortDescription: 'Chiếc đồng hồ thể thao và dã ngoại tối thượng với màn hình 3000 nits sáng nhất từng có.',
      description: 'Apple Watch Ultra 2 được chế tạo để chinh phục mọi điều kiện khắc nghiệt từ leo núi tuyết cho tới lặn biển chuyên nghiệp.',
      isFeatured: true,
      isBestSeller: true,
      isFlashSale: false,
      tags: ['Apple', 'Apple Watch', 'Titanium', 'Smartwatch'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
        ],
      },
      specifications: {
        create: [
          { name: 'Vỏ đồng hồ', value: 'Titanium chuẩn hàng không vũ trụ 49mm' },
          { name: 'Thời lượng pin', value: 'Lên tới 36 giờ (sử dụng bình thường), 72 giờ chế độ tiết kiệm' },
          { name: 'Kháng nước', value: '100m, đạt chuẩn lặn biển EN13319 tới độ sâu 40m' },
        ],
      },
    },
  });

  // Product 8: Garmin Fenix 8
  await prisma.product.create({
    data: {
      id: 'prod-8',
      name: 'Garmin Fenix 8 Sapphire Solar 51mm Titan - Đồng Hồ Thể Thao Đa Năng',
      slug: 'garmin-fenix-8-sapphire-solar-51mm',
      price: 29990000,
      originalPrice: 31990000,
      discountPercentage: 6,
      rating: 5.0,
      reviewCount: 39,
      stock: 10,
      soldCount: 18,
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
      categoryId: cat4.id,
      brand: 'Garmin',
      shortDescription: 'Đồng hồ GPS ngoài trời đỉnh cao với thấu kính sạc năng lượng mặt trời Power Sapphire và thời lượng pin tới 48 ngày.',
      description: 'Fenix 8 là công cụ sinh tồn và huấn luyện đẳng cấp nhất thế giới dành cho các vận động viên ba môn phối hợp và những người đam mê phiêu lưu mạo hiểm.',
      isFeatured: false,
      isBestSeller: false,
      isFlashSale: false,
      tags: ['Garmin', 'Fenix 8', 'Solar', 'GPS'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
        ],
      },
      specifications: {
        create: [
          { name: 'Mặt kính', value: 'Power Sapphire chống trầy xước sạc năng lượng mặt trời' },
          { name: 'Thời lượng pin', value: 'Lên tới 48 ngày ở chế độ Smartwatch' },
        ],
      },
    },
  });

  // Product 9: Củ Sạc Anker Prime 100W GaN
  const prod9 = await prisma.product.create({
    data: {
      id: 'prod-9',
      name: 'Củ Sạc Nhanh Anker Prime 100W GaN 3 Cổng (2C1A)',
      slug: 'cu-sac-nhanh-anker-prime-100w-gan',
      price: 1390000,
      originalPrice: 1750000,
      discountPercentage: 21,
      rating: 4.9,
      reviewCount: 320,
      stock: 85,
      soldCount: 450,
      thumbnail: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop',
      categoryId: cat5.id,
      brand: 'Anker',
      shortDescription: 'Củ sạc công nghệ GaN siêu nhỏ gọn công suất cực đại 100W, sạc đồng thời 3 thiết bị cùng lúc mượt mà.',
      description: 'Anker Prime 100W trang bị công nghệ ActiveShield 2.0 kiểm soát nhiệt độ thông minh bảo vệ thiết bị tuyệt đối an toàn suốt quá trình sạc nhanh.',
      isFeatured: false,
      isBestSeller: true,
      isFlashSale: true,
      flashSaleEndsAt: new Date(Date.now() + 86400000 * 2),
      tags: ['Anker', 'GaN', 'Charger', '100W', 'FastCharging'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
        ],
      },
      variants: {
        create: [
          { name: 'Đen Carbon', type: VariantType.COLOR, value: '#1C1C1E', priceModifier: 0, inStock: true, sku: 'ANK-100W-BLK' },
        ],
      },
      specifications: {
        create: [
          { name: 'Tổng công suất', value: '100W Max' },
          { name: 'Cổng giao tiếp', value: '2 x USB-C + 1 x USB-A' },
          { name: 'Công nghệ an toàn', value: 'ActiveShield 2.0 kiểm soát nhiệt 3 triệu lần/ngày' },
        ],
      },
    },
  });

  // Product 10: Keychron Q1 Pro Bàn Phím Cơ
  const prod10 = await prisma.product.create({
    data: {
      id: 'prod-10',
      name: 'Bàn Phím Cơ Không Dây Keychron Q1 Pro Custom QMK/VIA Nhôm Nguyên Khối',
      slug: 'ban-phim-co-keychron-q1-pro-wireless',
      price: 4390000,
      originalPrice: 4790000,
      discountPercentage: 8,
      rating: 4.8,
      reviewCount: 64,
      stock: 22,
      soldCount: 81,
      thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop',
      categoryId: cat5.id,
      brand: 'Keychron',
      shortDescription: 'Bàn phím cơ kim loại custom cao cấp layout 75%, kết nối không dây Bluetooth 5.1 và núm xoay đa năng.',
      description: 'Keychron Q1 Pro là mẫu bàn phím cơ bằng vỏ nhôm nguyên khối đầu tiên hỗ trợ không dây Bluetooth, thiết kế Double-Gasket mang lại cảm giác gõ êm dịu đầm tai.',
      isFeatured: false,
      isBestSeller: false,
      isFlashSale: false,
      tags: ['Keychron', 'Keyboard', 'Wireless', 'Mechanical'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
        ],
      },
      variants: {
        create: [
          { name: 'Red Switch (Êm)', type: VariantType.VERSION, value: 'Red', priceModifier: 0, inStock: true, sku: 'KC-Q1P-RED' },
          { name: 'Brown Switch (Tactile)', type: VariantType.VERSION, value: 'Brown', priceModifier: 0, inStock: true, sku: 'KC-Q1P-BRN' },
        ],
      },
      specifications: {
        create: [
          { name: 'Chất liệu khung', value: 'Nhôm CNC 6063 nguyên khối' },
          { name: 'Pin', value: '4000 mAh (dùng đến 300 giờ không đèn nền)' },
        ],
      },
    },
  });

  // Additional products for rich catalogue:
  // Product 11: iPad Pro 13 M4
  await prisma.product.create({
    data: {
      id: 'prod-11',
      name: 'iPad Pro 13 inch M4 Ultra Retina XDR 256GB Wi-Fi',
      slug: 'ipad-pro-13-inch-m4-256gb',
      price: 37990000,
      originalPrice: 39990000,
      discountPercentage: 5,
      rating: 4.9,
      reviewCount: 42,
      stock: 16,
      soldCount: 38,
      thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=600&auto=format&fit=crop',
      categoryId: cat1.id,
      brand: 'Apple',
      shortDescription: 'Thiết kế mỏng kỷ lục 5.1mm, màn hình OLED 2 lớp Tandem cùng sức mạnh quái vật từ chip Apple M4.',
      description: 'iPad Pro 13 inch M4 là mẫu máy tính bảng đột phá đưa trải nghiệm sáng tạo nghệ thuật và xử lý đa nhiệm lên một đẳng cấp chưa từng có.',
      isFeatured: true,
      isBestSeller: false,
      isFlashSale: false,
      tags: ['iPad', 'Apple', 'M4', 'OLED'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
        ],
      },
      specifications: {
        create: [
          { name: 'Màn hình', value: '13 inch Ultra Retina XDR Tandem OLED' },
          { name: 'Chip xử lý', value: 'Apple M4' },
        ],
      },
    },
  });

  // Product 12: ASUS ROG Zephyrus G16
  await prisma.product.create({
    data: {
      id: 'prod-12',
      name: 'ASUS ROG Zephyrus G16 Intel Core Ultra 9 / 32GB / 1TB / RTX 4080 2.5K OLED 240Hz',
      slug: 'asus-rog-zephyrus-g16-oled-rtx4080',
      price: 69990000,
      originalPrice: 74990000,
      discountPercentage: 7,
      rating: 4.9,
      reviewCount: 29,
      stock: 8,
      soldCount: 15,
      thumbnail: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600&auto=format&fit=crop',
      categoryId: cat2.id,
      brand: 'ASUS',
      shortDescription: 'Laptop gaming cao cấp siêu mỏng nhẹ với màn hình ROG Nebula OLED 240Hz và dải đèn Slash Lighting độc bản.',
      description: 'Zephyrus G16 là đỉnh cao của sự giao thoa giữa thời trang công nghệ và hiệu năng gaming không giới hạn.',
      isFeatured: false,
      isBestSeller: false,
      isFlashSale: false,
      tags: ['ASUS', 'ROG', 'RTX4080', 'Gaming'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
        ],
      },
      specifications: {
        create: [
          { name: 'Màn hình', value: '16 inch 2.5K OLED 240Hz, 0.2ms, G-SYNC' },
          { name: 'GPU', value: 'NVIDIA GeForce RTX 4080 12GB GDDR6' },
        ],
      },
    },
  });

  // Product 13: AirPods Pro 2 USB-C
  await prisma.product.create({
    data: {
      id: 'prod-13',
      name: 'Tai Nghe Apple AirPods Pro (Thế hệ thứ 2) Hộp Sạc MagSafe USB-C',
      slug: 'apple-airpods-pro-2-usb-c',
      price: 5290000,
      originalPrice: 6190000,
      discountPercentage: 15,
      rating: 4.9,
      reviewCount: 512,
      stock: 60,
      soldCount: 820,
      thumbnail: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop',
      categoryId: cat3.id,
      brand: 'Apple',
      shortDescription: 'Công nghệ khử tiếng ồn chủ động gấp 2 lần, chế độ Thích Ứng thông minh và cổng kết nối USB-C tiện dụng.',
      description: 'Chip H2 mạnh mẽ được nâng cấp giúp xử lý âm thanh không gian sống động và thời lượng pin mở rộng lên tới 30 giờ.',
      isFeatured: true,
      isBestSeller: true,
      isFlashSale: true,
      flashSaleEndsAt: new Date(Date.now() + 86400000 * 4),
      tags: ['Apple', 'AirPods', 'ANC', 'TrueWireless'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
        ],
      },
      specifications: {
        create: [
          { name: 'Chip âm thanh', value: 'Apple H2' },
          { name: 'Kháng bụi & nước', value: 'IP54 cho cả tai nghe và hộp sạc' },
        ],
      },
    },
  });

  // Product 14: Chuột Logitech MX Master 3S
  await prisma.product.create({
    data: {
      id: 'prod-14',
      name: 'Chuột Không Dây Logitech MX Master 3S - Cảm Biến 8000 DPI Click Yên Tĩnh',
      slug: 'chuot-khong-day-logitech-mx-master-3s',
      price: 2190000,
      originalPrice: 2490000,
      discountPercentage: 12,
      rating: 4.9,
      reviewCount: 230,
      stock: 50,
      soldCount: 310,
      thumbnail: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop',
      categoryId: cat5.id,
      brand: 'Logitech',
      shortDescription: 'Biểu tượng công thái học dành cho người làm việc chuyên nghiệp với con lăn điện từ MagSpeed cuộn 1000 dòng/giây.',
      description: 'MX Master 3S nâng tầm trải nghiệm với cú click chuột êm ái giảm 90% tiếng ồn và cảm biến hoạt động mượt mà trên mọi bề mặt kể cả mặt kính.',
      isFeatured: false,
      isBestSeller: true,
      isFlashSale: false,
      tags: ['Logitech', 'Mouse', 'Ergonomic', 'MXMaster'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
        ],
      },
      variants: {
        create: [
          { name: 'Graphite (Xám đen)', type: VariantType.COLOR, value: '#242426', priceModifier: 0, inStock: true, sku: 'LOGI-MX3S-GRP' },
          { name: 'Pale Grey (Trắng xám)', type: VariantType.COLOR, value: '#ECECEE', priceModifier: 0, inStock: true, sku: 'LOGI-MX3S-WHT' },
        ],
      },
      specifications: {
        create: [
          { name: 'Độ phân giải cảm biến', value: '200 - 8000 DPI (Darkfield)' },
          { name: 'Thời lượng pin', value: '70 ngày sau một lần sạc đầy' },
        ],
      },
    },
  });

  // Product 15: Pin Dự Phòng Baseus Blade 100W
  await prisma.product.create({
    data: {
      id: 'prod-15',
      name: 'Pin Sạc Dự Phòng Siêu Mỏng Baseus Blade 100W 20000mAh Màn Hình Kỹ Thuật Số',
      slug: 'pin-du-phong-baseus-blade-100w-20000mah',
      price: 1250000,
      originalPrice: 1590000,
      discountPercentage: 21,
      rating: 4.7,
      reviewCount: 145,
      stock: 45,
      soldCount: 190,
      thumbnail: 'https://images.unsplash.com/photo-1609592424368-233bb43fcf3e?q=80&w=600&auto=format&fit=crop',
      categoryId: cat5.id,
      brand: 'Baseus',
      shortDescription: 'Pin sạc siêu mỏng chỉ 18mm công suất 100W chuyên dụng sạc nhanh cho cả MacBook và laptop Type-C.',
      description: 'Màn hình LED sắc nét hiển thị chính xác % pin còn lại, công suất sạc hiện tại và thời gian sạc đầy ước tính.',
      isFeatured: false,
      isBestSeller: false,
      isFlashSale: false,
      tags: ['Baseus', 'PowerBank', '100W', 'LaptopCharger'],
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1609592424368-233bb43fcf3e?q=80&w=1000&auto=format&fit=crop', order: 0, isPrimary: true },
        ],
      },
      specifications: {
        create: [
          { name: 'Dung lượng', value: '20.000 mAh / 74Wh' },
          { name: 'Công suất tối đa', value: '100W Type-C Power Delivery' },
        ],
      },
    },
  });

  console.log('✓ Đã tạo 15 sản phẩm với đầy đủ ảnh, biến thể và thông số kỹ thuật');

  // 6. Create Coupons
  await prisma.coupon.createMany({
    data: [
      {
        id: 'c-1',
        code: 'NOVANEW',
        description: 'Giảm 10% tối đa 500.000₫ cho khách hàng mới',
        discountType: CouponType.PERCENTAGE,
        discountValue: 10,
        minOrderValue: 500000,
        maxDiscount: 500000,
        expiryDate: new Date('2026-12-31T23:59:59Z'),
        usageLimit: 500,
        usageCount: 84,
        isActive: true,
      },
      {
        id: 'c-2',
        code: 'FREESHIP',
        description: 'Miễn phí vận chuyển toàn quốc (giảm 30.000₫)',
        discountType: CouponType.FIXED,
        discountValue: 30000,
        minOrderValue: 300000,
        expiryDate: new Date('2026-12-31T23:59:59Z'),
        usageLimit: 1000,
        usageCount: 421,
        isActive: true,
      },
      {
        id: 'c-3',
        code: 'SALE500K',
        description: 'Giảm ngay 500.000₫ cho đơn hàng từ 5.000.000₫',
        discountType: CouponType.FIXED,
        discountValue: 500000,
        minOrderValue: 5000000,
        expiryDate: new Date('2026-11-30T23:59:59Z'),
        usageLimit: 100,
        usageCount: 37,
        isActive: true,
      },
      {
        id: 'c-4',
        code: 'TECH50K',
        description: 'Giảm 50.000₫ cho mọi đơn hàng phụ kiện từ 500.000₫',
        discountType: CouponType.FIXED,
        discountValue: 50000,
        minOrderValue: 500000,
        expiryDate: new Date('2026-10-31T23:59:59Z'),
        usageLimit: 200,
        usageCount: 92,
        isActive: true,
      },
      {
        id: 'c-5',
        code: 'VIP15',
        description: 'Giảm 15% tối đa 1.000.000₫ cho thành viên VIP',
        discountType: CouponType.PERCENTAGE,
        discountValue: 15,
        minOrderValue: 2000000,
        maxDiscount: 1000000,
        expiryDate: new Date('2026-12-31T23:59:59Z'),
        usageLimit: 50,
        usageCount: 12,
        isActive: true,
      },
    ],
  });
  console.log('✓ Đã tạo 5 mã giảm giá (coupons)');

  // 7. Create Sample Orders
  const order1 = await prisma.order.create({
    data: {
      id: 'ord-1001',
      orderNumber: 'NOVA-20260901-8841',
      userId: customerUser.id,
      customerName: 'Phạm Văn Khang',
      customerPhone: '0908123456',
      customerEmail: 'user@nova.vn',
      shippingAddress: {
        fullName: 'Phạm Văn Khang',
        phone: '0908123456',
        email: 'user@nova.vn',
        province: 'Thành phố Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        addressDetail: 'Số 123 Đường Lê Lợi, Tòa nhà Saigon Center',
      },
      paymentMethod: PaymentMethod.BANKING,
      paymentStatus: PaymentStatus.PAID,
      orderStatus: OrderStatus.DELIVERED,
      subtotal: 36380000,
      shippingFee: 0,
      discountAmount: 500000,
      totalAmount: 35880000,
      couponCode: 'SALE500K',
      note: 'Giao giờ hành chính lên tầng 15 giúp tôi.',
      createdAt: new Date('2026-09-01T10:15:00Z'),
      items: {
        create: [
          {
            id: 'oi-1',
            productId: prod1.id,
            productName: prod1.name,
            productSlug: prod1.slug,
            image: prod1.thumbnail,
            price: 34990000,
            quantity: 1,
            selectedVariantName: 'Titan Tự Nhiên',
            totalPrice: 34990000,
          },
          {
            id: 'oi-2',
            productId: prod9.id,
            productName: prod9.name,
            productSlug: prod9.slug,
            image: prod9.thumbnail,
            price: 1390000,
            quantity: 1,
            selectedVariantName: 'Đen Carbon',
            totalPrice: 1390000,
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'Đơn hàng đã được tạo thành công', createdAt: new Date('2026-09-01T10:15:00Z') },
          { status: OrderStatus.CONFIRMED, note: 'Đã xác nhận thanh toán chuyển khoản, đang đóng gói', createdAt: new Date('2026-09-01T11:00:00Z') },
          { status: OrderStatus.SHIPPING, note: 'Bàn giao cho đơn vị vận chuyển Viettel Post (Mã VT891024VN)', createdAt: new Date('2026-09-02T08:30:00Z') },
          { status: OrderStatus.DELIVERED, note: 'Giao hàng thành công tới khách hàng', createdAt: new Date('2026-09-03T16:20:00Z') },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      id: 'ord-1002',
      orderNumber: 'NOVA-20260915-9923',
      userId: customerUser.id,
      customerName: 'Phạm Văn Khang',
      customerPhone: '0908123456',
      customerEmail: 'user@nova.vn',
      shippingAddress: {
        fullName: 'Phạm Văn Khang',
        phone: '0908123456',
        email: 'user@nova.vn',
        province: 'Thành phố Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        addressDetail: 'Số 123 Đường Lê Lợi, Tòa nhà Saigon Center',
      },
      paymentMethod: PaymentMethod.VNPAY,
      paymentStatus: PaymentStatus.PAID,
      orderStatus: OrderStatus.SHIPPING,
      subtotal: 6990000,
      shippingFee: 30000,
      discountAmount: 30000,
      totalAmount: 6990000,
      couponCode: 'FREESHIP',
      note: 'Gọi trước khi giao 15 phút.',
      createdAt: new Date('2026-09-15T14:20:00Z'),
      items: {
        create: [
          {
            id: 'oi-3',
            productId: prod5.id,
            productName: prod5.name,
            productSlug: prod5.slug,
            image: prod5.thumbnail,
            price: 6990000,
            quantity: 1,
            selectedVariantName: 'Đen Huyền Bí',
            totalPrice: 6990000,
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'Đơn hàng được khởi tạo', createdAt: new Date('2026-09-15T14:20:00Z') },
          { status: OrderStatus.CONFIRMED, note: 'Thanh toán VNPay thành công', createdAt: new Date('2026-09-15T14:25:00Z') },
          { status: OrderStatus.SHIPPING, note: 'Đang vận chuyển giao hỏa tốc 2H', createdAt: new Date('2026-09-15T15:00:00Z') },
        ],
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      id: 'ord-1003',
      orderNumber: 'NOVA-20260920-1122',
      userId: customer2.id,
      customerName: 'Trần Thị Mai',
      customerPhone: '0912345678',
      customerEmail: 'tran.mai@gmail.com',
      shippingAddress: {
        fullName: 'Trần Thị Mai',
        phone: '0912345678',
        email: 'tran.mai@gmail.com',
        province: 'Thành phố Hà Nội',
        district: 'Quận Ba Đình',
        ward: 'Phường Kim Mã',
        addressDetail: 'Số 45 Ngõ 12 Đội Cấn',
      },
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.CONFIRMED,
      subtotal: 33990000,
      shippingFee: 0,
      discountAmount: 500000,
      totalAmount: 33490000,
      couponCode: 'NOVANEW',
      note: 'Kiểm tra hàng trước khi thanh toán COD',
      createdAt: new Date('2026-09-20T08:45:00Z'),
      items: {
        create: [
          {
            id: 'oi-4',
            productId: prod2.id,
            productName: prod2.name,
            productSlug: prod2.slug,
            image: prod2.thumbnail,
            price: 33990000,
            quantity: 1,
            selectedVariantName: 'Xám Titan',
            totalPrice: 33990000,
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'Đơn hàng mới tạo', createdAt: new Date('2026-09-20T08:45:00Z') },
          { status: OrderStatus.CONFIRMED, note: 'Nhân viên tổng đài đã gọi xác nhận đơn hàng thành công', createdAt: new Date('2026-09-20T09:15:00Z') },
        ],
      },
    },
  });

  console.log('✓ Đã tạo 3 đơn hàng mẫu cùng timeline lịch sử');

  // 8. Create Reviews
  await prisma.review.createMany({
    data: [
      {
        id: 'rev-1',
        productId: prod1.id,
        userId: customerUser.id,
        rating: 5,
        comment: 'Máy hoàn thiện quá xuất sắc, màu titan tự nhiên sang trọng cực kỳ. Camera quay chụp nét căng và nút Camera Control dùng rất tiện khi đi du lịch!',
        approved: true,
        orderVerified: true,
        createdAt: new Date('2026-09-04T10:30:00Z'),
      },
      {
        id: 'rev-2',
        productId: prod1.id,
        userId: customer2.id,
        rating: 5,
        comment: 'Giao hàng siêu nhanh chỉ trong 2 giờ tại HCM. Đóng gói rất cẩn thận, hàng nguyên seal chính hãng VN/A.',
        approved: true,
        orderVerified: true,
        createdAt: new Date('2026-09-08T15:20:00Z'),
      },
      {
        id: 'rev-3',
        productId: prod5.id,
        userId: customer3.id,
        rating: 5,
        comment: 'Chống ồn của Sony XM5 thì không có điểm nào để chê. Đeo trên máy bay êm ru không nghe thấy tiếng động cơ gì luôn. Rất đáng đồng tiền.',
        approved: true,
        orderVerified: true,
        createdAt: new Date('2026-08-20T09:10:00Z'),
      },
      {
        id: 'rev-4',
        productId: prod10.id,
        userId: customerUser.id,
        rating: 5,
        comment: 'Bàn phím nặng đầm tay, gõ êm mượt với Red Switch. Kết nối Mac chuyển qua Win cực kỳ mượt mà. 10/10!',
        approved: true,
        orderVerified: false,
        createdAt: new Date('2026-08-29T18:00:00Z'),
      },
    ],
  });
  console.log('✓ Đã tạo đánh giá sản phẩm');

  // 9. Create Blog Posts
  await prisma.blogPost.createMany({
    data: [
      {
        id: 'post-1',
        slug: 'danh-gia-chi-tiet-iphone-16-pro-max',
        title: 'Đánh Giá Chi Tiết iPhone 16 Pro Max: Nâng Cấp Có Thực Sự Đáng Giá?',
        excerpt: 'Trải nghiệm thực tế siêu phẩm đầu bảng của Apple với khung viền Titan Grade 5, nút Camera Control và chip xử lý A18 Pro.',
        content: `iPhone 16 Pro Max đã chính thức ra mắt và gây ấn tượng mạnh mẽ với giới công nghệ toàn cầu. Trong bài viết này, đội ngũ kỹ thuật NOVA Commerce sẽ cùng bạn đi sâu vào từng khía cạnh của máy: từ thiết kế khung viền titan siêu nhẹ, màn hình 6.9 inch viền mỏng ấn tượng đến hệ thống camera 48MP Fusion tân tiến. Điểm sáng lớn nhất chính là thời lượng pin kỷ lục lên đến 33 giờ phát video liên tục.`,
        category: 'danh-gia',
        categoryName: 'Đánh Giá Sản Phẩm',
        coverImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop',
        authorName: 'Nguyễn Thành Nam',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        readTime: '6 phút đọc',
        isFeatured: true,
        publishedAt: new Date('2026-09-18T08:00:00Z'),
      },
      {
        id: 'post-2',
        slug: 'top-tai-nghe-chong-on-tot-nhat-2026',
        title: 'Top 5 Tai Nghe Chống Ồn Tốt Nhất 2026 Dành Cho Dân Văn Phòng & Du Lịch',
        excerpt: 'So sánh chi tiết hiệu quả chống ồn, chất lượng âm thanh và cảm giác đeo giữa Sony WH-1000XM5, AirPods Max và Bose QuietComfort Ultra.',
        content: `Một chiếc tai nghe chống ồn chủ động (ANC) tốt không chỉ giúp bạn tập trung cao độ khi làm việc mà còn bảo vệ thính giác khi di chuyển trên các chuyến bay dài. Bài viết sẽ phân tích chi tiết ưu nhược điểm của từng đại diện nổi bật trên thị trường hiện nay.`,
        category: 'tu-van',
        categoryName: 'Tư Vấn Mua Sắm',
        coverImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop',
        authorName: 'Lê Hoàng Anh',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        readTime: '8 phút đọc',
        isFeatured: false,
        publishedAt: new Date('2026-09-12T10:30:00Z'),
      },
    ],
  });
  console.log('✓ Đã tạo bài viết tin tức & blog');

  // 10. Create Contact Messages
  await prisma.contactMessage.createMany({
    data: [
      {
        name: 'Nguyễn Văn Hùng',
        email: 'hung.nguyen@company.vn',
        phone: '0977889900',
        subject: 'Tư vấn mua số lượng lớn thiết bị cho doanh nghiệp',
        message: 'Công ty chúng tôi dự kiến mua 20 chiếc MacBook Pro và 30 màn hình ngoài cho văn phòng mới tại Quận 1, TP.HCM. Xin báo giá tốt nhất.',
        isRead: false,
      },
    ],
  });
  console.log('✓ Đã tạo tin nhắn liên hệ');

  console.log('\n========================================');
  console.log(' SEEDING HOÀN TẤT THÀNH CÔNG! ');
  console.log('========================================');
  console.log('Demo Accounts:');
  console.log('  Customer: user@nova.vn   / user123  (Role: USER)');
  console.log('  Admin:    admin@nova.vn  / admin123 (Role: ADMIN)');
  console.log('========================================\n');
}

main()
  .catch((e) => {
    console.error('Lỗi khi Seeding dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
