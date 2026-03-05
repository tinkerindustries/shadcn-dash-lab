import { useState } from "react"
import { Palette, Monitor, Moon, Sun, Check, ChevronDown, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  useTheme,
  fontPresets,
  colorPresets,
  type Theme,
  type ColorPresetName,
  type Density,
  type FontFamily,
  type SurfaceStyle,
} from "@/components/theme-provider"
import { colorGroups } from "@/data/theme-presets"
import { cssVarToHex } from "@/lib/color-utils"
import { cn } from "@/lib/utils"

// ── Mode selector ───────────────────────────────────────────────

const modeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
]

function ModeCard({
  mode,
  active,
  onClick,
}: {
  mode: (typeof modeOptions)[number]
  active: boolean
  onClick: () => void
}) {
  const isDark = mode.value === "dark"
  const isSys = mode.value === "system"
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-colors cursor-pointer",
        active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      )}
    >
      <div className={cn("w-full aspect-[4/3] rounded-md overflow-hidden border", isDark || isSys ? "border-zinc-700" : "border-zinc-200")}>
        <div className="flex h-full">
          <div className={cn("w-1/4 h-full flex flex-col gap-[2px] p-1", isDark ? "bg-zinc-900" : isSys ? "bg-gradient-to-b from-zinc-100 to-zinc-900" : "bg-zinc-100")}>
            <div className={cn("h-1 rounded-full w-3/4", isDark ? "bg-zinc-700" : "bg-zinc-300")} />
            <div className={cn("h-1 rounded-full w-full", isDark ? "bg-zinc-700" : "bg-zinc-300")} />
            <div className={cn("h-1 rounded-full w-2/3", isDark ? "bg-zinc-700" : "bg-zinc-300")} />
          </div>
          <div className={cn("flex-1 p-1 flex flex-col gap-[2px]", isDark ? "bg-zinc-950" : isSys ? "bg-gradient-to-b from-white to-zinc-950" : "bg-white")}>
            <div className="flex gap-[2px]">
              <div className={cn("h-2 flex-1 rounded-[2px]", isDark ? "bg-zinc-800" : "bg-zinc-200")} />
              <div className={cn("h-2 flex-1 rounded-[2px]", isDark ? "bg-zinc-800" : "bg-zinc-200")} />
            </div>
            <div className={cn("h-4 rounded-[2px] flex-1", isDark ? "bg-zinc-800" : "bg-zinc-200")} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-medium">{mode.icon}{mode.label}</div>
      {active && (
        <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-2.5 w-2.5 text-primary-foreground" />
        </div>
      )}
    </button>
  )
}

// ── Color preset card ───────────────────────────────────────────

function PresetCard({
  preset,
  active,
  onClick,
}: {
  preset: (typeof colorPresets)[ColorPresetName]
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-colors cursor-pointer",
        active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      )}
    >
      <div className="flex gap-1">
        {preset.swatches.map((color, i) => (
          <div
            key={i}
            className="h-5 w-5 rounded-full border border-black/10"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <span className="text-xs font-medium">{preset.label}</span>
      {active && (
        <div className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-2 w-2 text-primary-foreground" />
        </div>
      )}
    </button>
  )
}

// ── Color picker row ────────────────────────────────────────────

function ColorRow({
  varName,
  label,
  hasOverride,
  onPick,
  onReset,
}: {
  varName: string
  label: string
  hasOverride: boolean
  onPick: (value: string) => void
  onReset: () => void
}) {
  const [hex, setHex] = useState(() => cssVarToHex(varName))

  return (
    <div className="flex items-center gap-2">
      <label className="relative cursor-pointer">
        <input
          type="color"
          value={hex}
          onChange={(e) => {
            setHex(e.target.value)
            onPick(e.target.value)
          }}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div
          className={cn(
            "h-6 w-6 rounded-md border transition-all",
            hasOverride ? "border-primary ring-1 ring-primary/30" : "border-border"
          )}
          style={{ backgroundColor: hex }}
        />
      </label>
      <span className="text-xs flex-1 truncate">{label}</span>
      {hasOverride && (
        <button
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Reset to preset"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

// ── Color group collapsible ─────────────────────────────────────

function ColorGroupSection({
  group,
  overrides,
  onPick,
  onReset,
}: {
  group: (typeof colorGroups)[number]
  overrides: Record<string, string>
  onPick: (varName: string, value: string) => void
  onReset: (varName: string) => void
}) {
  const [open, setOpen] = useState(false)
  const overrideCount = group.vars.filter((v) => overrides[v.key]).length

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-1.5 text-xs font-medium cursor-pointer hover:text-foreground text-muted-foreground transition-colors">
        <span>
          {group.label}
          {overrideCount > 0 && (
            <span className="ml-1.5 text-[10px] text-primary">({overrideCount})</span>
          )}
        </span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid gap-2 pb-2 pt-1">
          {group.vars.map((v) => (
            <ColorRow
              key={v.key}
              varName={v.key}
              label={v.label}
              hasOverride={!!overrides[v.key]}
              onPick={(value) => onPick(v.key, value)}
              onReset={() => onReset(v.key)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// ── Shared option button ────────────────────────────────────────

function OptionButton({
  label,
  active,
  onClick,
  style,
}: {
  label: string
  active: boolean
  onClick: () => void
  style?: React.CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-9 flex-1 items-center justify-center border-2 text-xs font-medium transition-colors cursor-pointer rounded-md",
        active ? "border-primary bg-primary/10 text-foreground" : "border-border hover:border-primary/50 text-muted-foreground"
      )}
      style={style}
    >
      {label}
    </button>
  )
}

// ── Font button ─────────────────────────────────────────────────

function FontButton({
  preset,
  active,
  onClick,
}: {
  preset: (typeof fontPresets)[FontFamily]
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-0.5 rounded-md border-2 px-3 py-2 transition-colors cursor-pointer text-left",
        active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      )}
    >
      <span className="text-sm font-medium truncate w-full" style={{ fontFamily: preset.value }}>{preset.label}</span>
      <span className="text-[10px] text-muted-foreground truncate w-full" style={{ fontFamily: preset.value }}>The quick brown fox jumps</span>
    </button>
  )
}

// ── Section header ──────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h4 className="text-sm font-medium">{children}</h4>
}

// ── Main export ─────────────────────────────────────────────────

const radiusOptions = [0, 0.25, 0.5, 0.75, 1.0]
const fontSizeOptions = [13, 14, 15, 16, 18]
const densityOptions: { value: Density; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
]
const surfaceOptions: { value: SurfaceStyle; label: string; description: string }[] = [
  { value: "flat", label: "Flat", description: "No shadows, borders only" },
  { value: "default", label: "Subtle", description: "Light shadow on cards" },
  { value: "elevated", label: "Elevated", description: "Medium depth and lift" },
  { value: "bold", label: "Bold", description: "Heavy shadows, inset edges" },
]

export function ThemeCustomizer() {
  const {
    theme, setTheme,
    colorPreset, setColorPreset,
    colorOverrides, setColorOverride, clearColorOverride, clearAllColorOverrides,
    radius, setRadius,
    density, setDensity,
    fontSize, setFontSize,
    fontFamily, setFontFamily,
    surfaceStyle, setSurfaceStyle,
  } = useTheme()

  const [advancedOpen, setAdvancedOpen] = useState(false)
  const overrideCount = Object.keys(colorOverrides).length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Theme settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Theme Settings</SheetTitle>
          <SheetDescription>
            Customize the dashboard appearance. Changes are saved automatically.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 pb-8">
          {/* ── Appearance ──────────────────────── */}
          <div className="space-y-3">
            <SectionLabel>Appearance</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              {modeOptions.map((mode) => (
                <ModeCard key={mode.value} mode={mode} active={theme === mode.value} onClick={() => setTheme(mode.value)} />
              ))}
            </div>
          </div>

          <Separator />

          {/* ── Color Theme ─────────────────────── */}
          <div className="space-y-3">
            <SectionLabel>Color Theme</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(colorPresets) as [ColorPresetName, (typeof colorPresets)[ColorPresetName]][]).map(
                ([name, preset]) => (
                  <PresetCard
                    key={name}
                    preset={preset}
                    active={colorPreset === name}
                    onClick={() => setColorPreset(name)}
                  />
                )
              )}
            </div>
          </div>

          {/* ── Advanced Color Overrides ─────────── */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium cursor-pointer hover:text-foreground transition-colors">
              <span>
                Advanced Color Overrides
                {overrideCount > 0 && (
                  <span className="ml-2 text-xs text-primary">({overrideCount} active)</span>
                )}
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", advancedOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-3 space-y-1">
                <p className="text-[11px] text-muted-foreground mb-2">
                  Editing {theme === "system" ? "system-resolved" : theme} mode colors. Overrides apply per mode.
                </p>
                {colorGroups.map((group) => (
                  <ColorGroupSection
                    key={group.label}
                    group={group}
                    overrides={colorOverrides}
                    onPick={(varName, value) => setColorOverride(varName, value)}
                    onReset={(varName) => clearColorOverride(varName)}
                  />
                ))}
                {overrideCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-xs"
                    onClick={clearAllColorOverrides}
                  >
                    <RotateCcw className="h-3 w-3 mr-1.5" />
                    Reset all overrides
                  </Button>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* ── Font Family ─────────────────────── */}
          <div className="space-y-3">
            <SectionLabel>Font Family</SectionLabel>
            <p className="text-[11px] text-muted-foreground -mt-1">Sans-serif</p>
            <div className="grid grid-cols-2 gap-2">
              {(["system", "inter", "dm-sans", "outfit", "sora", "nunito", "rubik", "work-sans", "raleway", "plus-jakarta-sans", "space-grotesk", "ibm-plex-sans"] as FontFamily[]).map((fontName) => (
                <FontButton key={fontName} preset={fontPresets[fontName]} active={fontFamily === fontName} onClick={() => setFontFamily(fontName)} />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">Monospace</p>
            <div className="grid grid-cols-2 gap-2">
              {(["jetbrains-mono", "fira-code", "source-code-pro", "geist-mono"] as FontFamily[]).map((fontName) => (
                <FontButton key={fontName} preset={fontPresets[fontName]} active={fontFamily === fontName} onClick={() => setFontFamily(fontName)} />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">Serif</p>
            <div className="grid grid-cols-2 gap-2">
              {(["bitter", "merriweather"] as FontFamily[]).map((fontName) => (
                <FontButton key={fontName} preset={fontPresets[fontName]} active={fontFamily === fontName} onClick={() => setFontFamily(fontName)} />
              ))}
            </div>
          </div>

          <Separator />

          {/* ── Font Size ───────────────────────── */}
          <div className="space-y-3">
            <SectionLabel>Font Size</SectionLabel>
            <div className="flex gap-2">
              {fontSizeOptions.map((s) => (
                <OptionButton key={s} label={`${s}px`} active={fontSize === s} onClick={() => setFontSize(s)} />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">Sets the base font size. All rem-based sizing scales proportionally.</p>
          </div>

          <Separator />

          {/* ── Surface Style ──────────────────── */}
          <div className="space-y-3">
            <SectionLabel>Surface Style</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {surfaceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSurfaceStyle(option.value)}
                  className={cn(
                    "relative flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-colors cursor-pointer",
                    surfaceStyle === option.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="w-full flex gap-1.5">
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="h-6 flex-1 rounded-[4px] border bg-card"
                        style={{
                          boxShadow:
                            option.value === "flat" ? "none"
                              : option.value === "default" ? "0 1px 2px rgb(0 0 0 / 0.06)"
                                : option.value === "elevated" ? "0 3px 6px -1px rgb(0 0 0 / 0.1), 0 1px 3px rgb(0 0 0 / 0.06)"
                                  : "0 6px 12px -2px rgb(0 0 0 / 0.15), 0 3px 6px rgb(0 0 0 / 0.1), inset 0 1px 0 rgb(255 255 255 / 0.06)",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium">{option.label}</span>
                  <span className="text-[10px] text-muted-foreground leading-tight text-center">{option.description}</span>
                  {surfaceStyle === option.value && (
                    <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* ── Border Radius ───────────────────── */}
          <div className="space-y-3">
            <SectionLabel>Border Radius</SectionLabel>
            <div className="flex gap-2">
              {radiusOptions.map((r) => (
                <OptionButton key={r} label={String(r)} active={radius === r} onClick={() => setRadius(r)} style={{ borderRadius: `${Math.max(r, 0.125)}rem` }} />
              ))}
            </div>
          </div>

          <Separator />

          {/* ── Density ─────────────────────────── */}
          <div className="space-y-3">
            <SectionLabel>Density</SectionLabel>
            <div className="flex gap-2">
              {densityOptions.map((option) => (
                <OptionButton key={option.value} label={option.label} active={density === option.value} onClick={() => setDensity(option.value)} />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">Controls spacing between dashboard elements.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
