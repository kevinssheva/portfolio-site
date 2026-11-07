import type { z } from "zod";
import type { technologySchema } from "../lib/content/schemas";

export const technologies = [
  { id: "go", label: "Go" },
  { id: "typescript", label: "TypeScript" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "redis", label: "Redis" },
  { id: "kafka", label: "Kafka" },
  { id: "kubernetes", label: "Kubernetes" },
  { id: "docker", label: "Docker" },
  { id: "haproxy", label: "HAProxy" },
  { id: "istio", label: "Istio" },
  { id: "opentelemetry", label: "OpenTelemetry" },
  { id: "grafana", label: "Grafana" },
  { id: "argo-cd", label: "Argo CD" },
] satisfies z.input<typeof technologySchema>[];
