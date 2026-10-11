# Neon backend setup

Completed 11 October 2026 in `D:\CultureLoop`, using Neon CLI 8.3.5 and the participant's browser-authorized login.

- Project: `cultureloop` (`misty-boat-27291281`).
- Linked branch: `production` (`br-purple-shadow-b512e0zy`), the default branch.
- Region: `aws-us-east-2`; Postgres 18.
- Existing database verified through the control plane: `neondb`, owner `neondb_owner`.
- Existing storage bucket verified: `uploads`, access `private`.
- `neon config init` created root `package.json`, lockfile and dependencies `@neon/config` and `@neon/env`.
- Root `neon.ts` contains the exact requested `preview.buckets.uploads` policy. Both plan and deployment succeeded with no changes because production already matched it. CLI recommends moving GA `preview.buckets` to top-level `buckets`; requested configuration retained.
- Neon skills installed in `.agents/skills`. `neon mcp -y` configured detected Codex and OpenCode clients globally using an account API key. Reload those clients to discover the server. No key values are recorded here.
- CLI wrote connection/storage variables to root `.env.local`. `.env.local`, `.neon` and `node_modules` are gitignored. Keep these credentials on the server; never prefix them with `VITE_` or ship them to browsers.

Run Neon commands from the repository root:

```sh
neon config plan
neon deploy
neon config status
neon bucket list
```

This completes the requested infrastructure setup. No application tables, migrations, server endpoints or browser upload flow were requested or created. The React prototype still uses localStorage and its local curated catalogue. A future database integration needs server-side endpoints and an explicit anonymous-user/session or authentication model. No SQL data-plane query was performed; verification above used Neon CLI resource/status commands. `neon deploy` applies backend infrastructure and does not publish the frontend.
