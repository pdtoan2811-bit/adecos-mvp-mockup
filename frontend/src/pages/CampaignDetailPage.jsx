import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAds } from '../context/AdsContext';
import BackButton from '../components/BackButton';
import DateRangePickerPopover from '../components/DateRangePickerPopover';

// Detailed, single-campaign view with metrics and simple device / keyword performance tabs.
const CampaignDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { campaigns, accounts } = useAds();

    const campaign = campaigns.find((c) => c.id === id);

    // UI tab state for 4 sections: overview, keyword detail, placements, landing pages.
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'keywords' | 'placements' | 'landing'
    const [keywordSearch, setKeywordSearch] = useState('');
    const [placementSearch, setPlacementSearch] = useState('');
    const [landingSearch, setLandingSearch] = useState('');

    const [dateRange, setDateRange] = useState(() => {
        const allDates = campaign?.dailyData || [];
        const start = allDates[0]?.date ? new Date(allDates[0].date) : new Date();
        const end = allDates[allDates.length - 1]?.date
            ? new Date(allDates[allDates.length - 1].date)
            : new Date();
        return { startDate: start, endDate: end };
    });

    const filteredDailyData = useMemo(() => {
        if (!campaign) return [];
        const { startDate, endDate } = dateRange;
        if (!startDate || !endDate) return campaign.dailyData || [];
        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];
        return (campaign.dailyData || []).filter(
            (d) => d.date >= startStr && d.date <= endStr
        );
    }, [campaign, dateRange]);

    const totals = useMemo(() => {
        if (!campaign) return null;
        return filteredDailyData.reduce(
            (agg, day) => ({
                clicks: agg.clicks + (day.clicks || 0),
                impressions: agg.impressions + (day.impressions || 0),
                cost: agg.cost + (day.cost || 0),
                conversions: agg.conversions + (day.conversions || 0),
                revenue: agg.revenue + (day.revenue || 0),
            }),
            { clicks: 0, impressions: 0, cost: 0, conversions: 0, revenue: 0 }
        );
    }, [filteredDailyData, campaign]);

    if (!campaign || !totals) {
        return (
            <div className="flex-1 p-8 bg-[var(--bg-primary)] text-[var(--text-primary)]">
                <button
                    className="mb-4 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    onClick={() => navigate(-1)}
                >
                    ← Quay lại
                </button>
                <p className="text-sm">Không tìm thấy dữ liệu chiến dịch.</p>
            </div>
        );
    }

    const account = accounts.find((a) => a.id === campaign.accountId);
    const cpc = totals.clicks > 0 ? totals.cost / totals.clicks : 0;
    const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
    const cpm = totals.impressions > 0 ? (totals.cost / totals.impressions) * 1000 : 0;
    const cpa = totals.conversions > 0 ? totals.cost / totals.conversions : 0;

    // Static split for device performance visualisation (can be replaced by real data later).
    const devicePerf = [
        { label: 'Điện thoại di động', impressions: 0.64, clicks: 0.68, cost: 0.6 },
        { label: 'Máy tính bảng', impressions: 0.12, clicks: 0.1, cost: 0.14 },
        { label: 'Máy tính', impressions: 0.24, clicks: 0.22, cost: 0.26 },
    ];

    // Mock datasets for keyword, placement and landing-page tabs.
    const keywordRows = [
        {
            id: 1,
            group: 'Brand keywords',
            term: 'fireflies ai',
            matchType: 'Đối sánh cụm',
            clicks: 320,
            impressions: 5200,
            ctr: 6.15,
            avgCpc: 2500,
            cost: 800000,
            conversions: 18,
            convRate: 5.63,
            costPerConv: 44444
        },
        {
            id: 2,
            group: 'Brand keywords',
            term: 'fireflies meeting notes',
            matchType: 'Đối sánh mở rộng',
            clicks: 210,
            impressions: 4100,
            ctr: 5.12,
            avgCpc: 2300,
            cost: 483000,
            conversions: 11,
            convRate: 5.24,
            costPerConv: 43909
        },
        {
            id: 3,
            group: 'Competitor',
            term: 'otter ai',
            matchType: 'Đối sánh cụm',
            clicks: 95,
            impressions: 3800,
            ctr: 2.5,
            avgCpc: 3200,
            cost: 304000,
            conversions: 6,
            convRate: 6.32,
            costPerConv: 50666
        },
        {
            id: 4,
            group: 'Generic',
            term: 'meeting transcription software',
            matchType: 'Đối sánh rộng',
            clicks: 60,
            impressions: 5600,
            ctr: 1.07,
            avgCpc: 2800,
            cost: 168000,
            conversions: 3,
            convRate: 5.0,
            costPerConv: 56000
        }
    ];

    const placementRows = [
        {
            id: 1,
            country: 'Việt Nam',
            clicks: 380,
            impressions: 7200,
            ctr: 5.28,
            avgCpc: 2200,
            cost: 836000,
            conversions: 16,
            convRate: 4.21,
            costPerConv: 52250
        },
        {
            id: 2,
            country: 'Hoa Kỳ',
            clicks: 140,
            impressions: 3100,
            ctr: 4.52,
            avgCpc: 4500,
            cost: 630000,
            conversions: 9,
            convRate: 6.43,
            costPerConv: 70000
        },
        {
            id: 3,
            country: 'Singapore',
            clicks: 65,
            impressions: 1300,
            ctr: 5.0,
            avgCpc: 5200,
            cost: 338000,
            conversions: 4,
            convRate: 6.15,
            costPerConv: 84500
        }
    ];

    const landingRows = [
        {
            id: 1,
            url: 'https://fireflies.ai/vi/vn/meeting-notes',
            totalClicks: 420,
            totalViews: 7800,
            totalCost: 1120000,
            avgCpc: 2666,
            avgCtr: 5.38
        },
        {
            id: 2,
            url: 'https://fireflies.ai/vi/vn/integration/zoom',
            totalClicks: 180,
            totalViews: 2600,
            totalCost: 520000,
            avgCpc: 2888,
            avgCtr: 6.92
        },
        {
            id: 3,
            url: 'https://fireflies.ai/vi/vn/pricing',
            totalClicks: 95,
            totalViews: 1900,
            totalCost: 410000,
            avgCpc: 4315,
            avgCtr: 5.0
        }
    ];

    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(value));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-[var(--bg-overlay)] border border-[var(--border-color)] backdrop-blur-md p-4 rounded-sm">
                    <p className="text-[var(--text-primary)] text-sm font-mono mb-2">{data.date}</p>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between gap-4">
                            <span className="text-[var(--text-secondary)]">Clicks:</span>
                            <span className="text-[var(--text-primary)] font-mono">{data.clicks?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-[var(--text-secondary)]">Lượt hiển thị:</span>
                            <span className="text-[var(--text-primary)] font-mono">
                                {data.impressions?.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-[var(--text-secondary)]">Chi phí:</span>
                            <span className="text-[var(--text-primary)] font-mono">
                                {data.cost?.toLocaleString()} ₫
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex-1 p-8 overflow-auto bg-[var(--bg-primary)] transition-colors duration-300">
            <div className="max-w-[1400px] mx-auto space-y-6">
                {/* Header + breadcrumb */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className="mb-3">
                            <BackButton
                                label="Quay lại"
                                onClick={() => navigate('/ads', { state: { activeTab: 'campaigns' } })}
                            />
                        </div>
                        <h1 className="text-2xl font-serif tracking-tight text-[var(--text-primary)]">
                            {campaign.name}
                        </h1>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                            ID: {campaign.id} • Tài khoản: {account?.id || 'N/A'}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-[var(--text-secondary)] mb-1">Khoảng thời gian</div>
                        <DateRangePickerPopover
                            value={dateRange}
                            onChange={(range) => setDateRange(range)}
                        />
                    </div>
                </div>
                {/* Tab navigation – reuse /ads main tab UX */}
                <div className="mt-6 flex gap-8 border-b border-[var(--border-color)]">
                    {[
                        { key: 'overview', label: 'Tổng quan chiến dịch' },
                        { key: 'keywords', label: 'Chi tiết từ khóa' },
                        { key: 'placements', label: 'Vị trí phù hợp' },
                        { key: 'landing', label: 'Trang đích' }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`
                                pb-3 text-sm font-medium uppercase tracking-widest transition-colors relative
                                ${
                                    activeTab === tab.key
                                        ? 'text-[var(--text-primary)]'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }
                            `}
                        >
                            {tab.label}
                            {activeTab === tab.key && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text-primary)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab 1: Tổng quan chiến dịch */}
                {activeTab === 'overview' && (
                    <>
                        {/* Top metrics cards */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="border border-[var(--border-color)] p-5 rounded-sm">
                                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.25em] mb-2">
                                    Lượt Click
                                </div>
                                <div className="text-3xl font-serif text-[var(--text-primary)]">
                                    {totals.clicks.toLocaleString()}
                                </div>
                            </div>
                            <div className="border border-[var(--border-color)] p-5 rounded-sm">
                                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.25em] mb-2">
                                    Lượt hiển thị
                                </div>
                                <div className="text-3xl font-serif text-[var(--text-primary)]">
                                    {totals.impressions.toLocaleString()}
                                </div>
                            </div>
                            <div className="border border-[var(--border-color)] p-5 rounded-sm">
                                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.25em] mb-2">
                                    CPC trung bình
                                </div>
                                <div className="text-3xl font-serif text-[var(--text-primary)]">
                                    {formatCurrency(cpc)}
                                </div>
                            </div>
                            <div className="border border-[var(--border-color)] p-5 rounded-sm">
                                <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.25em] mb-2">
                                    Chi phí
                                </div>
                                <div className="text-3xl font-serif text-[var(--text-primary)]">
                                    {formatCurrency(totals.cost)}
                                </div>
                            </div>
                        </div>

                        {/* Middle layout: trend chart + info panel */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                            <div className="lg:col-span-2 border border-[var(--border-color)] p-5 rounded-sm bg-[var(--bg-surface)]">
                                <h3 className="text-sm font-serif text-[var(--text-primary)] mb-4 uppercase tracking-[0.25em]">
                                    Diễn biến click & lượt hiển thị
                                </h3>
                                <ResponsiveContainer width="100%" height={260}>
                                    <AreaChart data={filteredDailyData}>
                                        <defs>
                                            <linearGradient id="detailImpr" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="rgba(96,165,250,0.35)" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="rgba(96,165,250,0.35)" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="detailClick" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="rgba(248,250,252,0.8)" stopOpacity={0.9} />
                                                <stop offset="95%" stopColor="rgba(148,163,184,0.4)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="var(--border-color)"
                                            tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                                            tickLine={{ stroke: 'var(--border-color)' }}
                                        />
                                        <YAxis
                                            stroke="var(--border-color)"
                                            tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                                            tickLine={{ stroke: 'var(--border-color)' }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="impressions"
                                            stroke="rgba(96,165,250,1)"
                                            fill="url(#detailImpr)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="clicks"
                                            stroke="var(--text-primary)"
                                            fill="url(#detailClick)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="border border-[var(--border-color)] p-5 rounded-sm bg-[var(--bg-surface)] flex flex-col">
                                <h3 className="text-sm font-serif text-[var(--text-primary)] mb-4 uppercase tracking-[0.25em]">
                                    Thông tin chiến dịch
                                </h3>
                                <div className="space-y-2 text-xs overflow-y-auto max-h-[260px] pr-1">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Tên chiến dịch</span>
                                        <span className="text-[var(--text-primary)] text-right">{campaign.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Loại tài khoản</span>
                                        <span className="text-[var(--text-primary)] text-right">
                                            {account?.source || '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">ID</span>
                                        <span className="text-[var(--text-primary)] font-mono">{campaign.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Tên ID</span>
                                        <span className="text-[var(--text-primary)] text-right">
                                            {account?.name || '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Người invoice</span>
                                        <span className="text-[var(--text-primary)] text-right">--</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Tài khoản nguồn</span>
                                        <span className="text-[var(--text-primary)] text-right">
                                            {account?.sourceAccount || '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Status tài khoản</span>
                                        <span className="text-[var(--text-primary)]">
                                            {account?.status || '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Status chiến dịch</span>
                                        <span className="text-emerald-400 font-medium">Đang hoạt động</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Loại chiến dịch</span>
                                        <span className="text-[var(--text-primary)]">Tim kiếm</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Trang đích</span>
                                        <span className="text-[var(--text-primary)] text-right">--</span>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <span className="text-[var(--text-secondary)]">Ngân sách</span>
                                        <span className="text-[var(--text-primary)]">
                                            {account?.budgetLoaded ? formatCurrency(account.budgetLoaded) : '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Chi phí</span>
                                        <span className="text-[var(--text-primary)]">
                                            {formatCurrency(totals.cost)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Click</span>
                                        <span className="text-[var(--text-primary)]">
                                            {totals.clicks.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Hiển thị</span>
                                        <span className="text-[var(--text-primary)]">
                                            {totals.impressions.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">CPC</span>
                                        <span className="text-[var(--text-primary)]">{formatCurrency(cpc)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">CPA</span>
                                        <span className="text-[var(--text-primary)]">
                                            {totals.conversions > 0 ? formatCurrency(cpa) : '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">CPM</span>
                                        <span className="text-[var(--text-primary)]">{formatCurrency(cpm)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">CTR</span>
                                        <span className="text-[var(--text-primary)]">
                                            {ctr.toFixed(2)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <span className="text-[var(--text-secondary)]">Ngân sách đã nạp</span>
                                        <span className="text-[var(--text-primary)]">
                                            {account?.budgetLoaded ? formatCurrency(account.budgetLoaded) : '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Ngân sách đã tiêu</span>
                                        <span className="text-[var(--text-primary)]">
                                            {account?.budgetSpent ? formatCurrency(account.budgetSpent) : '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Ngân sách còn lại</span>
                                        <span className="text-[var(--text-primary)]">
                                            {account?.budgetRemaining ? formatCurrency(account.budgetRemaining) : '--'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom: recommendation + device performance */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                            <div className="border border-[var(--border-color)] p-5 rounded-sm bg-[var(--bg-surface)]">
                                <h3 className="text-sm font-serif text-[var(--text-primary)] mb-3 uppercase tracking-[0.25em]">
                                    Đề xuất cải thiện hiệu quả
                                </h3>
                                <p className="text-xs text-[var(--text-secondary)] mb-3">
                                    Hệ thống phân tích xu hướng clicks, CPC và CTR của chiến dịch để gợi ý tối ưu ngân sách và
                                    điều chỉnh từ khóa, thiết bị hoặc khu vực hiển thị.
                                </p>
                                <ul className="text-xs text-[var(--text-secondary)] list-disc list-inside space-y-1">
                                    <li>Tối ưu nhóm từ khóa có CTR thấp nhưng chi phí cao để giảm CPC.</li>
                                    <li>Tăng ngân sách cho khung giờ và thiết bị đang mang lại nhiều lượt chuyển đổi.</li>
                                    <li>Kiểm tra lại creative cho nhóm traffic có tần suất hiển thị cao nhưng ít click.</li>
                                </ul>
                            </div>

                            <div className="border border-[var(--border-color)] p-5 rounded-sm bg-[var(--bg-surface)]">
                                <h3 className="text-sm font-serif text-[var(--text-primary)] mb-3 uppercase tracking-[0.25em]">
                                    Hiệu suất quảng cáo trên thiết bị
                                </h3>
                                <div className="space-y-3 text-xs">
                                    {['cost', 'impressions', 'clicks'].map((metricKey) => (
                                        <div key={metricKey}>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-[var(--text-secondary)]">
                                                    {metricKey === 'cost'
                                                        ? 'Chi phí'
                                                        : metricKey === 'impressions'
                                                        ? 'Lượt hiển thị'
                                                        : 'Lượt click'}
                                                </span>
                                                <span className="text-[var(--text-secondary)]">0% - 100%</span>
                                            </div>
                                            <div className="h-4 bg-[var(--bg-primary)] rounded-full overflow-hidden flex">
                                                {devicePerf.map((d) => (
                                                    <div
                                                        key={d.label + metricKey}
                                                        className={
                                                            metricKey === 'cost'
                                                                ? 'bg-sky-500/70'
                                                                : metricKey === 'impressions'
                                                                ? 'bg-emerald-500/70'
                                                                : 'bg-indigo-400/80'
                                                        }
                                                        style={{
                                                            width: `${
                                                                (metricKey === 'cost'
                                                                    ? d.cost
                                                                    : metricKey === 'impressions'
                                                                    ? d.impressions
                                                                    : d.clicks) * 100
                                                            }%`,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex justify-between mt-1 text-[var(--text-secondary)]">
                                                {devicePerf.map((d) => (
                                                    <span key={d.label} className="truncate mr-2">
                                                        {d.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Tab 2: Chi tiết từ khóa */}
                {activeTab === 'keywords' && (
                    <div className="mt-6 border border-[var(--border-color)] rounded-sm bg-[var(--bg-surface)]">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
                            <div className="font-semibold text-sm">Chi tiết từ khóa</div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-[var(--text-secondary)]">Search cụm từ tìm kiếm</span>
                                <input
                                    type="text"
                                    value={keywordSearch}
                                    onChange={(e) => setKeywordSearch(e.target.value)}
                                    className="px-2 py-1 rounded-sm border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs"
                                    placeholder="Search..."
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                                <thead className="bg-[var(--bg-primary)]">
                                    <tr className="text-[var(--text-secondary)]">
                                        <th className="px-3 py-2 text-left">STT</th>
                                        <th className="px-3 py-2 text-left">Cụm từ tìm kiếm</th>
                                        <th className="px-3 py-2 text-left">Kiểu khớp</th>
                                        <th className="px-3 py-2 text-right">Lượt click</th>
                                        <th className="px-3 py-2 text-right">Lượt hiển thị</th>
                                        <th className="px-3 py-2 text-right">CTR</th>
                                        <th className="px-3 py-2 text-right">CPC Tr.bình</th>
                                        <th className="px-3 py-2 text-right">Chi phí</th>
                                        <th className="px-3 py-2 text-right">Conversions</th>
                                        <th className="px-3 py-2 text-right">Tỷ lệ chuyển đổi</th>
                                        <th className="px-3 py-2 text-right">Chi phí/Chuyển đổi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {keywordRows
                                        .filter((row) => {
                                            const q = keywordSearch.toLowerCase();
                                            if (!q) return true;
                                            return (
                                                row.term.toLowerCase().includes(q) ||
                                                row.group.toLowerCase().includes(q)
                                            );
                                        })
                                        .map((row) => (
                                            <tr key={row.id} className="border-t border-[var(--border-color)]">
                                                <td className="px-3 py-2 align-middle">{row.id}</td>
                                                <td className="px-3 py-2 align-middle">
                                                    <div className="font-medium text-[var(--text-primary)]">
                                                        {row.term}
                                                    </div>
                                                    <div className="text-[var(--text-secondary)] text-[10px]">
                                                        {row.group}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 align-middle">{row.matchType}</td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {row.clicks.toLocaleString()}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {row.impressions.toLocaleString()}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {row.ctr.toFixed(2)}%
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {formatCurrency(row.avgCpc)}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {formatCurrency(row.cost)}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {row.conversions.toLocaleString()}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {row.convRate.toFixed(2)}%
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {formatCurrency(row.costPerConv)}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab 3: Vị trí phù hợp */}
                {activeTab === 'placements' && (
                    <div className="mt-6 border border-[var(--border-color)] rounded-sm bg-[var(--bg-surface)]">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
                            <div className="font-semibold text-sm">Vị trí phù hợp</div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-[var(--text-secondary)]">Tìm kiếm quốc gia</span>
                                <input
                                    type="text"
                                    value={placementSearch}
                                    onChange={(e) => setPlacementSearch(e.target.value)}
                                    className="px-2 py-1 rounded-sm border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs"
                                    placeholder="Search..."
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                                <thead className="bg-[var(--bg-primary)]">
                                    <tr className="text-[var(--text-secondary)]">
                                        <th className="px-3 py-2 text-left">STT</th>
                                        <th className="px-3 py-2 text-left">Quốc gia</th>
                                        <th className="px-3 py-2 text-right">Lượt click</th>
                                        <th className="px-3 py-2 text-right">Lượt hiển thị</th>
                                        <th className="px-3 py-2 text-right">CTR</th>
                                        <th className="px-3 py-2 text-right">CPC Tr.bình</th>
                                        <th className="px-3 py-2 text-right">Chi phí</th>
                                        <th className="px-3 py-2 text-right">Conversions</th>
                                        <th className="px-3 py-2 text-right">Conversion Rate</th>
                                        <th className="px-3 py-2 text-right">Cost/Conversion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {placementRows
                                        .filter((row) => {
                                            const q = placementSearch.toLowerCase();
                                            if (!q) return true;
                                            return row.country.toLowerCase().includes(q);
                                        })
                                        .map((row) => (
                                            <tr key={row.id} className="border-t border-[var(--border-color)]">
                                                <td className="px-3 py-2 align-middle">{row.id}</td>
                                                <td className="px-3 py-2 align-middle">{row.country}</td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {row.clicks.toLocaleString()}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {row.impressions.toLocaleString()}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {row.ctr.toFixed(2)}%
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {formatCurrency(row.avgCpc)}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {formatCurrency(row.cost)}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {row.conversions.toLocaleString()}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {row.convRate.toFixed(2)}%
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {formatCurrency(row.costPerConv)}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab 4: Trang đích */}
                {activeTab === 'landing' && (
                    <div className="mt-6 border border-[var(--border-color)] rounded-sm bg-[var(--bg-surface)]">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
                            <div className="font-semibold text-sm">Trang đích</div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-[var(--text-secondary)]">Search URL đích</span>
                                <input
                                    type="text"
                                    value={landingSearch}
                                    onChange={(e) => setLandingSearch(e.target.value)}
                                    className="px-2 py-1 rounded-sm border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs"
                                    placeholder="Search..."
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                                <thead className="bg-[var(--bg-primary)]">
                                    <tr className="text-[var(--text-secondary)]">
                                        <th className="px-3 py-2 text-left">STT</th>
                                        <th className="px-3 py-2 text-left">URL Đích</th>
                                        <th className="px-3 py-2 text-right">Tổng Click</th>
                                        <th className="px-3 py-2 text-right">Tổng View</th>
                                        <th className="px-3 py-2 text-right">Tổng Chi phí</th>
                                        <th className="px-3 py-2 text-right">CPC Trung bình</th>
                                        <th className="px-3 py-2 text-right">CTR Trung bình</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {landingRows
                                        .filter((row) => {
                                            const q = landingSearch.toLowerCase();
                                            if (!q) return true;
                                            return row.url.toLowerCase().includes(q);
                                        })
                                        .map((row) => (
                                            <tr key={row.id} className="border-t border-[var(--border-color)]">
                                                <td className="px-3 py-2 align-middle">{row.id}</td>
                                                <td className="px-3 py-2 align-middle text-[var(--accent-primary)]">
                                                    {row.url}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {row.totalClicks.toLocaleString()}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {row.totalViews.toLocaleString()}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {formatCurrency(row.totalCost)}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {formatCurrency(row.avgCpc)}
                                                </td>
                                                <td className="px-3 py-2 text-right align-middle">
                                                    {row.avgCtr.toFixed(2)}%
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignDetailPage;

