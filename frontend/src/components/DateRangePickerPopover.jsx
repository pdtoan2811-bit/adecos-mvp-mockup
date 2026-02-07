import React, { useState, useMemo, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    startOfToday,
    startOfYesterday,
    endOfYesterday,
    subDays,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    subMonths,
} from 'date-fns';

/**
 * DateRangePickerPopover
 *
 * Lightweight date range picker using react-datepicker, styled to mimic
 * Google Ads-like custom range selector with presets on the left.
 */
const DateRangePickerPopover = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const initialStart = value?.startDate ? new Date(value.startDate) : startOfToday();
    const initialEnd = value?.endDate ? new Date(value.endDate) : startOfToday();

    const [draftRange, setDraftRange] = useState([initialStart, initialEnd]);
    const [appliedRange, setAppliedRange] = useState([initialStart, initialEnd]);

    const containerRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setDraftRange(appliedRange);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen, appliedRange]);

    const formattedLabel = useMemo(() => {
        const [start, end] = appliedRange;
        const toStr = (d) =>
            d.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        return `${toStr(start)} - ${toStr(end)}`;
    }, [appliedRange]);

    const presetRanges = useMemo(() => {
        const today = startOfToday();
        const yesterdayStart = startOfYesterday();
        const yesterdayEnd = endOfYesterday();

        const last7Start = subDays(today, 6);
        const last30Start = subDays(today, 29);

        const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
        const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });

        const thisMonthStart = startOfMonth(today);
        const thisMonthEnd = endOfMonth(today);

        const lastMonthBase = subMonths(today, 1);
        const lastMonthStart = startOfMonth(lastMonthBase);
        const lastMonthEnd = endOfMonth(lastMonthBase);

        return [
            { id: 'today', label: 'Hôm nay', range: [today, today] },
            { id: 'yesterday', label: 'Hôm qua', range: [yesterdayStart, yesterdayEnd] },
            { id: 'this_week', label: 'Tuần này (Thứ 2 – CN)', range: [thisWeekStart, thisWeekEnd] },
            { id: 'last7', label: '7 ngày qua', range: [last7Start, today] },
            { id: 'last14', label: '14 ngày qua', range: [subDays(today, 13), today] },
            { id: 'last30', label: '30 ngày qua', range: [last30Start, today] },
            { id: 'this_month', label: 'Tháng này', range: [thisMonthStart, thisMonthEnd] },
            { id: 'last_month', label: 'Tháng trước', range: [lastMonthStart, lastMonthEnd] },
        ];
    }, []);

    const applyRange = (range) => {
        setDraftRange(range);
        setAppliedRange(range);
        if (onChange) {
            onChange({ startDate: range[0], endDate: range[1] });
        }
    };

    const handleApply = () => {
        applyRange(draftRange);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setDraftRange(appliedRange);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen((o) => !o)}
                className="px-3 py-1.5 border border-[var(--border-color)] rounded-sm text-xs text-[var(--text-primary)] bg-[var(--bg-primary)] hover:bg-[var(--bg-surface)] flex items-center gap-2"
            >
                <span>{formattedLabel}</span>
                <span role="img" aria-label="calendar">
                    📅
                </span>
            </button>

            {isOpen && (
                <>
                    <style>{`
                        .date-range-picker-popover-calendar .react-datepicker {
                            background: var(--bg-surface);
                            border-color: var(--border-color);
                            color: var(--text-primary);
                            font-family: var(--font-sans);
                        }
                        .date-range-picker-popover-calendar .react-datepicker__header {
                            background: var(--bg-primary);
                            border-bottom-color: var(--border-color);
                        }
                        .date-range-picker-popover-calendar .react-datepicker__current-month,
                        .date-range-picker-popover-calendar .react-datepicker__day-name {
                            color: var(--text-primary);
                        }
                        .date-range-picker-popover-calendar .react-datepicker__day {
                            color: var(--text-secondary);
                        }
                        .date-range-picker-popover-calendar .react-datepicker__day:hover {
                            background: var(--bg-hover);
                            color: var(--text-primary);
                        }
                        .date-range-picker-popover-calendar .react-datepicker__day--selected,
                        .date-range-picker-popover-calendar .react-datepicker__day--in-range {
                            background: var(--text-primary);
                            color: var(--bg-primary);
                        }
                        .date-range-picker-popover-calendar .react-datepicker__day--keyboard-selected {
                            background: var(--bg-hover);
                            color: var(--text-primary);
                        }
                        .date-range-picker-popover-calendar .react-datepicker__navigation-icon::before {
                            border-color: var(--text-secondary);
                        }
                    `}</style>
                <div className="absolute right-0 mt-2 z-30 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-sm shadow-lg flex">
                    {/* Presets */}
                    <div className="w-48 border-r border-[var(--border-color)] text-xs">
                        <div className="px-4 py-3 border-b border-[var(--border-color)] font-medium text-[var(--text-primary)]">
                            Tùy chỉnh
                        </div>
                        <div className="max-h-[260px] overflow-y-auto py-2">
                            {presetRanges.map((preset) => (
                                <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => applyRange(preset.range)}
                                    className="w-full text-left px-4 py-1.5 hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Calendar: w-max so flex child doesn't grow and leave blank space on the right */}
                    <div className="date-range-picker-popover-calendar p-3 text-xs w-max">
                        <DatePicker
                            selectsRange
                            startDate={draftRange[0]}
                            endDate={draftRange[1]}
                            onChange={(update) => {
                                const [start, end] = update;
                                setDraftRange([start || draftRange[0], end || draftRange[1]]);
                            }}
                            inline
                            monthsShown={2}
                        />
                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-3 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleApply}
                                className="px-3 py-1 text-xs bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-sm hover:opacity-90"
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </div>
                </>
            )}
        </div>
    );
};

export default DateRangePickerPopover;

