# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (Vite with HMR)
- **Build:** `npm run build` (runs `tsc -b && vite build`)
- **Lint:** `npm run lint` (ESLint with flat config)
- **Preview production build:** `npm run preview`
- **Add shadcn/ui component:** `npx shadcn@latest add <component>`

## Architecture

This is a React 19 + TypeScript SPA built with Vite. It's a server monitoring dashboard with a rich theme customization system.

### Tech Stack
- **UI:** React 19, Tailwind CSS v4 (using `@tailwindcss/vite` plugin), shadcn/ui (new-york style)
- **Charts:** Recharts
- **Icons:** lucide-react
- **Styling utilities:** `cn()` helper in `src/lib/utils.ts` (clsx + tailwind-merge)

### Path Alias
`@/*` maps to `./src/*` (configured in both `tsconfig.json` and `vite.config.ts`). Always use `@/` imports.

### Key Patterns

**Theme System** (`src/components/theme-provider.tsx`): Central `ThemeProvider` context managing light/dark mode, color presets, border radius, density, font size, font family, and surface style. All settings persist to localStorage with `shadcn-dash-lab` prefix. Color overrides are stored per-mode (light/dark). The `useTheme()` hook exposes all theme state and setters.

**Color Presets** (`src/data/theme-presets.ts`): Named color themes (neutral, slate, midnight, forest, sunset, cyberpunk, nord) that set CSS custom variables on `:root`. Colors use oklch color space. The theme customizer allows per-variable overrides on top of presets.

**Layout Structure:** `App` → `DashboardLayout` → `SidebarProvider` + `AppSidebar` + `TopNavbar` + `DashboardPage`. The sidebar uses shadcn's `SidebarProvider`/`SidebarInset` pattern.

**Spacing:** Uses CSS custom properties (`--space-section`, `--space-page`) applied via inline `style` rather than Tailwind classes for section/page-level spacing, controlled by the density setting.

**Dashboard widgets** live in `src/components/dashboard/` and consume static data from `src/data/dummy-data.ts`.

**shadcn/ui components** are in `src/components/ui/`. These are generated files — add new ones via the CLI rather than writing from scratch. The `components.json` configures shadcn with aliases matching the `@/` path structure.
