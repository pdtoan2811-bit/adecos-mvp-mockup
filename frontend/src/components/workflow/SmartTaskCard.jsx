import React, { useState } from 'react';

/**
 * SmartTaskCard - Compact task card with SMART goal framework
 * 
 * Features:
 * - Expandable SMART properties
 * - Trade-off visualization
 * - Inline editing
 * - Execution steps preview
 */
const SmartTaskCard = ({ task, onUpdate, onToggle, isExpanded, onExpand }) => {
    const [isEditing, setIsEditing] = useState(null); // which SMART field is being edited
    const [editValue, setEditValue] = useState('');

    const {
        id,
        text,
        completed = false,
        priority = 'medium',
        smart = {
            specific: text,
            measurable: '',
            achievable: '',
            relevant: '',
            timeBound: '',
            tradeoffs: []
        }
    } = task;

    const priorityColors = {
        high: 'bg-red-500/20 text-red-400 border-red-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        low: 'bg-green-500/20 text-green-400 border-green-500/30'
    };

    const smartLabels = {
        specific: { letter: 'S', label: 'Specific', icon: '🎯', placeholder: 'What exactly needs to be done?' },
        measurable: { letter: 'M', label: 'Measurable', icon: '📊', placeholder: 'How will you measure success?' },
        achievable: { letter: 'A', label: 'Achievable', icon: '✅', placeholder: 'Resources, constraints, risks?' },
        relevant: { letter: 'R', label: 'Relevant', icon: '🔗', placeholder: 'How does this align with goals?' },
        timeBound: { letter: 'T', label: 'Time-bound', icon: '⏰', placeholder: 'Deadline and milestones?' }
    };

    const handleSmartEdit = (field, value) => {
        onUpdate(id, {
            ...task,
            smart: { ...smart, [field]: value }
        });
        setIsEditing(null);
    };

    const getSmartCompleteness = () => {
        const fields = ['specific', 'measurable', 'achievable', 'relevant', 'timeBound'];
        const filled = fields.filter(f => smart[f] && smart[f].trim()).length;
        return Math.round((filled / fields.length) * 100);
    };

    const smartCompleteness = getSmartCompleteness();

    return (
        <div className={`border rounded-lg transition-all duration-300 ${completed
            ? 'border-[var(--border-color)] bg-[var(--bg-card)] opacity-60'
            : isExpanded
                ? 'border-[var(--border-hover)] bg-[var(--bg-card)]'
                : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]'
            }`}>
            {/* Compact Header */}
            <div
                className="flex items-center gap-3 p-3 cursor-pointer"
                onClick={() => onExpand(isExpanded ? null : id)}
            >
                {/* Checkbox */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(id);
                    }}
                    className={`w-5 h-5 rounded border-2 flex-shrink-0 transition-all
                               flex items-center justify-center ${completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-[var(--border-hover)] hover:border-[var(--text-secondary)]'
                        }`}
                >
                    {completed && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </button>

                {/* Task Text */}
                <span className={`flex-1 text-sm ${completed ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                    {text}
                </span>

                {/* SMART Progress Dots */}
                <div className="flex gap-0.5">
                    {Object.keys(smartLabels).map(key => (
                        <div
                            key={key}
                            className={`w-1.5 h-1.5 rounded-full ${smart[key] && smart[key].trim()
                                ? 'bg-green-500'
                                : 'bg-[var(--border-color)]'
                                }`}
                            title={`${smartLabels[key].label}: ${smart[key] || 'Not set'}`}
                        />
                    ))}
                </div>

                {/* Priority Badge */}
                <span className={`px-1.5 py-0.5 text-[10px] font-medium uppercase rounded border ${priorityColors[priority]}`}>
                    {priority[0]}
                </span>

                {/* Expand Arrow */}
                <svg
                    className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Expanded SMART Detail */}
            {isExpanded && (
                <div className="border-t border-[var(--border-color)] p-3 space-y-2">
                    {/* SMART Progress Bar */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] uppercase text-[var(--text-secondary)]">SMART</span>
                        <div className="flex-1 h-1 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
                                style={{ width: `${smartCompleteness}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-[var(--text-secondary)]">{smartCompleteness}%</span>
                    </div>

                    {/* SMART Fields */}
                    <div className="grid grid-cols-1 gap-1.5">
                        {Object.entries(smartLabels).map(([key, config]) => (
                            <div
                                key={key}
                                className="flex items-start gap-2 group"
                            >
                                <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${smart[key] && smart[key].trim()
                                    ? 'bg-green-500/20 text-green-500'
                                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                                    }`}>
                                    {config.letter}
                                </div>

                                {isEditing === key ? (
                                    <input
                                        type="text"
                                        autoFocus
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onBlur={() => handleSmartEdit(key, editValue)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSmartEdit(key, editValue);
                                            if (e.key === 'Escape') setIsEditing(null);
                                        }}
                                        placeholder={config.placeholder}
                                        className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-hover)] rounded px-2 py-1 text-xs text-[var(--text-primary)]
                                                   placeholder-[var(--text-secondary)] placeholder:opacity-50 focus:outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    <div
                                        className="flex-1 text-xs cursor-pointer group-hover:bg-[var(--bg-hover)] rounded px-2 py-1 -mx-2"
                                        onClick={() => {
                                            setEditValue(smart[key] || '');
                                            setIsEditing(key);
                                        }}
                                    >
                                        {smart[key] ? (
                                            <span className="text-[var(--text-primary)]">{smart[key]}</span>
                                        ) : (
                                            <span className="text-[var(--text-secondary)] italic opacity-50">{config.placeholder}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Trade-offs Section */}
                    {smart.tradeoffs && smart.tradeoffs.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                            <div className="text-[10px] uppercase text-[var(--text-secondary)] mb-2">Trade-offs</div>
                            <div className="space-y-1.5">
                                {smart.tradeoffs.map((tradeoff, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs">
                                        <span className="text-[var(--text-secondary)]">{tradeoff.option1}</span>
                                        <div className="flex-1 h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden relative">
                                            <div
                                                className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-transparent"
                                                style={{ width: `${tradeoff.balance || 50}%` }}
                                            />
                                        </div>
                                        <span className="text-[var(--text-secondary)]">{tradeoff.option2}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex gap-2 mt-3 pt-2 border-t border-[var(--border-color)]">
                        <button
                            className="px-2 py-1 text-[10px] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] rounded transition-colors text-[var(--text-secondary)]"
                            onClick={() => {
                                // Mock: Add AI suggestion
                                const suggestions = {
                                    specific: `Optimize ${text.toLowerCase()} using data-driven approach`,
                                    measurable: 'Increase conversion by 15% within 2 weeks',
                                    achievable: 'Budget available, team has capacity',
                                    relevant: 'Aligns with Q1 growth targets',
                                    timeBound: 'Complete by end of next week'
                                };
                                onUpdate(id, { ...task, smart: { ...smart, ...suggestions } });
                            }}
                        >
                            ✨ AI Fill
                        </button>
                        <button
                            className="px-2 py-1 text-[10px] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] rounded transition-colors text-[var(--text-secondary)]"
                            onClick={() => onUpdate(id, {
                                ...task,
                                smart: {
                                    ...smart,
                                    tradeoffs: [...(smart.tradeoffs || []), { option1: 'Speed', option2: 'Quality', balance: 50 }]
                                }
                            })}
                        >
                            ⚖️ Add Trade-off
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartTaskCard;
