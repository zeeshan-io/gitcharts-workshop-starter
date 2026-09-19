# GitCharts prototype build log

## Environment

- Date: 2026-09-19
- OS: Windows
- R-CLI: Backboard R-CLI 3.0.2, bundled with Backboard Studio
- Working directory: `work/gitcharts-prototype`

## Decisions

- The live-build MVP uses a hybrid architecture: deterministic repository collection and validation, AI semantic interpretation, and deterministic conversion to an interactive graph canvas.
- The first demo repository should be small and conventionally full-stack; gstack is not ideal for forced frontend/backend/database categories.
- Four groups are required: Frontend, Backend, Database, and Shared.
- Only high-signal files are displayed.

## Turn log

### Turn 0 — Preparation

Created BUILD_PLAN.md, PROMPTS.md, and BUILD_LOG.md before starting R-CLI.

### Turn 1 — Starter planning in R-CLI

- Launched Backboard R-CLI 3.0.2 from this exact working directory in Manual mode with `openai/gpt-5.5`.
- Sent Prompt 1 from `PROMPTS.md`.
- R-CLI inspected `BUILD_PLAN.md`, the workspace, `.gitignore`, and the available Node.js runtime (22.15.1).
- R-CLI proposed Vite + React + TypeScript, Vitest, custom CSS, and a Vite development middleware endpoint at `/api/analyze` that initially returns fixture data.
- Proposed files: `package.json`, TypeScript and Vite configuration, `index.html`, `README.md`, app files under `src/`, fixture graph data, GitHub URL and graph utilities with tests, and `src/server/analyzeApi.ts`.
- R-CLI stopped at its explicit **Approve / Adjust first** gate. No scaffold was approved or generated yet.

### Terminal visibility handoff

- The first R-CLI process ran in a hidden Codex-managed PTY, so it was closed before editing began.
- Resume from this exact directory without `--fresh`, then use `/sessions`, `/resume`, or `/continue` to select the most recent saved session.

### Plan approval and attendee repository decision

- The proposed Vite + React + TypeScript starter plan was approved.
- An attendee GitHub repository is valuable, but it will be created only after the prototype is working and the build sequence has been rehearsed.
- The eventual attendee repository should contain a clean starter, a finished fallback, numbered prompts, setup instructions, fixture data, and no secrets.
- GitDiagrams is inspiration for the product concept; any reused code or assets must be reviewed against its license and attributed as required.

### Turn 2 — Prompt 1 scaffold completion

- User instructed Backboard to read `BUILD_PLAN.md`, `PROMPTS.md`, and `BUILD_LOG.md` completely, confirmed the Vite + React + TypeScript starter plan was approved, and requested continuing Prompt 1 without asking for plan approval again.
- User also required approval before dependency installation or any non-read-only shell command.
- Backboard read the three planning files completely, inspected the otherwise-empty project, and scaffolded the approved starter.
- Added Vite + React + TypeScript app files, custom CSS, fixture graph data, GitHub URL helpers, graph utilities, a Vite development middleware endpoint at `POST /api/analyze`, focused Vitest tests, and setup instructions in `README.md`.
- The starter intentionally does not implement GitHub fetching or Backboard analysis. The API route returns fixture data through the server-side boundary only.
- Backboard showed the exact commands before running them and received approval for `npm install`, `npm test`, and `npm run build`.
- `npm install` completed successfully with 0 vulnerabilities.
- Initial `npm test` passed, then `npm run build` exposed a TypeScript config issue for the Vitest `test` block in `vite.config.ts`.
- Backboard patched `vite.config.ts` to use `defineConfig` from `vitest/config` and added explicit `.ts` extensions for server-side config imports.
- Backboard requested and received approval to rerun `npm test` and `npm run build`.
- Final validation passed: `npm test` reported 2 test files and 6 tests passing; `npm run build` completed successfully.

### Webinar observations after Turn 2

- R-CLI reported 5 minutes 40 seconds for the approved scaffold turn, excluding the earlier planning discussion and human approval time.
- Accept Edits mode removed repetitive file-write confirmations while still requiring approval for dependency installation and validation commands.
- The visible todo list made the agentic loop easy to explain: inspect, implement, document/test, then validate.
- The first production build found a real TypeScript configuration problem that the initial tests did not expose. R-CLI diagnosed the issue, patched the configuration, reran both checks, and finished with six tests and a successful build.
- This is a useful teaching moment for the webinar: AI-generated code still needs deterministic tests and a production build check.
- The fixture-first boundary kept the first turn understandable and reliable. GitHub collection and Backboard reasoning remain separate later stages.
- Before continuing to repository fetching, the team should run the development server, inspect all three UI states, and create a clean starter checkpoint.

### Turn 3 — Browser review and diagram direction

- Opened the local application at `http://127.0.0.1:5173/` and inspected the completed fixture state in the Codex in-app browser.
- Confirmed that the starter has a polished repository form, four file-category lanes, selectable fixture nodes, and an evidence panel.
- Confirmed that the current diagram area is only a vertical relationship list; it does not yet provide a connected spatial graph.
- Selected GitDiagram as visual inspiration: a large canvas with grouped containers, compact file nodes, labeled directional connectors, and pan/zoom/fit controls.
- Chose React Flow (`@xyflow/react`) for the interactive canvas because it supports custom nodes, labeled edges, controls, and grouped subflows.
- Chose ELK as the planned deterministic layout engine because the graph needs grouped nodes with cross-group connections; React Flow documents stronger subflow layout and edge-routing support for ELK than Dagre.
- Moved the interactive canvas ahead of GitHub fetching so the graph contract can be proven with fixture data before external data and AI are introduced.

### Turn 4 — Prompt 2 interactive canvas

- User instructed Backboard to read `PROMPTS.md` and execute Prompt 2 exactly as written.
- Backboard read `PROMPTS.md`, `BUILD_PLAN.md`, `BUILD_LOG.md`, `package.json`, Vite and TypeScript config, README, and all current application files under `src/` before editing.
- Implemented only the `interactive-canvas` checkpoint. GitHub fetching and Backboard analysis remain unimplemented.
- Added `@xyflow/react` and `elkjs` as the minimal new runtime dependencies for the grouped interactive canvas and deterministic layout.
- Replaced the vertical relationship-list placeholder with a large React Flow canvas using grouped lane containers, compact file nodes, directional labeled edges, pan, zoom, fit-view, minimap controls, and reset/fit buttons.
- Kept GitCharts' existing visual identity and preserved the existing lane cards, evidence panel, empty state, analyzing state, validation-error behavior, API-error behavior, server boundary, and fixture API behavior.
- File-node clicks use only the existing verified `githubUrl` from graph data. Missing URLs intentionally do not navigate.
- Added focused tests for graph-to-canvas conversion, group membership, invalid-edge filtering, deterministic output, and missing-URL behavior.
- Backboard showed exact commands and received approval before running `npm install`, `npm test -- src/lib/canvasGraph.test.ts`, and `npm run build`.
- `npm install` completed successfully with 0 vulnerabilities.
- Initial focused canvas tests passed: 1 test file and 5 tests passing.
- Initial production build passed, but Vite warned that the bundled chunk was larger than 500 kB.
- Backboard code-split the ELK layout engine with a dynamic import, requested approval, and reran `npm test -- src/lib/canvasGraph.test.ts` and `npm run build`.
- Final focused validation passed: `npm test -- src/lib/canvasGraph.test.ts` reported 1 test file and 5 tests passing; `npm run build` completed successfully.
- The final build still reports a Vite chunk-size warning for the separately emitted `elk.bundled` chunk. This is expected for ELK, no longer blocks the main application bundle, and is not a build failure.

### Browser QA after Turn 4

- Opened the completed fixture in the running local application and confirmed the grouped canvas, four group containers, eight file nodes, minimap, and viewport controls render.
- The initial graph fit is too small relative to the available canvas and needs a readability pass.
- DOM inspection found 12 React Flow nodes (four groups plus eight files) but zero rendered edge elements.
- Browser console inspection showed React Flow error 008 for all nine fixture relationships: the custom file nodes did not expose source and target handles, so React Flow could not attach the edges.
- This runtime defect was not caught by the focused conversion tests or the production build. The checkpoint is therefore implemented but not visually accepted.
- Webinar lesson: tests and builds are necessary but browser-level visual/runtime verification remains part of the agentic loop.
- A narrow Prompt 2 correction was recorded before proceeding to repository fetching.

### Architecture pivot — webinar starter

- Inspected GitDiagram's current open-source generation pipeline and prompt design.
- Chose semantic graph JSON compiled deterministically to Mermaid instead of continuing the React Flow/ELK experiment.
- Defined a new starter boundary: the prepared repository fetches and displays bounded GitHub repository context, while Backboard graph generation, Mermaid rendering, clickable architecture nodes, and PNG export remain visible live-build work.
- Added `STARTER_SPEC.md` with the exact repository context contract, safety limits, fixture requirements, deferred features, and acceptance checks.
- Recorded a bounded R-CLI starter rebuild prompt in `PROMPTS.md`.
- The current folder has no commits and no configured Git remote. A public GitHub push must wait until the rebuilt starter passes tests and the destination repository is confirmed.

### Turn 5 — Starter kit implemented directly in Codex

- The team chose to build the prepared starter directly and reserve R-CLI for timed rehearsal and evaluation of the live prompts.
- Removed the React Flow/ELK experiment from the application and dependencies.
- Added a server-only GitHub collector for public repositories. It fetches metadata, the default-branch recursive tree, README, and bounded high-signal source excerpts.
- Added deterministic filtering for dependencies, generated output, binaries, lockfiles, oversized files, and low-signal test/fixture paths.
- Added directory-diversity limits and architecture-keyword scoring so selected evidence covers multiple subsystems instead of over-representing one folder.
- Added the validated `RepositoryContext` contract with exact repository paths, source excerpts, GitHub URLs, counts, warnings, collection source, and timestamps.
- Added explicit limits: 2,000 retained tree entries, 12 excerpts, 6,000 characters per excerpt, and 50,000 excerpt characters total.
- Added optional server-only `GITHUB_TOKEN` support through `.env.local` and `.env.example`. No token is returned to or embedded in browser code.
- Rebuilt the UI as a polished repository inspector with metadata, path filtering, source excerpt tabs, README preview, formatted JSON, copy action, and a visible live-build handoff explanation.
- Added a deterministic offline fixture that exercises the same contract as live GitHub responses.
- Preinstalled Zod and Mermaid for the later live-build checkpoints. Mermaid is pinned to `11.17.2`; the dependency audit was remediated to zero known vulnerabilities.
- Added focused GitHub collector and schema tests. Automated tests use injected mock responses and never call GitHub.
- Browser QA passed for both the offline fixture and live collection of `https://github.com/ahmedkhaleel2004/gitdiagram`.
- Final validation passed: 3 test files and 10 tests; production TypeScript/Vite build; `npm audit --omit=dev` after remediation reports zero vulnerabilities.
- The starter remains uncommitted and has no Git remote. The next action is a user review followed by creation/connection of the intended GitHub repository and a clean starter checkpoint.

### UI review — simplified GitCharts landing structure

- Reworked the landing page around the reference structure: a small header, centered project statement, one primary GitHub URL form, generous whitespace, and repository information directly below.
- Removed the previous gradients, glass surfaces, oversized rounded containers, colored blobs, pill badges, and decorative loading grid.
- Switched to a white notebook-dot background, black rules, square controls, restrained type, and a single Backboard-blue accent.
- Added the `gitcharts` wordmark and a GitHub icon/link in the header. The published starter URL can be configured with `VITE_STARTER_REPO_URL`; until then it links to GitHub generally.
- Simplified all result views without changing collection behavior: metadata uses rule-separated stats, inspector sections use plain dividers, code uses light neutral panels, and the workshop handoff is an unboxed numbered list.
- Browser QA passed for the empty state and the offline fixture result state at `http://127.0.0.1:5173/`.
- Validation remained green after the UI pass: 3 test files, 10 tests, and a successful production build.
