import React, { useState } from 'react';

const AssetManager = ({ assets, onAddAsset }) => {
    const [activeTab, setActiveTab] = useState('payment'); // payment | creative

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full text-[var(--text-primary)]">
            {/* Payment Vault */}
            <div className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-card)] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-serif flex items-center gap-2">
                        <span>💳</span> Payment Vault
                    </h3>
                    <button
                        onClick={() => onAddAsset('paymentMethods', { name: 'New Card', type: 'Credit Card', status: 'Active' })}
                        className="text-xs border border-[var(--border-color)] px-2 py-1 rounded hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors"
                    >
                        + Add Card
                    </button>
                </div>
                <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                    {assets.paymentMethods.map(pm => (
                        <div key={pm.id} className="p-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded hover:border-[var(--border-hover)] transition-colors group">
                            <div className="flex justify-between items-start">
                                <div className="font-mono text-sm text-[var(--text-primary)]">{pm.name}</div>
                                <div className={`text-[10px] px-1.5 py-0.5 rounded ${pm.status === 'Active' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                                    {pm.status}
                                </div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-[var(--text-secondary)]">
                                <span>{pm.type}</span>
                                <span>Exp: {pm.expiry}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Creative Library */}
            <div className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-card)] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-serif flex items-center gap-2">
                        <span>🎨</span> Creative Library
                    </h3>
                    <button
                        onClick={() => onAddAsset('creatives', { name: 'New Creative', type: 'Image', url: '#' })}
                        className="text-xs border border-[var(--border-color)] px-2 py-1 rounded hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-colors"
                    >
                        + Add Creative
                    </button>
                </div>
                <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                    {assets.creatives.map(cr => (
                        <div key={cr.id} className="p-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded hover:border-[var(--border-hover)] transition-colors flex gap-3">
                            <div className="w-12 h-12 bg-[var(--bg-hover)] rounded flex items-center justify-center text-xl">
                                {cr.type === 'Image' ? '🖼️' : cr.type === 'Video' ? '🎥' : '🎠'}
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-[var(--text-primary)]">{cr.name}</div>
                                <div className="text-xs text-[var(--text-secondary)] mt-1 font-mono">{cr.type} • {cr.id}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AssetManager;
