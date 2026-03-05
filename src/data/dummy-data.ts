export type KpiMetric = {
  label: string
  value: string
  unit: string
  percent: number
  trend: "up" | "down" | "flat"
  trendValue: string
  icon: "cpu" | "memory" | "disk" | "network"
}

export const kpiMetrics: KpiMetric[] = [
  { label: "CPU Usage", value: "72", unit: "%", percent: 72, trend: "up", trendValue: "+3.2%", icon: "cpu" },
  { label: "Memory", value: "58", unit: "%", percent: 58, trend: "down", trendValue: "-1.8%", icon: "memory" },
  { label: "Disk I/O", value: "45", unit: "%", percent: 45, trend: "flat", trendValue: "0.0%", icon: "disk" },
  { label: "Network", value: "3.2", unit: "Gbps", percent: 64, trend: "up", trendValue: "+0.4Gbps", icon: "network" },
]

export type ServerStatus = {
  name: string
  ip: string
  status: "online" | "warning" | "offline"
  uptime: string
}

export const servers: ServerStatus[] = [
  { name: "web-prod-01", ip: "10.0.1.10", status: "online", uptime: "45d 12h" },
  { name: "web-prod-02", ip: "10.0.1.11", status: "online", uptime: "45d 12h" },
  { name: "api-prod-01", ip: "10.0.2.10", status: "online", uptime: "30d 8h" },
  { name: "api-prod-02", ip: "10.0.2.11", status: "warning", uptime: "2d 4h" },
  { name: "db-primary", ip: "10.0.3.10", status: "online", uptime: "90d 6h" },
  { name: "db-replica", ip: "10.0.3.11", status: "online", uptime: "90d 6h" },
  { name: "cache-01", ip: "10.0.4.10", status: "online", uptime: "15d 3h" },
  { name: "worker-01", ip: "10.0.5.10", status: "offline", uptime: "0d 0h" },
]

export type Alert = {
  id: string
  title: string
  severity: "critical" | "warning" | "info"
  status: "open" | "acknowledged" | "resolved"
  timestamp: string
  source: string
}

export const alerts: Alert[] = [
  { id: "INC-001", title: "High CPU on api-prod-02", severity: "critical", status: "open", timestamp: "10 min ago", source: "api-prod-02" },
  { id: "INC-002", title: "Disk space warning on db-primary", severity: "warning", status: "acknowledged", timestamp: "25 min ago", source: "db-primary" },
  { id: "INC-003", title: "worker-01 unreachable", severity: "critical", status: "open", timestamp: "1 hr ago", source: "worker-01" },
  { id: "INC-004", title: "SSL certificate expiring in 7 days", severity: "warning", status: "open", timestamp: "3 hr ago", source: "web-prod-01" },
  { id: "INC-005", title: "Deployment completed successfully", severity: "info", status: "resolved", timestamp: "5 hr ago", source: "ci/cd" },
  { id: "INC-006", title: "Memory usage spike on cache-01", severity: "warning", status: "resolved", timestamp: "8 hr ago", source: "cache-01" },
]

export type UptimeDataPoint = {
  hour: string
  responseTime: number
  errorRate: number
}

export const uptimeData: UptimeDataPoint[] = Array.from({ length: 24 }, (_, i) => {
  const hour = `${String(i).padStart(2, "0")}:00`
  const isSpike = i >= 14 && i <= 16
  return {
    hour,
    responseTime: isSpike ? 180 + Math.random() * 120 : 45 + Math.random() * 30,
    errorRate: isSpike ? 2.5 + Math.random() * 3 : 0.1 + Math.random() * 0.5,
  }
})

export type SystemLoadDataPoint = {
  server: string
  cpu: number
  memory: number
}

export const systemLoadData: SystemLoadDataPoint[] = [
  { server: "web-01", cpu: 65, memory: 72 },
  { server: "web-02", cpu: 58, memory: 68 },
  { server: "api-01", cpu: 45, memory: 52 },
  { server: "api-02", cpu: 88, memory: 76 },
  { server: "db-pri", cpu: 42, memory: 81 },
  { server: "cache", cpu: 35, memory: 45 },
]

export const sidebarNavItems = {
  overview: [
    { title: "Dashboard", icon: "layout-dashboard" as const, isActive: true },
    { title: "Servers", icon: "server" as const },
    { title: "Alerts", icon: "bell" as const },
    { title: "Performance", icon: "activity" as const },
  ],
  infrastructure: [
    { title: "Storage", icon: "hard-drive" as const },
    { title: "Network", icon: "network" as const },
    { title: "Security", icon: "shield" as const },
    { title: "Notifications", icon: "mail" as const },
  ],
  admin: [
    { title: "Users", icon: "users" as const },
    { title: "Console", icon: "terminal" as const },
    { title: "Settings", icon: "settings" as const },
  ],
}
