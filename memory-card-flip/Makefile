FRONTEND_DIR=frontend
BACKEND_DIR=backend

.PHONY: dev dev-fe dev-be install build migrate fmt lint

install:
	cd $(FRONTEND_DIR) && bun install

dev:                           ## run FE (bun) + BE (air)
	(bunx concurrently -k -n FE,BE "cd $(FRONTEND_DIR) && bun run dev" "cd $(BACKEND_DIR) && $$(go env GOPATH)/bin/air")

dev-fe:
	cd $(FRONTEND_DIR) && bun run dev

dev-be:
	cd $(BACKEND_DIR) && $$(go env GOPATH)/bin/air

build:
	cd $(FRONTEND_DIR) && bun run build

migrate:
	cd $(BACKEND_DIR) && goose -dir migrations sqlite3 $${DB_PATH:-./data/app.db} up

fmt:
	cd $(FRONTEND_DIR) && bun run format
	cd $(BACKEND_DIR) && go fmt ./...

lint:
	cd $(FRONTEND_DIR) && bun run lint
	cd $(BACKEND_DIR) && golangci-lint run || true

docker-up:
	cd $(FRONTEND_DIR) && bun run build
	docker-compose up --build

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f
