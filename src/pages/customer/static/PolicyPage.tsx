import React from 'react'
import { useParams } from 'react-router-dom'

export const PolicyPage: React.FC = () => {
  const { type } = useParams<{ type: string }>()

  const policyTitles: Record<string, string> = {
    'van-chuyen': 'Chính Sách Vận Chuyển & Giao Hàng',
    'doi-tra': 'Chính Sách Đổi Trả & Bảo Hành',
    'bao-mat': 'Chính Sách Bảo Mật Thông Tin Khách Hàng',
  }

  const title = policyTitles[type || ''] || 'Chính Sách Hoạt Động'

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-black text-slate-900 mb-4">{title}</h1>
      <p className="text-sm text-slate-600 leading-relaxed">
        Nội dung chính sách quy định chi tiết của hệ thống thương mại điện tử NOVA Commerce.
      </p>
    </div>
  )
}
