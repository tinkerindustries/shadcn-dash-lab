import { useState, useMemo } from "react"
import {
  Play,
  Square,
  RotateCcw,
  Pause,
  Trash2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { containers, type Container, type ContainerStatus } from "@/data/containers-data"

const statusConfig: Record<ContainerStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  running: { label: "Running", variant: "default" },
  paused: { label: "Paused", variant: "secondary" },
  restarting: { label: "Restarting", variant: "outline" },
  stopped: { label: "Stopped", variant: "destructive" },
  exited: { label: "Exited", variant: "destructive" },
}

type SortField = "name" | "status" | "cpu" | "memory" | "image" | "network"
type SortDir = "asc" | "desc"

function MemoryBar({ used, limit }: { used: number; limit: number }) {
  const pct = limit > 0 ? (used / limit) * 100 : 0
  return (
    <div className="flex items-center gap-2">
      <div className="bg-muted h-2 w-20 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${pct > 80 ? "bg-destructive" : pct > 50 ? "bg-chart-4" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-muted-foreground text-xs whitespace-nowrap">
        {used}/{limit} MB
      </span>
    </div>
  )
}

export function ContainersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [networkFilter, setNetworkFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const networks = useMemo(
    () => [...new Set(containers.map((c) => c.network))].sort(),
    [],
  )

  const filtered = useMemo(() => {
    let result = containers

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.image.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q),
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }

    if (networkFilter !== "all") {
      result = result.filter((c) => c.network === networkFilter)
    }

    result = [...result].sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case "name":
          cmp = a.name.localeCompare(b.name)
          break
        case "status":
          cmp = a.status.localeCompare(b.status)
          break
        case "cpu":
          cmp = a.cpu - b.cpu
          break
        case "memory":
          cmp = a.memory.used - b.memory.used
          break
        case "image":
          cmp = a.image.localeCompare(b.image)
          break
        case "network":
          cmp = a.network.localeCompare(b.network)
          break
      }
      return sortDir === "asc" ? cmp : -cmp
    })

    return result
  }, [search, statusFilter, networkFilter, sortField, sortDir])

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown className="size-3" />
    return sortDir === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
  }

  const summary = useMemo(() => {
    const running = containers.filter((c) => c.status === "running").length
    const stopped = containers.filter((c) => c.status === "stopped" || c.status === "exited").length
    const other = containers.length - running - stopped
    return { total: containers.length, running, stopped, other }
  }, [])

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-section)" }}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Containers</h2>
        <p className="text-muted-foreground text-sm">
          Docker containers across all hosts
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "var(--space-section)" }}>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Running</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{summary.running}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Stopped / Exited</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{summary.stopped}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Other</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{summary.other}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters + Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Containers</CardTitle>
          <CardDescription>{filtered.length} of {containers.length} containers</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search name, image, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="restarting">Restarting</SelectItem>
                <SelectItem value="exited">Exited</SelectItem>
              </SelectContent>
            </Select>
            <Select value={networkFilter} onValueChange={setNetworkFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All networks</SelectItem>
                {networks.map((n) => (
                  <SelectItem key={n} value={n}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button onClick={() => toggleSort("name")} className="inline-flex items-center gap-1 hover:text-foreground">
                      Container <SortIcon field="name" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button onClick={() => toggleSort("image")} className="inline-flex items-center gap-1 hover:text-foreground">
                      Image <SortIcon field="image" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button onClick={() => toggleSort("status")} className="inline-flex items-center gap-1 hover:text-foreground">
                      Status <SortIcon field="status" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">
                    <button onClick={() => toggleSort("cpu")} className="inline-flex items-center gap-1 hover:text-foreground ml-auto">
                      CPU % <SortIcon field="cpu" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button onClick={() => toggleSort("memory")} className="inline-flex items-center gap-1 hover:text-foreground">
                      Memory <SortIcon field="memory" />
                    </button>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Ports</TableHead>
                  <TableHead className="hidden md:table-cell">
                    <button onClick={() => toggleSort("network")} className="inline-flex items-center gap-1 hover:text-foreground">
                      Network <SortIcon field="network" />
                    </button>
                  </TableHead>
                  <TableHead className="hidden xl:table-cell">Uptime</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      No containers match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c) => <ContainerRow key={c.id} container={c} />)
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ContainerRow({ container: c }: { container: Container }) {
  const cfg = statusConfig[c.status]
  const isRunning = c.status === "running"
  const isStopped = c.status === "stopped" || c.status === "exited"

  return (
    <TableRow>
      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium">{c.name}</span>
          <span className="text-muted-foreground text-xs font-mono">{c.id}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm">
          {c.image}<span className="text-muted-foreground">:{c.tag}</span>
        </span>
      </TableCell>
      <TableCell>
        <Badge variant={cfg.variant}>{cfg.label}</Badge>
      </TableCell>
      <TableCell className="text-right font-mono text-sm">
        {c.cpu > 0 ? `${c.cpu.toFixed(1)}%` : "—"}
      </TableCell>
      <TableCell>
        {c.memory.used > 0 ? (
          <MemoryBar used={c.memory.used} limit={c.memory.limit} />
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        {c.ports.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {c.ports.map((p) => (
              <Badge key={p} variant="outline" className="font-mono text-xs">
                {p}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge variant="secondary">{c.network}</Badge>
      </TableCell>
      <TableCell className="hidden xl:table-cell text-muted-foreground text-sm">
        {c.uptime}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          {isStopped ? (
            <Button variant="ghost" size="icon" className="size-7" title="Start">
              <Play className="size-3.5" />
            </Button>
          ) : isRunning ? (
            <>
              <Button variant="ghost" size="icon" className="size-7" title="Pause">
                <Pause className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="size-7" title="Stop">
                <Square className="size-3.5" />
              </Button>
            </>
          ) : null}
          <Button variant="ghost" size="icon" className="size-7" title="Restart">
            <RotateCcw className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="size-7 text-destructive hover:text-destructive" title="Remove">
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
