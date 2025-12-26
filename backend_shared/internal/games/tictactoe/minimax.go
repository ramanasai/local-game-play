package tictactoe

// Constants for board values
const (
	PlayerHuman = "X"
	PlayerAI    = "O"
	Empty       = ""
)

// GetBestMove returns the best move for the AI (PlayerAI/O).
// Returns the index (0-8) of the move.
// Returns -1 if no moves are available.
func GetBestMove(board []string, xQueue, oQueue []int) int {
	bestScore := -1000
	bestMove := -1

	// AI is 'O'. If it has 3 moves, the oldest one (oQueue[0]) will be removed.
	simBoard := make([]string, len(board))
	copy(simBoard, board)

	for i := 0; i < len(board); i++ {
		if board[i] == Empty {
			// Simulate the move

			// 1. Handle Queue Logic for AI
			var newOQueue []int
			removedIndex := -1

			if len(oQueue) >= 3 {
				removedIndex = oQueue[0]
				simBoard[removedIndex] = Empty // Oldest piece disappears
				newOQueue = oQueue[1:]
			} else {
				newOQueue = make([]int, len(oQueue))
				copy(newOQueue, oQueue)
			}
			newOQueue = append(newOQueue, i)

			// 2. Place piece
			simBoard[i] = PlayerAI

			// Run Minimax
			// Decrease depth limit
			score := minimax(simBoard, xQueue, newOQueue, 0, false)

			// Undo the move (backtrack)
			simBoard[i] = Empty
			if removedIndex != -1 {
				simBoard[removedIndex] = PlayerAI // Put it back
			}

			if score > bestScore {
				bestScore = score
				bestMove = i
			}
		}
	}
	return bestMove
}

func minimax(board []string, xQueue, oQueue []int, depth int, isMaximizing bool) int {
	winner := checkWinner(board)
	if winner == PlayerAI {
		return 10 - depth
	}
	if winner == PlayerHuman {
		return depth - 10
	}

	if depth > 4 { // Reduced depth for performance
		return 0
	}

	if isMaximizing {
		bestScore := -1000
		for i := 0; i < len(board); i++ {
			if board[i] == Empty {
				// Simulate AI Move (O)
				var newOQueue []int
				removedIndex := -1

				// Copy board for simulation
				simBoard := make([]string, len(board))
				copy(simBoard, board)

				if len(oQueue) >= 3 {
					removedIndex = oQueue[0]
					simBoard[removedIndex] = Empty
					newOQueue = oQueue[1:]
				} else {
					newOQueue = make([]int, len(oQueue))
					copy(newOQueue, oQueue)
				}
				newOQueue = append(newOQueue, i)
				simBoard[i] = PlayerAI

				score := minimax(simBoard, xQueue, newOQueue, depth+1, false)

				if score > bestScore {
					bestScore = score
				}
			}
		}
		return bestScore
	} else {
		bestScore := 1000
		for i := 0; i < len(board); i++ {
			if board[i] == Empty {
				// Simulate Human Move (X)
				var newXQueue []int
				removedIndex := -1

				// Copy board
				simBoard := make([]string, len(board))
				copy(simBoard, board)

				if len(xQueue) >= 3 {
					removedIndex = xQueue[0]
					simBoard[removedIndex] = Empty
					newXQueue = xQueue[1:]
				} else {
					newXQueue = make([]int, len(xQueue))
					copy(newXQueue, xQueue)
				}
				newXQueue = append(newXQueue, i)
				simBoard[i] = PlayerHuman

				score := minimax(simBoard, newXQueue, oQueue, depth+1, true)

				if score < bestScore {
					bestScore = score
				}
			}
		}
		return bestScore
	}
}

func checkWinner(board []string) string {
	lines := [][]int{
		{0, 1, 2}, {3, 4, 5}, {6, 7, 8}, // Rows
		{0, 3, 6}, {1, 4, 7}, {2, 5, 8}, // Cols
		{0, 4, 8}, {2, 4, 6}, // Diagonals
	}

	for _, line := range lines {
		if board[line[0]] != Empty &&
			board[line[0]] == board[line[1]] &&
			board[line[1]] == board[line[2]] {
			return board[line[0]]
		}
	}
	return ""
}
