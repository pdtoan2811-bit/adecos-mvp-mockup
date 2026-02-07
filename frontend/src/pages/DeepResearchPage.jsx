import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDeepResearch } from '../context/DeepResearchContext';
import ResearchProgressMessage from '../components/ResearchProgressMessage';
import ResultsTable from '../components/ResultsTable';
import { mockCryptoAffiliates } from '../data/mockCryptoAffiliates';
import BackButton from '../components/BackButton';
import StatusBadge from '../components/StatusBadge';
import ViewModeToggle from '../components/ViewModeToggle';

const DeepResearchPage = () => {
    const [searchParams] = useSearchParams();
    const { tasks } = useDeepResearch();
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'progress_desc' | 'status'
    const [selectedTask, setSelectedTask] = useState(null);

    const hasTasks = tasks.length > 0;

    // Sync selectedTask from URL ?taskId=xxx (e.g. from "Xem Báo Cáo" button)
    useEffect(() => {
        const taskId = searchParams.get('taskId');
        if (taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (task) setSelectedTask(task);
        }
    }, [searchParams, tasks]);

    const liveSelectedTask = selectedTask ? tasks.find(t => t.id === selectedTask.id) ?? selectedTask : null;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.query.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'progress_desc') return (b.progress || 0) - (a.progress || 0);
        if (sortBy === 'status') return String(a.status).localeCompare(b.status);
        return 0; // newest = keep order
    });

    const handleViewReport = (task) => setSelectedTask(task);
    const handleBack = () => setSelectedTask(null);

    // ——— Detail View (Report) — same layout as CampaignDetailPage: back above title, max-w container, space-y-6
    if (liveSelectedTask) {
        const detailData = liveSelectedTask.status === 'completed' ? mockCryptoAffiliates : [];
        return (
            <div className="flex-1 p-8 overflow-auto bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
                <div className="max-w-[1400px] mx-auto space-y-6">
                    {/* Header: back above title (matches ads/campaigns detail) */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="mb-3">
                                <BackButton label="Quay lại" onClick={handleBack} />
                            </div>
                            <h1 className="text-2xl font-serif tracking-tight text-[var(--text-primary)]">
                                Research Report: {liveSelectedTask.query}
                            </h1>
                            <p className="text-xs text-[var(--text-secondary)] mt-1">
                                ID: {liveSelectedTask.id} • <StatusBadge status={liveSelectedTask.status} variant="research" />
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-sm">
                        <h3 className="text-sm font-serif text-[var(--text-primary)] mb-2 uppercase tracking-[0.25em]">Executive Summary</h3>
                        <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                            {liveSelectedTask.result?.summary || 'Analysis in progress...'}
                        </p>
                    </div>

                    {liveSelectedTask.status === 'completed' && (
                        <div className="border border-[var(--border-color)] rounded-sm bg-[var(--bg-surface)]">
                            <div className="flex justify-between items-center px-4 py-3 border-b border-[var(--border-color)]">
                                <h3 className="text-sm font-serif text-[var(--text-primary)] uppercase tracking-[0.25em]">
                                    Affiliate Program Opportunities ({detailData.length})
                                </h3>
                                <button type="button" className="text-xs text-blue-400 hover:underline">Export CSV</button>
                            </div>
                            <div className="overflow-x-auto">
                                <ResultsTable
                                    data={detailData}
                                    enablePagination={true}
                                    itemsPerPageOptions={[10, 20, 50, 100]}
                                    showResearchAction={false}
                                />
                            </div>
                        </div>
                    )}
                    {liveSelectedTask.status === 'running' && (
                        <div className="border border-[var(--border-color)] rounded-sm bg-[var(--bg-surface)] p-5">
                            <ResearchProgressMessage taskId={liveSelectedTask.id} />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ——— List/Dashboard View (same layout as ProjectsPage) ———
    return (
        <div className="flex-1 p-8 overflow-hidden flex flex-col bg-[var(--bg-primary)] transition-colors duration-300">
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
                {/* Header: title + count, then Filter / Sort / View (same as Projects) */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                    <div>
                        <h1 className="text-3xl font-serif tracking-tight text-[var(--text-primary)] mb-1">Affiliate Deep Research</h1>
                        <p className="text-[var(--text-secondary)] text-sm">{tasks.length} research task{tasks.length !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-1.5 text-sm text-[var(--text-primary)] w-48 focus:outline-none focus:border-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] appearance-none pr-8 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="running">Running</option>
                                <option value="completed">Completed</option>
                            </select>
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-secondary)] pointer-events-none">▼</span>
                        </div>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] appearance-none pr-8 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="progress_desc">Progress cao nhất</option>
                                <option value="status">Trạng thái</option>
                            </select>
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-secondary)] pointer-events-none">▼</span>
                        </div>
                        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {!hasTasks ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🔬</div>
                                <h2 className="text-3xl font-serif text-[var(--text-primary)] mb-2">Chưa có research task nào</h2>
                                <p className="text-[var(--text-secondary)] text-sm mb-6">Hãy bắt đầu Deep Research từ khung chat AI Agent.</p>
                                <button
                                    type="button"
                                    onClick={() => handleViewReport({
                                        id: 'demo_123',
                                        query: 'Demo: Crypto Affiliate Programs',
                                        status: 'completed',
                                        result: { summary: 'This is a demo report showing 100 generated affiliate programs.' },
                                    })}
                                    className="text-sm text-[var(--text-secondary)] hover:text-blue-400 underline"
                                >
                                    Xem báo cáo demo
                                </button>
                            </div>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                            {sortedTasks.map((task) => (
                                <div
                                    key={task.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleViewReport(task)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleViewReport(task)}
                                    className="border border-[var(--border-color)] p-6 rounded-sm hover:border-[var(--border-hover)] transition-all duration-300 bg-[var(--bg-surface)] relative cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-serif tracking-tight text-[var(--text-primary)] truncate flex-1 pr-2" title={task.query}>
                                            {task.query}
                                        </h3>
                                        <StatusBadge status={task.status} variant="research" />
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[var(--text-secondary)]">Progress:</span>
                                            <span className="text-[var(--text-primary)] font-mono">{Math.round(task.progress || 0)}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[var(--text-secondary)]">ID:</span>
                                            <span className="text-[var(--text-primary)] font-mono text-xs opacity-80 truncate max-w-[140px]" title={task.id}>{task.id}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 w-full text-center py-2 border border-[var(--border-color)] hover:border-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 text-xs uppercase tracking-widest text-[var(--text-primary)]">
                                        Xem báo cáo
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full overflow-x-auto pb-20">
                            <table className="w-full text-left font-sans text-sm">
                                <thead className="uppercase text-xs tracking-[0.1em] text-[var(--text-secondary)] font-light border-b border-[var(--border-color)]">
                                    <tr>
                                        <th className="px-4 py-4 font-normal">Query</th>
                                        <th className="px-4 py-4 font-normal">Trạng thái</th>
                                        <th className="px-4 py-4 font-normal">Progress</th>
                                        <th className="px-4 py-4 font-normal">ID</th>
                                        <th className="px-4 py-4 font-normal text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {sortedTasks.map((task) => (
                                        <tr key={task.id} className="hover:bg-[var(--bg-hover)] transition-colors group text-[var(--text-primary)]">
                                            <td className="px-4 py-4 font-medium text-[var(--text-primary)]">{task.query}</td>
                                            <td className="px-4 py-4"><StatusBadge status={task.status} variant="research" /></td>
                                            <td className="px-4 py-4 font-mono">{Math.round(task.progress || 0)}%</td>
                                            <td className="px-4 py-4 font-mono text-xs opacity-70 truncate max-w-[120px]" title={task.id}>{task.id}</td>
                                            <td className="px-4 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewReport(task)}
                                                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                                >
                                                    Xem
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeepResearchPage;
