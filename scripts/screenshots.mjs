#!/usr/bin/env node
/**
 * Capture README screenshots showing off the theme system.
 *
 * Usage:
 *   1. Start the dev server:  npm run dev
 *   2. Run this script:       node scripts/screenshots.mjs
 *
 * Output lands in ./screenshots/
 */

import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASE = "http://localhost:5173";
const OUT = "screenshots";
const VIEWPORT = { width: 1440, height: 900 };
const PREFIX = "shadcn-dash-lab";

mkdirSync(OUT, { recursive: true });

// Each scenario sets localStorage entries that the ThemeProvider reads on load.
const scenarios = [
  {
    name: "dashboard-dark",
    storage: { theme: "dark", "color-preset": "neutral" },
  },
  {
    name: "dashboard-light",
    storage: { theme: "light", "color-preset": "neutral" },
  },
  {
    name: "theme-cyberpunk",
    storage: { theme: "dark", "color-preset": "cyberpunk" },
  },
  {
    name: "theme-midnight",
    storage: { theme: "dark", "color-preset": "midnight" },
  },
  {
    name: "theme-forest",
    storage: { theme: "dark", "color-preset": "forest" },
  },
  {
    name: "theme-sunset",
    storage: { theme: "light", "color-preset": "sunset" },
  },
  {
    name: "theme-nord",
    storage: { theme: "dark", "color-preset": "nord" },
  },
];

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,         // retina-quality
    colorScheme: "dark",
  });

  for (const { name, storage, openCustomizer } of scenarios) {
    const page = await context.newPage();

    // Seed localStorage before the app boots
    await page.addInitScript(({ prefix, entries }) => {
      for (const [key, value] of Object.entries(entries)) {
        localStorage.setItem(`${prefix}-${key}`, value);
      }
    }, { prefix: PREFIX, entries: storage });

    await page.goto(BASE, { waitUntil: "networkidle" });

    // Let fonts, charts, and animations settle
    await page.waitForTimeout(1500);

    await page.screenshot({ path: `${OUT}/${name}.png` });
    console.log(`  ✓ ${name}.png`);

    await page.close();
  }

  // ── Extra: customizer panel open ────────────────────────────
  {
    const page = await context.newPage();

    await page.addInitScript(({ prefix }) => {
      localStorage.setItem(`${prefix}-theme`, "dark");
      localStorage.setItem(`${prefix}-color-preset`, "cyberpunk");
    }, { prefix: PREFIX });

    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Open the theme customizer sheet (the Palette icon button)
    await page.getByRole("button", { name: "Theme settings" }).click();
    await page.waitForTimeout(800);   // sheet slide animation

    await page.screenshot({ path: `${OUT}/theme-customizer.png` });
    console.log("  ✓ theme-customizer.png");

    await page.close();
  }

  await browser.close();
  console.log(`\nDone — ${scenarios.length + 1} screenshots in ./${OUT}/`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
