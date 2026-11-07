# Portfolio implementation plan

Approved in conversation on 2026-11-07. Execute one phase at a time and pause for review at each boundary.

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
- [ ] Initialize Git and commit the foundation (blocked by workspace permissions).
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
- Phase 2 has not started. Resume only after the user's phase review.

## Phase 2 — Content architecture

Define Zod schemas with inferred types. Create all initial content files. Load and validate Markdown/frontmatter on the server, filter publication status, sort deterministically, validate referenced tags and local assets, and report errors with source paths. Add tests for invalid data, dates, optional metadata, ordering, drafts, and discovering a newly added project file. Begin CONTENT_GUIDE.md.

Acceptance: content changes require no component changes; drafts are excluded from public output; missing optional fields are safe; meaningful content tests pass.

## Phase 3 — GitHub-inspired shell

Implement header, native section links, profile, responsive two-column grid, sticky navigation/sidebar offsets, short-viewport fallback, and Markdown README styling.

Acceptance: review desktop/mobile appearance, keyboard access, readable spacing, one document scrollbar, and access to all profile links.

## Phase 4 — Portfolio sections

Render the employer timeline and contribution groups, emphasize Kubernetes Migration/OpenTelemetry/Gateway work, group product contributions compactly, and add personal project cards, recognition, education, contact, and footer from content.

Acceptance: all supplied content renders with the agreed hierarchy; absent URLs do not create links; personal project cards contain no internal professional work.

## Phase 5 — Navigation and polish

Implement scrollspy in a small Client Component with native anchors, hash/history handling, measured sticky offsets, stable boundary selection, and no active tab for Education/Contact. Refine responsiveness, focus states, and overflow.

Acceptance: browser checks cover initial hashes, clicks, fast scrolls, both directions, history navigation, secondary sections, desktop stickiness, short viewports, mobile navigation, and horizontal overflow.

## Phase 6 — Release preparation

Complete metadata, Open Graph, robots, and domain-dependent canonical/sitemap configuration without inventing a domain. Run all checks and production build, inspect prerendering and client JavaScript, verify accessibility and links, exercise a content-only update, and finish README.md and CONTENT_GUIDE.md with Vercel deployment instructions.

Acceptance: the complete portfolio meets the user's acceptance checklist, and content/deployment documentation supports independent maintenance. Publishing requires the actual configured repository and hosting account.

## Verification strategy

Use lint, strict TypeScript, Next.js route generation, and a production build for the foundation. Add focused automated tests for content behavior in Phase 2 and a small browser suite for layout/navigation behavior in Phase 5. Avoid snapshot tests for trivial static markup. Record actual results rather than assuming that successful compilation proves browser behavior.
