import { API_BASE_URL } from '../config';

/**
 * Sends a chat request to the AI agent API and handles the streaming response.
 * @param {Array} history - The conversation history
 * @param {Function} onLoading - Callback for initial loading state
 * @param {Function} onUpdate - Callback for each chunk/update
 * @param {Function} onError - Callback for errors
 * @param {Function} onComplete - Callback when stream completes
 */
export const streamChatResponse = async (history, onLoading, onUpdate, onError, onComplete) => {
    try {
        onLoading();

        const response = await fetch(`${API_BASE_URL}/api/agent/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: history }),
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
        }

        // Parse complete JSON after stream ends
        // Note: The original implementation accumulated the buffer and parsed at the end.
        // If the backend sends chunks of valid JSON objects, we might need a different approach,
        // but based on the original code, it expects one final JSON object.
        try {
            const parsed = JSON.parse(buffer);

            if (parsed.type && parsed.content !== undefined) {
                const aiMessage = {
                    role: 'assistant',
                    type: parsed.type,
                    content: parsed.content,
                    context: parsed.context || null
                };
                onUpdate(aiMessage);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (e) {
            console.error('[ChatService] Parse error:', e);
            onError('Đã nhận phản hồi nhưng không thể hiển thị. Vui lòng thử lại.');
        }

    } catch (error) {
        console.error("[ChatService] API error", error);
        onError('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
        if (onComplete) onComplete();
    }
};
