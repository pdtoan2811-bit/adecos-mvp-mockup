import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockCampaigns, getPrograms, getKeywords, aggregateData } from '../data/mockAdsData';

const DashboardPage = () => {
    const [groupBy, setGroupBy] = useState('day');
    const [startDate, setStartDate] = useState(new Date('2026-10-01'));
    const [endDate, setEndDate] = useState(new Date('2026-12-31'));
    const [selectedPrograms, setSelectedPrograms] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);

    const programs = getPrograms();
    const keywords = getKeywords();

    // Filter campaigns based on selections
    const filteredCampaigns = useMemo(() => {
        let campaigns = mockCampaigns;

        if (selectedPrograms.length > 0) {
            campaigns = campaigns.filter(c => selectedPrograms.includes(c.program));
        }

        if (selectedKeywords.length > 0) {
            campaigns = campaigns.filter(c =>
                c.keywords.some(kw => selectedKeywords.includes(kw))
            );
        }

        return campaigns;
    }, [selectedPrograms, selectedKeywords]);

    // Format dates for API
    const formatDate = (date) => {
        if (!date) return null;
        return date.toISOString().split('T')[0];
    };

    // Aggregate data
    const chartData = useMemo(() => {
        return aggregateData(filteredCampaigns, groupBy, formatDate(startDate), formatDate(endDate));
    }, [filteredCampaigns, groupBy, startDate, endDate]);

    // Calculate totals
    const totals = useMemo(() => {
        return chartData.reduce((acc, day) => ({
            clicks: acc.clicks + day.clicks,
            cost: acc.cost + day.cost,
            conversions: acc.conversions + day.conversions,
            revenue: acc.revenue + day.revenue,
        }), { clicks: 0, cost: 0, conversions: 0, revenue: 0 });
    }, [chartData]);

    const avgCPC = totals.clicks > 0 ? totals.cost / totals.clicks : 0;
    const roi = totals.cost > 0 ? ((totals.revenue - totals.cost) / totals.cost) * 100 : 0;

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-black/90 border border-white/20 backdrop-blur-md p-4 rounded-sm">
                    <p className="text-white text-sm font-mono mb-2">{data.date}</p>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between gap-4">
                            <span className="text-luxury-gray">Clicks:</span>
                            <span className="text-white font-mono">{data.clicks?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-luxury-gray">Chi phí:</span>
                            <span className="text-white font-mono">{data.cost?.toLocaleString()} ₫</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-luxury-gray">Chuyển đổi:</span>
                            <span className="text-white font-mono">{data.conversions}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-luxury-gray">Doanh thu:</span>
                            <span className="text-green-400 font-mono">{data.revenue?.toLocaleString()} ₫</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const toggleProgram = (program) => {
        setSelectedPrograms(prev =>
            prev.includes(program) ? prev.filter(p => p !== program) : [...prev, program]
        );
    };

    const toggleKeyword = (keyword) => {
        setSelectedKeywords(prev =>
            prev.includes(keyword) ? prev.filter(k => k !== keyword) : [...prev, keyword]
        );
    };

    return (
        <div className="flex-1 p-8 overflow-auto bg-black">
            <div className="max-w-[1800px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-serif text-white mb-2">Google Ads Dashboard</h1>
                    <p className="text-luxury-gray text-sm">Phân tích hiệu suất chiến dịch</p>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {/* Date Range with Calendar */}
                    <div className="border border-white/10 p-4 rounded-sm">
                        <label className="text-xs text-luxury-gray uppercase tracking-wider mb-3 block">
                            Thời gian
                        </label>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-luxury-gray mb-1 block">Từ ngày</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    dateFormat="dd/MM/yyyy"
                                    className="w-full bg-transparent border border-white/20 text-white text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-white/40"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-luxury-gray mb-1 block">Đến ngày</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    dateFormat="dd/MM/yyyy"
                                    className="w-full bg-transparent border border-white/20 text-white text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-white/40"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Group By */}
                    <div className="border border-white/10 p-4 rounded-sm">
                        <label className="text-xs text-luxury-gray uppercase tracking-wider mb-3 block">
                            Nhóm theo
                        </label>
                        <div className="flex gap-2">
                            {['day', 'week', 'month'].map(group => (
                                <button
                                    key={group}
                                    onClick={() => setGroupBy(group)}
                                    className={`flex-1 py-2 text-xs uppercase tracking-wider transition-all rounded-sm ${groupBy === group
                                            ? 'bg-white text-black'
                                            : 'border border-white/20 text-luxury-gray hover:text-white hover:border-white/40'
                                        }`}
                                >
                                    {group === 'day' ? 'Ngày' : group === 'week' ? 'Tuần' : 'Tháng'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Program Filter */}
                    <div className="border border-white/10 p-4 rounded-sm">
                        <label className="text-xs text-luxury-gray uppercase tracking-wider mb-3 block">
                            Chương trình
                        </label>
                        <div className="space-y-2">
                            {programs.map(program => (
                                <label key={program} className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-luxury-white transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedPrograms.includes(program)}
                                        onChange={() => toggleProgram(program)}
                                        className="w-4 h-4 rounded border-white/20 bg-transparent"
                                    />
                                    <span className="text-xs">{program}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Keyword Filter */}
                    <div className="border border-white/10 p-4 rounded-sm max-h-[220px] overflow-y-auto">
                        <label className="text-xs text-luxury-gray uppercase tracking-wider mb-3 block sticky top-0 bg-black">
                            Từ khóa
                        </label>
                        <div className="space-y-2">
                            {keywords.map(keyword => (
                                <label key={keyword} className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-luxury-white transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedKeywords.includes(keyword)}
                                        onChange={() => toggleKeyword(keyword)}
                                        className="w-4 h-4 rounded border-white/20 bg-transparent flex-shrink-0"
                                    />
                                    <span className="text-xs">{keyword}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="border border-white/10 p-6 rounded-sm hover:border-white/20 transition-colors">
                        <div className="text-xs text-luxury-gray uppercase tracking-wider mb-2">Tổng clicks</div>
                        <div className="text-3xl font-serif text-white">{totals.clicks.toLocaleString()}</div>
                    </div>
                    <div className="border border-white/10 p-6 rounded-sm hover:border-white/20 transition-colors">
                        <div className="text-xs text-luxury-gray uppercase tracking-wider mb-2">Chi phí</div>
                        <div className="text-3xl font-serif text-white">{totals.cost.toLocaleString()} ₫</div>
                        <div className="text-xs text-luxury-gray mt-1">CPC: {Math.round(avgCPC).toLocaleString()} ₫</div>
                    </div>
                    <div className="border border-white/10 p-6 rounded-sm hover:border-white/20 transition-colors">
                        <div className="text-xs text-luxury-gray uppercase tracking-wider mb-2">Chuyển đổi</div>
                        <div className="text-3xl font-serif text-white">{totals.conversions}</div>
                    </div>
                    <div className="border border-white/10 p-6 rounded-sm hover:border-white/20 transition-colors">
                        <div className="text-xs text-luxury-gray uppercase tracking-wider mb-2">ROI</div>
                        <div className={`text-3xl font-serif ${roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {roi.toFixed(1)}%
                        </div>
                        <div className="text-xs text-luxury-gray mt-1">Doanh thu: {totals.revenue.toLocaleString()} ₫</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="space-y-8">
                    {/* Cost & Revenue Chart */}
                    <div className="border border-white/10 p-6 rounded-sm">
                        <h3 className="text-sm font-serif text-white mb-4 uppercase tracking-wider">Chi phí & Doanh thu</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="rgba(239, 68, 68, 0.3)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="rgba(239, 68, 68, 0.3)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="rgba(74, 222, 128, 0.3)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="rgba(74, 222, 128, 0.3)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="rgba(255,255,255,0.2)"
                                    style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.5)' }}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.2)"
                                    style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.5)' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="cost" stroke="rgb(239, 68, 68)" fillOpacity={1} fill="url(#colorCost)" />
                                <Area type="monotone" dataKey="revenue" stroke="rgb(74, 222, 128)" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Clicks Chart */}
                    <div className="border border-white/10 p-6 rounded-sm">
                        <h3 className="text-sm font-serif text-white mb-4 uppercase tracking-wider">Lượng truy cập</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="rgba(255,255,255,0.2)"
                                    style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.5)' }}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.2)"
                                    style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.5)' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="clicks"
                                    stroke="rgba(255,255,255,0.8)"
                                    strokeWidth={2}
                                    dot={{ fill: 'white', r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Conversions Chart */}
                    <div className="border border-white/10 p-6 rounded-sm">
                        <h3 className="text-sm font-serif text-white mb-4 uppercase tracking-wider">Chuyển đổi</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="rgba(255,255,255,0.2)"
                                    style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.5)' }}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.2)"
                                    style={{ fontSize: '11px', fill: 'rgba(255,255,255,0.5)' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="conversions" fill="rgba(255,255,255,0.8)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* DatePicker Custom Styles */}
            <style>{`
                .react-datepicker {
                    background-color: #000;
                    border: 1px solid rgba(255,255,255,0.1);
                    font-family: var(--font-sans);
                }
                .react-datepicker__header {
                    background-color: rgba(255,255,255,0.05);
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .react-datepicker__current-month,
                .react-datepicker__day-name {
                    color: rgba(255,255,255,0.8);
                }
                .react-datepicker__day {
                    color: rgba(255,255,255,0.6);
                }
                .react-datepicker__day:hover {
                    background-color: rgba(255,255,255,0.1);
                    color: white;
                }
                .react-datepicker__day--selected,
                .react-datepicker__day--in-range {
                    background-color: white;
                    color: black;
                }
                .react-datepicker__day--keyboard-selected {
                    background-color: rgba(255,255,255,0.2);
                }
            `}</style>
        </div>
    );
};

export default DashboardPage;
