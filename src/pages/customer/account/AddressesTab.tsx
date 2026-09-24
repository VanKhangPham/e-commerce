import React, { useState } from 'react'
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Phone,
} from 'lucide-react'
import { useAuthStore, useToastStore } from '@/store'
import type { SavedAddress } from '@/types'

export const AddressesTab: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuthStore()
  const { showToast } = useToastStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)

  // Form states
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [ward, setWard] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  const addresses = currentUser?.addresses || []

  const handleOpenAddModal = () => {
    setEditingAddressId(null)
    setFullName(currentUser?.name || '')
    setPhone(currentUser?.phone || '')
    setProvince('Thành phố Hồ Chí Minh')
    setDistrict('')
    setWard('')
    setAddressDetail('')
    setIsDefault(addresses.length === 0)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (addr: SavedAddress) => {
    setEditingAddressId(addr.id)
    setFullName(addr.fullName)
    setPhone(addr.phone)
    setProvince(addr.province)
    setDistrict(addr.district)
    setWard(addr.ward)
    setAddressDetail(addr.addressDetail)
    setIsDefault(addr.isDefault)
    setIsModalOpen(true)
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !phone.trim() || !addressDetail.trim() || !district.trim()) {
      showToast('Vui lòng điền đầy đủ các thông tin bắt buộc', 'warning')
      return
    }

    try {
      let updatedAddresses: SavedAddress[] = [...addresses]

      if (editingAddressId) {
        // Edit existing
        updatedAddresses = updatedAddresses.map((a) => {
          if (a.id === editingAddressId) {
            return {
              ...a,
              fullName,
              phone,
              province,
              district,
              ward,
              addressDetail,
              isDefault,
            }
          }
          return isDefault ? { ...a, isDefault: false } : a
        })
      } else {
        // Add new
        const newAddr: SavedAddress = {
          id: `addr-${Date.now()}`,
          fullName,
          phone,
          province,
          district,
          ward,
          addressDetail,
          isDefault,
        }
        if (isDefault) {
          updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }))
        }
        updatedAddresses.push(newAddr)
      }

      await updateUserProfile({ addresses: updatedAddresses })
      showToast(
        editingAddressId ? 'Đã cập nhật địa chỉ thành công!' : 'Đã thêm địa chỉ mới thành công!',
        'success'
      )
      setIsModalOpen(false)
    } catch {
      showToast('Không thể lưu địa chỉ lúc này', 'error')
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return

    try {
      const updated = addresses.filter((a) => a.id !== id)
      // If deleted address was default and other addresses exist, set first as default
      if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
        updated[0].isDefault = true
      }
      await updateUserProfile({ addresses: updated })
      showToast('Đã xóa địa chỉ thành công', 'info')
    } catch {
      showToast('Không thể xóa địa chỉ lúc này', 'error')
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const updated = addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
      await updateUserProfile({ addresses: updated })
      showToast('Đã đặt làm địa chỉ mặc định!', 'success')
    } catch {
      showToast('Không thể đặt mặc định lúc này', 'error')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Sổ Địa Chỉ Giao Hàng</h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý các địa chỉ nhận hàng để thanh toán nhanh hơn chỉ với 1 chạm
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm địa chỉ mới</span>
        </button>
      </div>

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="p-10 bg-white rounded-3xl border border-slate-200/80 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Chưa có địa chỉ nào được lưu</h3>
          <p className="text-xs text-slate-500 mb-4">
            Thêm địa chỉ giao hàng để đặt hàng nhanh chóng và chính xác.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 rounded-3xl border transition-all bg-white relative flex flex-col justify-between ${
                addr.isDefault
                  ? 'border-indigo-600 ring-2 ring-indigo-600/10 shadow-sm'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{addr.fullName}</span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Mặc định
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(addr)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Xóa địa chỉ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{addr.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      {addr.addressDetail}, {addr.ward}, {addr.district}, {addr.province}
                    </span>
                  </div>
                </div>
              </div>

              {!addr.isDefault && (
                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Thiết lập làm mặc định
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingAddressId ? 'Cập Nhật Địa Chỉ Nhận Hàng' : 'Thêm Địa Chỉ Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Họ và tên *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Số điện thoại *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="0908123456"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tỉnh / TP *</label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                    placeholder="Hồ Chí Minh"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Quận / Huyện *</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    placeholder="Quận 1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phường / Xã *</label>
                  <input
                    type="text"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    required
                    placeholder="Bến Nghé"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Địa chỉ cụ thể *</label>
                <input
                  type="text"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  required
                  placeholder="Số nhà, tên đường, số tầng, tòa nhà..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
                  />
                  <span>Đặt địa chỉ này làm địa chỉ nhận hàng mặc định</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Lưu Địa Chỉ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
