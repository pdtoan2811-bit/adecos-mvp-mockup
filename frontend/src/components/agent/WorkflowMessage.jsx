import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChartMessage from './ChartMessage';
import ResultsTable from '../ResultsTable';
import TodoList from '../workflow/TodoList';
import ApprovalPanel from '../workflow/ApprovalPanel';

/**
 * WorkflowMessage - Master component for AI workflow responses
 * 
 * Renders complete workflow with:
 * - Data analysis sections (charts, tables, narratives)
 * - AI-generated to-do list
 * - Approval panel for workflow management
 */
const WorkflowMessage = ({ content, context, onSaveExperiment }) => {
    const {
        sections = [],
        todoItems = [],
        workflowId = Date.now().toString(),
        title = "AI Workflow Analysis"
    } = content;

    const [items, setItems] = useState(todoItems);
    const [workflowStatus, setWorkflowStatus] = useState('draft');
    const [isRevising, setIsRevising] = useState(false);

    const completedCount = items.filter(item => item.completed).length;

    // Handle workflow approval
    const handleApprove = async () => {
        setWorkflowStatus('approved');

        // Save to experiments (localStorage for mock)
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

        // Dispatch custom event for same-tab listeners (ExperimentsPage)
        window.dispatchEvent(new CustomEvent('experimentAdded'));

        // Trigger callback if provided
        if (onSaveExperiment) {
            onSaveExperiment(experiment);
        }

        return experiment;
    };

    // Handle revision request
    const handleRequestRevision = async () => {
        setIsRevising(true);

        // Simulate AI revision (in real app, this would call the agent)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock: Add some revisions to items
        const revisedItems = items.map((item, idx) => ({
            ...item,
            text: idx === 0 ? item.text + " (revised with more specific metrics)" : item.text,
        }));

        setItems(revisedItems);
        setIsRevising(false);
    };

    // Handle dismiss
    const handleDismiss = () => {
        setWorkflowStatus('dismissed');
    };

    // Markdown components for narrative sections
    const markdownComponents = {
        p: ({ node, ...props }) => (
            <p className="mb-4 text-[var(--text-primary)] text-lg leading-relaxed font-light tracking-wide" {...props} />
        ),
        h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-serif mb-4 text-[var(--text-primary)] tracking-tight" {...props} />
        ),
        h2: ({ node, ...props }) => (
            <h2 className="text-xl font-serif mb-3 mt-6 text-[var(--text-primary)] tracking-tight" {...props} />
        ),
        h3: ({ node, ...props }) => (
            <h3 className="text-lg font-serif mb-2 mt-4 text-[var(--text-primary)] tracking-wide" {...props} />
        ),
        strong: ({ node, ...props }) => (
            <strong className="text-[var(--text-primary)] font-medium" {...props} />
        ),
        em: ({ node, ...props }) => (
            <em className="text-[var(--text-secondary)] italic" {...props} />
        ),
        ul: ({ node, ...props }) => (
            <ul className="list-none space-y-2 mb-4 ml-0" {...props} />
        ),
        li: ({ node, children, ...props }) => (
            <li className="text-[var(--text-primary)] text-base leading-relaxed pl-6 relative before:content-['▸'] before:absolute before:left-0 before:text-[var(--text-secondary)] before:opacity-50" {...props}>
                {children}
            </li>
        ),
    };

    // Render sections
    const renderSection = (section, index) => {
        switch (section.type) {
            case 'narrative':
                return (
                    <div key={index} className="mb-6">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                        >
                            {typeof section.content === 'string'
                                ? section.content
                                : JSON.stringify(section.content)}
                        </ReactMarkdown>
                    </div>
                );

            case 'chart':
                return (
                    <div key={index} className="mb-6">
                        <ChartMessage content={section.content} />
                    </div>
                );

            case 'table':
                return (
                    <div key={index} className="mb-6">
                        <ResultsTable data={section.content} />
                    </div>
                );

            case 'comparison':
                return (
                    <div key={index} className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {section.content.items?.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-lg border ${item.highlight
                                        ? 'border-green-500/30 bg-green-500/5'
                                        : 'border-[var(--border-color)] bg-[var(--bg-card)]'
                                        }`}
                                >
                                    <div className="text-sm text-[var(--text-secondary)] mb-2">{item.label}</div>
                                    <div className="text-2xl font-serif text-[var(--text-primary)]">{item.value}</div>
                                    {item.change && (
                                        <div className={`text-sm mt-1 ${item.change > 0 ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {item.change > 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'insight':
                return (
                    <div key={index} className="mb-6 p-4 border-l-4 border-blue-500 bg-blue-500/5 rounded-r-lg">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <div>
                                <div className="text-sm font-medium text-blue-500 mb-1">AI Insight</div>
                                <div className="text-[var(--text-primary)]">
                                    {typeof section.content === 'string' ? section.content : section.content.text}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (workflowStatus === 'dismissed') {
        return (
            <div className="w-full my-4 p-4 border border-[var(--border-color)] rounded-lg text-center text-[var(--text-secondary)]">
                Workflow dismissed
            </div>
        );
    }

    return (
        <div className="w-full fade-in-up">
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                                    flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-[var(--text-primary)]">{title}</h2>
                        <p className="text-xs text-[var(--text-secondary)]">
                            AI-generated workflow • {items.length} action items
                        </p>
                    </div>
                </div>
            </div>

            {/* Revision Indicator */}
            {isRevising && (
                <div className="mb-6 p-4 border border-blue-500/30 bg-blue-500/10 rounded-lg flex items-center gap-3">
                    <div className="w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                    <span className="text-blue-500">AI is revising the workflow based on your feedback...</span>
                </div>
            )}

            {/* Analysis Sections */}
            <div className="px-4 md:px-0">
                {sections.map((section, index) => renderSection(section, index))}
            </div>

            {/* To-Do List */}
            {items.length > 0 && (
                <div className="mt-8 mb-20 p-6 border border-[var(--border-color)] rounded-xl bg-[var(--bg-card)]">
                    <TodoList
                        items={items}
                        onUpdateItems={setItems}
                        onReviseAll={handleRequestRevision}
                        title="Recommended Actions"
                    />
                </div>
            )}

            {/* Approval Panel */}
            {items.length > 0 && workflowStatus !== 'dismissed' && (
                <ApprovalPanel
                    workflowId={workflowId}
                    todoCount={items.length}
                    completedCount={completedCount}
                    onApprove={handleApprove}
                    onRequestRevision={handleRequestRevision}
                    onDismiss={handleDismiss}
                    status={workflowStatus}
                />
            )}
        </div>
    );
};

export default WorkflowMessage;
