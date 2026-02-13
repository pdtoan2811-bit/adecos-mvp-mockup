import React from 'react'; // Trigger HMR

import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { bentoTiles } from '../../data/bentoGridData';

const colorMap = {
    blue: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.20)', accent: '#3B82F6', glow: 'rgba(59,130,246,0.15)' },
    purple: { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.20)', accent: '#8B5CF6', glow: 'rgba(139,92,246,0.15)' },
    emerald: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.20)', accent: '#10B981', glow: 'rgba(16,185,129,0.15)' },
    orange: { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.20)', accent: '#F97316', glow: 'rgba(249,115,22,0.15)' },
    sky: { bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.20)', accent: '#0EA5E9', glow: 'rgba(14,165,233,0.15)' },
    rose: { bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.20)', accent: '#F43F5E', glow: 'rgba(244,63,94,0.15)' },
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.15,
        }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3 }
    }
};

const tileVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 24,
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
};


const BentoTile = ({ tile, onStartResearch }) => {
    const colors = colorMap[tile.color] || colorMap.blue;
    const isComingSoon = tile.status === 'coming_soon';
    const isPrimary = tile.priority === 'primary';

    // CSS Variables for dynamic coloring on hover
    const tileStyle = {
        '--tile-accent': colors.accent,
        '--tile-bg': colors.bg,
        '--tile-border': colors.border,
        '--tile-glow': colors.glow,
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
    };

    const renderCTA = () => {
        const primaryStyle = {
            backgroundColor: 'var(--text-primary)',
            color: 'var(--bg-primary)',
        };
        // Secondary buttons now use CSS vars for hover effects mostly, but we can keep inline styles for the "active" colored state if needed.
        // To stick to the "minimal default" rule, we'll use standard classes for the default state.

        const baseClass = "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg";

        const arrow = (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" />
            </svg>
        );

        // For primary/special actions, we might want to keep them distinct or also minimize them?
        // Let's keep Primary CTA as is (solid), but make Secondary (Outline) minimal.

        if (tile.ctaAction === 'immersive_input') {
            return (
                <button onClick={onStartResearch} className={baseClass} style={primaryStyle}>
                    {tile.ctaText} {arrow}
                </button>
            );
        }

        if (tile.ctaNavigate) {
            return (
                <Link to={tile.ctaNavigate} className={baseClass} style={primaryStyle}>
                    {tile.ctaText} {arrow}
                </Link>
            );
        }

        // Secondary / External Link
        // Default: Neutral border/text. Hover: Colored border/text.
        return (
            <a
                href={tile.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseClass} border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--tile-accent)] hover:border-[var(--tile-accent)] bg-transparent`}
            >
                {tile.ctaText} {arrow}
            </a>
        );
    };

    return (
        <motion.div
            variants={tileVariants}
            className={`bento-tile group relative overflow-hidden rounded-2xl border backdrop-blur-sm h-full flex flex-col transition-colors duration-300 ${tile.className || ''}`}
            style={tileStyle}
            whileHover={{
                scale: 1.02,
                borderColor: colors.border,
                boxShadow: `0 8px 32px ${colors.glow}, 0 2px 8px rgba(0,0,0,0.2)`,
                transition: { duration: 0.3, ease: 'easeOut' }
            }}
        >
            {/* Background gradient on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at top left, ${colors.bg}, transparent 70%)`
                }}
            />

            {/* Decorative corner glow */}
            <div
                className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity duration-700"
                style={{ backgroundColor: colors.glow }}
            />

            {/* Content */}
            <div className="relative z-10 p-6 md:p-8 flex flex-col h-full">
                {/* Top row: icon + badge */}
                <div className="flex items-start justify-between mb-4">
                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl transition-all duration-300 group-hover:scale-110 bg-[var(--bg-surface)] text-[var(--text-secondary)] group-hover:bg-[var(--tile-bg)] group-hover:text-[var(--tile-accent)]"
                    >
                        {tile.icon}
                    </div>

                    <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border transition-colors duration-300 ${isComingSoon
                            ? 'text-[var(--text-tertiary)] bg-[var(--bg-surface)] border-[var(--border-color)] group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20'
                            : 'text-[var(--text-tertiary)] bg-[var(--bg-surface)] border-[var(--border-color)] group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20'
                            }`}
                    >
                        {isComingSoon ? '✨ Coming Soon' : '● Available'}
                    </span>
                </div>

                {/* Title */}
                <h3 className={`font-serif text-[var(--text-primary)] mb-1 tracking-tight transition-colors duration-300 ${isPrimary ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}`}>
                    {tile.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-3 opacity-60">
                    {tile.subtitle}
                </p>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 flex-grow">
                    {tile.description}
                </p>

                {/* Highlights */}
                {tile.highlights && tile.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                        {tile.highlights.map((h, i) => (
                            <span
                                key={i}
                                className="text-[11px] px-2.5 py-1 rounded-full border font-medium transition-colors duration-300 text-[var(--text-secondary)] border-[var(--border-color)] bg-[var(--bg-surface)] group-hover:border-[var(--tile-border)] group-hover:text-[var(--tile-accent)] group-hover:bg-[var(--tile-bg)]"
                            >
                                {h}
                            </span>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-auto">
                    {renderCTA()}
                </div>
            </div>
        </motion.div>
    );
};

const BentoFeatureGrid = ({ onReplayDemo, onStartResearch, isEmbedded = false }) => {
    return (
        <motion.div
            key="bento-grid"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={containerVariants}
            className={`w-full ${isEmbedded ? 'px-0 py-2' : 'px-4 md:px-8 py-8'}`}
        >
            {/* Header - Only show if not embedded in chat as a message */}
            {!isEmbedded && (
                <motion.div
                    variants={tileVariants}
                    className="mb-8 flex items-end justify-between"
                >
                    <div>
                        <h2 className="text-2xl md:text-3xl font-serif text-[var(--text-primary)] tracking-tight mb-1">
                            Tổng quan tính năng
                        </h2>
                        <p className="text-sm text-[var(--text-secondary)] opacity-70">
                            Khám phá tất cả công cụ Adecos AI dành cho Affiliate Marketers
                        </p>
                    </div>
                    {onReplayDemo && (
                        <button
                            onClick={onReplayDemo}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 4v6h6" />
                                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                            </svg>
                            Xem lại Demo
                        </button>
                    )}
                </motion.div>
            )}

            {/* Bento Grid */}
            <div className="bento-grid">
                {bentoTiles && bentoTiles.length > 0 ? (
                    bentoTiles.map((tile) => (
                        <BentoTile
                            key={tile.id}
                            tile={tile}
                            onStartResearch={onStartResearch}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 text-[var(--text-secondary)]">
                        Loading features...
                    </div>
                )}
            </div>

        </motion.div>
    );
};

export default BentoFeatureGrid;
