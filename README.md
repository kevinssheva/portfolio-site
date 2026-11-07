# portfolio-site

A GitHub-inspired, content-driven developer portfolio built with Next.js App Router, React, strict TypeScript, and Tailwind CSS.

GitHub repository: [kevinssheva/portfolio-site](https://github.com/kevinssheva/portfolio-site).

## Current stage

Phase 3 adds the GitHub-inspired header, native anchor navigation, responsive profile layout, and rendered Markdown README. Experience, Projects, and Recognition have compact content-backed sections so every tab has a real target. The detailed experience timeline and project cards arrive in Phase 4; viewport scrollspy arrives in Phase 5. See [the implementation plan](docs/implementation-plan.md).

## Local setup

Use Node.js 24 LTS (the version selected by `.nvmrc`) and npm. Next.js requires Node.js 20.9 or later.

```sh
nvm use
npm ci
npm run dev
```

Open <http://localhost:3000>. If you use another Node version manager, select Node 24 using its equivalent command.

## Quality checks

```sh
npm run lint
npm run typecheck
npm test
npm run content:validate
npm run build
```

`npm run check` runs all five in sequence. Type checking generates Next.js route types first, so it also works on a fresh installation. To serve the production build locally, run `npm start` after `npm run build`.

Production builds use Next.js's supported Webpack option. Turbopack's CSS processing requires local socket access that is blocked in the implementation environment; Webpack produces the static build without that requirement. Development uses Next.js's default bundler.

Behavior tests cover real content loading, validation, sorting, drafts, and optional metadata using Node's built-in test runner. Browser tests for navigation arrive with the scrollspy phase. There are no static markup snapshot tests.

## Structure

- `src/app/`: Server Component layout and homepage, plus global design tokens.
- `src/components/`: Server-rendered header, navigation, profile, README/Markdown, and compact content sections.
- `src/content/`: Typed structured data, Markdown overview, and personal project files.
- `src/lib/content/`: Zod schemas, validation, filtering, sorting, and a server-only entry point for rendering.
- `scripts/validate-content.ts`: Standalone content checks without starting Next.js.
- `docs/implementation-plan.md`: Approved architecture, phase boundaries, and progress.

Next.js generates `next-env.d.ts` and `.next/`; do not edit or commit those files. Commit `package-lock.json` whenever dependencies change, and use `npm ci` to reproduce the dependency tree.

## Rendering and deployment

The homepage uses static prerendering. There is no API, database, client-side content fetch, or static-export configuration. A production domain is not configured, and indexing is disabled while the site is incomplete.

Vercel can import the eventual GitHub repository using its Next.js framework preset, Node.js 24, and the `npm run build` command. Deployment and final SEO configuration are part of Phase 6. No deployment has been created.

All initial content is temporary. See [CONTENT_GUIDE.md](CONTENT_GUIDE.md) for editing profile data, experience, projects, awards, technologies, and links. Optional URLs/assets are omitted until supplied, and provisional metrics remain drafts.

## Review the layout locally

Run `npm run dev` and open <http://localhost:3000>. Check a desktop viewport such as 1280×900, a short desktop viewport such as 1280×720, and mobile widths such as 390px and 320px. The profile is sticky from 1024px wide when the viewport is at least 800px tall; it scrolls normally on shorter screens. Mobile places the profile above the README and allows the navigation row to scroll horizontally.

Use Tab to check skip navigation, links, and visible focus. Follow all four section links and confirm their headings stay below the sticky navigation. Hash-based underlining works without JavaScript; automatic active-tab updates during manual scrolling are Phase 5.

The implementation environment cannot bind a preview port, and its browser controls did not produce a usable preview. The production build and generated HTML were checked, but desktop/mobile visuals, touch behavior, and scrolling still need local browser review.
