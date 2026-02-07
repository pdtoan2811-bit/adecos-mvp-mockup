import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useDeepResearch } from './DeepResearchContext';

const STORAGE_KEY = 'adecos_notification_read_ids';

const NotificationContext = createContext();

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider (inside DeepResearchProvider)');
    return ctx;
};

/** Build unified notification list from Deep Research tasks + read state. Mở rộng: thêm nguồn khác vào list. */
const buildNotifications = (tasks, readIds) => {
    const list = tasks.map((task) => {
        const title = task.status === 'completed'
            ? 'Deep Research hoàn thành'
            : 'Deep Research đang chạy';
        return {
            id: task.id,
            type: 'deep_research',
            title,
            description: task.query,
            timestamp: task.startTime || new Date().toISOString(),
            read: readIds.has(task.id),
            link: `/deep-research?taskId=${task.id}`,
            meta: { status: task.status, progress: task.progress, eta: task.eta },
        };
    });
    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const NotificationProvider = ({ children }) => {
    const { tasks } = useDeepResearch();
    const [readIds, setReadIds] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? new Set(JSON.parse(raw)) : new Set();
        } catch {
            return new Set();
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...readIds]));
        } catch (_) {}
    }, [readIds]);

    const notifications = useMemo(
        () => buildNotifications(tasks, readIds),
        [tasks, readIds]
    );

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.read).length,
        [notifications]
    );

    const markAsRead = (id) => {
        setReadIds((prev) => new Set(prev).add(id));
    };

    const markAllRead = () => {
        setReadIds((prev) => new Set([...prev, ...notifications.map((n) => n.id)]));
    };

    const value = {
        notifications,
        unreadCount,
        markAsRead,
        markAllRead,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
