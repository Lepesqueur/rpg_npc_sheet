import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export const Modal = ({ isOpen, onClose, children, maxWidth = "max-w-2xl" }) => {
    if (!isOpen) return null;

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return createPortal(
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className={`w-full ${maxWidth} max-h-[95vh] flex flex-col rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-scale-up bg-[#0d0d12]/95 backdrop-blur-md`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 z-20"></div>
                {children}
            </div>
        </div>,
        document.body
    );
};

export const ModalHeader = ({ children, onClose, className = "" }) => (
    <div className={`p-6 border-b border-white/5 bg-black/20 flex items-center justify-between shrink-0 relative z-10 ${className}`}>
        <div className="flex-1 min-w-0">
            {children}
        </div>
        {onClose && (
            <button onClick={onClose} className="ml-4 w-10 h-10 rounded-full flex items-center justify-center text-cyber-gray hover:text-white hover:bg-white/5 transition-all">
                <i className="fa-solid fa-xmark text-xl"></i>
            </button>
        )}
    </div>
);

export const ModalBody = ({ children, className = "" }) => (
    <div className={`p-6 overflow-y-auto custom-scrollbar flex-grow relative z-10 ${className}`}>
        {children}
    </div>
);

export const ModalFooter = ({ children, className = "" }) => (
    <div className={`p-6 border-t border-white/5 bg-black/20 shrink-0 flex items-center justify-end gap-4 relative z-10 ${className}`}>
        {children}
    </div>
);

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar" }) => (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
        <ModalHeader onClose={onClose} className="bg-cyber-red/10 border-cyber-red/20 text-cyber-red">
            <div className="flex items-center gap-3">
                <i className="fa-solid fa-triangle-exclamation text-xl"></i>
                <h3 className="text-xl font-bold uppercase tracking-tight font-display">{title}</h3>
            </div>
        </ModalHeader>
        <ModalBody className="text-cyber-gray font-medium">
            <p>{message}</p>
        </ModalBody>
        <ModalFooter className="bg-black/40">
            <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg border border-white/10 text-white font-bold uppercase text-xs hover:bg-white/5 transition-all"
            >
                {cancelText}
            </button>
            <button
                onClick={onConfirm}
                className="px-8 py-2 rounded-lg bg-cyber-red text-white font-extrabold uppercase text-xs shadow-neon-red hover:scale-105 transition-all"
            >
                {confirmText}
            </button>
        </ModalFooter>
    </Modal>
);
