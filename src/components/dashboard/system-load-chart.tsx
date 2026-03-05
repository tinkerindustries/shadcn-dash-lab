import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { systemLoadData } from "@/data/dummy-data"

const chartConfig = {
  cpu: {
    label: "CPU %",
    color: "var(--chart-1)",
  },
  memory: {
    label: "Memory %",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function SystemLoadChart() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">System Load by Server</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={systemLoadData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="server"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              width={30}
              domain={[0, 100]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="cpu" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="memory" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
