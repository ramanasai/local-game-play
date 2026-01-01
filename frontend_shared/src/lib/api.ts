const BASE = import.meta.env.VITE_API_BASE || '/api/v1';

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

// Auth
export const login = async (username: string) => {
    return api<{ user: any, token: string }>("/users", {
        method: "POST",
        body: JSON.stringify({ username })
    });
};

export const getMe = async () => {
    return api<any>("/me");
};

// Memory
export const submitMemoryScore = async (moves: number, timeSeconds: number) => {
    return api("/scores", {
        method: "POST",
        body: JSON.stringify({ moves, time_seconds: timeSeconds })
    });
};

export const getMemoryLeaderboard = async (limit = 10) => {
    return api<any[]>(`/leaderboard?limit=${limit}`);
};

// TicTacToe
export const getTicTacToeMove = async (board: string[], xQueue: number[], oQueue: number[]) => {
    return api<{ index: number }>("/play", {
        method: "POST",
        body: JSON.stringify({ board, xQueue, oQueue })
    });
};

export const saveTicTacToeMatch = async (difficulty: string, result: string, moves: number) => {
    return api("/matches", {
        method: "POST",
        body: JSON.stringify({ difficulty, result, moves })
    });
};

export const getTicTacToeStats = async () => {
    return api<any>("/stats");
};

export const getTicTacToeLeaderboard = async (limit = 10) => {
    return api<any[]>(`/leaderboard/tictactoe?limit=${limit}`);
};

// 2048
export const submit2048Score = async (score: number) => {
    return api("/2048/scores", {
        method: "POST",
        body: JSON.stringify({ score })
    });
};

export const get2048Leaderboard = async (limit = 10) => {
    return api<any[]>(`/leaderboard/2048?limit=${limit}`);
};

// Block Blast
export const submitBlockBlastScore = async (score: number) => {
    return api("/blockblast/scores", {
        method: "POST",
        body: JSON.stringify({ score })
    });
};

export const getLeaderboardBlockBlast = async (limit = 10) => {
    return api<any[]>(`/leaderboard/blockblast?limit=${limit}`);
};
