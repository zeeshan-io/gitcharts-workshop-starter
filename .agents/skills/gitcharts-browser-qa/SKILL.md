---
name: gitcharts-browser-qa
description: Verify a completed GitCharts checkpoint in a real browser, distinguish automated success from visible runtime success, and produce a narrow reproducible defect report. Use after any GitCharts checkpoint or when the diagram, navigation, viewport controls, or PNG export looks wrong.
---

# GitCharts browser QA

Browser behavior is part of the acceptance criteria. A passing test suite and production build are not visual proof.

## Workflow

1. Read the implemented checkpoint prompt and identify only its observable promises.
2. Start or use the existing local development server without exposing secrets.
3. Exercise the relevant happy path with the default Backboard R-CLI repository and the offline fixture when applicable.
4. Inspect the visible result, console errors, and relevant DOM or SVG properties.
5. Record observed facts. Do not claim a check passed without seeing it.
6. If browser control is unavailable, return a numbered manual checklist and wait for the presenter's observations.
7. Do not edit code unless the user asks for a fix. When asked, limit the correction to the failing checkpoint boundary.

## Checkpoint checks

- **1:** ArchitectureGraph JSON is visible, canonical IDs are deterministic, links point to verified files, warnings do not crash the page.
- **2:** Mermaid produces an SVG with the expected nodes and edges. JSON and warnings remain visible.
- **3:** Category subgraphs appear only when populated. Text is legible. The result is centered and not excessively wide or tall.
- **4:** Mouse and keyboard node navigation open exact GitHub files. Pan does not click. Zoom out reaches at least 3x. Fit and Reset work. The SVG has zero `foreignObject` elements. PNG contains the full readable diagram.

## Defect report format

```text
Expected:
Observed:
Evidence:
Likely boundary:
Smallest safe correction:
Regression check:
```

## Invocation example

```text
$gitcharts-browser-qa Verify Checkpoint 4. Do not edit files on the first pass.
```
