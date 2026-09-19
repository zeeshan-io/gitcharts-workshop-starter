# GitCharts webinar starter specification

## What attendees receive

The starter is a complete repository-inspection application, not an empty scaffold.
It accepts a public GitHub repository URL, fetches bounded repository facts through
a server-only endpoint, and displays a clean repository summary, file structure,
selected source evidence, and the exact JSON context that a later AI step will use.

The starter deliberately does not call Backboard, infer architecture, render a
flowchart, or export an image. Those are the visible live-build outcomes.

## Starter user journey

1. Paste `https://github.com/owner/repository`.
2. The server validates the URL and requests repository metadata, the default
   branch tree, README, and a bounded set of high-signal text files from GitHub.
3. Deterministic filters exclude binary files, generated output, dependencies,
   lockfiles, and repetitive low-signal files.
4. The UI displays repository metadata, a browsable path list, selected source
   evidence, and raw `RepositoryContext` JSON.
5. A fixture remains available for rehearsal and offline fallback.

## RepositoryContext contract

The response must contain:

- repository owner, name, URL, description, default branch, primary language,
  stars, and last-updated timestamp;
- the bounded repository tree with exact repo-relative paths and file/directory
  type;
- README text when available;
- selected source excerpts with exact paths and explicit truncation metadata;
- collection counts and warnings;
- a source marker of `github` or `fixture`.

The contract must not contain architecture guesses, Mermaid source, layout
coordinates, or model-generated URLs.

## Reliability limits

- Public GitHub repositories only.
- Use an optional server-side `GITHUB_TOKEN`; never expose it to browser code.
- Maximum 2,000 retained tree entries.
- Maximum 12 selected source excerpts.
- Maximum 6,000 characters per excerpt and 50,000 characters total.
- Treat GitHub rate-limit, private/missing repository, truncated-tree, and malformed
  response conditions as explicit user-facing errors or warnings.
- All GitHub URLs used later must be constructed from verified owner, repository,
  branch, and paths.

## Preinstalled webinar dependencies

Install the dependencies needed by the later live build now, not on stage:

- `mermaid` for deterministic diagram rendering;
- `zod` for validating repository and architecture graph contracts.

The starter must not render Mermaid yet. Preinstallation is documented as a
webinar reliability measure.

## Explicitly deferred to the live build

- Backboard API integration.
- Architecture explanation or semantic graph generation.
- The validated `ArchitectureGraph` schema and AI response repair.
- Mermaid compilation and rendering.
- Clickable architecture nodes.
- PNG download.

## Acceptance checks

- Fixture mode works without network access.
- GitHub collection is tested with mocked responses.
- URL parsing, filtering, bounding, and error mapping have focused tests.
- No API token appears in browser output or the built bundle.
- `npm test` and `npm run build` pass.

