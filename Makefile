DOCKER_BACKEND_NAME := backend_shared
DOCKER_FRONTEND_NAME := frontend_shared

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
	cd frontend_shared && bun run dev --host

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

docker-build-backend:
	docker build -t $(DOCKER_BACKEND_NAME) infra/backend_shared -f Dockerfile .

docker-build-frontend:
	docker build -t $(DOCKER_FRONTEND_NAME) infra/frontend_shared -f Dockerfile .

# Docker
docker-build:
	@echo "Building Backend..."
	docker build -t $(DOCKER_BACKEND_NAME) -f ./backend_shared/Dockerfile .
	@echo "Building Frontend..."
	docker build -t $(DOCKER_FRONTEND_NAME) -f ./frontend_shared/Dockerfile .

docker-up:
	@echo "Starting Docker containers..."
	@docker compose -f ./infra/docker-compose.yml up -d

docker-down:
	@echo "Stopping Docker containers..."
	@docker compose -f ./infra/docker-compose.yml down -v

# Security
scan-backend:
	@echo "Scanning Backend Image..."
	@mkdir -p trivy-results
	docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
		-v $(PWD)/.trivy-cache:/root/.cache/ \
		-v $(PWD)/trivy-results:/reports \
		aquasec/trivy image --format table --output /reports/backend.txt $(DOCKER_BACKEND_NAME)
	@echo "Report saved to trivy-results/backend.txt"

scan-frontend:
	@echo "Scanning Frontend Image..."
	@mkdir -p trivy-results
	docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
		-v $(PWD)/.trivy-cache:/root/.cache/ \
		-v $(PWD)/trivy-results:/reports \
		aquasec/trivy image --format table --output /reports/frontend.txt $(DOCKER_FRONTEND_NAME)
	@echo "Report saved to trivy-results/frontend.txt"

scan-fs:
	@echo "Scanning Filesystem..."
	@mkdir -p trivy-results
	docker run --rm -v $(PWD):/app \
		-v $(PWD)/.trivy-cache:/root/.cache/ \
		-v $(PWD)/trivy-results:/reports \
		aquasec/trivy fs --format table --output /reports/fs.txt /app
	@echo "Report saved to trivy-results/fs.txt"
