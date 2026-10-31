import React, { useEffect } from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore, useToastStore } from '@/store'

interface AdminRouteProps {
  children?: React.ReactNode
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore()
  const { showToast } = useToastStore()
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated && role !== 'admin') {
      showToast('Tài khoản của bạn không có quyền truy cập khu vực Quản trị viên.', 'warning')
    }
  }, [isAuthenticated, role, showToast])

  if (!isAuthenticated) {
    return <Navigate to="/admin/dang-nhap" state={{ from: location }} replace />
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
