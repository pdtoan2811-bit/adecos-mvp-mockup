import React, { useState, useMemo, useEffect } from 'react';
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

    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [accounts, setAccounts] = useState([]);

    // Search states for filters
    const [programSearch, setProgramSearch] = useState('');
    const [keywordSearch, setKeywordSearch] = useState('');
    const [accountSearch, setAccountSearch] = useState('');

    const programs = getPrograms();
    const keywords = getKeywords();

    // Load accounts and map mock data to them
    useEffect(() => {
        const savedAccounts = JSON.parse(localStorage.getItem('adsAccounts') || '[]');

        if (savedAccounts.length === 0) {
            // Default demo accounts if none exist
            const defaults = [
                { id: 'acc_001', name: 'Tài khoản Chính (Demo)', platform: 'Google Ads' },
                { id: 'acc_002', name: 'Tài khoản Phụ (Demo)', platform: 'Google Ads' }
            ];
            setAccounts(defaults);
            setSelectedAccounts(defaults.map(a => a.id));
        } else {
            setAccounts(savedAccounts);
            setSelectedAccounts(savedAccounts.map(a => a.id));
        }
    }, []);

    // Filter campaigns based on selections
    const filteredCampaigns = useMemo(() => {
        let campaigns = [...mockCampaigns];

        // DYNAMIC MAPPING: Assign mock campaigns to available accounts for demo purposes
        if (accounts.length > 0) {
            campaigns = campaigns.map((camp, index) => {
                const assignedAccount = accounts[index % accounts.length];
                return { ...camp, accountId: assignedAccount.id };
            });
        }

        if (selectedAccounts.length > 0) {
            campaigns = campaigns.filter(c => selectedAccounts.includes(c.accountId));
        }

        if (selectedPrograms.length > 0) {
            campaigns = campaigns.filter(c => selectedPrograms.includes(c.program));
        }

        if (selectedKeywords.length > 0) {
            campaigns = campaigns.filter(c =>
                c.keywords.some(kw => selectedKeywords.includes(kw))
            );
        }

        return campaigns;
    }, [selectedPrograms, selectedKeywords, selectedAccounts, accounts]);

    // Format dates for API
    const formatDate = (date) => {
        if (!date) return null;
        return date.toISOString().split('T')[0];
    };

    // Aggregate data for CURRENT period
    const chartData = useMemo(() => {
        return aggregateData(filteredCampaigns, groupBy, formatDate(startDate), formatDate(endDate));
    }, [filteredCampaigns, groupBy, startDate, endDate]);

    // Calculate PREVIOUS period
    const prevPeriodData = useMemo(() => {
        if (!startDate || !endDate) return null;

        const duration = endDate.getTime() - startDate.getTime();
        const prevEnd = new Date(startDate.getTime() - 86400000); // 1 day before start
        const prevStart = new Date(prevEnd.getTime() - duration);

        return aggregateData(filteredCampaigns, 'day', formatDate(prevStart), formatDate(prevEnd));
    }, [filteredCampaigns, startDate, endDate]);

    // Calculate totals for current period
    const totals = useMemo(() => {
        return chartData.reduce((acc, day) => ({
            clicks: acc.clicks + day.clicks,
            cost: acc.cost + day.cost,
            conversions: acc.conversions + day.conversions,
            revenue: acc.revenue + day.revenue,
        }), { clicks: 0, cost: 0, conversions: 0, revenue: 0 });
    }, [chartData]);

    // Calculate totals for previous period
    const prevTotals = useMemo(() => {
        if (!prevPeriodData) return null;
        return prevPeriodData.reduce((acc, day) => ({
            clicks: acc.clicks + day.clicks,
            cost: acc.cost + day.cost,
        }), { clicks: 0, cost: 0 });
    }, [prevPeriodData]);

    // Metrics calculation
    const avgCPC = totals.clicks > 0 ? totals.cost / totals.clicks : 0;

    // Comparison calculation for CPC
    let cpComparison = 0;
    let cpcTrend = 'neutral';

    if (prevTotals && prevTotals.clicks > 0) {
        const prevCPC = prevTotals.cost / prevTotals.clicks;
        if (prevCPC > 0) {
            cpComparison = ((avgCPC - prevCPC) / prevCPC) * 100;
            // For CPC, negative is GOOD (green), positive is BAD (red)
            cpcTrend = cpComparison < 0 ? 'good' : 'bad';
        }
    }

    // Quick date handlers
    const setLast30Days = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        setStartDate(start);
        setEndDate(end);
    };

    const setLast90Days = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 90);
        setStartDate(start);
        setEndDate(end);
    };

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

    const toggleAccount = (accountId) => {
        setSelectedAccounts(prev =>
            prev.includes(accountId) ? prev.filter(id => id !== accountId) : [...prev, accountId]
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
                    {/* Date Range with Calendar & Group By */}
                    <div className="border border-white/10 p-4 rounded-sm flex flex-col h-[350px]">
                        <label className="text-xs text-luxury-gray uppercase tracking-wider mb-3 block">
                            Thời gian
                        </label>

                        {/* Quick Filters */}
                        <div className="flex gap-2 mb-3">
                            <button onClick={setLast30Days} className="flex-1 px-2 py-1 text-[10px] border border-white/20 text-white hover:bg-white hover:text-black transition-colors rounded-sm uppercase">Last 30D</button>
                            <button onClick={setLast90Days} className="flex-1 px-2 py-1 text-[10px] border border-white/20 text-white hover:bg-white hover:text-black transition-colors rounded-sm uppercase">Last 90D</button>
                        </div>

                        <div className="space-y-3 mb-4">
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

                        {/* Group By (Merged) */}
                        <div className="mt-auto pt-4 border-t border-white/10">
                            <label className="text-xs text-luxury-gray uppercase tracking-wider mb-2 block">
                                Nhóm theo
                            </label>
                            <div className="flex gap-2">
                                {['day', 'week', 'month'].map(group => (
                                    <button
                                        key={group}
                                        onClick={() => setGroupBy(group)}
                                        className={`flex-1 py-1 text-[10px] uppercase tracking-wider transition-all rounded-sm ${groupBy === group
                                            ? 'bg-white text-black'
                                            : 'border border-white/20 text-luxury-gray hover:text-white hover:border-white/40'
                                            }`}
                                    >
                                        {group === 'day' ? 'Ngày' : group === 'week' ? 'Tuần' : 'Tháng'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Account Filter (NEW) */}
                    <div className="border border-white/10 p-4 rounded-sm flex flex-col h-[350px]">
                        <label className="text-xs text-luxury-gray uppercase tracking-wider mb-3 block flex-shrink-0">
                            Tài khoản
                        </label>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={accountSearch}
                            onChange={(e) => setAccountSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white text-xs px-2 py-1 mb-3 rounded-sm focus:outline-none focus:border-white/30"
                        />
                        <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                            {accounts.length === 0 && <p className="text-xs text-luxury-gray italic">Chưa kết nối tài khoản nào.</p>}
                            {accounts
                                .filter(acc => acc.name.toLowerCase().includes(accountSearch.toLowerCase()))
                                .map(acc => (
                                    <label key={acc.id} className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-luxury-white transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={selectedAccounts.includes(acc.id)}
                                            onChange={() => toggleAccount(acc.id)}
                                            className="w-4 h-4 rounded border-white/20 bg-transparent flex-shrink-0"
                                        />
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-xs truncate font-medium" title={acc.name}>{acc.name}</span>
                                            <span className="text-[10px] text-luxury-gray truncate">{acc.platform}</span>
                                        </div>
                                    </label>
                                ))}
                        </div>
                    </div>

                    {/* Program Filter */}
                    <div className="border border-white/10 p-4 rounded-sm flex flex-col h-[260px]">
                        <label className="text-xs text-luxury-gray uppercase tracking-wider mb-3 block flex-shrink-0">
                            Chương trình
                        </label>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={programSearch}
                            onChange={(e) => setProgramSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white text-xs px-2 py-1 mb-3 rounded-sm focus:outline-none focus:border-white/30"
                        />
                        <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                            {programs
                                .filter(p => p.toLowerCase().includes(programSearch.toLowerCase()))
                                .map(program => (
                                    <label key={program} className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-luxury-white transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={selectedPrograms.includes(program)}
                                            onChange={() => toggleProgram(program)}
                                            className="w-4 h-4 rounded border-white/20 bg-transparent flex-shrink-0"
                                        />
                                        <span className="text-xs truncate" title={program}>{program}</span>
                                    </label>
                                ))}
                        </div>
                    </div>

                    {/* Keyword Filter */}
                    <div className="border border-white/10 p-4 rounded-sm flex flex-col h-[260px]">
                        <label className="text-xs text-luxury-gray uppercase tracking-wider mb-3 block flex-shrink-0">
                            Từ khóa
                        </label>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={keywordSearch}
                            onChange={(e) => setKeywordSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white text-xs px-2 py-1 mb-3 rounded-sm focus:outline-none focus:border-white/30"
                        />
                        <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                            {keywords
                                .filter(k => k.toLowerCase().includes(keywordSearch.toLowerCase()))
                                .map(keyword => (
                                    <label key={keyword} className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-luxury-white transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={selectedKeywords.includes(keyword)}
                                            onChange={() => toggleKeyword(keyword)}
                                            className="w-4 h-4 rounded border-white/20 bg-transparent flex-shrink-0"
                                        />
                                        <span className="text-xs truncate" title={keyword}>{keyword}</span>
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
                    </div>
                    <div className="border border-white/10 p-6 rounded-sm hover:border-white/20 transition-colors">
                        <div className="text-xs text-luxury-gray uppercase tracking-wider mb-2">Chuyển đổi</div>
                        <div className="text-3xl font-serif text-white">{totals.conversions}</div>
                    </div>

                    {/* CPC Card with Comparison */}
                    <div className="border border-white/10 p-6 rounded-sm hover:border-white/20 transition-colors">
                        <div className="text-xs text-luxury-gray uppercase tracking-wider mb-2">CPC Trung bình</div>
                        <div className="text-3xl font-serif text-white">
                            {Math.round(avgCPC).toLocaleString()} ₫
                        </div>

                        {prevTotals ? (
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs font-medium ${cpcTrend === 'good' ? 'text-green-400' : 'text-red-400'}`}>
                                    {cpComparison > 0 ? '▲' : '▼'} {Math.abs(cpComparison).toFixed(1)}%
                                </span>
                                <span className="text-[10px] text-luxury-gray">so với kỳ trước</span>
                            </div>
                        ) : (
                            <div className="text-[10px] text-luxury-gray mt-2">Chưa có dữ liệu kỳ trước</div>
                        )}
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
