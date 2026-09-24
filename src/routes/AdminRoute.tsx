import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store'

interface AdminRouteProps {
  children?: React.ReactNode
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, role } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/admin/dang-nhap" state={{ from: location }} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
