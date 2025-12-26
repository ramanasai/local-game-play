FRONTEND_DIR=frontend
BACKEND_DIR=backend

.PHONY: dev dev-fe dev-be install build migrate fmt lint docker-up docker-down

install:
	cd $(FRONTEND_DIR) && bun install

dev:
	(bunx concurrently -k -n FE,BE "cd $(FRONTEND_DIR) && bun run dev" "cd $(BACKEND_DIR) && go run cmd/server/main.go")

dev-fe:
	cd $(FRONTEND_DIR) && bun run dev

dev-be:
	cd $(BACKEND_DIR) && go run cmd/server/main.go

build:
	cd $(FRONTEND_DIR) && bun run build
	cd $(BACKEND_DIR) && go build -o main ./cmd/server

migrate:
	cd $(BACKEND_DIR) && go run cmd/server/main.go -migrate

fmt:
	cd $(FRONTEND_DIR) && bun run format
	cd $(BACKEND_DIR) && go fmt ./...

lint:
	cd $(FRONTEND_DIR) && bun run lint
	cd $(BACKEND_DIR) && golangci-lint run || true

docker-up:
	cd frontend && bun run build
	docker-compose up --build

docker-down:
	docker-compose down
