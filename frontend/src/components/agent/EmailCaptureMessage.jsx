import React from 'react';
import { Link } from 'react-router-dom';

const EmailCaptureMessage = () => {
    return (
        <div className="w-full my-8 px-4 md:px-0 fade-in-up">
            <div className="max-w-4xl mx-auto">
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-8 backdrop-blur-sm text-center relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">

                    {/* Decorative background glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-all duration-700"></div>

                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-4 text-xl">
                            🚀
                        </div>
                        <h3 className="text-2xl font-serif text-[var(--text-primary)] mb-2">Sẵn sàng bùng nổ doanh số?</h3>
                        <p className="text-[var(--text-secondary)] text-base leading-relaxed">
                            Kết nối tài khoản quảng cáo để Adecos AI bắt đầu tối ưu chi phí và tăng ROAS cho bạn ngay lập tức.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            to="/ads"
                            className="block w-full bg-[var(--text-primary)] text-[var(--bg-primary)] font-medium py-3.5 rounded-lg hover:opacity-90 shadow-lg transition-all transform hover:-translate-y-0.5 text-sm uppercase tracking-wider"
                        >
                            Kết nối Ads Account →
                        </Link>

                        <p className="text-xs text-[var(--text-secondary)] opacity-50">
                            Không cần thẻ tín dụng. Miễn phí trọn đời cho 1 tài khoản.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailCaptureMessage;
