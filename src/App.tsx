import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '@/routes'
import { useAuthStore, useCartStore, useWishlistStore } from '@/store'

export const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore()
  const { syncWithBackend: syncCart } = useCartStore()
  const { syncWithBackend: syncWishlist } = useWishlistStore()

  useEffect(() => {
    if (isAuthenticated) {
      syncCart().catch(() => {})
      syncWishlist().catch(() => {})
    }
  }, [isAuthenticated, syncCart, syncWishlist])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
