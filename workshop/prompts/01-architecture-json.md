# Prompt 01: verified architecture JSON with Backboard

This is the first live coding checkpoint. It adds semantic analysis but no diagram.

```text
Implement Checkpoint 1 only: turn the existing validated RepositoryContext into a validated ArchitectureGraph using Backboard. Do not render Mermaid and do not add diagram controls or PNG export.

Keep every secret server-side. Read BACKBOARD_API_KEY from the server environment. Optionally support BACKBOARD_LLM_PROVIDER and BACKBOARD_MODEL_NAME. Add these names, with blank values and safe comments, to .env.example. Never print, return, or commit a real key.

Add a server-only Backboard request using JSON output, memory off, and web search off. The model must return only this model-facing structure:

{
  "nodes": [
    {
      "path": "src/example.ts",
      "label": "Example service",
      "category": "Backend",
      "description": "One concise sentence explaining the file's role."
    }
  ],
  "edges": [
    {
      "sourcePath": "src/example.ts",
      "targetPath": "src/other.ts",
      "label": "imports"
    }
  ]
}

Valid categories are Frontend, Backend, Database, and Shared. Ask for at most 24 nodes and 40 edges. Paths must be copied exactly from RepositoryContext.tree. The model must not generate IDs, GitHub URLs, Mermaid, or layout coordinates.

Treat model output as untrusted. Use Zod for a bounded model-facing schema and a separate strict final ArchitectureGraph schema. On the server:

1. Parse the model JSON.
2. Reject or warn on unknown paths, directory paths, duplicate node paths, and edges whose sourcePath or targetPath is not an accepted node.
3. Sort accepted nodes deterministically by path.
4. Assign application-owned IDs node-001, node-002, and so on.
5. Derive each githubUrl from the verified repository owner, name, default branch, and exact path.
6. Rewrite path-based edges to canonical node IDs.
7. Sort rewritten edges deterministically and assign edge-001, edge-002, and so on.
8. Return only the strict final ArchitectureGraph plus warnings to the browser.

The browser must never receive model-generated IDs or URLs. A model error should produce a clear, safe user-facing message.

Add a Generate architecture action below the existing repository result. Display warnings and formatted ArchitectureGraph JSON. State clearly that no Mermaid diagram is rendered yet.

Add regression tests for:
- valid model JSON becoming canonical graph JSON;
- deterministic IDs and edges for identical input;
- unknown and directory paths being removed or rejected as designed;
- duplicate node paths;
- unknown edge references;
- GitHub URLs derived from verified repository data;
- malformed Backboard JSON and common HTTP errors;
- secrets never appearing in responses.

Run focused tests, the complete test suite, and npm run build. Fix only Checkpoint 1 failures. Do not commit or push. Report files changed, validation results, and manual browser QA steps.
```

## Why this version is reliable

The model explains the architecture using verified paths. Application code owns identifiers, links, limits, ordering, and validation. This avoids the rehearsal failure where a useful model response was rejected because it invented IDs such as `1-entry` and `src/App.tsx`.
