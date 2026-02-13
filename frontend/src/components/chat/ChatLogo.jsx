import React from 'react';

const ChatLogo = ({ hasSearched }) => {
    return (
        <div className={`text-center space-y-6 transition-all duration-700 ${hasSearched ? 'hidden opacity-0' : 'mb-16 opacity-100'}`}>
            <h1 className="text-5xl md:text-8xl font-serif text-[var(--text-primary)] tracking-tighter leading-tight">
                Adecos
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] font-sans font-light tracking-widest uppercase opacity-60">
                Trí tuệ nhân tạo cho Affiliate
            </p>
        </div>
    );
};

export default ChatLogo;
