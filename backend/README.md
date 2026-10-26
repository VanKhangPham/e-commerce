# NOVA Commerce - Backend REST API

Hệ thống Backend REST API phục vụ nền tảng thương mại điện tử NOVA Commerce, xây dựng theo kiến trúc phân tầng (layered architecture), bảo mật cao và tối ưu hiệu năng.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

- **Ngôn ngữ & Nền tảng**: Node.js (v20+) + TypeScript + Express.js
- **Cơ sở dữ liệu**: PostgreSQL 16 (chạy container qua Docker Compose)
- **ORM**: Prisma ORM v5 (Migrations + Type-safe Client + Seeders)
- **Xác thực & Phân quyền**: JWT (Access Token 15m + Refresh Token 7d lưu DB), bcryptjs (mã hóa mật khẩu)
- **Kiểm thực dữ liệu (Validation)**: Zod Schema Validation (Body, Params, Query)
- **Bảo mật**: Helmet (HTTP security headers), CORS (cho phép Vite Dev Server), Express Rate Limit
- **Tập tin tĩnh & Upload**: Multer (Upload avatar, hình ảnh sản phẩm)
- **Tài liệu API**: Swagger UI (OpenAPI 3.0) tích hợp trực tiếp tại `/api/docs`
- **Ghi nhật ký (Logging)**: Morgan (chuẩn format dev/combined)

---

## 📋 Yêu Cầu Cài Đặt (Prerequisites)

- **Node.js**: Phiên bản 20.x trở lên
- **npm**: Phiên bản 10.x trở lên
- **Docker & Docker Compose**: Để khởi chạy cơ sở dữ liệu PostgreSQL và Adminer GUI

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án (Setup Flow)

Làm theo đúng 6 bước sau để khởi tạo toàn bộ backend từ đầu:

```bash
# Di chuyển vào thư mục backend
cd backend

# Bước 1: Khởi động container PostgreSQL và Adminer
docker compose up -d

# Bước 2: Sao chép tệp cấu hình môi trường
copy .env.example .env

# Bước 3: Cài đặt các gói phụ thuộc
npm install

# Bước 4: Chạy migration để tạo cấu trúc bảng trong PostgreSQL
npm run db:migrate

# Bước 5: Nạp dữ liệu mẫu (Seeding)
npm run db:seed

# Bước 6: Khởi động máy chủ backend chế độ phát triển
npm run dev
```

Máy chủ sẽ chạy tại:
- **API Base URL**: `http://localhost:5000/api`
- **Tài liệu Swagger UI**: `http://localhost:5000/api/docs`
- **Kiểm tra trạng thái (Health Check)**: `http://localhost:5000/api/health`
- **Giao diện quản lý Adminer GUI**: `http://localhost:8080` (System: PostgreSQL, Server: `postgres_db`, Username: `nova_admin`, Password: `nova_secret_2026`, Database: `nova_commerce_db`)

---

## 🔑 Tài Khoản Mẫu (Demo Accounts)

Hệ thống đã được nạp sẵn 2 tài khoản demo:

| Vai trò (Role) | Email | Mật khẩu (Password) | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Khách Hàng (USER)** | `user@nova.vn` | `user123` | Đăng nhập tại `/api/auth/login`, mua hàng, quản lý đơn hàng, đánh giá |
| **Quản Trị Viên (ADMIN)** | `admin@nova.vn` | `admin123` | Đăng nhập tại `/api/admin/auth/login`, xem KPI dashboard, quản lý sản phẩm, đơn hàng, khách hàng, mã giảm giá |

*(Lưu ý: Hệ thống phân quyền chặt chẽ. Khách hàng thông thường không thể đăng nhập vào route admin, và tài khoản admin bị từ chối tại route login khách hàng).*

---

## ⚙️ Các Lệnh Thao Tác (npm Scripts)

| Lệnh | Ý nghĩa |
| :--- | :--- |
| `npm run dev` | Khởi động server với hot-reload (`tsx watch src/server.ts`) |
| `npm run build` | Biên dịch TypeScript và sinh Prisma Client sang thư mục `dist/` |
| `npm start` | Chạy production server từ `dist/server.js` |
| `npm run db:up` | Khởi động Docker container PostgreSQL & Adminer |
| `npm run db:down` | Dừng Docker containers |
| `npm run db:migrate` | Chạy Prisma migration phát triển |
| `npm run db:seed` | Nạp dữ liệu mẫu tiếng Việt vào database |
| `npm run db:reset` | Xóa sạch database và chạy lại migrations + seed |
| `npm run db:studio` | Khởi động Prisma Studio trực quan tại `http://localhost:5555` |

---

## 📑 Danh Sách API Endpoints (Overview)

### 1. Xác thực & Khách hàng (Authentication)
- `POST /api/auth/register`: Đăng ký tài khoản khách hàng mới
- `POST /api/auth/login`: Đăng nhập khách hàng
- `POST /api/auth/refresh`: Làm mới cặp JWT access/refresh token
- `POST /api/auth/logout`: Đăng xuất (hủy refresh token trong DB)
- `POST /api/auth/forgot-password`: Quên mật khẩu (gửi token khôi phục)
- `POST /api/auth/reset-password`: Đặt lại mật khẩu mới

### 2. Người dùng đã đăng nhập (Authenticated User - Bearer Token)
- `GET /api/user/profile`: Xem thông tin cá nhân
- `PUT /api/user/profile`: Cập nhật thông tin cá nhân
- `PUT /api/user/change-password`: Đổi mật khẩu
- `POST /api/user/avatar`: Tải lên ảnh đại diện
- `GET /api/user/addresses`: Lấy danh sách địa chỉ giao hàng
- `POST /api/user/addresses`: Thêm địa chỉ mới
- `PUT /api/user/addresses/:id`: Cập nhật địa chỉ
- `DELETE /api/user/addresses/:id`: Xóa địa chỉ
- `PATCH /api/user/addresses/:id/default`: Đặt làm địa chỉ mặc định
- `GET /api/user/cart`: Xem giỏ hàng
- `POST /api/user/cart`: Thêm sản phẩm vào giỏ
- `PUT /api/user/cart/:itemId`: Cập nhật số lượng
- `DELETE /api/user/cart/:itemId`: Xóa sản phẩm khỏi giỏ
- `DELETE /api/user/cart`: Xóa sạch giỏ hàng
- `GET /api/user/wishlist`: Xem danh sách sản phẩm yêu thích
- `POST /api/user/wishlist`: Thêm sản phẩm yêu thích
- `DELETE /api/user/wishlist/:productId`: Xóa khỏi danh sách yêu thích
- `POST /api/user/orders`: Tạo đơn hàng từ giỏ hàng (sử dụng Prisma Transaction an toàn tồn kho)
- `GET /api/user/orders`: Danh sách đơn hàng của tôi
- `GET /api/user/orders/:id`: Chi tiết đơn hàng
- `POST /api/user/orders/:id/cancel`: Hủy đơn hàng (khi trạng thái là PENDING, tự động hoàn tồn kho)
- `POST /api/user/reviews`: Đánh giá sản phẩm đã mua
- `PUT /api/user/reviews/:id`: Sửa đánh giá
- `DELETE /api/user/reviews/:id`: Xóa đánh giá

### 3. Công khai (Public)
- `GET /api/products`: Danh sách sản phẩm (lọc theo danh mục, thương hiệu, giá, đánh giá, sắp xếp, phân trang)
- `GET /api/products/:id`: Chi tiết sản phẩm theo ID
- `GET /api/products/slug/:slug`: Chi tiết sản phẩm theo Slug
- `GET /api/products/:id/related`: Danh sách sản phẩm liên quan
- `GET /api/products/search/suggestions`: Gợi ý tìm kiếm nhanh
- `GET /api/categories`: Danh sách danh mục sản phẩm
- `GET /api/categories/:slug`: Chi tiết danh mục
- `GET /api/reviews/product/:productId`: Đánh giá của sản phẩm
- `POST /api/coupons/validate`: Kiểm tra tính hợp lệ và giá trị giảm của mã coupon
- `GET /api/blog`: Danh sách bài viết blog
- `GET /api/blog/:slug`: Chi tiết bài viết
- `GET /api/settings`: Cấu hình cửa hàng (phí ship, ngưỡng freeship, hotline, thông tin liên hệ)
- `POST /api/contact`: Gửi form liên hệ
- `POST /api/newsletter`: Đăng ký nhận bản tin

### 4. Quản trị viên (Admin - ADMIN Role Only)
- `POST /api/admin/auth/login`: Đăng nhập quản trị viên
- `GET /api/admin/dashboard`: Thống kê KPI, doanh thu 12 tháng, doanh số theo ngành hàng, đơn hàng mới nhất, sản phẩm bán chạy
- `GET /api/admin/products`: Danh sách sản phẩm quản trị (kèm trạng thái tồn kho)
- `POST /api/admin/products`: Thêm sản phẩm mới (kèm biến thể, thông số, hình ảnh)
- `PUT /api/admin/products/:id`: Chỉnh sửa sản phẩm
- `DELETE /api/admin/products/:id`: Xóa sản phẩm
- `POST /api/admin/upload`: Tải lên hình ảnh sản phẩm
- `GET /api/admin/categories`: Danh sách danh mục
- `POST /api/admin/categories`: Thêm danh mục mới
- `PUT /api/admin/categories/:id`: Sửa danh mục
- `DELETE /api/admin/categories/:id`: Xóa danh mục
- `GET /api/admin/orders`: Danh sách đơn hàng toàn sàn (lọc theo trạng thái, tìm kiếm mã đơn/khách hàng)
- `GET /api/admin/orders/:id`: Chi tiết đơn hàng quản trị
- `PATCH /api/admin/orders/:id/status`: Chuyển trạng thái đơn hàng (PENDING → CONFIRMED → SHIPPING → DELIVERED / CANCELLED)
- `GET /api/admin/customers`: Danh sách khách hàng (kèm số đơn đã mua và tổng chi tiêu)
- `GET /api/admin/customers/:id`: Chi tiết khách hàng và lịch sử mua
- `PATCH /api/admin/customers/:id/toggle-block`: Khóa / Mở khóa tài khoản khách hàng
- `GET /api/admin/coupons`: Danh sách mã giảm giá
- `POST /api/admin/coupons`: Thêm mã giảm giá
- `PUT /api/admin/coupons/:id`: Sửa mã giảm giá
- `DELETE /api/admin/coupons/:id`: Xóa mã giảm giá
- `GET /api/admin/reviews`: Danh sách đánh giá cần duyệt
- `PATCH /api/admin/reviews/:id/approve`: Duyệt / Ẩn đánh giá
- `DELETE /api/admin/reviews/:id`: Xóa đánh giá vi phạm
- `GET /api/admin/settings`: Xem cấu hình cửa hàng
- `PUT /api/admin/settings`: Cập nhật cấu hình cửa hàng

---

## 🔗 Bảng Ánh Xạ Kết Nối Frontend (Mock Services Mapping Table)

Dưới đây là bảng đối chiếu chi tiết giữa từng hàm trong tầng `src/services/` của Frontend với API Endpoint Backend tương ứng:

| Frontend Service File | Frontend Method | Backend API Endpoint | HTTP Method |
| :--- | :--- | :--- | :--- |
| `auth.service.ts` | `login(email, password)` | `/api/auth/login` | `POST` |
| `auth.service.ts` | `adminLogin(email, password)` | `/api/admin/auth/login` | `POST` |
| `auth.service.ts` | `register(data)` | `/api/auth/register` | `POST` |
| `auth.service.ts` | `logout()` | `/api/auth/logout` | `POST` |
| `auth.service.ts` | `getCurrentUser()` | `/api/user/profile` | `GET` |
| `auth.service.ts` | `updateProfile(data)` | `/api/user/profile` | `PUT` |
| `auth.service.ts` | `changePassword(data)` | `/api/user/change-password` | `PUT` |
| `product.service.ts` | `getProducts(filter)` | `/api/products` | `GET` |
| `product.service.ts` | `getProductById(id)` | `/api/products/:id` | `GET` |
| `product.service.ts` | `getProductBySlug(slug)` | `/api/products/slug/:slug` | `GET` |
| `product.service.ts` | `getFeaturedProducts()` | `/api/products?isFeatured=true` | `GET` |
| `product.service.ts` | `getFlashSaleProducts()` | `/api/products?isFlashSale=true` | `GET` |
| `product.service.ts` | `getRelatedProducts(id)` | `/api/products/:id/related` | `GET` |
| `product.service.ts` | `getSearchSuggestions(q)` | `/api/products/search/suggestions?q=` | `GET` |
| `category.service.ts` | `getCategories()` | `/api/categories` | `GET` |
| `category.service.ts` | `getCategoryBySlug(slug)` | `/api/categories/:slug` | `GET` |
| `cart.service.ts` | `getCart()` | `/api/user/cart` | `GET` |
| `cart.service.ts` | `addToCart(item)` | `/api/user/cart` | `POST` |
| `cart.service.ts` | `updateQuantity(id, qty)` | `/api/user/cart/:itemId` | `PUT` |
| `cart.service.ts` | `removeFromCart(id)` | `/api/user/cart/:itemId` | `DELETE` |
| `cart.service.ts` | `clearCart()` | `/api/user/cart` | `DELETE` |
| `order.service.ts` | `createOrder(orderData)` | `/api/user/orders` | `POST` |
| `order.service.ts` | `getMyOrders()` | `/api/user/orders` | `GET` |
| `order.service.ts` | `getOrderById(id)` | `/api/user/orders/:id` | `GET` |
| `order.service.ts` | `cancelOrder(id, reason)` | `/api/user/orders/:id/cancel` | `POST` |
| `coupon.service.ts` | `validateCoupon(code, total)` | `/api/coupons/validate` | `POST` |
| `review.service.ts` | `getProductReviews(productId)`| `/api/reviews/product/:productId` | `GET` |
| `review.service.ts` | `submitReview(data)` | `/api/user/reviews` | `POST` |
| `admin.service.ts` | `getDashboardStats()` | `/api/admin/dashboard` | `GET` |
| `admin.service.ts` | `getProducts(params)` | `/api/admin/products` | `GET` |
| `admin.service.ts` | `createProduct(data)` | `/api/admin/products` | `POST` |
| `admin.service.ts` | `updateProduct(id, data)` | `/api/admin/products/:id` | `PUT` |
| `admin.service.ts` | `deleteProduct(id)` | `/api/admin/products/:id` | `DELETE` |
| `admin.service.ts` | `getCategories()` | `/api/admin/categories` | `GET` |
| `admin.service.ts` | `createCategory(data)` | `/api/admin/categories` | `POST` |
| `admin.service.ts` | `updateCategory(id, data)` | `/api/admin/categories/:id` | `PUT` |
| `admin.service.ts` | `deleteCategory(id)` | `/api/admin/categories/:id` | `DELETE` |
| `admin.service.ts` | `getOrders(params)` | `/api/admin/orders` | `GET` |
| `admin.service.ts` | `getOrderById(id)` | `/api/admin/orders/:id` | `GET` |
| `admin.service.ts` | `updateOrderStatus(id, status)`| `/api/admin/orders/:id/status` | `PATCH` |
| `admin.service.ts` | `getCustomers(params)` | `/api/admin/customers` | `GET` |
| `admin.service.ts` | `toggleBlockCustomer(id)` | `/api/admin/customers/:id/toggle-block` | `PATCH` |
| `admin.service.ts` | `getCoupons()` | `/api/admin/coupons` | `GET` |
| `admin.service.ts` | `createCoupon(data)` | `/api/admin/coupons` | `POST` |
| `admin.service.ts` | `updateCoupon(id, data)` | `/api/admin/coupons/:id` | `PUT` |
| `admin.service.ts` | `deleteCoupon(id)` | `/api/admin/coupons/:id` | `DELETE` |
| `admin.service.ts` | `getReviews(params)` | `/api/admin/reviews` | `GET` |
| `admin.service.ts` | `approveReview(id, approved)` | `/api/admin/reviews/:id/approve` | `PATCH` |
| `admin.service.ts` | `deleteReview(id)` | `/api/admin/reviews/:id` | `DELETE` |
| `admin.service.ts` | `getSettings()` | `/api/admin/settings` | `GET` |
| `admin.service.ts` | `updateSettings(data)` | `/api/admin/settings` | `PUT` |
