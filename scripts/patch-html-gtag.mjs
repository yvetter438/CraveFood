#!/usr/bin/env node
/**
 * Insert gtag.js after analytics-config.js in public HTML (skip generated SEO tree if already patched).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");

function relPrefix(fromDir) {
  const rel = path.relative(fromDir, PUBLIC);
  if (!rel || rel === ".") return "";
  return rel.split(path.sep).map(() => "..").join("/") + "/";
}

function patchFile(filePath) {
  let html = fs.readFileSync(filePath, "utf8");
  if (html.includes("gtag.js")) return false;
  if (!html.includes("analytics-config.js")) return false;

  const prefix = relPrefix(path.dirname(filePath));
  const gtagTag = `<script src="${prefix}gtag.js"></script>`;

  const next = html.replace(
    /(<script\s+src="[^"]*analytics-config\.js"><\/script>)/i,
    `$1\n    ${gtagTag}`
  );
  if (next === html) return false;
  fs.writeFileSync(filePath, next, "utf8");
  return true;
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === "prototype1") continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

let n = 0;
for (const file of walk(PUBLIC)) {
  if (patchFile(file)) {
    n += 1;
    console.error("patched:", path.relative(PUBLIC, file));
  }
}

const p1Index = path.join(PUBLIC, "prototype1", "index.html");
if (fs.existsSync(p1Index) && patchFile(p1Index)) {
  n += 1;
  console.error("patched: prototype1/index.html");
}

console.error(`patch-html-gtag: ${n} file(s)`);
