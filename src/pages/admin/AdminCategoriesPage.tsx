import React, { useState, useEffect } from 'react'
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Package,
} from 'lucide-react'
import { productService } from '@/services'
import type { Category } from '@/types'
import { useToastStore } from '@/store'

export const AdminCategoriesPage: React.FC = () => {
  const { showToast } = useToastStore()

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Form Fields
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const data = await productService.getCategories()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleOpenAdd = () => {
    setEditingCategory(null)
    setName('')
    setSlug('')
    setDescription('')
    setImage('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c)
    setName(c.name)
    setSlug(c.slug)
    setDescription(c.description)
    setImage(c.image || '')
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      showToast('Tên danh mục không được để trống', 'warning')
      return
    }

    const autoSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

    try {
      if (editingCategory) {
        // Edit existing
        const updated = categories.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name, slug: autoSlug, description, image }
            : c
        )
        setCategories(updated)
        showToast(`Đã cập nhật danh mục "${name}" thành công!`, 'success')
      } else {
        // Add new
        const newCat: Category = {
          id: `cat-${Date.now()}`,
          name,
          slug: autoSlug,
          description,
          image: image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?q=80&w=400&auto=format&fit=crop',
          productCount: 0,
        }
        setCategories([...categories, newCat])
        showToast(`Đã tạo mới danh mục "${name}" thành công!`, 'success')
      }

      setIsModalOpen(false)
    } catch {
      showToast('Có lỗi xảy ra khi lưu danh mục', 'error')
    }
  }

  const handleDelete = (c: Category) => {
    if (c.productCount > 0) {
      if (
        !window.confirm(
          `Danh mục "${c.name}" đang có ${c.productCount} sản phẩm trực thuộc. Bạn có chắc chắn muốn xóa?`
        )
      ) {
        return
      }
    } else {
      if (!window.confirm(`Bạn có chắc muốn xóa danh mục "${c.name}"?`)) return
    }

    setCategories(categories.filter((cat) => cat.id !== c.id))
    showToast(`Đã xóa danh mục "${c.name}" thành công!`, 'info')
  }

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Danh Mục Ngành Hàng
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Phân loại sản phẩm, quản lý menu điều hướng và cấu trúc bán hàng
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Danh Mục Mới</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs">
        <div className="relative max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên danh mục..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Categories Grid Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-xs text-slate-400">
            Đang tải danh mục ngành lẻ...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full p-8 text-center text-xs text-slate-400">
            Không tìm thấy danh mục nào.
          </div>
        ) : (
          filteredCategories.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                      <FolderTree className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">{c.name}</h2>
                      <span className="text-[10px] text-slate-400 font-mono">
                        /{c.slug}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Sửa danh mục"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Xóa danh mục"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.productCount} sản phẩm trực thuộc</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Đang hiển thị
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Tạo Danh Mục Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Tên danh mục *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ví dụ: Thiết Bị Đeo & Smartwatch"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Đường dẫn thân thiện (Slug)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="thiet-bi-deo (tùy chọn, tự sinh)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Mô tả tóm tắt</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Mô tả ngành hàng hiển thị trên website..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
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
                  {editingCategory ? 'Lưu Thay Đổi' : 'Tạo Danh Mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
