import React from 'react';

/**
 * BackButton - shared back navigation control
 *
 * This keeps a consistent "← Back" style across pages while allowing
 * the label text to be customized (e.g. "Back" vs "Quay lại").
 */
const BackButton = ({ label = 'Back', onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="px-3 py-1.5 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface)] transition-colors text-sm flex items-center gap-1"
        >
            <span>←</span>
            <span>{label}</span>
        </button>
    );
};

export default BackButton;

