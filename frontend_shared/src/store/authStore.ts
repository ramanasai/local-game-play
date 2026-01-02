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
    login: (username: string, pin?: string, hint?: string) => Promise<{ status: string, user?: any }>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: true,
    login: async (username: string, pin?: string, hint?: string) => {
        const response = await login(username, pin, hint);
        if (response.token) {
            localStorage.setItem('token', response.token);
            set({ user: response.user, token: response.token });
        }
        return response;
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
