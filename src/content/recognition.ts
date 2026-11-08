import type { z } from "zod";
import type { recognitionSchema } from "../lib/content/schemas";

export const recognition = [
  {
    id: "most-futuristic-project",
    title: "Most Futuristic Project Award",
    issuer: "Gojek Internal Hackathon",
    date: "2025-11",
    description:
      "Recognized as one of three recipients of the Most Futuristic Project award among ten finalists. Built a conversational GoFood recommendation chatbot that suggests food and drinks based on contextual natural-language requests.",
    order: 10,
    status: "published",
  },
] satisfies z.input<typeof recognitionSchema>[];
