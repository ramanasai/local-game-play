const API_URL = 'http://localhost:8080/api/v1';

export const suggestMove = async (board: string[], xQueue: number[], oQueue: number[]): Promise<number> => {
    const response = await fetch(`${API_URL}/play`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ board, xQueue, oQueue }),
    });

    if (!response.ok) {
        throw new Error('Failed to get move');
    }

    const data = await response.json();
    return data.index;
};
