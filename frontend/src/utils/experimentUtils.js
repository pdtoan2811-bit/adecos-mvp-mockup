/**
 * Status configuration for experiments.
 * Shared across ExperimentCard, ExperimentListItem, and ExperimentDetail.
 */
export const statusConfig = {
    running: {
        color: 'text-green-400 bg-green-500/10 border-green-500/20',
        icon: '▶',
        text: 'Đang chạy',
        label: 'Running'
    },
    paused: {
        color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        icon: '❚❚',
        text: 'Tạm dừng',
        label: 'Paused'
    },
    completed: {
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        icon: '✓',
        text: 'Hoàn thành',
        label: 'Completed'
    }
};

/**
 * Formats a date string to a localized string or relative time.
 * @param {string} dateString 
 * @returns {string}
 */
export const formatExperimentDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return hours === 0 ? 'Vừa tạo' : `${hours} giờ trước`;
    }
    if (diff < 604800000) {
        return `${Math.floor(diff / 86400000)} ngày trước`;
    }
    return date.toLocaleDateString('vi-VN');
};

/**
 * Calculates time progress percentage and label.
 * @param {object} timeProgress { startDate, endDate }
 * @returns {object} { percent, label, daysLeft }
 */
export const calculateTimeProgress = (timeProgress) => {
    if (!timeProgress?.startDate || !timeProgress?.endDate) return null;

    const start = new Date(timeProgress.startDate).getTime();
    const end = new Date(timeProgress.endDate).getTime();
    const now = Date.now();
    const total = end - start;
    const elapsed = now - start;
    const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));

    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    const label = daysLeft > 0 ? `${daysLeft} days left` : 'Finished';

    return { percent, label, daysLeft };
};

/**
 * Helper to get status configuration safely
 * @param {string} status 
 * @returns {object} status configuration object
 */
export const getStatusConfig = (status) => {
    return statusConfig[status] || statusConfig.running;
};
