package middleware

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/zerolog/log"
)

// RequestLogger returns a middleware that logs HTTP requests using zerolog
func RequestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)

		next.ServeHTTP(ww, r)

		log.Info().
			Str("method", r.Method).
			Str("path", r.URL.Path).
			Int("status", ww.Status()).
			Dur("duration", time.Since(start)).
			Str("user_agent", r.UserAgent()).
			Str("request_id", middleware.GetReqID(r.Context())).
			Str("remote_addr", r.RemoteAddr).
			Float64("duration_ms", float64(time.Since(start).Milliseconds())).
			Msg("HTTP Request")
	})
}
