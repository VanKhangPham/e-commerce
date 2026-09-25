import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  LogIn,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useAuthStore, useToastStore } from '@/store'
import { loginSchema, type LoginFormData } from '@/utils'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginDemo, isLoading } = useAuthStore()
  const { showToast } = useToastStore()

  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Redirect destination after login
  const fromLocation = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/'

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
      await login(data.email, data.password, 'user')
      showToast('Đăng nhập thành công! Chào mừng bạn quay trở lại.', 'success')
      navigate(fromLocation, { replace: true })
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Đăng nhập không thành công'
      setErrorMessage(errorMsg)
      showToast(errorMsg, 'error')
    }
  }

  const handleQuickDemoLogin = async () => {
    setErrorMessage(null)
    try {
      setValue('email', 'user@nova.vn')
      setValue('password', 'user123')
      await loginDemo('user')
      showToast('Đăng nhập thành công với tài khoản khách hàng mẫu (Phạm Văn Khang)!', 'success')
      navigate(fromLocation, { replace: true })
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Đăng nhập demo thất bại'
      setErrorMessage(errorMsg)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              N
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black tracking-tight text-slate-900">NOVA</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Commerce
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Đăng Nhập Khách Hàng</h1>
          <p className="text-xs text-slate-500 mt-1">
            Đăng nhập để theo dõi đơn hàng và tận hưởng ưu đãi thành viên
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-6">
          {/* Quick Demo Login Banner */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-100 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tài Khoản Thử Nghiệm (Demo)</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                1-Click
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mb-3">
              Email: <code className="bg-white px-1.5 py-0.5 rounded font-mono text-indigo-700 font-bold">user@nova.vn</code> | Pass: <code className="bg-white px-1.5 py-0.5 rounded font-mono text-indigo-700 font-bold">user123</code>
            </p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Đăng nhập nhanh bằng tài khoản Demo</span>
            </button>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Địa chỉ Email</label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Mật khẩu</label>
                <Link
                  to="/quen-mat-khau"
                  className="text-[11px] font-semibold text-indigo-600 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-600">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-slate-900 focus:ring-slate-900 w-4 h-4 border-slate-300"
                />
                <span>Ghi nhớ phiên đăng nhập</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Đang xác thực...' : 'Đăng Nhập'}</span>
            </button>
          </form>

          {/* Social Sign-in Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-medium">Hoặc tiếp tục với</span>
            </div>
          </div>

          {/* Mock Social Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.64 1.35-.57.65-.98 1.72-.85 2.74 1.01.08 2.05-.51 2.57-1.24z" />
              </svg>
              <span>Apple ID</span>
            </button>
          </div>

          {/* Switch to Register */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Chưa có tài khoản tại NOVA?{' '}
              <Link to="/dang-ky" className="font-bold text-indigo-600 hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Security Assurance */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Hệ thống bảo mật dữ liệu đạt chuẩn mã hóa SSL 256-bit</span>
        </div>
      </div>
    </div>
  )
}
