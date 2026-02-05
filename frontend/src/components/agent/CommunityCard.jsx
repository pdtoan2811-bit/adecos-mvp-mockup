import React from 'react';

const CommunityCard = () => {
    return (
        <div className="w-full my-8 px-4 md:px-0 fade-in-up">
            <div className="max-w-4xl mx-auto">
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-1 rounded-2xl shadow-xl">
                    <div className="bg-[var(--bg-surface)] backdrop-blur-xl rounded-xl p-6 md:p-8">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl md:text-3xl font-serif text-[var(--text-primary)] mb-2">Tham gia Cộng đồng Adecos</h3>
                            <p className="text-[var(--text-secondary)] text-sm md:text-base">Kết nối với 15,000+ Affiliate Marketers hàng đầu</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Facebook Group */}
                            <a
                                href="https://facebook.com/groups/adecos"
                                target="_blank"
                                rel="noreferrer"
                                className="group relative overflow-hidden rounded-xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 p-6 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-all duration-300"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-[#1877F2]">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </div>
                                <div className="relative z-10">
                                    <div className="text-[#1877F2] font-semibold text-lg mb-1">Facebook Group</div>
                                    <div className="text-[var(--text-secondary)] text-sm mb-4">Thảo luận chiến thuật & Case study</div>
                                    <span className="inline-flex items-center text-xs font-medium text-white bg-[#1877F2] px-3 py-1.5 rounded-full group-hover:bg-[#1876f2d2] transition-colors">
                                        Tham gia ngay →
                                    </span>
                                </div>
                            </a>

                            {/* Zalo Group */}
                            <a
                                href="https://zalo.me/g/adecos"
                                target="_blank"
                                rel="noreferrer"
                                className="group relative overflow-hidden rounded-xl border border-blue-600/20 bg-blue-600/5 dark:bg-blue-600/10 p-6 hover:bg-blue-600/10 dark:hover:bg-blue-600/20 transition-all duration-300"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                    {/* Simple Zalo Icon Representation */}
                                    <div className="w-12 h-12 bg-[#0068FF] rounded-lg mask-icon"></div>
                                </div>
                                <div className="relative z-10">
                                    <div className="text-[#0068FF] font-semibold text-lg mb-1">Zalo Community</div>
                                    <div className="text-[var(--text-secondary)] text-sm mb-4">Hỗ trợ trực tiếp & Nhận kèo Hot</div>
                                    <span className="inline-flex items-center text-xs font-medium text-white bg-[#0068FF] px-3 py-1.5 rounded-full group-hover:bg-[#0068ffce] transition-colors">
                                        Tham gia ngay →
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityCard;
