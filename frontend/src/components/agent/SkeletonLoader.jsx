import React from 'react';

/**
 * SkeletonLoader — Placeholder loading component for tables and charts.
 * Matches the dimensions and structure of real components for seamless swap.
 */
const SkeletonLoader = ({ variant = 'table' }) => {
    if (variant === 'table') {
        return (
            <div className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden">
                {/* Table header skeleton */}
                <div className="flex gap-4 px-6 py-4 border-b border-[var(--border-color)]">
                    {[120, 80, 60, 90, 70, 100].map((w, i) => (
                        <div
                            key={i}
                            className="skeleton-shimmer rounded"
                            style={{ width: w, height: 14 }}
                        />
                    ))}
                </div>
                {/* Table rows skeleton */}
                {Array.from({ length: 5 }).map((_, rowIdx) => (
                    <div
                        key={rowIdx}
                        className="flex gap-4 px-6 py-4 border-b border-[var(--border-color)] last:border-b-0"
                    >
                        {[120, 80, 60, 90, 70, 100].map((w, colIdx) => (
                            <div
                                key={colIdx}
                                className="skeleton-shimmer rounded"
                                style={{
                                    width: w + (rowIdx % 3) * 10 - 5,
                                    height: 12,
                                    animationDelay: `${(rowIdx * 6 + colIdx) * 50}ms`
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    if (variant === 'chart') {
        return (
            <div className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6">
                {/* Chart title skeleton */}
                <div className="skeleton-shimmer rounded mb-6" style={{ width: 200, height: 16 }} />
                {/* Chart area skeleton */}
                <div className="relative w-full" style={{ height: 220 }}>
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="skeleton-shimmer rounded"
                                style={{ width: 30, height: 10, animationDelay: `${i * 80}ms` }}
                            />
                        ))}
                    </div>
                    {/* Chart bars / lines area */}
                    <div className="ml-10 h-full flex items-end gap-3 pb-8">
                        {[65, 45, 80, 55, 70, 40, 60].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 skeleton-shimmer rounded-t"
                                style={{
                                    height: `${h}%`,
                                    animationDelay: `${i * 100}ms`
                                }}
                            />
                        ))}
                    </div>
                    {/* X-axis labels */}
                    <div className="absolute bottom-0 left-10 right-0 flex justify-between">
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="skeleton-shimmer rounded"
                                style={{ width: 36, height: 10, animationDelay: `${i * 60}ms` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default SkeletonLoader;
