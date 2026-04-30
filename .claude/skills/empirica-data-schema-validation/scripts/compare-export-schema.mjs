#!/usr/bin/env node
import fs from "node:fs";

function parseArg(flag, fallback = "") {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return fallback;
  return process.argv[idx + 1];
}

function flattenKeys(value, prefix = "", out = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) flattenKeys(item, prefix, out);
    return out;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      const key = prefix ? `${prefix}.${k}` : k;
      out.add(key);
      flattenKeys(v, key, out);
    }
  }
  return out;
}

const exportPath = parseArg("--export");
const expectPath = parseArg(
  "--expect",
  ".github/skills/empirica-data-schema-validation/expected-schema.example.json"
);

if (!exportPath) {
  console.error("Missing --export <path-to-export-json>");
  process.exit(1);
}

const exported = JSON.parse(fs.readFileSync(exportPath, "utf8"));
const expected = JSON.parse(fs.readFileSync(expectPath, "utf8"));

const exportKeys = flattenKeys(exported);
const missingRequired = [];
for (const req of expected.required || []) {
  if (!exportKeys.has(req.key)) {
    missingRequired.push(req.key);
  }
}

console.log("Exported keys (flattened):", [...exportKeys].sort().join(", "));
if (missingRequired.length > 0) {
  console.error("Missing required export keys:", missingRequired.join(", "));
  process.exitCode = 1;
} else {
  console.log("All required keys found in export.");
}
