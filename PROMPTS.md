# Reproducible R-CLI prompt sequence

This file records the exact prompt sequence used to create the prototype. Append the final prompt text and any steering messages after every R-CLI turn.

## Prompt 1 — Plan and scaffold

Read BUILD_PLAN.md completely. We are creating the GitCharts prototype in this empty project.

First inspect the environment and propose the smallest implementation plan that fulfills the documented MVP. Then scaffold a polished local web application with a server-side API boundary, but do not implement GitHub fetching or Backboard analysis yet.

The starter must include:
- a repository URL form;
- a three-state preview area: empty, analyzing, complete;
- four visually distinct lanes for Frontend, Backend, Database, and Shared;
- a diagram area that can later render Mermaid;
- an evidence/details panel for the selected node;
- local fixture data demonstrating the intended result;
- a README with setup instructions;
- tests for any nontrivial starter utilities.

Use a framework and package set that can be installed and run reliably on this Windows machine. Keep the design polished but the dependency count small. Do not place secrets in browser code. Do not add authentication, persistence, deployment, or features outside BUILD_PLAN.md.

Before editing, summarize your proposed stack and file structure and ask for approval.

### Prompt 1 approval / continuation

Read BUILD_PLAN.md, PROMPTS.md, and BUILD_LOG.md completely. The Vite + React + TypeScript starter plan recorded in BUILD_LOG.md is approved. Continue Prompt 1 now and scaffold the polished application exactly as proposed. Do not ask for plan approval again. Do not implement GitHub fetching or Backboard analysis yet. Before installing dependencies or running any non-read-only shell command, show me the exact command and ask for approval.

## Archived Prompt 2 — React Flow experiment

Read BUILD_PLAN.md, BUILD_LOG.md, PROMPTS.md, and the current application completely. The fixture-based starter is working and validated. Implement only the `interactive-canvas` checkpoint; do not add GitHub fetching or Backboard analysis.

Replace the vertical relationship-list placeholder with a large interactive graph canvas inspired by the supplied GitDiagram reference, while keeping GitCharts' existing visual identity. Use `@xyflow/react` for rendering and `elkjs` for deterministic layout because the graph contains grouped nodes with cross-group connections.

Requirements:
- Render Frontend, Backend, Database, and Shared as labeled group containers with distinct subtle tints.
- Render every fixture file as a compact custom node inside its group, showing its label and path.
- Render directional connections with arrow markers and readable relationship labels.
- Use a deterministic top-to-bottom layout that minimizes overlap and edge crossings.
- Add pan, zoom, fit-view, and reset controls. Fit the whole graph when data first loads.
- Keep the canvas readable on a laptop projector and usable at narrower widths.
- Clicking a diagram file node must open its existing `githubUrl` in a new tab. Never construct or guess a URL in the client. If a node has no verified URL, it must not navigate.
- Keep the existing lane cards and evidence panel for explanation; they may sit beside or below the canvas, but the interactive graph must be the primary visualization.
- Preserve the empty, analyzing, complete, validation-error, and API-error behavior.
- Keep all current server boundaries and fixture behavior unchanged.
- Add focused tests for graph-to-canvas conversion, group membership, invalid-edge filtering, deterministic output, and missing-URL behavior.
- Keep dependencies minimal and avoid unrelated redesigns.

Before installing packages or running non-read-only commands, show the exact command and ask for approval. After implementation, run the focused tests and production build, fix failures, and record the results in BUILD_LOG.md.

### Archived Prompt 2 correction — browser QA found missing edges

Browser QA found that the interactive canvas renders 12 React Flow nodes but zero `.react-flow__edge` elements. The browser console reports React Flow error 008 for every relationship: it cannot create the edge because the custom file nodes do not expose source and target handles.

Fix only this runtime rendering defect and the immediately related readability issue:
- Add appropriate React Flow source and target `Handle` elements to the custom file node, using positions that support the top-to-bottom layout.
- Keep the handles visually unobtrusive but present and valid for every file node.
- Confirm all nine fixture relationships render as directional edges with labels and arrow markers.
- After edges render, adjust canvas sizing or fit-view padding only if necessary so the initial fitted graph is legible rather than tiny in a large empty canvas.
- Do not add GitHub fetching, Backboard analysis, new product features, or unrelated redesigns.
- Add or strengthen a test that would fail if custom file nodes cannot participate in both incoming and outgoing edges, to the extent practical without introducing a heavy browser-test dependency.
- Run focused tests and the production build after the fix and record the correction in BUILD_LOG.md.

Before running non-read-only shell commands, show the exact command and ask for approval.

### Archived Prompt 2 execution / continuation

Read PROMPTS.md and execute Prompt 2 — Interactive grouped canvas exactly as written.

## Starter rebuild prompt — repository inspector

Read `STARTER_SPEC.md`, `BUILD_PLAN.md`, `BUILD_LOG.md`, and `PROMPTS.md` completely, then inspect the current application. The current React Flow and ELK canvas was an experiment and is not the webinar starter direction.

Rebuild the current application into the complete GitCharts webinar starter described in `STARTER_SPEC.md`.

Required scope:
- Preserve the polished visual quality, repository URL form, loading/error states, evidence-oriented design, and fixture fallback.
- Remove the React Flow/ELK canvas and their application code. The starter must not display a flowchart.
- Replace the diagram result with a repository-inspector result containing repository metadata, a readable file/path structure, selected source excerpts, collection warnings/counts, and a formatted raw `RepositoryContext` JSON view.
- Implement bounded public GitHub collection behind a server-only endpoint: repository metadata, default branch, recursive tree, README when available, and selected high-signal text-file excerpts.
- Follow every limit and error condition in `STARTER_SPEC.md`.
- Support an optional server-only `GITHUB_TOKEN`. Add `.env.example`; never expose tokens in client code, responses, logs, fixtures, or documentation examples.
- Keep a deterministic fixture that exercises the exact same `RepositoryContext` contract and remains usable without network access.
- Use injected or mockable `fetch` behavior for focused server tests. Do not make live GitHub requests in automated tests.
- Install `mermaid` and `zod` now as explicitly documented webinar dependencies, but do not render Mermaid, call Backboard, create an architecture graph, or implement PNG export.
- Update `README.md` so attendees understand what the starter does, how to configure the optional GitHub token, how to run it, what will be built live, and why Mermaid/Zod are preinstalled.
- Update `BUILD_LOG.md` with the architecture pivot, files changed, commands run, results, and elapsed R-CLI time if available.
- Remove obsolete React Flow/ELK files, tests, imports, and dependencies without disturbing unrelated planning records.

Before editing, state the exact files you expect to add, change, and remove. Then proceed in Accept Edits mode. Before any package-install command, show the exact command and ask for approval. After implementation, ask for approval to run `npm test` and `npm run build`, fix any failures, and report the final test/build results.

## Live Prompt 1 — Backboard architecture graph

Pending until the starter is implemented, pushed, and rehearsed. It will transform the existing `RepositoryContext` into a validated semantic `ArchitectureGraph` through Backboard while leaving visualization unchanged.

## Live Prompt 2 — Mermaid flowchart and PNG

Pending until Live Prompt 1 is stable. It will compile the validated graph into a clickable Mermaid flowchart, add pan/zoom/fit behavior and PNG download, and perform browser QA.
