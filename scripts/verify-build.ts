import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { site } from "../src/content/site";

try {
  const html = readFileSync(".next/server/app/index.html", "utf8");
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  // ponytail: React-generated tags use quoted, escaped attributes. Use an HTML
  // parser if this check ever needs to consume arbitrary external markup.
  const tags = Array.from(markup.matchAll(/<([a-z][a-z0-9-]*)\b([^>]*)>/gi), (match) => ({
    name: match[1],
    attributes: Object.fromEntries(Array.from(match[2].matchAll(/([^\s=]+)="([^"]*)"/g), (attribute) => [attribute[1], attribute[2]])),
  }));
  const meta = (key: string) => tags.find((tag) => tag.name === "meta" && (tag.attributes.name === key || tag.attributes.property === key))?.attributes.content;
  const canonical = tags.find((tag) => tag.name === "link" && tag.attributes.rel === "canonical")?.attributes.href;
  const robots = meta("robots");
  assert.ok(robots, "Missing robots metadata");
  const indexable = !robots.split(/,\s*/).includes("noindex");
  for (const key of ["description", "og:title", "og:description", "og:site_name"]) assert.ok(meta(key), `Missing ${key} metadata`);
  assert.equal(meta("og:type"), "website");
  assert.equal(meta("og:url"), canonical, "Open Graph URL and canonical must agree");
  assert.ok(tags.some((tag) => tag.name === "link" && tag.attributes.rel === "icon" && tag.attributes.href?.startsWith("/icon.svg")), "Missing favicon");
  assert.ok(readFileSync(".next/server/app/icon.svg.body", "utf8").includes("<svg"));

  const sitemap = readFileSync(".next/server/app/sitemap.xml.body", "utf8");
  const locations = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
  const robotsFile = readFileSync(".next/server/app/robots.txt.body", "utf8");
  assert.ok(robotsFile.includes("Allow: /"), "Crawlers need access to read noindex metadata");
  if (indexable) {
    assert.ok(canonical, "An indexable build needs a real canonical URL");
    assert.equal(new URL(canonical).protocol, "https:");
    assert.deepEqual(locations.map((url) => new URL(url).href), [new URL(canonical).href]);
    assert.ok(robotsFile.includes(`Sitemap: ${new URL("sitemap.xml", canonical).href}`));
  } else {
    assert.deepEqual(locations, [], "Non-indexable builds must not advertise sitemap entries");
    assert.ok(!robotsFile.includes("Sitemap:"));
  }
  const expectation = process.argv[2];
  assert.ok(!expectation || expectation === "--indexable" || expectation === "--noindex", "Use --indexable or --noindex, or omit the argument");
  if (expectation) assert.equal(indexable, expectation === "--indexable", "Unexpected build indexing policy");

  const manifest = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
  for (const route of ["/", "/robots.txt", "/sitemap.xml"]) assert.ok(manifest.routes[route], `${route} must be prerendered`);
  const ids = tags.flatMap((tag) => tag.attributes.id ? [tag.attributes.id] : []);
  assert.equal(ids.length, new Set(ids).size, "Duplicate HTML IDs");
  assert.equal(tags.filter((tag) => tag.name === "main").length, 1, "Expected one main landmark");
  assert.equal(tags.filter((tag) => tag.name === "h1").length, 1, "Use ## or lower headings in the README");
  for (const id of Object.keys(site.sections)) assert.ok(ids.includes(id), `Missing primary section ${id}`);
  for (const tag of tags.filter((tag) => tag.name === "a")) {
    const href = tag.attributes.href;
    assert.ok(href, "Empty anchor destination");
    if (href.startsWith("#")) assert.ok(ids.includes(href.slice(1)), `Missing anchor target ${href}`);
    else if (href.startsWith("/")) {
      const destination = new URL(href, "https://build.invalid");
      assert.equal(destination.origin, "https://build.invalid", "Use explicit HTTP(S) URLs for external links");
      const filename = path.resolve("public", `.${decodeURIComponent(destination.pathname)}`);
      const isPublicFile = filename.startsWith(`${path.resolve("public")}${path.sep}`) && existsSync(filename) && statSync(filename).isFile();
      assert.ok(destination.pathname === "/" || manifest.routes[destination.pathname] || isPublicFile, `Missing local destination ${href}`);
      if (destination.pathname === "/" && destination.hash) assert.ok(ids.includes(decodeURIComponent(destination.hash.slice(1))), `Missing anchor target ${href}`);
    } else assert.ok(["https:", "http:", "mailto:"].includes(new URL(href).protocol), `Unsupported link ${href}`);
  }

  const references = readFileSync(".next/server/app/page_client-reference-manifest.js", "utf8");
  const localClients = new Set(Array.from(references.matchAll(/"([^"]*\/src\/[^\"]+\.tsx?)"/g), (match) => match[1].slice(match[1].lastIndexOf("/src/") + 1)));
  assert.ok(localClients.has("src/components/section-navigation.tsx"), "Missing navigation client reference");
  for (const file of localClients) assert.ok(["src/components/section-navigation.tsx", "src/lib/navigation/use-scrollspy.ts"].includes(file), `Unexpected client entry: ${file}`);
  console.log(`Build verified: prerendered content, valid metadata/links/favicon, ${indexable ? "indexable production" : "noindex"} policy, and isolated navigation client entry.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
