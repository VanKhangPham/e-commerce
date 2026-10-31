import React, { useState, useEffect } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { ToastContainer } from '@/components/feedback/ToastContainer'
import { useAuthStore } from '@/store'

export const MainLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { role } = useAuthStore()

  // Scroll to top on route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFC] text-slate-800 font-sans">
      {/* Admin Quick Return Bar if Admin is browsing Storefront */}
      {role === 'admin' && (
        <div className="bg-slate-950 text-slate-200 text-xs px-4 py-2 border-b border-indigo-900/60 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">
              Đang xem cửa hàng với tư cách <strong className="text-white">Quản Trị Viên (Admin)</strong>
            </span>
          </div>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-all shadow-xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Vào Bảng Điều Khiển Admin &rarr;</span>
          </Link>
        </div>
      )}

      {/* Header */}
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Main Page Outlet */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-in Cart Drawer */}
      <CartDrawer />

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Global Notification Toast Container */}
      <ToastContainer />
    </div>
  )
}
