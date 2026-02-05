import React, { useState, useEffect } from 'react';
import FeaturePreviewCard from './FeaturePreviewCard';
import CompactWorkflowMessage from './CompactWorkflowMessage';

const InteractiveFeatureReveal = ({ content }) => {
    const { previewContent, ctaContent } = content;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

    // Auto-run once
    useEffect(() => {
        if (!hasAutoPlayed) {
            const timer = setTimeout(() => {
                setCurrentIndex(1);
                setHasAutoPlayed(true);
            }, 6000); // Wait 6 seconds for user to read the preview, then slide to CTA
            return () => clearTimeout(timer);
        }
    }, [hasAutoPlayed]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === 0 ? 1 : 0));
        setHasAutoPlayed(true); // Stop auto-play if user interacts
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 1 ? 0 : 1));
        setHasAutoPlayed(true);
    };

    return (
        <div className="relative w-full group">
            {/* Carousel Mask - Handles the overflow clipping */}
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {/* Slide 1: Feature Card CTA */}
                    <div className="min-w-full w-full flex-shrink-0">
                        <FeaturePreviewCard
                            content={ctaContent}
                            onLearnMore={handleNext}
                        />
                    </div>

                    {/* Slide 2: Workflow Preview */}
                    <div className="min-w-full w-full flex-shrink-0 relative">
                        <div className="px-1 py-4">
                            {/* Label */}
                            <div className="absolute top-4 right-4 z-10 pointer-events-none">
                                <span className="bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full text-white/70 border border-white/10 shadow-sm">
                                    Live Preview
                                </span>
                            </div>
                            <CompactWorkflowMessage content={previewContent.content} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Controls - Positioned absolute relative to the outer container, strictly inside */}
            <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 flex justify-between pointer-events-none z-20">
                <button
                    onClick={handlePrev}
                    className={`pointer-events-auto w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all shadow-xl group-hover:opacity-100 ${currentIndex === 0 ? 'opacity-0 cursor-default' : 'opacity-100'}`}
                    disabled={currentIndex === 0}
                    aria-label="Previous Slide"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button
                    onClick={handleNext}
                    className={`pointer-events-auto w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all shadow-xl group-hover:opacity-100 ${currentIndex === 1 ? 'opacity-0 cursor-default' : 'opacity-100'}`}
                    disabled={currentIndex === 1}
                    aria-label="Next Slide"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
            </div>

            {/* Pagination Indicators - Positioned inside the card at the bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {[0, 1].map((idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setCurrentIndex(idx);
                            setHasAutoPlayed(true);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${currentIndex === idx ? 'bg-white w-8' : 'bg-white/20 w-2 hover:bg-white/40'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default InteractiveFeatureReveal;
