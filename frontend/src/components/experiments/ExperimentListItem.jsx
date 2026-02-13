import React from 'react';
import { getStatusConfig, formatExperimentDate, calculateTimeProgress } from '../../utils/experimentUtils';

/**
 * ExperimentListItem - Table row style experiment item
 */
const ExperimentListItem = ({ experiment, onClick, onStatusChange, onDelete }) => {
    const {
        id,
        title,
        createdAt,
        status,
        result = 'pending',
        metrics = {},
        targetAccuracy,
        timeProgress
    } = experiment;

    const config = getStatusConfig(status);
    const dateLabel = formatExperimentDate(createdAt);
    const timeData = calculateTimeProgress(timeProgress);

    const getTargetColor = (status) => {
        if (status === 'over') return 'text-green-400';
        if (status === 'under') return 'text-red-400';
        return 'text-[var(--text-primary)]';
    };

    return (
        <div
            className="group grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
            onClick={onClick}
        >
            <div className="col-span-4 min-w-0">
                <div className="font-medium text-[var(--text-primary)] truncate text-sm mb-0.5">{title}</div>
                <div className="text-xs text-[var(--text-secondary)] font-mono">{dateLabel}</div>
            </div>
            <div className="col-span-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-full border ${config.color}`}>
                    <span className="text-[10px]">{config.icon}</span>
                    <span className="font-medium">{config.text}</span>
                </span>
            </div>
            <div className="col-span-2">
                {targetAccuracy ? (
                    <div className="text-xs">
                        <div className="flex justify-between mb-1">
                            <span className="text-[var(--text-secondary)] uppercase text-[10px] tracking-wider">Target</span>
                            <span className={`font-medium ${getTargetColor(targetAccuracy.status)}`}>
                                {targetAccuracy.status === 'over' ? '▲' : '▼'} {targetAccuracy.current}
                            </span>
                        </div>
                        <div className="h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                            <div className={`h-full ${targetAccuracy.status === 'over' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: '100%' }} />
                        </div>
                    </div>
                ) : (
                    <span className="text-xs text-[var(--text-secondary)] opacity-50">-</span>
                )}
            </div>
            <div className="col-span-2">
                {timeData ? (
                    <div className="text-xs">
                        <div className="flex justify-between mb-1">
                            <span className="text-[var(--text-secondary)] uppercase text-[10px] tracking-wider">Time</span>
                            <span className="text-[var(--text-primary)] font-medium">{timeData.label}</span>
                        </div>
                        <div className="h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${timeData.percent}%` }} />
                        </div>
                    </div>
                ) : (
                    <span className="text-xs text-[var(--text-secondary)] opacity-50">-</span>
                )}
            </div>
            <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded transition-colors" title="Extend">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded transition-colors" title="Scale">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); if (confirm('Xóa thí nghiệm này?')) onDelete(id); }}
                    className="p-1.5 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    title="Archive"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        </div>
    );
};

export default ExperimentListItem;
