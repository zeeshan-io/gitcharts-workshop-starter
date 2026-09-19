# Prompt 03: grouped architecture and balanced ELK layout

```text
Checkpoints 1 and 2 are accepted. Implement Checkpoint 3 only: turn the basic Mermaid graph into a readable grouped architecture diagram. Do not add click navigation, zoom, pan, fit, reset, or PNG export.

Use the already installed @mermaid-js/layout-elk package and Mermaid's external-diagram layout registration. Configure Mermaid with:
- startOnLoad false;
- securityLevel strict;
- htmlLabels false at the root configuration level;
- neutral theme;
- layout elk;
- mergeEdges false;
- NETWORK_SIMPLEX node placement;
- BALANCED alignment;
- deterministic node order where supported.

Compile populated categories in this fixed order: Frontend, Backend, Database, Shared. Emit one subgraph per populated category, use direction TB inside each group, and apply restrained category borders and pale fills. Do not render empty groups.

Keep the overall diagram centered and more vertical than wide. For a large category, split canonically sorted nodes into bounded invisible layout-only chains with roughly six rows maximum per column. Never add a visible or semantic edge merely to influence layout. Do not chain the end of one layout column to the start of the next.

Preserve all validated semantic edges. Keep text readable on a laptop projector without shrinking the entire graph to fit a very wide canvas.

Add tests for fixed category order, empty groups, category styling, deterministic output, bounded layout columns, and no cross-column layout hint. Run focused tests, the full suite, and npm run build. Do not implement later checkpoints, commit, or push. Report files changed and browser QA steps.
```

This prompt includes the rehearsal correction: a single invisible chain made large categories unnecessarily tall, while unrestricted ELK output made other results too wide.
