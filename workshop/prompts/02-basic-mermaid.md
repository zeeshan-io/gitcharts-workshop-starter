# Prompt 02: deterministic basic Mermaid flowchart

```text
Checkpoint 1 is accepted. Implement Checkpoint 2 only: compile the validated ArchitectureGraph into a basic Mermaid flowchart and render it below the JSON. Do not add category subgraphs, ELK layout, click navigation, zoom, pan, fit, reset, or PNG export yet.

The AI must not generate Mermaid. Add a pure deterministic architectureGraphToMermaid function that:
- starts with flowchart TD;
- emits every validated node using its canonical ID;
- shows the short label and exact repository path;
- emits only validated edges;
- sorts nodes and edges deterministically;
- escapes labels, paths, descriptions, and edge text so repository content cannot break Mermaid syntax;
- never inserts raw HTML or model-provided URLs into Mermaid.

Initialize Mermaid once with startOnLoad false and securityLevel strict. Render the generated definition in a small React component with clear loading and render-error states. Preserve the ArchitectureGraph JSON and warnings above the diagram.

Add focused tests for deterministic output, special-character escaping, empty edges, invalid display text, and a representative multi-node graph. Run focused tests, the full suite, and npm run build. Do not implement later checkpoints, commit, or push. Report files changed and browser QA steps.
```

The teaching point is separation of responsibilities: Backboard proposes meaning, while ordinary code produces predictable renderer syntax.
