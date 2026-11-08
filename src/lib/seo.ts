import type { Metadata, MetadataRoute } from "next";
import type { Profile } from "./content/schemas";

type SeoEnvironment = { SITE_URL?: string; VERCEL_ENV?: string };
type SeoConfig = { siteUrl: URL | undefined; indexable: boolean };

export function getSeoConfig(environment: SeoEnvironment = {
  SITE_URL: process.env.SITE_URL,
  VERCEL_ENV: process.env.VERCEL_ENV,
}): SeoConfig {
  const value = environment.SITE_URL?.trim();
  if (!value) return { siteUrl: undefined, indexable: false };
  const message = "SITE_URL must be an absolute HTTPS origin with no path, credentials, query, or fragment";
  let siteUrl: URL;
  try {
    siteUrl = new URL(value);
  } catch {
    throw new Error(message);
  }
  if (siteUrl.protocol !== "https:" || siteUrl.href !== `${siteUrl.origin}/`) {
    throw new Error(message);
  }
  return { siteUrl, indexable: environment.VERCEL_ENV === "production" };
}

export function createMetadata(profile: Pick<Profile, "name" | "bio">, role: string, config: SeoConfig): Metadata {
  const title = `${profile.name} | ${role}`;
  return {
    title,
    description: profile.bio,
    ...(config.siteUrl ? { metadataBase: config.siteUrl, alternates: { canonical: config.siteUrl.href } } : {}),
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: profile.name,
      title,
      description: profile.bio,
      ...(config.siteUrl ? { url: config.siteUrl.href } : {}),
    },
    robots: { index: config.indexable, follow: config.indexable },
  };
}

export function createRobots(config: SeoConfig): MetadataRoute.Robots {
  // Crawlers must be able to read the page's noindex metadata on previews.
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(config.indexable && config.siteUrl ? { sitemap: new URL("sitemap.xml", config.siteUrl).href } : {}),
  };
}

export function createSitemap(config: SeoConfig): MetadataRoute.Sitemap {
  return config.indexable && config.siteUrl ? [{ url: config.siteUrl.href }] : [];
}
