import {
  LayoutDashboard,
  Server,
  Container,
  Bell,
  Activity,
  HardDrive,
  Network,
  Shield,
  Mail,
  Users,
  Terminal,
  Settings,
  ScrollText,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type NavItem = {
  title: string
  icon: string
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const iconMap: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  server: Server,
  bell: Bell,
  activity: Activity,
  container: Container,
  "hard-drive": HardDrive,
  network: Network,
  shield: Shield,
  mail: Mail,
  users: Users,
  terminal: Terminal,
  settings: Settings,
  "scroll-text": ScrollText,
}

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: "layout-dashboard" },
      { title: "Servers", icon: "server" },
      { title: "Alerts", icon: "bell" },
      { title: "Performance", icon: "activity" },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { title: "Containers", icon: "container" },
      { title: "Logs", icon: "scroll-text" },
      { title: "Storage", icon: "hard-drive" },
      { title: "Network", icon: "network" },
      { title: "Security", icon: "shield" },
      { title: "Notifications", icon: "mail" },
    ],
  },
  {
    label: "Admin",
    items: [
      { title: "Users", icon: "users" },
      { title: "Console", icon: "terminal" },
      { title: "Settings", icon: "settings" },
    ],
  },
]
