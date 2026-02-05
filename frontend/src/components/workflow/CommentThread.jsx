import React, { useState, useRef, useEffect } from 'react';

/**
 * CommentThread - Google Doc-style commenting panel
 * 
 * Features:
 * - Floating panel that slides in from the right
 * - Threaded replies with user/AI differentiation
 * - Resolve action to close threads
 */
const CommentThread = ({
    isOpen,
    onClose,
    comments = [],
    onAddComment,
    onResolve,
    itemTitle
}) => {
    const [newComment, setNewComment] = useState('');
    const inputRef = useRef(null);
    const panelRef = useRef(null);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 100);
        }
    }, [isOpen]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment({
                id: Date.now(),
                author: 'user',
                content: newComment.trim(),
                timestamp: new Date().toISOString(),
            });
            setNewComment('');
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={panelRef}
            className="absolute right-0 top-0 w-80 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-2xl 
                       transform transition-all duration-300 ease-out z-50 backdrop-blur-xl
                       animate-slide-in-right"
            style={{ animation: 'slideInRight 0.3s ease-out forwards' }}
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--border-color)] flex justify-between items-center">
                <div className="flex-1 min-w-0">
                    <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                        Comments on
                    </div>
                    <div className="text-sm text-[var(--text-primary)] truncate font-medium">
                        {itemTitle}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-[var(--bg-hover)] rounded-full transition-colors ml-2"
                >
                    <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Comments List */}
            <div className="max-h-64 overflow-y-auto p-4 space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center text-[var(--text-secondary)] text-sm py-4 italic">
                        No comments yet. Be the first to add one!
                    </div>
                ) : (
                    comments.map((comment, idx) => (
                        <div
                            key={comment.id || idx}
                            className={`${comment.author === 'ai' ? 'pl-4 border-l-2 border-blue-500/50' : ''}`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                    ${comment.author === 'ai'
                                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                        : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-color)]'}`}
                                >
                                    {comment.author === 'ai' ? 'AI' : 'You'}
                                </div>
                                <span className={`text-xs ${comment.author === 'ai' ? 'text-blue-500' : 'text-[var(--text-secondary)]'}`}>
                                    {comment.author === 'ai' ? 'Adecos AI' : 'You'}
                                </span>
                                <span className="text-xs text-[var(--text-secondary)] opacity-50">
                                    {formatTime(comment.timestamp)}
                                </span>
                            </div>
                            <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                                {comment.content}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--border-color)]">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]
                                   placeholder-[var(--text-secondary)] placeholder:opacity-50 focus:outline-none focus:border-[var(--border-hover)] transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-3 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] rounded-lg transition-colors
                                   disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4 text-[var(--text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </form>

            {/* Actions */}
            <div className="px-4 pb-4 flex justify-end gap-2">
                <button
                    onClick={onResolve}
                    className="px-3 py-1.5 text-xs text-green-500 hover:bg-green-500/10 rounded-lg 
                               transition-colors uppercase tracking-wider font-medium"
                >
                    ✓ Resolve
                </button>
            </div>

            <style jsx>{`
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
};

// Helper to format timestamps
const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
};

export default CommentThread;
