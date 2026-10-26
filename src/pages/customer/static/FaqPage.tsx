import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HelpCircle,
  ChevronDown,
  Search,
} from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
  category: 'order' | 'shipping' | 'return' | 'warranty'
}

export const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndices, setOpenIndices] = useState<number[]>([0])

  const faqs: FaqItem[] = [
    {
      category: 'order',
      question: 'Tôi có thể mua hàng tại NOVA mà không cần đăng ký tài khoản không?',
      answer: 'Hoàn toàn được! Bạn có thể đặt hàng nhanh với tư cách Khách (Guest Checkout) chỉ bằng việc cung cấp họ tên, số điện thoại và địa chỉ nhận hàng. Tuy nhiên, việc đăng ký tài khoản sẽ giúp bạn nhận ngay voucher 500.000₫, tích lũy điểm thưởng NOVA Xu và theo dõi lịch sử đơn hàng tiện lợi hơn.',
    },
    {
      category: 'order',
      question: 'NOVA hỗ trợ những phương thức thanh toán nào?',
      answer: 'Chúng tôi hỗ trợ 4 hình thức thanh toán đa dạng: (1) Thanh toán tiền mặt khi nhận hàng (COD), (2) Chuyển khoản ngân hàng trực tiếp 24/7, (3) Ví điện tử MoMo, và (4) Cổng thanh toán quét mã VNPAY-QR hỗ trợ hơn 40 ngân hàng nội địa.',
    },
    {
      category: 'order',
      question: 'Làm thế nào để áp dụng mã giảm giá (Voucher) vào đơn hàng?',
      answer: 'Tại trang Giỏ hàng hoặc bước Thanh toán, bạn chỉ cần nhập mã khuyến mãi vào ô "Mã giảm giá" và bấm "Áp dụng". Hệ thống sẽ tự động trừ trực tiếp số tiền chiết khấu vào tổng thanh toán của bạn nếu đơn hàng thỏa mãn điều kiện.',
    },
    {
      category: 'shipping',
      question: 'Thời gian giao hàng tiêu chuẩn tại NOVA là bao lâu?',
      answer: 'Tại khu vực nội thành TP. Hồ Chí Minh và Hà Nội, NOVA hỗ trợ giao hàng hỏa tốc trong 2 giờ hoặc trong ngày. Đối với các tỉnh thành khác trên toàn quốc, thời gian giao hàng dự kiến từ 1 đến 3 ngày làm việc thông qua các đối tác vận chuyển uy tín.',
    },
    {
      category: 'shipping',
      question: 'Chính sách miễn phí vận chuyển (Freeship) áp dụng như thế nào?',
      answer: 'Mọi đơn hàng có giá trị thanh toán từ 2.000.000₫ trở lên đều được miễn phí vận chuyển 100% trên phạm vi toàn quốc. Với các đơn hàng dưới mức này, mức phí giao hàng đồng giá chỉ là 30.000₫.',
    },
    {
      category: 'shipping',
      question: 'Tôi có được đồng kiểm (kiểm tra hàng) trước khi thanh toán không?',
      answer: 'Có! NOVA khuyến khích khách hàng đồng kiểm tình trạng bao bì nguyên vẹn và số lượng sản phẩm cùng nhân viên giao hàng trước khi ký nhận và thanh toán tiền mặt (đối với đơn COD).',
    },
    {
      category: 'return',
      question: 'Chính sách đổi trả sản phẩm trong 30 ngày hoạt động ra sao?',
      answer: 'Trong vòng 30 ngày kể từ ngày nhận hàng, nếu sản phẩm gặp lỗi kỹ thuật do nhà sản xuất (phần cứng), NOVA sẽ tiến hành đổi mới 1 - 1 ngay lập tức cho bạn hoàn toàn miễn phí. Khách hàng chỉ cần giữ lại đầy đủ hộp máy, phụ kiện và hóa đơn mua hàng.',
    },
    {
      category: 'return',
      question: 'Nếu đổi trả, tôi có phải chịu phí vận chuyển không?',
      answer: 'Nếu sản phẩm bị lỗi từ nhà sản xuất hoặc do NOVA giao nhầm hàng, mọi chi phí vận chuyển phát sinh trong quá trình thu hồi và đổi mới sẽ do NOVA chi trả 100%.',
    },
    {
      category: 'warranty',
      question: 'Sản phẩm mua tại NOVA được bảo hành ở đâu?',
      answer: 'Tất cả sản phẩm điện thoại, máy tính bảng, laptop, tai nghe bán ra tại NOVA đều là hàng chính hãng 100%. Bạn có thể mang thiết bị đến bất kỳ Trung tâm bảo hành ủy quyền chính thức của hãng (như Apple Care, Samsung Service, Sony Center,...) hoặc gửi về trực tiếp các showroom NOVA để được hỗ trợ tiếp nhận.',
    },
    {
      category: 'warranty',
      question: 'Bảo hành điện tử tại NOVA được kích hoạt như thế nào?',
      answer: 'Hệ thống bảo hành điện tử của NOVA sẽ tự động được kích hoạt theo số IMEI/Serial Number và số điện thoại của bạn ngay sau khi đơn hàng được giao thành công. Bạn không cần phải giữ lại phiếu bảo hành giấy.',
    },
  ]

  const toggleAccordion = (index: number) => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter((i) => i !== index))
    } else {
      setOpenIndices([...openIndices, index])
    }
  }

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCat = activeCategory === 'all' || faq.category === activeCategory
    const q = searchQuery.toLowerCase().trim()
    const matchesQ =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q)
    return matchesCat && matchesQ
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
          Giải đáp thắc mắc
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Câu Hỏi Thường Gặp (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Tìm kiếm nhanh câu trả lời cho các thắc mắc phổ biến về quy trình đặt hàng, giao vận, chính sách đổi trả và bảo hành chính hãng.
        </p>

        {/* Search */}
        <div className="pt-4 max-w-md mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm câu hỏi của bạn (ví dụ: giao hàng, đổi trả...)"
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-full text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Tất cả câu hỏi
        </button>

        <button
          onClick={() => setActiveCategory('order')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
            activeCategory === 'order'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Đặt hàng & Thanh toán
        </button>

        <button
          onClick={() => setActiveCategory('shipping')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
            activeCategory === 'shipping'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Vận chuyển & Giao nhận
        </button>

        <button
          onClick={() => setActiveCategory('return')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
            activeCategory === 'return'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Đổi trả 30 ngày
        </button>

        <button
          onClick={() => setActiveCategory('warranty')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
            activeCategory === 'warranty'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Bảo hành chính hãng
        </button>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border">
            Không tìm thấy câu hỏi phù hợp với từ khóa &quot;{searchQuery}&quot;.
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx)

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-xs sm:text-sm hover:text-indigo-600 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-slate-900' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-3 pl-11">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Still Have Questions Box */}
      <div className="p-8 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white">Bạn vẫn còn câu hỏi cần giải đáp?</h3>
          <p className="text-xs text-slate-300">
            Tổng đài hỗ trợ 1900 8899 luôn sẵn sàng tư vấn trực tiếp và miễn phí cước gọi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/lien-he"
            className="px-6 py-3 bg-white text-slate-900 rounded-full text-xs font-bold hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            Gửi tin nhắn liên hệ
          </Link>
          <a
            href="tel:19008899"
            className="px-6 py-3 bg-indigo-600 text-white rounded-full text-xs font-bold hover:bg-indigo-500 transition-colors whitespace-nowrap shadow-sm"
          >
            Gọi 1900 8899
          </a>
        </div>
      </div>
    </div>
  )
}
