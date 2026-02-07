import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import BackButton from '../components/BackButton';
import StatusBadge from '../components/StatusBadge';
import DateRangePickerPopover from '../components/DateRangePickerPopover';

/**
 * Mock traffic metrics (image 2). Replace with API when backend is ready.
 */
const MOCK_TRAFFIC_METRICS = {
    totalAccess: 91171,
    totalAccessChange: -23.3,
    uniqueMonthly: 50821,
    uniqueMonthlyChange: -15.78,
    duplicateAccess: 5354,
    duplicateAccessChange: -21.2,
    pagesPerVisit: 5.7,
    pagesPerVisitChange: -45.97,
    avgSessionDuration: 122,
    avgSessionDurationChange: -29.48,
    bounceRate: 30.87,
    bounceRateChange: 4.75,
};

const MOCK_TRAFFIC_FLOW = [
    { month: 'Tháng 10', value: 95000 },
    { month: 'Tháng 11', value: 88000 },
    { month: 'Tháng 12', value: 78000 },
];

const MOCK_SOCIAL_TRAFFIC = [
    { name: 'Facebook', value: 500 },
    { name: 'Pinterest', value: 120 },
    { name: 'Youtube', value: 20 },
    { name: 'Social', value: 15 },
];

const MOCK_TRAFFIC_BY_COUNTRY = [
    { country: 'United States', flag: '🇺🇸', total: 69891, share: 76.66, avgDuration: '03:48', pagesPerVisit: 6.83, bounceRate: 24.96 },
    { country: 'India', flag: '🇮🇳', total: 4286, share: 4.7, avgDuration: '01:23', pagesPerVisit: 2.08, bounceRate: 52.14 },
    { country: 'Australia', flag: '🇦🇺', total: 3300, share: 3.62, avgDuration: '00:34', pagesPerVisit: 2.51, bounceRate: 40.72 },
    { country: 'United Kingdom', flag: '🇬🇧', total: 2840, share: 3.12, avgDuration: '00:42', pagesPerVisit: 1.88, bounceRate: 51.24 },
    { country: 'Canada', flag: '🇨🇦', total: 2164, share: 2.37, avgDuration: '00:13', pagesPerVisit: 1.47, bounceRate: 36.18 },
];

/**
 * Build display data from saved project + mock fields (sector, owner, hunter, dates, etc.).
 */
const toProjectInfo = (project) => {
    if (!project) return null;
    return {
        projectName: project.brand || '—',
        projectLink: project.program_url || '',
        projectStatus: project.status || 'Đang tìm hiểu',
        dataStatus: project.data_status || 'Chưa Xác Minh',
        creationDate: project.savedAt ? new Date(project.savedAt).toLocaleDateString('vi-VN') : '02/02/2026',
        updateDate: project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('vi-VN') : '06/02/2026',
        country: project.country || 'United States',
        sector: project.sector || 'Ecommerce',
        niche: project.niche || 'beauty and skincare',
        subNiche: project.sub_niche || 'perfume',
        projectOwner: project.projectOwner || 'dat',
        projectHunter: project.projectHunter || 'steve_huynh',
        projectScore: project.projectScore ?? 0,
        scansCount: project.scansCount ?? 0,
        introduction: project.description || 'Dự án tập trung vào việc đơn giản hóa quy trình trang điểm cho những người có lối sống năng động và thường xuyên di chuyển. Thay vì phải mang theo những túi đồ trang điểm cồng kềnh, Subtl Beauty cho phép khách hàng tự tùy chỉnh một \'chồng\' (stak) các sản phẩm cần thiết như kem che khuyết điểm, phấn má, và phấn tạo khối trong các ngăn nhỏ gọn. Các sản phẩm của hãng được cam kết sử dụng thành phần sạch, không thử nghiệm trên động vật và phù hợp với nhiều tông da khác nhau.',
        commission: {
            bonus: project.has_bonus ?? true,
            percent: project.commission_percent != null ? `${project.commission_percent}%` : '10%',
            note: project.commission_note || 'Hoa hồng tăng theo cấp bậc (Tier 1: 10-20%, Tier 2: 25%, Tier 3: 30%) dựa trên doanh thu.',
        },
        reward: {
            receiptDeadline: project.payment_duration || '1 lần',
            paymentTime: project.payment_time || 'Hàng ngày',
            note: project.payment_note || 'Có bảng điều khiển thời gian thực để theo dõi thanh toán.',
        },
        prohibited: {
            runAds: project.allow_ads ? 'Được chạy' : 'Không được chạy',
            runBrandName: project.allow_brand_name ? 'Được chạy' : 'Không được chạy',
            note: project.forbidden_note || 'Công ty đặt tại Pittsburgh, Hoa Kỳ.',
        },
    };
};

const ProjectDetailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const project = location.state?.project ?? null;
    const indexInSaved = location.state?.indexInSaved ?? -1;

    const [activeTab, setActiveTab] = useState('info'); // 'info' | 'traffic'
    const [trafficDateRange, setTrafficDateRange] = useState(() => ({
        startDate: new Date(2025, 9, 1),
        endDate: new Date(2026, 0, 31),
    }));
    const [countrySearch, setCountrySearch] = useState('');

    const info = useMemo(() => toProjectInfo(project), [project]);
    const filteredCountries = useMemo(() => {
        if (!countrySearch.trim()) return MOCK_TRAFFIC_BY_COUNTRY;
        const q = countrySearch.toLowerCase();
        return MOCK_TRAFFIC_BY_COUNTRY.filter((r) => r.country.toLowerCase().includes(q));
    }, [countrySearch]);

    if (!project || !info) {
        return (
            <div className="flex-1 p-8 bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
                <BackButton label="Quay lại" onClick={() => navigate('/projects')} />
                <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">Không tìm thấy dữ liệu dự án.</p>
            </div>
        );
    }

    const openEdit = () => {
        navigate('/projects', { state: { openEditProject: project, indexInSaved } });
    };

    return (
        <div className="flex-1 p-8 overflow-auto bg-[var(--bg-primary)] transition-colors duration-300">
            <div className="max-w-[1400px] mx-auto space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="mb-3">
                            <BackButton label="Quay lại" onClick={() => navigate('/projects')} />
                        </div>
                        <h1 className="text-2xl font-serif font-semibold tracking-tight text-[var(--text-primary)] leading-tight">
                            Chi tiết dự án {info.projectName}
                        </h1>
                    </div>
                </div>

                {/* Tabs – same UX as /ads and CampaignDetailPage */}
                <div className="flex gap-8 border-b border-[var(--border-color)]">
                    {[
                        { key: 'info', label: 'Thông tin dự án' },
                        { key: 'traffic', label: 'Chỉ số traffic' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`
                                pb-3 text-sm font-medium uppercase tracking-widest transition-colors relative
                                ${activeTab === tab.key ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}
                            `}
                        >
                            {tab.label}
                            {activeTab === tab.key && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text-primary)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab 1: Thông tin dự án */}
                {activeTab === 'info' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                            <div className="border border-[var(--border-color)] p-5 rounded-sm bg-[var(--bg-surface)]">
                                <h3 className="text-sm font-serif font-semibold text-[var(--text-primary)] mb-4 uppercase tracking-[0.2em]">
                                    Thông tin chung
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Dự án</span>
                                        <p className="mt-1 text-sm font-medium text-[var(--text-primary)] leading-snug">{info.projectName}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Link</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-snug">
                                            {info.projectLink ? (
                                                <a
                                                    href={info.projectLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Link dự án ↗
                                                </a>
                                            ) : (
                                                <span>—</span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Status dự án</span>
                                        <p className="mt-1">
                                            <StatusBadge status={info.projectStatus} variant="project" />
                                        </p>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Status dữ liệu</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-snug">{info.dataStatus}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Ngày tạo</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-snug">{info.creationDate}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Ngày cập nhật</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-snug">{info.updateDate}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Quốc gia</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-snug">{info.country}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Mảng</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-snug">{info.sector}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Ngách</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-snug">{info.niche}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Ngách con</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-snug">{info.subNiche}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Chủ dự án</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-snug">{info.projectOwner}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Project Hunter</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-snug">{info.projectHunter}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Điểm dự án</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-snug">{info.projectScore}</p>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Số lần được quét</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-snug">{info.scansCount}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-[var(--border-color)] p-5 rounded-sm bg-[var(--bg-surface)]">
                                <h3 className="text-sm font-serif font-semibold text-[var(--text-primary)] mb-4 uppercase tracking-[0.2em]">
                                    Giới thiệu về dự án
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                                    {info.introduction}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                            <div className="border border-[var(--border-color)] p-5 rounded-sm bg-[var(--bg-surface)]">
                                <h3 className="text-sm font-serif font-semibold text-[var(--text-primary)] mb-3 uppercase tracking-[0.2em]">
                                    Chính sách hoa hồng
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-baseline gap-2">
                                        <span className="text-xs font-medium tracking-wide text-[var(--text-secondary)] shrink-0">Bonus</span>
                                        <span className="text-sm text-[var(--text-primary)] text-right">{info.commission.bonus ? 'Có Bonus' : 'Không'}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline gap-2">
                                        <span className="text-xs font-medium tracking-wide text-[var(--text-secondary)] shrink-0">Phần trăm hoa hồng</span>
                                        <span className="text-sm text-[var(--text-primary)] text-right">{info.commission.percent}</span>
                                    </div>
                                    <div className="pt-2 border-t border-[var(--border-color)]">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Ghi chú</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-relaxed">{info.commission.note}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border border-[var(--border-color)] p-5 rounded-sm bg-[var(--bg-surface)]">
                                <h3 className="text-sm font-serif font-semibold text-[var(--text-primary)] mb-3 uppercase tracking-[0.2em]">
                                    Chính sách trả thưởng
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-baseline gap-2">
                                        <span className="text-xs font-medium tracking-wide text-[var(--text-secondary)] shrink-0">Thời hạn nhận hoa hồng</span>
                                        <span className="text-sm text-[var(--text-primary)] text-right">{info.reward.receiptDeadline}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline gap-2">
                                        <span className="text-xs font-medium tracking-wide text-[var(--text-secondary)] shrink-0">Thời gian trả hoa hồng</span>
                                        <span className="text-sm text-[var(--text-primary)] text-right">{info.reward.paymentTime}</span>
                                    </div>
                                    <div className="pt-2 border-t border-[var(--border-color)]">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Ghi chú</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-relaxed">{info.reward.note}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border border-[var(--border-color)] p-5 rounded-sm bg-[var(--bg-surface)]">
                                <h3 className="text-sm font-serif font-semibold text-[var(--text-primary)] mb-3 uppercase tracking-[0.2em]">
                                    Chính sách cấm
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-baseline gap-2">
                                        <span className="text-xs font-medium tracking-wide text-[var(--text-secondary)] shrink-0">Chạy ADS</span>
                                        <span className="text-sm text-[var(--text-primary)] text-right">{info.prohibited.runAds}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline gap-2">
                                        <span className="text-xs font-medium tracking-wide text-[var(--text-secondary)] shrink-0">Chạy Brand name</span>
                                        <span className="text-sm text-[var(--text-primary)] text-right">{info.prohibited.runBrandName}</span>
                                    </div>
                                    <div className="pt-2 border-t border-[var(--border-color)]">
                                        <span className="block text-xs font-medium tracking-wide text-[var(--text-secondary)]">Ghi chú</span>
                                        <p className="mt-1 text-sm text-[var(--text-primary)] leading-relaxed">{info.prohibited.note}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-3 mt-8">
                            <button
                                type="button"
                                onClick={openEdit}
                                className="px-4 py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-sm text-sm font-medium tracking-wide hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                            >
                                ✎ Chỉnh sửa thông tin
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2.5 bg-red-500/20 text-red-400 border border-red-500/40 rounded-sm text-sm font-medium tracking-wide hover:bg-red-500/30 transition-colors flex items-center gap-2"
                            >
                                ✕ Không duyệt dự án
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-sm text-sm font-medium tracking-wide hover:bg-emerald-500/30 transition-colors flex items-center gap-2"
                            >
                                ✓ Duyệt dự án
                            </button>
                        </div>
                    </>
                )}

                {/* Tab 2: Chỉ số traffic */}
                {activeTab === 'traffic' && (
                    <>
                        <div className="mt-6 flex justify-end">
                            <DateRangePickerPopover value={trafficDateRange} onChange={setTrafficDateRange} />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                            {[
                                { label: 'Tổng truy cập', value: MOCK_TRAFFIC_METRICS.totalAccess.toLocaleString(), change: MOCK_TRAFFIC_METRICS.totalAccessChange },
                                { label: 'Truy cập duy nhất hàng tháng', value: MOCK_TRAFFIC_METRICS.uniqueMonthly.toLocaleString(), change: MOCK_TRAFFIC_METRICS.uniqueMonthlyChange },
                                { label: 'Truy cập trùng lặp', value: MOCK_TRAFFIC_METRICS.duplicateAccess.toLocaleString(), change: MOCK_TRAFFIC_METRICS.duplicateAccessChange },
                                { label: 'Số trang truy cập', value: MOCK_TRAFFIC_METRICS.pagesPerVisit, change: MOCK_TRAFFIC_METRICS.pagesPerVisitChange },
                                { label: 'Thời lượng truy cập TB', value: MOCK_TRAFFIC_METRICS.avgSessionDuration, change: MOCK_TRAFFIC_METRICS.avgSessionDurationChange },
                                { label: 'Tỷ lệ thoát', value: `${MOCK_TRAFFIC_METRICS.bounceRate}%`, change: MOCK_TRAFFIC_METRICS.bounceRateChange },
                            ].map((m) => (
                                <div key={m.label} className="border border-[var(--border-color)] p-4 rounded-sm bg-[var(--bg-surface)]">
                                    <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 leading-tight">{m.label}</div>
                                    <div className="text-lg font-mono font-medium text-[var(--text-primary)] leading-snug">{m.value}</div>
                                    <div className={`mt-1 text-sm font-medium ${m.change >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {m.change >= 0 ? '+' : ''}{m.change}%
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                            <div className="border border-[var(--border-color)] p-5 rounded-sm bg-[var(--bg-surface)]">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-serif font-semibold text-[var(--text-primary)] uppercase tracking-[0.2em]">
                                        Diễn biến lưu lượng
                                    </h3>
                                    <span className="text-xs font-medium text-[var(--text-secondary)]">3 tháng</span>
                                </div>
                                <ResponsiveContainer width="100%" height={220}>
                                    <LineChart data={MOCK_TRAFFIC_FLOW}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                        <XAxis dataKey="month" stroke="var(--border-color)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                                        <YAxis stroke="var(--border-color)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                                        <Tooltip
                                            contentStyle={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-color)', borderRadius: 4, fontSize: 12 }}
                                            labelStyle={{ color: 'var(--text-primary)' }}
                                        />
                                        <Line type="monotone" dataKey="value" stroke="var(--text-primary)" strokeWidth={2} dot={{ fill: 'var(--text-primary)' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="border border-[var(--border-color)] p-5 rounded-sm bg-[var(--bg-surface)]">
                                <h3 className="text-sm font-serif font-semibold text-[var(--text-primary)] mb-4 uppercase tracking-[0.2em]">
                                    Social traffic
                                </h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={MOCK_SOCIAL_TRAFFIC} layout="vertical" margin={{ left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                        <XAxis type="number" stroke="var(--border-color)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                                        <YAxis type="category" dataKey="name" stroke="var(--border-color)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} width={72} />
                                        <Tooltip
                                            contentStyle={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-color)', borderRadius: 4, fontSize: 12 }}
                                        />
                                        <Bar dataKey="value" fill="var(--text-primary)" radius={[0, 2, 2, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="border border-[var(--border-color)] rounded-sm bg-[var(--bg-surface)] mt-6">
                            <div className="px-4 py-3 border-b border-[var(--border-color)] flex justify-between items-center flex-wrap gap-2">
                                <h3 className="text-sm font-serif font-semibold text-[var(--text-primary)] uppercase tracking-[0.2em]">
                                    Traffic theo quốc gia
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Nhập tên quốc gia"
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                    className="px-3 py-2 border border-[var(--border-color)] rounded-sm text-sm bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] w-48 focus:outline-none focus:border-[var(--border-hover)]"
                                />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[var(--bg-primary)]">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Quốc gia</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Tổng truy cập</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Phân bổ lưu lượng</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Thời lượng TB</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Số trang truy cập</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Tỷ lệ thoát</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border-color)]">
                                        {filteredCountries.map((row) => (
                                            <tr key={row.country} className="hover:bg-[var(--bg-hover)] transition-colors">
                                                <td className="px-4 py-3 text-sm font-medium text-[var(--text-primary)]">
                                                    <span className="mr-2">{row.flag}</span>
                                                    {row.country}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-mono text-[var(--text-primary)]">{row.total.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right text-sm text-[var(--text-primary)]">{row.share}%</td>
                                                <td className="px-4 py-3 text-right text-sm text-[var(--text-primary)]">{row.avgDuration}</td>
                                                <td className="px-4 py-3 text-right text-sm text-[var(--text-primary)]">{row.pagesPerVisit}</td>
                                                <td className="px-4 py-3 text-right text-sm text-[var(--text-primary)]">{row.bounceRate}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-4 py-2.5 border-t border-[var(--border-color)] text-sm text-[var(--text-secondary)]">
                                Hiển thị từ 1 tới {filteredCountries.length} trong {filteredCountries.length} bản ghi
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectDetailPage;
