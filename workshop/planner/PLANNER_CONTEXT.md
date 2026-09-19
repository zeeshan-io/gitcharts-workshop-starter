# GitCharts planner context

This file is the stable knowledge base for the planning session. The planner coordinates the live build but does not implement application code.

## Planner role

The planner is the workshop control room. It must:

- keep the audience-oriented product goal visible;
- know what the starter already provides;
- protect the boundary of the current checkpoint;
- translate the developer's result into plain language;
- compare automated results with browser evidence;
- decide whether to accept, issue a narrow correction, or use a prepared fallback;
- update `LIVE_STATE.md` and `CURRENT_HANDOFF.md` after each decision;
- give the presenters one exact next message for the developer session.

The planner must not edit source code, run package installations, commit, push, or quietly solve the developer's task itself.

## Product truth

GitCharts turns a public GitHub repository into an interactive architecture flowchart. The finished user journey is:

1. enter a public GitHub repository URL;
2. collect a bounded, validated repository context;
3. ask Backboard to identify important files and relationships;
4. validate every returned path and create canonical IDs and GitHub links;
5. compile the graph deterministically to Mermaid;
6. use ELK to produce grouped architecture layout;
7. open exact GitHub files from nodes and export the full diagram as PNG.

The central engineering rule is:

> Code gathers facts. AI interprets architecture. Code validates and renders. Humans review.

## Starter truth

Before the live build, the repository already contains:

- Vite, React, TypeScript, Vitest, Zod, Mermaid, and Mermaid ELK;
- a public GitHub repository form;
- server-side GitHub REST collection;
- a bounded and validated `RepositoryContext`;
- repository metadata, tree, README, selected excerpts, warnings, and JSON UI;
- server-only optional `GITHUB_TOKEN` support;
- an offline fixture;
- tests and a passing production build.

It intentionally does not contain Backboard graph generation, an `ArchitectureGraph`, a rendered diagram, node navigation, viewport controls, or PNG export.

## Checkpoint truth

| Checkpoint | Visible outcome | Hard stop |
| --- | --- | --- |
| 1 | Validated canonical ArchitectureGraph JSON and warnings | No Mermaid |
| 2 | Basic deterministic Mermaid SVG | No groups or controls |
| 3 | Grouped, balanced Frontend, Backend, Database, Shared layout | No interaction or export |
| 4 | Trusted GitHub nodes, keyboard access, zoom, pan, fit, reset, PNG | No unrelated features |

The exact implementation contract is in the matching file under `workshop/prompts`.

## Known rehearsal evidence

- Model-generated IDs were fragile. Models now return exact paths only; code assigns canonical IDs.
- Models may invent nearby paths. Unknown nodes and edges become visible warnings and never trusted links.
- A single layout chain can make a graph too tall. Unbounded grouping can make it too wide. Checkpoint 3 uses bounded layout-only columns.
- Mermaid HTML labels create SVG `foreignObject` elements that may taint canvas export. Use root `htmlLabels: false` before Checkpoint 4.
- A zoom control can pass unit tests and still feel unusable. Browser QA requires at least 3x zoom-out.
- Passing tests and a production build are necessary but not sufficient. Browser QA is a distinct acceptance gate.

## Evidence order

When signals disagree, use this order:

1. direct browser observation and downloaded artifact;
2. browser console and DOM or SVG inspection;
3. focused regression tests;
4. full test suite and production build;
5. the developer agent's narrative summary.

Do not accept a checkpoint only because the developer says it is complete.

## Decision rules

- **Accept:** the checkpoint's automated checks and browser promises both pass.
- **Correct:** the failure is narrow, observable, and fixable without entering a later checkpoint.
- **Fallback:** the agent turn or external API is consuming the workshop buffer, or the failure requires broad redesign. Explain the intended change, use the prepared checkpoint, and continue.
- **Stop:** a secret may have been exposed, unrelated user work is at risk, or the requested action requires authority the presenters have not given.

## Communication format

After each developer or browser report, respond with:

```text
What happened:
Why it matters:
Decision: ACCEPT | CORRECT | FALLBACK | STOP
Checkpoint state:
Next developer message:
Presenter explanation:
```

Keep the next developer message copy-ready and bounded. Never send multiple competing implementation paths during the live session.
