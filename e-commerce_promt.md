Build a fully functional FRONTEND-ONLY e-commerce website using Vite + React + TypeScript. 
No real backend — simulate all data and authentication using mock JSON data, a fake API 
service layer (with artificial delay to mimic network calls), and localStorage/sessionStorage 
for persistence (cart, auth session, wishlist).

IMPORTANT: All UI content (labels, buttons, menus, messages, product names, placeholder text, 
notifications, etc.) must be written in Vietnamese. Code itself (variable names, comments, 
function names, file names) should remain in English for maintainability.

## TECH STACK
- Vite + React 18 + TypeScript
- React Router v6 for routing
- Tailwind CSS for styling (clean, modern, responsive design)
- Zustand (or Context API) for global state management (cart, auth, wishlist)
- React Hook Form + Zod for form validation
- Mock data stored in local JSON/TS files, accessed via a `services/` layer that simulates 
  async API calls (so it can be swapped for a real backend later)
- Icons: lucide-react

## AUTHENTICATION (mocked, no real backend)
- Two SEPARATE login systems with separate routes and separate UI layouts:
  1. **User auth**: `/dang-nhap` (login) and `/dang-ky` (register) — for customers
  2. **Admin auth**: `/admin/dang-nhap` — separate login page with different design, 
     for administrators only
- Role-based route protection: 
  - Protected user routes (account, order history, checkout) redirect to `/dang-nhap` if not logged in
  - Protected admin routes (`/admin/*`) redirect to `/admin/dang-nhap` if not logged in as admin
- Store a mock JWT/session object in localStorage with a `role` field (`user` | `admin`)
- Include a couple of hardcoded demo accounts (one user, one admin) so login can be tested 
  immediately without a backend

## CUSTOMER-FACING PAGES
1. **Trang chủ (Home)** — hero banner/slider, featured categories, best-selling products, 
   flash sale/promotion section, newsletter signup
2. **Trang danh sách sản phẩm (Product listing / category page)** — grid/list view toggle, 
   filters (price range, category, brand, rating), sorting (price, newest, popularity), 
   pagination
3. **Trang tìm kiếm (Search results)** — search bar with live suggestions, results page
4. **Trang chi tiết sản phẩm (Product detail)** — image gallery, size/color/variant selector, 
   quantity selector, add to cart, add to wishlist, description/specs/reviews tabs, 
   related products
5. **Giỏ hàng (Cart)** — editable quantities, remove items, apply coupon code, order summary, 
   persisted in localStorage
6. **Thanh toán (Checkout)** — multi-step (shipping info → payment method (mock) → review → 
   confirmation), order confirmation page with order number
7. **Đăng nhập / Đăng ký (Login / Register)** — with validation, "forgot password" mock flow
8. **Trang tài khoản (My Account)** — dashboard with tabs:
   - Thông tin cá nhân (profile info, edit)
   - Lịch sử đơn hàng (order history + order detail/status tracking)
   - Sổ địa chỉ (saved addresses)
   - Sản phẩm yêu thích (wishlist)
   - Đổi mật khẩu (change password)
9. **Trang yêu thích (Wishlist)**
10. **Trang giới thiệu (About us)**
11. **Trang liên hệ (Contact)** — contact form, map placeholder, company info
12. **Trang tin tức/blog (Blog/News)** — optional list + detail page
13. **Câu hỏi thường gặp (FAQ)**
14. **Chính sách (Policy pages)** — shipping policy, return policy, privacy policy (static content)
15. **Trang 404** — not found page with link back to home

## ADMIN PANEL (separate layout, e.g. sidebar navigation)
1. **Đăng nhập Admin** — separate login page (`/admin/dang-nhap`)
2. **Dashboard** — overview cards (revenue, orders, customers, products), simple charts 
   (use recharts) for sales trends
3. **Quản lý sản phẩm (Product management)** — table with search/filter, add/edit/delete 
   product (form with image upload preview, price, stock, category, variants)
4. **Quản lý danh mục (Category management)** — CRUD categories
5. **Quản lý đơn hàng (Order management)** — table with status filter, order detail view, 
   update order status (mock)
6. **Quản lý khách hàng (Customer management)** — list of registered users, view detail
7. **Quản lý mã giảm giá (Coupon/promotion management)** — CRUD coupons
8. **Quản lý đánh giá (Review management)** — approve/delete product reviews
9. **Cài đặt (Settings)** — store info, admin profile

## GENERAL REQUIREMENTS
- Fully responsive (mobile, tablet, desktop)
- Loading states (skeletons/spinners) and empty states for all data-fetching sections
- Toast notifications for actions (add to cart, login success, errors, etc.) — in Vietnamese
- Clean folder structure: `components/`, `pages/`, `layouts/` (separate `AdminLayout` and 
  `MainLayout`), `services/` (mock API), `store/` (state management), `types/`, `hooks/`, 
  `data/` (mock JSON)
- Strong TypeScript typing for all data models (Product, User, Order, Category, Coupon, etc.)
- Currency formatted as Vietnamese Dong (₫), e.g. "1.250.000₫"
- Provide realistic Vietnamese mock data (product names, categories, customer names, addresses) 
  — at least 15-20 sample products across 4-5 categories

Please scaffold the project structure first, then build page by page, starting with layouts 
and routing, then the customer-facing pages, then the admin panel.



