#!/usr/bin/env node
/**
 * Build static HTML for pilot creator SEO (hub + recipe pages, robots, sitemap).
 *
 *   node scripts/generate-seo-pages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  SITE_ORIGIN,
  canonicalCreatorHubUrl,
  canonicalRecipeUrl,
  creatorHubPath,
  prototypeCreatorHubPath,
  prototypeRecipePath,
  recipePath,
} from "../lib/url-scheme.mjs";
import { escapeHtml, hubIndexable, jsonLdScript, postIndexable, robotsContent } from "./lib/seo-html.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const GENERATED = path.join(ROOT, "prototype1/src/data/foodwishes-shorts.generated.js");

const CLAIM_URL = "https://forms.gle/Ut8bRDfcMP9fZYTN6";

const CREATOR = {
  id: "foodwishes",
  displayName: "Food Wishes",
  handle: "@foodwishes",
  bio: "YouTube recipe shorts · shop ingredients from each post",
  youtubeChannel: "https://www.youtube.com/@foodwishes/shorts",
  claimed: false,
};

function pageShell({ title, description, canonical, robots, ogImage, jsonLd, body, pageType, recipeSlug }) {
  const ogTitle = escapeHtml(title);
  const ogDesc = escapeHtml(description);
  const canonicalEsc = escapeHtml(canonical);

  const analyticsBoot = `
    <script src="/analytics-config.js"></script>
    <script src="/analytics.js"></script>
    <script>
      (function () {
        var props = {
          creator_id: ${JSON.stringify(CREATOR.id)},
          crave_page: ${JSON.stringify(pageType)},
          recipe_slug: ${JSON.stringify(recipeSlug || "")},
        };
        function capture() {
          if (!window.posthog || !window.posthog.capture) return false;
          window.posthog.register(props);
          if (${JSON.stringify(pageType)} === "post") {
            window.posthog.capture("recipe_page_view", props);
          }
          return true;
        }
        if (!capture()) {
          var n = 0;
          var t = setInterval(function () {
            if (capture() || ++n > 25) clearInterval(t);
          }, 120);
        }
      })();
    </script>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${ogDesc}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${canonicalEsc}" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDesc}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalEsc}" />
    ${ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}" />` : ""}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta name="twitter:description" content="${ogDesc}" />
    ${ogImage ? `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />` : ""}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/seo-pages.css" />
    ${jsonLd || ""}
  </head>
  <body class="seo-page">
    ${body}
    ${analyticsBoot}
  </body>
</html>`;
}

function disclaimerBlock() {
  if (CREATOR.claimed) return "";
  return `<p class="seo-disclaimer" role="note">Demo profile · Not affiliated with ${escapeHtml(CREATOR.displayName)} · <a href="${CLAIM_URL}">Claim to manage</a></p>`;
}

function siteHeader(backHref, backLabel) {
  return `<header class="seo-header">
    <a class="seo-logo" href="/">Crave</a>
    ${backHref ? `<a href="${escapeHtml(backHref)}">${escapeHtml(backLabel)}</a>` : ""}
  </header>`;
}

function buildRecipePage(meta, index) {
  const canonical = canonicalRecipeUrl(CREATOR.id, meta.slug);
  const indexable = postIndexable(meta, CREATOR.claimed);
  const watchUrl = meta.videoId ? `https://www.youtube.com/watch?v=${meta.videoId}` : CREATOR.youtubeChannel;
  const shortsUrl = meta.videoId ? `https://www.youtube.com/shorts/${meta.videoId}` : CREATOR.youtubeChannel;
  const embedUrl = meta.videoId ? `https://www.youtube.com/embed/${meta.videoId}` : null;
  const interactiveUrl = prototypeRecipePath(CREATOR.id, meta.slug);

  const bodyText =
    meta.blurb ||
    meta.description ||
    `Watch ${meta.title} and explore shoppable ingredients on Crave.`;

  const jsonLd = [
    jsonLdScript({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: meta.title,
      description: meta.description,
      thumbnailUrl: meta.thumbnailUrl,
      embedUrl,
      contentUrl: watchUrl,
      uploadDate: undefined,
      author: {
        "@type": "Person",
        name: CREATOR.displayName,
      },
    }),
    jsonLdScript({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Crave", item: SITE_ORIGIN + "/" },
        {
          "@type": "ListItem",
          position: 2,
          name: CREATOR.displayName,
          item: canonicalCreatorHubUrl(CREATOR.id),
        },
        { "@type": "ListItem", position: 3, name: meta.title, item: canonical },
      ],
    }),
  ].join("\n    ");

  const body = `
    ${siteHeader(creatorHubPath(CREATOR.id), "← All recipes")}
    ${disclaimerBlock()}
    <main class="seo-main">
      <h1>${escapeHtml(meta.title)}</h1>
      <p class="seo-lead">${escapeHtml(bodyText)}</p>
      ${
        embedUrl
          ? `<div class="seo-video-wrap"><iframe src="${escapeHtml(embedUrl)}" title="${escapeHtml(meta.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>`
          : ""
      }
      <p class="seo-yt-link"><a href="${escapeHtml(shortsUrl)}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></p>
      <section class="seo-section" aria-label="Shop ingredients">
        <h2>Shop this recipe</h2>
        <p>Ingredient highlights and timed shop cards are available in the interactive viewer. On this demo profile, shop taps are measured for outreach; affiliate links activate when the creator claims.</p>
        <a class="seo-cta" href="${escapeHtml(interactiveUrl)}">Open interactive shop experience</a>
        <p class="seo-ftc">Disclosure: Crave may earn affiliate commissions on purchases through creator links after claim. This demo does not use creator affiliate tags.</p>
      </section>
      <section class="seo-section">
        <h2>Claim this profile</h2>
        <p>Are you ${escapeHtml(CREATOR.displayName)}? Claim this page to connect your affiliate links and analytics.</p>
        <a class="seo-cta" href="${CLAIM_URL}">Claim to manage</a>
      </section>
    </main>`;

  return pageShell({
    title: `${meta.title} · ${CREATOR.displayName} · Crave`,
    description: meta.description,
    canonical,
    robots: robotsContent(indexable),
    ogImage: meta.thumbnailUrl,
    jsonLd,
    body,
    pageType: "post",
    recipeSlug: meta.slug,
  });
}

function buildHubPage(metaList) {
  const canonical = canonicalCreatorHubUrl(CREATOR.id);
  const indexable = hubIndexable(metaList, CREATOR.claimed);
  const interactiveHub = prototypeCreatorHubPath(CREATOR.id);

  const items = metaList
    .map(
      (m) =>
        `<li><a href="${escapeHtml(recipePath(CREATOR.id, m.slug))}">${escapeHtml(m.title)}</a></li>`
    )
    .join("\n        ");

  const jsonLd = jsonLdScript({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${CREATOR.displayName} recipes on Crave`,
    description: `Shop ${CREATOR.displayName} YouTube Shorts recipes on Crave.`,
    url: canonical,
  });

  const body = `
    ${siteHeader("/", "← Crave home")}
    ${disclaimerBlock()}
    <main class="seo-main">
      <h1>${escapeHtml(CREATOR.displayName)}</h1>
      <p class="seo-lead">${escapeHtml(CREATOR.bio)}</p>
      <p class="seo-hub-count">${metaList.length} recipe shorts</p>
      <ul class="seo-hub-list">
        ${items}
      </ul>
      <section class="seo-section">
        <h2>Interactive profile</h2>
        <p>Swipe between shorts, save ingredients, and log shop interest in the full app experience.</p>
        <a class="seo-cta" href="${escapeHtml(interactiveHub)}">Open interactive profile</a>
      </section>
      <p class="seo-yt-link"><a href="${escapeHtml(CREATOR.youtubeChannel)}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></p>
    </main>`;

  return pageShell({
    title: `${CREATOR.displayName} · Crave`,
    description: `Shop ${CREATOR.displayName} recipe shorts on Crave — ${metaList.length} videos with shoppable ingredients.`,
    canonical,
    robots: robotsContent(indexable),
    ogImage: metaList[0]?.thumbnailUrl || null,
    jsonLd,
    body,
    pageType: "creator",
    recipeSlug: "",
  });
}

function writeRobots() {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;
  fs.writeFileSync(path.join(PUBLIC, "robots.txt"), body, "utf8");
}

function writeSitemap(metaList) {
  const urls = [];
  if (hubIndexable(metaList, CREATOR.claimed)) {
    urls.push({ loc: canonicalCreatorHubUrl(CREATOR.id), priority: "0.8" });
  }
  metaList.forEach((m) => {
    if (postIndexable(m, CREATOR.claimed)) {
      urls.push({ loc: canonicalRecipeUrl(CREATOR.id, m.slug), priority: "0.6" });
    }
  });

  const today = new Date().toISOString().slice(0, 10);
  const urlEntries = urls
    .map(
      (u) => `  <url>
    <loc>${escapeHtml(u.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries || "  <!-- No indexable URLs while pilot is unclaimed / no unique copy -->"}
</urlset>
`;
  fs.writeFileSync(path.join(PUBLIC, "sitemap.xml"), xml, "utf8");
  return urls.length;
}

function cleanOutputDir(outDir, metaList) {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
    return;
  }
  const validSlugs = new Set(metaList.map((m) => m.slug));
  for (const name of fs.readdirSync(outDir)) {
    const full = path.join(outDir, name);
    if (name === "index.html") continue;
    if (fs.statSync(full).isDirectory() && !validSlugs.has(name)) {
      fs.rmSync(full, { recursive: true, force: true });
    }
  }
}

async function main() {
  const mod = await import(pathToFileURL(GENERATED).href);
  const metaList = mod.SHORT_META;
  if (!metaList?.length) throw new Error("SHORT_META empty — run import script first");

  const outDir = path.join(PUBLIC, "c", CREATOR.id);
  cleanOutputDir(outDir, metaList);

  fs.writeFileSync(path.join(outDir, "index.html"), buildHubPage(metaList), "utf8");

  metaList.forEach((meta, i) => {
    const dir = path.join(outDir, meta.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), buildRecipePage(meta, i), "utf8");
  });

  writeRobots();
  const sitemapCount = writeSitemap(metaList);

  console.error(`SEO pages: ${metaList.length} recipes + hub → public/c/${CREATOR.id}/`);
  console.error(`robots.txt, sitemap.xml (${sitemapCount} indexable URLs)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
