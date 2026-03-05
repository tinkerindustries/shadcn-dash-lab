import { useEffect } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { navGroups, iconMap } from "@/data/nav-items"
import { servers } from "@/data/dummy-data"
import { containers } from "@/data/containers-data"
import { Server, Container } from "lucide-react"

type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (page: string) => void
}

export function CommandPalette({
  open,
  onOpenChange,
  onNavigate,
}: CommandPaletteProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  function navigate(page: string) {
    onNavigate(page)
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {navGroups.flatMap((group) =>
            group.items.map((item) => {
              const Icon = iconMap[item.icon]
              return (
                <CommandItem
                  key={item.title}
                  onSelect={() => navigate(item.title)}
                >
                  {Icon && <Icon className="mr-2 size-4" />}
                  {item.title}
                </CommandItem>
              )
            })
          )}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Servers">
          {servers.map((s) => (
            <CommandItem
              key={s.name}
              onSelect={() => navigate("Servers")}
            >
              <Server className="mr-2 size-4" />
              <span>{s.name}</span>
              <span className="ml-auto text-xs text-muted-foreground font-mono">
                {s.ip}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Containers">
          {containers.map((c) => (
            <CommandItem
              key={c.id}
              onSelect={() => navigate("Containers")}
            >
              <Container className="mr-2 size-4" />
              <span>{c.name}</span>
              <span className="ml-auto text-xs text-muted-foreground capitalize">
                {c.status}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
