#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function parseArg(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

const base = parseArg("--base", "http://localhost:3000");
const outDir = parseArg(
  "--out",
  ".github/skills/empirica-autonomous-testing/artifacts"
);
const pathsArg = parseArg("--paths", "/,/admin");
const delayMs = Number(parseArg("--delay-ms", "1000"));
const routes = pathsArg
  .split(",")
  .map((r) => r.trim())
  .filter(Boolean);

fs.mkdirSync(outDir, { recursive: true });

const { chromium } = await import("playwright");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

const failures = [];
for (const route of routes) {
  const url = `${base}${route}`;
  const fileSafe = route === "/" ? "root" : route.replaceAll(/[^a-zA-Z0-9_-]/g, "_");
  const target = path.join(outDir, `${fileSafe}.png`);

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    if (delayMs > 0) {
      await page.waitForTimeout(delayMs);
    }
    await page.screenshot({ path: target, fullPage: true });
    console.log(`screenshot: ${target}`);
  } catch (err) {
    failures.push({ url, error: String(err) });
    console.error(`failed: ${url} :: ${String(err)}`);
  }
}

await browser.close();

if (failures.length) {
  process.exitCode = 1;
}
