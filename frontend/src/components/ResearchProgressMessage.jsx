import React, { useEffect, useState } from 'react';
import { useDeepResearch } from '../context/DeepResearchContext';
import { useNavigate } from 'react-router-dom';

const ResearchProgressMessage = ({ taskId }) => {
    const { tasks, fastForward } = useDeepResearch();
    const navigate = useNavigate();
    const task = tasks.find(t => t.id === taskId);
    const [currentLog, setCurrentLog] = useState('');

    useEffect(() => {
        if (task && task.logs.length > 0) {
            setCurrentLog(task.logs[task.logs.length - 1]);
        }
    }, [task]);

    if (!task) return null;

    return (
        <div className="my-4 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-xl overflow-hidden w-full fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3">
                    <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center text-lg
                        ${task.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}
                    `}>
                        {task.status === 'completed' ? <span className="text-white">✓</span> : <span className="animate-pulse">⚡</span>}
                    </div>
                    <div>
                        <h3 className="text-xl font-serif text-[var(--text-primary)] tracking-tight">{task.query}</h3>
                        <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest opacity-70">
                            {task.status === 'completed' ? 'Phân tích hoàn tất (Analysis Complete)' : 'Đang phân tích Web Sources...'}
                        </p>
                    </div>
                </div>
                {task.status === 'running' && (
                    <div className="px-2 py-1 text-[10px] font-mono bg-[var(--bg-hover)] rounded border border-[var(--border-color)] text-[var(--text-secondary)]">
                        ETA: {task.eta}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-2 font-medium">
                        <span>Tiến độ (Progress)</span>
                        <span>{Math.round(task.progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] w-full rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ease-out ${task.status === 'completed' ? 'bg-green-500' : 'bg-blue-500/80 relative overflow-hidden'}`}
                            style={{ width: `${task.progress}%` }}
                        >
                            {task.status === 'running' && (
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Terminal Logs */}
                <div className="bg-[var(--bg-surface)] p-4 font-mono text-[11px] border border-[var(--border-color)] rounded-lg h-36 overflow-y-auto custom-scrollbar mb-0 leading-relaxed">
                    <div className="flex flex-col gap-1.5">
                        {task.logs.slice(-6).map((log, i) => (
                            <div key={i} className="text-[var(--text-secondary)] opacity-80">
                                <span className="text-blue-400/70 mr-2">➜</span>
                                {log}
                            </div>
                        ))}
                        {task.status === 'running' && (
                            <div className="animate-pulse text-blue-400/50">_</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[var(--border-color)] bg-[var(--bg-surface)]">
                {task.status === 'running' && (
                    <button
                        onClick={() => fastForward(task.id)}
                        className="px-3 py-1.5 text-xs text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 border border-orange-500/20 transition-all rounded-lg flex items-center gap-2"
                        title="Debug: Fast Forward"
                    >
                        <span>⏩</span> Fast Forward
                    </button>
                )}
                {task.status === 'completed' && (
                    <button
                        onClick={() => navigate('/deep-research')}
                        className="px-4 py-1.5 text-xs bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 shadow-lg hover:shadow-[var(--shadow-color)] transition-all rounded-lg font-medium tracking-wide flex items-center gap-2"
                    >
                        <span>Xem Báo Cáo</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ResearchProgressMessage;
