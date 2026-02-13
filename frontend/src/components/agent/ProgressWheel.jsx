import React, { useEffect, useState, useRef } from 'react';

/**
 * ProgressWheel — Circular SVG progress indicator that auto-fills over a given duration.
 * Used alongside skeleton loaders to show loading progress during onboarding.
 */
const ProgressWheel = ({ duration = 1500, size = 28, strokeWidth = 2.5 }) => {
    const [progress, setProgress] = useState(0);
    const startTimeRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        startTimeRef.current = performance.now();

        const animate = (now) => {
            const elapsed = now - startTimeRef.current;
            const pct = Math.min(elapsed / duration, 1);
            // Ease-out cubic for a natural feeling
            const eased = 1 - Math.pow(1 - pct, 3);
            setProgress(eased);

            if (pct < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [duration]);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - progress);

    return (
        <div className="inline-flex items-center gap-2">
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="progress-wheel"
                style={{ transform: 'rotate(-90deg)' }}
            >
                {/* Background track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth={strokeWidth}
                    opacity={0.3}
                />
                {/* Progress fill */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--text-secondary)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{ transition: 'stroke-dashoffset 60ms linear' }}
                />
            </svg>
            <span className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] opacity-60 font-sans">
                {Math.round(progress * 100)}%
            </span>
        </div>
    );
};

export default ProgressWheel;
