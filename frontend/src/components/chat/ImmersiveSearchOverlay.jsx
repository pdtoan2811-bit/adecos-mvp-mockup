import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Search, Database, TrendingUp, ArrowLeft } from 'lucide-react';

/**
 * ImmersiveSearchOverlay – Full-screen research input with logo, 
 * starter prompts, and deep research toggle. Shown when user clicks 
 * "Bắt đầu nghiên cứu" from the Bento grid or focuses the minimal input.
 */
const ImmersiveSearchOverlay = ({ onSearch, onBack, isSearching }) => {
    const [query, setQuery] = useState('');
    const [deepResearchEnabled, setDeepResearchEnabled] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch({ query, deepResearch: deepResearchEnabled });
        }
    };

    const prompts = [
        {
            id: 'quick-research',
            title: 'Nghiên cứu nhanh',
            description: 'Phân tích thị trường và đối thủ cạnh tranh',
            icon: Zap,
            deepResearch: false,
            disabled: false,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            id: 'deep-research',
            title: 'Nghiên cứu sâu',
            description: 'Báo cáo chi tiết đa chiều về ngành hàng',
            icon: Search,
            deepResearch: true,
            disabled: false,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
        {
            id: 'chat-data',
            title: 'Chat với data',
            description: 'Hỏi đáp trực tiếp trên dữ liệu của bạn',
            icon: Database,
            deepResearch: false,
            disabled: true,
            comingSoon: true,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        {
            id: 'auto-optimize',
            title: 'Tối ưu AI',
            description: 'Tự động tối ưu hóa chiến dịch quảng cáo',
            icon: TrendingUp,
            deepResearch: false,
            disabled: true,
            comingSoon: true,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20'
        }
    ];

    const handlePromptClick = (prompt) => {
        if (prompt.disabled) return;
        setDeepResearchEnabled(prompt.deepResearch);
        // Focus the input
        const input = document.querySelector('#immersive-search-input');
        if (input) {
            input.focus();
            input.placeholder = prompt.deepResearch
                ? 'Nhập chủ đề nghiên cứu sâu...'
                : 'Nhập chủ đề nghiên cứu nhanh...';
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] relative z-10 mx-auto w-full max-w-5xl px-6">
            {/* Back button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={onBack}
                className="absolute top-0 left-6 flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300"
            >
                <ArrowLeft size={16} />
                <span className="text-xs uppercase tracking-wider">Quay lại</span>
            </motion.button>

            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center space-y-6 mb-16"
            >
                <h1 className="text-5xl md:text-8xl font-serif text-[var(--text-primary)] tracking-tighter leading-tight">
                    Adecos
                </h1>
                <p className="text-lg md:text-xl text-[var(--text-secondary)] font-sans font-light tracking-widest uppercase opacity-60">
                    Trí tuệ nhân tạo cho Affiliate
                </p>
            </motion.div>

            {/* Search Input */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onSubmit={handleSubmit}
                className="w-full max-w-4xl"
            >
                <div className="relative group space-y-8 flex flex-col items-center">
                    <div className="w-full">
                        <div className="relative flex items-center border-b border-[var(--border-color)] focus-within:border-[var(--text-primary)] transition-all duration-500 pb-2">
                            <input
                                id="immersive-search-input"
                                type="text"
                                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] font-serif placeholder:italic text-center text-2xl md:text-3xl px-2 py-2 placeholder:font-serif"
                                placeholder="Bạn đang tìm ngách nào?"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                disabled={isSearching}
                                autoFocus
                            />

                            <button
                                type="submit"
                                disabled={isSearching || !query.trim()}
                                className="absolute right-2 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300"
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

                        {/* Deep Research toggle */}
                        <div className="mt-2 flex items-center justify-center text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
                            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded-sm bg-[var(--bg-surface)] border-[var(--border-color)] flex-shrink-0 focus:ring-0 focus:ring-offset-0"
                                    checked={deepResearchEnabled}
                                    onChange={(e) => setDeepResearchEnabled(e.target.checked)}
                                    disabled={isSearching}
                                />
                                <span className="font-sans">Deep Research</span>
                            </label>
                        </div>
                    </div>

                    {/* Starter Prompts */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-8 px-4"
                    >
                        {prompts.map((prompt) => (
                            <motion.button
                                key={prompt.id}
                                type="button"
                                variants={item}
                                onClick={() => handlePromptClick(prompt)}
                                disabled={prompt.disabled}
                                className={`
                                    relative group/card flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-300
                                    border backdrop-blur-sm
                                    ${prompt.disabled
                                        ? 'opacity-60 cursor-not-allowed border-[var(--border-color)] bg-[var(--bg-surface)]'
                                        : `cursor-pointer border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-primary)] hover:bg-[var(--bg-primary)] hover:scale-[1.02] hover:shadow-lg`
                                    }
                                `}
                            >
                                <div className={`p-3 rounded-lg ${prompt.bg} ${prompt.color} transition-colors duration-300 group-hover/card:bg-opacity-20`}>
                                    <prompt.icon size={24} />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                                        {prompt.title}
                                        {prompt.comingSoon && (
                                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--border-color)] text-[var(--text-secondary)]">Coming Soon</span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-[var(--text-secondary)] group-hover/card:text-[var(--text-primary)] transition-colors duration-300">
                                        {prompt.description}
                                    </p>
                                </div>

                                {!prompt.disabled && (
                                    <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 text-[var(--text-primary)]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </motion.form>
        </div>
    );
};

export default ImmersiveSearchOverlay;
