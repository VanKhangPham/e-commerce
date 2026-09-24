import React, { useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Camera,
  Award,
  ShoppingBag,
  Coins,
  CheckCircle2,
} from 'lucide-react'
import { useAuthStore, useToastStore } from '@/store'
import { formatDate } from '@/utils'

export const ProfileTab: React.FC = () => {
  const { currentUser, updateUserProfile, isLoading } = useAuthStore()
  const { showToast } = useToastStore()

  const [name, setName] = useState(currentUser?.name || '')
  const [phone, setPhone] = useState(currentUser?.phone || '')
  const [avatar, setAvatar] = useState(currentUser?.avatar || '')
  const [isEditingAvatar, setIsEditingAvatar] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      showToast('Họ và tên không được để trống', 'warning')
      return
    }

    try {
      await updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        avatar: avatar.trim() || undefined,
      })
      showToast('Cập nhật hồ sơ thông tin cá nhân thành công!', 'success')
      setIsEditingAvatar(false)
    } catch {
      showToast('Không thể cập nhật hồ sơ cá nhân lúc này', 'error')
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900">Hồ Sơ Cá Nhân</h2>
        <p className="text-xs text-slate-500 mt-1">
          Quản lý thông tin hồ sơ của bạn để bảo mật tài khoản và nhận ưu đãi độc quyền
        </p>
      </div>

      {/* Member Tier & Loyalty Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl border border-indigo-100 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider block">
              Hạng thành viên
            </span>
            <span className="text-sm font-black text-slate-900">Thành Viên VIP Vàng</span>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-100 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
              Điểm thưởng tích lũy
            </span>
            <span className="text-sm font-black text-slate-900">1.250 NOVA Xu</span>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-2xl border border-sky-100 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-sky-700 tracking-wider block">
              Ngày tham gia
            </span>
            <span className="text-sm font-black text-slate-900">
              {currentUser ? formatDate(currentUser.createdAt) : '01/01/2026'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Profile Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group">
            <img
              src={
                avatar ||
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
              }
              alt={currentUser?.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-md"
            />
            <button
              type="button"
              onClick={() => setIsEditingAvatar(!isEditingAvatar)}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              title="Đổi ảnh đại diện"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 space-y-1 text-center sm:text-left">
            <p className="text-sm font-bold text-slate-900">{currentUser?.name}</p>
            <p className="text-xs text-slate-500">{currentUser?.email}</p>
            <p className="text-[11px] text-slate-400">
              Định dạng hình ảnh hợp lệ: PNG, JPG, WebP. Tối đa 2MB.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingAvatar(!isEditingAvatar)}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isEditingAvatar ? 'Đóng đường dẫn ảnh' : 'Đổi link ảnh'}
          </button>
        </div>

        {/* Avatar URL input if opened */}
        {isEditingAvatar && (
          <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-2 animate-in fade-in duration-150">
            <label className="text-xs font-bold text-indigo-950 block">
              Nhập đường dẫn (URL) ảnh đại diện mới:
            </label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        )}

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Họ và tên *</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Nguyễn Văn A"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Số điện thoại liên hệ *</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0908123456"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Địa chỉ Email (Định danh tài khoản)
            </label>
            <div className="relative">
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <span className="text-[10px] text-slate-400 block">
              Email dùng để bảo mật và xác minh đơn hàng, không thể thay đổi trực tiếp.
            </span>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi Hồ Sơ'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
