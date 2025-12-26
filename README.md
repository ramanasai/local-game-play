# Local Games Arcade

A unified arcade platform combining **Memory Card Flip** and **Infinite Tic-Tac-Toe** into a single modern web application.

## 🎮 Games

1.  **Memory Card Flip**: Test your memory by matching pairs of cards against the clock. Features multiple difficulty levels and a persistent leaderboard.
2.  **Tic-Tac-Toe (Infinite)**: A twist on the classic game. You can only have 3 pieces on the board at once; placing a 4th removes your oldest piece. Play against a Minimax AI or a friend.

## 🛠️ Tech Stack

-   **Backend**: Go (Golang), Chi Router, SQLite.
-   **Frontend**: React, Vite, TypeScript, Tailwind CSS v4, Framer Motion, Zustand.
-   **Package Manager**: Bun (Frontend).

## 🚀 Getting Started

### Prerequisites

-   [Go](https://go.dev/dl/) (v1.23+)
-   [Bun](https://bun.sh/) (v1.0+)

### Installation

Use the provided Makefile to install dependencies for both services:

```bash
make install
```

### Running the App

You will need two terminal windows to run the full stack (or use a tool like `concurrently` if you prefer).

**Terminal 1: Backend**
```bash
make dev-backend
```
Server runs on `http://localhost:8080`.

**Terminal 2: Frontend**
```bash
make dev-frontend
```
Frontend runs on `http://localhost:5173`.

## 📂 Project Structure

-   `backend_shared/`: The Go API server.
-   `frontend_shared/`: The React client.
-   `memory-card-flip/`: (Legacy) Original Memory game source.
-   `tictactoe-minimax/`: (Legacy) Original TicTacToe game source.

## ✨ Features

-   **Shared Auth**: Create a user once to play both games.
-   **Unified Dashboard**: Select your game from a sleek, arcade-style home screen.
-   **Responsive Design**: optimized for both desktop and mobile play.
