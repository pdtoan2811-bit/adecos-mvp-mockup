import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState(() => {
        const saved = sessionStorage.getItem('chatHistory');
        return saved ? JSON.parse(saved) : [];
    });

    // Don't load messages on mount - UI starts clean
    // But we keep history in sessionStorage for context

    // Save messages to sessionStorage whenever they change
    // Exclude transient UI-only message types that are re-injected dynamically
    useEffect(() => {
        if (messages.length > 0) {
            const uiOnlyTypes = ['loading', 'immersive_input', 'bento_grid', 'skeleton', 'thinking'];
            const messagesToSave = messages.filter(msg => !uiOnlyTypes.includes(msg.type));
            if (messagesToSave.length > 0) {
                sessionStorage.setItem('chatHistory', JSON.stringify(messagesToSave));
            }
        }
    }, [messages]);

    const getHistory = () => {
        // Get history from sessionStorage without displaying it
        const saved = sessionStorage.getItem('chatHistory');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load chat history:', e);
                return [];
            }
        }
        return [];
    };

    const clearMessages = () => {
        setMessages([]);
        sessionStorage.removeItem('chatHistory');
    };

    return (
        <ChatContext.Provider value={{ messages, setMessages, getHistory, clearMessages }}>
            {children}
        </ChatContext.Provider>
    );
};
