import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProjectModal from '../components/ProjectModal';
import ViewModeToggle from '../components/ViewModeToggle';
import WaitlistBanner from '../components/WaitlistBanner';
import ProjectCard from '../components/ProjectCard';
import ProjectListRow from '../components/ProjectListRow';
import EmptyProjectsState from '../components/EmptyProjectsState';
import useProjects from '../hooks/useProjects';

const ProjectsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        savedPrograms,
        projects,
        viewMode,
        setViewMode,
        filterStatus,
        setFilterStatus,
        sortBy,
        setSortBy,
        saveProject,
        deleteProject
    } = useProjects();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [editingIndex, setEditingIndex] = useState(-1);

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

    const handleSaveProject = (updatedProject) => {
        saveProject(updatedProject, editingIndex);
        setIsModalOpen(false);
        setEditingProject(null);
        setEditingIndex(-1);
    };

    const handleDelete = (program) => {
        const index = savedPrograms.indexOf(program);
        if (index !== -1) {
            deleteProject(index);
        }
    };

    const openEditModal = (program) => {
        const index = savedPrograms.indexOf(program);
        setEditingProject(program);
        setEditingIndex(index);
        setIsModalOpen(true);
    };

    const goToDetail = (program) => {
        const index = savedPrograms.indexOf(program);
        navigate('/projects/detail', { state: { project: program, indexInSaved: index } });
    };

    const hasProjects = savedPrograms.length > 0;

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6 transition-colors duration-300">
            {/* Header controls */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-serif tracking-tight text-[var(--text-primary)] mb-1">Quản lý dự án</h1>
                    <p className="text-[var(--text-secondary)] text-sm">{savedPrograms.length} chương trình</p>
                </div>

                {hasProjects && (
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
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                {!hasProjects ? (
                    <EmptyProjectsState />
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-40">
                        {projects.map((program, index) => (
                            <ProjectCard
                                key={index}
                                program={program}
                                index={index}
                                onEdit={() => openEditModal(program)}
                                onDelete={() => handleDelete(program)}
                                onClick={() => goToDetail(program)}
                            />
                        ))}
                    </div>
                ) : (
                    // List View
                    <div className="w-full overflow-x-auto pb-40">
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
                                {projects.map((program, index) => (
                                    <ProjectListRow
                                        key={index}
                                        program={program}
                                        index={index}
                                        onEdit={() => openEditModal(program)}
                                        onDelete={() => handleDelete(program)}
                                        onClick={() => goToDetail(program)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <WaitlistBanner />

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProject(null);
                    setEditingIndex(-1);
                }}
                project={editingProject}
                onSave={handleSaveProject}
            />
        </div>
    );
};

export default ProjectsPage;
