import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Sparkles, Search, BarChart3, FlaskConical,
    ArrowRight, Play, ChevronRight, Zap,
    Menu, X
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import '../styles/LandingPage.css';

/* ───────── Mock ROAS data for the "Live Data" chart ───────── */
const roiData = [
    { month: 'Jan', roas: 120, spend: 45 },
    { month: 'Feb', roas: 180, spend: 52 },
    { month: 'Mar', roas: 240, spend: 48 },
    { month: 'Apr', roas: 310, spend: 61 },
    { month: 'May', roas: 380, spend: 55 },
    { month: 'Jun', roas: 450, spend: 67 },
    { month: 'Jul', roas: 520, spend: 72 },
    { month: 'Aug', roas: 610, spend: 68 },
];

/* ───────── Brand names for marquee ───────── */
const brands = [
    'Meta Ads', 'Google Ads', 'Mic Group', 'Accesstrade'
];

/* ───────── Feature card data ───────── */
const features = [
    {
        icon: Sparkles,
        title: 'Giao việc cho AI Agent',
        desc: 'Tìm kiếm các dự án affiliate tiềm năng bằng AI Agent và tiêu chí đánh giá cơ hội và lợi nhuận.',
    },
    {
        icon: Search,
        title: 'Nghiên cứu Tự động',
        desc: 'Thu thập dữ liệu thị trường và phân tích đối thủ trong thời gian thực.',
    },
    {
        icon: BarChart3,
        title: 'Kết nối tài khoản quảng cáo',
        desc: 'Không còn phải khổ sở quản lý nhiều tài khoản quảng cáo, ở các tài khoản và email khác nhau. All-in-one.',
    },
    {
        icon: FlaskConical,
        title: 'A/B Testing (sắp ra mắt)',
        desc: 'AI đề xuất các thử nghiệm có mục tiêu rõ ràng, theo dõi hàng ngày và đề xuất mở rộng.',
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
                        <Link to="/chat" className="btn-primary text-sm justify-center w-full">
                            Bắt đầu ngay
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
                            Tự động hóa MMO affiliate
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
                                            Dưới đây là báo cáo CPC của các chiến dịch cho dự án affiliate của bạn
                                        </div>

                                    </div>
                                </div>

                                {/* Fake Chart Area inside Mockup */}
                                <div className="pl-12">
                                    <div className="border border-gray-100 rounded-xl p-4 hover-card group">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CPC 14 ngày gần nhất</span>
                                            <span className="text-xs font-bold text-green-600">-24.5%</span>
                                        </div>
                                        <div className="flex items-end gap-1 h-16">
                                            {[85, 75, 80, 65, 70, 55, 50, 40, 35, 20].map((h, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 bg-gray-900 rounded-sm opacity-80 transition-colors duration-300 group-hover:bg-blue-600"
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
                        Hân hạnh là đối tác của
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
                            Một nền tảng duy nhất để quản lý các thao tác nghiên cứu dự án affiliate, kết nối tài khoản quảng cáo và A/B testing.
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
                            Tối đa hóa ROAS
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

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Link to="/chat" className="btn-primary custom-hover inline-flex items-center gap-2">
                                Bắt đầu ngay <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover-card chart-card"
                    >
                        <h3 className="text-lg font-bold mb-6">Hiệu suất tháng này</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={roiData}>
                                <defs>
                                    <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorRoiHover" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="roas" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#colorRoi)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="py-32 px-6 bg-black text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8">
                        Trợ lý AI hiểu và thực thi các nhiệm vụ MMO cho bạn
                    </h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Tham gia danh sách chờ và trải nghiệm ADECOS.
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
                        <Link to="/chat" className="hover:text-black">Đăng nhập</Link>
                    </div>
                    <div className="text-xs text-gray-400">© 2026 Adecos.</div>
                </div>
            </footer>
        </div>
    );
}
