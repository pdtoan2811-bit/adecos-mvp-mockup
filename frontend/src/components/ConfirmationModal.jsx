import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return createPortal(
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`
                relative bg-[var(--bg-secondary)] border border-[var(--border-color)] 
                rounded-sm shadow-2xl w-full max-w-md p-6 transform transition-all duration-300
                ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
            `}>
                <div className="mb-4">
                    <h3 className="text-xl font-serif text-[var(--text-primary)] mb-2 tracking-tight">
                        {title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface)] rounded-sm"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`
                            px-4 py-2 text-xs uppercase tracking-widest text-white rounded-sm
                            transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5
                            ${isDangerous ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-500'}
                        `}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;
