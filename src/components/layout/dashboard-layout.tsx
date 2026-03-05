import { useState } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { TopNavbar } from "./top-navbar"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { ServersPage } from "@/components/servers/servers-page"
import { ContainersPage } from "@/components/containers/containers-page"
import { LogsPage } from "@/components/logs/logs-page"
import { CommandPalette } from "@/components/command-palette"

export function DashboardLayout() {
  const [activePage, setActivePage] = useState("Dashboard")
  const [commandOpen, setCommandOpen] = useState(false)

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar activePage={activePage} onNavigate={setActivePage} />
      <SidebarInset>
        <TopNavbar onOpenCommandPalette={() => setCommandOpen(true)} />
        <main
          className="flex-1"
          style={{ padding: "var(--space-page)" }}
        >
          {activePage === "Servers" ? (
            <ServersPage />
          ) : activePage === "Containers" ? (
            <ContainersPage />
          ) : activePage === "Logs" ? (
            <LogsPage />
          ) : (
            <DashboardPage />
          )}
        </main>
      </SidebarInset>
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onNavigate={(page) => {
          setActivePage(page)
          setCommandOpen(false)
        }}
      />
    </SidebarProvider>
  )
}
