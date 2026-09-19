# GitCharts webinar starter and live-build plan

## Product promise

Paste a public GitHub repository URL. The starter safely collects and displays a bounded repository context. During the webinar, Backboard turns that evidence into a validated architecture graph, which application code renders as a clickable Mermaid flowchart that can be downloaded as a PNG.

## Reliability principle

Code gathers facts. AI interprets architecture. Code validates and renders. Humans review.

## Starter checkpoint

- Public GitHub repositories only.
- Read repository metadata, default branch, README, recursive tree, and selected high-signal source excerpts through a server route.
- Display a repository summary, browsable path list, evidence excerpts, and raw `RepositoryContext` JSON.
- Keep bounded fixture data available for rehearsals and offline fallback.
- Preinstall Mermaid and Zod, but do not add Backboard analysis, flowchart rendering, or PNG export yet.
- Follow the detailed constraints in `STARTER_SPEC.md`.

## Live-build outcome

- Backboard returns validated architecture graph JSON, never renderer-specific markup or layout coordinates.
- Semantic groups are primary; frontend, backend, database, and shared may be retained as node metadata and colors.
- Application code compiles the validated graph into Mermaid.
- Every linked path must exist in the fetched repository tree.
- GitHub URLs are constructed by application code, never by the model.
- Clicking a node opens the exact GitHub blob URL.
- The finished chart supports pan, zoom, fit-to-view, and PNG download.

## Explicit non-goals

- Private repositories or GitHub authentication.
- Cloning whole repositories.
- Displaying every file.
- Deployment, accounts, saved charts, or collaboration.
- Backboard memory, RAG, web search, and tool calling.
- Arbitrary diagram editing.

## Architecture

1. Parse and validate a GitHub URL.
2. Fetch and bound repository facts through a server route.
3. Display the resulting `RepositoryContext` in the starter.
4. Send the compact context to Backboard for semantic grouping and edge inference.
5. Validate returned graph JSON and every evidence path.
6. Construct GitHub blob URLs from verified repository facts.
7. Compile validated graph JSON into Mermaid and render it safely.
8. Export the rendered SVG to PNG on demand.

## Planned live-build checkpoints

1. `architecture-json`: Backboard structured-output route, path-based model schema, canonical graph IDs, verified GitHub links, warnings, and JSON UI. No Mermaid.
2. `basic-mermaid`: deterministic and escaped graph compilation plus the first rendered SVG. No groups or controls.
3. `grouped-layout`: Frontend, Backend, Database, and Shared subgraphs with balanced Mermaid ELK layout. No interaction or export.
4. `interaction-export`: trusted node navigation, keyboard access, zoom, pan, fit, reset, and full-diagram PNG download.

Browser QA follows every checkpoint. A separate planner session owns checkpoint acceptance and writes one bounded handoff for the developer session at a time.

## Demo constraints

- Use a small, conventional full-stack repository for the first live demo.
- Keep cached repository context and graph JSON available as fallbacks.
- Spend no longer than 60–90 seconds debugging during the webinar.
- API keys remain server-side and are never printed or committed.
