import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Search, Database, TrendingUp } from 'lucide-react';
import { useAutocomplete } from '../../hooks/useAutocomplete';
import AutocompleteDropdown from './AutocompleteDropdown';

/**
 * ImmersiveInputMessage – A version of the immersive input designed to be 
 * rendered as a message within the chat conversation.
 */
const ImmersiveInputMessage = ({ onSearch, isSearching }) => {
    const [query, setQuery] = useState('');
    const [deepResearchEnabled, setDeepResearchEnabled] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch({ query, deepResearch: deepResearchEnabled });
        }
    };

    const {
        suggestions,
        loading,
        isOpen,
        selectedIndex,
        selectNext,
        selectPrev,
        closeSuggestions,
        setIsOpen
    } = useAutocomplete(query);

    const handleKeyDown = (e) => {
        if (!isOpen) return;

        if (e.key === 'Tab') {
            e.preventDefault();
            if (selectedIndex === -1 && suggestions.length > 0) {
                selectNext();
            } else {
                selectNext();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectNext();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectPrev();
        } else if (e.key === 'Enter') {
            if (selectedIndex !== -1) {
                e.preventDefault();
                setQuery(suggestions[selectedIndex]);
                closeSuggestions();
            }
        } else if (e.key === 'Escape') {
            closeSuggestions();
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        setQuery(suggestion);
        closeSuggestions();
        // Focus back to input if needed, but here we might just let it be
        const input = document.getElementById('message-search-input');
        input?.focus();
    };

    const prompts = [
        {
            id: 'quick-research',
            title: 'Nghiên cứu nhanh',
            description: 'Phân tích thị trường & đối thủ',
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
            description: 'Báo cáo chi tiết đa chiều',
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
            description: 'Hỏi đáp trực tiếp trên dữ liệu',
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
            description: 'Tự động tối ưu chiến dịch QC',
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
        const input = document.querySelector('#message-search-input');
        if (input) {
            input.focus();
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-8 px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-10"
            >
                <h3 className="text-2xl font-sans font-semibold text-[var(--text-primary)] mb-2 tracking-tight">
                    Bắt đầu phiên nghiên cứu mới
                </h3>
                <p className="text-sm font-sans text-[var(--text-secondary)] opacity-60">
                    Hãy cho tôi biết ngách sản phẩm hoặc chủ đề bạn muốn phân tích
                </p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="w-full mb-10"
            >
                <div className="relative group flex flex-col items-center">
                    {/* Autocomplete Dropdown */}
                    <div className="absolute bottom-full left-0 w-full mb-2 z-50">
                        <AutocompleteDropdown
                            suggestions={suggestions}
                            selectedIndex={selectedIndex}
                            onSelect={handleSelectSuggestion}
                            isOpen={isOpen}
                            loading={loading}
                        />
                    </div>

                    <div className="w-full relative flex items-center border-b border-[var(--border-color)] focus-within:border-[var(--text-primary)] transition-all duration-500 pb-2">
                        <input
                            id="message-search-input"
                            type="text"
                            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] font-sans font-light text-center text-xl md:text-2xl py-2"
                            placeholder="Nhập yêu cầu tìm kiếm của bạn..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={isSearching}
                            autoFocus
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            type="submit"
                            disabled={isSearching || !query.trim()}
                            className="absolute right-2 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                            {isSearching ? (
                                <div className="w-5 h-5 border-t-2 border-[var(--text-primary)] rounded-full animate-spin"></div>
                            ) : (
                                <Search size={20} />
                            )}
                        </button>
                    </div>

                    <div className="mt-3 flex items-center justify-center text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="w-3.5 h-3.5 rounded-sm bg-[var(--bg-surface)] border-[var(--border-color)] flex-shrink-0 focus:ring-0 focus:ring-offset-0"
                                checked={deepResearchEnabled}
                                onChange={(e) => setDeepResearchEnabled(e.target.checked)}
                                disabled={isSearching}
                            />
                            <span className="font-sans">Deep Research Mode</span>
                        </label>
                    </div>
                </div>
            </motion.form>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
                {prompts.map((prompt) => (
                    <motion.button
                        key={prompt.id}
                        type="button"
                        variants={item}
                        onClick={() => handlePromptClick(prompt)}
                        disabled={prompt.disabled}
                        className={`
                            group/card flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-300 border
                            ${prompt.disabled
                                ? 'opacity-40 cursor-not-allowed border-[var(--border-color)] bg-[var(--bg-surface)]'
                                : 'cursor-pointer border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                            }
                        `}
                    >
                        <div className={`p-2 rounded-lg ${prompt.bg} ${prompt.color}`}>
                            <prompt.icon size={18} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h4 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                {prompt.title}
                                {prompt.comingSoon && <span className="text-[8px] uppercase px-1.5 py-0.5 rounded-full bg-[var(--border-color)] text-[var(--text-secondary)]">Soon</span>}
                            </h4>
                            <p className="text-[11px] text-[var(--text-secondary)] truncate">
                                {prompt.description}
                            </p>
                        </div>
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
};

export default ImmersiveInputMessage;
