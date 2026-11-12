<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# HireLoop — agent notes

Stack: Next.js 16.4.4 (App Router), React 19.3.1, Tailwind 4, shadcn/ui (base-nova, RSC), better-auth + MongoDB (database `hireloopdb`), TypeScript strict, ESLint 9 flat config, Prettier + tailwind plugin. `"type": "module"`.

## Commands
- `npm run dev` — dev server on localhost:3000 (BETTER_AUTH_URL must match)
- `npm run build` — `next build` (outputs `.next/`, gitignored)
- `npm run start` — `next start` production server (run `build` first)
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next`)
- `npm run typecheck` — `tsc --noEmit`
- `npm run format` — `prettier --write "**/*.{ts,tsx}"`
- No test runner is installed and no `*.test.*` files exist — there is no `npm test`. Do not invent one.

Suggested local verification order: `typecheck -> lint -> build`. There is no CI (`/github` doesn't exist) and no pre-commit hooks, so nothing verifies for you.

## Environment
- `.env` exists locally but is **gitignored and untracked** (`.env*` in `.gitignore`); do not commit it. New checkouts must create one:
  - Required: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_MONGODB_URI`
  - Optional pair: `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` (`lib/auth.ts` throws if only one is set)
- `lib/auth.ts` and `lib/db.ts` throw at import time when `BETTER_AUTH_MONGODB_URI` is missing — dev won't boot without a MongoDB URI.

## Architecture / entry points
- `app/layout.tsx` — root layout: forced dark theme, Google fonts. Pages: `app/page.tsx` (landing), `app/sign-in`, `app/sign-up`, `app/dashboard/*`.
- `app/dashboard/layout.tsx` — server layout: calls `getSession()`, redirects to `/sign-in` when unauthenticated, normalizes role via `lib/dashboard.ts`.
- Auth: better-auth Next.js handler at `app/api/auth/[...all]/route.ts` (GET/POST). Server singleton: `lib/auth.ts` (betterAuth, MongoDB adapter, email+password, optional Google). Client: `lib/auth-client.ts` (`signIn`, `signUp`, `signOut`, `useSession`). Session: `lib/session.ts` `getSession` (React `cache`-wrapped, reads `headers()` — server components only).
- `lib/db.ts` `getDb()` — Mongo client cached on `global.__hireloopMongo` in dev to survive HMR reloads.
- UI: `components/ui/*` (shadcn) plus `components/{auth,dashboard,landing,layout}`. Add shadcn components with `npx shadcn@latest add <name>`. Import alias `@/*` maps to repo root.

## Gotchas
- `next.config.ts` sets `devIndicators: false` — the Next.js dev overlay is disabled intentionally (overlaps the dashboard Logout button).
- Tailwind 4 is imported via CSS `@import` in `app/globals.css`; Prettier uses `prettier-plugin-tailwindcss` (`tailwindFunctions: ["cn", "cva"]`) — run `npm run format` instead of hand-sorting classes.
- `next-env.d.ts` and `*.tsbuildinfo` are gitignored and regenerated; leave them out of commits.
- `components.json` drives shadcn/ui: `rsc: true` (server components by default), aliases `components: "@/components"`, `ui: "@/components/ui"`, `lib: "@/lib"`, `hooks: "@/hooks"`, CSS in `app/globals.css`.
