import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { alerts as initialAlerts, type Alert } from "@/data/dummy-data"
import { toast } from "sonner"
import { CheckCircle, XCircle } from "lucide-react"

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
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [resolveTarget, setResolveTarget] = useState<Alert | null>(null)

  function handleAcknowledge(alert: Alert) {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id ? { ...a, status: "acknowledged" as const } : a
      )
    )
    toast.success("Alert acknowledged", { description: alert.title })
  }

  function handleResolve(alert: Alert) {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id ? { ...a, status: "resolved" as const } : a
      )
    )
    toast.success("Alert resolved", { description: alert.title })
    setResolveTarget(null)
  }

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
              <TableHead className="text-right w-[100px]">Actions</TableHead>
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
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {alert.status === "open" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Acknowledge"
                        onClick={() => handleAcknowledge(alert)}
                      >
                        <CheckCircle className="size-3.5" />
                      </Button>
                    )}
                    {alert.status !== "resolved" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Resolve"
                        onClick={() => setResolveTarget(alert)}
                      >
                        <XCircle className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <ConfirmDialog
        open={!!resolveTarget}
        onOpenChange={(open) => {
          if (!open) setResolveTarget(null)
        }}
        title="Resolve Alert"
        description={resolveTarget ? `Mark "${resolveTarget.title}" as resolved?` : ""}
        confirmLabel="Resolve"
        variant="default"
        onConfirm={() => resolveTarget && handleResolve(resolveTarget)}
      />
    </Card>
  )
}
