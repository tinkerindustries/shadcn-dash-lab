import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { alerts, type Alert } from "@/data/dummy-data"

const severityVariant: Record<Alert["severity"], "destructive" | "secondary" | "outline"> = {
  critical: "destructive",
  warning: "secondary",
  info: "outline",
}

const statusVariant: Record<Alert["status"], "default" | "secondary" | "outline"> = {
  open: "default",
  acknowledged: "secondary",
  resolved: "outline",
}

export function AlertsTable() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Active Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Incident</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="font-mono text-xs">{alert.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.source}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={severityVariant[alert.severity]} className="capitalize">
                    {alert.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[alert.status]} className="capitalize">
                    {alert.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {alert.timestamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
