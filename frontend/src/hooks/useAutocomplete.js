
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSuggestions } from '../api/openrouter';

const DEBOUNCE_MS = 300;
const MIN_CHARS = 3;

export const useAutocomplete = (query) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);

    // Use a ref to keep track of the latest abort controller
    const abortControllerRef = useRef(null);

    useEffect(() => {
        // Reset state on empty query or short query
        // console.log('useAutocomplete Effect running. Query:', query);
        if (!query || query.length < MIN_CHARS) {
            setSuggestions([]);
            setIsOpen(false);
            setLoading(false);
            return;
        }

        // Debounce logic
        const timer = setTimeout(() => {
            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Create new controller
            const controller = new AbortController();
            abortControllerRef.current = controller;

            // console.log('Debounce triggered for:', query);
            setLoading(true);
            fetchSuggestions(query, controller.signal)
                .then(newSuggestions => {
                    // console.log('Suggestions received:', newSuggestions);
                    if (!controller.signal.aborted) {
                        setSuggestions(newSuggestions);
                        setIsOpen(newSuggestions.length > 0);
                        setSelectedIndex(-1); // Reset selection
                        // console.log('Suggestions updated, isOpen:', newSuggestions.length > 0);
                    } else {
                        // console.log('Request aborted, not updating state.');
                    }
                })
                .catch((err) => {
                    console.error('Error fetching suggestions:', err);
                })
                .finally(() => {
                    if (!controller.signal.aborted) {
                        setLoading(false);
                    }
                });
        }, DEBOUNCE_MS);

        return () => {
            clearTimeout(timer);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [query]);

    // Keyboard navigation handlers
    const selectNext = useCallback(() => {
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
    }, [suggestions]);

    const selectPrev = useCallback(() => {
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    }, [suggestions]);

    const closeSuggestions = useCallback(() => {
        setIsOpen(false);
        setSelectedIndex(-1);
    }, []);

    return {
        suggestions,
        loading,
        isOpen,
        selectedIndex,
        selectNext,
        selectPrev,
        closeSuggestions,
        setIsOpen
    };
};
