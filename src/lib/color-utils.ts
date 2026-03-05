/**
 * Resolves a CSS custom property to a hex color by letting the browser
 * do the color-space conversion (oklch → rgb → hex).
 */
export function cssVarToHex(varName: string): string {
  const el = document.createElement("div")
  el.style.display = "none"
  document.body.appendChild(el)
  el.style.color = `var(${varName})`
  const computed = getComputedStyle(el).color
  el.remove()

  const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return "#808080"
  const r = parseInt(match[1])
  const g = parseInt(match[2])
  const b = parseInt(match[3])
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  )
}
