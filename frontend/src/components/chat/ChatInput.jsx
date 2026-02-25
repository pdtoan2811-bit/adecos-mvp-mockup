import React, { useRef } from 'react';
import { useAutocomplete } from '../../hooks/useAutocomplete';
import AutocompleteDropdown from './AutocompleteDropdown';

const ChatInput = ({
    query,
    setQuery,
    isSearching,
    hasSearched,
    isOnboarding,
    placeholderText,
    onFocus
}) => {
    const {
        suggestions,
        loading,
        isOpen,
        selectedIndex,
        selectNext,
        selectPrev,
        closeSuggestions,
        setIsOpen
    } = useAutocomplete(query);

    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (!isOpen) return;

        if (e.key === 'Tab') {
            e.preventDefault();
            if (selectedIndex === -1 && suggestions.length > 0) {
                // Determine if we should select first or just cycle
                selectNext();
            } else {
                selectNext();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectNext();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectPrev();
        } else if (e.key === 'Enter') {
            if (selectedIndex !== -1) {
                e.preventDefault();
                setQuery(suggestions[selectedIndex]);
                closeSuggestions();
                // Optional: submit immediately or let user submit? 
                // "Cursor tab to complete code" usually just completes.
                // Let's just complete for now.
            }
        } else if (e.key === 'Escape') {
            closeSuggestions();
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        setQuery(suggestion);
        closeSuggestions();
        inputRef.current?.focus();
    };

    return (
        <div className={`relative flex items-center bg-transparent transition-all duration-500 pb-2 
            ${isOnboarding ? 'onboarding-glow rounded-full px-5 py-1 border-transparent' : ''}
            ${hasSearched && !isOnboarding
                ? 'bg-[var(--bg-surface)] rounded-full px-5 py-1 border border-[var(--border-color)]'
                : ''}
            ${!hasSearched && !isOnboarding
                ? 'border-b border-[var(--border-color)] focus-within:border-[var(--text-primary)]'
                : ''}
        `}>
            {/* Autocomplete Dropdown */}
            {!isOnboarding && !isSearching && (
                <div className="absolute bottom-full left-0 w-full mb-2 z-50">
                    <AutocompleteDropdown
                        suggestions={suggestions}
                        selectedIndex={selectedIndex}
                        onSelect={handleSelectSuggestion}
                        isOpen={isOpen}
                        loading={loading}
                    />
                </div>
            )}

            <input
                ref={inputRef}
                type="text"
                className={`w-full bg-transparent border-none focus:ring-0 focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] font-serif font-light placeholder:italic text-center relative z-10
                    ${hasSearched || isOnboarding ? 'text-base md:text-lg py-2 placeholder:text-sm md:placeholder:text-base' : 'text-2xl md:text-3xl px-2 py-2 placeholder:font-serif'}
                    ${isOnboarding ? 'placeholder-pulse cursor-not-allowed opacity-90' : ''}
                `}
                placeholder={placeholderText}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isSearching || isOnboarding}
                autoFocus={!hasSearched && !isOnboarding}
                onFocus={onFocus}
                onKeyDown={handleKeyDown}
            />

            <button
                type="submit"
                disabled={isSearching || !query.trim()}
                className={`absolute right-2 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-300`}
            >
                {isOnboarding ? (
                    <div className="w-5 h-5 rounded-full border-2 border-[var(--text-secondary)] border-t-[var(--text-primary)] animate-spin opacity-50"></div>
                ) : isSearching ? (
                    <div className="w-5 h-5 border-t-2 border-[var(--text-primary)] rounded-full animate-spin"></div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default ChatInput;
