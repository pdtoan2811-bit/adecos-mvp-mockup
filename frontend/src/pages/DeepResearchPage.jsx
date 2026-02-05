import React, { useState } from 'react';
import { useDeepResearch } from '../context/DeepResearchContext';
import ResearchProgressMessage from '../components/ResearchProgressMessage';
import ResultsTable from '../components/ResultsTable';
import { mockCryptoAffiliates } from '../data/mockCryptoAffiliates';

const DeepResearchPage = () => {
    const { tasks } = useDeepResearch();
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'running' | 'completed'
    const [selectedTask, setSelectedTask] = useState(null);

    // If no tasks exist, we can optionally show a demo task to visualize the detail view
    // Or just let the user click a "Demo Report" button.
    const hasTasks = tasks.length > 0;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.query.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleViewReport = (task) => {
        setSelectedTask(task);
    };

    const handleBack = () => {
        setSelectedTask(null);
    };

    /**
     * Detail View (Report)
     */
    if (selectedTask) {
        // Use Mock Data for the detail view table if it's completed (simulated)
        // In real app, `selectedTask.result.data` would hold this.
        const detailData = selectedTask.status === 'completed' ? mockCryptoAffiliates : [];

        return (
            <div className="flex flex-col h-full bg-[var(--bg-primary)] text-[var(--text-primary)] fade-in-up">
                {/* Header with Back Button */}
                <div className="px-8 py-6 border-b border-[var(--border-color)] flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="px-3 py-1.5 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface)] transition-colors text-sm"
                    >
                        ← Back
                    </button>
                    <div>
                        <h1 className="text-xl font-serif tracking-tight text-[var(--text-primary)]">
                            Research Report: {selectedTask.query}
                        </h1>
                        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mt-1">
                            ID: {selectedTask.id} • Status: <span className={selectedTask.status === 'completed' ? 'text-green-500' : 'text-blue-500'}>{selectedTask.status}</span>
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Summary Card */}
                        <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl">
                            <h3 className="text-lg font-medium mb-2">Executive Summary</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                {selectedTask.result?.summary || "Analysis in progress..."}
                            </p>
                        </div>

                        {/* Results Table */}
                        {selectedTask.status === 'completed' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium">Affiliate Program Opportunities ({detailData.length})</h3>
                                    <button className="text-xs text-blue-400 hover:underline">Export CSV</button>
                                </div>
                                <div className="border border-[var(--border-color)] rounded-lg overflow-hidden bg-[var(--bg-card)]">
                                    <ResultsTable
                                        data={detailData}
                                        enablePagination={true}
                                        itemsPerPageOptions={[10, 20, 50, 100]}
                                        showResearchAction={false}
                                    />
                                </div>
                            </div>
                        )}

                        {selectedTask.status === 'running' && (
                            <ResearchProgressMessage taskId={selectedTask.id} />
                        )}
                    </div>
                </div>
            </div>
        );
    }


    /**
     * Dashboard View (Grid/List)
     */
    return (
        <div className="flex flex-col h-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
            {/* Header */}
            <div className="px-8 py-6 border-b border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-serif tracking-tight text-[var(--text-primary)]">Affiliate Deep Research</h1>
                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mt-1">
                        Tự động tìm kiếm & Đánh giá (Program Discovery & Vetting)
                    </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="running">Running</option>
                        <option value="completed">Completed</option>
                    </select>

                    {/* View Toggle */}
                    <div className="flex bg-[var(--bg-surface)] rounded-lg p-0.5 border border-[var(--border-color)]">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[var(--bg-hover)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            title="Grid View"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[var(--bg-hover)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            title="List View"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
                {!hasTasks ? (
                    <div className="text-center py-20 opacity-50 flex flex-col items-center">
                        <p>Chưa có research task nào được khởi tạo.</p>
                        <p className="text-sm mt-2 mb-6">Hãy bắt đầu Deep Research từ khung chat AI Agent.</p>

                        {/* Demo Button to show capabilities even if empty */}
                        <div className="p-6 border border-dashed border-[var(--border-color)] rounded-xl max-w-sm">
                            <h4 className="font-medium mb-2">Developer Demo</h4>
                            <p className="text-xs text-[var(--text-secondary)] mb-4">Click below to visualize a sample "Completed" Crypto Research report with 100 items.</p>
                            <button
                                onClick={() => handleViewReport({
                                    id: 'demo_123',
                                    query: "Demo: Crypto Affiliate Programs",
                                    status: 'completed',
                                    result: { summary: "This is a demo report showing 100 generated affiliate programs." }
                                })}
                                className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-500/20 transition-all font-medium"
                            >
                                View Demo Report
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        {filteredTasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => handleViewReport(task)}
                                className={`
                                    bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer group relative
                                    ${viewMode === 'list' ? 'flex items-center p-4 gap-6' : 'p-0'}
                                `}
                            >
                                {viewMode === 'grid' && (
                                    <>
                                        <div className="p-5 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex justify-between items-start">
                                            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            </div>
                                            <span className={`px-2 py-1 text-[10px] uppercase rounded border font-medium
                                                ${task.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}
                                            `}>
                                                {task.status}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-serif text-lg font-medium mb-2 group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[3.5rem]">{task.query}</h3>
                                            <p className="text-xs text-[var(--text-secondary)] mb-4">ID: {task.id}</p>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[10px] uppercase text-[var(--text-secondary)]">
                                                    <span>Progress</span>
                                                    <span>{Math.round(task.progress)}%</span>
                                                </div>
                                                <div className="h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500" style={{ width: `${task.progress}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {viewMode === 'list' && (
                                    <>
                                        <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium group-hover:text-blue-400 transition-colors">{task.query}</h3>
                                            <p className="text-xs text-[var(--text-secondary)]">ID: {task.id}</p>
                                        </div>
                                        <div className="hidden md:block w-32">
                                            <span className={`px-2 py-1 text-[10px] uppercase rounded border font-medium block text-center
                                                ${task.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}
                                            `}>
                                                {task.status}
                                            </span>
                                        </div>
                                        <div className="w-24 hidden md:block">
                                            <div className="text-right text-xs font-mono">{Math.round(task.progress)}%</div>
                                        </div>
                                        <div className="text-[var(--text-secondary)]">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default DeepResearchPage;
