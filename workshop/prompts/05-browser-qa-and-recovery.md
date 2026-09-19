# Prompt 05: browser QA and narrow recovery

Run this after each checkpoint, not only at the end.

```text
Use $gitcharts-browser-qa to verify the completed checkpoint in the running browser. First read workshop/WORKSHOP_GUIDE.md and the checkpoint prompt. Do not edit files during the first pass.

Separate the report into:
1. automated checks already passing;
2. browser behavior observed;
3. defects found;
4. a narrow proposed correction.

Do not redesign the app or implement a later checkpoint. If a defect is found, write a focused correction prompt that names the observable failure, preserves the checkpoint boundary, requires a regression test where practical, and reruns focused tests, the full suite, the production build, and the failed browser check.

If browser automation is unavailable, provide a short numbered manual QA checklist and wait for the presenter to report the result.
```

Useful checks by checkpoint:

- Checkpoint 1: validated JSON appears; warnings are understandable; IDs and GitHub links are canonical.
- Checkpoint 2: an SVG flowchart renders and matches the JSON.
- Checkpoint 3: populated groups appear; the graph is centered, readable, and not needlessly wide.
- Checkpoint 4: node navigation, keyboard access, zoom, pan, Fit, Reset, zero `foreignObject` elements, and PNG export all work.
