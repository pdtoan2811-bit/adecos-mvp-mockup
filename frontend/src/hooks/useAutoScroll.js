import { useEffect, useRef } from 'react';

/**
 * Custom hook to automatically scroll to the bottom of a container when dependency changes.
 * @param {any} dependency - The dependency that triggers the scroll (usually messages array)
 * @returns {React.RefObject} - The ref to attach to the dummy element at the bottom of the list
 */
export const useAutoScroll = (dependency) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [dependency]);

    return messagesEndRef;
};
