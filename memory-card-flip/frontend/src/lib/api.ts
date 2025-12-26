const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1';

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("token");
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await fetch(`${BASE}${path}`, { ...init, headers });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
    }
    return res.json();
}

export const getMeOrCreate = async (username: string) => {
    return api<{ user: any, token: string }>("/users", {
        method: "POST",
        body: JSON.stringify({ username })
    });
};

export const submitScore = async (moves: number, timeSeconds: number) => {
    return api("/scores", {
        method: "POST",
        body: JSON.stringify({ moves, time_seconds: timeSeconds })
    });
};

export const getLeaderboard = async () => {
    return api<any[]>("/leaderboard");
};

export const getMe = async () => {
    return api<any>("/me");
};
