import React, { useState, useEffect } from 'react';

const ProjectModal = ({ isOpen, onClose, project, onSave }) => {
    const [formData, setFormData] = useState({
        brand: '',
        status: 'Đang tìm hiểu',
        data_status: 'Chưa xác minh',
        program_url: '',
        niche: '',
        sub_niche: '',
        micro_niche: [],
        description: '',
        country: '',
        has_bonus: false,
        commission_percent: 0,
        commission_note: '',
        payment_duration: '1 lần',
        payment_time: 'NET30',
        payment_note: '',
        allow_ads: false,
        allow_brand_name: false,
        forbidden_note: ''
    });

    useEffect(() => {
        if (project) {
            setFormData({
                brand: project.brand || '',
                status: project.status || 'Đang tìm hiểu',
                data_status: project.data_status || 'Chưa xác minh',
                program_url: project.program_url || '',
                niche: project.niche || 'SaaS',
                sub_niche: project.sub_niche || '',
                micro_niche: project.micro_niche || [],
                description: project.description || '',
                country: project.country || '',
                has_bonus: project.has_bonus || false,
                commission_percent: project.commission_percent || 0,
                commission_note: project.commission_note || '',
                payment_duration: project.payment_duration || '1 lần',
                payment_time: project.payment_time || 'NET30',
                payment_note: project.payment_note || '',
                allow_ads: project.allow_ads || false,
                allow_brand_name: project.allow_brand_name || project.can_use_brand || false,
                forbidden_note: project.forbidden_note || ''
            });
        }
    }, [project]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRadioChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...project, ...formData });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-4xl rounded-lg shadow-2xl relative flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-card)] z-10 rounded-t-lg">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Chỉnh sửa dự án</h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                    {/* General Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Tên dự án <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Trạng thái dự án <span className="text-red-400">*</span></label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors appearance-none"
                                >
                                    <option value="Đang tìm hiểu">Đang tìm hiểu</option>
                                    <option value="Đang chạy">Đang chạy</option>
                                    <option value="Tạm dừng">Tạm dừng</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Trạng thái dữ liệu <span className="text-red-400">*</span></label>
                                <select
                                    name="data_status"
                                    value={formData.data_status}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors appearance-none"
                                >
                                    <option value="Chưa xác minh">Chưa xác minh</option>
                                    <option value="Đã xác minh">Đã xác minh</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Link dự án <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="program_url"
                                    value={formData.program_url}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors pr-8"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">✓</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Mảng <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="niche"
                                        value={formData.niche}
                                        onChange={handleChange}
                                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xs">▼</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Ngách <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="sub_niche"
                                        value={formData.sub_niche}
                                        onChange={handleChange}
                                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xs">▼</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Ngách con <span className="text-red-400">*</span></label>
                            <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 flex items-center justify-between cursor-pointer">
                                <span className="text-[var(--accent-primary)] bg-[var(--bg-hover)] px-2 py-0.5 rounded text-sm flex items-center gap-1">
                                    Affiliate <span className="cursor-pointer ml-1">✕</span>
                                </span>
                                <span className="text-[var(--text-secondary)] text-sm">Chọn ngách con ▼</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Giới thiệu về dự án <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Nhập thông tin giới chung của dự án"
                                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Quốc gia <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors pl-8"
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🇨🇦</span>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xs">▼</span>
                            </div>
                        </div>
                    </div>

                    {/* Commission Policy */}
                    <div>
                        <h3 className="text-[var(--accent-primary)] font-medium mb-4">Chính sách hoa hồng</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Bonus <span className="text-red-400">*</span></label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.has_bonus ? 'border-[var(--accent-primary)]' : 'border-[var(--border-color)]'}`}>
                                            {formData.has_bonus && <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]"></div>}
                                        </div>
                                        <input type="radio" className="hidden" checked={formData.has_bonus} onChange={() => handleRadioChange('has_bonus', true)} />
                                        <span className="text-sm text-[var(--text-primary)]">Có bonus</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!formData.has_bonus ? 'border-[var(--accent-primary)]' : 'border-[var(--border-color)]'}`}>
                                            {!formData.has_bonus && <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]"></div>}
                                        </div>
                                        <input type="radio" className="hidden" checked={!formData.has_bonus} onChange={() => handleRadioChange('has_bonus', false)} />
                                        <span className="text-sm text-[var(--text-primary)]">Không có bonus</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Phần trăm hoa hồng <span className="text-red-400">*</span></label>
                                <input
                                    type="number"
                                    name="commission_percent"
                                    value={formData.commission_percent}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Ghi chú</label>
                            <input
                                type="text"
                                name="commission_note"
                                value={formData.commission_note}
                                onChange={handleChange}
                                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Payment Policy */}
                    <div>
                        <h3 className="text-[var(--accent-primary)] font-medium mb-4">Chính sách trả thưởng</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Thời hạn nhận hoa hồng <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="payment_duration"
                                        value={formData.payment_duration}
                                        onChange={handleChange}
                                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xs">▼</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Thời gian trả hoa hồng <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="payment_time"
                                        value={formData.payment_time}
                                        onChange={handleChange}
                                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-xs">▼</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Ghi chú</label>
                            <input
                                type="text"
                                name="payment_note"
                                value={formData.payment_note}
                                onChange={handleChange}
                                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Forbidden Policy */}
                    <div>
                        <h3 className="text-[var(--accent-primary)] font-medium mb-4">Chính sách cấm</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Chạy ADS <span className="text-red-400">*</span></label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.allow_ads ? 'border-[var(--accent-primary)]' : 'border-[var(--border-color)]'}`}>
                                            {formData.allow_ads && <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]"></div>}
                                        </div>
                                        <input type="radio" className="hidden" checked={formData.allow_ads} onChange={() => handleRadioChange('allow_ads', true)} />
                                        <span className="text-sm text-[var(--text-primary)]">Được chạy</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!formData.allow_ads ? 'border-[var(--accent-primary)]' : 'border-[var(--border-color)]'}`}>
                                            {!formData.allow_ads && <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]"></div>}
                                        </div>
                                        <input type="radio" className="hidden" checked={!formData.allow_ads} onChange={() => handleRadioChange('allow_ads', false)} />
                                        <span className="text-sm text-[var(--text-primary)]">Không được chạy</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Chạy Brand Name <span className="text-red-400">*</span></label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.allow_brand_name ? 'border-[var(--accent-primary)]' : 'border-[var(--border-color)]'}`}>
                                            {formData.allow_brand_name && <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]"></div>}
                                        </div>
                                        <input type="radio" className="hidden" checked={formData.allow_brand_name} onChange={() => handleRadioChange('allow_brand_name', true)} />
                                        <span className="text-sm text-[var(--text-primary)]">Được chạy</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!formData.allow_brand_name ? 'border-[var(--accent-primary)]' : 'border-[var(--border-color)]'}`}>
                                            {!formData.allow_brand_name && <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]"></div>}
                                        </div>
                                        <input type="radio" className="hidden" checked={!formData.allow_brand_name} onChange={() => handleRadioChange('allow_brand_name', false)} />
                                        <span className="text-sm text-[var(--text-primary)]">Không được chạy</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Ghi chú</label>
                            <input
                                type="text"
                                name="forbidden_note"
                                value={formData.forbidden_note}
                                onChange={handleChange}
                                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-3 py-2 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border-color)] flex justify-end gap-3 sticky bottom-0 bg-[var(--bg-card)] rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-[var(--accent-primary)] hover:opacity-90 text-[var(--text-inverse)] rounded text-sm font-medium transition-colors shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.3)]"
                    >
                        Lưu thông tin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
