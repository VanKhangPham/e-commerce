# 🛒 NOVA Commerce — Nền Tảng Thương Mại Điện Tử Toàn Diện

NOVA Commerce là giải pháp thương mại điện tử full-stack hiện đại, được xây dựng với kiến trúc hướng dịch vụ, hiệu năng cao và độ bảo mật chuẩn doanh nghiệp. Dự án bao gồm giao diện khách hàng (Customer Storefront), hệ thống quản trị chuyên sâu (Admin Dashboard) và RESTful API backend hoàn chỉnh kết nối cơ sở dữ liệu PostgreSQL.

---

## 🌟 Tính Năng Chính

### 1. Dành cho Khách Hàng (Customer Storefront)
- **Duyệt & Tìm kiếm:** Phân trang sản phẩm, lọc theo danh mục, mức giá, thương hiệu, đánh giá và tìm kiếm thông minh.
- **Chi tiết sản phẩm:** Thư viện ảnh, thông số kỹ thuật, biến thể (màu sắc/phiên bản), đánh giá đã xác thực và gợi ý sản phẩm liên quan.
- **Giỏ hàng & Wishlist:** Đồng bộ hóa lai (Hybrid Sync) giữa `localStorage` và tài khoản người dùng trên máy chủ backend.
- **Thanh toán & Mã giảm giá:** Tích hợp kiểm tra mã giảm giá (Fixed / Percentage) tự động, tính phí vận chuyển theo chính sách và hỗ trợ đa dạng phương thức (COD, Chuyển khoản, MoMo, VNPay).
- **Lịch sử đơn hàng:** Theo dõi chi tiết hành trình đơn hàng theo thời gian thực (Order Timeline) và hủy đơn hàng khi đang chờ xử lý.

### 2. Dành cho Quản Trị Viên (Admin Panel)
- **Thống kê tổng quan (Dashboard):** Biểu đồ doanh thu hàng tháng, phân bổ doanh số theo danh mục, top sản phẩm bán chạy và KPIs thời gian thực.
- **Quản lý sản phẩm & danh mục:** Thêm, sửa, xóa, tìm kiếm và tải lên hình ảnh sản phẩm trực tiếp.
- **Quản lý đơn hàng:** Xem danh sách, lọc theo trạng thái và cập nhật trạng thái đơn (Chờ xử lý, Đã xác nhận, Đang giao, Đã giao, Đã hủy).
- **Quản lý khách hàng:** Xem danh sách khách hàng, lịch sử chi tiêu, số lượng đơn hàng và tính năng khóa / mở khóa tài khoản tức thì.
- **Quản lý khuyến mãi (Coupons):** Tạo mã giảm giá, giới hạn số lượt dùng và thời gian áp dụng.
- **Kiểm duyệt đánh giá (Reviews):** Phê duyệt hoặc gỡ bỏ đánh giá của khách hàng.
- **Cài đặt cửa hàng:** Cấu hình phí ship, ngưỡng miễn phí vận chuyển, thông tin liên hệ và phương thức thanh toán.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, React Hook Form, Zod, Lucide React, Recharts.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM 5.22, PostgreSQL 16 (Docker).
- **Bảo mật:** JWT (Access Token 15m + Refresh Token xoay vòng 7d), Bcrypt password hashing, Helmet, Rate Limiter, CORS protection.
- **Kiểm thử & Tính nhất quán:** Bộ test E2E kiểm thử 23 kịch bản cốt lõi và kiểm tra giao dịch nguyên tử chống bán vượt tồn kho (Stock Concurrency Control).

---

## 🚀 Hướng Dẫn Khởi Chạy

### Yêu Cầu Tiên Quyết
- [Node.js](https://nodejs.org/) (phiên bản 18+ hoặc 20+)
- [Docker Desktop](https://www.docker.com/) (để chạy PostgreSQL và Adminer)

---

### Bước 1: Khởi động Cơ sở Dữ liệu (PostgreSQL)

Mở terminal tại thư mục gốc của dự án hoặc thư mục `backend/`:

```bash
cd backend
docker compose up -d
```

> **Lưu ý:** Lệnh trên sẽ khởi chạy:
> - **PostgreSQL:** cổng `5432` (`nova_postgres_db`)
> - **Adminer GUI (Quản lý DB trực quan):** truy cập tại `http://localhost:8080` (Hệ quản trị: PostgreSQL, Máy chủ: `postgres`, Người dùng: `nova_admin`, Mật khẩu: `nova_secret_2026`, CSDL: `nova_commerce_db`).

---

### Bước 2: Cài Đặt và Khởi Chạy Backend

1. Cài đặt các gói thư viện:
```bash
cd backend
npm install
```

2. Tạo file cấu hình môi trường `.env`:
Sao chép từ `.env.example`:
```bash
cp .env.example .env
```

3. Cập nhật cấu trúc database và nạp dữ liệu mẫu (Seed):
```bash
# Đồng bộ hóa Prisma Schema với Database
npm run db:generate

# Nạp dữ liệu mẫu khởi đầu
npm run db:seed
```

4. Khởi động Backend Server ở chế độ phát triển:
```bash
npm run dev
```

- **API Base URL:** `http://localhost:5000/api`
- **Tài liệu Swagger UI:** `http://localhost:5000/api/docs`
- **Health Check:** `http://localhost:5000/api/health`

---

### Bước 3: Cài Đặt và Khởi Chạy Frontend

Mở một cửa sổ terminal mới tại thư mục gốc của dự án:

1. Cài đặt các gói thư viện:
```bash
npm install
```

2. Khởi chạy ứng dụng:
```bash
npm run dev
```

- Ứng dụng sẽ khả dụng tại: **`http://localhost:5173`**

---

## 🔑 Tài Khoản Demo

Hệ thống đã được thiết lập sẵn tài khoản mẫu để bạn trải nghiệm ngay lập tức:

| Vai trò | Email đăng nhập | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Khách hàng** | `user@nova.vn` | `user123` | Mua hàng, giỏ hàng, đặt đơn, xem lịch sử đơn |
| **Quản trị viên** | `admin@nova.vn` | `admin123` | Toàn quyền quản trị hệ thống tại `/admin` |

*Khi đăng nhập tại trang `/dang-nhap`, hệ thống sẽ tự động nhận diện vai trò và chuyển hướng quản trị viên đến bảng điều khiển Admin hoặc khách hàng về trang chủ.*

---

## 🧪 Kiểm Thử Tự Động (Automated Testing)

Dự án tích hợp bộ kiểm thử tự động toàn diện bao gồm:
1. **Kiểm thử E2E (End-to-End):** Xác thực 23 luồng API chính từ đăng ký, đăng nhập, giỏ hàng, áp mã giảm giá, tạo đơn, hủy đơn, kiểm tra tồn kho cho đến duyệt đơn và khóa tài khoản từ phía Admin.
2. **Kiểm thử tranh chấp đồng thời (Concurrency Test):** Xác nhận giao dịch nguyên tử của Prisma ORM ngăn chặn triệt để tình trạng bán vượt tồn kho khi nhiều khách hàng cùng đặt mua sản phẩm cuối cùng.

Chạy kiểm thử từ thư mục gốc:
```bash
npm test
```

---

## 💾 Quy Trình Sao Lưu & Khôi Phục (Backup & Restore)

Hệ thống cung cấp sẵn các script sao lưu và phục hồi dữ liệu tự động:

- **Sao lưu:**
  - Windows: `powershell -ExecutionPolicy Bypass -File backend/scripts/backup.ps1`
  - Linux/Docker: `./backend/scripts/backup.sh`
- **Khôi phục:**
  - Windows: `powershell -ExecutionPolicy Bypass -File backend/scripts/restore.ps1 -BackupFile <duong-dan-file.sql>`
  - Linux/Docker: `./backend/scripts/restore.sh <duong-dan-file.sql>`

Chi tiết xem tại [`backend/BACKUP_AND_RESTORE.md`](file:///backend/BACKUP_AND_RESTORE.md).

---

## 🏗️ Kiểm Tra & Đóng Gói (Production Build)

- **Frontend Build:** `npm run build` (kiểm tra kiểu TypeScript và đóng gói Vite)
- **Frontend Lint:** `npm run lint` (ESLint 9 với TypeScript ESLint)
- **Backend Build:** `npm run build --prefix backend` (biên dịch TypeScript và xuất Prisma Client)
- **Triển khai Nginx:** File cấu hình [`nginx.conf`](file:///nginx.conf) đã sẵn sàng phục vụ frontend tĩnh, proxy ngược các request `/api/` về container backend và kích hoạt nén Gzip.
