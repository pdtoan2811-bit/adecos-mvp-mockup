import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmptyProjectsState = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
            <div className="bg-[var(--bg-surface)] p-4 rounded-2xl mb-6 shadow-sm">
                <div className="text-6xl transform hover:scale-110 transition-transform duration-300 cursor-default">
                    📁
                </div>
            </div>

            <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-3">
                Chưa có dự án nào
            </h2>

            <p className="text-[var(--text-secondary)] text-sm max-w-md mb-8 leading-relaxed">
                Bắt đầu nghiên cứu thị trường, phân tích đối thủ hoặc tìm kiếm ý tưởng nội dung mới ngay bây giờ với AI Agent.
            </p>

            <button
                onClick={() => navigate('/chat')}
                className="group relative inline-flex items-center justify-center px-8 py-3 font-medium text-[var(--bg-primary)] transition-all duration-200 bg-[var(--text-primary)] rounded-xl hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-primary)]"
            >
                <span className="mr-2">✨</span>
                Bắt đầu nghiên cứu
                <svg
                    className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </button>
        </div>
    );
};

export default EmptyProjectsState;
