import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProjectModal from '../components/ProjectModal';
import StatusBadge from '../components/StatusBadge';
import ViewModeToggle from '../components/ViewModeToggle';

const ProjectsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
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

    // Open edit modal when returning from detail page with openEditProject
    useEffect(() => {
        const state = location.state;
        if (state?.openEditProject && savedPrograms.length > 0) {
            const idx = typeof state.indexInSaved === 'number' && state.indexInSaved >= 0
                ? state.indexInSaved
                : savedPrograms.findIndex(p => p.brand === state.openEditProject.brand && p.program_url === state.openEditProject.program_url);
            if (idx >= 0) {
                setEditingProject(savedPrograms[idx]);
                setEditingIndex(idx);
                setIsModalOpen(true);
            }
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, savedPrograms, navigate, location.pathname]);

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

    const WaitlistBanner = () => (
        <section
            className="shrink-0 mt-auto border-t border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-surface)] via-[var(--bg-hover)]/50 to-[var(--bg-surface)] backdrop-blur-sm"
            style={{ boxShadow: '0 -4px 24px var(--shadow-color)' }}
        >
            <div className="max-w-7xl mx-auto py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6 border-l-4 border-blue-500/60">
                <div className="text-center sm:text-left flex-1 min-w-0 w-full sm:w-auto">
                    <h3 className="font-serif text-lg sm:text-xl text-[var(--text-primary)] tracking-tight mb-1.5">
                        Quản lý dự án Pro
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
                        Liên kết dự án với chiến dịch quảng cáo, nhập số ref affiliate để có insight chiến dịch và doanh nghiệp affiliate rõ ràng hơn.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => {}}
                    className="shrink-0 self-center sm:ml-auto sm:mr-0 px-6 py-3 border-2 border-blue-500 text-blue-500 bg-transparent text-xs font-medium uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all duration-300"
                >
                    Tham gia waitlist
                </button>
            </div>
        </section>
    );

    if (savedPrograms.length === 0) {
        return (
            <div className="flex-1 flex flex-col bg-[var(--bg-primary)] transition-colors duration-300">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📁</div>
                        <h2 className="text-3xl font-serif text-white mb-2">Chưa có dự án nào</h2>
                        <p className="text-[var(--text-secondary)] text-sm">
                            Lưu các chương trình affiliate từ trang Chat để xem tại đây
                        </p>
                    </div>
                </div>
                <WaitlistBanner />
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 overflow-hidden flex flex-col bg-[var(--bg-primary)] transition-colors duration-300">
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
                {/* Header controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                    <div>
                        <h1 className="text-3xl font-serif tracking-tight text-[var(--text-primary)] mb-1">Quản lý dự án</h1>
                        <p className="text-[var(--text-secondary)] text-sm">{savedPrograms.length} chương trình</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Filter Status */}
                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] appearance-none pr-8 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="Đang tìm hiểu">Đang tìm hiểu</option>
                                <option value="Đang chạy">Đang chạy</option>
                                <option value="Tạm dừng">Tạm dừng</option>
                            </select>
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-secondary)]">▼</span>
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] appearance-none pr-8 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                            >
                                <option value="date_desc">Mới nhất</option>
                                <option value="commission_desc">% Hoa hồng cao nhất</option>
                                <option value="pay_time_asc">Thời gian thanh toán ngắn nhất</option>
                            </select>
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-secondary)]">▼</span>
                        </div>

                        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                            {sortedProjects.map((program, index) => (
                                <div
                                    key={index}
                                    className="border border-[var(--border-color)] p-6 rounded-sm hover:border-[var(--border-hover)] transition-all duration-300 group bg-[var(--bg-surface)] relative"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 pr-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-xl font-serif tracking-tight text-[var(--text-primary)] truncate" title={program.brand}>{program.brand}</h3>
                                                {program.country && <span title="Country">{/* Flag could go here if we had mapping, or just text */}</span>}
                                            </div>
                                            <StatusBadge status={program.status} variant="project" />
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(program, index)}
                                                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                                title="Sửa"
                                            >
                                                ✎
                                            </button>
                                            <button
                                                onClick={() => handleDelete(index)}
                                                className="text-[var(--text-secondary)] hover:text-red-400"
                                                title="Xóa"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[var(--text-secondary)]">Hoa hồng:</span>
                                            <span className="text-[var(--text-primary)] font-mono text-lg font-semibold">
                                                {program.commission_percent > 0 ? `${program.commission_percent}%` : 'N/A'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-[var(--text-secondary)]">Pay time:</span>
                                            <span className="text-[var(--text-primary)] font-mono text-xs opacity-80">
                                                {program.payment_time || 'NET30'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-[var(--text-secondary)]">Ads:</span>
                                            <span className={program.allow_ads ? "text-green-400 text-xs" : "text-red-400 text-xs"}>
                                                {program.allow_ads ? '✓ Được' : '✗ Không'}
                                            </span>
                                        </div>

                                        {program.legitimacy_score && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-[var(--text-secondary)]">Điểm AI:</span>
                                                <span className="text-[var(--text-primary)]">{program.legitimacy_score}</span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => navigate('/projects/detail', { state: { project: program, indexInSaved: savedPrograms.indexOf(program) } })}
                                        className="mt-6 block w-full text-center py-2 border border-[var(--border-color)] hover:border-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 text-xs uppercase tracking-widest text-[var(--text-primary)]"
                                    >
                                        Chi tiết dự án
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // List View
                        <div className="w-full overflow-x-auto pb-20">
                            <table className="w-full text-left font-sans text-sm">
                                <thead className="uppercase text-xs tracking-[0.1em] text-[var(--text-secondary)] font-light border-b border-[var(--border-color)]">
                                    <tr>
                                        <th className="px-4 py-4 font-normal">Dự án</th>
                                        <th className="px-4 py-4 font-normal">Trạng thái</th>
                                        <th className="px-4 py-4 font-normal">Mảng</th>
                                        <th className="px-4 py-4 font-normal">Hoa hồng</th>
                                        <th className="px-4 py-4 font-normal">Pay Time</th>
                                        <th className="px-4 py-4 font-normal text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {sortedProjects.map((program, index) => (
                                        <tr key={index} className="hover:bg-[var(--bg-hover)] transition-colors group text-[var(--text-primary)]">
                                            <td className="px-4 py-4 font-medium text-[var(--text-primary)]">{program.brand}</td>
                                            <td className="px-4 py-4">
                                                <StatusBadge status={program.status} variant="project" />
                                            </td>
                                            <td className="px-4 py-4 text-[var(--text-secondary)]">{program.niche}</td>
                                            <td className="px-4 py-4 font-mono text-[var(--text-primary)]">
                                                {program.commission_percent > 0 ? `${program.commission_percent}%` : '—'}
                                            </td>
                                            <td className="px-4 py-4 font-mono text-xs opacity-70">{program.payment_time || 'NET30'}</td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity items-center">
                                                    <button
                                                        onClick={() => navigate('/projects/detail', { state: { project: program, indexInSaved: savedPrograms.indexOf(program) } })}
                                                        className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                                    >
                                                        Chi tiết
                                                    </button>
                                                    <button onClick={() => openEditModal(program, index)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">✎</button>
                                                    <button onClick={() => handleDelete(index)} className="text-[var(--text-secondary)] hover:text-red-400">✕</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <WaitlistBanner />
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
