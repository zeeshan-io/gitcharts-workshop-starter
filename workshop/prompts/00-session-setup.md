# Prompt 00: inspect and prepare the session

Use this prompt before any code is changed.

```text
We are rehearsing the GitCharts live build from the prepared workshop starter.

Read these files completely before acting:
- workshop/WORKSHOP_GUIDE.md
- README.md
- STARTER_SPEC.md
- the prompt for the checkpoint we are about to implement

Inspect the current source, tests, package.json, and git status. Do not edit files yet.

Report:
1. what the starter already does;
2. what the selected checkpoint will add;
3. what is explicitly out of scope;
4. the files you expect to change;
5. the focused tests and browser checks you will run.

Keep the existing visual design and server-only secret boundary. Do not commit or push. Stop after the plan so the presenters can confirm the scope.
```

For Backboard R-CLI, first run `/skills`, open the **Repo** tab, and load both repository skills. Then invoke `$gitcharts-checkpoint-builder` with this prompt and the chosen checkpoint prompt.
