import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { uptimeData } from "@/data/dummy-data"

const chartConfig = {
  responseTime: {
    label: "Response Time (ms)",
    color: "var(--chart-1)",
  },
  errorRate: {
    label: "Error Rate (%)",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function UptimeChart() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Uptime & Response Time (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={uptimeData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillResponseTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillErrorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={3}
              fontSize={12}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              width={40}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              width={30}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              yAxisId="left"
              dataKey="responseTime"
              type="monotone"
              fill="url(#fillResponseTime)"
              stroke="var(--chart-1)"
              strokeWidth={2}
            />
            <Area
              yAxisId="right"
              dataKey="errorRate"
              type="monotone"
              fill="url(#fillErrorRate)"
              stroke="var(--chart-5)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
