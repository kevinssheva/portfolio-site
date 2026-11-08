import { z } from "zod";

const text = z.string().trim().min(1);
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens");
const month = z.string().regex(/^[1-9]\d{3}-(0[1-9]|1[0-2])$/, "Use a calendar month in YYYY-MM format");
const status = z.enum(["draft", "published", "hidden"]).default("draft");
const order = z.number().int().nonnegative();
const url = z.string().url().refine((value) => /^https?:\/\//.test(value), "Use an HTTP(S) URL");
const assetPath = z.string().regex(/^\/(?!\/)[A-Za-z0-9/_.-]+$/).refine(
  (value) => !value.split("/").some((part) => part === "." || part === ".."),
  "Use a path within public without . or .. segments",
);

export const technologySchema = z.strictObject({ id, label: text });

export const profileSchema = z.strictObject({
  name: text,
  currentExperienceId: id,
  bio: text,
  location: text,
  technologyIds: z.array(id).default([]),
  avatar: z.strictObject({ src: assetPath, alt: text }).optional(),
  resume: assetPath.optional(),
  links: z.strictObject({
    github: url.optional(),
    linkedin: url.optional(),
    email: z.string().email().optional(),
  }).default({}),
});

export const metricSchema = z.strictObject({ id, text, order, status });

export const contributionSchema = z.strictObject({
  id,
  title: text,
  description: text.optional(),
  featured: z.boolean().default(false),
  order,
  status,
  metrics: z.array(metricSchema).default([]),
});

export const contributionGroupSchema = z.strictObject({
  id,
  title: text,
  category: z.enum(["infrastructure", "observability", "performance", "product", "frontend"]),
  order,
  status,
  contributions: z.array(contributionSchema),
});

export const experienceSchema = z.strictObject({
  id,
  company: text,
  role: text,
  employmentType: text.optional(),
  location: text.optional(),
  start: month,
  end: month.nullable().default(null),
  order,
  status,
  groups: z.array(contributionGroupSchema),
}).refine((entry) => entry.end === null || entry.end >= entry.start, {
  message: "Employment must end on or after its start month",
  path: ["end"],
});

export const educationSchema = z.strictObject({
  id,
  institution: text,
  degree: text,
  graduated: month,
  gpa: z.strictObject({ value: z.number().nonnegative(), maximum: z.number().positive() })
    .refine((gpa) => gpa.value <= gpa.maximum, "GPA cannot exceed its maximum").optional(),
  order,
  status,
});

export const recognitionSchema = z.strictObject({
  id,
  title: text,
  issuer: text,
  date: month,
  description: text,
  order,
  status,
});

export const projectSchema = z.strictObject({
  slug: id,
  title: text,
  summary: text,
  technologyIds: z.array(id).default([]),
  repositoryUrl: url.optional(),
  demoUrl: url.optional(),
  detailUrl: url.optional(),
  featured: z.boolean().default(false),
  order,
  status,
});

export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type ContributionGroup = z.infer<typeof contributionGroupSchema>;
export type Contribution = z.infer<typeof contributionSchema>;
export type Project = z.infer<typeof projectSchema> & { body: string };
export type Recognition = z.infer<typeof recognitionSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Technology = z.infer<typeof technologySchema>;
export type PublicationStatus = z.infer<typeof status>;
