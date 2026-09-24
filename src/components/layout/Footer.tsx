import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  Send,
  Heart,
} from 'lucide-react'
import { useToastStore } from '@/store'

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const { showToast } = useToastStore()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      showToast('Đăng ký nhận bản tin NOVA thành công! Cảm ơn bạn.', 'success')
      setEmail('')
    }
  }

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Features Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-900">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">100% Chính Hãng</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cam kết sản phẩm phân phối chính hãng có đầy đủ VAT và bảo hành.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Giao Nhanh 2 Giờ</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hỗ trợ giao siêu tốc tại khu vực nội thành TP.HCM và Hà Nội.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 flex-shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Thanh Toán Linh Hoạt</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Thanh toán khi nhận hàng (COD), Chuyển khoản, MoMo và VNPAY-QR.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Hỗ Trợ 24/7</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Đội ngũ chăm sóc khách hàng tận tâm luôn sẵn sàng giải đáp thắc mắc.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-950 font-black text-xl">
                N
              </div>
              <span className="text-2xl font-black tracking-tight text-white">NOVA</span>
            </Link>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Hệ thống bán lẻ thiết bị công nghệ, smartphone, máy tính xách tay và phụ kiện chính hãng hàng đầu Việt Nam. Nâng tầm trải nghiệm công nghệ sống cho người Việt.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Số 123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Tổng đài CSKH: 1900 8899 (8h00 - 21h30 hàng ngày)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Email hỗ trợ: support@nova.vn</span>
              </div>
            </div>
          </div>

          {/* Column 1: Products */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Danh Mục Sản Phẩm
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/danh-muc/dien-thoai-tablet" className="hover:text-white transition-colors">
                  Điện Thoại & Tablet
                </Link>
              </li>
              <li>
                <Link to="/danh-muc/laptop-may-tinh" className="hover:text-white transition-colors">
                  Laptop & Máy Tính
                </Link>
              </li>
              <li>
                <Link to="/danh-muc/am-thanh-tai-nghe" className="hover:text-white transition-colors">
                  Tai Nghe & Âm Thanh
                </Link>
              </li>
              <li>
                <Link to="/danh-muc/dong-ho-thong-minh" className="hover:text-white transition-colors">
                  Đồng Hồ Thông Minh
                </Link>
              </li>
              <li>
                <Link to="/danh-muc/phu-kien-cong-nghe" className="hover:text-white transition-colors">
                  Phụ Kiện Công Nghệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Hỗ Trợ Khách Hàng
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/chinh-sach/van-chuyen" className="hover:text-white transition-colors">
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link to="/chinh-sach/doi-tra" className="hover:text-white transition-colors">
                  Chính sách đổi trả & bảo hành
                </Link>
              </li>
              <li>
                <Link to="/chinh-sach/bao-mat" className="hover:text-white transition-colors">
                  Chính sách bảo mật thông tin
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Câu hỏi thường gặp (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/lien-he" className="hover:text-white transition-colors">
                  Liên hệ đóng góp ý kiến
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Nhận Tin Khuyến Mãi
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Đăng ký để nhận voucher 500k và cập nhật các đợt flash sale sớm nhất.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn..."
                  required
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                  aria-label="Gửi email"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-slate-500 block">
                Cam kết bảo mật, không gửi spam.
              </span>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1">
            <span>© 2026 NOVA Commerce. Bản quyền thuộc về NOVA E-Commerce. Thiết kế với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>tại Việt Nam.</span>
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-semibold text-slate-400">Phương thức thanh toán:</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-slate-300">
                COD
              </span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-rose-400">
                MoMo
              </span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-sky-400">
                VNPAY
              </span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-emerald-400">
                Banking
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
