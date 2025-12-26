# Build Stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache gcc musl-dev

# Copy go mod and sum files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=1 GOOS=linux go build -ldflags="-w -s" -o server cmd/server/main.go

# Runtime Stage
FROM alpine:latest

WORKDIR /app

# Install runtime dependencies (sqlite needs libs)
RUN apk add --no-cache ca-certificates sqlite-libs

# Copy binary from builder
COPY --from=builder /app/server .

# Create data directory for sqlite
RUN mkdir -p /app/data

# Expose port
EXPOSE 8080

# Environment variables (can be overridden)
ENV PORT=8080
ENV DB_PATH=/app/data/tictactoe.db

CMD ["./server"]
