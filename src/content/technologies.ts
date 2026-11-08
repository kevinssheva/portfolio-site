import type { z } from "zod";
import type { technologySchema } from "../lib/content/schemas";

export const technologies = [
  { id: "go", label: "Go" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "redis", label: "Redis" },
  { id: "kafka", label: "Kafka" },
  { id: "kubernetes", label: "Kubernetes" },
  { id: "istio", label: "Istio" },
] satisfies z.input<typeof technologySchema>[];
