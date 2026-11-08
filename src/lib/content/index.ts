import "server-only";
import { cache } from "react";
import { loadPortfolio } from "./load";

// React cache shares one validated snapshot between metadata and page rendering.
export const getPortfolio = cache(() => loadPortfolio({
  includeDrafts: process.env.NODE_ENV === "development" && process.env.CONTENT_PREVIEW_DRAFTS === "true",
}));

export type { Portfolio } from "./load";
export type { Profile, Experience, ContributionGroup, Contribution, Project, Recognition, Education, Technology } from "./schemas";
