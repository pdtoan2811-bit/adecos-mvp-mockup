import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Sparkles, Search, BarChart3, FlaskConical,
    ArrowRight, Play, ChevronRight, Zap,
    Globe, MessageSquare, Rocket, Menu, X,
    TrendingUp, Activity
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import '../styles/LandingPage.css';

/* ───────── Mock ROI data for the "Live Data" chart ───────── */
const roiData = [
    { month: 'Jan', roi: 120, spend: 45 },
    { month: 'Feb', roi: 180, spend: 52 },
    { month: 'Mar', roi: 240, spend: 48 },
    { month: 'Apr', roi: 310, spend: 61 },
    { month: 'May', roi: 380, spend: 55 },
    { month: 'Jun', roi: 450, spend: 67 },
    { month: 'Jul', roi: 520, spend: 72 },
    { month: 'Aug', roi: 610, spend: 68 },
];

/* ───────── Brand names for marquee ───────── */
const brands = [
    'Shopee', 'Lazada', 'TikTok Shop', 'Google Ads',
    'Meta Ads', 'Haravan', 'Sapo', 'KiotViet',
];

/* ───────── Feature card data ───────── */
const features = [
    {
        icon: Sparkles,
        title: 'Điều phối Đa tác vụ',
        desc: 'Định tuyến thông minh giữa các AI agent để phân tích và kể chuyện.',
    },
    {
        icon: Search,
        title: 'Nghiên cứu Tự động',
        desc: 'Thu thập dữ liệu thị trường và phân tích đối thủ trong thời gian thực.',
    },
    {
        icon: BarChart3,
        title: 'Trí tuệ Chiến dịch',
        desc: 'Tối ưu hóa ROAS và đề xuất ngân sách thông minh để đạt hiệu quả tối đa.',
    },
    {
        icon: FlaskConical,
        title: 'Mô phỏng A/B',
        desc: 'Thử nghiệm dựa trên dữ liệu với kết quả có ý nghĩa thống kê.',
    },
];

/* ───────── How It Works steps ───────── */
const steps = [
    {
        num: '01',
        title: 'Kết nối',
        desc: 'Liên kết nguồn dữ liệu và xác định thị trường ngách của bạn.',
        icon: Globe,
    },
    {
        num: '02',
        title: 'Cộng tác',
        desc: 'Làm việc với các AI agent để tinh chỉnh chiến lược.',
        icon: MessageSquare,
    },
    {
        num: '03',
        title: 'Mở rộng',
        desc: 'Triển khai và tự động tối ưu hóa chiến dịch.',
        icon: Rocket,
    },
];

/* ───────── Animation Variants ───────── */
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
};

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
};

/* ======================================================
   LANDING PAGE COMPONENT
   ====================================================== */
export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollYProgress } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    const containerRef = React.useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                setScrolled(containerRef.current.scrollTop > 50);
            }
        };
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    // Smooth scrolling helper
    const scrollTo = (id) => {
        setMobileMenuOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div ref={containerRef} className="landing-page h-screen w-screen overflow-y-auto flex flex-col">
            {/* ─── NAVBAR ─── */}
            <motion.nav
                className={`minimal-nav fixed top-0 left-0 right-0 z-50 ${scrolled ? 'scrolled' : ''}`}
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <button
                        onClick={() => scrollTo('hero')}
                        className="font-serif text-2xl font-bold tracking-tight"
                    >
                        Adecos
                    </button>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-10">
                        <button
                            onClick={() => scrollTo('features')}
                            className="text-sm font-medium hover:text-black transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Tính năng
                        </button>
                        <button
                            onClick={() => scrollTo('how-it-works')}
                            className="text-sm font-medium hover:text-black transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Cách hoạt động
                        </button>

                        <Link to="/chat" className="btn-primary text-sm">
                            Mở App
                        </Link>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile dropdown */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4 bg-white border-b border-gray-100"
                    >
                        <button
                            onClick={() => scrollTo('features')}
                            className="text-sm font-medium text-left"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Tính năng
                        </button>
                        <button
                            onClick={() => scrollTo('how-it-works')}
                            className="text-sm font-medium text-left"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Cách hoạt động
                        </button>
                        <Link to="/chat" className="btn-primary text-sm justify-center w-full">
                            Mở App
                        </Link>
                    </motion.div>
                )}
            </motion.nav>

            {/* ─── HERO ─── */}
            <section id="hero" className="pt-32 pb-24 px-6 md:pt-48 md:pb-32 section-fade">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left — copy */}
                    <motion.div initial="hidden" animate="visible" variants={stagger}>
                        <motion.h1
                            variants={fadeUp}
                            className="font-serif heading-xl font-bold tracking-tight mb-8 text-balance"
                        >
                            Marketing thông minh Tự động hóa.
                        </motion.h1>

                        <motion.p
                            variants={fadeUp}
                            className="text-lg md:text-xl leading-relaxed mb-10 max-w-lg"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Adecos triển khai các agent AI để nghiên cứu thị trường, lập kế hoạch chiến dịch và tối ưu hóa ngân sách của bạn 24/7.
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                            <Link to="/chat" className="btn-primary custom-hover">
                                Bắt đầu ngay
                            </Link>
                            <button className="btn-outline custom-hover" onClick={() => scrollTo('features')}>
                                Tìm hiểu thêm
                            </button>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            className="mt-12 flex items-center gap-8 text-sm"
                            style={{ color: 'var(--text-tertiary)' }}
                        >
                            <span>Thiết lập trong 2 phút</span>
                            <span>Không cần thẻ tín dụng</span>
                        </motion.div>
                    </motion.div>

                    {/* Right — Minimal Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                        className="hidden lg:block relative"
                    >
                        <div className="mockup-container bg-white p-0">
                            <div className="mockup-header">
                                <div className="mockup-dot"></div>
                                <div className="mockup-dot"></div>
                                <div className="mockup-dot"></div>
                            </div>
                            <div className="p-8 space-y-6">
                                {/* Fake Chat UI */}
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <Sparkles size={14} className="text-black" />
                                    </div>
                                    <div className="space-y-2 max-w-sm">
                                        <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none text-sm text-gray-800">
                                            Tôi đã phân tích 15 đối thủ cạnh tranh. Xu hướng Q1 cho thấy nhu cầu đang chuyển dịch sang các sản phẩm bền vững.
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none text-sm text-gray-800">
                                            Tôi đề xuất tăng ngân sách cho chiến dịch "Eco-Friendly" thêm 20%.
                                        </div>
                                    </div>
                                </div>

                                {/* Fake Chart Area inside Mockup */}
                                <div className="pl-12">
                                    <div className="border border-gray-100 rounded-xl p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hiệu suất Chiến dịch</span>
                                            <span className="text-xs font-bold text-green-600">+24.5%</span>
                                        </div>
                                        <div className="flex items-end gap-1 h-16">
                                            {[20, 35, 30, 45, 40, 60, 55, 75, 70, 80].map((h, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 bg-gray-900 rounded-sm opacity-80"
                                                    style={{ height: `${h}%`, opacity: 0.1 + (i * 0.08) }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── BRANDS ─── */}
            <section className="py-12 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
                    <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>
                        Được tin dùng bởi
                    </p>
                </div>
                <div className="overflow-hidden">
                    <div className="marquee-track">
                        {[...brands, ...brands, ...brands].map((b, i) => (
                            <div
                                key={i}
                                className="brand-item px-12 text-2xl"
                            >
                                {b}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ─── */}
            <section id="features" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6"
                        >
                            Toàn diện.<br />Tự động.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-xl max-w-2xl"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Một nền tảng duy nhất để quản lý mọi khía cạnh của tiếp thị kỹ thuật số.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="clean-card p-8"
                            >
                                <div className="icon-box mb-6">
                                    <f.icon size={24} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    {f.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── DATA SECTION ─── */}
            <section id="live-data" className="py-32 px-6 bg-gray-50 border-t border-gray-100">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-black text-white mb-6"
                        >
                            Live Data
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-6"
                        >
                            Tối đa hóa ROI
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-xl mb-8"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Theo dõi hiệu suất chiến dịch trong thời gian thực. Hệ thống tự động điều chỉnh giá thầu để đảm bảo từng đồng ngân sách đều mang lại giá trị.
                        </motion.p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-black">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold font-serif">+340%</div>
                                    <div className="text-sm text-gray-500">Tăng trưởng ROI trung bình</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-black">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold font-serif">-50%</div>
                                    <div className="text-sm text-gray-500">Chi phí vận hành</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm"
                    >
                        <h3 className="text-lg font-bold mb-6">Hiệu suất tháng này</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={roiData}>
                                <defs>
                                    <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="roi" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#colorRoi)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─── */}
            <section id="how-it-works" className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mb-4">Quy trình làm việc</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {steps.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="text-center relative"
                            >
                                <div className="text-6xl font-serif font-bold text-gray-100 mb-6 select-none leading-none">
                                    {s.num}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                                <p className="text-gray-500">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-32 px-6 bg-black text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8">
                        Sẵn sàng nâng tầm doanh nghiệp?
                    </h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Tham gia danh sách chờ và trải nghiệm sức mạnh của Marketing AI.
                    </p>
                    <Link to="/chat" className="inline-block bg-white text-black font-semibold py-4 px-10 rounded-full hover:bg-gray-200 transition-colors">
                        Bắt đầu miễn phí
                    </Link>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="py-12 px-6 border-t border-gray-100 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="font-serif text-xl font-bold">Adecos</div>
                    <div className="flex gap-8 text-sm text-gray-500">
                        <button onClick={() => scrollTo('features')} className="hover:text-black">Tính năng</button>
                        <button onClick={() => scrollTo('how-it-works')} className="hover:text-black">Quy trình</button>
                        <Link to="/chat" className="hover:text-black">Đăng nhập</Link>
                    </div>
                    <div className="text-xs text-gray-400">© 2026 Adecos.</div>
                </div>
            </footer>
        </div>
    );
}
