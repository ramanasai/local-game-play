import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, Delete, Star } from 'lucide-react';
import loginBg from '../../assets/login-bg.png';

type LoginStep = 'USERNAME' | 'PIN' | 'SETUP';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check for pre-filled username from Landing page
    const [step, setStep] = useState<LoginStep>('USERNAME');
    const [username, setUsername] = useState(location.state?.username || '');
    const [pin, setPin] = useState('');
    const [hint, setHint] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Store temporarily to show "Welcome back, [Name]"
    const [tempUser, setTempUser] = useState<any>(null);

    const login = useAuthStore(state => state.login);

    // ----------------------------------------------------
    // HANDLERS
    // ----------------------------------------------------

    const handleUsernameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setLoading(true);
        setError('');
        try {
            const res = await login(username);
            if (res.status === 'OK') {
                navigate('/');
            } else if (res.status === 'PIN_REQUIRED') {
                setTempUser(res.user);
                setStep('PIN');
            } else if (res.status === 'SET_PIN_REQUIRED') {
                setTempUser(res.user);
                setStep('SETUP');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const submitPinAuth = async () => {
        if (pin.length < 4) return;
        setLoading(true);
        setError('');
        try {
            const res = await login(username, pin);
            if (res.status === 'OK') navigate('/');
            else setError('Invalid PIN');
        } catch (err: any) {
            setError('Invalid PIN');
            // Vibrate/Shake effect here normally
            setPin('');
        } finally {
            setLoading(false);
        }
    };

    const submitSetupAuth = async () => {
        if (pin.length < 4) { setError("PIN too short"); return; }
        setLoading(true);
        try {
            const res = await login(username, pin, hint);
            if (res.status === 'OK') navigate('/');
            else setError("Setup failed: " + res.status);
        } catch (err: any) { setError(err.message || "Setup failed"); }
        setLoading(false);
    };

    // ----------------------------------------------------
    // NUMPAD HELPERS
    // ----------------------------------------------------
    const handleNumClick = (num: string) => {
        if (pin.length < 6) {
            const newPin = pin + num;
            setPin(newPin);
            // Auto-submit on PIN screen if length is 4 (assuming 4 digit standard for now, but backend supports hash)
            // Let's rely on manual "Right Arrow" or auto-submit if screen is 'PIN' and length matches known?
            // Actually, for better UX let's wait for user or maybe auto-submit at 4 IF we enforce 4. 
            // Let's Just keep it manual enter or maybe auto-trigger if in 'PIN' mode and length is, say, 4?
            // The reference has 'dots'.
        }
    };

    const handleBackspace = () => {
        setPin(prev => prev.slice(0, -1));
    };

    // Auto submit effect for PIN entry
    /* useEffect(() => {
        if (step === 'PIN' && pin.length === 4) submitPinAuth();
    }, [pin]); */

    // ----------------------------------------------------
    // RENDER
    // ----------------------------------------------------
    return (
        <div className="min-h-screen w-full font-sans flex items-center justify-center p-4 relative overflow-hidden text-gray-900">

            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${loginBg})` }}
            >
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <main className="relative z-10 w-full max-w-sm">
                <AnimatePresence mode="wait">

                    {/* --- STEP 1: USERNAME (Like "Your Phone" screen) --- */}
                    {step === 'USERNAME' && (
                        <motion.div
                            key="username"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-[32px] p-8 shadow-2xl min-h-[500px] flex flex-col"
                        >
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">Who's playing?</h1>
                                <p className="text-gray-500 text-sm mb-8">Enter your username to continue.</p>

                                <form onSubmit={handleUsernameSubmit}>
                                    <div className="mb-6">
                                        <div className="bg-gray-100 rounded-2xl px-5 py-4 flex items-center">
                                            <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-gray-600 text-xs font-bold">@</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Username"
                                                className="bg-transparent w-full text-lg font-bold text-gray-800 outline-none placeholder:text-gray-400"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#FF6B6B] text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-[#FF6B6B]/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
                                    >
                                        {loading ? 'Checking...' : 'Continue'}
                                        {!loading && <ArrowRight size={20} className="ml-2" />}
                                    </button>
                                </form>

                                {error && (
                                    <p className="mt-4 text-center text-red-500 text-sm font-medium bg-red-50 py-2 rounded-lg">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <p className="text-center text-gray-400 text-xs font-medium uppercase tracking-widest">
                                    Local Games Arcade
                                </p>
                            </div>
                        </motion.div>
                    )}


                    {/* --- STEP 2: PIN PAD (Like "Enter Your Pin" screen) --- */}
                    {(step === 'PIN' || step === 'SETUP') && (
                        <motion.div
                            key="pin"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="bg-white rounded-[40px] shadow-2xl overflow-hidden h-full min-h-[600px] flex flex-col relative"
                        >
                            {/* Colorful Header Blob */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B6B] rounded-bl-[100px] -mr-10 -mt-10 opacity-20"></div>

                            <div className="p-8 pb-4">
                                <button
                                    onClick={() => { setStep('USERNAME'); setPin(''); setError(''); }}
                                    className="flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                    <span className="text-sm font-medium ml-1">Back</span>
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col items-center px-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-1">
                                    {step === 'SETUP' ? 'Create PIN' : `Hi, ${tempUser?.username}`}
                                </h2>
                                <p className="text-gray-500 text-sm mb-8 text-center">
                                    {step === 'SETUP' ? 'Secure your new account with a PIN' : 'Enter your PIN to play'}
                                </p>

                                {/* PIN DOTS */}
                                <div className="flex gap-4 mb-2">
                                    {[0, 1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className={`w-4 h-4 rounded-full transition-all duration-300 ${i < pin.length
                                                ? 'bg-[#FF6B6B] scale-110'
                                                : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {error && (
                                    <p className="text-red-500 text-xs font-bold mt-4 h-4">{error}</p>
                                )}

                                {/* Numpad */}
                                <div className="grid grid-cols-3 gap-x-8 gap-y-6 mt-auto mb-8 w-full max-w-[280px]">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handleNumClick(num.toString())}
                                            className="w-16 h-16 rounded-full text-2xl font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center outline-none"
                                        >
                                            {num}
                                        </button>
                                    ))}

                                    {/* Empty Slot / Hint Toggle? */}
                                    <div className="flex items-center justify-center">
                                        {tempUser?.hint && step === 'PIN' && (
                                            <button
                                                title={`Hint: ${tempUser.hint}`}
                                                className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center"
                                                onClick={() => setError(`Hint: ${tempUser.hint}`)}
                                            >
                                                <Star size={16} fill="currentColor" />
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleNumClick('0')}
                                        className="w-16 h-16 rounded-full text-2xl font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center outline-none"
                                    >
                                        0
                                    </button>

                                    <button
                                        onClick={handleBackspace}
                                        className="w-16 h-16 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center outline-none"
                                    >
                                        <Delete size={24} />
                                    </button>
                                </div>

                                {/* Submit Actions */}
                                <div className="w-full mb-8">
                                    {step === 'SETUP' && (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Recovery Hint (Recommended)"
                                                value={hint}
                                                onChange={(e) => setHint(e.target.value)}
                                                className="w-full text-center bg-gray-50 border-none rounded-xl py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-[#FF6B6B]/20 outline-none"
                                            />
                                            <button
                                                onClick={submitSetupAuth}
                                                disabled={pin.length < 4 || loading}
                                                className="w-full bg-[#FF6B6B] text-white font-bold py-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:shadow-none transition-all"
                                            >
                                                {loading ? 'Creating...' : 'Set PIN'}
                                            </button>
                                        </div>
                                    )}

                                    {step === 'PIN' && (
                                        <button
                                            onClick={submitPinAuth}
                                            disabled={pin.length < 4 || loading}
                                            className="w-full bg-[#FF6B6B] text-white font-bold py-4 rounded-2xl shadow-lg disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                                        >
                                            {loading ? 'Verifying...' : 'Unlock'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Decorative Bottom Shape */}
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#2ECC71] rounded-tr-[120px] -ml-10 -mb-10 opacity-20 pointer-events-none"></div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
};

export default Login;
