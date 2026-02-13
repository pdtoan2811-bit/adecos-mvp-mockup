
import React from 'react';

const WaitlistBanner = () => {
    return (
        <div className="w-full flex justify-center p-6 mt-auto">
            <div className="w-full max-w-5xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 md:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors duration-300">
                <div className="text-center sm:text-left flex-1 min-w-0">
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            PRO
                        </span>
                        <h3 className="font-serif text-xl text-[var(--text-primary)] tracking-tight">
                            Quản lý dự án Pro
                        </h3>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                        Liên kết dự án với chiến dịch quảng cáo, nhập số ref affiliate để có insight chiến dịch và doanh nghiệp affiliate rõ ràng hơn.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => { }}
                    className="shrink-0 px-6 py-2.5 bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
                >
                    Tham gia Waitlist
                </button>
            </div>
        </div>
    );
};

export default WaitlistBanner;
