import { Check, Download, Play, Plus, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/components/theme-provider"
import { buttonStyleOptions } from "@/data/button-styles"
import { cn } from "@/lib/utils"

/** One full set of variants, wrapped in its own button-style scope. */
function VariantRow({ style }: { style: string }) {
  return (
    <div data-button-style={style} className="flex flex-wrap items-center gap-2">
      <Button>
        <Plus />
        Deploy
      </Button>
      <Button variant="secondary">Restart</Button>
      <Button variant="outline">
        <Download />
        Export
      </Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive">
        <Trash2 />
        Destroy
      </Button>
      <Button size="icon" variant="outline" aria-label="Refresh">
        <RefreshCw />
      </Button>
    </div>
  )
}

export function ButtonLabPage() {
  const { buttonStyle, setButtonStyle } = useTheme()
  const active = buttonStyleOptions.find((o) => o.value === buttonStyle)

  return (
    <div className="flex flex-col" style={{ gap: "var(--space-section)" }}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Buttons</h2>
        <p className="text-muted-foreground text-sm">
          Depth treatments beyond fill and radius — hover and press each one, they
          are built to respond. Click a row to make it the app-wide style.
        </p>
      </div>

      {/* Every treatment side by side. Each row is its own @scope root, so the
          app-wide setting doesn't bleed into the comparison. */}
      <Card>
        <CardHeader>
          <CardTitle>All treatments</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {buttonStyleOptions.map((option) => {
            const isActive = buttonStyle === option.value
            return (
              <div
                key={option.value}
                className={cn(
                  "grid grid-cols-1 items-center gap-3 rounded-lg border-2 px-4 py-4 transition-colors md:grid-cols-[11rem_1fr]",
                  isActive ? "border-primary bg-primary/5" : "border-transparent"
                )}
              >
                <div className="min-w-0 space-y-1.5">
                  <div>
                    <div className="text-sm font-medium">{option.label}</div>
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {option.description}
                    </p>
                  </div>
                  <Button
                    size="xs"
                    variant={isActive ? "secondary" : "outline"}
                    onClick={() => setButtonStyle(option.value)}
                    aria-pressed={isActive}
                  >
                    {isActive && <Check />}
                    {isActive ? "Applied" : "Apply"}
                  </Button>
                </div>
                <VariantRow style={option.value} />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Sizes and states for whatever is currently applied app-wide. */}
      <div className="grid lg:grid-cols-2" style={{ gap: "var(--space-section)" }}>
        <Card>
          <CardHeader>
            <CardTitle>Sizes — {active?.label}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button size="xs">Extra small</Button>
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="icon-xs" variant="secondary" aria-label="Play">
                <Play />
              </Button>
              <Button size="icon-sm" variant="secondary" aria-label="Play">
                <Play />
              </Button>
              <Button size="icon" variant="secondary" aria-label="Play">
                <Play />
              </Button>
              <Button size="icon-lg" variant="secondary" aria-label="Play">
                <Play />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>States — {active?.label}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button disabled>Disabled</Button>
              <Button variant="outline" disabled>
                Disabled outline
              </Button>
              <Button variant="link">Link variant</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button>
                <RefreshCw className="animate-spin" />
                Working…
              </Button>
              <Button variant="secondary" aria-invalid="true">
                Invalid
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Link buttons are deliberately left untouched by every treatment —
              they are text, not a surface.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
