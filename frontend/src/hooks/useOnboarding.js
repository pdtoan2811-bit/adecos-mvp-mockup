import { useEffect, useRef } from 'react';
import { onboardingSequence } from '../data/onboardingData';

/**
 * Custom hook to handle the onboarding sequence in the chat.
 * @param {Array} messages - Current messages array
 * @param {Function} setMessages - State setter for messages
 */
export const useOnboarding = (messages, setMessages, onboardingKey) => {
    useEffect(() => {
        // Only trigger on specific conditions based on key:
        // 1. Initial load (key=0): Only if no messages exist
        // 2. Restart (key>0): Always run (messages checked/cleared in parent)
        if (onboardingKey === 0 && messages.length > 0) return;

        let isCancelled = false;

        const runOnboarding = async () => {
            console.log(`[useOnboarding] Starting sequence (Key: ${onboardingKey})...`);
            let previousDelay = 0;

            for (const step of onboardingSequence) {
                if (isCancelled) break;

                // Calculate relative delay needed to reach the absolute timestamp in step.delay
                const delayFromPrevious = (step.delay || 0) - previousDelay;
                const safeDelay = Math.max(0, delayFromPrevious);

                // Wait for the calculated relative delay
                await new Promise(resolve => setTimeout(resolve, safeDelay));

                if (isCancelled) break;

                // Update previousDelay for next iteration
                previousDelay = step.delay || 0;

                // Handle Streaming for Text Messages
                if (step.type === 'text') {
                    // Initialize empty message
                    setMessages(prev => [...prev, {
                        role: step.role,
                        type: step.type,
                        content: '',
                        context: step.context,
                        actions: step.actions
                    }]);

                    // Stream words
                    const words = step.content.split(' ');
                    let currentContent = '';

                    for (let i = 0; i < words.length; i++) {
                        if (isCancelled) break;

                        currentContent += (i > 0 ? ' ' : '') + words[i];

                        // Update the last message with new content
                        setMessages(prev => {
                            const newArr = [...prev];
                            const lastIndex = newArr.length - 1;
                            if (lastIndex >= 0) {
                                newArr[lastIndex] = {
                                    ...newArr[lastIndex],
                                    content: currentContent
                                };
                            }
                            return newArr;
                        });

                        // Small random delay for typing effect (20-50ms)
                        await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 30));
                    }
                } else {
                    // Non-text messages appear instantly
                    setMessages(prev => [...prev, {
                        role: step.role,
                        type: step.type,
                        content: step.content,
                        context: step.context,
                        actions: step.actions
                    }]);
                }
            }
        };

        runOnboarding();

        return () => {
            isCancelled = true;
        };
        // Explicitly depend ONLY on onboardingKey.
        // We do not want to re-run or cancel when 'messages' changes during the sequence.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onboardingKey]);
};
