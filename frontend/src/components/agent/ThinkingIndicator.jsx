import React from 'react';
import { motion } from 'framer-motion';

/**
 * ThinkingIndicator — Animated "AI is thinking" bubble with pulsing dots.
 * Used in the onboarding mimic flow between user questions and AI answers.
 */
const ThinkingIndicator = () => {
    return (
        <motion.div
            className="flex w-full justify-start my-4 px-4 md:px-0"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
            <div className="max-w-5xl mx-auto w-full">
                <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] px-6 py-4 rounded-3xl rounded-tl-sm backdrop-blur-md w-fit flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full bg-[var(--text-secondary)]"
                                animate={{
                                    scale: [1, 1.4, 1],
                                    opacity: [0.4, 1, 0.4],
                                }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: 'easeInOut',
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-light italic tracking-wider text-[var(--text-secondary)] opacity-70">
                        Adecos đang suy nghĩ…
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default ThinkingIndicator;
