#!/usr/bin/env node
/**
 * Paste YouTube Shorts URLs (one per line) → JSON snippet or generated module.
 *
 * Usage:
 *   node scripts/import-youtube-shorts.mjs prototype1/data/foodwishes-shorts.txt
 *   node scripts/import-youtube-shorts.mjs prototype1/data/foodwishes-shorts.txt --write prototype1/src/data/foodwishes-shorts.generated.js
 *   node scripts/import-youtube-shorts.mjs … --write … --no-titles   # keep titles in output file; refresh slugs only
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { uniqueSlug } from "../lib/url-scheme.mjs";

const args = process.argv.slice(2);
const writePath = args.includes("--write") ? args[args.indexOf("--write") + 1] : null;
const skipTitles = args.includes("--no-titles");
const inputPath = args.find((a) => a && !a.startsWith("--") && a !== writePath) || null;

const input = inputPath ? fs.readFileSync(inputPath, "utf8") : fs.readFileSync(0, "utf8");

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

function videoIdFromUrl(url) {
  const m = String(url).match(/(?:shorts\/|v=)([a-zA-Z0-9_-]{6,})/);
  return m ? m[1] : null;
}

async function loadExistingMeta(filePath) {
  const mod = await import(pathToFileURL(path.resolve(filePath)).href);
  if (!Array.isArray(mod.SHORT_META)) return null;
  return mod.SHORT_META;
}

function enrichMetaWithSlugs(meta, urlList) {
  const used = new Map();
  return meta.map((entry, i) => {
    const videoId = videoIdFromUrl(urlList[i]);
    const title = entry.title || `Recipe ${i + 1}`;
    const slug = uniqueSlug(title, used);
    return {
      title,
      slug,
      videoId: videoId || entry.videoId || null,
      blurb: entry.blurb ?? "",
      macros: entry.macros ?? "",
    };
  });
}

async function fetchTitle(videoId) {
  const watch = `https://www.youtube.com/watch?v=${videoId}`;
  const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(watch)}&format=json`;
  const res = await fetch(oembed, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`oEmbed ${res.status} for ${videoId}`);
  const data = await res.json();
  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) throw new Error(`empty title for ${videoId}`);
  return title;
}

async function fetchTitlesForUrls(urlList) {
  const meta = [];
  const concurrency = 8;
  let next = 0;

  async function worker() {
    while (next < urlList.length) {
      const i = next++;
      const id = videoIdFromUrl(urlList[i]);
      const fallback = `Recipe ${i + 1}`;
      if (!id) {
        meta[i] = { title: fallback, blurb: "", macros: "" };
        continue;
      }
      try {
        const title = await fetchTitle(id);
        meta[i] = { title, blurb: "", macros: "" };
        process.stderr.write(`  [${i + 1}/${urlList.length}] ${title.slice(0, 60)}${title.length > 60 ? "…" : ""}\n`);
      } catch (err) {
        process.stderr.write(`  [${i + 1}/${urlList.length}] warn: ${err.message} → ${fallback}\n`);
        meta[i] = { title: fallback, blurb: "", macros: "" };
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, urlList.length) }, () => worker()));
  return meta;
}

if (writePath) {
  let meta;

  if (skipTitles && fs.existsSync(writePath)) {
    const existing = await loadExistingMeta(writePath);
    if (existing && existing.length === unique.length) {
      process.stderr.write(`Keeping ${existing.length} titles from ${writePath}; refreshing slugs…\n`);
      meta = enrichMetaWithSlugs(existing, unique);
    } else if (existing) {
      process.stderr.write(`warn: URL count (${unique.length}) ≠ existing meta (${existing.length}); fetching titles…\n`);
      meta = await fetchTitlesForUrls(unique);
      meta = enrichMetaWithSlugs(meta, unique);
    } else {
      meta = enrichMetaWithSlugs(
        unique.map((_, i) => ({ title: `Recipe ${i + 1}`, blurb: "", macros: "" })),
        unique
      );
    }
  } else if (skipTitles) {
    meta = enrichMetaWithSlugs(
      unique.map((_, i) => ({ title: `Recipe ${i + 1}`, blurb: "", macros: "" })),
      unique
    );
  } else {
    process.stderr.write(`Fetching ${unique.length} titles from YouTube oEmbed…\n`);
    meta = await fetchTitlesForUrls(unique);
    meta = enrichMetaWithSlugs(meta, unique);
  }

  const relInput = inputPath || "…";
  const body = `/** Auto-generated — do not edit. Run: node scripts/import-youtube-shorts.mjs ${relInput} --write ${writePath} */
export const SHORT_URLS = ${JSON.stringify(unique, null, 2)};

export const SHORT_META = ${JSON.stringify(meta, null, 2)};
`;
  fs.writeFileSync(writePath, body, "utf8");
  console.error(`Wrote ${unique.length} unique shorts + slugs → ${writePath}`);
} else {
  console.log(`// ${unique.length} shorts\n`);
  console.log("const SHORT_URLS = [");
  unique.forEach((u) => console.log(`  "${u}",`));
  console.log("];\n");
  console.log("const SHORT_META = [");
  unique.forEach((_, i) => {
    console.log(`  { title: "Recipe ${i + 1}", slug: "recipe-${i + 1}", blurb: "", macros: "" },`);
  });
  console.log("];");
}
