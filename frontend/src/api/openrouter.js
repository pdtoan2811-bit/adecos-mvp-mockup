
const BACKEND_URL = 'http://localhost:8000/api/suggestions';

export const fetchSuggestions = async (prompt, signal) => {
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt
            }),
            signal // Allow aborting
        });

        if (!response.ok) {
            console.error('Backend API Error:', response.statusText);
            return [];
        }

        const data = await response.json();

        if (data.suggestions && Array.isArray(data.suggestions)) {
            return data.suggestions;
        }

        return [];

    } catch (error) {
        if (error.name === 'AbortError') {
            // Ignore aborts
            return [];
        }
        console.error('Failed to fetch suggestions from backend:', error);
        return [];
    }
};
