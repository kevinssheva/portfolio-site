import type { z } from "zod";
import type { experienceSchema } from "../lib/content/schemas";

export const experience = [
  {
    id: "gojek",
    company: "GoTo Group (Gojek)",
    role: "Software Engineer II",
    location: "Jakarta, Indonesia",
    start: "2025-04",
    end: null,
    order: 10,
    status: "published",
    groups: [
      {
        id: "infrastructure",
        title: "Infrastructure & Platform Engineering",
        category: "infrastructure",
        order: 10,
        status: "published",
        contributions: [
          {
            id: "kubernetes-migration",
            title: "Kubernetes Migration",
            description: "Migrated backend services from VMs to Kubernetes, including deployment pipelines, resource configuration, and monitoring.",
            featured: true,
            order: 10,
            status: "published",
            metrics: [
              { id: "service-scale", text: "9 microservices supporting 2M+ daily transactions.", order: 10, status: "draft" },
              { id: "infrastructure-cost", text: "58% infrastructure cost reduction for migrated services.", order: 20, status: "draft" },
            ],
          },
          {
            id: "transport-gopay-gateway",
            title: "Transport–GoPay Gateway",
            description: "Developed an HAProxy-based gateway on Kubernetes and progressively migrated production payment traffic.",
            featured: true,
            order: 20,
            status: "published",
            metrics: [
              { id: "payment-traffic", text: "50K+ payment requests per minute migrated without migration-related incidents.", order: 10, status: "draft" },
            ],
          },
        ],
      },
      {
        id: "observability",
        title: "Observability & Reliability",
        category: "observability",
        order: 20,
        status: "published",
        contributions: [
          {
            id: "distributed-tracing",
            title: "OpenTelemetry Distributed Tracing",
            description: "Built a reusable Go instrumentation library and instrumented backend services.",
            featured: true,
            order: 10,
            status: "published",
            metrics: [
              { id: "instrumented-services", text: "3 services directly instrumented with OpenTelemetry.", order: 10, status: "draft" },
            ],
          },
          {
            id: "client-standardization",
            title: "Client Standardization",
            description: "Standardized client implementations in FBON and TRAPS.",
            order: 20,
            status: "published",
          },
          {
            id: "production-monitoring",
            title: "Production Monitoring & Troubleshooting",
            description: "Worked with metrics, alerting, tracing, and production investigations.",
            order: 30,
            status: "published",
          },
        ],
      },
      {
        id: "performance",
        title: "Performance & Engineering Improvements",
        category: "performance",
        order: 30,
        status: "published",
        contributions: [
          {
            id: "tucs-lazy-caching",
            title: "TUCS Lazy Caching",
            description: "Optimized expression rule evaluation through caching compiled rules, thread-safe access, singleflight, and cache invalidation.",
            order: 10,
            status: "published",
          },
        ],
      },
      {
        id: "product",
        title: "Product Engineering",
        category: "product",
        order: 40,
        status: "published",
        contributions: [
          { id: "cancellation-fee", title: "Cancellation Fee", order: 10, status: "published" },
          { id: "ds-ratio", title: "DS Ratio Enablement", order: 20, status: "published" },
          { id: "tucs-multiple-s2id", title: "TUCS Multiple S2ID Support", order: 30, status: "published" },
          { id: "tucs-rule-scheduling", title: "TUCS Rule Scheduling", order: 40, status: "published" },
          { id: "kci-settlement", title: "KCI Settlement Single Source of Truth", order: 50, status: "published" },
          { id: "family-social-group", title: "Family Account & Social Group", order: 60, status: "published" },
          { id: "gtfs-automation", title: "GTFS Pipeline Automation", order: 70, status: "published" },
        ],
      },
    ],
  },
  {
    id: "makmur",
    company: "Makmur",
    role: "Frontend Engineer",
    employmentType: "Part-time",
    start: "2024-07",
    end: "2024-12",
    order: 20,
    status: "published",
    groups: [
      {
        id: "frontend",
        title: "Frontend Engineering",
        category: "frontend",
        order: 10,
        status: "published",
        contributions: [
          { id: "investment-goals", title: "Investment Goal Management", description: "Developed investment goal management features.", order: 10, status: "published" },
          { id: "face-liveness", title: "Face Liveness Verification", description: "Implemented face liveness verification.", order: 20, status: "published" },
          { id: "watchlists", title: "Investment Watchlists", description: "Developed customizable investment watchlists.", order: 30, status: "published" },
          { id: "seo", title: "SEO Improvements", description: "Improved website SEO performance.", order: 40, status: "published" },
        ],
      },
    ],
  },
] satisfies z.input<typeof experienceSchema>[];
