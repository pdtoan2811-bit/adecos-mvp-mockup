import { useState, useEffect, useMemo } from 'react';

const useProjects = () => {
    const [savedPrograms, setSavedPrograms] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date_desc'); // 'date_desc', 'commission_desc', 'pay_time_asc'

    useEffect(() => {
        loadSavedPrograms();
    }, []);

    const parsePayTime = (str) => {
        if (!str) return 999;
        const num = parseInt(str.replace(/\D/g, ''));
        return isNaN(num) ? 999 : num;
    };

    const loadSavedPrograms = () => {
        try {
            const saved = JSON.parse(localStorage.getItem('savedPrograms') || '[]');
            // Ensure legacy data has status if missing
            const normalized = saved.map(p => ({
                ...p,
                status: p.status || 'Đang tìm hiểu',
                pay_time_days: parsePayTime(p.payment_time || 'NET30') // Helper for sorting
            }));
            setSavedPrograms(normalized);
        } catch (error) {
            console.error("Error loading saved programs:", error);
            setSavedPrograms([]);
        }
    };

    const saveProject = (updatedProject, editingIndex = -1) => {
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

    const deleteProject = (index) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
            const updated = savedPrograms.filter((_, i) => i !== index);
            localStorage.setItem('savedPrograms', JSON.stringify(updated));
            setSavedPrograms(updated);
            window.dispatchEvent(new Event('programSaved'));
        }
    };

    // --- Filtering & Sorting ---
    const filteredProjects = useMemo(() => {
        return savedPrograms.filter(p => {
            if (filterStatus === 'all') return true;
            return p.status === filterStatus;
        });
    }, [savedPrograms, filterStatus]);

    const sortedProjects = useMemo(() => {
        return [...filteredProjects].sort((a, b) => {
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
            return 0; // Keep existing order
        });
    }, [filteredProjects, sortBy]);

    return {
        savedPrograms, // The raw list, if needed
        projects: sortedProjects, // The filtered and sorted list
        viewMode,
        setViewMode,
        filterStatus,
        setFilterStatus,
        sortBy,
        setSortBy,
        loadSavedPrograms,
        saveProject,
        deleteProject
    };
};

export default useProjects;
