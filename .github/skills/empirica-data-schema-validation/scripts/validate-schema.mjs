#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function parseArg(flag, fallback = "") {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

function listFiles(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const curr = stack.pop();
    const entries = fs.readdirSync(curr, { withFileTypes: true });
    for (const entry of entries) {
      const p = path.join(curr, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules") continue;
        stack.push(p);
      } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
        out.push(p);
      }
    }
  }
  return out;
}

function collectKeys(text, regex) {
  const keys = [];
  let m;
  while ((m = regex.exec(text))) {
    keys.push(m[1]);
  }
  return keys;
}

const serverFile = parseArg("--server", "server/src/callbacks.js");
const clientDir = parseArg("--client", "client/src");
const expectedFile = parseArg(
  "--expect",
  ".github/skills/empirica-data-schema-validation/expected-schema.example.json"
);

const producers = new Map();
const consumers = new Map();

for (const file of [serverFile, ...listFiles(clientDir)]) {
  const text = fs.readFileSync(file, "utf8");
  for (const key of collectKeys(text, /\.set\(["']([^"']+)["']/g)) {
    const refs = producers.get(key) || [];
    refs.push(file);
    producers.set(key, refs);
  }
  for (const key of collectKeys(text, /\.get\(["']([^"']+)["']/g)) {
    const refs = consumers.get(key) || [];
    refs.push(file);
    consumers.set(key, refs);
  }
}

const expected = JSON.parse(fs.readFileSync(expectedFile, "utf8"));
const missingRequired = [];
for (const entry of expected.required || []) {
  if (!producers.has(entry.key) && !consumers.has(entry.key)) {
    missingRequired.push(entry.key);
  }
}

const consumedWithoutProducer = [];
for (const [key] of consumers.entries()) {
  if (!producers.has(key)) {
    consumedWithoutProducer.push(key);
  }
}

console.log("Observed producer keys:", [...producers.keys()].sort().join(", "));
console.log("Observed consumer keys:", [...consumers.keys()].sort().join(", "));
console.log("Consumed without local producer:", consumedWithoutProducer.join(", "));

if (missingRequired.length) {
  console.error("Missing required keys:", missingRequired.join(", "));
  process.exitCode = 1;
}
