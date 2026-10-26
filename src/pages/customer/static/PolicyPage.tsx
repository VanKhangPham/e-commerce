import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ShieldCheck,
  RotateCcw,
  Truck,
  Lock,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react'

export const PolicyPage: React.FC = () => {
  const { policyType } = useParams<{ policyType?: string }>()

  // Active policy tab
  const [activeTab, setActiveTab] = useState<string>(policyType || 'bao-hanh')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
          Quy định & Quyền lợi khách hàng
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Chính Sách Bán Hàng & Dịch Vụ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          NOVA Commerce cam kết mang đến chính sách bảo vệ quyền lợi người tiêu dùng minh bạch, rõ ràng và uy tín số 1 tại Việt Nam.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('bao-hanh')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-colors ${
            activeTab === 'bao-hanh'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Chính sách Bảo hành 12 Tháng</span>
        </button>

        <button
          onClick={() => setActiveTab('doi-tra')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-colors ${
            activeTab === 'doi-tra'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-sky-400" />
          <span>Chính sách Đổi trả 30 Ngày</span>
        </button>

        <button
          onClick={() => setActiveTab('van-chuyen')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-colors ${
            activeTab === 'van-chuyen'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Truck className="w-4 h-4 text-indigo-400" />
          <span>Chính sách Vận chuyển</span>
        </button>

        <button
          onClick={() => setActiveTab('bao-mat')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-colors ${
            activeTab === 'bao-mat'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Lock className="w-4 h-4 text-amber-400" />
          <span>Chính sách Bảo mật</span>
        </button>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-8 text-xs text-slate-700 leading-relaxed">
        {/* Tab 1: Warranty Policy */}
        {activeTab === 'bao-hanh' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span>Chính Sách Bảo Hành Chính Hãng 100%</span>
              </h2>
              <p className="text-slate-400 mt-1">Áp dụng cho tất cả các thiết bị công nghệ phân phối tại NOVA Commerce</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">1. Thời gian bảo hành tiêu chuẩn</h3>
              <p>
                Tất cả sản phẩm điện thoại di động, máy tính bảng, laptop, tai nghe cao cấp và thiết bị công nghệ do NOVA phân phối đều được bảo hành chính hãng tối thiểu <strong>12 tháng</strong> (hoặc lên đến 24 tháng theo chính sách từng hãng).
              </p>

              <h3 className="text-sm font-bold text-slate-900">2. Kích hoạt bảo hành điện tử</h3>
              <p>
                Hệ thống bảo hành điện tử tự động kích hoạt thông qua số IMEI / Serial Number của máy ngay sau khi đơn hàng được giao thành công. Khách hàng không cần lưu trữ phiếu bảo hành giấy.
              </p>

              <h3 className="text-sm font-bold text-slate-900">3. Điều kiện bảo hành hợp lệ</h3>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                <li>Sản phẩm còn trong thời hạn bảo hành căn cứ theo ngày kích hoạt điện tử.</li>
                <li>Máy phát sinh lỗi kỹ thuật phần cứng do lỗi của nhà sản xuất (không lên nguồn, lỗi màn hình, lỗi micro, lỗi camera,...).</li>
                <li>Số IMEI/Serial Number trên thân máy trùng khớp với dữ liệu đơn hàng và không bị tẩy xóa, cạo sửa.</li>
              </ul>

              <h3 className="text-sm font-bold text-slate-900">4. Các trường hợp từ chối bảo hành miễn phí</h3>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Lưu ý quan trọng:</span>
                </p>
                <p>• Sản phẩm bị ẩm ướt, vào nước, cháy nổ, biến dạng do rơi vỡ hoặc tác động ngoại lực.</p>
                <p>• Sản phẩm đã qua sửa chữa, can thiệp phần cứng tại các địa chỉ không được ủy quyền chính hãng.</p>
                <p>• Hao mòn tự nhiên về ngoại quan trong quá trình sử dụng (xước sơn, trầy viền).</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Return Policy */}
        {activeTab === 'doi-tra' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-6 h-6 text-sky-600" />
                <span>Chính Sách Đổi Trả Miễn Phí Trong 30 Ngày</span>
              </h2>
              <p className="text-slate-400 mt-1">Cam kết lỗi 1 đổi 1 nhanh chóng, bảo vệ quyền lợi người mua hàng</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">1. Điều kiện áp dụng 1 Đổi 1</h3>
              <p>
                Trong vòng <strong>30 ngày</strong> đầu tiên tính từ thời điểm nhận hàng, nếu thiết bị gặp lỗi kỹ thuật từ nhà sản xuất, khách hàng sẽ được đổi ngay 01 sản phẩm mới nguyên seal cùng mẫu mã mà không phải trả thêm bất kỳ chi phí nào.
              </p>

              <h3 className="text-sm font-bold text-slate-900">2. Yêu cầu về sản phẩm đổi trả</h3>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                <li>Sản phẩm giữ nguyên tem niêm phong bảo hành, không có dấu hiệu cấn móp, trầy xước nặng.</li>
                <li>Đầy đủ hộp trùng IMEI và toàn bộ phụ kiện kèm theo (cáp sạc, sách hướng dẫn, que chọc sim,...).</li>
                <li>Đã đăng xuất toàn bộ tài khoản bảo mật cá nhân (iCloud, Google Account, Samsung Account).</li>
              </ul>

              <h3 className="text-sm font-bold text-slate-900">3. Quy trình tiếp nhận đổi trả</h3>
              <p>
                Khách hàng chỉ cần gọi hotline <strong>1900 8899</strong> hoặc mang máy tới showroom NOVA gần nhất. Đối với khách hàng ở xa, nhân viên bưu tá sẽ đến tận nhà nhận lại máy và gửi máy mới về tận nơi trong 24 - 48 giờ.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Shipping Policy */}
        {activeTab === 'van-chuyen' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-6 h-6 text-indigo-600" />
                <span>Chính Sách Giao Nhận & Vận Chuyển Hỏa Tốc</span>
              </h2>
              <p className="text-slate-400 mt-1">Giao hàng an toàn, bảo hiểm hàng hóa 100% trong quá trình vận chuyển</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">1. Dịch vụ Giao hàng hỏa tốc 2 Giờ</h3>
              <p>
                Áp dụng cho các đơn hàng tại khu vực nội thành TP. Hồ Chí Minh và Hà Nội. Sản phẩm được đóng gói 3 lớp chống sốc và bàn giao bởi đội ngũ giao vận chuyên trách của NOVA.
              </p>

              <h3 className="text-sm font-bold text-slate-900">2. Biểu phí vận chuyển toàn quốc</h3>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <p>• <strong>Miễn phí vận chuyển (Freeship 100%)</strong>: Dành cho tất cả các đơn hàng từ <strong>2.000.000₫</strong> trở lên.</p>
                <p>• <strong>Phí giao tiêu chuẩn đồng giá 30.000₫</strong>: Dành cho các đơn hàng phụ kiện dưới 2.000.000₫ trên toàn quốc.</p>
              </div>

              <h3 className="text-sm font-bold text-slate-900">3. Chính sách Đồng kiểm khi nhận hàng</h3>
              <p>
                Khách hàng được quyền mở hộp niêm phong bên ngoài để kiểm tra đúng mẫu mã, màu sắc và số lượng trước khi thanh toán. Nếu bao bì có dấu hiệu rách nát, khách hàng hoàn toàn có quyền từ chối nhận hàng.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Privacy Policy */}
        {activeTab === 'bao-mat' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-6 h-6 text-amber-600" />
                <span>Chính Sách Bảo Mật Thông Tin Khách Hàng</span>
              </h2>
              <p className="text-slate-400 mt-1">Cam kết tuân thủ nghiêm ngặt Luật An toàn thông tin mạng</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">1. Mục đích thu thập thông tin</h3>
              <p>
                NOVA chỉ thu thập các thông tin cần thiết (Họ tên, SĐT, Email, Địa chỉ nhận hàng) nhằm mục đích xử lý đơn hàng, phát hành hóa đơn điện tử và gửi thông báo hành trình vận chuyển.
              </p>

              <h3 className="text-sm font-bold text-slate-900">2. Cam kết bảo mật dữ liệu</h3>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                <li>Toàn bộ thông tin truyền tải trên website đều được mã hóa bằng giao thức SSL 256-bit chuẩn quốc tế.</li>
                <li>Tuyệt đối <strong>không bán, không chia sẻ</strong> thông tin khách hàng cho bất kỳ bên thứ ba nào vì mục đích thương mại.</li>
                <li>Dữ liệu thanh toán thẻ ngân hàng được xử lý trực tiếp qua cổng thanh toán bảo mật PCI-DSS, hệ thống NOVA không lưu trữ số thẻ của khách hàng.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Support Box */}
      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-slate-700">
            Bạn có thắc mắc thêm về các điều khoản hoặc cần trợ giúp trực tiếp?
          </span>
        </div>
        <Link
          to="/lien-he"
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors whitespace-nowrap"
        >
          Liên hệ trung tâm hỗ trợ
        </Link>
      </div>
    </div>
  )
}
