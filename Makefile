.PHONY: install dev-backend dev-frontend build clean

# Install dependencies for both backend and frontend
install:
	@echo "Installing Backend dependencies..."
	cd backend_shared && go mod download
	@echo "Installing Frontend dependencies..."
	cd frontend_shared && bun install

# Run the Backend in development mode
dev-backend:
	cd backend_shared && go run cmd/server/main.go

# Run the Frontend in development mode
dev-frontend:
	cd frontend_shared && bun run dev

# Build both services
build:
	@echo "Building Backend..."
	cd backend_shared && go build -o server cmd/server/main.go
	@echo "Building Frontend..."
	cd frontend_shared && bun run build

# Clean up build artifacts
clean:
	@echo "Cleaning up..."
	rm -f backend_shared/server
	rm -rf frontend_shared/dist
