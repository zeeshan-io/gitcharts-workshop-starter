# Prompt 04: trusted interaction and PNG export

```text
Checkpoints 1 through 3 are accepted. Implement Checkpoint 4 only: add trusted file navigation, diagram navigation controls, and PNG download to the grouped Mermaid diagram. Do not change Backboard prompting, ArchitectureGraph schemas, repository collection, or the visual identity.

Security and navigation:
- Keep Mermaid securityLevel strict and root flowchart.htmlLabels false.
- Do not use Mermaid click directives.
- Give each node a deterministic CSS class derived only from its canonical node ID.
- After Mermaid renders, let the React component find those SVG nodes and attach application-owned click and keyboard handlers.
- Open only the validated ArchitectureGraph node githubUrl in a new tab with safe window features.
- Make interactive file nodes keyboard focusable and support Enter and Space.
- Dragging the diagram must not accidentally open a file.

Viewport controls:
- Store Mermaid's original full-diagram SVG viewBox.
- Implement Zoom in, Zoom out, Fit, and Reset by changing the SVG viewBox.
- Support pointer-drag pan with pointer capture and correct SVG coordinate scaling.
- Preserve the current viewBox center while zooming.
- Allow users to zoom out to at least three times the original full-diagram bounds.
- Fit and Reset restore the original full-diagram viewBox.

PNG export:
- Keep htmlLabels false so Mermaid creates SVG-native text and no foreignObject labels.
- Clone the rendered SVG and restore the original full-diagram viewBox before export.
- Assert that the clone contains no foreignObject and show a precise error if it does.
- Serialize the SVG to an object URL, load it into an Image, and draw it to a canvas over a white background.
- Export a readable PNG at about 2x resolution with safe dimension and pixel-count clamps.
- Revoke all temporary object URLs in success and failure paths.
- Export the complete graph, not only the currently zoomed viewport.

Add focused tests for node-class mapping, trusted URL lookup, viewBox math and zoom limits, pointer coordinate conversion, safe export dimensions, and foreignObject detection. Run focused tests, the full suite, and npm run build.

Then perform browser QA: GitHub click and keyboard navigation, zoom in and out, drag pan, Fit, Reset, zero foreignObject elements, and a downloaded full-diagram PNG. Do not commit or push. Report files changed, automated results, and browser QA results separately.
```

This final prompt starts with the fixes discovered during rehearsal, so the live session does not need a second pass for a tainted canvas or a restrictive zoom clamp.
