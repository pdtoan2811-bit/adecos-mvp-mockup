import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ExperimentCard from '../components/experiments/ExperimentCard';
import ExperimentListItem from '../components/experiments/ExperimentListItem';
import ExperimentDetail from '../components/experiments/ExperimentDetail';
import ViewModeToggle from '../components/ViewModeToggle';
import { getMockExperiments } from '../data/mockWorkflowData';

/**
 * ExperimentsPage - Main experiments management (layout aligned with /ads).
 * List/grid of experiments, filter by status tabs, search, view toggle.
 */
const ExperimentsPage = () => {
    const [experiments, setExperiments] = useState([]);
    const [selectedExperiment, setSelectedExperiment] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load
    useEffect(() => {
        const loadExperiments = () => {
            const saved = localStorage.getItem('experiments');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Check for schema compatibility (simple check)
                    const isOutdated = parsed.some(exp => !exp.targetAccuracy);
                    if (isOutdated) {
                        const defaults = getMockExperiments();
                        setExperiments(defaults);
                        localStorage.setItem('experiments', JSON.stringify(defaults));
                    } else {
                        setExperiments(parsed);
                    }
                } catch (e) {
                    console.error('Failed to load experiments:', e);
                    setExperiments(getMockExperiments());
                }
            } else {
                setExperiments(getMockExperiments());
            }
            setIsLoaded(true);
        };
        loadExperiments();

        const handleStorageChange = () => loadExperiments();
        const handleExperimentAdded = () => loadExperiments();

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('experimentAdded', handleExperimentAdded);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('experimentAdded', handleExperimentAdded);
        };
    }, []);

    // Persist changes
    useEffect(() => {
        if (isLoaded && experiments.length > 0) {
            localStorage.setItem('experiments', JSON.stringify(experiments));
        }
    }, [experiments, isLoaded]);

    const filteredExperiments = useMemo(() => {
        return experiments.filter(exp => {
            const matchesStatus = filterStatus === 'all' || exp.status === filterStatus;
            const matchesSearch = !searchQuery ||
                exp.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [experiments, filterStatus, searchQuery]);

    const handleStatusChange = (id, newStatus) => {
        setExperiments(prev => prev.map(exp =>
            exp.id === id ? { ...exp, status: newStatus } : exp
        ));
    };

    const handleDelete = (id) => {
        setExperiments(prev => prev.filter(exp => exp.id !== id));
        if (selectedExperiment?.id === id) {
            setSelectedExperiment(null);
        }
    };

    const handleUpdate = (id, updates) => {
        setExperiments(prev => prev.map(exp => {
            if (exp.id === id) {
                const updated = { ...exp, ...updates };
                if (updates.todoItems) {
                    const completed = updates.todoItems.filter(t => t.completed).length;
                    updated.progress = Math.round((completed / updates.todoItems.length) * 100);
                }
                return updated;
            }
            return exp;
        }));

        if (selectedExperiment?.id === id) {
            setSelectedExperiment(prev => ({ ...prev, ...updates }));
        }
    };

    const tabs = [
        { id: 'all', label: 'Tất cả' },
        { id: 'running', label: 'Đang chạy' },
        { id: 'paused', label: 'Tạm dừng' },
        { id: 'completed', label: 'Hoàn thành' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6 transition-colors duration-300">
            {/* Header - same pattern as Ads */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-serif tracking-tight text-[var(--text-primary)]">Thí nghiệm</h1>
                    <p className="text-[var(--text-secondary)] text-sm mt-1">Quản lý workflow từ AI, theo dõi tiến độ</p>
                </div>
                <div className="flex gap-4 items-center">
                    <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                    <Link
                        to="/chat"
                        className="px-4 py-2 border border-[var(--border-color)] text-sm font-medium rounded hover:bg-[var(--bg-surface)] transition-colors text-[var(--text-primary)] flex items-center gap-2"
                    >
                        <span>+</span> Mở AI Agent
                    </Link>
                </div>
            </div>

            {/* Main Tabs - same as Ads (underline active) */}
            <div className="flex gap-8 border-b border-[var(--border-color)] mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilterStatus(tab.id)}
                        className={`
                            pb-3 text-sm font-medium uppercase tracking-widest transition-colors relative
                            ${filterStatus === tab.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}
                        `}
                    >
                        {tab.label}
                        {filterStatus === tab.id && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--text-primary)]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
                {isLoaded && filteredExperiments.length === 0 && searchQuery === '' && filterStatus === 'all' ? (
                    <div className="text-center py-24 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-[var(--bg-surface)] mb-6 flex items-center justify-center border border-[var(--border-color)]">
                            <svg className="w-8 h-8 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-serif text-[var(--text-primary)] mb-2">Chưa có thí nghiệm nào</h3>
                        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                            Thí nghiệm được tạo tự động khi bạn duyệt workflow do AI đề xuất từ khung chat.
                        </p>
                        <Link
                            to="/chat"
                            className="inline-flex items-center gap-2 mt-8 px-6 py-2.5 bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 rounded transition-all shadow-sm text-sm font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Bắt đầu với AI Agent
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative w-72">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm thí nghiệm..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded py-2 pl-10 pr-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--text-primary)] focus:ring-0 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                                {filteredExperiments.map((experiment) => (
                                    <ExperimentCard
                                        key={experiment.id}
                                        experiment={experiment}
                                        onClick={() => setSelectedExperiment(experiment)}
                                        onStatusChange={handleStatusChange}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface)] overflow-hidden animate-fade-in">
                                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs text-[var(--text-secondary)] uppercase tracking-[0.2em] border-b border-[var(--border-color)] font-medium">
                                    <div className="col-span-4">Thí nghiệm</div>
                                    <div className="col-span-2">Trạng thái</div>
                                    <div className="col-span-2">Target</div>
                                    <div className="col-span-2">Thời gian</div>
                                    <div className="col-span-2 text-right">Thao tác</div>
                                </div>
                                <div className="divide-y divide-[var(--border-color)]">
                                    {filteredExperiments.map((experiment) => (
                                        <ExperimentListItem
                                            key={experiment.id}
                                            experiment={experiment}
                                            onClick={() => setSelectedExperiment(experiment)}
                                            onStatusChange={handleStatusChange}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {filteredExperiments.length === 0 && searchQuery !== '' && (
                            <div className="text-center py-12 text-[var(--text-secondary)]">
                                Không tìm thấy thí nghiệm nào phù hợp với "{searchQuery}"
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedExperiment && (
                <ExperimentDetail
                    experiment={experiments.find(e => e.id === selectedExperiment.id) || selectedExperiment}
                    onUpdate={handleUpdate}
                    onClose={() => setSelectedExperiment(null)}
                />
            )}

            <div className="h-20 shrink-0" />
        </div>
    );
};

export default ExperimentsPage;
