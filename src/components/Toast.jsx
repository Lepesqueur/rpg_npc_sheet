import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const value = { showToast };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {toasts.map(toast => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, toast.duration);
        return () => clearTimeout(timer);
    }, [toast, onClose]);

    const icons = {
        success: 'fa-circle-check',
        error: 'fa-triangle-exclamation',
        warning: 'fa-circle-exclamation',
        info: 'fa-circle-info'
    };

    const colors = {
        success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20',
        error: 'border-cyber-pink/50 bg-cyber-pink/10 text-cyber-pink shadow-cyber-pink/20',
        warning: 'border-cyber-yellow/50 bg-cyber-yellow/10 text-cyber-yellow shadow-cyber-yellow/20',
        info: 'border-cyber-purple/50 bg-cyber-purple/10 text-cyber-purple shadow-cyber-purple/20'
    };

    return (
        <div className={`
            px-6 py-4 rounded-xl border backdrop-blur-md shadow-lg
            flex items-center gap-4 animate-slide-in-right pointer-events-auto
            ${colors[toast.type]}
        `}>
            <i className={`fa-solid ${icons[toast.type]} text-lg`}></i>
            <span className="font-bold text-sm uppercase tracking-wider">{toast.message}</span>
            <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
};
