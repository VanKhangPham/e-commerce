import React from 'react'

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Bảng Điều Khiển Tổng Quan (Dashboard)</h2>
        <p className="text-xs text-slate-500">
          Thống kê doanh thu, số lượng đơn hàng, khách hàng mới và biểu đồ Recharts (Sẽ hoàn thiện chi tiết tại Bước 4.f).
        </p>
      </div>
    </div>
  )
}
