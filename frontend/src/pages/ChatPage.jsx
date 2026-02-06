import React, { useState, useEffect, useCallback } from 'react';
import { useChatContext } from '../context/ChatContext';
import ChatInterface from '../components/ChatInterface';
import ChatMessage from '../components/ChatMessage';
import { generateMockWorkflow, shouldTriggerWorkflow } from '../data/mockWorkflowData';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useOnboarding } from '../hooks/useOnboarding';
import { streamChatResponse } from '../services/chatService';

function ChatPage() {
    const { messages, setMessages, getHistory } = useChatContext();
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [onboardingKey, setOnboardingKey] = useState(0);

    // Calculate visible messages
    const MAX_VISIBLE_MESSAGES = 20;
    const visibleMessages = messages.slice(-MAX_VISIBLE_MESSAGES);
    const hiddenCount = Math.max(0, messages.length - MAX_VISIBLE_MESSAGES);

    // Custom hooks
    const messagesEndRef = useAutoScroll(messages);
    useOnboarding(messages, setMessages, onboardingKey);

    // Initial search state effect
    useEffect(() => {
        setHasSearched(messages.length > 0);
    }, [messages]);

    const handleRestartOnboarding = () => {
        if (window.confirm("Restart onboarding demo? This will clear current chat.")) {
            setMessages([]);
            setIsSearching(false);
            setHasSearched(false);
            setOnboardingKey(prev => prev + 1);
        }
    };

    const handleSearch = useCallback(async (query) => {
        if (!query) return;

        setIsSearching(true);
        setHasSearched(true);

        const history = getHistory();

        // Add user message to UI
        setMessages(prev => [...prev, { role: 'user', type: 'text', content: query }]);

        // Prepare request messages
        const requestMessages = [...history, { role: 'user', type: 'text', content: query }];

        try {
            // Check for mock workflow trigger
            if (shouldTriggerWorkflow(query)) {
                setMessages(prev => [...prev, { role: 'assistant', type: 'loading', content: '' }]);

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                const mockResponse = generateMockWorkflow(query);

                setMessages(prev => {
                    const newArr = [...prev];
                    newArr[newArr.length - 1] = {
                        role: 'assistant',
                        type: mockResponse.type,
                        content: mockResponse.content,
                        context: mockResponse.context
                    };
                    return newArr;
                });
                return;
            }

            // Real API call via service
            await streamChatResponse(
                requestMessages,
                // onLoading
                () => {
                    setMessages(prev => [...prev, { role: 'assistant', type: 'loading', content: '' }]);
                },
                // onUpdate
                (aiMessage) => {
                    setMessages(prev => {
                        const newArr = [...prev];
                        newArr[newArr.length - 1] = aiMessage;
                        return newArr;
                    });
                },
                // onError
                (errorMessage) => {
                    setMessages(prev => {
                        const newArr = [...prev];
                        newArr[newArr.length - 1] = {
                            role: 'assistant',
                            type: 'text',
                            content: errorMessage
                        };
                        return newArr;
                    });
                },
                // onComplete
                () => {
                    setIsSearching(false);
                }
            );

        } catch (error) { // eslint-disable-line no-unused-vars
            // Catch any unexpected errors not handled by service
            setMessages(prev => {
                const newArr = [...prev];
                // Ensure we have a slot to update, or add new if something went really wrong
                if (newArr.length > 0 && newArr[newArr.length - 1].role === 'assistant') {
                    newArr[newArr.length - 1] = {
                        role: 'assistant',
                        type: 'text',
                        content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.'
                    };
                } else {
                    newArr.push({
                        role: 'assistant',
                        type: 'text',
                        content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.'
                    });
                }
                return newArr;
            });
            setIsSearching(false);
        }
    }, [getHistory, setMessages, setIsSearching, setHasSearched]);

    // Listen for follow-up suggestion clicks
    useEffect(() => {
        const handleSuggestionClick = (event) => {
            handleSearch(event.detail);
        };

        window.addEventListener('agentSuggestionClick', handleSuggestionClick);
        return () => {
            window.removeEventListener('agentSuggestionClick', handleSuggestionClick);
        };
    }, [handleSearch]);

    return (
        <div className="flex flex-col h-full bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden transition-colors duration-300">
            {/* Header */}
            <div className="px-8 py-6 border-b border-[var(--border-color)] flex-shrink-0">
                <h1 className="text-2xl font-serif tracking-tight text-[var(--text-primary)]">AI Agent</h1>
                <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mt-1">
                    Phân tích dữ liệu thông minh • Powered by Gemini AI
                </p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
                <div className="w-full">
                    {hiddenCount > 0 && (
                        <div className="text-center py-4 text-xs text-[var(--text-secondary)] italic opacity-60">
                            {hiddenCount} tin nhắn trước đã bị ẩn để tối ưu hiệu suất
                        </div>
                    )}
                    {visibleMessages.map((msg, idx) => (
                        <ChatMessage key={hiddenCount + idx} message={msg} onSearch={handleSearch} />
                    ))}
                    <div className="h-32" /> {/* Spacer for scrolling */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Chat Interface */}
            <div className="flex-shrink-0 bg-[var(--bg-primary)] pt-6 pb-8 px-4 md:px-8 border-t border-[var(--border-color)]">
                <div className="max-w-3xl mx-auto">
                    <ChatInterface
                        onSearch={handleSearch}
                        isSearching={isSearching}
                        hasSearched={hasSearched}
                        onRestartOnboarding={handleRestartOnboarding}
                    />
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
