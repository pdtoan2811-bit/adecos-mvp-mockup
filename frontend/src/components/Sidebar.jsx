import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';

const Sidebar = () => {
    const location = useLocation();
    const [savedCount, setSavedCount] = useState(0);
    const { unreadCount } = useNotifications();

    // Update saved count on mount and when localStorage changes
    React.useEffect(() => {
        const updateCount = () => {
            const saved = JSON.parse(localStorage.getItem('savedPrograms') || '[]');
            setSavedCount(saved.length);
        };

        updateCount();

        // Listen for storage events
        window.addEventListener('storage', updateCount);

        // Custom event for same-tab updates
        window.addEventListener('programSaved', updateCount);

        return () => {
            window.removeEventListener('storage', updateCount);
            window.removeEventListener('programSaved', updateCount);
        };
    }, []);

    const navItems = [
        { path: '/chat', label: 'AI Agent', icon: '🤖' },
        { path: '/projects', label: 'Quản lý dự án', icon: '◫', badge: savedCount },
        { path: '/ads', label: 'Quản lý Ads', icon: '📢' },
        { path: '/experiments', label: 'Thí nghiệm', icon: '🧪' },
        { path: '/deep-research', label: 'Deep Research', icon: '🔍' },
        { path: '/dashboard', label: 'Analytics', icon: '▭' },
        { path: '/notification', label: 'Thông báo', icon: '🔔', unread: true },
    ];

    const { theme, toggleTheme } = useTheme();

    return (
        <div className="w-64 h-screen bg-[var(--bg-primary)] border-r border-[var(--border-color)] flex flex-col flex-shrink-0 transition-colors duration-300">
            {/* Logo/Brand */}
            <div className="px-6 py-6 border-b border-[var(--border-color)]">
                <Link to="/" className="group block">
                    <h1 className="text-2xl font-serif text-[var(--text-primary)] tracking-tight group-hover:opacity-80 transition-opacity">Adecos</h1>
                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mt-1">AI-Powered Platform</p>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center justify-between px-4 py-3 mb-2 rounded-sm
                                transition-all duration-300 group
                                ${isActive
                                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-mono opacity-60">{item.icon}</span>
                                <span className="text-sm font-light tracking-wide">{item.label}</span>
                            </div>
                            {item.unread && unreadCount > 0 ? (
                                <span className="min-w-[1.25rem] px-2 py-0.5 rounded-full text-xs font-mono bg-red-500 text-white text-center">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            ) : item.badge !== undefined && item.badge > 0 ? (
                                <span className={`
                                    px-2 py-0.5 rounded-full text-xs font-mono
                                    ${isActive ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]' : 'bg-[var(--bg-surface)] text-[var(--text-secondary)]'}
                                `}>
                                    {item.badge}
                                </span>
                            ) : null}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-6 pt-6 pb-8 border-t border-[var(--border-color)] flex justify-between items-center">
                <p className="text-xs text-[var(--text-secondary)]">MVP v1.0</p>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-colors"
                    title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
