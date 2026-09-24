import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
} from 'lucide-react'
import { useAuthStore, useToastStore } from '@/store'
import { authService } from '@/services'
import { changePasswordSchema, type ChangePasswordFormData } from '@/utils'

export const ChangePasswordTab: React.FC = () => {
  const { currentUser } = useAuthStore()
  const { showToast } = useToastStore()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (!currentUser) return

    setIsSubmitting(true)
    try {
      await authService.changePassword(
        currentUser.id,
        data.currentPassword,
        data.newPassword
      )
      showToast('Đổi mật khẩu tài khoản thành công!', 'success')
      reset()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đổi mật khẩu thất bại'
      showToast(msg, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-xl animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900">Đổi Mật Khẩu</h2>
        <p className="text-xs text-slate-500 mt-1">
          Để bảo vệ tài khoản, vui lòng không chia sẻ mật khẩu của bạn cho bất kỳ ai khác
        </p>
      </div>

      {/* Security Tip Box */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Tiêu chuẩn mật khẩu an toàn:</span>
        </div>
        <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-0.5 pl-1">
          <li>Mật khẩu mới phải có tối thiểu 6 ký tự</li>
          <li>Nên kết hợp chữ cái viết hoa, viết thường và chữ số</li>
          <li>Mật khẩu mới không được trùng với mật khẩu hiện tại</li>
        </ul>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 block">Mật khẩu hiện tại *</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              {...register('currentPassword')}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-[11px] text-rose-600">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 block">Mật khẩu mới *</label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword')}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-[11px] text-rose-600">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 block">Xác nhận mật khẩu mới *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmNewPassword')}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmNewPassword && (
            <p className="text-[11px] text-rose-600">{errors.confirmNewPassword.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang cập nhật mật khẩu...' : 'Xác Nhận Đổi Mật Khẩu'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
