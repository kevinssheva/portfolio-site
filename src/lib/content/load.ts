import { existsSync, realpathSync, statSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { profile } from "../../content/profile";
import { experience } from "../../content/experience";
import { education } from "../../content/education";
import { recognition } from "../../content/recognition";
import { technologies } from "../../content/technologies";
import {
  educationSchema, experienceSchema, profileSchema, projectSchema,
  recognitionSchema, technologySchema,
  type Project, type PublicationStatus,
} from "./schemas";

type StructuredInput = {
  profile: unknown;
  experience: unknown;
  education: unknown;
  recognition: unknown;
  technologies: unknown;
};

function parseContent<T extends z.ZodType>(schema: T, input: unknown, source: string): z.output<T> {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(result.error.issues.map((issue) =>
      `${source}:${issue.path.join(".") || "(root)"}: ${issue.message}`,
    ).join("\n"));
  }
  return result.data;
}

function checkPreview(includeDrafts: boolean) {
  if (includeDrafts && process.env.NODE_ENV === "production") {
    throw new Error("Draft preview is unavailable in production");
  }
}

function visible<T extends { status: PublicationStatus; order: number }>(
  entries: T[], includeDrafts: boolean, key: (entry: T) => string,
): T[] {
  return entries.filter((entry) => entry.status === "published" || (includeDrafts && entry.status === "draft"))
    .sort((a, b) => a.order - b.order || (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0));
}

function uniqueIds(entries: { id: string }[], source: string) {
  const seen = new Set<string>();
  entries.forEach((entry, index) => {
    if (seen.has(entry.id)) throw new Error(`${source}:${index}.id: Duplicate id "${entry.id}"`);
    seen.add(entry.id);
  });
}

function checkTechnologyIds(ids: string[], known: Set<string>, source: string) {
  const seen = new Set<string>();
  ids.forEach((id, index) => {
    if (!known.has(id)) throw new Error(`${source}:technologyIds.${index}: Unknown technology "${id}"`);
    if (seen.has(id)) throw new Error(`${source}:technologyIds.${index}: Duplicate technology "${id}"`);
    seen.add(id);
  });
}

function checkAsset(asset: string | undefined, publicDirectory: string, field: string) {
  if (asset === undefined) return;
  const filename = path.join(publicDirectory, asset.slice(1));
  if (!existsSync(filename)) throw new Error(`src/content/profile.ts:${field}: Missing asset ${asset}`);
  if (!statSync(filename).isFile()) throw new Error(`src/content/profile.ts:${field}: Asset must be a file: ${asset}`);
  const relative = path.relative(realpathSync(publicDirectory), realpathSync(filename));
  if (relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`src/content/profile.ts:${field}: Asset must stay inside public: ${asset}`);
  }
}

export function validateStructuredContent(input: StructuredInput, publicDirectory: string, includeDrafts = false) {
  checkPreview(includeDrafts);
  const parsed = {
    profile: parseContent(profileSchema, input.profile, "src/content/profile.ts"),
    experience: parseContent(z.array(experienceSchema), input.experience, "src/content/experience.ts"),
    education: parseContent(z.array(educationSchema), input.education, "src/content/education.ts"),
    recognition: parseContent(z.array(recognitionSchema), input.recognition, "src/content/recognition.ts"),
    technologies: parseContent(z.array(technologySchema), input.technologies, "src/content/technologies.ts"),
  };
  uniqueIds(parsed.experience, "src/content/experience.ts");
  uniqueIds(parsed.education, "src/content/education.ts");
  uniqueIds(parsed.recognition, "src/content/recognition.ts");
  uniqueIds(parsed.technologies, "src/content/technologies.ts");
  checkTechnologyIds(parsed.profile.technologyIds, new Set(parsed.technologies.map((item) => item.id)), "src/content/profile.ts");
  checkAsset(parsed.profile.avatar?.src, publicDirectory, "avatar.src");
  checkAsset(parsed.profile.resume, publicDirectory, "resume");

  parsed.experience.forEach((employer, employerIndex) => {
    const source = `src/content/experience.ts:${employerIndex}.groups`;
    uniqueIds(employer.groups, source);
    employer.groups.forEach((group, groupIndex) => {
      uniqueIds(group.contributions, `${source}.${groupIndex}.contributions`);
      group.contributions.forEach((contribution, index) => {
        uniqueIds(contribution.metrics, `${source}.${groupIndex}.contributions.${index}.metrics`);
      });
    });
  });

  const publishedExperience = visible(parsed.experience, includeDrafts, (entry) => entry.id).map((employer) => ({
    ...employer,
    groups: visible(employer.groups, includeDrafts, (entry) => entry.id).map((group) => ({
      ...group,
      contributions: visible(group.contributions, includeDrafts, (entry) => entry.id).map((contribution) => ({
        ...contribution,
        metrics: visible(contribution.metrics, includeDrafts, (entry) => entry.id),
      })),
    })),
  }));
  const currentExperience = publishedExperience.find((entry) => entry.id === parsed.profile.currentExperienceId);
  if (!currentExperience || currentExperience.status !== "published" || currentExperience.end !== null) {
    throw new Error("src/content/profile.ts:currentExperienceId: Must reference a published, ongoing experience entry");
  }
  return {
    ...parsed,
    experience: publishedExperience,
    education: visible(parsed.education, includeDrafts, (entry) => entry.id),
    recognition: visible(parsed.recognition, includeDrafts, (entry) => entry.id),
    currentExperience,
  };
}

function splitFrontmatter(input: string, source: string) {
  const lines = input.replace(/^\uFEFF/, "").replaceAll("\r\n", "\n").split("\n");
  const end = lines.indexOf("---", 1);
  if (lines[0] !== "---" || end === -1) {
    throw new Error(`${source}: Expected YAML metadata enclosed by --- lines at the start of the file`);
  }
  try {
    const metadata: unknown = parseYaml(lines.slice(1, end).join("\n"));
    return { metadata, body: lines.slice(end + 1).join("\n").trim() };
  } catch (error) {
    throw new Error(`${source}: Invalid YAML frontmatter: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
  }
}

export async function loadProjects(directory: string, technologyIds: string[], includeDrafts = false): Promise<Project[]> {
  checkPreview(includeDrafts);
  const projects: Project[] = [];
  const seen = new Set<string>();
  const known = new Set(technologyIds);
  const entries = (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const source = path.join(directory, entry.name);
    const { metadata, body } = splitFrontmatter(await readFile(source, "utf8"), source);
    const project = parseContent(projectSchema, metadata, source);
    if (seen.has(project.slug)) throw new Error(`${source}: Duplicate slug "${project.slug}"`);
    seen.add(project.slug);
    checkTechnologyIds(project.technologyIds, known, source);
    projects.push({ ...project, body });
  }
  return visible(projects, includeDrafts, (entry) => entry.slug);
}

export async function loadPortfolio({ root = process.cwd(), includeDrafts = false } = {}) {
  const data = validateStructuredContent({ profile, experience, education, recognition, technologies }, path.join(root, "public"), includeDrafts);
  const overviewPath = path.join(root, "src/content/overview.md");
  const [overview, projects] = await Promise.all([
    readFile(overviewPath, "utf8"),
    loadProjects(path.join(root, "src/content/projects"), data.technologies.map((item) => item.id), includeDrafts),
  ]);
  if (!overview.trim()) throw new Error(`${overviewPath}: Overview must not be empty`);
  return { ...data, overview: overview.trim(), projects };
}

export type Portfolio = Awaited<ReturnType<typeof loadPortfolio>>;
