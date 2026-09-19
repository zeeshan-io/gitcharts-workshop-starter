# Copy-ready prompt for the webinar slide deck

Give this prompt to the presentation agent together with the current slide deck, this repository, and the checkpoint screenshots.

```text
Update the existing GitCharts webinar presentation so it accurately teaches the project, architecture, and 35-minute live-build journey described in this repository.

Read these sources completely before editing slides:
- workshop/README.md
- workshop/WORKSHOP_GUIDE.md
- workshop/planner/PLANNER_CONTEXT.md
- workshop/planner/LIVE_STATE.md
- workshop/planner/CURRENT_HANDOFF.md
- workshop/prompts/00-planner-session.md
- workshop/prompts/00-developer-session.md
- workshop/prompts/00-session-setup.md
- workshop/prompts/01-architecture-json.md
- workshop/prompts/02-basic-mermaid.md
- workshop/prompts/03-grouped-layout.md
- workshop/prompts/04-interaction-export.md
- workshop/prompts/05-browser-qa-and-recovery.md
- README.md
- STARTER_SPEC.md
- package.json

Use the existing deck's theme when it is coherent. Otherwise use a simple white background, black typography, Backboard blue as the single main accent, subtle notebook dots when useful, and thin black or light-gray rules. Use flat shapes. Do not use gradients, glass effects, oversized rounded cards, decorative blobs, fake AI sparkles, or dense dashboards. Keep text concise and projector-readable. Use at least 32 pt for slide titles and 17 pt for body text. Do not use em dashes, semicolons, or arrow glyphs in slide copy.

The audience is high school hackathon participants. Explain technical ideas clearly without talking down to them. The story is not that AI writes a whole application. The story is that agents become useful when people define boundaries, give them trustworthy context, validate their output, and inspect the real product.

Build only 7 slides. These slides support the live build rather than competing with it. Each slide should contain one strong visual and only the words needed to keep teaching while R-CLI works.

1. GitCharts: From repository to architecture flowchart
   - Combine the problem and promise in one sentence
   - Repositories are hard to understand quickly, so GitCharts turns one public URL into a useful visual map
   - Show the clean starter URL form and a small preview of the finished result

2. What happens in the background
   - Redraw the simple pipeline from WORKSHOP_GUIDE.md as the main visual
   - GitHub URL to bounded facts to RepositoryContext to Backboard to validated ArchitectureGraph to Mermaid and ELK to interactive SVG and PNG
   - Add one short responsibility line: Code gathers facts. AI interprets architecture. Code validates and renders. Humans review.
   - Mention that secrets remain server-side

3. Our prepared starting point
   - The working repository inspector, offline fixture, loading and error states, and validated JSON are already prepared
   - Name the stack compactly: React, TypeScript, Vite, Vitest, Zod, native fetch, Mermaid, ELK, plain CSS
   - Backboard analysis and the diagram are intentionally missing because students build them live
   - Show the starter screenshot, not a wall of technology logos

4. Four visible checkpoints
   - Checkpoint 1: validated Backboard ArchitectureGraph JSON
   - Checkpoint 2: deterministic basic Mermaid flowchart
   - Checkpoint 3: grouped and balanced ELK layout
   - Checkpoint 4: trusted navigation, viewport controls, and PNG export
   - Arrange the supplied checkpoint screenshots as a left-to-right progression
   - Label each screenshot with only the new visible capability

5. Two sessions, one controlled loop
   - Show Planner and Developer as distinct columns with Browser Evidence returning to Planner
   - Planner holds product context, current state, acceptance criteria, fallback decisions, and one bounded handoff
   - Developer implements only that handoff, then reports tests, build, and browser QA needs
   - Planner chooses ACCEPT, CORRECT, FALLBACK, or STOP
   - This slide should remain on screen during longer R-CLI work so presenters can explain each loop as it happens

6. The files and skills carrying our context
   - Show a simple repository tree, not a dense table
   - workshop/WORKSHOP_GUIDE.md explains the project, architecture, timing, and teaching story
   - workshop/planner/PLANNER_CONTEXT.md stores stable planner knowledge
   - workshop/planner/LIVE_STATE.md records current evidence and decisions
   - workshop/planner/CURRENT_HANDOFF.md contains the developer's one next task
   - workshop/prompts contains both session starters, four checkpoint prompts, and browser QA
   - .agents/skills/gitcharts-checkpoint-builder keeps implementation inside one checkpoint
   - .agents/skills/gitcharts-browser-qa verifies visible behavior
   - Show the exact R-CLI usage: `/skills`, choose Repo, load the skills, then invoke `$gitcharts-checkpoint-builder` or `$gitcharts-browser-qa`

7. Real engineering means checking the result
   - Unsafe model IDs became canonical code-owned IDs
   - Invented paths became visible warnings rather than broken links
   - Layout constraints fixed charts that were too wide or too tall
   - SVG-native labels made PNG export reliable
   - Browser evidence improved the zoom range
   - End with the student challenge: build one meaningful extension, test it, and share the diagram plus one engineering decision
   - Frame corrections as the agentic method working, not as embarrassing mistakes

Add concise speaker notes to every slide. Notes must tell the presenter what to explain, the transition to the next slide, and the approximate time. Keep the opening explanation to about 6 minutes. Mark Slides 4, 5, and 6 as reusable holding slides that presenters can return to while R-CLI is working.

Use only verified claims from the supplied files. Do not invent Backboard product capabilities, model names, prices, credit amounts, or performance numbers. Do not imply that memory, RAG, or model switching is part of the GitCharts runtime unless a slide clearly labels it as a broader Backboard capability rather than this implementation.

Deliver:
- the updated editable presentation file;
- a rendered PDF for review;
- a short markdown slide outline with slide number, purpose, visual, and presenter timing.

Before finalizing, render and visually inspect every slide for overflow, tiny text, misaligned objects, stretched images, and accidental overlap. Revise until the deck is clean at 16:9.
```
