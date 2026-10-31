import React, { useState, useEffect } from 'react'
import {
  Ticket,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Copy,
} from 'lucide-react'
import { couponService } from '@/services'
import type { Coupon } from '@/types'
import { formatCurrency, formatDate } from '@/utils'
import { useToastStore } from '@/store'

export const AdminCouponsPage: React.FC = () => {
  const { showToast } = useToastStore()

  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)

  // Form Fields
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState<number>(10)
  const [minOrderValue, setMinOrderValue] = useState<number>(0)
  const [maxDiscount, setMaxDiscount] = useState<number>(500000)
  const [expiryDate, setExpiryDate] = useState('2026-12-31')
  const [usageLimit, setUsageLimit] = useState<number>(1000)
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)

  const loadCoupons = async () => {
    setIsLoading(true)
    try {
      const data = await couponService.getCoupons()
      setCoupons(data)
    } catch (err) {
      console.error('Error fetching coupons:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCoupons()
  }, [])

  const handleOpenAdd = () => {
    setEditingCoupon(null)
    setCode('')
    setDiscountType('percentage')
    setDiscountValue(10)
    setMinOrderValue(500000)
    setMaxDiscount(500000)
    setExpiryDate('2026-12-31')
    setUsageLimit(500)
    setDescription('')
    setIsActive(true)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c)
    setCode(c.code)
    setDiscountType(c.discountType)
    setDiscountValue(c.discountValue)
    setMinOrderValue(c.minOrderValue)
    setMaxDiscount(c.maxDiscount || 0)
    setExpiryDate(c.expiryDate ? c.expiryDate.split('T')[0] : '2026-12-31')
    setUsageLimit(c.usageLimit)
    setDescription(c.description)
    setIsActive(c.isActive)
    setIsModalOpen(true)
  }

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      showToast('Mã voucher không được để trống', 'warning')
      return
    }

    try {
      if (editingCoupon) {
        await couponService.updateCoupon(editingCoupon.id, {
          code: code.trim().toUpperCase(),
          discountType,
          discountValue,
          minOrderValue,
          maxDiscount: maxDiscount || undefined,
          expiryDate: new Date(expiryDate).toISOString(),
          usageLimit,
          description,
          isActive,
        })
        showToast(`Đã cập nhật mã "${code.toUpperCase()}" thành công!`, 'success')
      } else {
        await couponService.createCoupon({
          code: code.trim().toUpperCase(),
          discountType,
          discountValue,
          minOrderValue,
          maxDiscount: maxDiscount || undefined,
          expiryDate: new Date(expiryDate).toISOString(),
          usageLimit,
          description,
          isActive,
        })
        showToast(`Đã tạo mã giảm giá mới "${code.toUpperCase()}" thành công!`, 'success')
      }

      setIsModalOpen(false)
      loadCoupons()
    } catch {
      showToast('Có lỗi xảy ra khi lưu mã giảm giá', 'error')
    }
  }

  const handleToggleActive = async (c: Coupon) => {
    try {
      await couponService.updateCoupon(c.id, { isActive: !c.isActive })
      setCoupons((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, isActive: !c.isActive } : item))
      )
      showToast(
        !c.isActive
          ? `Đã kích hoạt mã "${c.code}"`
          : `Đã vô hiệu hóa mã "${c.code}"`,
        !c.isActive ? 'success' : 'info'
      )
    } catch {
      showToast('Không thể thay đổi trạng thái mã lúc này', 'error')
    }
  }

  const handleDeleteCoupon = async (id: string, couponCode: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa mã giảm giá "${couponCode}"?`)) return

    try {
      await couponService.deleteCoupon(id)
      setCoupons((prev) => prev.filter((item) => item.id !== id))
      showToast(`Đã xóa mã "${couponCode}" thành công`, 'info')
    } catch {
      showToast('Không thể xóa mã lúc này', 'error')
    }
  }

  const handleCopyCode = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode)
    showToast(`Đã sao chép mã "${couponCode}" vào bộ nhớ tạm`, 'info')
  }

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Mã Giảm Giá & Voucher
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập các chương trình khuyến mãi, chiết khấu và mã miễn phí vận chuyển
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Voucher Mới</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs">
        <div className="relative max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã voucher, mô tả..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-xs text-slate-400">
            Đang tải danh sách mã giảm giá...
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="col-span-full p-8 text-center text-xs text-slate-400">
            Không tìm thấy voucher nào.
          </div>
        ) : (
          filteredCoupons.map((c) => {
            const isExpired = new Date(c.expiryDate) < new Date()

            return (
              <div
                key={c.id}
                className={`bg-white rounded-3xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                  !c.isActive || isExpired
                    ? 'border-slate-200 opacity-60 bg-slate-50/50'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Code and Badges */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl font-mono text-sm font-black tracking-wider bg-slate-900 text-white flex items-center gap-1.5 shadow-sm">
                        <Ticket className="w-4 h-4 text-indigo-400" />
                        <span>{c.code}</span>
                      </span>
                      <button
                        onClick={() => handleCopyCode(c.code)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Sao chép mã"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(c.id, c.code)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Xóa voucher"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Value and Description */}
                  <div>
                    <span className="text-lg font-black text-indigo-600 block">
                      {c.discountType === 'percentage'
                        ? `Giảm ${c.discountValue}%`
                        : `Giảm ${formatCurrency(c.discountValue)}`}
                    </span>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  {/* Terms */}
                  <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p>• Đơn tối thiểu: <strong>{formatCurrency(c.minOrderValue)}</strong></p>
                    {c.maxDiscount && (
                      <p>• Giảm tối đa: <strong>{formatCurrency(c.maxDiscount)}</strong></p>
                    )}
                    <p>
                      • Hạn dùng: <strong>{formatDate(c.expiryDate)}</strong>
                      {isExpired && <span className="text-rose-600 font-bold ml-1">(Đã hết hạn)</span>}
                    </p>
                    <p>
                      • Đã dùng: <strong>{c.usageCount}</strong> / {c.usageLimit} lượt
                    </p>
                  </div>
                </div>

                {/* Footer Toggle */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Trạng thái:</span>
                  <button
                    onClick={() => handleToggleActive(c)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                      c.isActive && !isExpired
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {c.isActive && !isExpired ? 'Đang kích hoạt' : 'Tạm tắt'}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-10 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCoupon ? 'Chỉnh Sửa Mã Giảm Giá' : 'Tạo Voucher Khuyến Mãi Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Mã Voucher (Code) *</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  placeholder="VD: NOVA2026, FREESHIP..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Loại chiết khấu *</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold"
                  >
                    <option value="percentage">Theo phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    {discountType === 'percentage' ? 'Phần trăm giảm (%) *' : 'Số tiền giảm (VNĐ) *'}
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    required
                    min={1}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Đơn tối thiểu áp dụng (VNĐ)</label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    step={1000}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Giảm tối đa (VNĐ)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(Number(e.target.value))}
                    step={1000}
                    placeholder="Để 0 nếu không giới hạn"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Ngày hết hạn *</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Lượt sử dụng tối đa</label>
                  <input
                    type="number"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    min={1}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Mô tả chương trình khuyến mãi *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={2}
                  placeholder="Giảm 10% tối đa 500k cho khách hàng mua lần đầu..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
                  />
                  <span>Kích hoạt mã sử dụng ngay sau khi tạo</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  {editingCoupon ? 'Lưu Cập Nhật' : 'Tạo Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
