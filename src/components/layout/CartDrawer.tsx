import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store'
import { formatCurrency } from '@/utils'

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate()
  const { items, isCartDrawerOpen, closeCartDrawer, updateQuantity, removeItem, getSummary } =
    useCartStore()

  if (!isCartDrawerOpen) return null

  const summary = getSummary()

  const handleCheckout = () => {
    closeCartDrawer()
    navigate('/thanh-toan')
  }

  const handleViewCart = () => {
    closeCartDrawer()
    navigate('/gio-hang')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-slate-800" />
              <h2 className="text-base font-bold text-slate-900">
                Giỏ hàng của bạn ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Đóng giỏ hàng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Giỏ hàng của bạn đang trống
                </h3>
                <p className="text-xs text-slate-500 mb-6 max-w-xs">
                  Khám phá hàng ngàn sản phẩm công nghệ chính hãng với ưu đãi tốt nhất ngay hôm nay.
                </p>
                <button
                  onClick={() => {
                    closeCartDrawer()
                    navigate('/san-pham')
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Khám phá sản phẩm
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 group">
                  <Link
                    to={`/san-pham/${item.productSlug}`}
                    onClick={closeCartDrawer}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-100 group-hover:scale-105 transition-transform"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        to={`/san-pham/${item.productSlug}`}
                        onClick={closeCartDrawer}
                        className="text-xs font-bold text-slate-900 line-clamp-2 hover:text-indigo-600 transition-colors"
                      >
                        {item.productName}
                      </Link>

                      {item.selectedVariant && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Phân loại: <span className="font-medium text-slate-700">{item.selectedVariant.name}</span>
                        </p>
                      )}

                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                          aria-label="Giảm số lượng"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
                          aria-label="Tăng số lượng"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50">
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(summary.subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-slate-800">
                    {summary.shippingFee === 0 ? 'Miễn phí' : formatCurrency(summary.shippingFee)}
                  </span>
                </div>
                {summary.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-600 font-semibold">
                    <span>Giảm giá</span>
                    <span>-{formatCurrency(summary.discountAmount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Tổng tiền</span>
                  <span className="text-indigo-600">{formatCurrency(summary.total)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg"
                >
                  <span>Tiến hành thanh toán</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleViewCart}
                  className="w-full py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  Xem chi tiết giỏ hàng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
