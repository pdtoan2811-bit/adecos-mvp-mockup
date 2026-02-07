import React from 'react';

/** Shared grid/list view toggle — same UI as Projects page. */
const ViewModeToggle = ({ viewMode, onViewModeChange }) => (
    <div className="flex bg-[var(--bg-surface)] rounded border border-[var(--border-color)] p-0.5">
        <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            title="Grid View"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
        </button>
        <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            title="List View"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
        </button>
    </div>
);

export default ViewModeToggle;
