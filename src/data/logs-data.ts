export type LogLevel = "debug" | "info" | "warn" | "error"

export type LogEntry = {
  id: number
  timestamp: string
  level: LogLevel
  source: string
  message: string
}

const sources = [
  "nginx-proxy",
  "api-gateway",
  "web-app",
  "auth-service",
  "postgres-primary",
  "redis-cache",
  "worker-queue",
  "celery-worker-1",
  "prometheus",
  "grafana",
  "loki",
]

const templates: Record<LogLevel, string[]> = {
  debug: [
    "Request context initialized, trace_id=%TRACE%",
    "Cache lookup for key session:%ID%, hit=true",
    "Database pool status: active=3, idle=7, total=10",
    "Parsing request body, content-length=1284",
    "Resolved upstream to 10.0.2.%N%:8080",
    "Middleware chain completed in %MS%ms",
    "GC pause: 2.%N%ms, heap_size=128MB",
    "Connection reuse, keep-alive timeout=60s",
    "Template rendered: dashboard.html (%MS%ms)",
    "Feature flag evaluated: dark_mode=true, user=%ID%",
  ],
  info: [
    'GET /api/v1/servers 200 %MS%ms',
    'POST /api/v1/auth/login 200 %MS%ms - user_id=%ID%',
    'GET /api/v1/containers 200 %MS%ms',
    "Worker picked up job queue:email id=%TRACE%",
    'GET /healthz 200 1ms',
    "Deployment webhook received, commit=%HASH%",
    'PUT /api/v1/settings 200 %MS%ms',
    "Scheduled backup started, target=s3://infraops-backup",
    'GET /api/v1/metrics 200 %MS%ms',
    "Certificate renewal check passed, expires_in=42d",
    'DELETE /api/v1/sessions/%ID% 204 %MS%ms',
    "Container health check passed: web-app (attempt 1/3)",
    "Config reload completed, 3 upstreams refreshed",
    "Rate limiter: 847/1000 requests in current window",
    "SSE connection established, client=%ID%",
  ],
  warn: [
    "Slow query detected: SELECT * FROM events WHERE... (%SLOW%ms)",
    "High memory usage: 89% of 2048MB limit",
    "Connection pool near capacity: 18/20 active connections",
    "Retry attempt 2/3 for upstream 10.0.2.%N%:8080",
    "Request rate approaching limit: 920/1000 per minute",
    "Disk usage at 78% on /var/lib/docker",
    "Deprecated API endpoint called: /api/v0/users",
    "TLS handshake timeout after 5000ms, client=%IP%",
    "Response time degraded: p99=%SLOW%ms (threshold: 500ms)",
    "Stale cache entry evicted, key=metrics:%ID%, age=3602s",
  ],
  error: [
    "Connection refused: 10.0.3.%N%:5432 (postgres)",
    "JWT validation failed: token expired, user_id=%ID%",
    "OOM kill: celery-worker-2 exceeded 1024MB limit",
    "Unhandled exception in /api/v1/deploy: TypeError: Cannot read properties of undefined (reading 'sha')",
    "Failed to write to disk: /var/log/app.log (No space left on device)",
    "SSL certificate verification failed for upstream grafana.internal",
    "Database migration failed: relation \"deployments\" already exists",
    "Queue consumer disconnected: channel closed by broker",
    "Request timeout after 30000ms: POST /api/v1/reports/generate",
    "CORS rejected: origin https://malicious.example not allowed",
  ],
}

function randomHex(len: number): string {
  return Array.from({ length: len }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("")
}

function fillTemplate(template: string): string {
  return template
    .replace(/%MS%/g, String(Math.floor(Math.random() * 200) + 5))
    .replace(/%SLOW%/g, String(Math.floor(Math.random() * 2000) + 500))
    .replace(/%ID%/g, String(Math.floor(Math.random() * 90000) + 10000))
    .replace(/%N%/g, String(Math.floor(Math.random() * 20) + 10))
    .replace(/%TRACE%/g, randomHex(16))
    .replace(/%HASH%/g, randomHex(7))
    .replace(/%IP%/g, `${192}.${168}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`)
}

function pickLevel(i: number, total: number): LogLevel {
  // Create realistic distribution with occasional bursts
  const burstCenter = Math.floor(total * 0.6)
  const inBurst = Math.abs(i - burstCenter) < total * 0.03

  if (inBurst) {
    const r = Math.random()
    if (r < 0.4) return "error"
    if (r < 0.7) return "warn"
    return "info"
  }

  const r = Math.random()
  if (r < 0.02) return "error"
  if (r < 0.08) return "warn"
  if (r < 0.25) return "debug"
  return "info"
}

export function generateLogs(count: number): LogEntry[] {
  const logs: LogEntry[] = []
  const baseTime = new Date("2026-03-06T06:00:00Z")

  for (let i = 0; i < count; i++) {
    const level = pickLevel(i, count)
    const levelTemplates = templates[level]
    const template = levelTemplates[Math.floor(Math.random() * levelTemplates.length)]

    // Spread logs across ~18 hours, with some clustering
    const msOffset = (i / count) * 18 * 60 * 60 * 1000 + Math.random() * 2000
    const ts = new Date(baseTime.getTime() + msOffset)

    const hours = String(ts.getHours()).padStart(2, "0")
    const minutes = String(ts.getMinutes()).padStart(2, "0")
    const seconds = String(ts.getSeconds()).padStart(2, "0")
    const ms = String(ts.getMilliseconds()).padStart(3, "0")

    logs.push({
      id: i,
      timestamp: `${hours}:${minutes}:${seconds}.${ms}`,
      level,
      source: sources[Math.floor(Math.random() * sources.length)],
      message: fillTemplate(template),
    })
  }

  return logs
}

// Pre-generate 5,000 log entries
export const logEntries = generateLogs(5000)
