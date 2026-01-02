import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, KeyRound, Lock } from 'lucide-react';
import { updatePin } from '../../lib/api';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [pin, setPin] = useState('');
    const [hint, setHint] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length < 4) {
            setStatus('ERROR');
            setMessage('PIN must be at least 4 digits');
            return;
        }

        setLoading(true);
        setStatus('IDLE');
        try {
            await updatePin(pin, hint);
            setStatus('SUCCESS');
            setMessage('Security settings updated successfully');
            setPin('');
            setHint('');
            setTimeout(() => {
                setStatus('IDLE');
                setMessage('');
                onClose();
            }, 1500);
        } catch (err: any) {
            setStatus('ERROR');
            setMessage(err.message || 'Failed to update PIN');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-gray-900">
                                <Shield className="w-5 h-5" />
                                <h2 className="text-xl font-bold">Security Settings</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Update PIN</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="password"
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="New 4-6 digit PIN"
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all tracking-widest font-mono"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Recovery Hint</label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={hint}
                                            onChange={(e) => setHint(e.target.value)}
                                            placeholder="e.g. Favorite number"
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">This hint will be shown if you enter the wrong PIN.</p>
                                </div>

                                {status === 'ERROR' && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                                        {message}
                                    </div>
                                )}
                                {status === 'SUCCESS' && (
                                    <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg">
                                        {message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Update Security'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
