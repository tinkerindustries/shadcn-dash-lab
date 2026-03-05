import { useState } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { TopNavbar } from "./top-navbar"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { ServersPage } from "@/components/servers/servers-page"
import { ContainersPage } from "@/components/containers/containers-page"

export function DashboardLayout() {
  const [activePage, setActivePage] = useState("Dashboard")

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar activePage={activePage} onNavigate={setActivePage} />
      <SidebarInset>
        <TopNavbar />
        <main
          className="flex-1"
          style={{ padding: "var(--space-page)" }}
        >
          {activePage === "Servers" ? (
            <ServersPage />
          ) : activePage === "Containers" ? (
            <ContainersPage />
          ) : (
            <DashboardPage />
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
