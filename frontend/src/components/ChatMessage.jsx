import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ResultsTable from './ResultsTable';
import ChartMessage from './agent/ChartMessage';
import CompositeMessage from './agent/CompositeMessage';
import CompactWorkflowMessage from './agent/CompactWorkflowMessage';
import CampaignSelectionTable from './agent/CampaignSelectionTable';
import CommunityCard from './agent/CommunityCard';
import EmailCaptureMessage from './agent/EmailCaptureMessage';
import FeaturePreviewCard from './agent/FeaturePreviewCard';

import InteractiveFeatureReveal from './agent/InteractiveFeatureReveal';
import ResearchProgressMessage from './ResearchProgressMessage';

const ChatMessage = ({ message, onSearch }) => {
    const { role, type, content, context, actions } = message;
    const isUser = role === 'user';

    // DEBUG: Check why deep_research_progress is falling through
    if (type === 'deep_research_progress') {
        console.log('Rendering ResearchProgressMessage for:', content);
    } else if (typeof content === 'object' && content.taskId) {
        console.log('Missed deep_research_progress type! Actual type:', type);
    }

    // NEW: Handle Deep Research Progress
    if (type === 'deep_research_progress') {
        const taskId = typeof content === 'object' ? content.taskId : content;
        return (
            <div className="w-full my-4 px-4 md:px-0 fade-in-up">
                <div className="max-w-4xl mx-auto">
                    <ResearchProgressMessage taskId={taskId} />
                </div>
            </div>
        );
    }

    // Handle campaign selection for general queries
    if (type === 'campaign_selection') {
        return (
            <div className="w-full my-8 px-4 md:px-0 fade-in-up">
                <div className="max-w-4xl mx-auto">
                    <CampaignSelectionTable
                        campaigns={content.campaigns}
                        onSelect={(campaign) => {
                            // Trigger deep dive for the selected campaign
                            if (onSearch) {
                                onSearch(`Deep dive analysis for ${campaign.name}`);
                            }
                        }}
                    />
                </div>
            </div>
        );
    }

    // Handle workflow messages with compact SMART layout
    if (type === 'workflow') {
        return (
            <div className="w-full my-8 px-4 md:px-0 fade-in-up">
                <div className="max-w-4xl mx-auto">
                    <CompactWorkflowMessage content={content} context={context} />
                </div>
            </div>
        );
    }

    if (type === 'loading') {
        return (
            <div className="flex w-full justify-start my-4 px-4 md:px-0 fade-in-up">
                <div className="max-w-4xl mx-auto w-full">
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] px-6 py-4 rounded-3xl rounded-tl-sm backdrop-blur-md text-sm font-light italic tracking-wider animate-pulse flex items-center gap-2 w-fit">
                        <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full animate-bounce"></div>
                        Adecos đang phân tích...
                    </div>
                </div>
            </div>
        );
    }

    // NEW: Handle composite messages (narrative + chart/table)
    if (type === 'composite') {
        return (
            <div className="w-full my-8 px-4 md:px-0 fade-in-up">
                <div className="max-w-4xl mx-auto">
                    <CompositeMessage content={content} context={context} />
                </div>
            </div>
        );
    }

    // NEW: Handle Community Card
    if (type === 'community_card') {
        return (
            <CommunityCard />
        );
    }

    // NEW: Handle Email Capture
    if (type === 'email_capture') {
        return (
            <EmailCaptureMessage />
        );
    }

    // NEW: Handle Feature Preview
    if (type === 'feature_preview') {
        return (
            <div className="w-full my-8 px-4 md:px-0 fade-in-up">
                <div className="max-w-4xl mx-auto">
                    <FeaturePreviewCard content={content} />
                </div>
            </div>
        );
    }

    // NEW: Handle Interactive Feature Reveal
    if (type === 'interactive_feature') {
        return (
            <div className="w-full my-8 px-4 md:px-0 fade-in-up">
                <div className="max-w-4xl mx-auto">
                    <InteractiveFeatureReveal content={content} />
                </div>
            </div>
        );
    }

    // NEW: Handle Interactive Feature Reveal
    if (type === 'interactive_feature') {
        return (
            <div className="w-full my-8 px-4 md:px-0 fade-in-up">
                <div className="max-w-4xl mx-auto">
                    <InteractiveFeatureReveal content={content} />
                </div>
            </div>
        );
    }

    // NEW: Handle chart messages
    if (type === 'chart') {
        return (
            <div className="w-full my-8 px-4 md:px-0 fade-in-up">
                <div className="max-w-4xl mx-auto">
                    <ChartMessage content={content} />
                </div>
            </div>
        );
    }

    if (type === 'table') {
        // Safety check: ensure content is an array
        let tableData = content;

        // If content is a string, try to parse it as JSON
        if (typeof content === 'string') {
            try {
                tableData = JSON.parse(content);
            } catch (e) {
                console.error('Failed to parse table content:', e);
                // If it's still the full JSON response string, try to extract the array
                if (content.includes('"type": "table"')) {
                    try {
                        const fullParsed = JSON.parse(content);
                        tableData = fullParsed.content || [];
                    } catch (e2) {
                        console.error('Failed to parse full response:', e2);
                        tableData = [];
                    }
                } else {
                    tableData = [];
                }
            }
        }

        // Ensure it's an array
        if (!Array.isArray(tableData)) {
            tableData = [];
        }

        return (
            <div className="w-full my-8 px-4 md:px-0 fade-in-up">
                {/* Table Widget is always full width for better data viewing per user request */}
                <ResultsTable data={tableData} />
            </div>
        );
    }

    // User messages in chat bubble
    if (isUser) {
        return (
            <div className="flex w-full justify-end my-4 px-4 md:px-0">
                <div className="max-w-[85%] md:max-w-2xl px-6 py-4 rounded-3xl text-lg font-light leading-relaxed tracking-wide shadow-lg bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-tr-sm">
                    {content}
                </div>
            </div>
        );
    }

    // AI text explanations - full width, elegant layout
    return (
        <div className="w-full my-8 px-4 md:px-0 fade-in-up">
            <div className="max-w-4xl mx-auto">
                {/* Article-style layout for explanations - Text Only, No Bubble */}
                <div className="py-4 md:py-6">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            p: ({ node, ...props }) => (
                                <p className="mb-6 text-[var(--text-primary)] text-lg leading-relaxed font-light tracking-wide opacity-90" {...props} />
                            ),
                            h1: ({ node, ...props }) => (
                                <h1 className="text-3xl font-serif mb-6 text-[var(--text-primary)] tracking-tight" {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                                <h2 className="text-2xl font-serif mb-4 mt-8 text-[var(--text-primary)] tracking-tight" {...props} />
                            ),
                            h3: ({ node, ...props }) => (
                                <h3 className="text-xl font-serif mb-3 mt-6 text-[var(--text-primary)] tracking-wide opacity-95" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                                <ul className="list-none space-y-3 mb-6 ml-0" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                                <ol className="list-none space-y-3 mb-6 ml-0 counter-reset-list" {...props} />
                            ),
                            li: ({ node, children, ...props }) => (
                                <li className="text-[var(--text-secondary)] text-base leading-relaxed pl-8 relative before:content-['▸'] before:absolute before:left-0 before:text-[var(--text-secondary)] before:opacity-40 before:font-light" {...props}>
                                    {children}
                                </li>
                            ),
                            strong: ({ node, ...props }) => (
                                <strong className="text-[var(--text-primary)] font-medium" {...props} />
                            ),
                            em: ({ node, ...props }) => (
                                <em className="text-[var(--text-primary)] opacity-80 italic" {...props} />
                            ),
                            code: ({ node, inline, ...props }) =>
                                inline
                                    ? <code className="bg-[var(--bg-surface)] text-[var(--text-primary)] px-2 py-1 rounded font-mono text-sm opacity-90" {...props} />
                                    : <code className="block bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] p-4 rounded-lg font-mono text-sm overflow-x-auto my-4 leading-relaxed opacity-90" {...props} />,
                            blockquote: ({ node, ...props }) => (
                                <blockquote className="border-l-2 border-[var(--border-color)] pl-6 my-6 text-[var(--text-secondary)] italic opacity-70" {...props} />
                            ),
                        }}
                    >
                        {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Action Buttons */}
            {actions && actions.length > 0 && (
                <div className="w-full px-4 md:px-0 mb-8 fade-in-up">
                    <div className="max-w-4xl mx-auto pl-4">
                        <div className="flex flex-wrap gap-4">
                            {actions.map((action, idx) => (
                                <ActionLink key={idx} action={action} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ActionLink = ({ action }) => {
    const baseClasses = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-1";
    const primaryClasses = "bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 shadow-lg hover:shadow-[var(--shadow-color)]";
    const secondaryClasses = "bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)] hover:border-[var(--text-primary)]";

    const className = `${baseClasses} ${action.type === 'primary' ? primaryClasses : secondaryClasses}`;

    if (action.navigate) {
        return (
            <Link to={action.navigate} className={className}>
                {action.label}
            </Link>
        );
    }

    return (
        <a href={action.url} target="_blank" rel="noopener noreferrer" className={className}>
            {action.label}
        </a>
    );
};

export default ChatMessage;

