import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAds } from '../context/AdsContext';
import AdsAccountTable from '../components/ads/AdsAccountTable';
import AddAccountModal from '../components/ads/AddAccountModal';
import AssetManager from '../components/ads/AssetManager';

const AdsManagementPage = () => {
    const {
        accounts,
        campaigns,
        importAccounts,
        addAccount,
        checkAccountHealth,
        assets,
        addAsset,
        proxies
    } = useAds();

    const navigate = useNavigate();
    const location = useLocation();

    const initialTab = location.state?.activeTab || 'accounts';
    const [activeTab, setActiveTab] = useState(initialTab); // accounts | emails | ids | campaigns
    const [subTab, setSubTab] = useState('all'); // all | google | meta | tiktok
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccountIds, setSelectedAccountIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter accounts by platform and search
    const filteredAccounts = accounts.filter(acc => {
        const matchPlatform = subTab === 'all' || acc.platform === subTab;
        const query = searchQuery.toLowerCase();
        const matchSearch = acc.name.toLowerCase().includes(query) ||
            (acc.id && acc.id.toLowerCase().includes(query)) ||
            (acc.digitalStaff && acc.digitalStaff.toLowerCase().includes(query)) ||
            (acc.notes && acc.notes.toLowerCase().includes(query));
        return matchPlatform && matchSearch;
    });

    // Calculate Overview Metrics for CURRENT PLATFORM (Accounts tab)
    const metrics = filteredAccounts.reduce((acc, curr) => ({
        totalBudget: acc.totalBudget + (curr.budgetLoaded || 0),
        totalSpent: acc.totalSpent + (curr.budgetSpent || 0),
        remaining: acc.remaining + (curr.budgetRemaining || 0)
    }), { totalBudget: 0, totalSpent: 0, remaining: 0 });

    // Email-level view: 1 email -> many IDs (accounts) -> many campaigns.
    const emailSummary = useMemo(() => {
        const map = new Map();

        accounts.forEach(acc => {
            if (!acc.email) return;
            if (!map.has(acc.email)) {
                map.set(acc.email, {
                    email: acc.email,
                    accountIds: new Set(),
                    campaignCount: 0
                });
            }
            const entry = map.get(acc.email);
            entry.accountIds.add(acc.id);
        });

        campaigns.forEach(camp => {
            const owner = accounts.find(a => a.id === camp.accountId);
            if (!owner || !owner.email) return;
            const entry = map.get(owner.email);
            if (entry) {
                entry.campaignCount += 1;
            }
        });

        return Array.from(map.values()).map(entry => ({
            email: entry.email,
            idCount: entry.accountIds.size,
            campaignCount: entry.campaignCount
        }));
    }, [accounts, campaigns]);

    // ID view (each Ads account ID) with campaign counts.
    const idSummary = useMemo(() => {
        return accounts.map(acc => ({
            id: acc.id,
            name: acc.name,
            email: acc.email,
            platform: acc.platform,
            campaignCount: campaigns.filter(camp => camp.accountId === acc.id).length
        }));
    }, [accounts, campaigns]);

    // Campaign-level view: aggregate daily metrics into total Clicks / Impressions / Cost / CPC / CTR.
    const campaignSummary = useMemo(() => {
        return campaigns.map(camp => {
            const totals = (camp.dailyData || []).reduce(
                (agg, day) => ({
                    clicks: agg.clicks + (day.clicks || 0),
                    impressions: agg.impressions + (day.impressions || 0),
                    cost: agg.cost + (day.cost || 0)
                }),
                { clicks: 0, impressions: 0, cost: 0 }
            );

            const cpc = totals.clicks > 0 ? totals.cost / totals.clicks : 0;
            const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;

            const owner = accounts.find(a => a.id === camp.accountId);

            return {
                id: camp.id,
                name: camp.name,
                email: owner?.email || '',
                clicks: totals.clicks,
                impressions: totals.impressions,
                cost: totals.cost,
                cpc,
                ctr
            };
        });
    }, [campaigns, accounts]);

    const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    const handleCheckStatus = () => {
        if (selectedAccountIds.length > 0) {
            checkAccountHealth(selectedAccountIds);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6 transition-colors duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-serif tracking-tight text-[var(--text-primary)]">Quản lý tài khoản</h1>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">Theo dõi, kiểm tra và quản lý tài sản quảng cáo</p>
                </div>

                <div className="flex gap-4">
                    {activeTab === 'accounts' && (
                        <>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-medium rounded hover:opacity-90 transition-opacity"
                            >
                                + Thêm tài khoản
                            </button>
                            <button
                                onClick={handleCheckStatus}
                                disabled={selectedAccountIds.length === 0}
                                className="px-4 py-2 border border-[var(--border-color)] text-sm font-medium rounded hover:bg-[var(--bg-surface)] transition-colors disabled:opacity-50 text-[var(--text-primary)]"
                            >
                                ↻ Kiếm tra Status
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex gap-8 border-b border-[var(--border-color)] mb-6">
                {[
                    { id: 'accounts', label: 'Tài khoản Ads' },
                    { id: 'emails', label: 'Quản lý Email' },
                    { id: 'ids', label: 'Quản lý ID' },
                    { id: 'campaigns', label: 'Quản lý chiến dịch' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            pb-3 text-sm font-medium uppercase tracking-widest transition-colors relative
                            ${activeTab === tab.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}
                        `}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text-primary)]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Overview Cards (Only for Accounts Tab) */}
            {activeTab === 'accounts' && (
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 rounded-lg">
                        <div className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-2">Tổng ngân sách đã nạp</div>
                        <div className="text-2xl font-mono text-[var(--text-primary)]">{formatCurrency(metrics.totalBudget)}</div>
                    </div>
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 rounded-lg">
                        <div className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-2">Tổng chi tiêu</div>
                        <div className="text-2xl font-mono text-[var(--text-secondary)]">{formatCurrency(metrics.totalSpent)}</div>
                    </div>
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 rounded-lg">
                        <div className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-2">Số dư còn lại</div>
                        <div className="text-2xl font-mono text-emerald-400">{formatCurrency(metrics.remaining)}</div>
                    </div>
                </div>
            )}

            {/* Sub Tabs (Platform) for Accounts */}
            {activeTab === 'accounts' && (
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setSubTab('all')}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${subTab === 'all' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]' : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]'}`}
                    >
                        Tất cả
                    </button>
                    <button
                        onClick={() => setSubTab('google')}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${subTab === 'google' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]' : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]'}`}
                    >
                        Google Ads
                    </button>
                    <button
                        onClick={() => setSubTab('meta')}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${subTab === 'meta' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]' : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]'}`}
                    >
                        Meta Ads
                    </button>
                    <button
                        onClick={() => setSubTab('tiktok')}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${subTab === 'tiktok' ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]' : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]'}`}
                    >
                        TikTok Ads
                    </button>
                </div>
            )}

            {/* Content Area */}
            <div className="flex flex-col flex-1">
                {activeTab === 'accounts' && (
                    <div className="flex flex-col">
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Tìm kiếm tài khoản / ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--text-primary)] outline-none"
                            />
                        </div>
                        <div className="">
                            <AdsAccountTable
                                accounts={filteredAccounts}
                                selectedIds={selectedAccountIds}
                                onSelectionChange={setSelectedAccountIds}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'emails' && (
                    <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface)]">
                        <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center">
                            <h3 className="text-lg font-serif text-[var(--text-primary)]">Quản lý Email</h3>
                            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-[0.2em]">
                                {emailSummary.length} email
                            </span>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] border-b border-[var(--border-color)]">
                                <tr>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3 text-right">Số ID</th>
                                    <th className="px-6 py-3 text-right">Số chiến dịch</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {emailSummary.map(row => (
                                    <tr key={row.email} className="hover:bg-[var(--bg-hover)] transition-colors">
                                        <td className="px-6 py-3 font-mono text-[var(--text-primary)]">{row.email}</td>
                                        <td className="px-6 py-3 text-right">{row.idCount}</td>
                                        <td className="px-6 py-3 text-right">{row.campaignCount}</td>
                                    </tr>
                                ))}
                                {emailSummary.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-[var(--text-secondary)] text-sm">
                                            Chưa có email nào được lưu.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'ids' && (
                    <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface)]">
                        <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center">
                            <h3 className="text-lg font-serif text-[var(--text-primary)]">Quản lý ID</h3>
                            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-[0.2em]">
                                {idSummary.length} ID
                            </span>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] border-b border-[var(--border-color)]">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Tên tài khoản</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Nền tảng</th>
                                    <th className="px-6 py-3 text-right">Số chiến dịch</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {idSummary.map(row => (
                                    <tr key={row.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                                        <td className="px-6 py-3 font-mono text-[var(--text-primary)]">{row.id}</td>
                                        <td className="px-6 py-3">{row.name}</td>
                                        <td className="px-6 py-3 text-[var(--text-secondary)]">{row.email}</td>
                                        <td className="px-6 py-3 text-[var(--text-secondary)] uppercase text-xs">{row.platform}</td>
                                        <td className="px-6 py-3 text-right">{row.campaignCount}</td>
                                    </tr>
                                ))}
                                {idSummary.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-[var(--text-secondary)] text-sm">
                                            Chưa có ID nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'campaigns' && (
                    <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface)]">
                        <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center">
                            <h3 className="text-lg font-serif text-[var(--text-primary)]">Quản lý chiến dịch</h3>
                            <span className="text-xs text-[var(--text-secondary)] uppercase tracking-[0.2em]">
                                {campaignSummary.length} chiến dịch
                            </span>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em] border-b border-[var(--border-color)]">
                                <tr>
                                    <th className="px-6 py-3">Chiến dịch</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3 text-right">Clicks</th>
                                    <th className="px-6 py-3 text-right">Lượt hiển thị</th>
                                    <th className="px-6 py-3 text-right">Chi phí</th>
                                    <th className="px-6 py-3 text-right">CPC</th>
                                    <th className="px-6 py-3 text-right">CTR</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {campaignSummary.map(row => (
                                    <tr key={row.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="text-[var(--text-primary)] font-medium">{row.name}</div>
                                            <div className="text-[10px] text-[var(--text-secondary)] mt-1">ID: {row.id}</div>
                                        </td>
                                        <td className="px-6 py-3 text-[var(--text-secondary)]">{row.email}</td>
                                        <td className="px-6 py-3 text-right font-mono">{row.clicks.toLocaleString()}</td>
                                        <td className="px-6 py-3 text-right font-mono">{row.impressions.toLocaleString()}</td>
                                        <td className="px-6 py-3 text-right font-mono">{row.cost.toLocaleString()} ₫</td>
                                        <td className="px-6 py-3 text-right font-mono">{Math.round(row.cpc).toLocaleString()} ₫</td>
                                        <td className="px-6 py-3 text-right font-mono">{row.ctr.toFixed(2)}%</td>
                                        <td className="px-6 py-3 text-right">
                                            <button
                                                onClick={() => navigate(`/ads/campaigns/${row.id}`)}
                                                className="px-3 py-1.5 text-xs border border-[var(--border-color)] rounded-sm hover:bg-[var(--bg-hover)]"
                                            >
                                                Chi tiết →
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {campaignSummary.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-4 text-center text-[var(--text-secondary)] text-sm">
                                            Chưa có dữ liệu chiến dịch.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <AddAccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={addAccount}
                onImport={importAccounts}
            />

            {/* Spacer for bottom scrolling */}
            <div className="h-40 shrink-0"></div>
        </div>
    );
};

export default AdsManagementPage;
