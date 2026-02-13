import React, { useEffect, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ChatInterface from '../components/ChatInterface';
import ChatMessage from '../components/ChatMessage';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useOnboarding } from '../hooks/useOnboarding';
import { useChatController } from '../hooks/useChatController';

/**
 * ChatPage – Main entry for the AI Agent experience.
 * Always renders conversation stream. The Bento Grid is a chat message,
 * not a separate "dashboard" view.
 */
function ChatPage() {
    const {
        messages,
        setMessages,
        isSearching,
        onboardingKey,
        handleSearch,
        handleRestartOnboarding,
        ensureBentoMessage
    } = useChatController();

    // Calculate visible messages
    const [showOnboardingHistory, setShowOnboardingHistory] = useState(false);

    // Find the index of the first bento_grid message
    const bentoIndex = messages.findIndex(msg => msg.type === 'bento_grid');

    // Determine which messages to show
    let visibleMessages = messages;
    let hiddenCount = 0;

    if (bentoIndex !== -1 && !showOnboardingHistory) {
        // If Bento Grid exists and history is hidden, show only from Bento Grid onwards
        visibleMessages = messages.slice(bentoIndex);
        hiddenCount = bentoIndex; // All messages before are hidden
    } else {
        // Standard behavior: Show last N messages
        const MAX_VISIBLE_MESSAGES = 8;
        // Only slice if we have more than MAX and NOT showing full history via toggle
        if (messages.length > MAX_VISIBLE_MESSAGES && !showOnboardingHistory) {
            visibleMessages = messages.slice(-MAX_VISIBLE_MESSAGES);
            hiddenCount = messages.length - MAX_VISIBLE_MESSAGES;
        }
    }

    // Custom hooks
    const messagesEndRef = useAutoScroll(messages);
    const { isOnboarding, onboardingComplete, setOnboardingComplete } = useOnboarding(messages, setMessages, onboardingKey);

    // When onboarding completes, ensure a bento_grid message exists in the conversation
    useEffect(() => {
        if (onboardingComplete) {
            ensureBentoMessage();
        }
    }, [onboardingComplete, ensureBentoMessage]);

    // Global event listener for suggestions
    useEffect(() => {
        const handleSuggestionClick = (event) => {
            handleSearch(event.detail);
        };
        window.addEventListener('agentSuggestionClick', handleSuggestionClick);
        return () => window.removeEventListener('agentSuggestionClick', handleSuggestionClick);
    }, [handleSearch]);

    const handleReplayDemo = useCallback(() => {
        setOnboardingComplete(false);
        setShowOnboardingHistory(false); // Reset history view on replay
        handleRestartOnboarding();
    }, [setOnboardingComplete, handleRestartOnboarding]);

    // "Bắt đầu nghiên cứu" or Input bar click -> Trigger immersive message
    const handleStartResearch = useCallback(() => {
        handleSearch({ triggerImmersive: true });
    }, [handleSearch]);

    // Check if the immersive input is currently active (last message)
    const lastMessage = messages[messages.length - 1];
    const isImmersiveActive = lastMessage?.type === 'immersive_input';

    return (
        <div className="flex flex-col h-full bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden transition-colors duration-300">
            {/* Header */}
            <div className="px-8 py-6 border-b border-[var(--border-color)] flex-shrink-0">
                <h1 className="text-3xl font-serif tracking-tight text-[var(--text-primary)]">AI Agent</h1>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mt-1">
                    AI Agent tìm kiếm dự án và phân tích dữ liệu
                </p>
            </div>

            {/* Conversation Stream – Always visible */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full"
                >
                    {hiddenCount > 0 && (
                        <div className="flex justify-center py-4">
                            <button
                                onClick={() => setShowOnboardingHistory(true)}
                                className="text-xs text-[var(--text-secondary)] italic opacity-60 hover:opacity-100 hover:underline transition-opacity"
                            >
                                {bentoIndex !== -1 ? "Xem lại đoạn chat demo" : `${hiddenCount} tin nhắn trước đã bị ẩn`}
                            </button>
                        </div>
                    )}

                    {showOnboardingHistory && bentoIndex !== -1 && (
                        <div className="flex justify-center py-4">
                            <button
                                onClick={() => setShowOnboardingHistory(false)}
                                className="text-xs text-[var(--text-secondary)] italic opacity-60 hover:opacity-100 hover:underline transition-opacity"
                            >
                                Ẩn đoạn chat demo
                            </button>
                        </div>
                    )}

                    {visibleMessages.map((msg, idx) => (
                        <ChatMessage
                            key={hiddenCount + idx}
                            message={msg}
                            onSearch={handleSearch}
                            onReplayDemo={handleReplayDemo}
                            onStartResearch={handleStartResearch}
                        />
                    ))}
                    <div className="h-24" />
                    <div ref={messagesEndRef} />
                </motion.div>
            </div>

            {/* Minimal Chat Input - slide up/down animation */}
            <AnimatePresence>
                {!isImmersiveActive && !isSearching && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="flex-shrink-0 bg-[var(--bg-primary)] pt-3 pb-4 px-4 md:px-8 border-t border-[var(--border-color)] z-10"
                    >
                        <div className="max-w-5xl mx-auto">
                            <ChatInterface
                                onSearch={handleSearch}
                                isSearching={isSearching}
                                hasSearched={messages.length > 0}
                                onRestartOnboarding={handleReplayDemo}
                                isOnboarding={isOnboarding}
                                onInputFocus={handleStartResearch}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ChatPage;
