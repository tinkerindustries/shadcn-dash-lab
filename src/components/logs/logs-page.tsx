import { useState, useRef, useMemo, useCallback, useEffect } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Search, ArrowDown, Pause, Play, ChevronUp, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { logEntries, type LogEntry, type LogLevel } from "@/data/logs-data"

const levelColors: Record<LogLevel, string> = {
  debug: "text-muted-foreground",
  info: "text-blue-500 dark:text-blue-400",
  warn: "text-yellow-600 dark:text-yellow-400",
  error: "text-red-600 dark:text-red-400",
}

const levelBadgeVariant: Record<LogLevel, "outline" | "secondary" | "default" | "destructive"> = {
  debug: "outline",
  info: "default",
  warn: "secondary",
  error: "destructive",
}

const ROW_HEIGHT = 28

const sources = [...new Set(logEntries.map((l) => l.source))].sort()

export function LogsPage() {
  const [search, setSearch] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [tailing, setTailing] = useState(false)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [searchMatchIndex, setSearchMatchIndex] = useState(0)

  const parentRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    let result = logEntries
    if (levelFilter !== "all") {
      result = result.filter((l) => l.level === levelFilter)
    }
    if (sourceFilter !== "all") {
      result = result.filter((l) => l.source === sourceFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (l) =>
          l.message.toLowerCase().includes(q) ||
          l.source.toLowerCase().includes(q) ||
          l.timestamp.includes(q)
      )
    }
    return result
  }, [search, levelFilter, sourceFilter])

  const searchMatches = useMemo(() => {
    if (!search) return []
    const q = search.toLowerCase()
    return filtered
      .map((entry, index) => ({ entry, index }))
      .filter(
        ({ entry }) =>
          entry.message.toLowerCase().includes(q)
      )
  }, [search, filtered])

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
  })

  // Tail mode: scroll to bottom
  useEffect(() => {
    if (tailing) {
      virtualizer.scrollToIndex(filtered.length - 1, { align: "end" })
    }
  }, [tailing, filtered.length, virtualizer])

  const jumpToMatch = useCallback(
    (direction: "next" | "prev") => {
      if (searchMatches.length === 0) return
      let nextIndex = searchMatchIndex
      if (direction === "next") {
        nextIndex = (searchMatchIndex + 1) % searchMatches.length
      } else {
        nextIndex = (searchMatchIndex - 1 + searchMatches.length) % searchMatches.length
      }
      setSearchMatchIndex(nextIndex)
      virtualizer.scrollToIndex(searchMatches[nextIndex].index, { align: "center" })
    },
    [searchMatches, searchMatchIndex, virtualizer]
  )

  const levelCounts = useMemo(() => {
    const counts = { debug: 0, info: 0, warn: 0, error: 0 }
    for (const entry of filtered) {
      counts[entry.level]++
    }
    return counts
  }, [filtered])

  function highlightMatch(text: string, query: string): React.ReactNode {
    if (!query) return text
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return text
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-300/40 text-inherit rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    )
  }

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-section)" }}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Log Explorer</h2>
        <p className="text-muted-foreground text-sm">
          Aggregated logs from all containers and services
        </p>
      </div>

      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Log Stream</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {filtered.length.toLocaleString()} entries
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Badge variant={levelCounts.error > 0 ? "destructive" : "outline"} className="text-xs">
                  {levelCounts.error} errors
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {levelCounts.warn} warns
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search logs..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setSearchMatchIndex(0)
                }}
                className="pl-9 pr-24 font-mono text-sm"
              />
              {search && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {searchMatches.length > 0
                      ? `${searchMatchIndex + 1}/${searchMatches.length}`
                      : "0 results"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => jumpToMatch("prev")}
                    disabled={searchMatches.length === 0}
                  >
                    <ChevronUp className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => jumpToMatch("next")}
                    disabled={searchMatches.length === 0}
                  >
                    <ChevronDown className="size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => setSearch("")}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              )}
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warn">Warn</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {sources.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={tailing ? "default" : "outline"}
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={() => setTailing(!tailing)}
            >
              {tailing ? (
                <>
                  <Pause className="size-3.5" />
                  Tailing
                </>
              ) : (
                <>
                  <Play className="size-3.5" />
                  Tail
                </>
              )}
            </Button>
          </div>

          {/* Virtualized log view */}
          <div
            ref={parentRef}
            className="h-[600px] overflow-auto rounded-md border bg-muted/30 font-mono text-xs"
            onScroll={() => {
              if (!tailing || !parentRef.current) return
              const el = parentRef.current
              const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < ROW_HEIGHT * 2
              if (!atBottom) setTailing(false)
            }}
          >
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const entry = filtered[virtualRow.index]
                const isCurrentMatch =
                  searchMatches.length > 0 &&
                  searchMatches[searchMatchIndex]?.entry.id === entry.id

                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    className={cn(
                      "flex items-center gap-3 px-3 cursor-pointer hover:bg-muted/60 transition-colors border-b border-transparent",
                      entry.level === "error" && "bg-red-500/5",
                      entry.level === "warn" && "bg-yellow-500/5",
                      isCurrentMatch && "bg-yellow-300/20 border-yellow-500/40"
                    )}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${ROW_HEIGHT}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    onClick={() => setSelectedLog(entry)}
                  >
                    <span className="text-muted-foreground shrink-0 w-[85px]">
                      {entry.timestamp}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 w-[42px] uppercase font-semibold",
                        levelColors[entry.level]
                      )}
                    >
                      {entry.level}
                    </span>
                    <span className="text-muted-foreground shrink-0 w-[130px] truncate">
                      {entry.source}
                    </span>
                    <span className="truncate flex-1">
                      {highlightMatch(entry.message, search)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {filtered.length.toLocaleString()} of{" "}
              {logEntries.length.toLocaleString()} entries
            </span>
            {!tailing && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-7"
                onClick={() => {
                  virtualizer.scrollToIndex(filtered.length - 1, { align: "end" })
                }}
              >
                <ArrowDown className="size-3" />
                Jump to bottom
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Log detail dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-mono text-sm">
              Log Entry
              {selectedLog && (
                <Badge variant={levelBadgeVariant[selectedLog.level]} className="uppercase text-xs">
                  {selectedLog.level}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="grid gap-3 text-sm">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-muted-foreground font-medium">Timestamp</span>
                <span className="font-mono">{selectedLog.timestamp}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-muted-foreground font-medium">Level</span>
                <span className={cn("font-mono uppercase font-semibold", levelColors[selectedLog.level])}>
                  {selectedLog.level}
                </span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-muted-foreground font-medium">Source</span>
                <span className="font-mono">{selectedLog.source}</span>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-muted-foreground font-medium">Message</span>
                <pre className="font-mono whitespace-pre-wrap break-all bg-muted/50 rounded-md p-3 text-xs">
                  {selectedLog.message}
                </pre>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <span className="text-muted-foreground font-medium">Entry ID</span>
                <span className="font-mono text-muted-foreground">#{selectedLog.id}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
