// ── Types ────────────────────────────────────────────────────────

export type ColorPresetName =
  | "neutral"
  | "slate"
  | "midnight"
  | "forest"
  | "sunset"
  | "cyberpunk"
  | "nord"

export type ColorPreset = {
  label: string
  swatches: [string, string, string, string] // 4 preview colors for the UI
  light: Record<string, string>
  dark: Record<string, string>
}

// ── Color variable groups for the advanced UI ────────────────────

export const colorGroups = [
  {
    label: "Primary",
    vars: [
      { key: "--primary", label: "Primary" },
      { key: "--primary-foreground", label: "Primary Text" },
      { key: "--ring", label: "Focus Ring" },
      { key: "--destructive", label: "Destructive" },
    ],
  },
  {
    label: "Surfaces",
    vars: [
      { key: "--background", label: "Background" },
      { key: "--foreground", label: "Text" },
      { key: "--card", label: "Card" },
      { key: "--card-foreground", label: "Card Text" },
      { key: "--popover", label: "Popover" },
      { key: "--popover-foreground", label: "Popover Text" },
      { key: "--secondary", label: "Secondary" },
      { key: "--secondary-foreground", label: "Secondary Text" },
      { key: "--muted", label: "Muted" },
      { key: "--muted-foreground", label: "Muted Text" },
      { key: "--accent", label: "Accent" },
      { key: "--accent-foreground", label: "Accent Text" },
    ],
  },
  {
    label: "Chrome",
    vars: [
      { key: "--border", label: "Border" },
      { key: "--input", label: "Input Border" },
    ],
  },
  {
    label: "Charts",
    vars: [
      { key: "--chart-1", label: "Series 1" },
      { key: "--chart-2", label: "Series 2" },
      { key: "--chart-3", label: "Series 3" },
      { key: "--chart-4", label: "Series 4" },
      { key: "--chart-5", label: "Series 5" },
    ],
  },
  {
    label: "Sidebar",
    vars: [
      { key: "--sidebar", label: "Background" },
      { key: "--sidebar-foreground", label: "Text" },
      { key: "--sidebar-primary", label: "Primary" },
      { key: "--sidebar-primary-foreground", label: "Primary Text" },
      { key: "--sidebar-accent", label: "Accent" },
      { key: "--sidebar-accent-foreground", label: "Accent Text" },
      { key: "--sidebar-border", label: "Border" },
      { key: "--sidebar-ring", label: "Ring" },
    ],
  },
]

// ── Expand helper ────────────────────────────────────────────────
// Takes a minimal set of ~18 values and expands to all 30 CSS vars

type MinimalPalette = {
  background: string
  foreground: string
  card: string
  primary: string
  primaryForeground: string
  secondary: string
  mutedForeground: string
  destructive: string
  border: string
  input: string
  ring: string
  charts: [string, string, string, string, string]
  sidebar: string
  sidebarForeground: string
  sidebarPrimary: string
  sidebarPrimaryForeground: string
  sidebarAccent: string
  sidebarBorder: string
}

function expand(p: MinimalPalette): Record<string, string> {
  return {
    "--background": p.background,
    "--foreground": p.foreground,
    "--card": p.card,
    "--card-foreground": p.foreground,
    "--popover": p.card,
    "--popover-foreground": p.foreground,
    "--primary": p.primary,
    "--primary-foreground": p.primaryForeground,
    "--secondary": p.secondary,
    "--secondary-foreground": p.foreground,
    "--muted": p.secondary,
    "--muted-foreground": p.mutedForeground,
    "--accent": p.secondary,
    "--accent-foreground": p.foreground,
    "--destructive": p.destructive,
    "--border": p.border,
    "--input": p.input,
    "--ring": p.ring,
    "--chart-1": p.charts[0],
    "--chart-2": p.charts[1],
    "--chart-3": p.charts[2],
    "--chart-4": p.charts[3],
    "--chart-5": p.charts[4],
    "--sidebar": p.sidebar,
    "--sidebar-foreground": p.sidebarForeground,
    "--sidebar-primary": p.sidebarPrimary,
    "--sidebar-primary-foreground": p.sidebarPrimaryForeground,
    "--sidebar-accent": p.sidebarAccent,
    "--sidebar-accent-foreground": p.sidebarForeground,
    "--sidebar-border": p.sidebarBorder,
    "--sidebar-ring": p.ring,
  }
}

// ── All CSS var keys (for cleanup) ───────────────────────────────

export const ALL_COLOR_VARS = [
  "--background", "--foreground",
  "--card", "--card-foreground",
  "--popover", "--popover-foreground",
  "--primary", "--primary-foreground",
  "--secondary", "--secondary-foreground",
  "--muted", "--muted-foreground",
  "--accent", "--accent-foreground",
  "--destructive",
  "--border", "--input", "--ring",
  "--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5",
  "--sidebar", "--sidebar-foreground",
  "--sidebar-primary", "--sidebar-primary-foreground",
  "--sidebar-accent", "--sidebar-accent-foreground",
  "--sidebar-border", "--sidebar-ring",
]

// ── Presets ──────────────────────────────────────────────────────

export const colorPresets: Record<ColorPresetName, ColorPreset> = {
  // ── Neutral (no overrides — CSS file defaults) ─────────────
  neutral: {
    label: "Neutral",
    swatches: ["#737373", "#fafafa", "#171717", "#e5e5e5"],
    light: {},
    dark: {},
  },

  // ── Slate (cool blue-gray) ─────────────────────────────────
  slate: {
    label: "Slate",
    swatches: ["#1e293b", "#f1f5f9", "#0ea5e9", "#e2e8f0"],
    light: expand({
      background: "#ffffff",
      foreground: "#0f172a",
      card: "#ffffff",
      primary: "#1e293b",
      primaryForeground: "#f8fafc",
      secondary: "#f1f5f9",
      mutedForeground: "#64748b",
      destructive: "#ef4444",
      border: "#e2e8f0",
      input: "#e2e8f0",
      ring: "#94a3b8",
      charts: ["#0ea5e9", "#22c55e", "#a855f7", "#f59e0b", "#ec4899"],
      sidebar: "#f1f5f9",
      sidebarForeground: "#0f172a",
      sidebarPrimary: "#1e293b",
      sidebarPrimaryForeground: "#f8fafc",
      sidebarAccent: "#e2e8f0",
      sidebarBorder: "#e2e8f0",
    }),
    dark: expand({
      background: "#0f172a",
      foreground: "#f1f5f9",
      card: "#1e293b",
      primary: "#e2e8f0",
      primaryForeground: "#1e293b",
      secondary: "#334155",
      mutedForeground: "#94a3b8",
      destructive: "#f87171",
      border: "#334155",
      input: "#334155",
      ring: "#64748b",
      charts: ["#38bdf8", "#4ade80", "#c084fc", "#fbbf24", "#f472b6"],
      sidebar: "#1e293b",
      sidebarForeground: "#f1f5f9",
      sidebarPrimary: "#38bdf8",
      sidebarPrimaryForeground: "#f1f5f9",
      sidebarAccent: "#334155",
      sidebarBorder: "#334155",
    }),
  },

  // ── Midnight (deep navy, blue accents) ─────────────────────
  midnight: {
    label: "Midnight",
    swatches: ["#4f7cf7", "#0b1120", "#60a5fa", "#1e2b4a"],
    light: expand({
      background: "#f0f4ff",
      foreground: "#1a1f36",
      card: "#ffffff",
      primary: "#1a56db",
      primaryForeground: "#ffffff",
      secondary: "#e8eeff",
      mutedForeground: "#6b7294",
      destructive: "#e02424",
      border: "#d5ddf5",
      input: "#d5ddf5",
      ring: "#4f7cf7",
      charts: ["#4f7cf7", "#14b8a6", "#a855f7", "#f59e0b", "#f472b6"],
      sidebar: "#1a1f36",
      sidebarForeground: "#e8eeff",
      sidebarPrimary: "#4f7cf7",
      sidebarPrimaryForeground: "#ffffff",
      sidebarAccent: "#2a3050",
      sidebarBorder: "#2a3050",
    }),
    dark: expand({
      background: "#0b1120",
      foreground: "#e2e8f0",
      card: "#131b30",
      primary: "#4f7cf7",
      primaryForeground: "#ffffff",
      secondary: "#1a2340",
      mutedForeground: "#7b8bb5",
      destructive: "#f87171",
      border: "#1e2b4a",
      input: "#1e2b4a",
      ring: "#4f7cf7",
      charts: ["#60a5fa", "#2dd4bf", "#c084fc", "#fbbf24", "#fb7185"],
      sidebar: "#0d1526",
      sidebarForeground: "#e2e8f0",
      sidebarPrimary: "#60a5fa",
      sidebarPrimaryForeground: "#ffffff",
      sidebarAccent: "#1a2340",
      sidebarBorder: "#1e2b4a",
    }),
  },

  // ── Forest (green, earthy) ─────────────────────────────────
  forest: {
    label: "Forest",
    swatches: ["#166534", "#ecfae5", "#4ade80", "#1a3320"],
    light: expand({
      background: "#f7faf5",
      foreground: "#1a2e1a",
      card: "#ffffff",
      primary: "#166534",
      primaryForeground: "#ffffff",
      secondary: "#ecfae5",
      mutedForeground: "#5a7a5a",
      destructive: "#dc2626",
      border: "#d4e8d0",
      input: "#d4e8d0",
      ring: "#4ade80",
      charts: ["#22c55e", "#0ea5e9", "#a855f7", "#f59e0b", "#ec4899"],
      sidebar: "#14532d",
      sidebarForeground: "#ecfae5",
      sidebarPrimary: "#4ade80",
      sidebarPrimaryForeground: "#14532d",
      sidebarAccent: "#1a5c35",
      sidebarBorder: "#1a5c35",
    }),
    dark: expand({
      background: "#0c1a0e",
      foreground: "#e2f0e2",
      card: "#132a16",
      primary: "#4ade80",
      primaryForeground: "#0c1a0e",
      secondary: "#1a3320",
      mutedForeground: "#7aaa7a",
      destructive: "#f87171",
      border: "#1f3a24",
      input: "#1f3a24",
      ring: "#4ade80",
      charts: ["#4ade80", "#38bdf8", "#c084fc", "#fbbf24", "#fb7185"],
      sidebar: "#0f2513",
      sidebarForeground: "#e2f0e2",
      sidebarPrimary: "#4ade80",
      sidebarPrimaryForeground: "#0c1a0e",
      sidebarAccent: "#1a3320",
      sidebarBorder: "#1f3a24",
    }),
  },

  // ── Sunset (warm orange/amber) ─────────────────────────────
  sunset: {
    label: "Sunset",
    swatches: ["#c2410c", "#fef0e2", "#fb923c", "#3d2815"],
    light: expand({
      background: "#fffbf5",
      foreground: "#2d1f10",
      card: "#ffffff",
      primary: "#c2410c",
      primaryForeground: "#ffffff",
      secondary: "#fef0e2",
      mutedForeground: "#9a7a5a",
      destructive: "#dc2626",
      border: "#f0dcc8",
      input: "#f0dcc8",
      ring: "#f97316",
      charts: ["#f97316", "#06b6d4", "#a855f7", "#eab308", "#ec4899"],
      sidebar: "#451a03",
      sidebarForeground: "#fef0e2",
      sidebarPrimary: "#fb923c",
      sidebarPrimaryForeground: "#451a03",
      sidebarAccent: "#5c2508",
      sidebarBorder: "#5c2508",
    }),
    dark: expand({
      background: "#1a0f05",
      foreground: "#f5e6d3",
      card: "#2a1a0c",
      primary: "#fb923c",
      primaryForeground: "#1a0f05",
      secondary: "#33200e",
      mutedForeground: "#c4a077",
      destructive: "#f87171",
      border: "#3d2815",
      input: "#3d2815",
      ring: "#fb923c",
      charts: ["#fb923c", "#22d3ee", "#c084fc", "#facc15", "#fb7185"],
      sidebar: "#221208",
      sidebarForeground: "#f5e6d3",
      sidebarPrimary: "#fb923c",
      sidebarPrimaryForeground: "#1a0f05",
      sidebarAccent: "#33200e",
      sidebarBorder: "#3d2815",
    }),
  },

  // ── Cyberpunk (neon on dark) ───────────────────────────────
  cyberpunk: {
    label: "Cyberpunk",
    swatches: ["#00ff88", "#ff2d78", "#09090b", "#bf5af2"],
    light: expand({
      background: "#fafafa",
      foreground: "#18181b",
      card: "#ffffff",
      primary: "#10b981",
      primaryForeground: "#ffffff",
      secondary: "#f0fdf4",
      mutedForeground: "#71717a",
      destructive: "#e11d48",
      border: "#d4d4d8",
      input: "#d4d4d8",
      ring: "#10b981",
      charts: ["#10b981", "#f43f5e", "#a855f7", "#06b6d4", "#eab308"],
      sidebar: "#18181b",
      sidebarForeground: "#f0fdf4",
      sidebarPrimary: "#10b981",
      sidebarPrimaryForeground: "#ffffff",
      sidebarAccent: "#27272a",
      sidebarBorder: "#3f3f46",
    }),
    dark: expand({
      background: "#09090b",
      foreground: "#e4e4e7",
      card: "#18181b",
      primary: "#00ff88",
      primaryForeground: "#09090b",
      secondary: "#27272a",
      mutedForeground: "#a1a1aa",
      destructive: "#ff2d78",
      border: "#27272a",
      input: "#3f3f46",
      ring: "#00ff88",
      charts: ["#00ff88", "#ff2d78", "#bf5af2", "#00d4ff", "#ffd60a"],
      sidebar: "#09090b",
      sidebarForeground: "#e4e4e7",
      sidebarPrimary: "#00ff88",
      sidebarPrimaryForeground: "#09090b",
      sidebarAccent: "#1c1c1e",
      sidebarBorder: "#27272a",
    }),
  },

  // ── Nord (blue-gray + frost) ───────────────────────────────
  nord: {
    label: "Nord",
    swatches: ["#5e81ac", "#88c0d0", "#2e3440", "#eceff4"],
    light: expand({
      background: "#eceff4",
      foreground: "#2e3440",
      card: "#e5e9f0",
      primary: "#5e81ac",
      primaryForeground: "#eceff4",
      secondary: "#d8dee9",
      mutedForeground: "#4c566a",
      destructive: "#bf616a",
      border: "#d8dee9",
      input: "#d8dee9",
      ring: "#81a1c1",
      charts: ["#88c0d0", "#a3be8c", "#b48ead", "#ebcb8b", "#d08770"],
      sidebar: "#e5e9f0",
      sidebarForeground: "#2e3440",
      sidebarPrimary: "#5e81ac",
      sidebarPrimaryForeground: "#eceff4",
      sidebarAccent: "#d8dee9",
      sidebarBorder: "#d8dee9",
    }),
    dark: expand({
      background: "#2e3440",
      foreground: "#eceff4",
      card: "#3b4252",
      primary: "#88c0d0",
      primaryForeground: "#2e3440",
      secondary: "#434c5e",
      mutedForeground: "#d8dee9",
      destructive: "#bf616a",
      border: "#434c5e",
      input: "#4c566a",
      ring: "#81a1c1",
      charts: ["#88c0d0", "#a3be8c", "#b48ead", "#ebcb8b", "#d08770"],
      sidebar: "#3b4252",
      sidebarForeground: "#eceff4",
      sidebarPrimary: "#88c0d0",
      sidebarPrimaryForeground: "#2e3440",
      sidebarAccent: "#434c5e",
      sidebarBorder: "#434c5e",
    }),
  },
}
