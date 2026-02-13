import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const TAB_ALL = 'all';
const TAB_UNREAD = 'unread';

/** Nhãn loại thông báo (mở rộng khi thêm type mới) */
const TYPE_LABEL = { deep_research: 'Deep Research' };

const NotificationPage = () => {
    const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
    const navigate = useNavigate();
    const [filter, setFilter] = useState(TAB_ALL);

    const list = useMemo(() => {
        if (filter === TAB_UNREAD) return notifications.filter((n) => !n.read);
        return notifications;
    }, [notifications, filter]);

    const formatTime = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
    };

    const handleOpen = (item) => {
        markAsRead(item.id);
        if (item.link) navigate(item.link);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-serif tracking-tight text-[var(--text-primary)] mb-1">Thông báo</h1>
                    <p className="text-[var(--text-secondary)] text-sm">Tất cả thông báo từ Deep Research và các tính năng khác</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={markAllRead}
                        className="px-4 py-2 text-xs uppercase tracking-wider border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                    >
                        Đánh dấu đã đọc tất cả
                    </button>
                )}
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setFilter(TAB_ALL)}
                    className={`px-4 py-2 text-xs font-medium uppercase tracking-wider border transition-colors ${filter === TAB_ALL
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]'
                            : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]'
                        }`}
                >
                    Tất cả
                    {notifications.length > 0 && (
                        <span className="ml-1.5 opacity-80">({notifications.length})</span>
                    )}
                </button>
                <button
                    onClick={() => setFilter(TAB_UNREAD)}
                    className={`px-4 py-2 text-xs font-medium uppercase tracking-wider border transition-colors ${filter === TAB_UNREAD
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]'
                            : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]'
                        }`}
                >
                    Chưa đọc
                    {unreadCount > 0 && <span className="ml-1.5 opacity-80">({unreadCount})</span>}
                </button>
            </div>

            <div className="border border-[var(--border-color)] rounded-sm overflow-hidden bg-[var(--bg-surface)]">
                {list.length === 0 ? (
                    <div className="p-12 text-center text-[var(--text-secondary)] text-sm">
                        {filter === TAB_UNREAD ? 'Không còn thông báo chưa đọc.' : 'Chưa có thông báo nào.'}
                    </div>
                ) : (
                    <ul className="divide-y divide-[var(--border-color)]">
                        {list.map((item) => (
                            <li
                                key={item.id}
                                className={`
                                        flex gap-4 px-5 py-4 transition-colors cursor-pointer
                                        ${item.read ? 'bg-[var(--bg-surface)]' : 'bg-[var(--bg-primary)]'}
                                        hover:bg-[var(--bg-hover)]
                                    `}
                                onClick={() => handleOpen(item)}
                                onKeyDown={(e) => e.key === 'Enter' && handleOpen(item)}
                                role="button"
                                tabIndex={0}
                            >
                                <div className="flex-shrink-0 pt-1.5">
                                    {!item.read && (
                                        <span
                                            className="block w-2 h-2 rounded-full bg-blue-500"
                                            title="Chưa đọc"
                                            aria-hidden
                                        />
                                    )}
                                    {item.read && <span className="block w-2 h-2 rounded-full bg-transparent" aria-hidden />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                        <span className="text-sm font-medium text-[var(--text-primary)]">{item.title}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] border border-[var(--border-color)] px-1.5 py-0.5 rounded">
                                            {TYPE_LABEL[item.type] || item.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)] truncate">{item.description}</p>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1 opacity-80">{formatTime(item.timestamp)}</p>
                                </div>
                                <div className="flex-shrink-0 self-center">
                                    <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                                        Xem
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NotificationPage;
