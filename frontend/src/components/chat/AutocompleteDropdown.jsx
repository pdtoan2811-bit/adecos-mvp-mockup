
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AutocompleteDropdown = ({
    suggestions,
    selectedIndex,
    onSelect,
    isOpen,
    loading
}) => {
    if (!isOpen && !loading) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full left-0 w-full mb-2 bg-[var(--bg-surface)]/95 backdrop-blur-md border border-[var(--border-color)] rounded-xl shadow-lg overflow-hidden z-50 max-h-60 overflow-y-auto"
                >
                    {loading && suggestions.length === 0 && (
                        <div className="p-3 text-sm text-[var(--text-secondary)] text-center italic">
                            Đang suy nghĩ...
                        </div>
                    )}

                    <ul className="py-1">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => onSelect(suggestion)}
                                className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-150 flex items-center justify-between
                                    ${index === selectedIndex
                                        ? 'bg-[var(--primary-color)]/10 text-[var(--primary-color)]'
                                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'}
                                `}
                            >
                                <span className="truncate">{suggestion}</span>
                                {index === selectedIndex && (
                                    <span className="text-xs text-[var(--text-secondary)] opacity-60">Tab to select</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AutocompleteDropdown;
