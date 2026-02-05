import React from 'react';
import {
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from 'date-fns';

/**
 * ChartMessage - Dynamic chart rendering component for AI Agent responses
 * 
 * Supports: line, bar, pie charts with luxury aesthetic styling
 * Now includes Date Picker and visual sorting.
 */
const ChartMessage = ({ content, onContextUpdate }) => {
    const { chartType = 'area', title, data, config = {}, context = {} } = content;
    const [currentChartType, setCurrentChartType] = React.useState(chartType === 'area' ? 'pie' : chartType); // Default Area -> Pie
    const [dateRange, setDateRange] = React.useState({
        startDate: context?.filters?.dateRange?.start ? parseISO(context.filters.dateRange.start) : new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: context?.filters?.dateRange?.end ? parseISO(context.filters.dateRange.end) : new Date()
    });

    // Update state if prop changes
    React.useEffect(() => {
        // If backend explicitly says 'area', we prefer 'pie' now as per request
        setCurrentChartType(chartType === 'area' ? 'pie' : chartType);
    }, [chartType]);

    // Update date picker if context updates
    React.useEffect(() => {
        if (context?.filters?.dateRange?.start) {
            setDateRange({
                startDate: parseISO(context.filters.dateRange.start),
                endDate: parseISO(context.filters.dateRange.end)
            });
        }
    }, [context]);

    // Handle date change (Visual only for now, would trigger agent re-query in real app)
    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setDateRange({ startDate: start, endDate: end });
        // In a real app, this would callback to parent to re-trigger agent query
        // onContextUpdate({ timeRange: ... }) 
    };

    // Default chart configuration
    const {
        xAxis = 'date',
        series = [
            { dataKey: 'cost', name: 'Chi phí', color: '#ef4444' },
            { dataKey: 'revenue', name: 'Doanh thu', color: '#22c55e' }
        ],
        height = 300
    } = config;

    // Aggregation Logic for Pie Chart
    const getPieData = () => {
        if (!data || data.length === 0) return [];

        // If data is pivoted (granular), we sum up the series keys
        // If data is time-series, we sum up the metrics

        const pieData = series.map(s => {
            const total = data.reduce((sum, record) => sum + (record[s.dataKey] || 0), 0);
            return {
                name: s.name,
                value: total,
                color: s.color
            };
        });

        // Filter out zero values
        return pieData.filter(d => d.value > 0);
    };

    // Custom tooltip matching app aesthetic
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[var(--bg-overlay)] border border-[var(--border-color)] backdrop-blur-md p-4 rounded-sm shadow-xl">
                    <p className="text-[var(--text-primary)] text-sm font-mono mb-2">{label || payload[0].name}</p>
                    <div className="space-y-1 text-xs">
                        {payload.map((entry, index) => (
                            <div key={index} className="flex justify-between gap-4 items-center">
                                <span className="text-[var(--text-secondary)]">{entry.name}:</span>
                                <span
                                    className="font-mono font-bold"
                                    style={{ color: entry.color || entry.payload.fill }}
                                >
                                    {typeof entry.value === 'number'
                                        ? entry.value.toLocaleString()
                                        : entry.value}
                                    {entry.name.includes('Chi phí') || entry.name.includes('Doanh thu') ? ' ₫' : ''}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Render appropriate chart type
    const renderChart = () => {
        const commonProps = {
            data,
            margin: { top: 10, right: 30, left: 0, bottom: 0 }
        };

        const formatYAxis = (value) => {
            if (value === 0) return '0';
            if (value >= 1000000000) return `${parseFloat((value / 1000000000).toFixed(1))}B`;
            if (value >= 1000000) return `${parseFloat((value / 1000000).toFixed(1))}M`;
            if (value >= 1000) return `${parseFloat((value / 1000).toFixed(0))}k`;
            return value;
        };

        const axisStyle = {
            stroke: "var(--border-color)",
            style: { fontSize: '11px', fill: 'var(--text-secondary)' }
        };

        switch (currentChartType) {
            case 'pie':
                const pieData = getPieData();
                return (
                    <PieChart>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }}
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                        />
                        <Pie
                            data={pieData}
                            cx="40%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--bg-primary)" />
                            ))}
                        </Pie>
                    </PieChart>
                );

            case 'line':
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis dataKey={xAxis} {...axisStyle} tick={{ fill: 'var(--text-secondary)' }} />
                        <YAxis {...axisStyle} tickFormatter={formatYAxis} tick={{ fill: 'var(--text-secondary)' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{
                                paddingTop: '20px',
                                color: 'var(--text-secondary)'
                            }}
                        />
                        {series.map((s, idx) => (
                            <Line
                                key={idx}
                                type="monotone"
                                dataKey={s.dataKey}
                                name={s.name}
                                stroke={s.color}
                                strokeWidth={2}
                                dot={{ fill: s.color, r: 3 }}
                            />
                        ))}
                    </LineChart>
                );

            case 'bar':
            default:
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis dataKey={xAxis} {...axisStyle} tick={{ fill: 'var(--text-secondary)' }} />
                        <YAxis {...axisStyle} tickFormatter={formatYAxis} tick={{ fill: 'var(--text-secondary)' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{
                                paddingTop: '20px',
                                color: 'var(--text-secondary)'
                            }}
                        />
                        {series.map((s, idx) => (
                            <Bar
                                key={idx}
                                dataKey={s.dataKey}
                                name={s.name}
                                fill={s.color}
                                opacity={0.8}
                                radius={[2, 2, 0, 0]}
                            />
                        ))}
                    </BarChart>
                );
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className="w-full my-6 px-4 md:px-6">
                <div className="border border-[var(--border-color)] p-6 rounded-sm text-center text-[var(--text-secondary)]">
                    Không có dữ liệu để hiển thị
                </div>
            </div>
        );
    }

    return (
        <div className="w-full my-6 px-4 md:px-6 fade-in-up">
            <div className="border border-[var(--border-color)] p-6 rounded-sm bg-[var(--bg-surface)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex flex-col gap-1">
                        {title && (
                            <h3 className="text-sm font-serif text-[var(--text-primary)] uppercase tracking-wider">
                                {title}
                            </h3>
                        )}
                        {/* Custom Date Picker */}
                        <div className="custom-datepicker-wrapper">
                            <DatePicker
                                selectsRange={true}
                                startDate={dateRange.startDate}
                                endDate={dateRange.endDate}
                                onChange={(update) => handleDateChange(update)}
                                dateFormat="dd/MM/yyyy"
                                className="bg-transparent text-xs text-[var(--text-secondary)] border-none p-0 focus:ring-0 cursor-pointer w-48 font-mono hover:text-[var(--text-primary)] transition-colors"
                                placeholderText="Select date range"
                            />
                        </div>
                    </div>

                    {/* Chart Type Toggle */}
                    <div className="flex bg-[var(--bg-surface)] rounded-sm p-0.5 border border-[var(--border-color)]">
                        {['pie', 'line', 'bar'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setCurrentChartType(type)}
                                className={`
                                    px-3 py-1 text-[10px] uppercase font-bold tracking-wide rounded-xs transition-all
                                    ${currentChartType === type
                                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm'
                                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'}
                                `}
                            >
                                {type.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={height}>
                    {renderChart()}
                </ResponsiveContainer>

                <style jsx global>{`
                    .custom-datepicker-wrapper .react-datepicker-wrapper input {
                        background: transparent;
                        border: none;
                        color: var(--text-secondary);
                        font-family: monospace;
                        font-size: 0.75rem;
                        cursor: pointer;
                    }
                    .custom-datepicker-wrapper .react-datepicker-wrapper input:focus {
                        outline: none;
                        box-shadow: none;
                        color: var(--text-primary);
                    }
                    .react-datepicker {
                        background-color: var(--bg-primary) !important;
                        border-color: var(--border-color) !important;
                        font-family: inherit !important;
                    }
                    .react-datepicker__header {
                        background-color: var(--bg-surface) !important;
                        border-bottom-color: var(--border-color) !important;
                    }
                    .react-datepicker__current-month, .react-datepicker__day-name {
                        color: var(--text-primary) !important;
                    }
                    .react-datepicker__day {
                        color: var(--text-secondary) !important;
                    }
                    .react-datepicker__day:hover {
                        background-color: var(--bg-hover) !important;
                    }
                    .react-datepicker__day--selected, .react-datepicker__day--in-range {
                        background-color: var(--text-primary) !important;
                        color: var(--bg-primary) !important;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ChartMessage;
