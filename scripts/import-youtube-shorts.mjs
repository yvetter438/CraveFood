#!/usr/bin/env node
/**
 * Paste YouTube Shorts URLs (one per line) → JSON snippet or generated module.
 *
 * Usage:
 *   node scripts/import-youtube-shorts.mjs prototype1/data/foodwishes-shorts.txt
 *   node scripts/import-youtube-shorts.mjs prototype1/data/foodwishes-shorts.txt --write prototype1/src/data/foodwishes-shorts.generated.js
 */
import fs from "node:fs";

const writePath = process.argv.includes("--write") ? process.argv[process.argv.indexOf("--write") + 1] : null;
const inputPath = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : null;

const input = inputPath
  ? fs.readFileSync(inputPath, "utf8")
  : fs.readFileSync(0, "utf8");

const lines = input
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"));

const urls = [];
for (const line of lines) {
  const m = line.match(/(?:shorts\/|v=)([a-zA-Z0-9_-]{6,})/);
  if (m) {
    urls.push(`https://www.youtube.com/shorts/${m[1]}`);
  } else if (/^https?:\/\//.test(line)) {
    urls.push(line);
  }
}

const unique = [...new Set(urls)];

if (writePath) {
  const body = `/** Auto-generated — do not edit. Run: node scripts/import-youtube-shorts.mjs ${inputPath || "…"} --write ${writePath} */\nexport const SHORT_URLS = ${JSON.stringify(unique, null, 2)};\n`;
  fs.writeFileSync(writePath, body, "utf8");
  console.error(`Wrote ${unique.length} unique shorts → ${writePath}`);
} else {
  console.log(`// ${unique.length} shorts\n`);
  console.log("const SHORT_URLS = [");
  unique.forEach((u) => console.log(`  "${u}",`));
  console.log("];\n");
  console.log("const SHORT_META = [");
  unique.forEach((_, i) => {
    console.log(`  { title: "Recipe ${i + 1}", blurb: "", macros: "" },`);
  });
  console.log("];");
}
