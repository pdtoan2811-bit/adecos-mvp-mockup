import React, { useState, useEffect } from 'react';
import ProjectModal from '../components/ProjectModal';

const ProjectsPage = () => {
    const [savedPrograms, setSavedPrograms] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date_desc'); // 'date_desc', 'commission_desc', 'pay_time_asc'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [editingIndex, setEditingIndex] = useState(-1);

    useEffect(() => {
        loadSavedPrograms();
    }, []);

    const loadSavedPrograms = () => {
        const saved = JSON.parse(localStorage.getItem('savedPrograms') || '[]');
        // Ensure legacy data has status if missing
        const normalized = saved.map(p => ({
            ...p,
            status: p.status || 'Đang tìm hiểu',
            pay_time_days: parsePayTime(p.payment_time || 'NET30') // Helper for sorting
        }));
        setSavedPrograms(normalized);
    };

    const parsePayTime = (str) => {
        if (!str) return 999;
        const num = parseInt(str.replace(/\D/g, ''));
        return isNaN(num) ? 999 : num;
    };

    const handleSaveProject = (updatedProject) => {
        const updatedList = [...savedPrograms];
        if (editingIndex >= 0) {
            updatedList[editingIndex] = updatedProject;
        } else {
            updatedList.push(updatedProject);
        }
        localStorage.setItem('savedPrograms', JSON.stringify(updatedList));
        setSavedPrograms(updatedList);
        window.dispatchEvent(new Event('programSaved'));
    };

    const handleDelete = (index) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
            const updated = savedPrograms.filter((_, i) => i !== index);
            localStorage.setItem('savedPrograms', JSON.stringify(updated));
            setSavedPrograms(updated);
            window.dispatchEvent(new Event('programSaved'));
        }
    };

    const openEditModal = (project, index) => {
        setEditingProject(project);
        setEditingIndex(index);
        setIsModalOpen(true);
    };

    // --- Filtering & Sorting ---
    const filteredProjects = savedPrograms.filter(p => {
        if (filterStatus === 'all') return true;
        return p.status === filterStatus;
    });

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        if (sortBy === 'commission_desc') {
            return (b.commission_percent || 0) - (a.commission_percent || 0);
        }
        if (sortBy === 'pay_time_asc') {
            const aTime = parsePayTime(a.payment_time);
            const bTime = parsePayTime(b.payment_time);
            return aTime - bTime;
        }
        // Default: date_desc (assuming savedAt exists, or just by index reverse)
        if (a.savedAt && b.savedAt) {
            return new Date(b.savedAt) - new Date(a.savedAt);
        }
        return 0; // Keep existing order if no date
    });

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

    const StatusBadge = ({ status }) => {
        let colors = "bg-gray-500/20 text-gray-400";
        if (status === 'Đang chạy') colors = "bg-green-500/20 text-green-400";
        if (status === 'Tạm dừng') colors = "bg-yellow-500/20 text-yellow-400";
        if (status === 'Đang tìm hiểu') colors = "bg-blue-500/20 text-blue-400";

        return (
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium ${colors}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="flex-1 p-8 overflow-hidden flex flex-col">
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
                {/* Header controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                    <div>
                        <h1 className="text-3xl font-serif text-white mb-1">Dự án đã lưu</h1>
                        <p className="text-luxury-gray text-sm">{savedPrograms.length} chương trình</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Filter Status */}
                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/30 appearance-none pr-8 cursor-pointer hover:bg-white/10 transition-colors"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="Đang tìm hiểu">Đang tìm hiểu</option>
                                <option value="Đang chạy">Đang chạy</option>
                                <option value="Tạm dừng">Tạm dừng</option>
                            </select>
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">▼</span>
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/30 appearance-none pr-8 cursor-pointer hover:bg-white/10 transition-colors"
                            >
                                <option value="date_desc">Mới nhất</option>
                                <option value="commission_desc">% Hoa hồng cao nhất</option>
                                <option value="pay_time_asc">Thời gian thanh toán ngắn nhất</option>
                            </select>
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">▼</span>
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-white/5 rounded border border-white/10 p-0.5">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                title="Grid View"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                title="List View"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                            {sortedProjects.map((program, index) => (
                                <div
                                    key={index}
                                    className="border border-white/10 p-6 rounded-sm hover:border-white/30 transition-all duration-300 group bg-[#0F0F0F] relative"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 pr-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-xl font-serif text-white truncate" title={program.brand}>{program.brand}</h3>
                                                {program.country && <span title="Country">{/* Flag could go here if we had mapping, or just text */}</span>}
                                            </div>
                                            <StatusBadge status={program.status} />
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(program, index)}
                                                className="text-luxury-gray hover:text-white"
                                                title="Sửa"
                                            >
                                                ✎
                                            </button>
                                            <button
                                                onClick={() => handleDelete(index)}
                                                className="text-luxury-gray hover:text-red-400"
                                                title="Xóa"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-luxury-gray">Hoa hồng:</span>
                                            <span className="text-white font-mono text-lg font-semibold">
                                                {program.commission_percent > 0 ? `${program.commission_percent}%` : 'N/A'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-luxury-gray">Pay time:</span>
                                            <span className="text-white font-mono text-xs opacity-80">
                                                {program.payment_time || 'NET30'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-luxury-gray">Ads:</span>
                                            <span className={program.allow_ads ? "text-green-400 text-xs" : "text-red-400 text-xs"}>
                                                {program.allow_ads ? '✓ Được' : '✗ Không'}
                                            </span>
                                        </div>

                                        {program.legitimacy_score && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-luxury-gray">Điểm AI:</span>
                                                <span className="text-white">{program.legitimacy_score}</span>
                                            </div>
                                        )}
                                    </div>

                                    <a
                                        href={program.program_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-6 block w-full text-center py-2 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all duration-300 text-xs uppercase tracking-widest"
                                    >
                                        Truy cập
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // List View
                        <div className="w-full overflow-x-auto pb-20">
                            <table className="w-full text-left text-luxury-white/80 font-sans text-sm">
                                <thead className="uppercase text-xs tracking-[0.1em] text-luxury-gray font-light border-b border-white/5">
                                    <tr>
                                        <th className="px-4 py-4 font-normal">Dự án</th>
                                        <th className="px-4 py-4 font-normal">Trạng thái</th>
                                        <th className="px-4 py-4 font-normal">Mảng</th>
                                        <th className="px-4 py-4 font-normal">Hoa hồng</th>
                                        <th className="px-4 py-4 font-normal">Pay Time</th>
                                        <th className="px-4 py-4 font-normal text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {sortedProjects.map((program, index) => (
                                        <tr key={index} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-4 py-4 font-medium text-white">{program.brand}</td>
                                            <td className="px-4 py-4">
                                                <StatusBadge status={program.status} />
                                            </td>
                                            <td className="px-4 py-4 text-luxury-gray">{program.niche}</td>
                                            <td className="px-4 py-4 font-mono text-white">
                                                {program.commission_percent > 0 ? `${program.commission_percent}%` : '—'}
                                            </td>
                                            <td className="px-4 py-4 font-mono text-xs opacity-70">{program.payment_time || 'NET30'}</td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEditModal(program, index)} className="text-luxury-gray hover:text-white">✎</button>
                                                    <button onClick={() => handleDelete(index)} className="text-luxury-gray hover:text-red-400">✕</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={editingProject}
                onSave={handleSaveProject}
            />
        </div>
    );
};

export default ProjectsPage;
