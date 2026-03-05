/* eslint-disable react-refresh/only-export-components */
import { type ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { type Container, type ContainerStatus } from "@/data/containers-data"
import { ContainerActions } from "./container-actions"

const statusConfig: Record<
  ContainerStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  running: { label: "Running", variant: "default" },
  paused: { label: "Paused", variant: "secondary" },
  restarting: { label: "Restarting", variant: "outline" },
  stopped: { label: "Stopped", variant: "destructive" },
  exited: { label: "Exited", variant: "destructive" },
}

function SortableHeader({
  column,
  children,
  className,
}: {
  column: { getIsSorted: () => false | "asc" | "desc"; toggleSorting: () => void }
  children: React.ReactNode
  className?: string
}) {
  const sorted = column.getIsSorted()
  return (
    <button
      onClick={() => column.toggleSorting()}
      className={`inline-flex items-center gap-1 hover:text-foreground ${className ?? ""}`}
    >
      {children}
      {sorted === "asc" ? (
        <ArrowUp className="size-3" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3" />
      ) : (
        <ArrowUpDown className="size-3" />
      )}
    </button>
  )
}

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

export const containerColumns: ColumnDef<Container>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Container</SortableHeader>,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-muted-foreground text-xs font-mono">{row.original.id}</span>
      </div>
    ),
  },
  {
    accessorKey: "image",
    header: ({ column }) => <SortableHeader column={column}>Image</SortableHeader>,
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.image}
        <span className="text-muted-foreground">:{row.original.tag}</span>
      </span>
    ),
    meta: { hideBelow: "md" },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
    cell: ({ row }) => {
      const cfg = statusConfig[row.original.status]
      return <Badge variant={cfg.variant}>{cfg.label}</Badge>
    },
    filterFn: (row, _columnId, filterValue: string) => {
      if (filterValue === "all") return true
      return row.original.status === filterValue
    },
  },
  {
    accessorKey: "cpu",
    header: ({ column }) => (
      <SortableHeader column={column} className="ml-auto">
        CPU %
      </SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm">
        {row.original.cpu > 0 ? `${row.original.cpu.toFixed(1)}%` : "—"}
      </div>
    ),
  },
  {
    id: "memory",
    accessorFn: (row) => row.memory.used,
    header: ({ column }) => <SortableHeader column={column}>Memory</SortableHeader>,
    cell: ({ row }) =>
      row.original.memory.used > 0 ? (
        <MemoryBar used={row.original.memory.used} limit={row.original.memory.limit} />
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      ),
  },
  {
    accessorKey: "ports",
    header: "Ports",
    cell: ({ row }) =>
      row.original.ports.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {row.original.ports.map((p) => (
            <Badge key={p} variant="outline" className="font-mono text-xs">
              {p}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      ),
    enableSorting: false,
    meta: { hideBelow: "lg" },
  },
  {
    accessorKey: "network",
    header: ({ column }) => <SortableHeader column={column}>Network</SortableHeader>,
    cell: ({ row }) => <Badge variant="secondary">{row.original.network}</Badge>,
    filterFn: (row, _columnId, filterValue: string) => {
      if (filterValue === "all") return true
      return row.original.network === filterValue
    },
    meta: { hideBelow: "md" },
  },
  {
    accessorKey: "uptime",
    header: "Uptime",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">{row.original.uptime}</span>
    ),
    enableSorting: false,
    meta: { hideBelow: "xl" },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <ContainerActions container={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]
