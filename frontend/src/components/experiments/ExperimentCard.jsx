import React from 'react';
import { getStatusConfig, formatExperimentDate, calculateTimeProgress } from '../../utils/experimentUtils';

/**
 * ExperimentCard - Card displaying experiment summary
 * 
 * Features:
 * - Status badge
 * - Progress indicator
 * - Key metrics preview
 * - Quick actions
 */
const ExperimentCard = ({ experiment, onClick, onStatusChange, onDelete }) => {
    const {
        id,
        title,
        createdAt,
        status,
        result = 'pending',
        todoItems = [],
        progress = 0,
        metrics = {},
        targetAccuracy,
        timeProgress
    } = experiment;

    const config = getStatusConfig(status);
    const dateLabel = formatExperimentDate(createdAt);
    const timeData = calculateTimeProgress(timeProgress);

    const completedCount = todoItems.filter(item => item.completed).length;

    return (
        <div
            className="group border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface)] p-5 hover:bg-[var(--bg-hover)] transition-all duration-300 cursor-pointer flex flex-col h-full hover:shadow-lg hover:border-[var(--text-secondary)]/30"
            onClick={onClick}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 mr-2">
                    <h3 className="text-lg font-serif text-[var(--text-primary)] truncate mb-1" title={title}>
                        {title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <span>{dateLabel}</span>
                        {result !== 'pending' && (
                            <span className={`px-1.5 py-0.5 rounded ${result === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {result === 'success' ? 'Success' : 'Failed'}
                            </span>
                        )}
                    </div>
                </div>
                <span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border ${config.color}`}>
                    <span className="text-[10px]">{config.icon}</span>
                    <span className="whitespace-nowrap font-medium">{config.text}</span>
                </span>
            </div>

            {/* Target & Time Progress Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {timeData && (
                    <div className="border border-[var(--border-color)] rounded-lg p-3 bg-[var(--bg-primary)] group-hover:bg-[var(--bg-surface)] transition-colors">
                        <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                            <span>Time</span>
                            <span className="text-[var(--text-primary)] font-medium">{timeData.label}</span>
                        </div>
                        <div className="h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${timeData.percent}%` }} />
                        </div>
                    </div>
                )}
                {targetAccuracy ? (
                    <div className="border border-[var(--border-color)] rounded-lg p-3 bg-[var(--bg-primary)] group-hover:bg-[var(--bg-surface)] transition-colors">
                        <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                            <span>Target ({targetAccuracy.unit})</span>
                            <span className={`font-medium ${targetAccuracy.status === 'over' ? 'text-green-400' : 'text-red-400'}`}>
                                {targetAccuracy.current}
                            </span>
                        </div>
                        <div className="h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                            <div
                                className={`h-full ${targetAccuracy.status === 'over' ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="border border-[var(--border-color)] rounded-lg p-3 bg-[var(--bg-primary)] group-hover:bg-[var(--bg-surface)] transition-colors">
                        <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                            <span>Tasks</span>
                            <span className="text-[var(--text-primary)] font-medium">{completedCount}/{todoItems.length}</span>
                        </div>
                        <div className="h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Metrics Preview */}
            {Object.keys(metrics).length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4 mt-auto">
                    {metrics.roas && (
                        <div className="text-center p-2 rounded border border-[var(--border-color)] bg-[var(--bg-primary)]">
                            <div className="text-md font-serif text-[var(--text-primary)]">{metrics.roas.toFixed(1)}x</div>
                            <div className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">ROAS</div>
                        </div>
                    )}
                    {metrics.cpc && (
                        <div className="text-center p-2 rounded border border-[var(--border-color)] bg-[var(--bg-primary)]">
                            <div className="text-md font-serif text-[var(--text-primary)]">{(metrics.cpc / 1000).toFixed(1)}k</div>
                            <div className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">CPC</div>
                        </div>
                    )}
                    {metrics.conversions && (
                        <div className="text-center p-2 rounded border border-[var(--border-color)] bg-[var(--bg-primary)]">
                            <div className="text-md font-serif text-[var(--text-primary)]">{metrics.conversions}</div>
                            <div className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">Conv.</div>
                        </div>
                    )}
                </div>
            )}

            {/* Quick Actions Footer - Hidden by default, shown on hover */}
            <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-color)] mt-auto opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="px-2 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded transition-colors"
                >
                    Extend
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="px-2 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded transition-colors"
                >
                    Scale
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Xóa thí nghiệm này?')) onDelete(id);
                    }}
                    className="ml-auto px-2 py-1 text-xs text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                    Archive
                </button>
            </div>
        </div>
    );
};

export default ExperimentCard;
