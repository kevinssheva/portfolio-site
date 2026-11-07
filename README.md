# portfolio-site

A GitHub-inspired, content-driven developer portfolio built with Next.js App Router, React, strict TypeScript, and Tailwind CSS.

GitHub repository: [kevinssheva/portfolio-site](https://github.com/kevinssheva/portfolio-site).

## Current stage

Phase 1 establishes the application foundation. The homepage intentionally contains only a brief introduction. Portfolio sections, content schemas, sticky navigation, and scrollspy belong to subsequent review phases; see [the implementation plan](docs/implementation-plan.md).

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
npm run build
```

`npm run check` runs all three in sequence. Type checking generates Next.js route types first, so it also works on a fresh installation. To serve the production build locally, run `npm start` after `npm run build`.

Production builds use Next.js's supported Webpack option. Turbopack's CSS processing requires local socket access that is blocked in the implementation environment; Webpack produces the static build without that requirement. Development uses Next.js's default bundler.

Behavior tests will arrive with the content loader and navigation logic. There are no static markup snapshot tests.

## Structure

- `src/app/`: Server Component layout and homepage, plus global design tokens.
- `src/content/site.ts`: Initial identity, metadata, and shared interface copy, separate from rendering components.
- `docs/implementation-plan.md`: Approved architecture, phase boundaries, and progress.

Next.js generates `next-env.d.ts` and `.next/`; do not edit or commit those files. Commit `package-lock.json` whenever dependencies change, and use `npm ci` to reproduce the dependency tree.

## Rendering and deployment

The homepage uses static prerendering. There is no API, database, client-side content fetch, or static-export configuration. A production domain is not configured, and indexing is disabled while the site is incomplete.

Vercel can import the eventual GitHub repository using its Next.js framework preset, Node.js 24, and the `npm run build` command. Deployment and final SEO configuration are part of Phase 6. No deployment has been created.

All initial content is temporary. Full content editing instructions will be added as `CONTENT_GUIDE.md` alongside the content architecture.
