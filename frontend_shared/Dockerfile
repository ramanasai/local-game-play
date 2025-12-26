# -----------------------------
# Stage 1: Build (Bun)
# -----------------------------
FROM oven/bun:1 AS builder

WORKDIR /app

COPY ./frontend_shared/package.json ./frontend_shared/bun.lockb* ./
RUN bun install --frozen-lockfile

COPY ./frontend_shared .

RUN bun run build


# -----------------------------
# Stage 2: Runtime (Nginx)
# -----------------------------
FROM nginx:alpine

RUN addgroup -S web && adduser -S web -G web

RUN rm /etc/nginx/conf.d/default.conf

COPY ./frontend_shared/nginx.conf /etc/nginx/nginx.conf


COPY --from=builder /app/dist /usr/share/nginx/html

RUN mkdir -p /tmp/client_temp \
    /tmp/proxy_temp \
    /tmp/fastcgi_temp \
    /tmp/uwsgi_temp \
    /tmp/scgi_temp \
    && chown -R web:web \
    /usr/share/nginx \
    /var/log/nginx \
    /var/cache/nginx \
    /tmp

USER web

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
