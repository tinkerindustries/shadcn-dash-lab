import { KpiCards } from "./kpi-cards"
import { UptimeChart } from "./uptime-chart"
import { SystemLoadChart } from "./system-load-chart"
import { ServerStatusGrid } from "./server-status-grid"
import { AlertsTable } from "./alerts-table"

export function DashboardPage() {
  return (
    <div className="flex flex-col" style={{ gap: "var(--space-section)" }}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-sm">
          Infrastructure overview and system health
        </p>
      </div>

      <KpiCards />

      <div className="grid lg:grid-cols-7" style={{ gap: "var(--space-section)" }}>
        <div className="lg:col-span-4">
          <UptimeChart />
        </div>
        <div className="lg:col-span-3">
          <SystemLoadChart />
        </div>
      </div>

      <div className="grid lg:grid-cols-7" style={{ gap: "var(--space-section)" }}>
        <div className="lg:col-span-4">
          <AlertsTable />
        </div>
        <div className="lg:col-span-3">
          <ServerStatusGrid />
        </div>
      </div>
    </div>
  )
}
