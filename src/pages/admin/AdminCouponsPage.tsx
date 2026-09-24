import React from 'react'

export const AdminCouponsPage: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Quản Lý Mã Giảm Giá (Coupons)</h2>
      <p className="text-xs text-slate-500">
        CRUD mã khuyến mãi, thiết lập % giảm hoặc số tiền cố định (Sẽ hoàn thiện chi tiết tại Bước 4.f).
      </p>
    </div>
  )
}
