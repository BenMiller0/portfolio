---
name: portfolio-docs
description: Audit or update this repository's README, DESIGN, AGENTS and local agent skills after behavior, setup or maintenance changes.
---

# Portfolio documentation

Review all root Markdown files for a documentation audit. For a focused change, update the affected contracts without rewriting unrelated guidance. Read the current source and diff before describing what the application does.

## Give each document a job

- [README](../../README.md): setup, user-visible behavior, source map and content maintenance.
- [DESIGN](../../DESIGN.md): architecture, interaction/visual requirements and browser verification.
- [AGENTS](../../AGENTS.md): contributor entry point, shared constraints and skill routing.
- `skills/*/SKILL.md`: focused implementation or verification workflows. Keep frontmatter names consistent with folder names and descriptions narrow enough to select the right guide.

The on-site README in `app/src/windows/readmeWindow.jsx` and terminal document contents are separate application content. A request to update contributor docs does not require adding an in-app tab or rewriting those copies unless their content is affected.

## Check facts that tend to drift

Compare npm commands with `app/package.json`, runtime requirements with the installed/locked Vite version, paths with the filesystem, featured placement with `data/projectLayout.js`, and static labels/URLs with `data/windowRegistry.jsx`.

For terminal changes, compare command dispatch, completion, help entries and manual pages. Keep shell help concise; put extended usage in the root README or relevant manual. Distinguish the custom Vim implementation from upstream Vim and virtual session-only edits from host/source changes.

Keep mobile-only behavior labeled as mobile-only. Describe `.preview.local/` as ignored local audit artifacts, `app/dist/` as generated build output, and `npm run preview` as a local server, not deployment.

## Validate the result

Resolve local Markdown links relative to each document, including heading fragments. Check linked source paths and assets still exist. Ensure every new skill is reachable from AGENTS and contains finished instructions, not scaffolding. Avoid duplicating the entire DESIGN checklist or Vim command reference in each skill.

For docs-only edits, link/frontmatter checks and diff review are appropriate; do not imply a fresh browser audit or build ran. When code also changed, follow its verification requirements and report them separately. If asked for a commit message, summarize the actual diff, not unimplemented requests, and do not create a commit unless asked.
