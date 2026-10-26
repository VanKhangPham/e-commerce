import React from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ArrowRight,
} from 'lucide-react'

export const AboutPage: React.FC = () => {
  const leadershipTeam = [
    {
      name: 'Trần Minh Đức',
      role: 'Đồng sáng lập & Tổng Giám đốc (CEO)',
      bio: 'Hơn 15 năm kinh nghiệm điều hành chuỗi bán lẻ công nghệ cao cấp tại Việt Nam và Đông Nam Á.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    },
    {
      name: 'Lê Thùy Trang',
      role: 'Giám đốc Trải nghiệm Khách hàng (CXO)',
      bio: 'Chuyên gia xây dựng tiêu chuẩn dịch vụ khách hàng 5 sao, luôn đặt sự hài lòng của người dùng làm trung tâm.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    },
    {
      name: 'Nguyễn Quốc Tuấn',
      role: 'Giám đốc Công nghệ & Sản phẩm (CTO)',
      bio: 'Kỹ sư trưởng với tầm nhìn kiến tạo nền tảng thương mại điện tử thế hệ mới, mượt mà và bảo mật tuyệt đối.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    },
  ]

  const milestones = [
    {
      year: '2020',
      title: 'Khởi đầu đam mê',
      desc: 'NOVA thành lập tại TP. Hồ Chí Minh với showroom đầu tiên chuyên phân phối các thiết bị công nghệ Apple và âm thanh cao cấp.',
    },
    {
      year: '2022',
      title: 'Trở thành đối tác ủy quyền',
      desc: 'Ký kết hợp tác chính thức với các tập đoàn công nghệ hàng đầu như Apple, Samsung, Sony, Marshall và Dell.',
    },
    {
      year: '2024',
      title: 'Tiên phong Giao siêu tốc 2 Giờ',
      desc: 'Triển khai trung tâm kho vận thông minh tại Hà Nội & TP. HCM, cam kết giao hàng trong 2 giờ nội thành.',
    },
    {
      year: '2026',
      title: 'Đạt mốc 50.000+ Khách hàng',
      desc: 'Ra mắt nền tảng NOVA Commerce 2.0 mang lại trải nghiệm mua sắm kỹ thuật số cá nhân hóa và bảo hành điện tử trọn đời.',
    },
  ]

  return (
    <div className="space-y-16 pb-16 animate-in fade-in duration-200">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-indigo-300 text-xs font-extrabold tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>CÂU CHUYỆN THƯƠNG HIỆU NOVA COMMERCE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
            Kiến Tạo Trải Nghiệm Công Nghệ Đỉnh Cao
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Chúng tôi tin rằng công nghệ không chỉ là những thông số kỹ thuật khô khan, mà là nguồn cảm hứng giúp nâng tầm phong cách sống và khai phá tiềm năng sáng tạo của mỗi cá nhân.
          </p>
        </div>
      </section>

      {/* 2. Stats Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xl">
          <div className="text-center p-3 border-r last:border-r-0 border-slate-100">
            <span className="text-2xl sm:text-4xl font-black text-indigo-600 block">50.000+</span>
            <span className="text-xs font-bold text-slate-700 mt-1 block">Khách hàng tin chọn</span>
            <span className="text-[11px] text-slate-400">Trên khắp 63 tỉnh thành</span>
          </div>

          <div className="text-center p-3 border-r last:border-r-0 border-slate-100">
            <span className="text-2xl sm:text-4xl font-black text-emerald-600 block">100%</span>
            <span className="text-xs font-bold text-slate-700 mt-1 block">Chính hãng ủy quyền</span>
            <span className="text-[11px] text-slate-400">Đầy đủ hóa đơn VAT</span>
          </div>

          <div className="text-center p-3 border-r last:border-r-0 border-slate-100">
            <span className="text-2xl sm:text-4xl font-black text-sky-600 block">2 Giờ</span>
            <span className="text-xs font-bold text-slate-700 mt-1 block">Giao hàng hỏa tốc</span>
            <span className="text-[11px] text-slate-400">Nội thành HCM & Hà Nội</span>
          </div>

          <div className="text-center p-3">
            <span className="text-2xl sm:text-4xl font-black text-amber-500 block">4.9 / 5</span>
            <span className="text-xs font-bold text-slate-700 mt-1 block">Điểm hài lòng dịch vụ</span>
            <span className="text-[11px] text-slate-400">Từ hơn 12.000 đánh giá</span>
          </div>
        </div>
      </section>

      {/* 3. Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Giá trị cốt lõi</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Cam Kết Vàng Định Vị NOVA
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Mọi quyết định và hành động tại NOVA đều bắt nguồn từ 4 trụ cột văn hóa vững chắc
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Cam Kết Chính Hãng</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tất cả thiết bị đều được nhập khẩu chính ngạch từ các thương hiệu hàng đầu, đền bù 200% nếu phát hiện hàng giả mạo.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Tốc Độ Vượt Trội</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hệ thống vận hành tối ưu hóa bằng công nghệ hiện đại, đảm bảo sản phẩm đến tay khách hàng nhanh chóng và nguyên vẹn.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Hậu Mãi Tận Tâm</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Chính sách đổi trả 30 ngày linh hoạt và bảo hành điện tử chính hãng minh bạch, không phát sinh chi phí ẩn.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Đồng Hành 24/7</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Đội ngũ chuyên viên công nghệ am hiểu sâu sắc, sẵn sàng giải đáp thắc mắc và hỗ trợ cài đặt thiết bị miễn phí trọn đời.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Journey & Milestones */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Hành trình phát triển</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Chặng Đường Chinh Phục Niềm Tin
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden"
            >
              <span className="text-3xl font-black text-indigo-600 block">
                {m.year}
              </span>
              <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Leadership Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Đội ngũ lãnh đạo</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Những Người Dẫn Lối Tương Lai NOVA
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Được dẫn dắt bởi những chuyên gia giàu tâm huyết với khát khao nâng tầm ngành bán lẻ công nghệ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadershipTeam.map((lead, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div className="aspect-square w-full overflow-hidden bg-slate-100">
                <img
                  src={lead.image}
                  alt={lead.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 space-y-2">
                <h3 className="text-base font-bold text-slate-900">{lead.name}</h3>
                <span className="text-xs font-bold text-indigo-600 block">{lead.role}</span>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">{lead.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CTA Explore */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight max-w-xl mx-auto">
            Sẵn Sàng Trải Nghiệm Công Nghệ Đỉnh Cao Cùng NOVA?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Khám phá hàng ngàn siêu phẩm công nghệ chính hãng với chính sách trả góp 0%, đổi trả 30 ngày và giao hàng siêu tốc 2 giờ.
          </p>
          <div>
            <Link
              to="/san-pham"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 rounded-full text-xs font-bold hover:bg-slate-100 transition-all shadow-md hover:scale-105"
            >
              <span>Khám phá sản phẩm ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
