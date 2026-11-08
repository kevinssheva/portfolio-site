import type { z } from "zod";
import type { profileSchema } from "../lib/content/schemas";

export const profile = {
  name: "Kevin Sebastian",
  currentExperienceId: "gojek",
  bio: "Software Engineer at Gojek. Curious about how things work under the hood.",
  location: "Jakarta, Indonesia",
  technologyIds: ["go", "postgresql", "redis", "kafka", "kubernetes", "istio"],
  avatar: {
    src: "/images/avatar.png",
    alt: "Kevin Sebastian",
  },
  resume: "/resume.pdf",
  links: {
    email: "kevinssheva@gmail.com",
    github: "https://github.com/kevinssheva",
    linkedin: "https://www.linkedin.com/in/kevinsebastianst",
  },
} satisfies z.input<typeof profileSchema>;
