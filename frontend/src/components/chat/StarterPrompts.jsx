import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Search, Database, TrendingUp } from 'lucide-react';

const StarterPrompts = ({ onSearch, hasSearched, isSearching, setDeepResearchEnabled }) => {
    if (hasSearched || isSearching) return null;

    const prompts = [
        {
            id: 'quick-research',
            title: 'Nghiên cứu nhanh',
            description: 'Phân tích thị trường và đối thủ cạnh tranh',
            icon: Zap,
            action: () => {
                setDeepResearchEnabled(false);
                // Optional: Focus input or pre-fill
                const input = document.querySelector('input[type="text"]');
                if (input) {
                    input.focus();
                    input.placeholder = "Nhập chủ đề nghiên cứu nhanh...";
                }
            },
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
            action: () => {
                setDeepResearchEnabled(true);
                // Optional: Focus input or pre-fill
                const input = document.querySelector('input[type="text"]');
                if (input) {
                    input.focus();
                    input.placeholder = "Nhập chủ đề nghiên cứu sâu...";
                }
            },
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
            action: () => { },
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
            action: () => { },
            disabled: true,
            comingSoon: true,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20'
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-8 px-4"
        >
            {prompts.map((prompt) => (
                <motion.button
                    key={prompt.id}
                    variants={item}
                    onClick={prompt.action}
                    disabled={prompt.disabled}
                    className={`
                        relative group flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-300
                        border backdrop-blur-sm
                        ${prompt.disabled
                            ? 'opacity-60 cursor-not-allowed border-[var(--border-color)] bg-[var(--bg-surface)]'
                            : `cursor-pointer border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-primary)] hover:bg-[var(--bg-primary)] hover:scale-[1.02] hover:shadow-lg`
                        }
                    `}
                >
                    <div className={`p-3 rounded-lg ${prompt.bg} ${prompt.color} transition-colors duration-300 group-hover:bg-opacity-20`}>
                        <prompt.icon size={24} />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                            {prompt.title}
                            {prompt.comingSoon && (
                                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--border-color)] text-[var(--text-secondary)]">Coming Soon</span>
                            )}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors duration-300">
                            {prompt.description}
                        </p>
                    </div>

                    {!prompt.disabled && (
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[var(--text-primary)]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </motion.button>
            ))}
        </motion.div>
    );
};

export default StarterPrompts;
