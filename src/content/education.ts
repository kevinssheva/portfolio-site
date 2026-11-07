import type { z } from "zod";
import type { educationSchema } from "../lib/content/schemas";

export const education = [
  {
    id: "itb",
    institution: "Bandung Institute of Technology (ITB)",
    degree: "Bachelor of Computer Science",
    graduated: "2025-10",
    gpa: { value: 3.75, maximum: 4 },
    order: 10,
    status: "published",
  },
] satisfies z.input<typeof educationSchema>[];
