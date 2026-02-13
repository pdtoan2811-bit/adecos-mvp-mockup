import React, { useState } from 'react';
import ChatLogo from './chat/ChatLogo';
import ChatInput from './chat/ChatInput';
import ChatCheckboxes from './chat/ChatCheckboxes';
import StarterPrompts from './chat/StarterPrompts';

const ChatInterface = ({ onSearch, isSearching, hasSearched, onRestartOnboarding, isOnboarding, onInputFocus, isMinimal }) => {
    const [query, setQuery] = useState('');
    const [deepResearchEnabled, setDeepResearchEnabled] = useState(false);

    const placeholderText = isOnboarding
        ? "Adecos đang trình diễn tính năng..."
        : (hasSearched ? "Nhập yêu cầu tìm kiếm của bạn" : "Bạn đang tìm ngách nào?");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim() && !isOnboarding) {
            onSearch({ query, deepResearch: deepResearchEnabled });
        }
        setQuery('');
    };

    // In minimal mode (bento view), show a simplified input that triggers immersive overlay
    if (isMinimal) {
        return (
            <div className="w-full py-1 z-10">
                <div
                    className="relative flex items-center bg-[var(--bg-surface)] rounded-full px-5 py-1 border border-[var(--border-color)] cursor-text hover:border-[var(--border-hover)] transition-all duration-300"
                    onClick={onInputFocus}
                >
                    <input
                        type="text"
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] font-serif placeholder:italic text-center text-base md:text-lg py-2 placeholder:text-sm md:placeholder:text-base cursor-pointer"
                        placeholder="Nhập yêu cầu tìm kiếm của bạn..."
                        readOnly
                        onFocus={onInputFocus}
                    />
                    <div className="absolute right-2 p-2 text-[var(--text-secondary)]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] flex flex-col 
      ${hasSearched
                    ? 'w-full py-1 z-10 items-stretch'
                    : 'min-h-[85vh] relative z-10 mx-auto w-full max-w-5xl px-6 items-center justify-center'
                }`}
        >

            {/* Logo Area - Fades out/up when searching */}
            <ChatLogo hasSearched={hasSearched} />

            <form onSubmit={handleSubmit} className={`w-full transition-all duration-1000 ${hasSearched ? 'max-w-5xl' : 'max-w-5xl'}`}>
                <div className="relative group space-y-8 flex flex-col items-center">
                    {/* Input Container */}
                    <div className="w-full">
                        <ChatInput
                            query={query}
                            setQuery={setQuery}
                            isSearching={isSearching}
                            hasSearched={hasSearched}
                            isOnboarding={isOnboarding}
                            placeholderText={placeholderText}
                            onFocus={onInputFocus}
                        />

                        {/* Deep Research toggle + tooltip + Restart */}
                        <ChatCheckboxes
                            deepResearchEnabled={deepResearchEnabled}
                            setDeepResearchEnabled={setDeepResearchEnabled}
                            isSearching={isSearching}
                            hasSearched={hasSearched}
                            onRestartOnboarding={onRestartOnboarding}
                        />
                    </div>

                    {/* Starter Prompts - Only on Home */}
                    <StarterPrompts
                        hasSearched={hasSearched}
                        isSearching={isSearching}
                        onSearch={onSearch}
                        setDeepResearchEnabled={setDeepResearchEnabled}
                    />
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;

