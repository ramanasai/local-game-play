import { create } from 'zustand';
import { login, getMe } from '../lib/api';

interface User {
    id: string;
    username: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (username: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: true,
    login: async (username: string) => {
        const { user, token } = await login(username);
        localStorage.setItem('token', token);
        set({ user, token });
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
    },
    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isLoading: false });
            return;
        }
        try {
            const user = await getMe();
            set({ user });
        } catch (error) {
            localStorage.removeItem('token');
            set({ user: null, token: null });
        } finally {
            set({ isLoading: false });
        }
    }
}));
