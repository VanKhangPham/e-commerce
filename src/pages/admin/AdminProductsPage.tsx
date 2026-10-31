import React, { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react'
import { productService } from '@/services'
import type { Category, Product } from '@/types'
import { formatCurrency } from '@/utils'
import { useToastStore } from '@/store'

export const AdminProductsPage: React.FC = () => {
  const { showToast } = useToastStore()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Modal State (Add / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form Fields
  const [formName, setFormName] = useState('')
  const [formBrand, setFormBrand] = useState('')
  const [formCategoryId, setFormCategoryId] = useState('')
  const [formPrice, setFormPrice] = useState<number>(0)
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(0)
  const [formStock, setFormStock] = useState<number>(10)
  const [formThumbnail, setFormThumbnail] = useState('')
  const [formShortDesc, setFormShortDesc] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formIsFeatured, setFormIsFeatured] = useState(false)
  const [formIsFlashSale, setFormIsFlashSale] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [cats, prodsRes] = await Promise.all([
        productService.getCategories(),
        productService.getProducts({ limit: 100 }),
      ])
      setCategories(cats)
      setProducts(prodsRes.items)
      if (cats.length > 0) {
        setFormCategoryId((prev) => prev || cats[0].id)
      }
    } catch (err) {
      console.error('Failed to load admin products:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProduct(null)
    setFormName('')
    setFormBrand('Apple')
    setFormCategoryId(categories[0]?.id || '')
    setFormPrice(1000000)
    setFormOriginalPrice(1200000)
    setFormStock(25)
    setFormThumbnail('https://images.unsplash.com/photo-1511707171634-5f897ff02560?q=80&w=800&auto=format&fit=crop')
    setFormShortDesc('')
    setFormDesc('')
    setFormIsFeatured(false)
    setFormIsFlashSale(false)
    setIsModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p)
    setFormName(p.name)
    setFormBrand(p.brand)
    setFormCategoryId(p.categoryId)
    setFormPrice(p.price)
    setFormOriginalPrice(p.originalPrice)
    setFormStock(p.stock)
    setFormThumbnail(p.thumbnail)
    setFormShortDesc(p.shortDescription)
    setFormDesc(p.description)
    setFormIsFeatured(p.isFeatured ?? false)
    setFormIsFlashSale(p.isFlashSale ?? false)
    setIsModalOpen(true)
  }

  // Submit Add or Edit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || formPrice <= 0) {
      showToast('Vui lòng nhập tên sản phẩm và mức giá hợp lệ', 'warning')
      return
    }

    const catObj = categories.find((c) => c.id === formCategoryId)
    const categoryName = catObj?.name || 'Khác'

    try {
      if (editingProduct) {
        // Update existing
        await productService.updateProduct(editingProduct.id, {
          name: formName,
          brand: formBrand,
          categoryId: formCategoryId,
          categoryName,
          price: formPrice,
          originalPrice: formOriginalPrice >= formPrice ? formOriginalPrice : formPrice,
          discountPercentage:
            formOriginalPrice > formPrice
              ? Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100)
              : 0,
          stock: formStock,
          thumbnail: formThumbnail,
          shortDescription: formShortDesc,
          description: formDesc,
          isFeatured: formIsFeatured,
          isFlashSale: formIsFlashSale,
        })
        showToast(`Đã cập nhật sản phẩm "${formName}" thành công!`, 'success')
      } else {
        // Create new
        const slug = formName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')

        await productService.createProduct({
          name: formName,
          slug: `${slug}-${Date.now().toString().slice(-4)}`,
          brand: formBrand,
          categoryId: formCategoryId,
          categoryName,
          price: formPrice,
          originalPrice: formOriginalPrice >= formPrice ? formOriginalPrice : formPrice,
          discountPercentage:
            formOriginalPrice > formPrice
              ? Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100)
              : 0,
          stock: formStock,
          soldCount: 0,
          rating: 5,
          reviewCount: 0,
          images: [formThumbnail],
          thumbnail: formThumbnail,
          shortDescription: formShortDesc,
          description: formDesc,
          specifications: [
            { name: 'Thương hiệu', value: formBrand },
            { name: 'Bảo hành', value: '12 tháng chính hãng' },
          ],
          variants: [],
          tags: [formBrand, categoryName],
          isFeatured: formIsFeatured,
          isFlashSale: formIsFlashSale,
        })
        showToast(`Đã thêm sản phẩm mới "${formName}" thành công!`, 'success')
      }

      setIsModalOpen(false)
      loadData()
    } catch {
      showToast('Có lỗi xảy ra khi lưu sản phẩm', 'error')
    }
  }

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" khỏi hệ thống?`)) return

    try {
      await productService.deleteProduct(id)
      showToast(`Đã xóa sản phẩm "${name}" thành công`, 'info')
      loadData()
    } catch {
      showToast('Không thể xóa sản phẩm lúc này', 'error')
    }
  }

  // Filtering products
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)

    const matchesCategory =
      selectedCategory === 'all' || p.categoryId === selectedCategory

    let matchesStock = true
    if (stockFilter === 'in_stock') matchesStock = p.stock > 5
    if (stockFilter === 'low_stock') matchesStock = p.stock > 0 && p.stock <= 5
    if (stockFilter === 'out_of_stock') matchesStock = p.stock === 0

    return matchesQuery && matchesCategory && matchesStock
  })

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản Lý Sản Phẩm
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý kho hàng, cập nhật biến thể, giá bán và trạng thái khuyến mãi
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Tìm theo tên sản phẩm, hãng..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">Tất cả ngành hàng</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value as 'all' | 'in_stock' | 'low_stock' | 'out_of_stock')
              setCurrentPage(1)
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">Tất cả trạng thái kho</option>
            <option value="in_stock">Còn nhiều hàng (&gt; 5)</option>
            <option value="low_stock">Sắp hết hàng (1 - 5)</option>
            <option value="out_of_stock">Hết hàng (0)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Sản phẩm</th>
                <th className="p-4">Danh mục</th>
                <th className="p-4">Giá bán</th>
                <th className="p-4">Tồn kho</th>
                <th className="p-4">Đã bán</th>
                <th className="p-4">Huy hiệu</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Đang tải dữ liệu sản phẩm...
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Không tìm thấy sản phẩm nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name & Thumbnail */}
                    <td className="p-4 min-w-[240px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.thumbnail || prod.images[0]}
                          alt={prod.name}
                          className="w-12 h-12 object-contain rounded-xl bg-slate-50 border p-1 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                          <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                            {prod.brand}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 font-semibold text-slate-700 whitespace-nowrap">
                      {prod.categoryName}
                    </td>

                    {/* Price */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-black text-slate-900 block">
                        {formatCurrency(prod.price)}
                      </span>
                      {prod.originalPrice > prod.price && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatCurrency(prod.originalPrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock Status */}
                    <td className="p-4 whitespace-nowrap">
                      {prod.stock === 0 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Hết hàng (0)
                        </span>
                      ) : prod.stock <= 5 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Sắp hết ({prod.stock})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Còn hàng ({prod.stock})
                        </span>
                      )}
                    </td>

                    {/* Sold count */}
                    <td className="p-4 font-bold text-slate-700 whitespace-nowrap">
                      {prod.soldCount}
                    </td>

                    {/* Badges */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {prod.isFlashSale && (
                          <span className="p-1 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold" title="Flash Sale">
                            <Zap className="w-3 h-3 fill-amber-600 text-amber-600" />
                          </span>
                        )}
                        {prod.isFeatured && (
                          <span className="p-1 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold" title="Nổi bật">
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{' '}
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)} trên tổng{' '}
              {filteredProducts.length} sản phẩm
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-bold text-slate-900">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 z-10 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Chỉnh Sửa Thông Tin Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  placeholder="iPhone 16 Pro Max 256GB"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Brand & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Thương hiệu *</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    required
                    placeholder="Apple, Samsung, Sony..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Danh mục ngành hàng *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prices & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Giá bán thực tế (VNĐ) *</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    required
                    min={1000}
                    step={1000}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Giá gốc niêm yết (VNĐ)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    min={0}
                    step={1000}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Số lượng tồn kho *</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    required
                    min={0}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Đường dẫn ảnh đại diện (Thumbnail URL) *</label>
                <input
                  type="url"
                  value={formThumbnail}
                  onChange={(e) => setFormThumbnail(e.target.value)}
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Mô tả ngắn gọn</label>
                <textarea
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  rows={2}
                  placeholder="Tóm tắt điểm nhấn nổi bật..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Long Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Mô tả chi tiết sản phẩm</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={4}
                  placeholder="Nội dung giới thiệu công năng, thông số..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Toggles: Featured & Flash Sale */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-slate-300"
                  />
                  <span>Gắn thẻ Nổi Bật (Featured)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formIsFlashSale}
                    onChange={(e) => setFormIsFlashSale(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 border-slate-300"
                  />
                  <span>Đưa vào Flash Sale Giá Sốc</span>
                </label>
              </div>

              {/* Form Buttons */}
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
                  {editingProduct ? 'Cập Nhật Sản Phẩm' : 'Tạo Sản Phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
