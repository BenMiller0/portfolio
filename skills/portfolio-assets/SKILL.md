---
name: portfolio-assets
description: Diagnose or fix missing portfolio photos, PDFs, project data, loading/retry states or static-host path and fallback problems.
---

# Portfolio assets and loading

Use [README's hosting notes](../../README.md#verification-and-hosting) and [DESIGN's project data contract](../../DESIGN.md#project-data). This workflow diagnoses asset delivery; it does not authorize publishing or changes to external hosting configuration.

## Find the failing layer

For absent projects, inspect the `/projects.json` response and `App.jsx` loading/error/empty state. Records need string `id`, `label` and `title` fields to survive the current filter; separately check IDs are unique. Do not silently fill missing project facts with invented content.

For photos, compare the JSON filename with the exact file under `app/public/project_photos/`, including case and spaces. URLs are encoded by the gallery; local case-insensitive success can hide failures on a case-sensitive host. For PDFs, compare `resumeLinks` in `data/windowRegistry.jsx` with `app/public/resumes/`. Public URLs start at `/`, not `/public/`.

Inspect status, response content type and body. A 200 response containing SPA fallback HTML is not a successful image/PDF fetch. Vite's asset paths assume deployment at `/`; investigate base-path assumptions before changing filenames or adding rewrites. `app/public/_redirects` only affects hosts that recognize that file.

## Verify recovery and adjacent behavior

- For fetch/loading fixes, check successful load, delayed load, failure with Retry and empty project data using temporary browser request overrides where available. Restore overrides afterward; do not corrupt committed data to simulate failure.
- For image fixes, check the full-size original link, visible gallery image and missing-image fallback. Verify all filenames touched by a batch change.
- For resume fixes, check both the viewer and download/open link, including the actual PDF payload. Do not replace PDFs with generated placeholders unless requested.
- For hosting-path fixes, inspect a local production build/preview as well as dev behavior, and check direct asset requests separately from the root page.

Validate changed JSON and local paths. Run lint/build for code changes; keep diagnostics in `.preview.local/`. If the cause is external hosting configuration, explain the required change and obtain authority before modifying that service.
