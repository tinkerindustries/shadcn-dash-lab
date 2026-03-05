import { Cpu, MemoryStick, HardDrive, Network, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { kpiMetrics, type KpiMetric } from "@/data/dummy-data"

const iconMap = {
  cpu: Cpu,
  memory: MemoryStick,
  disk: HardDrive,
  network: Network,
}

const trendIconMap = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
}

const trendColorMap = {
  up: "text-red-500",
  down: "text-green-500",
  flat: "text-muted-foreground",
}

function KpiCard({ metric }: { metric: KpiMetric }) {
  const Icon = iconMap[metric.icon]
  const TrendIcon = trendIconMap[metric.trend]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {metric.value}
          <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>
        </div>
        <Progress value={metric.percent} className="mt-2 h-2" />
        <div className={`flex items-center gap-1 mt-2 text-xs ${trendColorMap[metric.trend]}`}>
          <TrendIcon className="h-3 w-3" />
          <span>{metric.trendValue} from last hour</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function KpiCards() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      style={{ gap: "var(--space-card)" }}
    >
      {kpiMetrics.map((metric) => (
        <KpiCard key={metric.label} metric={metric} />
      ))}
    </div>
  )
}
