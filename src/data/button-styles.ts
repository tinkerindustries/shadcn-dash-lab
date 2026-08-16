import type { ButtonStyle } from "@/components/theme-provider"

export type ButtonStyleOption = {
  value: ButtonStyle
  label: string
  description: string
}

export const buttonStyleOptions: ButtonStyleOption[] = [
  { value: "default", label: "Flat", description: "Stock shadcn — colour only" },
  { value: "physical", label: "Embossed", description: "Moulded cap, presses in" },
  { value: "bevel", label: "Bevel", description: "Hard chamfer, inverts on press" },
  { value: "glass", label: "Glass", description: "Blurred slab with specular wash" },
  { value: "notch", label: "Notched", description: "Cut corners + accent rail" },
  { value: "sheen", label: "Sheen", description: "Light sweeps across on hover" },
  { value: "neon", label: "Neon", description: "Rim light and breathing bloom" },
  { value: "stamp", label: "Stamp", description: "Hard offset block shadow" },
  { value: "soft", label: "Pillow", description: "Diffuse extrusion, sinks in" },
  { value: "spotlight", label: "Spotlight", description: "Highlight tracks the pointer" },
]
