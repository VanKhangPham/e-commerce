import React from 'react'
import { useParams, Link } from 'react-router-dom'

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto w-full">
      <Link to="/tin-tuc" className="text-xs font-bold text-indigo-600 hover:underline mb-4 inline-block">
        &larr; Quay lại danh sách tin tức
      </Link>
      <h1 className="text-2xl font-black text-slate-900 mb-4">Chi tiết bài viết: {slug}</h1>
      <p className="text-sm text-slate-600 leading-relaxed">
        Nội dung chi tiết bài viết đánh giá công nghệ.
      </p>
    </div>
  )
}
