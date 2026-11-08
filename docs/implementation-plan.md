# Portfolio implementation plan

Approved in conversation on 2026-11-07. Execute one phase at a time and pause for review at each boundary.

Scrollspy policy update (2026-11-08): Recognition now stays highlighted through Education, Contact, and the footer, superseding the original secondary-section clearing behavior recorded below. Secondary sections remain individually tracked internally.

## Architecture

Build one continuous GitHub-inspired homepage using Next.js App Router, React Server Components, strict TypeScript, Tailwind CSS, and static prerendering on Vercel. Use system fonts and CSS theme variables. Do not introduce a backend, CMS, database, authentication, or client-side fetching for portfolio content.

Keep all portfolio facts and editable copy separate from rendering. Use structured TypeScript data for profile, experience, technologies, recognition, and education. Use Markdown for the README and one Markdown file with frontmatter per personal project. Add Zod validation and build-time publication filtering in Phase 2. Do not build future article or project detail routes before they are needed.

Only section navigation and scrollspy need a Client Component in the MVP. Use native anchors and one document scrollbar. The header scrolls normally, section navigation remains sticky, and the desktop profile uses CSS sticky positioning below it. Disable profile stickiness when the viewport cannot accommodate its content.

Scrollspy will select sections using a line below the sticky navigation, a passive scroll listener scheduled through requestAnimationFrame, and recalculation on resize, hash changes, and history restoration. Overview, Experience, Projects, and Recognition map to navigation links. Education and Contact clear the active link; account for the bottom of the document.

Use only supplied facts. Keep provisional metrics unpublished until confirmed; keep Async Event Processor in draft. Hide absent links and resume downloads. Never invent repository URLs, domains, metrics, or internal architecture details. Defer dark mode, search, filtering, article routes, and project detail routes.

## Phase 1 — Foundation (authorized)

- [x] Initialize App Router with compatible stable package versions and a reproducible lockfile.
- [x] Configure strict TypeScript, Tailwind CSS, ESLint, and repeatable check scripts.
- [x] Establish Server Component layout, light theme tokens, system typography, focus styling, and skip navigation.
- [x] Add a minimal homepage with editable introductory content.
- [x] Add setup documentation and Git ignore rules.
- [x] Initialize Git and commit the foundation (completed locally by the user; origin configured).
- [x] Verify lint, typecheck, production build, and static prerendering.
- [ ] Verify development startup and live preview (blocked by local port permissions).
- [x] Report results and pause for review before Phase 2.

Acceptance: the foundation runs locally; all available checks pass; any environment limitations are stated explicitly. No later-phase UI is required.

### Phase 1 verification — 2026-11-07

- `npm ci --offline` succeeded using a temporary writable copy of the local npm cache. Registry DNS access was unavailable. The project lockfile uses ordinary registry package URLs and does not depend on that temporary cache path.
- `npm run check` passed: ESLint with zero warnings, route type generation, strict TypeScript, and the production build. The build marks `/` and `/_not-found` as static prerendered routes.
- An independent read-only review found no issues within Phase 1 scope.
- Production builds use the supported `next build --webpack` option. The default Turbopack build failed because its CSS processing attempted local port binding, which the environment prohibits. Webpack completed without changing the application architecture.
- `npm run dev -- --hostname 127.0.0.1` could not bind port 3000 (`EPERM`), so no live browser preview was verified.
- `git init -b feat/portfolio-foundation` could not create `.git` (`Operation not permitted`). No Git repository, commit, remote, or deployment was created.
- Verification ran on Node.js 25.2.0 and npm 11.6.2. `.nvmrc` selects Node.js 24 LTS for normal development; that runtime was not available for verification here.
- At this handoff, Phase 2 had not started. It was subsequently authorized by the user.

## Phase 2 — Content architecture

Define Zod schemas with inferred types. Create all initial content files. Load and validate Markdown/frontmatter on the server, filter publication status, sort deterministically, validate referenced tags and local assets, and report errors with source paths. Add tests for invalid data, dates, optional metadata, ordering, drafts, and discovering a newly added project file. Begin CONTENT_GUIDE.md.

Acceptance: content changes require no component changes; drafts are excluded from public output; missing optional fields are safe; meaningful content tests pass.

### Phase 2 checkpoint — 2026-11-07

- [x] Add Zod schemas with inferred TypeScript types, required fields, strict metadata keys, calendar-month dates, publication status, order, categories, optional URLs, local assets, unique IDs/slugs, and technology/current-employer references.
- [x] Add all supplied structured content and Markdown files; omit unavailable contact links/assets and keep provisional metrics and Async Event Processor in draft.
- [x] Load projects automatically from individual Markdown files, normalize line endings, parse YAML metadata, validate every entry, filter nested publication status, and sort by order then ID/slug.
- [x] Add a server-only rendering entry point with request-scoped caching, a development-only draft preview flag, and a standalone content validation command.
- [x] Connect the foundation introduction and metadata to validated profile/current-experience data, with no Client Component or request-time service.
- [x] Write CONTENT_GUIDE.md covering file locations, profile/experience/groups/contributions, projects, drafts, awards, assets/socials, future notes, preview, and deployment updates.
- [x] Run 15 focused tests using Node's built-in runner and real temporary files; cover discovery, order, malformed metadata, optional values, duplicate identities, dates, references, assets, recursive filtering, and production preview rejection.
- [x] Pass `npm run check`: lint, strict type checking, tests, content validation, and a production build. Public content validation reports two employers, one project, one recognition, and one education entry. The homepage remains statically prerendered.
- [x] Verify content-derived metadata in generated HTML and no draft metric/project text in public HTML or client JavaScript.
- [x] Obtain an independent read-only review: no actionable findings.

Implementation decisions: use the dependency-free `yaml` package with a small reader for the two metadata delimiter lines instead of gray-matter, whose legacy YAML dependency could not be fully installed from the offline cache. Keep Markdown rendering dependencies for Phase 3, where they are first used. Use `tsx` with Node's test runner rather than add a test framework. Reject invalid drafts rather than silently skip them. Draft preview is limited to development, and hidden entries remain hidden in preview.

Work is on `feat/content-architecture`. The user committed and pushed Phase 2, then authorized Phase 3 on this branch. Content is fully loaded and validated; the later UI phases expand its presentation.

## Phase 3 — GitHub-inspired shell

Implement header, native section links, profile, responsive two-column grid, sticky navigation/sidebar offsets, short-viewport fallback, and Markdown README styling.

Acceptance: review desktop/mobile appearance, keyboard access, readable spacing, one document scrollbar, and access to all profile links.

### Phase 3 checkpoint — 2026-11-07

- [x] Add a GitHub-inspired header, icon navigation with four native anchors, and a real published-project count.
- [x] Add the profile sidebar using validated identity/employment, a local image when configured, otherwise initials, and only configured contact/resume links.
- [x] Add a responsive two-column grid with CSS sticky navigation, document scrolling, section anchor offsets, and profile stickiness from 1024px width and 800px height. Smaller viewports use normal profile scrolling.
- [x] Render the README as safe server-side GitHub-flavored Markdown with reusable technology labels and restrained typography/borders.
- [x] Give all four tabs real content targets using compact employer/project/recognition summaries. These are actual content, not empty placeholders; detailed layouts remain Phase 4.
- [x] Keep page/components server-rendered. Native hash underlining is a progressive fallback; viewport scrollspy remains Phase 5.
- [x] Pass lint, strict TypeScript, all 15 content tests, content validation, and production build via `npm run check`. The homepage remains statically prerendered.
- [x] Check generated HTML for unique IDs, all anchor targets, one main and one h1, rendered Markdown, omitted unconfigured links, and no draft text in public HTML/client JavaScript.
- [x] Obtain an independent read-only review: no actionable findings.
- [ ] Verify rendered desktop/mobile appearance, keyboard interaction, anchor scrolling, horizontal overflow, and sticky behavior in a live browser.

Browser verification limit: the local dev server cannot bind port 3000 (`EPERM`). The browser automation host is unavailable, and a native Safari fallback did not load the prepared static preview after interrupted UI control. A self-contained preview was generated from production HTML/CSS at `/private/tmp/portfolio-phase3-preview.html`; it was not successfully inspected. No screenshot or viewport-interaction verification is claimed. README.md includes local review steps.

The user committed and pushed Phase 3, then authorized Phase 4 on the same branch. Commits and pushes remain with the user.

## Phase 4 — Portfolio sections

Render the employer timeline and contribution groups, emphasize Kubernetes Migration/OpenTelemetry/Gateway work, group product contributions compactly, and add personal project cards, recognition, education, contact, and footer from content.

Acceptance: all supplied content renders with the agreed hierarchy; absent URLs do not create links; personal project cards contain no internal professional work.

### Phase 4 checkpoint — 2026-11-07

- [x] Replace compact preview sections with an employer timeline, connecting lines and markers, role/date/location metadata, contribution groups, and three featured engineering contributions. Keep supporting improvements compact and product initiatives within their one category.
- [x] Add a responsive repository-style personal project grid driven by published content. Render reusable technology tags, the editorial featured flag, and only configured repository/demo/detail links. No fabricated repository URLs or statistics.
- [x] Complete dated recognition with the supplied award wording, compact education with graduation/GPA, shared profile/contact links and optional resume download, and a minimal footer.
- [x] Keep all editable copy in content files and all sections as Server Components. Add no dependencies, Client Components, data fetching, or forms.
- [x] Use native English month/year formatting with an explicit UTC timezone and semantic time elements.
- [x] Pass `npm run check`: lint, strict TypeScript, 19 tests, content validation, and static production build. New checks cover date formatting, missing optional project/contact metadata, configured destinations/download behavior, and new Markdown project file → loaded content → rendered card.
- [x] Inspect generated HTML for all six sections and four primary navigation anchors, two employer entries, three featured contributions, one personal project card, dates/GPA/award wording, and footer. Verify unique IDs, working internal targets, absence of unavailable links, and no draft text in HTML or client JavaScript.
- [x] Obtain an independent read-only review: no actionable findings.
- [ ] Confirm live desktop/mobile visuals, keyboard interaction, overflow, and scrolling locally; existing preview/browser restrictions still apply.

All professional and personal content remains file-based. Provisional metrics and Async Event Processor stay draft. Email, LinkedIn, avatar, and resume have not been invented. The user committed Phase 4 and authorized Phase 5 on the same branch; commits and pushes remain with the user.

## Phase 5 — Navigation and polish

Implement scrollspy in a small Client Component with native anchors, hash/history handling, measured sticky offsets, stable boundary selection, and no active tab for Education/Contact. Refine responsiveness, focus states, and overflow.

Acceptance: browser checks cover initial hashes, clicks, fast scrolls, both directions, history navigation, secondary sections, desktop stickiness, short viewports, mobile navigation, and horizontal overflow.

### Phase 5 checkpoint — 2026-11-07

- [x] Hydrate only SectionNavigation. Keep app/page.tsx and all portfolio content as Server Components with no client-side content fetch.
- [x] Track actual section positions with a passive scroll listener and one pending requestAnimationFrame. Measure the navigation height and shared CSS anchor offset, observe layout changes, and recalculate on resize/load/hash/history/pageshow events.
- [x] Add four-pixel boundary hysteresis, direct selection on fast jumps, native-anchor intent for exact-boundary and bottom-clamped headings, and distinct tracking of Education/Contact without primary active states.
- [x] Add aria-current only to the current primary link and horizontal-only active-tab reveal without moving document scroll or keyboard focus. Retain native hash highlighting before hydration and without JavaScript. Use no smooth scrolling or animation.
- [x] Keep native anchor URLs/history. Clean up event listeners, observers, pending frames, and the measured CSS variable on unmount.
- [x] Obtain independent review. Fix its history-cache finding: persisted pageshow preserves existing/dismissed anchor intent, including follow-up popstate in that restoration batch. The regression test failed with the stale Recognition selection before the fix and passes afterward.
- [x] Pass `npm run check`: lint, strict TypeScript, all 31 tests (12 navigation tests), content validation, and production build. The homepage remains statically prerendered.
- [x] Inspect generated output: all native anchor targets remain valid, no draft content leaks, and SectionNavigation is the only local TSX client reference. Portfolio data is absent from client JavaScript.
- [x] Write docs/browser-checklist.md covering all required viewport, scrolling, hash/history, cache, keyboard, mobile, overflow, no-JavaScript, and reduced-motion checks.
- [ ] Execute live browser/viewport tests and record results locally. No browser interaction pass is claimed.

Verification deviation: an automated browser suite was planned, but this environment cannot host the preview or access the browser host, and neither a browser runner nor browser binaries are installed or available in the package cache. Keep the current dependency set instead of committing an unavailable, unverified harness. Runnable pure selection tests and the explicit local browser checklist are provided. Full live-browser acceptance remains pending for the release phase.

The user committed Phase 5 and authorized Phase 6 on the same branch, explicitly requesting command-line verification only and no Safari/browser testing.

## Phase 6 — Release preparation

Complete metadata, Open Graph, robots, and domain-dependent canonical/sitemap configuration without inventing a domain. Run all checks and production build, inspect prerendering and client JavaScript, verify accessibility and links, exercise a content-only update, and finish README.md and CONTENT_GUIDE.md with Vercel deployment instructions.

Acceptance: the complete portfolio meets the user's acceptance checklist, and content/deployment documentation supports independent maintenance. Publishing requires the actual configured repository and hosting account.

### Phase 6 checkpoint — 2026-11-07

- [x] Add content-derived page/Open Graph metadata, validated optional SITE_URL, canonical URL policy, static favicon, robots.txt, and sitemap.xml without inventing a production domain.
- [x] Keep unconfigured and preview/development builds non-indexable. Only configured Vercel Production advertises a homepage sitemap entry. Leave the real domain unset for the user to configure.
- [x] Add five SEO tests and a reusable command-line build verifier for generated metadata, favicon, sitemap policy, prerendering, structure/link targets, and isolated client entry points.
- [x] Reproduce a clean lockfile install, including development build tools when NODE_ENV=production. Explicitly run unit tests in test mode while retaining the separate real-production draft rejection test.
- [x] Pass all 36 tests, lint, strict TypeScript, content validation, production build, and generated-output checks. The homepage, favicon, robots file, and sitemap remain static.
- [x] Verify actual production and preview build variants with a reserved example.com test fixture, including CONTENT_PREVIEW_DRAFTS=true during production-mode builds. Production is indexable; preview is noindex. Test values are transient command environments, not project configuration.
- [x] Restore the final build to the unconfigured-domain/noindex policy and run the complete check command.
- [x] Finish README.md, CONTENT_GUIDE.md, .env.example, and DEPLOYMENT.md with production branch/merge workflow, Vercel settings, domain/indexing setup, command-line verification, content updates, and rollback instructions.
- [x] Obtain independent read-only review: no actionable findings. An additional deployment-style test caught three preview tests inheriting NODE_ENV=production; the test command was corrected and all 36 then passed under that outer environment. URL normalization in the verifier handles Next's equivalent root URL with/without a trailing slash.
- [x] Respect command-only verification. No browser, Safari, deployment, commit, push, or merge was performed in this phase. Actual viewport behavior and Core Web Vitals remain unmeasured, as documented.

Commands verified include `npm ci --include=dev --offline`, `NODE_ENV=production npm test`, the full production-environment `npm run check`, production/preview `npm run verify:build` expectations, and the final unconfigured `npm run check`. Verification ran on the available Node.js 25.2.0/npm 11.6.2; Node.js 24 LTS is selected for normal development/Vercel and was not available in this environment.

Implementation and command-line release checks are complete. Changes remain on `feat/content-architecture` for the user to commit/push. Deployment and the actual SITE_URL are user setup steps in DEPLOYMENT.md; no live hosting or domain has been configured by the agent.

## Verification strategy

Use lint, strict TypeScript, Next.js route generation, and a production build for the foundation. Focused automated tests cover content, rendering with optional metadata, dates, and navigation selection. Live layout/navigation verification follows docs/browser-checklist.md until a usable browser runner/preview environment is available. Avoid snapshot tests for trivial static markup. Record actual results rather than assuming that successful compilation or pure logic tests prove browser behavior.
