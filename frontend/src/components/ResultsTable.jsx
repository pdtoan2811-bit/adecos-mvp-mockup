import React, { useState, useMemo } from 'react';
import { useDeepResearch } from '../context/DeepResearchContext';
import { useChatContext } from '../context/ChatContext';
import ConfirmationModal from './ConfirmationModal';
import Toast from './Toast';

const ResultsTable = ({ data, enablePagination = false, itemsPerPageOptions = [5, 10, 20, 50], showResearchAction = true }) => {
    const [sortConfig, setSortConfig] = useState(null);
    const { startResearch } = useDeepResearch();
    const { setMessages } = useChatContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [researchQuery, setResearchQuery] = useState('');

    // Toast State
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

    // Pagination & Search State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDeepResearchClick = () => {
        const query = data.length > 0 ? `Affiliate Programs for ${data[0].brand} & Niche` : "Affiliate Market Analysis";
        setResearchQuery(query);
        setIsModalOpen(true);
    };

    const confirmResearch = () => {
        const taskId = startResearch(researchQuery);
        setMessages(prev => [...prev, {
            role: 'assistant',
            type: 'deep_research_progress',
            content: { taskId }
        }]);
    };

    const handleSave = (program) => {
        const savedPrograms = JSON.parse(localStorage.getItem('savedPrograms') || '[]');
        const alreadySaved = savedPrograms.some(p => p.brand === program.brand && p.program_url === program.program_url);

        if (!alreadySaved) {
            const programWithMeta = {
                ...program,
                savedAt: new Date().toISOString()
            };
            savedPrograms.push(programWithMeta);
            localStorage.setItem('savedPrograms', JSON.stringify(savedPrograms));
            window.dispatchEvent(new Event('programSaved'));
            showToast(`Đã lưu ${program.brand} thành công!`, 'success');
        } else {
            showToast(`${program.brand} đã được lưu trước đó!`, 'info');
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ isVisible: true, message, type });
    };

    const closeToast = () => {
        setToast(prev => ({ ...prev, isVisible: false }));
    };

    // Filter & Sort
    const filteredData = useMemo(() => {
        let processed = Array.isArray(data) ? [...data] : [];

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            processed = processed.filter(item =>
                item.brand.toLowerCase().includes(lowerTerm) ||
                item.category?.toLowerCase().includes(lowerTerm) ||
                item.network?.toLowerCase().includes(lowerTerm)
            );
        }

        if (sortConfig) {
            processed.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return processed;
    }, [data, sortConfig, searchTerm]);

    // Pagination Logic
    const paginatedData = useMemo(() => {
        if (!enablePagination) return filteredData;
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, enablePagination, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    if (!data || data.length === 0) return null;

    return (
        <div className="w-full fade-in-up">
            {enablePagination && (
                <div className="flex justify-between items-center p-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search programs..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] px-4 py-2 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <span className="absolute right-3 top-2.5 text-[var(--text-secondary)]">🔍</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Show:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs rounded px-2 py-1 focus:outline-none"
                        >
                            {itemsPerPageOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div className="relative overflow-hidden rounded-none border-t border-b border-[var(--border-color)] bg-transparent">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[var(--text-secondary)] font-sans">
                        <thead className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-medium border-b border-[var(--border-color)]">
                            <tr>
                                <th className="px-4 py-4 font-normal">Thương hiệu</th>
                                <th className="px-4 py-4 font-normal">Chương trình</th>
                                <th
                                    className="px-4 py-4 cursor-pointer hover:text-[var(--text-primary)] transition font-normal whitespace-nowrap"
                                    onClick={() => requestSort('commission_percent')}
                                >
                                    Hoa hồng ↕
                                </th>
                                <th className="px-4 py-4 font-normal">Loại</th>
                                <th className="px-4 py-4 font-normal text-center">Brand Name</th>
                                <th className="px-4 py-4 font-normal text-center">Ads</th>
                                <th
                                    className="px-4 py-4 cursor-pointer hover:text-[var(--text-primary)] transition font-normal whitespace-nowrap"
                                    onClick={() => requestSort('traffic_3m')}
                                >
                                    Traffic ↕
                                </th>
                                <th
                                    className="px-4 py-4 cursor-pointer hover:text-[var(--text-primary)] transition font-normal whitespace-nowrap"
                                    onClick={() => requestSort('legitimacy_score')}
                                >
                                    Score ↕
                                </th>
                                <th className="px-4 py-4 font-normal text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-light">
                            {paginatedData.map((program, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-surface)] transition-colors duration-200 group"
                                >
                                    <td className="px-4 py-3 font-medium text-[var(--text-primary)] text-sm" title={program.brand}>
                                        {program.brand}
                                    </td>
                                    <td className="px-4 py-3">
                                        <a
                                            href={program.program_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 text-sm hover:underline block"
                                            title="Visit Program Link"
                                        >
                                            Visit Link ↗
                                        </a>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-emerald-400 font-medium text-sm">{program.commission_percent}%</span>
                                    </td>
                                    <td className="px-4 py-3 text-xs opacity-80 uppercase tracking-wide">{program.commission_type}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${program.brand_name_allowed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} text-xs`}>
                                            {program.brand_name_allowed ? '✓' : '✕'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${program.ads_allowed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} text-xs`}>
                                            {program.ads_allowed ? '✓' : '✕'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-sm opacity-70">
                                        {(program.traffic_3m / 1000000).toFixed(1)}M
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-1 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${program.legitimacy_score >= 8 ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                                                    style={{ width: `${program.legitimacy_score * 10}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm">{program.legitimacy_score}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => handleSave(program)}
                                            className="text-[var(--text-secondary)] hover:text-emerald-500 transition-colors p-2 hover:bg-emerald-500/10 rounded-full"
                                            title="Save Program"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination Controls */}
                <div className="px-6 py-4 border-t border-[var(--border-color)] flex justify-between items-center">
                    <span className="text-sm text-[var(--text-secondary)] uppercase tracking-widest">
                        {enablePagination
                            ? `Showing ${((currentPage - 1) * itemsPerPage) + 1} - ${Math.min(currentPage * itemsPerPage, filteredData.length)} of ${filteredData.length}`
                            : `${filteredData.length} Kết quả`
                        }
                    </span>

                    {enablePagination ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-2 py-1 text-xs border border-[var(--border-color)] rounded disabled:opacity-30 hover:bg-[var(--bg-surface)]"
                            >
                                ← Prev
                            </button>
                            <span className="text-xs font-mono">{currentPage} / {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-2 py-1 text-xs border border-[var(--border-color)] rounded disabled:opacity-30 hover:bg-[var(--bg-surface)]"
                            >
                                Next →
                            </button>
                        </div>
                    ) : (
                        showResearchAction && (
                            <button
                                onClick={handleDeepResearchClick}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full transition-all duration-300 text-xs uppercase tracking-widest"
                            >
                                <span>⚡</span> Deep Affiliate Research
                            </button>
                        )
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmResearch}
                title="Bắt đầu Deep Affiliate Research?"
                message={`Hệ thống sẽ thực hiện phân tích chuyên sâu trong 15 phút để tìm kiếm các Affiliate Programs chuyển đổi cao liên quan đến "${researchQuery}". Agent sẽ verify commission rates, cookie durations, và độ tin cậy thanh toán.`}
                confirmText="Start Research"
                cancelText="Hủy bỏ"
            />

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={closeToast}
            />
        </div>
    );
};

export default ResultsTable;
