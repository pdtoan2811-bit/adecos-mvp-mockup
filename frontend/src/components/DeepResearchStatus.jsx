import React from 'react';
import { useDeepResearch } from '../context/DeepResearchContext';
import { useNavigate } from 'react-router-dom';

const DeepResearchStatus = () => {
    const { tasks } = useDeepResearch();
    const navigate = useNavigate();

    const activeTasks = tasks.filter(t => t.status === 'running');

    if (activeTasks.length === 0) return null;

    return (
        <div className="fixed top-24 right-8 z-50 w-80 bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-lg rounded-sm p-4 fade-in-up">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-serif uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                    Deep Research đang chạy
                </h4>
                <button
                    onClick={() => navigate('/deep-research')}
                    className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                    Xem tất cả
                </button>
            </div>

            <div className="space-y-3">
                {activeTasks.map(task => (
                    <div key={task.id} className="text-sm">
                        <div className="flex justify-between mb-1 opacity-80">
                            <span className="truncate max-w-[150px]">{task.query}</span>
                            <span className="font-mono text-xs opacity-60">{task.eta}</span>
                        </div>
                        <div className="h-1 bg-[var(--bg-surface)] w-full rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-400 transition-all duration-300"
                                style={{ width: `${task.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeepResearchStatus;
