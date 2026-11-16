<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# HireLoop — agent notes

Stack: Next.js 16.4.4 (App Router), React 19.3.1, Tailwind 4, shadcn/ui (base-nova, RSC), better-auth + MongoDB (database `hireloopdb`), plus an Express backend at `backend/server.mjs`. TypeScript strict, ESLint 9 flat config, Prettier + tailwind plugin. `"type": "module"`.

## Commands
- `npm run dev` — Next.js dev server on localhost:3000.
- `npm run backend` — `node backend/server.mjs` Express API on port 5000 (or `$PORT`). Run in a separate terminal from `dev`; the frontend calls it for public job listings (`GET /jobs`, `GET /jobs/:id`). No watch mode — restart it after editing `backend/server.mjs` or you'll be testing stale code.
- `npm run build` — `next build` (outputs `.next/`, gitignored).
- `npm run start` — `next start` production server (run `build` first).
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next`); the script is bare `eslint`, so it lints the whole repo.
- `npm run typecheck` — `tsc --noEmit`; project-wide only, it cannot be scoped to files.
- `npm run format` — `prettier --write "**/*.{ts,tsx}"`.
- No test runner is installed and no `*.test.*` files exist — there is no `npm test`. Do not invent one.

Verification order: `typecheck -> lint -> build`. No CI and no pre-commit hooks, so nothing verifies for you.

Shell is Windows PowerShell: `&&` is a parse error — chain commands with `;`.

## Environment
- `.env` exists locally but is **gitignored and untracked** (`.env*` in `.gitignore`); do not commit it. New checkouts must create one:
  - Required by both Next.js and the backend: `BETTER_AUTH_MONGODB_URI` (MongoDB database `hireloopdb`), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
  - Optional pair: `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — `lib/auth.ts` throws if only one is set.
  - Stripe test keys: `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — `lib/stripe.ts` throws at import when the secret is missing.
  - Cross-service URLs (defaults shown): `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000`, `FRONTEND_URL=http://localhost:3000`.
- `lib/auth.ts` and `lib/db.ts` throw at import time when `BETTER_AUTH_MONGODB_URI` is missing; the backend throws at startup. Dev won't boot without a MongoDB URI.
- If another backend already uses port `5000`, stop it before starting this one (or set `PORT` and `NEXT_PUBLIC_BACKEND_URL` to matching values).

## Architecture / entry points
- Two servers run in parallel: Next.js (auth, dashboard, recruiter job CRUD) and Express (public job listings only). `app/api/auth/[...all]/route.ts` is the better-auth handler (GET/POST); `app/api/jobs` and `app/api/jobs/[id]` handle authenticated job CRUD via `lib/jobs.ts`.
- Both servers read the **same MongoDB `jobs` collection directly** — `backend/server.mjs` maps docs with `toPublicJob`, `lib/jobs.ts` with its own `toDTO`. Job document shape changes affect both.
- `app/layout.tsx` — root layout: forced dark theme (`ThemeProvider defaultTheme="dark" forcedTheme="dark"`), Google fonts. Pages: `app/page.tsx` (landing), `app/sign-in`, `app/sign-up`, `app/dashboard/*`.
- `app/dashboard/layout.tsx` — server layout: calls `getSession()`, redirects to `/sign-in` when unauthenticated, normalizes role via `lib/dashboard.ts`. Roles: `job-seeker` (default), `recruiter`, `admin`; routes `/dashboard/seeker`, `/dashboard/recruiter`, `/dashboard/admin`.
- Auth: server singleton `lib/auth.ts` (betterAuth, MongoDB adapter, email+password, optional Google). Client `lib/auth-client.ts` (`signIn`, `signUp`, `signOut`, `useSession`). Session `lib/session.ts` `getSession` (React `cache`-wrapped, reads `headers()` — server components only).
- `lib/db.ts` `getDb()` — Mongo client cached on `global.__hireloopMongo` in dev to survive HMR reloads.
- Job details `app/jobs/[id]/page.tsx` (public page): Next 16 dynamic-route conventions — `params` is a Promise (await it), metadata via `generateMetadata` (not a `metadata` export), and a `React cache()` wrapper dedupes the job fetch between metadata and render.
- Apply flow: `components/jobs/apply-button.tsx` → `POST /api/seeker/applications` → `lib/applications.ts` (`applications` collection; unique `userId`+`jobId` index; snapshots job fields at apply time; bumps `jobs.applicants` exactly once; repeat calls are idempotent). Session is enforced in **both** places — the button redirects signed-out users to `/sign-in?next=…` and the route returns 401 — keep both layers. The seeker list at `/dashboard/seeker/applications` (`components/dashboard/applications-view.tsx`) GETs the same route; Archived tab = status `Rejected`/`Offered`, everything else is Active.
- `components/landing/browse-jobs.tsx` renders `/jobs` (with the `standalone` prop) — it is intentionally **not** on the landing page. Filters sync into the URL via `window.history.replaceState` (router-integrated in Next 16) and are read back with `useSearchParams`. Filter groups are single-select — clicking the active option clears it. Param names are the contract with Express `GET /jobs`: `search, type, category, remote, minSalary, maxSalary, location` — change frontend and backend together.
- Stripe checkout + apply limit: `lib/stripe.ts` server client (`STRIPE_SECRET_KEY`). Users get `APPLY_LIMIT = 10` free applies (`lib/applications.ts` — a new apply beyond it returns `limit-reached`, the route answers **402** `{code:"apply-limit"}`; repeat applies stay idempotent and bypass the gate). The job page passes `limitReached` to `components/jobs/apply-button.tsx`, which swaps to an "Add to Cart" form → `POST /api/checkout_sessions` (requires a session; tags the Stripe session `client_reference_id` + `metadata:{userId,purpose:"apply-unlock"}`; $20 price `price_1Uc4tqD7s18E8gRFuoSuu21S`) → 303 to Stripe → `/success` (500 without `session_id`; home when `open`) credits the `payments` collection via `lib/payments.ts` on `complete` (unique `stripeSessionId` — idempotent). Test card `4242 4242 4242 4242`. Pricing cards' **Add to Cart** buttons submit the same route as a form with a `plan` field: absent/`starter` → $20 `payment` mode, purpose `apply-unlock`; `growth` → $35/month `GROWTH_PLAN_PRICE` (`price_1Uc7LtD7s18E8gRFNPq20QkW`), `subscription` mode, purpose `growth-plan` (created in Stripe test mode; renewals are not tracked — no webhook). `/success` records either purpose via `recordPayment`; `hasApplyUnlock` matches both purposes, so Growth also lifts the apply limit. Signed-out clicks on the landing pricing bounce to `/sign-in?next=%2F%23pricing` — `app/page.tsx` passes `signedIn` from `getSession`, which makes `/` dynamic. Gotcha: `integration_identifier` accepts only `[A-Za-z0-9-_.]`; the API rejects `{{…}}` placeholder values.
- UI: `components/ui/*` (shadcn) plus `components/{auth,dashboard,landing,layout}`. Add shadcn components with `npx shadcn@latest add <name>`. Import alias `@/*` maps to repo root; `components.json` drives shadcn (`rsc: true` — server components by default).

## Gotchas
- `useSearchParams` in a client component under a statically prerendered page fails `next build` without a `<Suspense>` boundary — the wrapper lives in `app/jobs/page.tsx`; copy that pattern.
- Sign-in honors a same-origin `?next=` path (Apply Now uses it to return to the job); sign-up always pushes `DASHBOARD_ROUTES[role]`. Don't assume both redirect alike.
- Recruiter Manage Jobs auto-seeds demo jobs per owner (`ensureDemoJobs` in `lib/jobs.ts`, claim doc in `jobSeedState`) — those rows are seed data, not user-created.
- `next.config.ts` sets `devIndicators: false` — the Next.js dev overlay is disabled intentionally (overlaps the dashboard Logout button).
- Tailwind 4 is imported via CSS `@import` in `app/globals.css`; `prettier-plugin-tailwindcss` is installed — run `npm run format` instead of hand-sorting classes.
- `next-env.d.ts` and `*.tsbuildinfo` are gitignored and regenerated; leave them out of commits.
- `CLAUDE.md` is a one-line import (`@AGENTS.md`) — keep guidance in this file; don't duplicate content into it.
