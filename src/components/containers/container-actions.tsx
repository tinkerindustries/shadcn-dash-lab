import { useState } from "react"
import { Play, Square, RotateCcw, Pause, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { type Container } from "@/data/containers-data"
import { toast } from "sonner"

type ActionType = "start" | "pause" | "stop" | "restart" | "remove"

const actionConfig: Record<
  ActionType,
  { title: string; description: (name: string) => string; variant: "default" | "destructive"; confirmLabel: string; pastTense: string }
> = {
  start: {
    title: "Start Container",
    description: (name) => `Start "${name}"?`,
    variant: "default",
    confirmLabel: "Start",
    pastTense: "started",
  },
  pause: {
    title: "Pause Container",
    description: (name) => `Pause "${name}"? Running processes will be suspended.`,
    variant: "default",
    confirmLabel: "Pause",
    pastTense: "paused",
  },
  stop: {
    title: "Stop Container",
    description: (name) => `Stop "${name}"? This will interrupt any running processes.`,
    variant: "destructive",
    confirmLabel: "Stop",
    pastTense: "stopped",
  },
  restart: {
    title: "Restart Container",
    description: (name) => `Restart "${name}"? There will be brief downtime.`,
    variant: "default",
    confirmLabel: "Restart",
    pastTense: "restarted",
  },
  remove: {
    title: "Remove Container",
    description: (name) => `Permanently remove "${name}"? This action cannot be undone.`,
    variant: "destructive",
    confirmLabel: "Remove",
    pastTense: "removed",
  },
}

export function ContainerActions({ container }: { container: Container }) {
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null)

  const isRunning = container.status === "running"
  const isStopped = container.status === "stopped" || container.status === "exited"

  function handleConfirm() {
    if (!pendingAction) return
    const config = actionConfig[pendingAction]
    toast.success(`Container ${config.pastTense}`, {
      description: container.name,
    })
    setPendingAction(null)
  }

  const config = pendingAction ? actionConfig[pendingAction] : null

  return (
    <>
      <div className="flex justify-end gap-1">
        {isStopped ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            title="Start"
            onClick={() => setPendingAction("start")}
          >
            <Play className="size-3.5" />
          </Button>
        ) : isRunning ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              title="Pause"
              onClick={() => setPendingAction("pause")}
            >
              <Pause className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              title="Stop"
              onClick={() => setPendingAction("stop")}
            >
              <Square className="size-3.5" />
            </Button>
          </>
        ) : null}
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          title="Restart"
          onClick={() => setPendingAction("restart")}
        >
          <RotateCcw className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-destructive hover:text-destructive"
          title="Remove"
          onClick={() => setPendingAction("remove")}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      {config && (
        <ConfirmDialog
          open={!!pendingAction}
          onOpenChange={(open) => {
            if (!open) setPendingAction(null)
          }}
          title={config.title}
          description={config.description(container.name)}
          confirmLabel={config.confirmLabel}
          variant={config.variant}
          onConfirm={handleConfirm}
        />
      )}
    </>
  )
}
