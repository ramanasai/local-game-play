import React, { useEffect } from 'react';
import clsx from 'clsx';

interface ToastProps {
    message: string;
    className?: string;
    onClose?: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, className, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <div className={clsx(
            "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down",
            "px-6 py-3 rounded-xl shadow-2xl",
            "bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg",
            "flex items-center gap-2",
            className
        )}>
            <span>🎉</span>
            <span>{message}</span>
        </div>
    );
};
