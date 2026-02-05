import React, { useState } from 'react';

const FeaturePreviewCard = ({ content, onLearnMore }) => {
    const {
        title = "Tính năng sắp ra mắt",
        featureName = "Ads A/B Testing Automation",
        description = "Tự động hóa toàn bộ quy trình thử nghiệm quảng cáo của bạn. AI sẽ tự động phân bổ ngân sách vào các nhóm quảng cáo hiệu quả nhất.",
        benefits = [
            "Tự động tắt Ads lỗ sau 24h",
            "Scale ngân sách cho top 10% Ads hiệu quả",
            "Tiết kiệm 40% ngân sách thử nghiệm"
        ],
        ctaText = "Đặt lịch Demo 1:1",
        ctaUrl = "https://calendly.com/adecos-demo",
        autoRedirect = false
    } = content || {};

    const [registrationStatus, setRegistrationStatus] = useState('idle'); // idle | loading | success

    const handleRegister = () => {
        setRegistrationStatus('loading');

        // Simulate API call
        setTimeout(() => {
            setRegistrationStatus('success');

            // Handle redirect if enabled (for automation A/B demo)
            if (autoRedirect && ctaUrl) {
                setTimeout(() => {
                    window.open(ctaUrl, '_blank');
                }, 800); // Short delay after success to let user see the checkmark
            }
        }, 1500);
    };

    return (
        <div className="w-full my-8 px-4 md:px-0 fade-in-up">
            <div className="max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 group hover:border-blue-500/30 transition-all duration-500 shadow-2xl">

                    {/* Badge */}
                    <div className="absolute top-6 right-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/20 animate-pulse">
                            ✨ Coming Soon
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-3xl font-serif text-[var(--text-primary)] mb-2 whitespace-nowrap overflow-hidden text-overflow-ellipsis md:whitespace-normal">{featureName}</h3>
                            <p className="text-[var(--text-secondary)] text-base leading-relaxed mb-6 border-l-2 border-blue-500/50 pl-4">
                                {description}
                            </p>

                            <ul className="space-y-3 mb-8">
                                {benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-[var(--text-primary)] opacity-80">
                                        <span className="mr-3 text-blue-600 dark:text-blue-400">✓</span>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-wrap gap-4 items-center">
                                {registrationStatus === 'success' ? (
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-300 px-6 py-3 rounded-lg font-medium border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-fade-in relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                                        <span className="relative z-10">✓</span>
                                        <span className="relative z-10">{autoRedirect ? 'Đang chuyển hướng...' : 'Đã đăng ký Priority List'}</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleRegister}
                                        disabled={registrationStatus === 'loading'}
                                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 relative overflow-hidden group/btn ${registrationStatus === 'loading'
                                            ? 'bg-[var(--bg-surface)] text-[var(--text-secondary)] cursor-wait border border-[var(--border-color)]'
                                            : 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90 shadow-lg'
                                            }`}
                                    >
                                        {registrationStatus === 'loading' ? (
                                            <>
                                                <div className="absolute inset-0 bg-[var(--text-primary)] opacity-5 animate-pulse"></div>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="relative z-10 tracking-wide text-xs uppercase font-bold">Processing</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="group-hover/btn:scale-110 transition-transform">🚀</span>
                                                {ctaText}
                                            </>
                                        )}
                                    </button>
                                )}

                                {onLearnMore && registrationStatus !== 'success' && (
                                    <button
                                        onClick={onLearnMore}
                                        className="px-6 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors text-sm"
                                    >
                                        Tìm hiểu thêm
                                    </button>
                                )}

                                {onLearnMore && registrationStatus === 'success' && (
                                    <button
                                        onClick={onLearnMore}
                                        className="px-6 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors text-sm ml-auto md:ml-0"
                                    >
                                        Xem lại Preview
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Visual / Icon Placeholder */}
                        <div className="hidden md:flex items-center justify-center w-32 h-32 rounded-full bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
                            <span className="text-4xl">🤖</span>
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
};

export default FeaturePreviewCard;
