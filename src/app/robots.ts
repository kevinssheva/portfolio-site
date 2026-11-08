import { createRobots, getSeoConfig } from "@/lib/seo";

export default function robots() {
  return createRobots(getSeoConfig());
}
