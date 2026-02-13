import React from 'react';
import StatusBadge from './StatusBadge';

const ProjectListRow = ({ program, index, onEdit, onDelete, onClick }) => {
    return (
        <tr className="hover:bg-[var(--bg-hover)] transition-colors group text-[var(--text-primary)]">
            <td className="px-4 py-4 font-medium text-[var(--text-primary)]">{program.brand}</td>
            <td className="px-4 py-4">
                <StatusBadge status={program.status} variant="project" />
            </td>
            <td className="px-4 py-4 text-[var(--text-secondary)]">{program.niche}</td>
            <td className="px-4 py-4 font-mono text-[var(--text-primary)]">
                {program.commission_percent > 0 ? `${program.commission_percent}%` : '—'}
            </td>
            <td className="px-4 py-4 font-mono text-xs opacity-70">{program.payment_time || 'NET30'}</td>
            <td className="px-4 py-4 text-right">
                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity items-center">
                    <button
                        onClick={() => onClick(program, index)}
                        className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                        Chi tiết
                    </button>
                    <button onClick={() => onEdit(program, index)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">✎</button>
                    <button onClick={() => onDelete(index)} className="text-[var(--text-secondary)] hover:text-red-400">✕</button>
                </div>
            </td>
        </tr>
    );
};

export default ProjectListRow;
