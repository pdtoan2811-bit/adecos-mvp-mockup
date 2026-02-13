import React from 'react';
import StatusBadge from './StatusBadge';

const ProjectCard = ({ program, index, onEdit, onDelete, onClick }) => {
    return (
        <div
            className="border border-[var(--border-color)] p-6 rounded-sm hover:border-[var(--border-hover)] transition-all duration-300 group bg-[var(--bg-surface)] relative"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-serif tracking-tight text-[var(--text-primary)] truncate" title={program.brand}>{program.brand}</h3>
                        {program.country && <span title="Country">{/* Flag could go here if we had mapping, or just text */}</span>}
                    </div>
                    <StatusBadge status={program.status} variant="project" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(program, index); }}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        title="Sửa"
                    >
                        ✎
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(index); }}
                        className="text-[var(--text-secondary)] hover:text-red-400"
                        title="Xóa"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Hoa hồng:</span>
                    <span className="text-[var(--text-primary)] font-mono text-lg font-semibold">
                        {program.commission_percent > 0 ? `${program.commission_percent}%` : 'N/A'}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Pay time:</span>
                    <span className="text-[var(--text-primary)] font-mono text-xs opacity-80">
                        {program.payment_time || 'NET30'}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Ads:</span>
                    <span className={program.allow_ads ? "text-green-400 text-xs" : "text-red-400 text-xs"}>
                        {program.allow_ads ? '✓ Được' : '✗ Không'}
                    </span>
                </div>

                {program.legitimacy_score && (
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--text-secondary)]">Điểm AI:</span>
                        <span className="text-[var(--text-primary)]">{program.legitimacy_score}</span>
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={() => onClick(program, index)}
                className="mt-6 block w-full text-center py-2 border border-[var(--border-color)] hover:border-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 text-xs uppercase tracking-widest text-[var(--text-primary)]"
            >
                Chi tiết dự án
            </button>
        </div>
    );
};

export default ProjectCard;
