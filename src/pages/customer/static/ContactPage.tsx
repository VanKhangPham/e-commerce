import React, { useState } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Building,
} from 'lucide-react'
import { useToastStore } from '@/store'

export const ContactPage: React.FC = () => {
  const { showToast } = useToastStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('tu_van_mua_hang')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Vui lòng điền đầy đủ các thông tin bắt buộc', 'warning')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      showToast('Cảm ơn bạn đã liên hệ! Chuyên viên NOVA sẽ phản hồi trong vòng 30 phút.', 'success')
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
      setIsSubmitting(false)
    }, 400)
  }

  const showrooms = [
    {
      city: 'TP. Hồ Chí Minh (Flagship Store)',
      address: 'Số 123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. HCM',
      phone: '028 3822 8899',
      hours: '08:30 - 21:30 (Mở cửa cả ngày lễ & CN)',
    },
    {
      city: 'Hà Nội (Showroom Tràng Tiền)',
      address: 'Số 45 Phố Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
      phone: '024 3936 8899',
      hours: '08:30 - 21:30 (Mở cửa cả ngày lễ & CN)',
    },
    {
      city: 'Đà Nẵng (Showroom Hải Châu)',
      address: 'Số 88 Đường Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng',
      phone: '0236 388 8899',
      hours: '08:30 - 21:00 (Mở cửa cả ngày lễ & CN)',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
          Trung tâm hỗ trợ khách hàng
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Liên Hệ Với NOVA Commerce
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Đội ngũ chuyên viên tư vấn luôn sẵn sàng giải đáp thắc mắc, hỗ trợ kỹ thuật và tiếp nhận ý kiến đóng góp của quý khách hàng 24/7.
        </p>
      </div>

      {/* Main Grid: Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Channels (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Contact Cards */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tổng Đài Miễn Phí</h3>
                <p className="text-xs text-slate-500 mt-0.5">Tư vấn mua hàng & Bảo hành:</p>
                <a href="tel:19008899" className="text-base font-black text-indigo-600 hover:underline block mt-1">
                  1900 8899
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Email Trực Tuyến</h3>
                <p className="text-xs text-slate-500 mt-0.5">Phản hồi cam kết trong 30 phút:</p>
                <a href="mailto:hotro@nova.vn" className="text-xs font-bold text-slate-800 hover:text-indigo-600 block mt-1">
                  hotro@nova.vn
                </a>
                <a href="mailto:doanhnghiep@nova.vn" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 block mt-0.5">
                  doanhnghiep@nova.vn (Khách hàng B2B)
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Giờ Hoạt Động Showroom</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Thứ Hai - Chủ Nhật: <strong>08:30 - 21:30</strong>
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  Phục vụ xuyên suốt các ngày Lễ, Tết
                </span>
              </div>
            </div>
          </div>

          {/* Showroom Locations */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>Hệ Thống Cửa Hàng Trực Tiếp</span>
            </h3>

            <div className="space-y-3.5 divide-y divide-slate-100 text-xs">
              {showrooms.map((sh, idx) => (
                <div key={idx} className="pt-3.5 first:pt-0 space-y-1">
                  <p className="font-bold text-slate-900">{sh.city}</p>
                  <p className="text-slate-500 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{sh.address}</span>
                  </p>
                  <p className="text-slate-500 pl-5">Hotline: {sh.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>Gửi Tin Nhắn Cho Chúng Tôi</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Vui lòng điền thông tin bên dưới, chuyên viên tư vấn sẽ liên hệ lại với bạn sớm nhất.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Họ và tên của bạn *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Số điện thoại liên hệ *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0908 123 456"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Địa chỉ Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Chủ đề cần hỗ trợ</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer font-medium"
                >
                  <option value="tu_van_mua_hang">Tư vấn chọn mua thiết bị</option>
                  <option value="bao_hanh_doi_tra">Yêu cầu bảo hành / Đổi trả</option>
                  <option value="khieu_nai_dich_vu">Phản ánh chất lượng phục vụ</option>
                  <option value="hop_tac_kinh_doanh">Hợp tác phân phối & Doanh nghiệp</option>
                  <option value="khac">Vấn đề khác</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Nội dung chi tiết *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                placeholder="Mô tả cụ thể thắc mắc hoặc yêu cầu của bạn để chúng tôi hỗ trợ tốt nhất..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang gửi tin nhắn...' : 'Gửi Yêu Cầu Hỗ Trợ'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
