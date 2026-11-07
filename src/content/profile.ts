import type { z } from "zod";
import type { profileSchema } from "../lib/content/schemas";

export const profile = {
  name: "Kevin Sebastian",
  currentExperienceId: "gojek",
  bio: "Software engineer working on backend systems, infrastructure, and observability for Gojek's transport platform.",
  location: "Jakarta, Indonesia",
  technologyIds: [
    "go", "typescript", "postgresql", "redis", "kafka", "kubernetes",
    "docker", "haproxy", "istio", "opentelemetry", "grafana", "argo-cd",
  ],
  links: {
    github: "https://github.com/kevinssheva",
  },
} satisfies z.input<typeof profileSchema>;
