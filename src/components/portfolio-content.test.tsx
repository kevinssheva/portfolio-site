import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { profileSchema, projectSchema } from "../lib/content/schemas";
import { ProjectCard, ProjectsSection } from "./project-card";
import { ContactSection } from "./contact-section";
import { loadProjects } from "../lib/content/load";

test("adding a project file produces a rendered card without changing layout code", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "portfolio-render-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(path.join(directory, "new-project.md"), `---
slug: new-project
title: Newly added test project
summary: A summary supplied through a new content file.
technologyIds: [go]
order: 10
status: published
---
`);
  const projects = await loadProjects(directory, ["go"]);
  const html = renderToStaticMarkup(<ProjectsSection projects={projects} technologies={[{ id: "go", label: "Go" }]} />);
  assert.ok(html.includes("Newly added test project"));
  assert.ok(html.includes("A summary supplied through a new content file."));
  assert.ok(html.includes('id="project-new-project"'));
  assert.ok(html.includes(">Go</li>"));
});

test("project cards omit absent metadata and expose only configured destination links", () => {
  const project = {
    ...projectSchema.parse({ slug: "example", title: "Example project", summary: "Verified project summary.", order: 10, status: "published" }),
    body: "",
  };
  const minimal = renderToStaticMarkup(<ProjectCard project={project} technologies={[]} />);
  assert.ok(minimal.includes("Verified project summary."));
  assert.doesNotMatch(minimal, /<a[\s>]|<ul[\s>]|undefined/);

  const configured = renderToStaticMarkup(<ProjectCard project={{
    ...project,
    repositoryUrl: "https://example.com/source",
    demoUrl: "https://example.com/demo",
    detailUrl: "https://example.com/details",
  }} technologies={[{ id: "go", label: "Go" }]} />);
  for (const url of ["https://example.com/source", "https://example.com/demo", "https://example.com/details"]) {
    assert.ok(configured.includes(`href="${url}"`));
  }
  assert.ok(configured.includes(">Go</li>"));
});

test("contact omits unavailable destinations and supports shared socials plus resume downloads", () => {
  const profile = profileSchema.parse({ name: "Example Engineer", bio: "Backend engineer.", location: "Jakarta", currentExperienceId: "example" });
  assert.equal(renderToStaticMarkup(<ContactSection profile={profile} />), "");

  const minimal = renderToStaticMarkup(<ContactSection profile={{ ...profile, links: { github: "https://github.com/example" } }} />);
  assert.ok(minimal.includes('href="https://github.com/example"'));
  assert.doesNotMatch(minimal, /mailto:|linkedin\.com|\.pdf|undefined/);

  const configured = renderToStaticMarkup(<ContactSection profile={{ ...profile,
    links: { github: "https://github.com/example", linkedin: "https://www.linkedin.com/in/example", email: "engineer@example.com" },
    resume: "/resume.pdf",
  }} />);
  assert.ok(configured.includes('href="mailto:engineer@example.com"'));
  assert.ok(configured.includes('href="https://www.linkedin.com/in/example"'));
  assert.match(configured, /href="\/resume\.pdf"[^>]*download=""/);
});
