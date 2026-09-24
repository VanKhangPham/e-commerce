import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import { MainLayout } from '@/layouts/MainLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

// Route Guards
import { ProtectedRoute } from './ProtectedRoute'
import { AdminRoute } from './AdminRoute'

// Customer Pages
import { HomePage } from '@/pages/customer/HomePage'
import { ProductListPage } from '@/pages/customer/ProductListPage'
import { ProductDetailPage } from '@/pages/customer/ProductDetailPage'
import { SearchPage } from '@/pages/customer/SearchPage'
import { CartPage } from '@/pages/customer/CartPage'
import { CheckoutPage } from '@/pages/customer/CheckoutPage'
import { OrderSuccessPage } from '@/pages/customer/OrderSuccessPage'
import { WishlistPage } from '@/pages/customer/WishlistPage'
import { AccountDashboard } from '@/pages/customer/account/AccountDashboard'
import { AboutPage } from '@/pages/customer/static/AboutPage'
import { ContactPage } from '@/pages/customer/static/ContactPage'
import { BlogPage } from '@/pages/customer/static/BlogPage'
import { BlogDetailPage } from '@/pages/customer/static/BlogDetailPage'
import { FaqPage } from '@/pages/customer/static/FaqPage'
import { PolicyPage } from '@/pages/customer/static/PolicyPage'
import { NotFoundPage } from '@/pages/customer/NotFoundPage'

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage'
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage'
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage'
import { AdminCustomersPage } from '@/pages/admin/AdminCustomersPage'
import { AdminCouponsPage } from '@/pages/admin/AdminCouponsPage'
import { AdminReviewsPage } from '@/pages/admin/AdminReviewsPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Customer Routes in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/san-pham" element={<ProductListPage />} />
        <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
        <Route path="/danh-muc/:slug" element={<ProductListPage />} />
        <Route path="/tim-kiem" element={<SearchPage />} />
        <Route path="/gio-hang" element={<CartPage />} />
        <Route path="/yeu-thich" element={<WishlistPage />} />
        <Route path="/gioi-thieu" element={<AboutPage />} />
        <Route path="/lien-he" element={<ContactPage />} />
        <Route path="/tin-tuc" element={<BlogPage />} />
        <Route path="/tin-tuc/:slug" element={<BlogDetailPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/chinh-sach/:type" element={<PolicyPage />} />

        {/* Customer Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/thanh-toan" element={<CheckoutPage />} />
          <Route path="/thanh-toan/thanh-cong" element={<OrderSuccessPage />} />
          <Route path="/tai-khoan" element={<AccountDashboard />} />
          <Route path="/tai-khoan/*" element={<AccountDashboard />} />
        </Route>

        {/* 404 Route within MainLayout */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Auth Standalone Routes */}
      <Route path="/dang-nhap" element={<LoginPage />} />
      <Route path="/dang-ky" element={<RegisterPage />} />
      <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />

      {/* Admin Auth Route */}
      <Route path="/admin/dang-nhap" element={<AdminLoginPage />} />

      {/* Admin Panel Protected Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/san-pham" element={<AdminProductsPage />} />
          <Route path="/admin/danh-muc" element={<AdminCategoriesPage />} />
          <Route path="/admin/don-hang" element={<AdminOrdersPage />} />
          <Route path="/admin/khach-hang" element={<AdminCustomersPage />} />
          <Route path="/admin/ma-giam-gia" element={<AdminCouponsPage />} />
          <Route path="/admin/danh-gia" element={<AdminReviewsPage />} />
          <Route path="/admin/cai-dat" element={<AdminSettingsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
