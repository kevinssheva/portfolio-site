# Editing portfolio content

Portfolio facts live in `src/content/`, separate from React components. Edit those files, run the checks, and commit the changes. The homepage renders the profile, README, technologies, grouped experience timeline, personal project cards, recognition, education, contact, and footer through the validated content loader.

## Where content lives

| Content | File |
| --- | --- |
| Name, bio, location, current employer reference, avatar, resume, social links, technology selection | `src/content/profile.ts` |
| Employers, contribution groups, contributions, provisional metrics | `src/content/experience.ts` |
| Reusable technology labels | `src/content/technologies.ts` |
| README introduction | `src/content/overview.md` |
| Personal projects | One `.md` file per project in `src/content/projects/` |
| Recognition and awards | `src/content/recognition.ts` |
| Education | `src/content/education.ts` |
| Shared interface copy | `src/content/site.ts` |
| Validation schemas and inferred types | `src/lib/content/schemas.ts` |
| Canonical production origin | `SITE_URL` in Vercel Production; see `DEPLOYMENT.md` |
| Favicon artwork | `src/app/icon.svg` |

TypeScript files use `satisfies` with their schema's input type. Your editor checks their structure; runtime validation checks constraints such as valid dates, references, URLs, and publication status. Unknown metadata fields are rejected to catch misspellings.

## Update profile information

Edit `profile.ts`. The name and bio supply metadata, while the current job title and company come from the experience entry referenced by `currentExperienceId`. To change jobs, add the new experience, end the old entry, and change this reference. It must point to a published employer with `end: null`.

The technology list uses IDs from `technologies.ts`. Add a technology there once, then reference its ID in the profile or a project's `technologyIds`. The profile's array order determines its skill display order. Renaming the label updates consumers without changing their IDs.

The only configured contact link initially is your supplied GitHub identity. Email, LinkedIn, avatar, and resume are omitted until real values are available.

## Update professional experience

Edit the `experience` array in `experience.ts`. Each employer has:

- A unique lowercase, hyphenated `id`.
- `company` and `role`; optional `employmentType` and `location`.
- `start` and `end` months as quoted `"YYYY-MM"` strings. Use `null` or omit `end` for an ongoing role. An end month cannot precede the start month.
- An explicit nonnegative integer `order`, a publication `status`, and `groups`.

Lower `order` values appear first. Equal orders use IDs alphabetically, independent of file position. Give entries values such as 10, 20, and 30 so you can insert another entry between them later.

To add an employer, copy an existing object, change its ID and facts, and add its groups. To remove an employer from public output while preserving it in source, set `status: "hidden"`.

## Add contribution groups

Add an object to the employer's `groups` array. For example:

```ts
{
  id: "observability",
  title: "Observability & Reliability",
  category: "observability",
  order: 20,
  status: "published",
  contributions: [],
}
```

Supported categories are `infrastructure`, `observability`, `performance`, `product`, and `frontend`. Groups are data-driven; adding one requires no rendering change. IDs must be unique within that employer.

## Add, modify, or remove contributions

Add an object to a group's `contributions` array:

```ts
{
  id: "distributed-tracing",
  title: "OpenTelemetry Distributed Tracing",
  description: "Built a reusable Go instrumentation library and instrumented backend services.",
  featured: true,
  order: 10,
  status: "published",
}
```

`description`, `featured`, and `metrics` are optional. `featured` defaults to false and controls emphasis without overriding display order. Featured contributions use a stronger heading and blue rule; supporting contributions stay compact. Groups with `category: "product"` use a compact list that can contain only the ID, title, order, and status. IDs must be unique within their group.

Delete a contribution object to remove it entirely, or use `hidden` to keep it in source without displaying it. Edit a title or description directly; no component change is needed.

Metrics belong to their contribution:

```ts
metrics: [
  {
    id: "instrumented-services",
    text: "3 services directly instrumented with OpenTelemetry.",
    order: 10,
    status: "draft",
  },
],
```

All four supplied provisional metrics initially use `draft`. Confirm a metric's accuracy and that it can be shared publicly before changing its status. Publication filtering applies to employers, groups, contributions, and metrics separately; a published parent does not publish its draft children.

## Add or remove personal projects

Create a new `.md` file directly inside `src/content/projects/`. No registry or component import is needed. File names are for organization; the unique `slug` is the project's identity. Use matching names for clarity.

```md
---
slug: new-project
title: New Project
summary: A concise description of the verified project.
technologyIds: [go]
featured: false
order: 30
status: draft
---

A longer Markdown description, if needed.
```

This is an editing template, not an additional published project. Replace it with your actual project information. Metadata must begin on the first line (a UTF-8 byte-order mark is also accepted) and be enclosed by `---` lines. Both Unix and Windows line endings work. Markdown separators in the body remain intact.

Supported optional metadata:

| Field | Behavior |
| --- | --- |
| `technologyIds` | Defaults to an empty array; IDs must exist in `technologies.ts` |
| `repositoryUrl` | Real HTTP(S) repository URL; omit until configured |
| `demoUrl` | Real HTTP(S) demo URL; omit until configured |
| `detailUrl` | Real HTTP(S) URL for an existing detail page; omit until configured |
| `featured` | Defaults to false; affects emphasis, not sorting |
| `status` | Defaults to `draft` if omitted |

`slug`, `title`, `summary`, and integer `order` are required. The Markdown body can be empty when the summary is sufficient. Do not add blank URL fields; omit the key instead. The UI must omit missing links.

Only `.md` files directly in this directory are loaded. No MDX or executable content is supported. Delete a file to remove a project, or change its publication status. Async Event Processor stays in draft until its details are verified. PalmVue contains only the supplied summary and Go tag, with no invented links.

The current loader uses the dependency-free `yaml` package to parse YAML metadata, with a small delimiter reader. It does not evaluate JavaScript or compile MDX. The README uses server-side `react-markdown` with GitHub-flavored Markdown support. Raw HTML is omitted. Use `##` for the introductory heading and `###` for subsections; the profile already supplies the page's main heading.

## Drafts, hidden entries, and ordering

| Status | Public output | Development draft preview |
| --- | --- | --- |
| `published` | Included | Included |
| `draft` or omitted | Excluded | Included |
| `hidden` | Excluded | Excluded |

All entries are validated, including drafts and hidden entries, so publishing them later does not reveal latent errors. Duplicate IDs/slugs, invalid fields, or unknown technologies fail validation. Hidden content stays hidden in preview too.

To preview drafts locally, copy `.env.example` to `.env.local`, set `CONTENT_PREVIEW_DRAFTS=true`, and restart `npm run dev`. This includes draft projects and metrics in local development rendering. Production always excludes drafts even if this variable is accidentally set there. `npm run content:validate` reports the public collection.

Draft filtering controls site output, not repository visibility. Source content is still visible to anyone who can read the repository. Keep confidential information out of committed files, including drafts.

## Add awards and education

Add an object to `recognition.ts` with `id`, `title`, `issuer`, `date`, `description`, `order`, and `status`. Dates use quoted `"YYYY-MM"`. Keep the hackathon entry described as the Most Futuristic Project award, not an overall win.

Education entries in `education.ts` use `id`, `institution`, `degree`, `graduated`, `order`, and `status`. `gpa` is optional and contains numeric `value` and `maximum` fields. A GPA cannot exceed its maximum. No coursework list is needed.

## Update resume, avatar, and social links

To add a resume, place the actual PDF at `public/resume.pdf`, then add `resume: "/resume.pdf"` to `profile.ts`. The `/` path refers to the `public` directory. To replace it, replace that file; keep the path if its filename is unchanged.

To add an avatar, place the image under `public/images/`, then add:

```ts
avatar: { src: "/images/avatar.jpg", alt: "Kevin Sebastian" },
```

Configured assets must be real files inside `public`, including when reached through symlinks. Missing files, traversal paths, and directories fail validation. Omitted asset fields are valid.

Edit the `links` object for GitHub and LinkedIn HTTP(S) URLs. The `email` field takes a plain email address, without `mailto:`. Profile and Contact share this single object and the same link renderer. Remove a field to remove its link. Contact includes the configured resume as a download; it disappears entirely if no contact destinations or resume are configured.

Without an avatar, the profile uses initials derived from the name. Missing resume and social fields produce no placeholder buttons. Section labels and shared interface copy can be edited in `site.ts`; section IDs are anchor contracts and should remain unchanged unless the corresponding rendering code is updated.

## Future engineering notes and project detail pages

The MVP does not publish article or project detail routes yet. Do not expect a new notes file or a project body to create a route automatically at this stage.

When notes are introduced, use a `src/content/notes/` Markdown collection, add a note schema and loader using the same validation/publication conventions, and generate routes from published slugs. That is a one-time feature implementation; subsequent notes should require only a new content file. Keep long-form prose in Markdown and metadata in frontmatter. Add MDX only if an article actually needs React components.

Project bodies are already loaded for future detail pages. Those routes should use the existing slug and publication-filtered collection rather than import raw content or expose draft files. Leave `detailUrl` absent until a real page is available.

## Preview and validate locally

```sh
nvm use
npm ci --include=dev
npm run dev
```

Open <http://localhost:3000>. Refresh after Markdown edits or new files; filesystem content edits do not rely on React Fast Refresh. Restart after changing `.env.local`.

```sh
npm run content:validate
npm test
npm run check
```

`content:validate` reports filenames and field paths for content errors. `test` checks validation, publication filtering, ordering, assets, file discovery/rendering, optional metadata, dates, navigation selection, and SEO policies. `check` additionally runs lint, strict TypeScript, the production build, and generated-output verification. A normal production build loads and validates all content, including draft or hidden entries. `npm run verify:build` can inspect an existing build without opening a browser.

## Commit and deploy content updates

Review your changes with `git diff`, run `npm run check`, and commit only after it passes. Add new content files to Git as well as editing existing ones. Push your branch to GitHub; once Vercel is connected, pull requests can generate preview deployments and updates to the configured production branch will trigger production builds.

Production pages use build-time content. A local save or Git commit alone does not update the live site; the new deployment must complete. Follow `DEPLOYMENT.md` for the Vercel production branch, build settings, actual domain, and command-line checks. No deployment has been created by the agent.

Page and Open Graph titles use your name and current role; descriptions use your bio. Changing those content files updates metadata automatically. Leave `SITE_URL` blank until the real production HTTPS origin is known, then configure it in Vercel Production and redeploy. Only configured Vercel Production builds become indexable and include a homepage sitemap entry. Canonical URLs, Open Graph URL, and sitemap references share that origin; preview builds remain non-indexable. No component edit is needed to configure the domain.
