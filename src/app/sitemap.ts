import { createSitemap, getSeoConfig } from "@/lib/seo";

export default function sitemap() {
  return createSitemap(getSeoConfig());
}
