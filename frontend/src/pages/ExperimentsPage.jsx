import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        const loadExperiments = () => {
            const saved = localStorage.getItem('experiments');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
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
        };
        loadExperiments();
        window.addEventListener('storage', loadExperiments);
        window.addEventListener('experimentAdded', loadExperiments);
        return () => {
            window.removeEventListener('storage', loadExperiments);
            window.removeEventListener('experimentAdded', loadExperiments);
        };
    }, []);

    useEffect(() => {
        if (experiments.length > 0) {
            localStorage.setItem('experiments', JSON.stringify(experiments));
        }
    }, [experiments]);

    const filteredExperiments = experiments.filter(exp => {
        const matchesStatus = filterStatus === 'all' || exp.status === filterStatus;
        const matchesSearch = !searchQuery ||
            exp.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleStatusChange = (id, newStatus) => {
        setExperiments(prev => prev.map(exp =>
            exp.id === id ? { ...exp, status: newStatus } : exp
        ));
    };

    const handleDelete = (id) => {
        setExperiments(prev => prev.filter(exp => exp.id !== id));
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
                        to="/"
                        className="px-4 py-2 border border-[var(--border-color)] text-sm font-medium rounded hover:bg-[var(--bg-surface)] transition-colors text-[var(--text-primary)]"
                    >
                        Mở AI Agent
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
                {filteredExperiments.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full bg-[var(--bg-surface)] mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-10 h-10 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-serif text-[var(--text-primary)] mb-2">Chưa có thí nghiệm</h3>
                        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                            Thí nghiệm được tạo khi bạn duyệt workflow do AI đề xuất từ chat.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors text-sm text-[var(--text-primary)] border border-[var(--border-color)]"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Mở AI Agent
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Tìm thí nghiệm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--text-primary)] outline-none"
                            />
                        </div>

                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredExperiments.map((experiment, idx) => (
                                    <div
                                        key={experiment.id}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <ExperimentCard
                                            experiment={experiment}
                                            onClick={() => setSelectedExperiment(experiment)}
                                            onStatusChange={handleStatusChange}
                                            onDelete={handleDelete}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface)] overflow-hidden">
                                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs text-[var(--text-secondary)] uppercase tracking-[0.2em] border-b border-[var(--border-color)] font-medium">
                                    <div className="col-span-4">Thí nghiệm</div>
                                    <div className="col-span-2">Trạng thái</div>
                                    <div className="col-span-2">Target</div>
                                    <div className="col-span-2">Thời gian</div>
                                    <div className="col-span-2 text-right">Thao tác</div>
                                </div>
                                <div className="divide-y divide-[var(--border-color)]">
                                    {filteredExperiments.map((experiment, idx) => (
                                        <div
                                            key={experiment.id}
                                            className="animate-fade-in-up"
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                        >
                                            <ExperimentListItem
                                                experiment={experiment}
                                                onClick={() => setSelectedExperiment(experiment)}
                                                onStatusChange={handleStatusChange}
                                                onDelete={handleDelete}
                                            />
                                        </div>
                                    ))}
                                </div>
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

            <div className="h-40 shrink-0" />
        </div>
    );
};

export default ExperimentsPage;
