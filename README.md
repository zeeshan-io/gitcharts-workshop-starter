# GitCharts Workshop Starter

GitCharts is a workshop project for turning a public GitHub repository into an understandable architecture flowchart. This branch is the prepared starter: it collects trustworthy repository evidence and stops immediately before the AI and visualization work that participants build live.

## What the starter does

1. Accepts a public GitHub repository root URL.
2. Calls a server-only Vite development endpoint.
3. Fetches repository metadata, the default-branch tree, README, and selected source excerpts from the GitHub API.
4. Filters and bounds the result so an AI model is never given an entire uncontrolled repository.
5. Validates and displays the resulting `RepositoryContext`, including exact paths and GitHub links.
6. Provides an offline fixture for rehearsals, workshops, and rate-limit failures.

The starter does **not** call Backboard, infer architecture, render Mermaid, or export PNG files. Those are the live-build checkpoints.

## Stack

- Vite, React, and TypeScript
- Vitest
- Zod for runtime contracts
- Mermaid preinstalled for the live-build flowchart checkpoint
- Custom CSS

React Flow and ELK were evaluated during prototyping and intentionally removed. GitCharts will use AI-generated semantic graph JSON compiled deterministically to Mermaid.

## Setup

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

The GitHub API works without authentication for light testing. For a higher rate limit, copy `.env.example` to `.env.local` and add a fine-grained public-repository read token:

```text
GITHUB_TOKEN=your_token_here
```

The token is read only by the Vite server plugin. It is never included in browser code or API responses. Do not prefix it with `VITE_`, because Vite exposes variables with that prefix to the browser.

After publishing the workshop starter, the header's GitHub link can point to it by adding this non-secret value to `.env.local`:

```text
VITE_STARTER_REPO_URL=https://github.com/your-account/your-starter-repo
```

## Validation

```bash
npm test
npm run build
```

Automated GitHub collector tests use an injected mock `fetch`; they never consume network requests or GitHub rate limits.

## Prepared reliability limits

- Public GitHub repositories only
- 2,000 retained tree entries
- 12 selected source excerpts
- 6,000 characters per excerpt
- 50,000 excerpt characters total
- Generated output, dependencies, binaries, lockfiles, and repetitive low-signal paths are excluded

## Live-build checkpoints

1. **Backboard architecture graph:** send `RepositoryContext` to a JSON-capable model, validate semantic groups/nodes/edges, and reject nonexistent repository paths.
2. **Mermaid flowchart:** compile validated graph JSON into Mermaid, add clickable GitHub nodes, pan/zoom/fit controls, and PNG download.

The numbered prompts will live in `PROMPTS.md`, and completed checkpoint branches will provide workshop fallbacks.
