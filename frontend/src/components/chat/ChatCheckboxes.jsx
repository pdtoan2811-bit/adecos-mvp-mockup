import React from 'react';

const ChatCheckboxes = ({
    deepResearchEnabled,
    setDeepResearchEnabled,
    isSearching,
    hasSearched,
    onRestartOnboarding
}) => {
    return (
        <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
            {/* Left: Deep Research toggle + tooltip */}
            <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded-sm bg-[var(--bg-surface)] border-[var(--border-color)] flex-shrink-0 focus:ring-0 focus:ring-offset-0"
                        checked={deepResearchEnabled}
                        onChange={(e) => setDeepResearchEnabled(e.target.checked)}
                        disabled={isSearching}
                    />
                    <span className="font-sans">
                        Deep Research
                    </span>
                </label>

                {/* Info icon with Vietnamese explanation on hover */}
                <div className="relative group/info">
                    <div className="w-4 h-4 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[10px] text-[var(--text-secondary)] cursor-default">
                        i
                    </div>
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-md bg-[var(--bg-surface)] px-3 py-2 text-[11px] text-[var(--text-primary)] shadow-lg opacity-0 transition-opacity duration-200 group-hover/info:opacity-100">
                        Deep Research sử dụng nhiều bot để thu thập dữ liệu trên internet trong thời gian dài hơn và trả về bộ kết quả mở rộng hơn.
                    </div>
                </div>
            </div>

            {/* Right: Restart (only when chatting) */}
            {hasSearched && (
                <button
                    type="button"
                    onClick={onRestartOnboarding}
                    className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                    ⟲ Restart Onboarding Demo
                </button>
            )}
        </div>
    );
};

export default ChatCheckboxes;
