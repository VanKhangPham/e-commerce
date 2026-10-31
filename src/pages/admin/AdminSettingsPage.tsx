import React, { useState, useEffect } from 'react'
import {
  Store,
  Truck,
  Bell,
  Save,
} from 'lucide-react'
import { useToastStore } from '@/store'
import { adminService } from '@/services'

interface StoreSettings {
  storeName: string
  hotline: string
  email: string
  address: string
  slogan: string
  standardShippingFee: number
  freeShippingThreshold: number
  enableCOD: boolean
  enableBanking: boolean
  enableMoMo: boolean
  enableVNPay: boolean
  notifyOrderEmail: boolean
  notifyLowStock: boolean
  notifyAdminTelegram: boolean
}

const defaultSettings: StoreSettings = {
  storeName: 'NOVA Commerce - Thế Giới Công Nghệ Đỉnh Cao',
  hotline: '1900 8899 (Miễn cước)',
  email: 'hotro@nova.vn',
  address: 'Số 123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  slogan: 'Công nghệ tiên phong - Trải nghiệm hoàn mỹ',
  standardShippingFee: 30000,
  freeShippingThreshold: 2000000,
  enableCOD: true,
  enableBanking: true,
  enableMoMo: true,
  enableVNPay: true,
  notifyOrderEmail: true,
  notifyLowStock: true,
  notifyAdminTelegram: false,
}

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useToastStore()

  const [settings, setSettings] = useState<StoreSettings>(defaultSettings)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await adminService.getSettings()
        if (data) {
          setSettings((prev) => ({ ...prev, ...data }))
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      }
    }
    loadSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await adminService.updateSettings(settings)
      localStorage.setItem('nova_store_settings', JSON.stringify(settings))
      showToast('Đã lưu cấu hình hệ thống thành công!', 'success')
    } catch {
      showToast('Không thể lưu cấu hình hệ thống, vui lòng thử lại', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Cài Đặt Hệ Thống & Cửa Hàng
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Cấu hình thông tin thương hiệu, biểu phí vận chuyển và cơ chế thông báo tự động
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Store Information */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Store className="w-5 h-5 text-indigo-600" />
            <span>Thông Tin Thương Hiệu Cửa Hàng</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 block">Tên hiển thị cửa hàng *</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Hotline chăm sóc khách hàng *</label>
              <input
                type="text"
                value={settings.hotline}
                onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Email tiếp nhận hỗ trợ *</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 block">Địa chỉ văn phòng / Trụ sở chính *</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 block">Khẩu hiệu / Slogan</label>
              <input
                type="text"
                value={settings.slogan}
                onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 italic"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Shipping & Payment Settings */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Truck className="w-5 h-5 text-indigo-600" />
            <span>Biểu Phí Vận Chuyển & Thanh Toán</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Phí giao hàng tiêu chuẩn (VNĐ) *</label>
              <input
                type="number"
                value={settings.standardShippingFee}
                onChange={(e) =>
                  setSettings({ ...settings, standardShippingFee: Number(e.target.value) })
                }
                min={0}
                step={5000}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                Ngưỡng miễn phí vận chuyển (Freeship từ VNĐ) *
              </label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
                }
                min={0}
                step={100000}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold text-emerald-700"
              />
            </div>
          </div>

          <div className="pt-2">
            <span className="font-bold text-slate-700 block mb-2">
              Các cổng thanh toán chấp nhận:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-2xl border border-slate-200 cursor-pointer bg-slate-50 hover:bg-white">
                <input
                  type="checkbox"
                  checked={settings.enableCOD}
                  onChange={(e) => setSettings({ ...settings, enableCOD: e.target.checked })}
                  className="rounded text-indigo-600 w-4 h-4"
                />
                <span className="font-bold">Tiền mặt (COD)</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-2xl border border-slate-200 cursor-pointer bg-slate-50 hover:bg-white">
                <input
                  type="checkbox"
                  checked={settings.enableBanking}
                  onChange={(e) => setSettings({ ...settings, enableBanking: e.target.checked })}
                  className="rounded text-indigo-600 w-4 h-4"
                />
                <span className="font-bold">Chuyển khoản</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-2xl border border-slate-200 cursor-pointer bg-slate-50 hover:bg-white">
                <input
                  type="checkbox"
                  checked={settings.enableMoMo}
                  onChange={(e) => setSettings({ ...settings, enableMoMo: e.target.checked })}
                  className="rounded text-indigo-600 w-4 h-4"
                />
                <span className="font-bold">Ví MoMo</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-2xl border border-slate-200 cursor-pointer bg-slate-50 hover:bg-white">
                <input
                  type="checkbox"
                  checked={settings.enableVNPay}
                  onChange={(e) => setSettings({ ...settings, enableVNPay: e.target.checked })}
                  className="rounded text-indigo-600 w-4 h-4"
                />
                <span className="font-bold">VNPAY-QR</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Notification Toggles */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 font-bold text-slate-900 text-sm">
            <Bell className="w-5 h-5 text-indigo-600" />
            <span>Thông Báo Tự Động & Cảnh Báo</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Email xác nhận đơn hàng tự động cho khách</p>
                <p className="text-[11px] text-slate-400">Gửi hóa đơn điện tử ngay sau khi khách hoàn tất đặt hàng</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyOrderEmail}
                onChange={(e) => setSettings({ ...settings, notifyOrderEmail: e.target.checked })}
                className="rounded text-indigo-600 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Cảnh báo tồn kho thấp cho thủ kho</p>
                <p className="text-[11px] text-slate-400">Tự động gắn cờ cảnh báo khi sản phẩm trong kho còn dưới 5 chiếc</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyLowStock}
                onChange={(e) => setSettings({ ...settings, notifyLowStock: e.target.checked })}
                className="rounded text-indigo-600 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Báo cáo đơn hàng tức thì qua Telegram Admin Bot</p>
                <p className="text-[11px] text-slate-400">Bắn tin nhắn push notification về nhóm trực chiến quản trị</p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifyAdminTelegram}
                onChange={(e) => setSettings({ ...settings, notifyAdminTelegram: e.target.checked })}
                className="rounded text-indigo-600 w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Đang lưu cấu hình...' : 'Lưu Thay Đổi Cài Đặt'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
