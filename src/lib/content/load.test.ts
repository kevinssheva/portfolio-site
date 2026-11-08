import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test, type TestContext } from "node:test";
import {
  loadPortfolio,
  loadProjects,
  validateStructuredContent,
} from "./load";

function data() {
  return {
    profile: {
      name: "Example Engineer",
      currentExperienceId: "current",
      bio: "Builds backend systems.",
      location: "Jakarta",
      technologyIds: ["go"],
      links: {},
    },
    technologies: [{ id: "go", label: "Go" }],
    experience: [{
      id: "current", company: "Example", role: "Engineer", start: "2025-04",
      order: 0, status: "published",
      groups: [{
        id: "platform", title: "Platform", category: "infrastructure",
        order: 0, status: "published",
        contributions: [{
          id: "migration", title: "Migration", order: 0, status: "published",
          metrics: [{ id: "scale", text: "Provisional metric", order: 0, status: "draft" }],
        }],
      }],
    }],
    education: [],
    recognition: [],
  };
}

async function directory(t: TestContext) {
  const root = await mkdtemp(path.join(tmpdir(), "portfolio-content-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

function project(slug: string, extra = "", body = "A longer description.") {
  return `---\nslug: ${slug}\ntitle: Example project\nsummary: A concise summary.\norder: 10\nstatus: published\ntechnologyIds: [go]\n${extra}---\n${body}\n`;
}

test("a new Markdown file appears automatically and missing optional links remain absent", async (t) => {
  const root = await directory(t);
  assert.deepEqual(await loadProjects(root, ["go"]), []);
  await writeFile(path.join(root, "example.md"), project("example"));
  const projects = await loadProjects(root, ["go"]);
  assert.deepEqual(projects.map((item) => item.slug), ["example"]);
  assert.equal(projects[0].repositoryUrl, undefined);
  assert.equal(projects[0].demoUrl, undefined);
  assert.equal(projects[0].featured, false);
  assert.equal(projects[0].body, "A longer description.");
});

test("projects sort by explicit order, then slug, without featured overriding that order", async (t) => {
  const root = await directory(t);
  await writeFile(path.join(root, "z.md"), project("z", "featured: true\n"));
  await writeFile(path.join(root, "a.md"), project("a"));
  await writeFile(path.join(root, "first.md"), project("first").replace("order: 10", "order: 0"));
  assert.deepEqual((await loadProjects(root, ["go"])).map((item) => item.slug), ["first", "a", "z"]);
});

test("public output excludes drafts and hidden projects; local preview includes only drafts", async (t) => {
  const root = await directory(t);
  await writeFile(path.join(root, "public.md"), project("public"));
  await writeFile(path.join(root, "draft.md"), project("draft").replace("status: published", "status: draft"));
  await writeFile(path.join(root, "hidden.md"), project("hidden").replace("status: published", "status: hidden"));
  await writeFile(path.join(root, "unspecified.md"), project("unspecified").replace("status: published\n", ""));
  assert.deepEqual((await loadProjects(root, ["go"])).map((item) => item.slug), ["public"]);
  assert.deepEqual((await loadProjects(root, ["go"], true)).map((item) => item.slug), ["draft", "public", "unspecified"]);
});

test("project validation reports its filename and field, including for malformed drafts", async (t) => {
  const root = await directory(t);
  await writeFile(path.join(root, "broken.md"), project("broken").replace("title: Example project", "title: ''").replace("status: published", "status: draft"));
  await assert.rejects(loadProjects(root, ["go"]), /broken\.md.*title/);
});

test("project metadata rejects invalid links, status, order, slug, and unknown technology IDs", async (t) => {
  const root = await directory(t);
  for (const [oldValue, newValue, field] of [
    ["summary: A concise summary.", "summary: A concise summary.\nrepositoryUrl: javascript:alert(1)", "repositoryUrl"],
    ["status: published", "status: public", "status"],
    ["order: 10", "order: 0.5", "order"],
    ["slug: example", "slug: Bad Slug", "slug"],
    ["technologyIds: [go]", "technologyIds: [unknown]", "technologyIds"],
  ]) {
    await writeFile(path.join(root, "example.md"), project("example").replace(oldValue, newValue));
    await assert.rejects(loadProjects(root, ["go"]), new RegExp(`example\\.md.*${field}`, "s"));
  }
});

test("duplicate slugs fail rather than silently overwrite projects", async (t) => {
  const root = await directory(t);
  await writeFile(path.join(root, "one.md"), project("same"));
  await writeFile(path.join(root, "two.md"), project("same"));
  await assert.rejects(loadProjects(root, ["go"]), /two\.md.*duplicate slug.*same/i);
});

test("frontmatter accepts CRLF and Markdown separators but rejects missing fences and duplicate YAML keys", async (t) => {
  const root = await directory(t);
  await writeFile(path.join(root, "example.md"), project("example", "", "Before\n\n---\n\nAfter").replaceAll("\n", "\r\n"));
  assert.equal((await loadProjects(root, ["go"]))[0].body, "Before\n\n---\n\nAfter");
  for (const invalid of ["No frontmatter", "---\ntitle: Unclosed", project("example", "title: Duplicate\n")]) {
    await writeFile(path.join(root, "example.md"), invalid);
    await assert.rejects(loadProjects(root, ["go"]), /example\.md/);
  }
});

test("structured content defaults optional fields and keeps metrics private", () => {
  const content = validateStructuredContent(data(), "public");
  assert.equal(content.currentExperience.role, "Engineer");
  assert.equal(content.currentExperience.end, null);
  assert.equal(content.profile.resume, undefined);
  assert.deepEqual(content.experience[0].groups[0].contributions[0].metrics, []);
  const preview = validateStructuredContent(data(), "public", true);
  assert.equal(preview.experience[0].groups[0].contributions[0].metrics[0].text, "Provisional metric");
});

test("publication filtering applies to employers, groups, contributions and metrics", () => {
  const input = data();
  input.experience.push({ ...input.experience[0], id: "hidden-employer", status: "hidden" });
  input.experience[0].groups.push({ ...input.experience[0].groups[0], id: "draft-group", status: "draft" });
  input.experience[0].groups[0].contributions.push({ ...input.experience[0].groups[0].contributions[0], id: "hidden-contribution", status: "hidden" });
  const content = validateStructuredContent(input, "public");
  assert.equal(content.experience.length, 1);
  assert.equal(content.experience[0].groups.length, 1);
  assert.equal(content.experience[0].groups[0].contributions.length, 1);
  assert.equal(content.currentExperience.groups[0].contributions[0].metrics.length, 0);
});

test("dates must be valid calendar months and employment cannot end before it starts", () => {
  for (const [start, end] of [["2025-13", null], ["2025-4", null], ["2025-04", "2024-12"]]) {
    const input = data();
    Object.assign(input.experience[0], { start, end });
    assert.throws(() => validateStructuredContent(input, "public"), /experience\.ts.*(start|end)/);
  }
});

test("duplicate IDs, invalid categories and broken current-role references fail clearly", () => {
  const duplicate = data();
  duplicate.experience[0].groups.push(duplicate.experience[0].groups[0]);
  assert.throws(() => validateStructuredContent(duplicate, "public"), /experience\.ts.*duplicate id.*platform/i);
  const invalidCategory = data();
  invalidCategory.experience[0].groups[0].category = "unsupported";
  assert.throws(() => validateStructuredContent(invalidCategory, "public"), /experience\.ts.*category/);
  const missingRole = data();
  missingRole.profile.currentExperienceId = "missing";
  assert.throws(() => validateStructuredContent(missingRole, "public"), /profile\.ts.*currentExperienceId/);
  const draftRole = data();
  draftRole.experience[0].status = "draft";
  assert.throws(() => validateStructuredContent(draftRole, "public"), /profile\.ts.*currentExperienceId/);
});

test("profile links and technology references are validated", () => {
  const invalidLink = data();
  Object.assign(invalidLink.profile.links, { github: "not-a-url" });
  assert.throws(() => validateStructuredContent(invalidLink, "public"), /profile\.ts.*github/);
  const invalidTag = data();
  invalidTag.profile.technologyIds = ["unknown"];
  assert.throws(() => validateStructuredContent(invalidTag, "public"), /profile\.ts.*technologyIds/);
});

test("configured local assets must exist inside public and be files", async (t) => {
  const root = await directory(t);
  const input = { ...data(), profile: { ...data().profile, resume: "/resume.pdf" } };
  assert.throws(() => validateStructuredContent(input, root), /profile\.ts.*resume.*missing/i);
  await writeFile(path.join(root, "resume.pdf"), "test asset");
  assert.equal(validateStructuredContent(input, root).profile.resume, "/resume.pdf");
  for (const resume of ["/../outside.pdf", "//outside.pdf", "/folder/../outside.pdf"]) {
    assert.throws(() => validateStructuredContent({ ...input, profile: { ...input.profile, resume } }, root), /profile\.ts.*resume/);
  }
  await mkdir(path.join(root, "folder"));
  assert.throws(() => validateStructuredContent({ ...input, profile: { ...input.profile, resume: "/folder" } }, root), /profile\.ts.*resume.*file/i);
});

test("draft preview is refused in a production process", async (t) => {
  const root = await directory(t);
  const result = spawnSync(process.execPath, ["--import", "tsx", "-e", `
    const assert = require("node:assert/strict");
    const { loadProjects, validateStructuredContent } = require("./src/lib/content/load.ts");
    async function check() {
      await assert.rejects(loadProjects(process.argv[1], [], true), /draft.*production/i);
      assert.throws(() => validateStructuredContent({}, process.argv[1], true), /draft.*production/i);
    }
    check().catch(error => { console.error(error); process.exitCode = 1; });
  `, root], { env: { ...process.env, NODE_ENV: "production" }, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
});

test("the supplied portfolio loads with only publishable project and metric content", async () => {
  const content = await loadPortfolio();
  assert.ok(content.overview.trim());
  assert.equal(content.currentExperience.id, content.profile.currentExperienceId);
  const entries = [
    ...content.projects, ...content.recognition, ...content.education,
    ...content.experience.flatMap((employer) => [employer, ...employer.groups.flatMap((group) => [
      group, ...group.contributions.flatMap((contribution) => [contribution, ...contribution.metrics]),
    ])]),
  ];
  assert.ok(entries.every((entry) => entry.status === "published"));
});
