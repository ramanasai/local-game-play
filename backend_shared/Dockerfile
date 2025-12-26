# -----------------------------
# Stage 1: Build
# -----------------------------
FROM golang:1.25-alpine AS builder

WORKDIR /app

RUN apk add --no-cache gcc musl-dev sqlite-dev

COPY ./backend_shared/go.mod ./backend_shared/go.sum ./
RUN go mod download

COPY ./backend_shared .

RUN CGO_ENABLED=1 GOOS=linux \
    go build -o server ./cmd/server/main.go


# -----------------------------
# Stage 2: Runtime
# -----------------------------
FROM alpine:latest

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

RUN apk add --no-cache sqlite-libs ca-certificates \
    && update-ca-certificates

COPY --from=builder /app/server /app/server

RUN mkdir -p /app/data \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

CMD ["./server"]
