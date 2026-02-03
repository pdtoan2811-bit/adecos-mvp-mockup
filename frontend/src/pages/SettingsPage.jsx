import React, { useState, useEffect } from 'react';

const SettingsPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newAccount, setNewAccount] = useState({ name: '', id: '', platform: 'Google Ads' });

    useEffect(() => {
        const saved = localStorage.getItem('adsAccounts');
        if (saved) {
            setAccounts(JSON.parse(saved));
        }
    }, []);

    const saveAccounts = (updatedAccounts) => {
        setAccounts(updatedAccounts);
        localStorage.setItem('adsAccounts', JSON.stringify(updatedAccounts));
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newAccount.name || !newAccount.id) return;

        const updated = [...accounts, { ...newAccount, connectedAt: new Date().toISOString() }];
        saveAccounts(updated);
        setNewAccount({ name: '', id: '', platform: 'Google Ads' });
        setIsAdding(false);
    };

    const handleDelete = (index) => {
        const updated = accounts.filter((_, i) => i !== index);
        saveAccounts(updated);
    };

    return (
        <div className="flex-1 p-8 overflow-auto bg-black text-white">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif text-white mb-2">Cài đặt</h1>
                    <p className="text-luxury-gray text-sm">Quản lý tài khoản và kết nối</p>
                </div>

                <div className="border border-white/10 rounded-sm p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-serif">Tài khoản quảng cáo</h2>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="px-4 py-2 bg-white text-black text-xs uppercase tracking-wider font-medium hover:bg-gray-200 transition-colors"
                        >
                            + Thêm tài khoản
                        </button>
                    </div>

                    {isAdding && (
                        <form onSubmit={handleAdd} className="mb-8 p-4 border border-white/10 bg-white/5 rounded-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs text-luxury-gray mb-1">Tên gợi nhớ</label>
                                    <input
                                        type="text"
                                        value={newAccount.name}
                                        onChange={e => setNewAccount({ ...newAccount, name: e.target.value })}
                                        className="w-full bg-black border border-white/20 p-2 text-sm text-white focus:border-white"
                                        placeholder="Ví dụ: Tài khoản chính"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-luxury-gray mb-1">Account ID</label>
                                    <input
                                        type="text"
                                        value={newAccount.id}
                                        onChange={e => setNewAccount({ ...newAccount, id: e.target.value })}
                                        className="w-full bg-black border border-white/20 p-2 text-sm text-white focus:border-white"
                                        placeholder="123-456-7890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-luxury-gray mb-1">Nền tảng</label>
                                    <select
                                        value={newAccount.platform}
                                        onChange={e => setNewAccount({ ...newAccount, platform: e.target.value })}
                                        className="w-full bg-black border border-white/20 p-2 text-sm text-white focus:border-white"
                                    >
                                        <option>Google Ads</option>
                                        <option>Facebook Ads</option>
                                        <option>TikTok Ads</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="px-3 py-1 text-xs text-luxury-gray hover:text-white"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-white/10 text-white text-xs uppercase tracking-wider hover:bg-white/20"
                                >
                                    Lưu kết nối
                                </button>
                            </div>
                        </form>
                    )}

                    {accounts.length === 0 ? (
                        <div className="text-center py-8 text-luxury-gray text-sm">
                            Chưa có tài khoản nào được kết nối.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {accounts.map((acc, index) => (
                                <div key={index} className="flex justify-between items-center p-4 border border-white/5 hover:border-white/20 transition-colors bg-white/5 rounded-sm">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${acc.platform === 'Google Ads' ? 'bg-blue-500' : acc.platform === 'Facebook Ads' ? 'bg-blue-700' : 'bg-black border border-white'}`}></div>
                                        <div>
                                            <div className="text-sm font-medium">{acc.name}</div>
                                            <div className="text-xs text-luxury-gray">{acc.platform} • ID: {acc.id}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-green-400">● Đã kết nối</span>
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className="text-luxury-gray hover:text-red-400 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
