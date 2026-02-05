import React, { useState } from 'react';
import SmartTaskCard from '../workflow/SmartTaskCard';

/**
 * CompactWorkflowMessage - Redesigned workflow for 13" displays
 * 
 * Features:
 * - 2-column layout (data | actions)
 * - No scrolling needed
 * - SMART task management
 * - Inline approval
 */
const CompactWorkflowMessage = ({ content, context, onSaveExperiment }) => {
    const {
        sections = [],
        todoItems = [],
        workflowId = Date.now().toString(),
        title = "AI Workflow Analysis"
    } = content;

    const [items, setItems] = useState(todoItems.map(item => ({
        ...item,
        smart: item.smart || {
            specific: item.text,
            measurable: '',
            achievable: '',
            relevant: '',
            timeBound: '',
            tradeoffs: []
        }
    })));
    const [workflowStatus, setWorkflowStatus] = useState('draft');
    const [expandedTask, setExpandedTask] = useState(null);
    const [isRevising, setIsRevising] = useState(false);

    const completedCount = items.filter(item => item.completed).length;
    const progress = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

    // Extract key metrics from sections
    const getKeyMetrics = () => {
        const chartSection = sections.find(s => s.type === 'chart');
        const insightSection = sections.find(s => s.type === 'insight');
        return { chartSection, insightSection };
    };

    const { chartSection, insightSection } = getKeyMetrics();

    // Handle task toggle
    const handleToggle = (id) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    // Handle task update
    const handleUpdateTask = (id, updates) => {
        setItems(prev => prev.map(item =>
            item.id === id ? updates : item
        ));
    };

    // Handle approval
    const handleApprove = async () => {
        setWorkflowStatus('approved');

        const experiment = {
            id: workflowId,
            title: title,
            createdAt: new Date().toISOString(),
            status: 'running',
            todoItems: items,
            context: context,
            sections: sections,
        };

        const existing = JSON.parse(localStorage.getItem('experiments') || '[]');
        localStorage.setItem('experiments', JSON.stringify([experiment, ...existing]));
        window.dispatchEvent(new CustomEvent('experimentAdded'));

        if (onSaveExperiment) {
            onSaveExperiment(experiment);
        }
    };

    // Handle revision
    const handleRevise = async () => {
        setIsRevising(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock AI revision - fill SMART fields
        setItems(prev => prev.map((item, idx) => ({
            ...item,
            smart: {
                specific: item.text,
                measurable: `Improve by ${15 + idx * 5}% within 7 days`,
                achievable: 'Resources available, no blockers',
                relevant: 'Aligns with campaign optimization goals',
                timeBound: `Due: ${new Date(Date.now() + (7 + idx * 3) * 86400000).toLocaleDateString()}`,
                tradeoffs: [{ option1: 'Speed', option2: 'Accuracy', balance: 60 }]
            }
        })));

        setIsRevising(false);
    };

    if (workflowStatus === 'dismissed') {
        return (
            <div className="p-4 border border-[var(--border-color)] rounded-lg text-center text-[var(--text-secondary)] text-sm">
                Workflow dismissed
            </div>
        );
    }

    return (
        <div className="w-full border border-[var(--border-color)] rounded-xl bg-[var(--bg-card)] overflow-hidden">
            {/* Header - Single Line */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 
                                    flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-[var(--text-primary)]">{title}</h3>
                        <span className="text-[10px] text-[var(--text-secondary)]">{items.length} tasks • SMART framework</span>
                    </div>
                </div>

                <span className={`px-2 py-1 text-[10px] font-medium uppercase rounded ${workflowStatus === 'approved'
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                    }`}>
                    {workflowStatus}
                </span>
            </div>

            {/* Main Content - 2 Columns */}
            <div className="flex" style={{ maxHeight: '400px' }}>
                {/* Left: Data Insights (40%) */}
                <div className="w-2/5 border-r border-[var(--border-color)] p-4 overflow-y-auto">
                    {/* Mini Chart Preview */}
                    {chartSection && (
                        <div className="mb-4">
                            <div className="text-[10px] uppercase text-[var(--text-secondary)] mb-2">Performance</div>
                            <div className="h-20 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-lg 
                                            flex items-center justify-center border border-[var(--border-color)]">
                                <div className="flex items-end gap-1 h-12">
                                    {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
                                        <div
                                            key={i}
                                            className="w-3 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                                            style={{ height: `${h}%` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="p-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg">
                            <div className="text-lg font-serif text-[var(--text-primary)]">2.8x</div>
                            <div className="text-[10px] text-[var(--text-secondary)]">ROAS</div>
                        </div>
                        <div className="p-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg">
                            <div className="text-lg font-serif text-green-500">+15%</div>
                            <div className="text-[10px] text-[var(--text-secondary)]">vs Last Week</div>
                        </div>
                    </div>

                    {/* AI Insight */}
                    {insightSection && (
                        <div className="p-3 border-l-2 border-blue-500 bg-blue-500/5 rounded-r-lg">
                            <div className="text-[10px] text-blue-500 mb-1">💡 AI Insight</div>
                            <p className="text-xs text-[var(--text-primary)] line-clamp-3">
                                {typeof insightSection.content === 'string'
                                    ? insightSection.content
                                    : insightSection.content.text || 'Optimization opportunities identified.'}
                            </p>
                        </div>
                    )}

                    {!insightSection && (
                        <div className="p-3 border-l-2 border-blue-500 bg-blue-500/5 rounded-r-lg">
                            <div className="text-[10px] text-blue-500 mb-1">💡 AI Insight</div>
                            <p className="text-xs text-[var(--text-primary)]">
                                Campaign "Summer Sale" performing 40% above average.
                                Recommend increasing budget allocation.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right: Action Items (60%) */}
                <div className="w-3/5 p-4 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase text-[var(--text-secondary)]">Action Items</span>
                        <button
                            onClick={handleRevise}
                            disabled={isRevising}
                            className="px-2 py-1 text-[10px] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] rounded 
                                       transition-colors text-[var(--text-secondary)] disabled:opacity-50"
                        >
                            {isRevising ? '⏳ Revising...' : '✨ AI Fill All'}
                        </button>
                    </div>

                    <div className="space-y-2">
                        {items.map(item => (
                            <SmartTaskCard
                                key={item.id}
                                task={item}
                                onUpdate={handleUpdateTask}
                                onToggle={handleToggle}
                                isExpanded={expandedTask === item.id}
                                onExpand={setExpandedTask}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer - Approval Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-color)] bg-[var(--bg-surface)]">
                <div className="flex items-center gap-4">
                    {/* Progress */}
                    <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-[var(--text-secondary)]">{completedCount}/{items.length}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setWorkflowStatus('dismissed')}
                        className="px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={handleRevise}
                        disabled={isRevising}
                        className="px-3 py-1.5 text-xs border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg
                                   hover:bg-[var(--bg-hover)] transition-colors disabled:opacity-50"
                    >
                        Request Revision
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={workflowStatus === 'approved'}
                        className="px-4 py-1.5 text-xs bg-green-500/20 text-green-400 border border-green-500/30
                                   rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50
                                   flex items-center gap-1"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {workflowStatus === 'approved' ? 'Approved' : 'Approve & Execute'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompactWorkflowMessage;
