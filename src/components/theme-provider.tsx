import { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  colorPresets,
  ALL_COLOR_VARS,
  type ColorPresetName,
} from "@/data/theme-presets"

export type Theme = "dark" | "light" | "system"

export type SavedPreset = {
  id: string
  name: string
  createdAt: number
  theme: Theme
  colorPreset: ColorPresetName
  colorOverridesLight: Record<string, string>
  colorOverridesDark: Record<string, string>
  radius: number
  density: Density
  fontSize: number
  fontFamily: FontFamily
  surfaceStyle: SurfaceStyle
  cardBorder: CardBorder
  buttonStyle?: ButtonStyle
  gradientColor1: string
  gradientColorMid: string
  gradientColor2: string
}
export type Density = "compact" | "default" | "comfortable"
export type SurfaceStyle = "flat" | "default" | "elevated" | "bold"
export type CardBorder = "default" | "none" | "glow" | "accent"
  | "gradient-corner" | "gradient-top" | "gradient-dual"
  | "gradient-aurora" | "gradient-halo" | "gradient-pulse"
export type ButtonStyle =
  | "default"
  | "physical"
  | "bevel"
  | "glass"
  | "notch"
  | "sheen"
  | "neon"
  | "stamp"
  | "soft"
  | "spotlight"
export type FontFamily =
  | "system"
  | "inter"
  | "dm-sans"
  | "space-grotesk"
  | "jetbrains-mono"
  | "ibm-plex-sans"
  | "fira-code"
  | "nunito"
  | "outfit"
  | "sora"
  | "geist-mono"
  | "source-code-pro"
  | "plus-jakarta-sans"
  | "rubik"
  | "work-sans"
  | "raleway"
  | "bitter"
  | "merriweather"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  colorPreset: ColorPresetName
  setColorPreset: (preset: ColorPresetName) => void
  colorOverrides: Record<string, string>
  setColorOverride: (varName: string, value: string) => void
  clearColorOverride: (varName: string) => void
  clearAllColorOverrides: () => void
  radius: number
  setRadius: (radius: number) => void
  density: Density
  setDensity: (density: Density) => void
  fontSize: number
  setFontSize: (size: number) => void
  fontFamily: FontFamily
  setFontFamily: (font: FontFamily) => void
  surfaceStyle: SurfaceStyle
  setSurfaceStyle: (style: SurfaceStyle) => void
  cardBorder: CardBorder
  setCardBorder: (style: CardBorder) => void
  buttonStyle: ButtonStyle
  setButtonStyle: (style: ButtonStyle) => void
  gradientColor1: string
  setGradientColor1: (color: string) => void
  gradientColorMid: string
  setGradientColorMid: (color: string) => void
  gradientColor2: string
  setGradientColor2: (color: string) => void
  resetGradientColors: () => void
  savedPresets: SavedPreset[]
  saveCurrentAsPreset: (name: string) => void
  loadSavedPreset: (id: string) => void
  deleteSavedPreset: (id: string) => void
}

const STORAGE_PREFIX = "shadcn-dash-lab"

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
  colorPreset: "neutral",
  setColorPreset: () => null,
  colorOverrides: {},
  setColorOverride: () => null,
  clearColorOverride: () => null,
  clearAllColorOverrides: () => null,
  radius: 0.625,
  setRadius: () => null,
  density: "default",
  setDensity: () => null,
  fontSize: 16,
  setFontSize: () => null,
  fontFamily: "system",
  setFontFamily: () => null,
  surfaceStyle: "default",
  setSurfaceStyle: () => null,
  cardBorder: "default",
  setCardBorder: () => null,
  buttonStyle: "default",
  setButtonStyle: () => null,
  gradientColor1: "",
  setGradientColor1: () => null,
  gradientColorMid: "",
  setGradientColorMid: () => null,
  gradientColor2: "",
  setGradientColor2: () => null,
  resetGradientColors: () => null,
  savedPresets: [],
  saveCurrentAsPreset: () => null,
  loadSavedPreset: () => null,
  deleteSavedPreset: () => null,
})

// ── Font presets ─────────────────────────────────────────────────

export const fontPresets: Record<
  FontFamily,
  { label: string; value: string; googleName: string | null }
> = {
  system: {
    label: "System",
    value: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    googleName: null,
  },
  inter: { label: "Inter", value: '"Inter", sans-serif', googleName: "Inter" },
  "dm-sans": { label: "DM Sans", value: '"DM Sans", sans-serif', googleName: "DM+Sans" },
  "space-grotesk": { label: "Space Grotesk", value: '"Space Grotesk", sans-serif', googleName: "Space+Grotesk" },
  "jetbrains-mono": { label: "JetBrains Mono", value: '"JetBrains Mono", monospace', googleName: "JetBrains+Mono" },
  "ibm-plex-sans": { label: "IBM Plex Sans", value: '"IBM Plex Sans", sans-serif', googleName: "IBM+Plex+Sans" },
  "fira-code": { label: "Fira Code", value: '"Fira Code", monospace', googleName: "Fira+Code" },
  nunito: { label: "Nunito", value: '"Nunito", sans-serif', googleName: "Nunito" },
  outfit: { label: "Outfit", value: '"Outfit", sans-serif', googleName: "Outfit" },
  sora: { label: "Sora", value: '"Sora", sans-serif', googleName: "Sora" },
  "geist-mono": { label: "Geist Mono", value: '"Geist Mono", monospace', googleName: "Geist+Mono" },
  "source-code-pro": { label: "Source Code Pro", value: '"Source Code Pro", monospace', googleName: "Source+Code+Pro" },
  "plus-jakarta-sans": { label: "Plus Jakarta Sans", value: '"Plus Jakarta Sans", sans-serif', googleName: "Plus+Jakarta+Sans" },
  rubik: { label: "Rubik", value: '"Rubik", sans-serif', googleName: "Rubik" },
  "work-sans": { label: "Work Sans", value: '"Work Sans", sans-serif', googleName: "Work+Sans" },
  raleway: { label: "Raleway", value: '"Raleway", sans-serif', googleName: "Raleway" },
  bitter: { label: "Bitter", value: '"Bitter", serif', googleName: "Bitter" },
  merriweather: { label: "Merriweather", value: '"Merriweather", serif', googleName: "Merriweather" },
}

const GOOGLE_FONTS_URL = (() => {
  const families = Object.values(fontPresets)
    .filter((p) => p.googleName)
    .map((p) => `family=${p.googleName}:wght@400;500;600;700`)
    .join("&")
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
})()

// ── Helpers ──────────────────────────────────────────────────────

function getEffectiveMode(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  return theme
}

function loadSavedPresetsFromStorage(): SavedPreset[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}-saved-presets`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persistSavedPresets(presets: SavedPreset[]) {
  localStorage.setItem(`${STORAGE_PREFIX}-saved-presets`, JSON.stringify(presets))
}

function loadOverrides(mode: "light" | "dark"): Record<string, string> {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}-overrides-${mode}`)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveOverrides(mode: "light" | "dark", overrides: Record<string, string>) {
  localStorage.setItem(`${STORAGE_PREFIX}-overrides-${mode}`, JSON.stringify(overrides))
}

// ── Provider ─────────────────────────────────────────────────────

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = `${STORAGE_PREFIX}-theme`,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [colorPresetName, setColorPresetState] = useState<ColorPresetName>(
    () => (localStorage.getItem(`${STORAGE_PREFIX}-color-preset`) as ColorPresetName) || "neutral"
  )
  // Overrides are per-mode — we load the current mode's overrides
  const [colorOverrides, setColorOverridesState] = useState<Record<string, string>>(() =>
    loadOverrides(getEffectiveMode((localStorage.getItem(storageKey) as Theme) || defaultTheme))
  )
  const [radius, setRadiusState] = useState<number>(() => {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}-radius`)
    return stored !== null ? parseFloat(stored) : 0.625
  })
  const [density, setDensityState] = useState<Density>(
    () => (localStorage.getItem(`${STORAGE_PREFIX}-density`) as Density) || "default"
  )
  const [fontSize, setFontSizeState] = useState<number>(() => {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}-font-size`)
    return stored !== null ? parseInt(stored, 10) : 16
  })
  const [fontFamily, setFontFamilyState] = useState<FontFamily>(
    () => (localStorage.getItem(`${STORAGE_PREFIX}-font-family`) as FontFamily) || "system"
  )
  const [surfaceStyle, setSurfaceStyleState] = useState<SurfaceStyle>(
    () => (localStorage.getItem(`${STORAGE_PREFIX}-surface`) as SurfaceStyle) || "default"
  )
  const [cardBorder, setCardBorderState] = useState<CardBorder>(
    () => (localStorage.getItem(`${STORAGE_PREFIX}-card-border`) as CardBorder) || "default"
  )
  const [buttonStyle, setButtonStyleState] = useState<ButtonStyle>(
    () => (localStorage.getItem(`${STORAGE_PREFIX}-button-style`) as ButtonStyle) || "default"
  )
  const [gradientColor1, setGradientColor1State] = useState<string>(
    () => localStorage.getItem(`${STORAGE_PREFIX}-gradient-color-1`) || ""
  )
  const [gradientColorMid, setGradientColorMidState] = useState<string>(
    () => localStorage.getItem(`${STORAGE_PREFIX}-gradient-color-mid`) || ""
  )
  const [gradientColor2, setGradientColor2State] = useState<string>(
    () => localStorage.getItem(`${STORAGE_PREFIX}-gradient-color-2`) || ""
  )
  const [savedPresetsState, setSavedPresetsState] = useState<SavedPreset[]>(
    () => loadSavedPresetsFromStorage()
  )

  // Preload Google Fonts
  useEffect(() => {
    const id = "google-fonts-preload"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id = id
    link.rel = "stylesheet"
    link.href = GOOGLE_FONTS_URL
    document.head.appendChild(link)
  }, [])

  // Apply light/dark class
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(getEffectiveMode(theme))
  }, [theme])

  // Apply color preset + overrides
  const applyColors = useCallback(
    (preset: ColorPresetName, currentTheme: Theme, overrides: Record<string, string>) => {
      const root = document.documentElement
      const mode = getEffectiveMode(currentTheme)
      const presetData = colorPresets[preset]
      const presetVars = presetData[mode]

      if (preset === "neutral" && Object.keys(overrides).length === 0) {
        // Remove all inline vars so CSS defaults take effect
        for (const key of ALL_COLOR_VARS) {
          root.style.removeProperty(key)
        }
      } else {
        // For non-neutral: set all vars. For neutral with overrides: clear non-overridden vars.
        for (const key of ALL_COLOR_VARS) {
          if (overrides[key]) {
            root.style.setProperty(key, overrides[key])
          } else if (presetVars[key]) {
            root.style.setProperty(key, presetVars[key])
          } else {
            root.style.removeProperty(key)
          }
        }
      }
    },
    []
  )

  useEffect(() => {
    applyColors(colorPresetName, theme, colorOverrides)
  }, [colorPresetName, theme, colorOverrides, applyColors])

  // Reload overrides when effective mode changes
  useEffect(() => {
    const mode = getEffectiveMode(theme)
    setColorOverridesState(loadOverrides(mode))
  }, [theme])

  // Apply radius, density, font size, font family, surface
  useEffect(() => {
    document.documentElement.style.setProperty("--radius", `${radius}rem`)
  }, [radius])
  useEffect(() => {
    document.documentElement.setAttribute("data-density", density)
  }, [density])
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
  }, [fontSize])
  useEffect(() => {
    document.documentElement.style.fontFamily = fontPresets[fontFamily].value
  }, [fontFamily])
  useEffect(() => {
    document.documentElement.setAttribute("data-surface", surfaceStyle)
  }, [surfaceStyle])
  useEffect(() => {
    document.documentElement.setAttribute("data-card-border", cardBorder)
  }, [cardBorder])
  useEffect(() => {
    document.documentElement.setAttribute("data-button-style", buttonStyle)
  }, [buttonStyle])

  // Pointer position on the hovered button, for the "spotlight" button style.
  // Cheap enough to leave on: it only touches elements the pointer is over.
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.<HTMLElement>(
        '[data-slot="button"]'
      )
      if (!target) return
      const rect = target.getBoundingClientRect()
      target.style.setProperty("--btn-mx", `${e.clientX - rect.left}px`)
      target.style.setProperty("--btn-my", `${e.clientY - rect.top}px`)
    }
    document.addEventListener("pointermove", handler, { passive: true })
    return () => document.removeEventListener("pointermove", handler)
  }, [])
  useEffect(() => {
    const root = document.documentElement
    if (gradientColor1) root.style.setProperty("--gradient-color-1", gradientColor1)
    else root.style.removeProperty("--gradient-color-1")
  }, [gradientColor1])
  useEffect(() => {
    const root = document.documentElement
    if (gradientColorMid) root.style.setProperty("--gradient-color-mid", gradientColorMid)
    else root.style.removeProperty("--gradient-color-mid")
  }, [gradientColorMid])
  useEffect(() => {
    const root = document.documentElement
    if (gradientColor2) root.style.setProperty("--gradient-color-2", gradientColor2)
    else root.style.removeProperty("--gradient-color-2")
  }, [gradientColor2])

  // System theme change listener
  useEffect(() => {
    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      const root = document.documentElement
      root.classList.remove("light", "dark")
      const newMode = mq.matches ? "dark" : "light"
      root.classList.add(newMode)
      const newOverrides = loadOverrides(newMode)
      setColorOverridesState(newOverrides)
      applyColors(colorPresetName, theme, newOverrides)
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme, colorPresetName, applyColors])

  // ── Setters ────────────────────────────────────────────────────

  const setTheme = (t: Theme) => {
    localStorage.setItem(storageKey, t)
    setThemeState(t)
  }

  const setColorPreset = (p: ColorPresetName) => {
    localStorage.setItem(`${STORAGE_PREFIX}-color-preset`, p)
    // Clear overrides for both modes when switching presets
    saveOverrides("light", {})
    saveOverrides("dark", {})
    setColorOverridesState({})
    setColorPresetState(p)
  }

  const setColorOverride = (varName: string, value: string) => {
    const mode = getEffectiveMode(theme)
    const next = { ...colorOverrides, [varName]: value }
    saveOverrides(mode, next)
    setColorOverridesState(next)
  }

  const clearColorOverride = (varName: string) => {
    const mode = getEffectiveMode(theme)
    const next = { ...colorOverrides }
    delete next[varName]
    saveOverrides(mode, next)
    setColorOverridesState(next)
  }

  const clearAllColorOverrides = () => {
    const mode = getEffectiveMode(theme)
    saveOverrides(mode, {})
    setColorOverridesState({})
  }

  const setRadius = (r: number) => {
    localStorage.setItem(`${STORAGE_PREFIX}-radius`, String(r))
    setRadiusState(r)
  }
  const setDensity = (d: Density) => {
    localStorage.setItem(`${STORAGE_PREFIX}-density`, d)
    setDensityState(d)
  }
  const setFontSize = (s: number) => {
    localStorage.setItem(`${STORAGE_PREFIX}-font-size`, String(s))
    setFontSizeState(s)
  }
  const setFontFamily = (f: FontFamily) => {
    localStorage.setItem(`${STORAGE_PREFIX}-font-family`, f)
    setFontFamilyState(f)
  }
  const setSurfaceStyle = (s: SurfaceStyle) => {
    localStorage.setItem(`${STORAGE_PREFIX}-surface`, s)
    setSurfaceStyleState(s)
  }
  const setCardBorder = (s: CardBorder) => {
    localStorage.setItem(`${STORAGE_PREFIX}-card-border`, s)
    setCardBorderState(s)
  }
  const setButtonStyle = (s: ButtonStyle) => {
    localStorage.setItem(`${STORAGE_PREFIX}-button-style`, s)
    setButtonStyleState(s)
  }
  const setGradientColor1 = (c: string) => {
    if (c) localStorage.setItem(`${STORAGE_PREFIX}-gradient-color-1`, c)
    else localStorage.removeItem(`${STORAGE_PREFIX}-gradient-color-1`)
    setGradientColor1State(c)
  }
  const setGradientColorMid = (c: string) => {
    if (c) localStorage.setItem(`${STORAGE_PREFIX}-gradient-color-mid`, c)
    else localStorage.removeItem(`${STORAGE_PREFIX}-gradient-color-mid`)
    setGradientColorMidState(c)
  }
  const setGradientColor2 = (c: string) => {
    if (c) localStorage.setItem(`${STORAGE_PREFIX}-gradient-color-2`, c)
    else localStorage.removeItem(`${STORAGE_PREFIX}-gradient-color-2`)
    setGradientColor2State(c)
  }
  const resetGradientColors = () => {
    localStorage.removeItem(`${STORAGE_PREFIX}-gradient-color-1`)
    localStorage.removeItem(`${STORAGE_PREFIX}-gradient-color-mid`)
    localStorage.removeItem(`${STORAGE_PREFIX}-gradient-color-2`)
    setGradientColor1State("")
    setGradientColorMidState("")
    setGradientColor2State("")
  }

  const saveCurrentAsPreset = (name: string) => {
    const newPreset: SavedPreset = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      createdAt: Date.now(),
      theme,
      colorPreset: colorPresetName,
      colorOverridesLight: loadOverrides("light"),
      colorOverridesDark: loadOverrides("dark"),
      radius,
      density,
      fontSize,
      fontFamily,
      surfaceStyle,
      cardBorder,
      buttonStyle,
      gradientColor1,
      gradientColorMid,
      gradientColor2,
    }
    const next = [...savedPresetsState, newPreset]
    setSavedPresetsState(next)
    persistSavedPresets(next)
  }

  const loadSavedPreset = (id: string) => {
    const preset = savedPresetsState.find((p) => p.id === id)
    if (!preset) return
    // Presets saved before the button-style axis existed have no value for it
    const presetButtonStyle = preset.buttonStyle ?? "default"
    const effectiveMode = getEffectiveMode(preset.theme)
    const activeOverrides =
      effectiveMode === "light" ? preset.colorOverridesLight : preset.colorOverridesDark
    localStorage.setItem(storageKey, preset.theme)
    localStorage.setItem(`${STORAGE_PREFIX}-color-preset`, preset.colorPreset)
    saveOverrides("light", preset.colorOverridesLight)
    saveOverrides("dark", preset.colorOverridesDark)
    localStorage.setItem(`${STORAGE_PREFIX}-radius`, String(preset.radius))
    localStorage.setItem(`${STORAGE_PREFIX}-density`, preset.density)
    localStorage.setItem(`${STORAGE_PREFIX}-font-size`, String(preset.fontSize))
    localStorage.setItem(`${STORAGE_PREFIX}-font-family`, preset.fontFamily)
    localStorage.setItem(`${STORAGE_PREFIX}-surface`, preset.surfaceStyle)
    localStorage.setItem(`${STORAGE_PREFIX}-card-border`, preset.cardBorder)
    localStorage.setItem(`${STORAGE_PREFIX}-button-style`, presetButtonStyle)
    if (preset.gradientColor1) localStorage.setItem(`${STORAGE_PREFIX}-gradient-color-1`, preset.gradientColor1)
    else localStorage.removeItem(`${STORAGE_PREFIX}-gradient-color-1`)
    if (preset.gradientColorMid) localStorage.setItem(`${STORAGE_PREFIX}-gradient-color-mid`, preset.gradientColorMid)
    else localStorage.removeItem(`${STORAGE_PREFIX}-gradient-color-mid`)
    if (preset.gradientColor2) localStorage.setItem(`${STORAGE_PREFIX}-gradient-color-2`, preset.gradientColor2)
    else localStorage.removeItem(`${STORAGE_PREFIX}-gradient-color-2`)
    setThemeState(preset.theme)
    setColorPresetState(preset.colorPreset)
    setColorOverridesState(activeOverrides)
    setRadiusState(preset.radius)
    setDensityState(preset.density)
    setFontSizeState(preset.fontSize)
    setFontFamilyState(preset.fontFamily)
    setSurfaceStyleState(preset.surfaceStyle)
    setCardBorderState(preset.cardBorder)
    setButtonStyleState(presetButtonStyle)
    setGradientColor1State(preset.gradientColor1)
    setGradientColorMidState(preset.gradientColorMid)
    setGradientColor2State(preset.gradientColor2)
  }

  const deleteSavedPreset = (id: string) => {
    const next = savedPresetsState.filter((p) => p.id !== id)
    setSavedPresetsState(next)
    persistSavedPresets(next)
  }

  return (
    <ThemeProviderContext.Provider
      value={{
        theme,
        setTheme,
        colorPreset: colorPresetName,
        setColorPreset,
        colorOverrides,
        setColorOverride,
        clearColorOverride,
        clearAllColorOverrides,
        radius,
        setRadius,
        density,
        setDensity,
        fontSize,
        setFontSize,
        fontFamily,
        setFontFamily,
        surfaceStyle,
        setSurfaceStyle,
        cardBorder,
        setCardBorder,
        buttonStyle,
        setButtonStyle,
        gradientColor1,
        setGradientColor1,
        gradientColorMid,
        setGradientColorMid,
        gradientColor2,
        setGradientColor2,
        resetGradientColors,
        savedPresets: savedPresetsState,
        saveCurrentAsPreset,
        loadSavedPreset,
        deleteSavedPreset,
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}

// Re-export for convenience
export { colorPresets, type ColorPresetName } from "@/data/theme-presets"
