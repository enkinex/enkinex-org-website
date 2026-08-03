# Enkinex — Shared Agent Instructions

> GENERATED FILE — do not edit in the target repo. Source:
> enkinex-aiops `opencode/shared/AGENTS.md`, installed to
> `.opencode/shared/AGENTS.md` by `just sync-opencode` (ADR-0005).
> Referenced from the shared `opencode.jsonc` `instructions` list.

Enkinex is an open-source **Semantic & Governance as Code** project: KCL
libraries that implement open standards (ODCS, ODPS) and platform
configuration surfaces (Databricks Asset Bundles) as typed, modular code.

## Git workflow (locked)

- Branch slug: `<type>/<scope>-<short-summary>`; `type` ∈ `feat · fix ·
  refactor · docs · chore · test · infra · proj`.
- Commits: Conventional Commits subset `<type>(<scope>): <imperative ≤72>`,
  `Refs:` footer pointing at the plan section delivered, no `Closes:`/
  `Fixes:`/`Resolves:` (there are no GitHub Issues).
- **Never push, merge, or open PRs unless the user explicitly asks.** The
  iteration ends at a local commit. `gh` CLI is the only GitHub surface
  (ADR-0002): no GitHub MCP, no Actions, no Issues/Projects/Releases.
- Never force-push to `main`; never rewrite history.
- Before any repo edit: `git fetch origin`, confirm sync with `main`,
  create the branch. Commit at the end of the iteration.

## Project lifecycle

Repos with a `.project/` directory run discovery → backlog → plan → done.
Plans live in `.project/plan/v*.md` (or `plan/` for the opencode migration);
finished work moves to `done/`. ADRs record one-way decisions only —
procedural workflows are defined as executable artefacts (agents, commands,
loop tasks, plugin hooks), never as ADR prose (ADR-0004, executable
governance).

## Model tiers (OpenRouter)

| Tier | Models | Use |
|---|---|---|
| Free | `:free` suffixed IDs | explore/triage, formatting, titles |
| Mid | `moonshotai/kimi-k2`, `deepseek/deepseek-v3.2`, `google/gemini-3.5-flash` | code edits, docs, tests |
| Frontier | `moonshotai/kimi-k3` (default), `anthropic/claude-opus-5`, `openai/gpt-5.6` family | plans, reviews, ADRs |

Do not switch tiers silently; model pins change only via PR.

## Code standards

- KCL libraries: one module per concern, docstrings on every schema and
  field (they feed `just docs`), `check` rules for enums/constraints,
  `kcl vet` fixtures under `test/`. Gate: `just check` (fmt + lint + test).
- Stage explicit paths only — never `git add -A` / `git add .`; skip
  anything that looks like a secret.
