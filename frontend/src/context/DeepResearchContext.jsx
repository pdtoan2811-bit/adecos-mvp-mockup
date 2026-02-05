import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DeepResearchContext = createContext();

export const useDeepResearch = () => {
    const context = useContext(DeepResearchContext);
    if (!context) {
        throw new Error('useDeepResearch must be used within a DeepResearchProvider');
    }
    return context;
};

export const DeepResearchProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const startResearch = useCallback((query) => {
        const newTask = {
            id: generateId(),
            query,
            status: 'running', // pending, running, completed
            progress: 0,
            startTime: new Date().toISOString(),
            eta: '15:00', // 15 minutes
            logs: ['Initializing Research Agent...', `Đang xác định sources cho "${query}"...`],
            result: null,
            lastUpdated: Date.now()
        };
        setTasks(prev => [newTask, ...prev]);
        return newTask.id;
    }, []);

    const fastForward = useCallback((taskId) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    status: 'completed',
                    progress: 100,
                    eta: '00:00',
                    logs: [...task.logs, 'Affiliate program analysis hoàn tất (Fast Forwarded).', 'Report đã được tạo.'],
                    result: {
                        summary: `Đã hoàn thành Deep Research cho "${task.query}". Tìm thấy các Affiliate Programs tiềm năng với verified payouts.`,
                        data: 'Mock Data Result' // Can be expanded later
                    }
                };
            }
            return task;
        }));
    }, []);

    // Simulation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setTasks(prevTasks => {
                let hasUpdates = false;
                const updatedTasks = prevTasks.map(task => {
                    if (task.status === 'running') {
                        // Simulate slow progress (15 minutes = 900 seconds)
                        // Update roughly every second. 100 / 900 ~= 0.11% per second
                        const increment = 0.1 + Math.random() * 0.2;
                        const newProgress = Math.min(task.progress + increment, 99);

                        // Update logs occasionally
                        let newLogs = task.logs;
                        if (Math.random() > 0.95) {
                            const possibleLogs = [
                                'Phân tích competitor commission structures...',
                                'Verifying cookie durations và attribution...',
                                'Checking network legitimacy scores...',
                                'Scanning specialized affiliate directories...',
                                'Đang đọc partner terms & conditions...',
                                'Compiling EPC (Earnings Per Click) data...'
                            ];
                            const randomLog = possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
                            if (!newLogs.includes(randomLog)) {
                                newLogs = [...newLogs, randomLog];
                            }
                        }

                        // Calculate ETA
                        const elapsedSeconds = (Date.now() - task.lastUpdated) / 1000; // Not quite accurate for total time but ok for decrement
                        // Fixed decrement logic for demo
                        // Let's just base ETA on progress. 
                        // 15 mins total. Remaining % * 15m
                        const remainingRatio = (100 - newProgress) / 100;
                        const remainingSeconds = remainingRatio * 15 * 60;
                        const mins = Math.floor(remainingSeconds / 60);
                        const secs = Math.floor(remainingSeconds % 60);
                        const eta = `${mins}:${secs.toString().padStart(2, '0')}`;

                        hasUpdates = true;
                        return {
                            ...task,
                            progress: newProgress,
                            logs: newLogs,
                            eta
                        };
                    }
                    return task;
                });
                return hasUpdates ? updatedTasks : prevTasks;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const value = {
        tasks,
        startResearch,
        fastForward
    };

    return (
        <DeepResearchContext.Provider value={value}>
            {children}
        </DeepResearchContext.Provider>
    );
};
