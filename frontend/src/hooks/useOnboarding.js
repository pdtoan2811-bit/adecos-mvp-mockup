import { useEffect, useState } from 'react';
import { onboardingSequence } from '../data/onboardingData';

const ONBOARDING_COMPLETE_KEY = 'adecos_onboarding_complete';

/**
 * Enhanced onboarding hook with:
 *  - Word-by-word streaming with punctuation pauses
 *  - Skeleton → real content reveal flow
 *  - Persistent onboardingComplete state (survives navigation)
 *
 * @param {Array} messages - Current messages array
 * @param {Function} setMessages - State setter for messages
 * @param {number} onboardingKey - Key to trigger re-run
 * @returns {{ isOnboarding: boolean, onboardingComplete: boolean, setOnboardingComplete: Function }}
 */
export const useOnboarding = (messages, setMessages, onboardingKey) => {
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [onboardingComplete, _setOnboardingComplete] = useState(() => {
        return sessionStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true';
    });

    // Wrapper that also persists to sessionStorage
    const setOnboardingComplete = (value) => {
        _setOnboardingComplete(value);
        if (value) {
            sessionStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
        } else {
            sessionStorage.removeItem(ONBOARDING_COMPLETE_KEY);
        }
    };

    useEffect(() => {
        // If onboarding already completed (persisted), skip entirely
        if (sessionStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true' && onboardingKey === 0) {
            return;
        }

        // Only trigger on specific conditions:
        // 1. Initial load (key=0): Only if no messages exist
        // 2. Restart (key>0): Always run
        if (onboardingKey === 0 && messages.length > 0) return;

        let isCancelled = false;
        setOnboardingComplete(false);

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const isSentenceEnd = (char) => /[.!?:]/.test(char);

        const runOnboarding = async () => {
            setIsOnboarding(true);
            console.log(`[useOnboarding] Starting enhanced sequence (Key: ${onboardingKey})...`);

            for (let stepIdx = 0; stepIdx < onboardingSequence.length; stepIdx++) {
                if (isCancelled) break;

                const step = onboardingSequence[stepIdx];

                if (step.delay > 0) {
                    await sleep(step.delay);
                }

                if (isCancelled) break;

                if (step.type === 'user_mimic') {
                    setMessages(prev => [...prev, {
                        role: 'user',
                        type: 'text',
                        content: step.content
                    }]);
                    continue;
                }

                if (step.type === 'thinking') {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        type: 'thinking',
                        content: ''
                    }]);

                    await sleep(1200 + Math.random() * 600);
                    if (isCancelled) break;

                    setMessages(prev => {
                        const newArr = [...prev];
                        if (newArr.length > 0 && newArr[newArr.length - 1].type === 'thinking') {
                            return newArr.slice(0, -1);
                        }
                        return newArr;
                    });
                    continue;
                }

                if (step.type === 'skeleton') {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        type: 'skeleton',
                        content: {
                            variant: step.content.variant,
                            loadDuration: step.content.loadDuration
                        }
                    }]);
                    continue;
                }

                if (step.type === 'text') {
                    setMessages(prev => [...prev, {
                        role: step.role,
                        type: step.type,
                        content: '',
                        context: step.context,
                        actions: step.actions
                    }]);

                    const words = step.content.split(' ');
                    let currentContent = '';

                    for (let i = 0; i < words.length; i++) {
                        if (isCancelled) break;

                        currentContent += (i > 0 ? ' ' : '') + words[i];

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

                        let wordDelay = 15 + Math.random() * 20;
                        const lastChar = words[i].slice(-1);
                        if (isSentenceEnd(lastChar)) {
                            wordDelay += 60 + Math.random() * 50;
                        }

                        await sleep(wordDelay);
                    }
                    continue;
                }

                if (step.type === 'table' || step.type === 'chart') {
                    setMessages(prev => {
                        const newArr = [...prev];
                        const lastIndex = newArr.length - 1;
                        if (lastIndex >= 0 && newArr[lastIndex].type === 'skeleton') {
                            newArr[lastIndex] = {
                                role: step.role,
                                type: step.type,
                                content: step.content,
                                context: step.context,
                                actions: step.actions,
                                _revealed: true
                            };
                        } else {
                            newArr.push({
                                role: step.role,
                                type: step.type,
                                content: step.content,
                                context: step.context,
                                actions: step.actions,
                                _revealed: true
                            });
                        }
                        return newArr;
                    });
                    continue;
                }

                // All other types (feature_preview, community_card, etc.)
                setMessages(prev => [...prev, {
                    role: step.role,
                    type: step.type,
                    content: step.content,
                    context: step.context,
                    actions: step.actions
                }]);
            }

            if (!isCancelled) {
                setIsOnboarding(false);
                await sleep(1500);
                if (!isCancelled) {
                    setOnboardingComplete(true);
                }
            }
        };

        runOnboarding();

        return () => {
            isCancelled = true;
            setIsOnboarding(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onboardingKey]);

    return { isOnboarding, onboardingComplete, setOnboardingComplete };
};
