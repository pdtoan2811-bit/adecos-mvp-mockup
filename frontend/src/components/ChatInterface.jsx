import React, { useState } from 'react';
// User asked for "Dynamic", so standard CSS transitions work well.

const ChatInterface = ({ onSearch, isSearching, hasSearched, onRestartOnboarding }) => {
    const [query, setQuery] = useState('');
    const [deepResearchEnabled, setDeepResearchEnabled] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            // Gửi kèm trạng thái Deep Research để phía trên biết có cần khởi chạy deep research hay không
            onSearch({ query, deepResearch: deepResearchEnabled });
        }
        setQuery(''); // Clear input after submit
    };

    const suggestions = ['Tối ưu chiến dịch ads', 'Chi phí tháng này', 'ROAS của tôi', 'Chiến dịch có hiệu suất tốt nhất'];


    return (
        <div
            className={`transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] flex flex-col 
      ${hasSearched
                    ? 'w-full py-1 z-10 items-stretch'
                    : 'min-h-[85vh] relative z-10 mx-auto w-full max-w-5xl px-6 items-center justify-center'
                }`}
        >

            {/* Logo Area - Fades out/up when searching */}
            <div className={`text-center space-y-6 transition-all duration-700 ${hasSearched ? 'hidden opacity-0' : 'mb-16 opacity-100'}`}>
                <h1 className="text-5xl md:text-8xl font-serif text-[var(--text-primary)] tracking-tighter leading-tight">
                    Adecos
                </h1>
                <p className="text-lg md:text-xl text-[var(--text-secondary)] font-sans font-light tracking-widest uppercase opacity-60">
                    Trí tuệ nhân tạo cho Affiliate
                </p>
            </div>

            <form onSubmit={handleSubmit} className={`w-full transition-all duration-1000 ${hasSearched ? 'max-w-4xl' : 'max-w-2xl'}`}>
                <div className="relative group space-y-8">

                    {/* Input Container */}
                    <div className={`relative flex items-center bg-transparent transition-colors duration-500 pb-2 
              ${hasSearched
                            ? 'bg-[var(--bg-surface)] rounded-full px-5 py-1 border border-[var(--border-color)]'
                            : 'border-b border-[var(--border-color)] focus-within:border-[var(--text-primary)]'
                        }`}
                    >

                        <input
                            type="text"
                            className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] font-serif placeholder:italic text-center
                ${hasSearched ? 'text-base md:text-lg py-2 placeholder:text-sm md:placeholder:text-base' : 'text-2xl md:text-3xl px-2 py-2 placeholder:font-serif'}
              `}
                            placeholder={hasSearched ? "Hỏi thêm câu hỏi hoặc tìm ngách khác..." : "Bạn đang tìm ngách nào?"}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={isSearching}
                            autoFocus={!hasSearched}
                        />

                        <button
                            type="submit"
                            disabled={isSearching || !query.trim()}
                            className={`absolute right-2 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300`}
                        >
                            {isSearching ? (
                                <div className="w-5 h-5 border-t-2 border-[var(--text-primary)] rounded-full animate-spin"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Deep Research toggle + tooltip + Restart */}
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
                                onClick={onRestartOnboarding}
                                className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                ⟲ Restart Onboarding Demo
                            </button>
                        )}
                    </div>

                    {/* Suggestions - Only on Home */}
                    {!hasSearched && !isSearching && (
                        <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up">
                            {suggestions.map((niche) => (
                                <button
                                    key={niche}
                                    type="button"
                                    onClick={() => onSearch({ query: niche, deepResearch: false })}
                                    className="px-6 py-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] text-sm font-sans tracking-wider hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] hover:border-[var(--text-primary)] transition-all duration-500 ease-out cursor-pointer backdrop-blur-sm"
                                >
                                    {niche}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
