import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Zap,
  ExternalLink,
  Terminal,
  Activity,
} from 'lucide-react'
import { useAuthStore, useToastStore } from '@/store'
import { loginSchema, type LoginFormData } from '@/utils'

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginDemo, isLoading } = useAuthStore()
  const { showToast } = useToastStore()

  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Redirect destination after login
  const fromLocation = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin/dashboard'

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null)
    try {
      await login(data.email, data.password, 'admin')
      showToast('Xác thực quản trị viên thành công! Chào mừng tới Bảng Điều Khiển.', 'success')
      navigate(fromLocation, { replace: true })
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Đăng nhập quản trị viên thất bại'
      setErrorMessage(errorMsg)
      showToast(errorMsg, 'error')
    }
  }

  const handleQuickDemoAdminLogin = async () => {
    setErrorMessage(null)
    try {
      setValue('email', 'admin@nova.vn')
      setValue('password', 'admin123')
      await loginDemo('admin')
      showToast('Đăng nhập thành công với tài khoản Quản Trị Viên (admin@nova.vn)!', 'success')
      navigate(fromLocation, { replace: true })
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Đăng nhập demo admin thất bại'
      setErrorMessage(errorMsg)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Tech Mesh Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-600/30">
            N
          </div>
          <div>
            <span className="text-base font-extrabold text-white tracking-tight block leading-tight">
              NOVA Admin Portal
            </span>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Bảo Mật Cấp Cao (Internal System)
            </span>
          </div>
        </div>

        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          <span>Về Website Bán Hàng</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto my-auto z-10 py-8">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Xác Thực Quyền Quản Trị
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khu vực điều hành dành riêng cho ban quản trị và nhân viên kiểm duyệt NOVA Commerce.
            </p>
          </div>

          {/* Quick Demo Admin Button */}
          <div className="p-4 bg-slate-950/80 border border-indigo-900/50 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Tài Khoản Admin Mẫu (Demo)</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700 font-bold">
                1-Click Sẵn Sàng
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Email: <code className="text-white font-bold bg-slate-900 px-1 rounded">admin@nova.vn</code> | Pass: <code className="text-white font-bold bg-slate-900 px-1 rounded">admin123</code>
            </p>
            <button
              type="button"
              onClick={handleQuickDemoAdminLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.98]"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Đăng nhập nhanh với quyền Admin</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-950/80 border border-rose-800 rounded-2xl text-xs text-rose-300 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Admin Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Email Quản Trị *</label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  placeholder="admin@nova.vn"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Mật Khẩu Quản Trị *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-500 hover:text-slate-300 absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'Đang xác thực hệ thống...' : 'Đăng Nhập Quản Trị'}</span>
            </button>
          </form>

          {/* System Security Notice */}
          <div className="pt-4 border-t border-slate-800 text-center space-y-1 text-[11px] text-slate-500">
            <p className="flex items-center justify-center gap-1.5 text-slate-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hệ thống ghi nhận nhật ký truy cập IP theo quy định an toàn thông tin.</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center text-[11px] text-slate-600 z-10 py-2">
        © 2026 NOVA Commerce Portal Management. Mọi quyền truy cập trái phép đều bị xử lý theo quy định pháp luật.
      </footer>
    </div>
  )
}
