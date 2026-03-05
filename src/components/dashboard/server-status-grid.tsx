import { Server } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { servers, type ServerStatus } from "@/data/dummy-data"

const statusVariant: Record<ServerStatus["status"], "default" | "destructive" | "secondary" | "outline"> = {
  online: "default",
  warning: "secondary",
  offline: "destructive",
}

const statusDot: Record<ServerStatus["status"], string> = {
  online: "bg-green-500",
  warning: "bg-yellow-500",
  offline: "bg-red-500",
}

function ServerTile({ server }: { server: ServerStatus }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <Server className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium leading-none">{server.name}</p>
          <p className="text-xs text-muted-foreground mt-1">{server.ip}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge variant={statusVariant[server.status]} className="capitalize">
          <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${statusDot[server.status]}`} />
          {server.status}
        </Badge>
        <span className="text-xs text-muted-foreground">{server.uptime}</span>
      </div>
    </div>
  )
}

export function ServerStatusGrid() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Server Status</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {servers.map((server) => (
          <ServerTile key={server.name} server={server} />
        ))}
      </CardContent>
    </Card>
  )
}
