import { useState, useCallback, useEffect } from 'react';
import { useChatContext } from '../context/ChatContext';
import { useDeepResearch } from '../context/DeepResearchContext';
import { streamChatResponse } from '../services/chatService';
import { generateMockWorkflow, shouldTriggerWorkflow } from '../data/mockWorkflowData';

export const useChatController = () => {
    const { messages, setMessages, getHistory } = useChatContext();
    const [isSearching, setIsSearching] = useState(false);
    const [onboardingKey, setOnboardingKey] = useState(0);
    const { startResearch } = useDeepResearch();

    const handleRestartOnboarding = useCallback(() => {
        setMessages([]);
        setIsSearching(false);
        setOnboardingKey(prev => prev + 1);
    }, [setMessages]);

    /**
     * Ensures a bento_grid message exists when onboarding is complete.
     * Called from ChatPage when onboardingComplete becomes true and
     * the last message is not already a bento_grid.
     */
    const ensureBentoMessage = useCallback(() => {
        setMessages(prev => {
            // Check if any bento_grid message already exists at the end
            if (prev.length > 0 && prev[prev.length - 1].type === 'bento_grid') {
                return prev;
            }
            // Also check if a bento_grid exists anywhere (from onboarding data)
            const hasBento = prev.some(msg => msg.type === 'bento_grid');
            if (hasBento) return prev;

            return [...prev, {
                role: 'assistant',
                type: 'bento_grid',
                content: {}
            }];
        });
    }, [setMessages]);

    const handleSearch = useCallback(async (input) => {
        if (!input) return;

        const isObjectPayload = typeof input === 'object' && input !== null;

        // Handle trigger for immersive input component
        if (isObjectPayload && input.triggerImmersive) {
            setMessages(prev => {
                // Prevent duplicates: if last message is already immersive_input, don't add another
                if (prev.length > 0 && prev[prev.length - 1].type === 'immersive_input') {
                    return prev;
                }

                return [...prev, {
                    role: 'assistant',
                    type: 'immersive_input',
                    content: ''
                }];
            });
            return;
        }

        const query = isObjectPayload ? input.query : input;
        const deepResearch = isObjectPayload ? Boolean(input.deepResearch) : false;

        if (!query) return;

        setIsSearching(true);

        const history = getHistory();

        // If Deep Research is enabled, start a parallel deep research task
        if (deepResearch) {
            startResearch(query);
        }

        // Add user message to UI
        // Filter out ANY immersive_input messages to keep history clean
        setMessages(prev => {
            const filtered = prev.filter(msg => msg.type !== 'immersive_input');
            return [...filtered, { role: 'user', type: 'text', content: query }];
        });

        // Prepare request messages
        // Filter out UI-only message types from the history sent to the API
        const uiOnlyTypes = ['immersive_input', 'bento_grid', 'skeleton', 'thinking', 'loading'];
        const requestMessages = [
            ...history.filter(msg => !uiOnlyTypes.includes(msg.type)),
            { role: 'user', type: 'text', content: query }
        ];

        try {
            // Check for mock workflow trigger
            if (shouldTriggerWorkflow(query)) {
                setMessages(prev => [...prev, { role: 'assistant', type: 'thinking', content: '' }]);

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
                // Mock flow finished
            } else {
                // Real API call via service
                await streamChatResponse(
                    requestMessages,
                    // onLoading
                    () => {
                        setMessages(prev => [...prev, { role: 'assistant', type: 'thinking', content: '' }]);
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
            }

        } catch (error) {
            console.error("Chat error:", error);
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
        } finally {
            // Ensure loading state is reset even if error occurs outside streamChatResponse
            setIsSearching(false);
        }
    }, [getHistory, setMessages, startResearch]);

    return {
        messages,
        setMessages,
        isSearching,
        onboardingKey,
        handleSearch,
        handleRestartOnboarding,
        ensureBentoMessage
    };
};
