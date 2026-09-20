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
- Mermaid and Mermaid ELK preinstalled for the live-build flowchart checkpoints
- Custom CSS

The React Flow experiment was removed. GitCharts uses AI-generated semantic graph JSON compiled deterministically to Mermaid, with Mermaid's ELK layout package introduced during the grouped-layout checkpoint.

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

The header links to the public workshop starter by default. A fork or workshop variant can override the link by adding this non-secret value to `.env.local`:

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

## Workshop materials

- [`workshop/README.md`](workshop/README.md): map of every workshop document, session prompt, and repository skill
- [`workshop/LIVE_PROMPT_CHEATSHEET.md`](workshop/LIVE_PROMPT_CHEATSHEET.md): the short copy-and-paste sequence for both live R-CLI sessions
- [`workshop/WORKSHOP_GUIDE.md`](workshop/WORKSHOP_GUIDE.md): project explanation, architecture, teaching plan, timing, and definition of done
- [`workshop/prompts`](workshop/prompts): setup, four live-build checkpoints, and browser QA prompts
- [`workshop/planner`](workshop/planner): stable planner knowledge, live state, and the current planner-to-developer handoff
- [`.agents/skills/gitcharts-checkpoint-builder`](.agents/skills/gitcharts-checkpoint-builder): one-checkpoint implementation discipline for R-CLI
- [`.agents/skills/gitcharts-browser-qa`](.agents/skills/gitcharts-browser-qa): observable browser acceptance checks for R-CLI
- [`workshop/SLIDES_PROMPT.md`](workshop/SLIDES_PROMPT.md): copy-ready instructions for regenerating the webinar deck

## Live-build checkpoints

1. **Validated Backboard graph:** turn `RepositoryContext` into canonical `ArchitectureGraph` JSON without trusting model-generated IDs or links.
2. **Basic Mermaid flowchart:** compile validated graph JSON into deterministic, escaped Mermaid.
3. **Grouped ELK layout:** add Frontend, Backend, Database, and Shared subgraphs with a balanced layout.
4. **Interaction and export:** add trusted GitHub navigation, zoom, pan, fit, reset, and full-diagram PNG download.

The starter deliberately stops before Checkpoint 1 so attendees can build every visible capability during the session.
