# Deploy portfolio-site to Vercel

The repository is `kevinssheva/portfolio-site`. No hosting project or deployment has been created by the agent. Deployment uses Vercel's native Next.js support; no custom server, database, CMS, static export, or hosting manifest is required.

## Prepare the production branch

1. Run `npm ci --include=dev` and `npm run check` locally.
2. Review and commit the current work on `feat/content-architecture`, then push it.
3. Merge the reviewed feature branch into `main` through your normal GitHub workflow. Use `main` as the Vercel production branch. Feature branch deployments can be used as previews before the merge.

The selected production branch must contain the completed portfolio. The agent does not merge, commit, or push on your behalf.

## Import and configure the project

In Vercel, import the GitHub repository and select these settings:

| Setting | Value |
| --- | --- |
| Framework preset | Next.js |
| Root directory | Repository root (`.`) |
| Node.js version | 24.x, matching `.nvmrc` |
| Install command | `npm ci --include=dev` |
| Build command | `npm run check` |
| Output directory | Keep the Next.js preset default |
| Production branch | `main`, after the feature branch is merged |

`npm run check` runs lint, strict TypeScript, all tests, content validation, the production build, and generated-output verification. Tests explicitly run with `NODE_ENV=test`; the build still runs in production mode, and a separate test verifies that real production processes reject draft preview. `--include=dev` installs the linters, TypeScript, and test runner needed at build time even if the environment defaults to production. This makes the quality checks part of deployment without adding a separate CI service. Do not override the output directory to `out`; this project uses Next.js prerendering rather than static export. The build uses supported Webpack mode and requires no network-fetched fonts.

See Vercel's [build configuration](https://vercel.com/docs/builds/configure-a-build) and [Next.js integration](https://vercel.com/docs/frameworks/full-stack/nextjs) for the platform settings.

## Configure the production URL

The repository deliberately contains no production domain. Deploy first to obtain the actual Vercel URL, or attach the custom domain you own using Vercel's domain configuration. Then set `SITE_URL` to that real HTTPS origin in the **Production** environment and redeploy.

The value must include `https://` and contain only the origin: no page path, username/password, query, or fragment. A trailing slash is accepted. Keep the production environment's access to Vercel system environment variables enabled; Vercel supplies `VERCEL_ENV` itself. Do not hardcode it in application files.

| Build configuration | HTML robots metadata | Canonical / Open Graph URL | Sitemap |
| --- | --- | --- | --- |
| `SITE_URL` missing or blank | `noindex, nofollow` | Omitted | Empty |
| URL configured, `VERCEL_ENV=production` | `index, follow` | Configured origin | Homepage URL only |
| URL configured, preview/development/unknown environment | `noindex, nofollow` | Configured production origin | Empty |

Set `SITE_URL` in Production only for the simplest setup. Even if it is inherited by previews, they stay non-indexable. There is no fallback to a guessed domain, localhost, or a branch preview URL. Canonical metadata, Open Graph URL, robots sitemap reference, and sitemap entries use the same validated origin.

Title, description, and Open Graph identity come from profile/current-experience content. A social share image is not configured; no image or portrait has been fabricated. The small SVG favicon reuses the site's code symbol.

`robots.txt` allows crawling so crawlers can read the page's `noindex` metadata; it advertises a sitemap only for configured production. Blocking crawling would prevent Google from seeing `noindex`. [Google's noindex documentation](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

Vercel documents `VERCEL_ENV` as `production`, `preview`, or `development` in its [system environment variable reference](https://vercel.com/docs/environment-variables/system-environment-variables).

## Other environment variables

`CONTENT_PREVIEW_DRAFTS` is for local development only. Leave it unset or false in Vercel. Production rendering excludes drafts regardless of its value. No credentials or API keys are needed by this portfolio.

Environment changes require a new deployment because the pages and metadata are generated during the build. They do not update an already-built deployment in place.

## Verify builds using commands

`npm run verify:build` reads the latest `.next` build; run `npm run build` first, or use `npm run check` to run everything in order. It checks generated SEO/favicon files, sitemap/indexing consistency, prerendered routes, semantic structure, internal link targets, and the app's client entry points. It consumes generated React/Next markup and the current Next.js build manifest format; review it when upgrading Next.js.

The following commands exercise both deployment policies locally. **`example.com` is a reserved test fixture, not this portfolio's production domain.** These commands never deploy or save the URL in project configuration.

```sh
SITE_URL=https://example.com VERCEL_ENV=production npm run build
npm run verify:build -- --indexable
SITE_URL=https://example.com VERCEL_ENV=preview npm run build
npm run verify:build -- --noindex
SITE_URL= VERCEL_ENV=development npm run check
```

The final command restores an unconfigured, non-indexable local build. These environment-prefix commands are for macOS/Linux shells. Do not set test values in the Vercel project.

After deployment, set `PORTFOLIO_URL` in your terminal to the actual deployed HTTPS origin without a trailing slash, then check:

```sh
curl -I "$PORTFOLIO_URL"
curl -fsS "$PORTFOLIO_URL/robots.txt"
curl -fsS "$PORTFOLIO_URL/sitemap.xml"
```

Expect a successful homepage response. With the production URL configured, robots should advertise that origin's sitemap, and the sitemap should contain only the homepage URL. Preview/unknown-domain builds should have no sitemap entries. Verify indexing metadata against the table above if a build is unexpectedly non-indexable.

## Content updates and rollback

Edit content files, run `npm run check`, commit, and push. Once GitHub integration is connected, Vercel builds the selected branch; production updates follow merges/pushes to the configured production branch. New project files are discovered automatically, and drafts stay out of production output.

To roll back content, revert the relevant Git commit and deploy the result. Vercel's deployment controls can also restore a previous successful production deployment. An older deployment retains the content and SEO settings from its own build.

## Verification scope

Release checks in this session use commands only, as requested. Unit/rendering tests and generated-output checks do not prove actual viewport layout, browser event ordering, keyboard interaction, Core Web Vitals, or remote link availability. No Safari/browser automation or deployment is part of this phase. The optional [browser checklist](docs/browser-checklist.md) remains available for later visual review; it is not marked as passed.
