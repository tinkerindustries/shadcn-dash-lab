import { useState } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { TopNavbar } from "./top-navbar"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { ServersPage } from "@/components/servers/servers-page"
import { ContainersPage } from "@/components/containers/containers-page"
import { LogsPage } from "@/components/logs/logs-page"
import { ButtonLabPage } from "@/components/buttons/button-lab-page"
import { CommandPalette } from "@/components/command-palette"
import { ThemeCustomizerPanel } from "@/components/theme-customizer"
import { cn } from "@/lib/utils"

export function DashboardLayout() {
  const [activePage, setActivePage] = useState("Dashboard")
  const [commandOpen, setCommandOpen] = useState(false)
  const [customizerOpen, setCustomizerOpen] = useState(false)

  return (
    <div className="flex">
      {/* Main content area */}
      <div className="flex-1 min-w-0">
        <SidebarProvider defaultOpen={true}>
          <AppSidebar activePage={activePage} onNavigate={setActivePage} />
          <SidebarInset>
            <TopNavbar
              customizerOpen={customizerOpen}
              onToggleCustomizer={() => setCustomizerOpen((o) => !o)}
              onOpenCommandPalette={() => setCommandOpen(true)}
            />
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
              ) : activePage === "Buttons" ? (
                <ButtonLabPage />
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
      </div>

      {/* Theme customizer panel — pushes content, no overlay, sticky so it stays visible while scrolling */}
      <div
        className={cn(
          "sticky top-0 h-svh shrink-0 border-l bg-background transition-[width] duration-300 overflow-hidden",
          customizerOpen ? "w-[320px]" : "w-0"
        )}
      >
        <div className="w-[320px] h-full">
          <ThemeCustomizerPanel onClose={() => setCustomizerOpen(false)} />
        </div>
      </div>
    </div>
  )
}
