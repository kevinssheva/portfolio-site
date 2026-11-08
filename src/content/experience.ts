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
            description:
              "Migrated backend services from VMs to Kubernetes, including deployment setup, resource configuration, and monitoring.",
            featured: true,
            order: 10,
            status: "published",
          },
          {
            id: "payment-infrastructure",
            title: "Payment Infrastructure",
            description:
              "Worked on payment gateway infrastructure and the gradual migration of production traffic.",
            featured: true,
            order: 20,
            status: "published",
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
            title: "Distributed Tracing",
            description:
              "Developed reusable OpenTelemetry instrumentation in Go to support distributed tracing across backend services.",
            featured: true,
            order: 10,
            status: "published",
          },
          {
            id: "monitoring",
            title: "Monitoring & Troubleshooting",
            description:
              "Worked on service monitoring, alerting, and investigating production issues.",
            order: 20,
            status: "published",
          },
          {
            id: "client-improvements",
            title: "Backend Client Improvements",
            description:
              "Improved consistency and maintainability across backend service clients.",
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
            id: "performance-optimization",
            title: "Performance Optimization",
            description:
              "Improved backend performance through caching and other service-level optimizations.",
            order: 10,
            status: "published",
          },
          {
            id: "internal-tooling",
            title: "Internal Tooling & Automation",
            description:
              "Contributed to internal tools and workflow automation.",
            order: 20,
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
          {
            id: "backend-product-development",
            title: "Backend Product Development",
            description:
              "Developed and maintained backend features supporting Gojek's transport products.",
            order: 10,
            status: "published",
          },
          {
            id: "transport-workflows",
            title: "Transport Workflows",
            description:
              "Contributed to improvements across booking, serviceability, and payment-related workflows.",
            order: 20,
            status: "published",
          },
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
          {
            id: "investment-features",
            title: "Investment Features",
            description:
              "Developed investment goal management and customizable watchlist features.",
            order: 10,
            status: "published",
          },
          {
            id: "identity-verification",
            title: "Identity Verification",
            description:
              "Implemented face liveness verification for the investment platform.",
            order: 20,
            status: "published",
          },
          {
            id: "seo",
            title: "SEO Improvements",
            description:
              "Improved website search visibility and SEO performance.",
            order: 30,
            status: "published",
          },
        ],
      },
    ],
  },
] satisfies z.input<typeof experienceSchema>[];
