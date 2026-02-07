import React from 'react';

/**
 * Shared status badge for Projects (saved programs) and Deep Research (tasks).
 * variant: 'project' | 'research' — maps status to colors/labels.
 */
const STATUS_STYLES = {
    project: {
        'Đang chạy': 'bg-green-500/20 text-green-400',
        'Duyệt Chạy': 'bg-green-500/20 text-green-400',
        'Tạm dừng': 'bg-yellow-500/20 text-yellow-400',
        'Đang tìm hiểu': 'bg-blue-500/20 text-blue-400',
    },
    research: {
        completed: 'bg-green-500/20 text-green-400',
        running: 'bg-blue-500/20 text-blue-400',
    },
};

const StatusBadge = ({ status, variant = 'project' }) => {
    const map = STATUS_STYLES[variant] || STATUS_STYLES.project;
    const colors = map[status] || 'bg-[var(--bg-surface)] text-[var(--text-secondary)]';
    const label = variant === 'research' ? status : status;

    return (
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium ${colors}`}>
            {label}
        </span>
    );
};

export default StatusBadge;
