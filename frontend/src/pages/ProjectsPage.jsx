import React, { useState, useEffect } from 'react';

const ProjectsPage = () => {
    const [savedPrograms, setSavedPrograms] = useState([]);

    useEffect(() => {
        loadSavedPrograms();
    }, []);

    const loadSavedPrograms = () => {
        const saved = JSON.parse(localStorage.getItem('savedPrograms') || '[]');
        setSavedPrograms(saved);
    };

    const handleDelete = (index) => {
        const updated = savedPrograms.filter((_, i) => i !== index);
        localStorage.setItem('savedPrograms', JSON.stringify(updated));
        setSavedPrograms(updated);
        window.dispatchEvent(new Event('programSaved')); // Trigger sidebar update
    };

    if (savedPrograms.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">📁</div>
                    <h2 className="text-2xl font-serif text-white mb-2">Chưa có dự án nào</h2>
                    <p className="text-luxury-gray text-sm">
                        Lưu các chương trình affiliate từ trang Chat để xem tại đây
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 overflow-auto">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-serif text-white mb-2">Dự án đã lưu</h1>
                <p className="text-luxury-gray text-sm mb-8">{savedPrograms.length} chương trình</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedPrograms.map((program, index) => (
                        <div
                            key={index}
                            className="border border-white/10 p-6 rounded-sm hover:border-white/30 transition-all duration-300 group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-serif text-white">{program.brand}</h3>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="text-luxury-gray hover:text-red-400 transition-colors"
                                    title="Xóa"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-3 text-sm">
                                {program.commission_percent > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-luxury-gray">Hoa hồng:</span>
                                        <span className="text-white font-mono text-lg font-semibold">
                                            {program.commission_percent}%
                                        </span>
                                    </div>
                                )}

                                {program.commission_type && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-luxury-gray">Loại:</span>
                                        <span className="text-white text-xs uppercase tracking-wider">
                                            {program.commission_type}
                                        </span>
                                    </div>
                                )}

                                {program.can_use_brand !== undefined && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-luxury-gray">Brand name:</span>
                                        {program.can_use_brand ? (
                                            <span className="text-green-400 text-xs">✓ Được</span>
                                        ) : (
                                            <span className="text-red-400 text-xs">✗ Không</span>
                                        )}
                                    </div>
                                )}

                                {program.traffic_3m && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-luxury-gray">Traffic:</span>
                                        <span className="text-white font-mono text-xs opacity-60">
                                            {program.traffic_3m}
                                        </span>
                                    </div>
                                )}

                                {program.legitimacy_score && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-luxury-gray">Điểm AI:</span>
                                        <span className="text-white font-serif">
                                            {program.legitimacy_score}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <a
                                href={program.program_url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-6 block w-full text-center py-2 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all duration-300 text-xs uppercase tracking-widest"
                            >
                                Tham gia
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;
