import React, { useState } from 'react';

const ResultsTable = ({ data }) => {
    const [sortConfig, setSortConfig] = useState(null);

    const handleSave = (program) => {
        // Get existing saved programs from localStorage
        const savedPrograms = JSON.parse(localStorage.getItem('savedPrograms') || '[]');

        // Check if already saved
        const alreadySaved = savedPrograms.some(p => p.brand === program.brand && p.program_url === program.program_url);

        if (!alreadySaved) {
            // Add timestamp
            const programWithMeta = {
                ...program,
                savedAt: new Date().toISOString()
            };

            // Save to localStorage
            savedPrograms.push(programWithMeta);
            localStorage.setItem('savedPrograms', JSON.stringify(savedPrograms));

            alert(`Đã lưu ${program.brand}!`);
        } else {
            alert(`${program.brand} đã được lưu trước đó!`);
        }
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return data;
        return [...(Array.isArray(data) ? data : [])].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [data, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    if (!data || data.length === 0) return null;

    return (
        <div className="w-full px-6 fade-in-up">
            <div className="relative overflow-hidden rounded-none border-t border-b border-white/10 bg-transparent">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-luxury-white/80 font-sans">
                        <thead className="uppercase text-xs tracking-[0.2em] text-luxury-gray font-light border-b border-white/5">
                            <tr>
                                <th className="px-6 py-6 font-normal">Thương hiệu</th>
                                <th className="px-6 py-6 font-normal">Chương trình</th>
                                <th
                                    className="px-6 py-6 cursor-pointer hover:text-white transition font-normal"
                                    onClick={() => requestSort('commission_percent')}
                                >
                                    Hoa hồng (%) ↕
                                </th>
                                <th className="px-6 py-6 font-normal">Loại HH</th>
                                <th className="px-6 py-6 font-normal text-center">Brand Name</th>
                                <th
                                    className="px-6 py-6 cursor-pointer hover:text-white transition font-normal"
                                    onClick={() => requestSort('traffic_3m')}
                                >
                                    Traffic (3M) ↕
                                </th>
                                <th
                                    className="px-6 py-6 cursor-pointer hover:text-white transition font-normal"
                                    onClick={() => requestSort('legitimacy_score')}
                                >
                                    Điểm AI ↕
                                </th>
                                <th className="px-6 py-6 font-normal"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {sortedData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-white/[0.02] transition-colors duration-300 group"
                                >
                                    <td className="px-6 py-6 font-serif text-xl text-white tracking-tight">{row.brand}</td>
                                    <td className="px-6 py-6">
                                        <a href={row.program_url} target="_blank" rel="noreferrer" className="text-luxury-gray group-hover:text-white transition-colors text-sm border-b border-white/20 hover:border-white pb-0.5">
                                            Truy cập
                                        </a>
                                    </td>
                                    <td className="px-6 py-6 font-mono text-2xl text-white font-semibold">
                                        {row.commission_percent > 0 ? `${row.commission_percent}%` : '—'}
                                    </td>
                                    <td className="px-6 py-6 text-luxury-gray text-xs uppercase tracking-wider">
                                        {row.commission_type || 'N/A'}
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        {row.can_use_brand ? (
                                            <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">✓ Được</span>
                                        ) : (
                                            <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">✗ Không</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-6 font-mono text-sm opacity-60">{row.traffic_3m}</td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <span className="font-serif text-lg">{row.legitimacy_score}</span>
                                            <div className="w-[60px] h-[1px] bg-white/10">
                                                <div
                                                    className="h-full bg-white opacity-40 transition-all duration-1000"
                                                    style={{ width: `${(row.legitimacy_score / 10) * 100}%` }}>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <button
                                            onClick={() => handleSave(row)}
                                            className="px-4 py-2 border border-white/20 hover:border-white hover:bg-white hover:text-black transition-all duration-300 rounded-sm text-xs uppercase tracking-widest"
                                        >
                                            Lưu
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-6 border-t border-white/5 flex justify-between items-center text-xs text-luxury-gray uppercase tracking-widest">
                    <span>{sortedData.length} Kết quả</span>
                </div>
            </div>
        </div>
    );
};

export default ResultsTable;
