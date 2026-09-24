import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  KeyRound,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react'
import { authService } from '@/services'
import { useToastStore } from '@/store'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/utils'

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToastStore()

  const [step, setStep] = useState<'request' | 'reset-demo'>('request')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Reset password states (for simulated mock flow)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmitRequest = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      await authService.forgotPassword(data.email)
      setSubmittedEmail(data.email)
      setStep('reset-demo')
      showToast('Đã gửi mã khôi phục mật khẩu giả lập đến email của bạn!', 'success')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Yêu cầu không thành công'
      setErrorMessage(msg)
      showToast(msg, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyNewPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      showToast('Mật khẩu mới phải có tối thiểu 6 ký tự', 'warning')
      return
    }
    if (newPassword !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp', 'error')
      return
    }

    setIsLoading(true)
    try {
      // In mock flow, change password for demo user or registered email
      showToast('Mật khẩu tài khoản đã được cập nhật thành công! Vui lòng đăng nhập lại.', 'success')
      navigate('/dang-nhap')
    } finally {
      setIsLoading(false)
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Khôi Phục Mật Khẩu</h1>
          <p className="text-xs text-slate-500 mt-1">
            Lấy lại quyền truy cập vào tài khoản mua sắm của bạn
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-6">
          {step === 'request' ? (
            <>
              {/* Demo Hint */}
              <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Thử nghiệm nhanh với email mẫu:</span>
                  </span>
                  <p className="text-[11px] text-slate-600 mt-0.5">user@nova.vn</p>
                </div>
                <button
                  type="button"
                  onClick={() => setValue('email', 'user@nova.vn')}
                  className="px-2.5 py-1 bg-white border border-indigo-200 text-indigo-700 rounded-lg font-bold text-[11px] hover:bg-indigo-50"
                >
                  Tự động điền
                </button>
              </div>

              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmitRequest)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Địa chỉ Email đăng ký *</label>
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isLoading ? 'Đang kiểm tra...' : 'Gửi Yêu Cầu Khôi Phục'}</span>
                </button>
              </form>
            </>
          ) : (
            /* Step 2: Simulated Reset Password form */
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Xác minh email thành công!</span>
                </div>
                <p className="text-emerald-700">
                  Đã nhận diện tài khoản <strong>{submittedEmail}</strong>. Trong môi trường mô phỏng (frontend-only), bạn có thể thiết lập mật khẩu mới ngay bên dưới:
                </p>
              </div>

              <form onSubmit={handleApplyNewPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Mật khẩu mới *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Xác nhận mật khẩu mới *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-[0.98]"
                >
                  {isLoading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu Mới'}
                </button>
              </form>
            </div>
          )}

          {/* Back to Login */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              to="/dang-nhap"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang Đăng nhập</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
