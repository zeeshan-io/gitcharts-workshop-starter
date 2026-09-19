# GitCharts workshop materials

This folder is the control center for presenters and attendees. Start with [`WORKSHOP_GUIDE.md`](WORKSHOP_GUIDE.md).

## What each document is for

| Path | Who uses it | Purpose |
| --- | --- | --- |
| `WORKSHOP_GUIDE.md` | Presenters and planner | Complete product explanation, architecture, stack, checkpoints, timing, and teaching notes |
| `planner/PLANNER_CONTEXT.md` | Planner session | Stable project truth, known rehearsal lessons, evidence order, and decision rules |
| `planner/LIVE_STATE.md` | Planner session | Mutable checkpoint status, environment readiness, evidence, and timeline |
| `planner/CURRENT_HANDOFF.md` | Planner and developer | The single bounded instruction the developer should execute next |
| `prompts/00-planner-session.md` | Planner session | Copy-ready planner startup prompt |
| `prompts/00-developer-session.md` | Developer session | Copy-ready developer startup prompt |
| `prompts/00-session-setup.md` | Developer session | Read-only inspection and checkpoint planning |
| `prompts/01-architecture-json.md` | Developer session | Backboard graph generation and validation |
| `prompts/02-basic-mermaid.md` | Developer session | First deterministic Mermaid flowchart |
| `prompts/03-grouped-layout.md` | Developer session | Grouped, balanced ELK layout |
| `prompts/04-interaction-export.md` | Developer session | Trusted navigation, viewport controls, and PNG export |
| `prompts/05-browser-qa-and-recovery.md` | Planner or QA turn | Visible acceptance checks and narrow correction workflow |
| `SLIDES_PROMPT.md` | Presentation agent | Seven-slide webinar deck brief aligned with the live workflow |

Root-level references:

- [`../README.md`](../README.md) explains setup and the starter boundary.
- [`../STARTER_SPEC.md`](../STARTER_SPEC.md) defines the prepared repository-inspection contract.
- [`../BUILD_PLAN.md`](../BUILD_PLAN.md) records product promise, architecture, non-goals, and checkpoint plan.
- [`../BUILD_LOG.md`](../BUILD_LOG.md) records the prototype and rehearsal decisions.
- [`../PROMPTS.md`](../PROMPTS.md) is a short index to the current prompt set.

## The repository skills

The skills are committed under `.agents/skills` so R-CLI discovers them as repository skills.

### `gitcharts-checkpoint-builder`

Use this in the developer session. It requires the agent to read the chosen checkpoint, state the boundary, implement only that checkpoint, run focused and complete validation, and report browser QA separately.

```text
$gitcharts-checkpoint-builder Implement workshop/prompts/02-basic-mermaid.md exactly. Stop before Checkpoint 3.
```

### `gitcharts-browser-qa`

Use this after a developer turn or when the visible result looks wrong. It checks the browser promises and creates a narrow evidence-based defect report before any correction.

```text
$gitcharts-browser-qa Verify Checkpoint 2. Do not edit files on the first pass.
```

In R-CLI, run `/skills`, open the **Repo** tab, and load both skills before invoking them.

## Recommended start order

1. Open one session with [`prompts/00-planner-session.md`](prompts/00-planner-session.md).
2. Open a second session with [`prompts/00-developer-session.md`](prompts/00-developer-session.md).
3. Let the developer perform the read-only inspection in `CURRENT_HANDOFF.md`.
4. Bring the developer report back to the planner.
5. Let the planner update `LIVE_STATE.md` and prepare the next handoff.
6. Repeat implementation, browser evidence, and planner decision one checkpoint at a time.
