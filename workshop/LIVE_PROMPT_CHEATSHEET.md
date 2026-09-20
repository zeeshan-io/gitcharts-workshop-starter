# GitCharts live prompt cheat sheet

Keep this file open on the second screen. Paste each message into the session named above it.

## Start once

### Planner R-CLI

```text
Read and follow workshop/prompts/00-planner-session.md completely. Act only as the planner. Do not edit application source code.
```

### Developer R-CLI

First run `/skills`, open **Repo**, and load:

- `gitcharts-checkpoint-builder`
- `gitcharts-browser-qa`

Then paste:

```text
Read and follow workshop/prompts/00-developer-session.md completely. Then follow workshop/planner/CURRENT_HANDOFF.md exactly.
```

## Checkpoint 1: ArchitectureGraph JSON

Skip to Checkpoint 2 if this checkpoint is already accepted.

### Planner R-CLI

```text
Prepare Checkpoint 1 using workshop/prompts/01-architecture-json.md. Update LIVE_STATE.md and CURRENT_HANDOFF.md. Return one exact Developer message.
```

### Developer R-CLI

```text
$gitcharts-checkpoint-builder Read the updated workshop/planner/CURRENT_HANDOFF.md and execute it. Implement Checkpoint 1 only. Stop before Mermaid.
```

### Developer R-CLI after implementation

```text
$gitcharts-browser-qa Verify Checkpoint 1 against workshop/prompts/01-architecture-json.md. Do not edit files on the first pass.
```

### Planner R-CLI after QA

```text
Evaluate Checkpoint 1 using the Developer report and these browser observations:

[PASTE REPORT AND OBSERVATIONS]

Choose ACCEPT, CORRECT, FALLBACK, or STOP. Update LIVE_STATE.md and CURRENT_HANDOFF.md. Return one exact Developer message.
```

## Checkpoint 2: Basic Mermaid flowchart

### Planner R-CLI

```text
Checkpoint 1 is accepted. Prepare Checkpoint 2 using workshop/prompts/02-basic-mermaid.md. Update LIVE_STATE.md and CURRENT_HANDOFF.md. Return one exact Developer message.
```

### Developer R-CLI

```text
$gitcharts-checkpoint-builder Read the updated workshop/planner/CURRENT_HANDOFF.md and execute it. Implement Checkpoint 2 only. Stop before grouped layout.
```

### Developer R-CLI after implementation

```text
$gitcharts-browser-qa Verify Checkpoint 2 against workshop/prompts/02-basic-mermaid.md. Do not edit files on the first pass.
```

### Planner R-CLI after QA

```text
Evaluate Checkpoint 2 using the Developer report and these browser observations:

[PASTE REPORT AND OBSERVATIONS]

Choose ACCEPT, CORRECT, FALLBACK, or STOP. Update LIVE_STATE.md and CURRENT_HANDOFF.md. Return one exact Developer message.
```

## Checkpoint 3: Grouped ELK layout

### Planner R-CLI

```text
Checkpoint 2 is accepted. Prepare Checkpoint 3 using workshop/prompts/03-grouped-layout.md. Update LIVE_STATE.md and CURRENT_HANDOFF.md. Return one exact Developer message.
```

### Developer R-CLI

```text
$gitcharts-checkpoint-builder Read the updated workshop/planner/CURRENT_HANDOFF.md and execute it. Implement Checkpoint 3 only. Stop before interaction and export.
```

### Developer R-CLI after implementation

```text
$gitcharts-browser-qa Verify Checkpoint 3 against workshop/prompts/03-grouped-layout.md. Do not edit files on the first pass.
```

### Planner R-CLI after QA

```text
Evaluate Checkpoint 3 using the Developer report and these browser observations:

[PASTE REPORT AND OBSERVATIONS]

Choose ACCEPT, CORRECT, FALLBACK, or STOP. Update LIVE_STATE.md and CURRENT_HANDOFF.md. Return one exact Developer message.
```

## Checkpoint 4: Interaction and PNG export

### Planner R-CLI

```text
Checkpoint 3 is accepted. Prepare Checkpoint 4 using workshop/prompts/04-interaction-export.md. Update LIVE_STATE.md and CURRENT_HANDOFF.md. Return one exact Developer message.
```

### Developer R-CLI

```text
$gitcharts-checkpoint-builder Read the updated workshop/planner/CURRENT_HANDOFF.md and execute it. Implement Checkpoint 4 only. Do not add unrelated features.
```

### Developer R-CLI after implementation

```text
$gitcharts-browser-qa Verify Checkpoint 4 against workshop/prompts/04-interaction-export.md. Do not edit files on the first pass.
```

### Planner R-CLI after QA

```text
Evaluate Checkpoint 4 using the Developer report and these browser observations:

[PASTE REPORT AND OBSERVATIONS]

Choose ACCEPT, CORRECT, FALLBACK, or STOP. Update LIVE_STATE.md. If accepted, provide the final workshop recap and confirm that no required work remains.
```

## If something fails

### Planner R-CLI

```text
The current checkpoint failed this observable check:

[PASTE FAILURE]

Write one narrow correction handoff. Preserve the current checkpoint boundary and require a regression test plus the failed browser check. Update CURRENT_HANDOFF.md.
```

### Developer R-CLI

```text
$gitcharts-checkpoint-builder Execute the correction in workshop/planner/CURRENT_HANDOFF.md. Fix only the documented defect, then rerun focused tests, the full suite, the build, and the failed browser check.
```
