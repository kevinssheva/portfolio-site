import assert from "node:assert/strict";
import { test } from "node:test";
import { createMetadata, createRobots, createSitemap, getSeoConfig } from "./seo";

const profile = { name: "Example Engineer", bio: "Works on backend systems." };

test("an unconfigured domain never invents a canonical URL or sitemap entry", () => {
  const config = getSeoConfig({});
  const metadata = createMetadata(profile, "Software Engineer", config);
  assert.equal(config.siteUrl, undefined);
  assert.equal(config.indexable, false);
  assert.equal(metadata.metadataBase, undefined);
  assert.equal(metadata.alternates, undefined);
  assert.deepEqual(metadata.robots, { index: false, follow: false });
  assert.deepEqual(createSitemap(config), []);
  assert.deepEqual(createRobots(config), { rules: { userAgent: "*", allow: "/" } });
});

test("Open Graph and page metadata derive their identity from editable content", () => {
  const metadata = createMetadata(profile, "Software Engineer II", getSeoConfig({}));
  assert.equal(metadata.title, "Example Engineer | Software Engineer II");
  assert.equal(metadata.description, "Works on backend systems.");
  assert.deepEqual(metadata.openGraph, {
    type: "website", locale: "en_US", siteName: "Example Engineer",
    title: "Example Engineer | Software Engineer II", description: "Works on backend systems.",
  });
});

test("configured Vercel production uses one canonical origin consistently", () => {
  const config = getSeoConfig({ SITE_URL: " https://example.com ", VERCEL_ENV: "production" });
  const metadata = createMetadata(profile, "Engineer", config);
  assert.equal(config.indexable, true);
  assert.equal(metadata.metadataBase?.toString(), "https://example.com/");
  assert.deepEqual(metadata.alternates, { canonical: "https://example.com/" });
  assert.deepEqual(metadata.robots, { index: true, follow: true });
  assert.deepEqual(createSitemap(config), [{ url: "https://example.com/" }]);
  assert.deepEqual(createRobots(config), {
    rules: { userAgent: "*", allow: "/" }, sitemap: "https://example.com/sitemap.xml",
  });
});

test("preview, development and unknown deployment environments stay non-indexable", () => {
  for (const environment of ["preview", "development", "", undefined]) {
    const config = getSeoConfig({ SITE_URL: "https://example.com", VERCEL_ENV: environment });
    assert.equal(config.indexable, false);
    assert.deepEqual(createMetadata(profile, "Engineer", config).robots, { index: false, follow: false });
    assert.deepEqual(createSitemap(config), []);
    assert.equal(createRobots(config).sitemap, undefined);
  }
  assert.equal(getSeoConfig({ VERCEL_ENV: "production" }).indexable, false);
});

test("invalid configured origins fail clearly rather than publish malformed SEO URLs", () => {
  for (const url of ["example.com", "http://example.com", "https://user:password@example.com", "https://example.com/path", "https://example.com/?query=true", "https://example.com/#section", "https://example.com/?", "https://example.com/#"]) {
    assert.throws(() => getSeoConfig({ SITE_URL: url }), /SITE_URL/);
  }
  assert.equal(getSeoConfig({ SITE_URL: "   " }).siteUrl, undefined);
});
