export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'NOVA Commerce REST API',
    version: '1.0.0',
    description:
      'Hệ thống API backend thương mại điện tử NOVA Commerce xây dựng bằng Node.js + Express + TypeScript + PostgreSQL (Prisma ORM). Tất cả thông báo phản hồi được chuẩn hóa bằng tiếng Việt.',
    contact: {
      name: 'NOVA Commerce Engineering Team',
      email: 'support@nova.vn',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Máy chủ cục bộ phát triển (Local Development)',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Nhập access token nhận được từ endpoint /api/auth/login hoặc /api/admin/auth/login',
      },
    },
    schemas: {
      StandardResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Thành công' },
          data: { type: 'object' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Dữ liệu không hợp lệ hoặc lỗi máy chủ' },
          errors: { type: 'array', items: { type: 'object' } },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 12 },
          total: { type: 'integer', example: 45 },
          totalPages: { type: 'integer', example: 4 },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Đăng ký, đăng nhập khách hàng và quản lý phiên token' },
    { name: 'Products', description: 'Xem danh sách, tìm kiếm, lọc và chi tiết sản phẩm' },
    { name: 'Categories', description: 'Danh mục thiết bị công nghệ' },
    { name: 'User Profile & Addresses', description: 'Thông tin cá nhân và sổ địa chỉ giao hàng' },
    { name: 'Cart & Wishlist', description: 'Giỏ hàng trực tuyến và danh sách yêu thích' },
    { name: 'Orders', description: 'Đặt hàng và quản lý đơn mua' },
    { name: 'Coupons & Reviews', description: 'Mã giảm giá và đánh giá sản phẩm' },
    { name: 'Admin', description: 'Các chức năng độc quyền dành cho Quản trị viên (ADMIN)' },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng ký tài khoản khách hàng mới',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Phạm Văn Khang' },
                  email: { type: 'string', example: 'khang@gmail.com' },
                  password: { type: 'string', example: '123456' },
                  phone: { type: 'string', example: '0908123456' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Tạo tài khoản thành công' },
          409: { description: 'Email đã tồn tại trong hệ thống' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Đăng nhập khách hàng',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'user@nova.vn' },
                  password: { type: 'string', example: 'user123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Đăng nhập thành công, trả về access + refresh tokens' },
          400: { description: 'Sai tài khoản hoặc mật khẩu' },
          403: { description: 'Tài khoản admin không được đăng nhập tại đây hoặc tài khoản bị khóa' },
        },
      },
    },
    '/api/admin/auth/login': {
      post: {
        tags: ['Admin'],
        summary: 'Đăng nhập tài khoản Quản trị viên (ADMIN)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@nova.vn' },
                  password: { type: 'string', example: 'admin123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Đăng nhập quản trị viên thành công' },
          403: { description: 'Tài khoản không có quyền ADMIN' },
        },
      },
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Lấy danh sách sản phẩm với phân trang, bộ lọc và sắp xếp',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'brand', in: 'query', schema: { type: 'string' } },
          { name: 'minPrice', in: 'query', schema: { type: 'integer' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'integer' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['price-asc', 'price-desc', 'newest', 'rating', 'popular'] } },
        ],
        responses: {
          200: { description: 'Danh sách sản phẩm thành công' },
        },
      },
    },
    '/api/products/slug/{slug}': {
      get: {
        tags: ['Products'],
        summary: 'Xem chi tiết sản phẩm theo đường dẫn slug',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string', example: 'iphone-16-pro-max-256gb' } },
        ],
        responses: {
          200: { description: 'Chi tiết sản phẩm thành công' },
          404: { description: 'Không tìm thấy sản phẩm' },
        },
      },
    },
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Lấy danh sách tất cả danh mục',
        responses: {
          200: { description: 'Danh sách danh mục thành công' },
        },
      },
    },
    '/api/user/profile': {
      get: {
        tags: ['User Profile & Addresses'],
        summary: 'Lấy thông tin tài khoản đang đăng nhập',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Thông tin tài khoản' },
          401: { description: 'Chưa xác thực' },
        },
      },
    },
    '/api/user/cart': {
      get: {
        tags: ['Cart & Wishlist'],
        summary: 'Lấy thông tin giỏ hàng của người dùng hiện tại',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Danh sách sản phẩm trong giỏ và tổng tiền' },
        },
      },
      post: {
        tags: ['Cart & Wishlist'],
        summary: 'Thêm sản phẩm vào giỏ hàng',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId'],
                properties: {
                  productId: { type: 'string' },
                  variantId: { type: 'string' },
                  quantity: { type: 'integer', default: 1 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Thêm vào giỏ thành công' },
        },
      },
    },
    '/api/user/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Xem danh sách đơn hàng đã mua của tôi',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Lịch sử đơn hàng' },
        },
      },
      post: {
        tags: ['Orders'],
        summary: 'Tạo đơn hàng mới từ giỏ hàng (Áp dụng trừ tồn kho an toàn với Transaction)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['customerName', 'customerPhone', 'customerEmail', 'shippingAddress'],
                properties: {
                  customerName: { type: 'string', example: 'Phạm Văn Khang' },
                  customerPhone: { type: 'string', example: '0908123456' },
                  customerEmail: { type: 'string', example: 'user@nova.vn' },
                  shippingAddress: {
                    type: 'object',
                    properties: {
                      fullName: { type: 'string' },
                      phone: { type: 'string' },
                      province: { type: 'string' },
                      district: { type: 'string' },
                      ward: { type: 'string' },
                      addressDetail: { type: 'string' },
                    },
                  },
                  paymentMethod: { type: 'string', enum: ['COD', 'BANKING', 'MOMO', 'VNPAY'], default: 'COD' },
                  couponCode: { type: 'string', example: 'SALE500K' },
                  note: { type: 'string', example: 'Giao giờ hành chính' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Tạo đơn hàng thành công' },
        },
      },
    },
    '/api/admin/dashboard': {
      get: {
        tags: ['Admin'],
        summary: 'Thống kê tổng quan Dashboard quản trị',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'KPI doanh thu, đơn hàng, khách hàng, biểu đồ 12 tháng' },
        },
      },
    },
  },
};
