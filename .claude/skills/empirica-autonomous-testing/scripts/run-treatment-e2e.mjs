#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { createAndStartBatch, ensureAdminSession } from "./lib/admin.mjs";

function arg(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

const baseUrl = arg("--base", "http://localhost:3000");
const treatment = arg("--treatment", "None");
const playerCount = Number(arg("--player-count", "5"));
const assignment = arg("--assignment", "complete");
const outDir = arg("--out", ".github/skills/empirica-autonomous-testing/artifacts/e2e");
const participantPrefix = arg("--participant-prefix", "auto");
const adminUser = arg("--admin-user", "admin");
const adminPass = arg("--admin-pass", "");
const skipIntro = arg("--skip-intro", "0") === "1";
const requireExit = arg("--require-exit", "1") === "1";
const participantTimeoutMs = Number(arg("--participant-timeout-ms", "240000"));

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const adminPage = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

async function shot(page, name) {
  const target = path.join(outDir, name);
  await page.screenshot({ path: target, fullPage: true });
  console.log(`screenshot: ${target}`);
}

async function runParticipantSmokeFlow(page, participantUrl, timeoutMs) {
  await page.goto(participantUrl, { waitUntil: "domcontentloaded" });
  const start = Date.now();
  let clicks = 0;

  while (Date.now() - start < timeoutMs) {
    const body = (await page.locator("body").innerText()).toLowerCase();
    if (body.includes("completion code") || body.includes("thank you")) {
      return { completedExit: true, reason: "reached-exit", exitSurveySubmitted: true };
    }
    if (await clickCommon(page)) {
      clicks += 1;
      if (clicks >= 8) break;
      continue;
    }
    await page.waitForTimeout(700);
  }

  return { completedExit: false, reason: "timeout", exitSurveySubmitted: false };
}

async function clickCommon(page) {
  const candidates = [
    /i agree/i,
    /continue/i,
    /next/i,
    /start/i,
    /submit/i,
    /done/i,
    /finish/i,
  ];
  for (const name of candidates) {
    const button = page.getByRole("button", { name });
    if ((await button.count()) > 0) {
      await button.first().click();
      await page.waitForTimeout(350);
      return true;
    }
  }
  return false;
}

try {
  await ensureAdminSession(adminPage, {
    baseUrl,
    username: adminUser,
    password: adminPass,
  });
  await shot(adminPage, "01-admin-ready.png");

  await createAndStartBatch(adminPage, {
    treatmentName: treatment,
    assignment,
  });
  await shot(adminPage, "02-admin-batch-started.png");

  const participants = [];
  const pages = [];
  for (let i = 1; i <= playerCount; i += 1) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const url = new URL("/", baseUrl);
    url.searchParams.set("participantKey", `${participantPrefix}-p${i}`);
    if (skipIntro) {
      url.searchParams.set("skipIntro", "1");
    }
    pages.push({ page, index: i, url: url.toString() });
    participants.push(ctx);
  }

  const statuses = await Promise.all(
    pages.map(async ({ page, index, url }) => {
      const status = await runParticipantSmokeFlow(page, url, participantTimeoutMs);
      await shot(page, `03-participant-${index}.png`);
      return { participant: index, ...status };
    }),
  );

  await adminPage.waitForTimeout(1500);
  await shot(adminPage, "04-admin-post-run.png");
  console.log("participant-statuses:", JSON.stringify(statuses));
  if (requireExit && statuses.some((s) => !s.completedExit || !s.exitSurveySubmitted)) {
    throw new Error(
      `Not all participants submitted exit and reached final step: ${JSON.stringify(statuses)}`,
    );
  }
  console.log("run-treatment-e2e complete");

  for (const ctx of participants) {
    await ctx.close();
  }
} finally {
  await browser.close();
}
