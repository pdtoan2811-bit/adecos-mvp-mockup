import { useEffect, useRef, useCallback } from 'react';

/**
 * Enhanced auto-scroll hook with throttling and smooth easing.
 * Prevents scroll jank during fast word streaming.
 * @param {any} dependency - The dependency that triggers the scroll (usually messages array)
 * @returns {React.RefObject} - The ref to attach to the dummy element at the bottom of the list
 */
export const useAutoScroll = (dependency) => {
    const messagesEndRef = useRef(null);
    const lastScrollRef = useRef(0);
    const rafRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        const now = Date.now();
        // Throttle: at most one scroll every 80ms to prevent jank during word streaming
        if (now - lastScrollRef.current < 80) return;
        lastScrollRef.current = now;

        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            }
        });
    }, []);

    useEffect(() => {
        scrollToBottom();

        // Trigger a few times on mount to handle layout shifts (images loading, fonts, etc.)
        const timeouts = [
            setTimeout(scrollToBottom, 100),
            setTimeout(scrollToBottom, 300),
            setTimeout(scrollToBottom, 600)
        ];

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            timeouts.forEach(clearTimeout);
        };
    }, [dependency, scrollToBottom]);

    return messagesEndRef;
};
