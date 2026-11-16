# HireLoop

HireLoop is a Next.js frontend with a MongoDB-backed Express API.

## Local development

Set `BETTER_AUTH_MONGODB_URI`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` in
`.env`. The frontend and Express backend use the same MongoDB database,
`hireloopdb`.

In `.env`, set these API URLs if they differ from the local defaults:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

Run the frontend and backend in separate terminals:

```bash
npm run backend
npm run dev
```

If another backend already uses port `5000`, stop it before starting this one.
If you choose a different port, set `PORT` and `NEXT_PUBLIC_BACKEND_URL` to
matching values.

The Express API serves public job listings at `GET /jobs` and a public job
detail at `GET /jobs/:id`. Job creation and recruiter dashboard operations
continue to use the authenticated Next.js API routes.
