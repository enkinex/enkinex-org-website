# enkinex-org-website

[enkinex.org](https://enkinex.org) — **Docusaurus 3** + TypeScript site
for the enkinex project (Semantic & Governance as Code). Deployed to
Cloudflare via Wrangler.

## Repo map

| Path | Purpose |
|---|---|
| `docs/governance/odcs|odps/` | Library pages + step-by-step KCL tutorials (the most complete content) |
| `docs/why-enkinex.mdx`, `docs/architecture.mdx`, `docs/composable-architecture/`, `docs/semantic/` | Framework narrative — mostly TODO placeholders |
| `blog/` | Docusaurus blog (authors/tags configured, no posts yet) |
| `src/components`, `src/pages`, `src/theme` | Custom React components, landing page, theme overrides |
| `docusaurus.config.ts`, `sidebars.ts` | Site configuration |
| `wrangler.jsonc` | Cloudflare deployment config |

## Commands

`npm install` · `npm run start` (dev server) · `npm run build` ·
`npm run typecheck` (tsc — run before PR) · `npm run preview`
(build + wrangler dev) · `npm run deploy` (build + wrangler deploy —
human-gated). Playwright is available for e2e (`playwright` in
devDependencies).

## Standards

- MDX pages use the `TodoBanner` component for unfinished sections.
- Tutorials mirror the KCL libraries' module structure; keep them in
  sync with `enkinex-odcs` / `enkinex-odps` releases.
- Branch `<type>/<short-slug>`, Conventional Commits subset,
  squash-merge.

Shared enkinex workflow/git rules: `~/.config/opencode/AGENTS.md`
(installed from enkinex-aiops).
