import { FormEvent, useMemo, useState } from 'react';

import './App.css';
import { repositoryContextSchema } from './lib/repositoryContext';
import { parseGitHubRepositoryUrl } from './lib/githubUrl';
import type {
  PreviewState,
  RepositoryContext,
  RepositoryContextResponse,
  SourceExcerpt,
} from './types';

const exampleUrl = 'https://github.com/Backboard-io/Backboard-R-CLI';
const MAX_VISIBLE_PATHS = 250;
const defaultStarterRepositoryUrl = 'https://github.com/zeeshan-io/gitcharts-workshop-starter';
const starterRepositoryUrl = import.meta.env.VITE_STARTER_REPO_URL?.trim() || defaultStarterRepositoryUrl;

function App() {
  const [repositoryUrl, setRepositoryUrl] = useState(exampleUrl);
  const [previewState, setPreviewState] = useState<PreviewState>('empty');
  const [context, setContext] = useState<RepositoryContext | null>(null);
  const [note, setNote] = useState('');
  const [selectedExcerptPath, setSelectedExcerptPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function inspectRepository(useFixture = false) {
    setError(null);

    if (!useFixture) {
      try {
        parseGitHubRepositoryUrl(repositoryUrl);
      } catch (validationError) {
        setPreviewState('empty');
        setError(validationError instanceof Error ? validationError.message : 'Enter a valid GitHub URL.');
        return;
      }
    }

    setPreviewState('analyzing');
    setSelectedExcerptPath(null);

    try {
      const response = await fetch('/api/repository-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(useFixture ? { useFixture: true } : { repositoryUrl }),
      });
      const payload = (await response.json()) as RepositoryContextResponse | { error: string };

      if (!response.ok || 'error' in payload) {
        throw new Error('error' in payload ? payload.error : 'Unable to inspect the repository.');
      }

      const validatedContext = repositoryContextSchema.parse(payload.context) as RepositoryContext;
      setContext(validatedContext);
      setNote(payload.note);
      setSelectedExcerptPath(validatedContext.excerpts[0]?.path ?? null);
      setPreviewState('complete');
    } catch (requestError) {
      setPreviewState('empty');
      setError(requestError instanceof Error ? requestError.message : 'Unable to inspect the repository.');
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void inspectRepository(false);
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="GitCharts home">
          gitcharts
        </a>
        <a className="github-link" href={starterRepositoryUrl} target="_blank" rel="noreferrer">
          <GitHubIcon />
          <span>Starter repository</span>
        </a>
      </header>

      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Workshop starter</p>
          <h1>Inspect a GitHub repository.</h1>
          <p>
            Enter a public repository link to collect its metadata, file structure, README, and a small set of useful
            source files.
          </p>
        </div>

        <form className="repo-form" onSubmit={handleSubmit}>
          <label htmlFor="repositoryUrl">GitHub repository URL</label>
          <div className="repo-input-row">
            <input
              id="repositoryUrl"
              name="repositoryUrl"
              type="url"
              value={repositoryUrl}
              placeholder="https://github.com/owner/repository"
              onChange={(event) => setRepositoryUrl(event.target.value)}
            />
            <button type="submit" disabled={previewState === 'analyzing'}>
              {previewState === 'analyzing' ? 'Fetching…' : 'Inspect'}
            </button>
          </div>
          <div className="form-footer">
            <span>Public repositories only. Tokens remain server-side.</span>
            <button type="button" className="text-button" onClick={() => void inspectRepository(true)}>
              Load offline fixture
            </button>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
        </form>
      </section>

      <section className={`preview preview--${previewState}`} aria-live="polite">
        {previewState === 'empty' ? (
          <EmptyPreview />
        ) : previewState === 'analyzing' ? (
          <AnalyzingPreview />
        ) : context ? (
          <RepositoryInspector
            context={context}
            note={note}
            selectedExcerptPath={selectedExcerptPath}
            onSelectExcerpt={setSelectedExcerptPath}
          />
        ) : null}
      </section>
    </main>
  );
}

function EmptyPreview() {
  return (
    <div className="empty-state">
      <div>
        <p className="empty-index">01</p>
        <h2>Repository information will appear below.</h2>
        <p>
          Start with the example above or load the offline fixture. The flowchart is intentionally left for the live
          build.
        </p>
      </div>
    </div>
  );
}

function AnalyzingPreview() {
  return (
    <div className="analyzing-state">
      <div>
        <p className="loading-line" aria-hidden="true">•••</p>
        <h2>Fetching repository information…</h2>
        <p>Reading metadata, the file tree, README, and a bounded set of high-signal source files.</p>
      </div>
    </div>
  );
}

function RepositoryInspector({
  context,
  note,
  selectedExcerptPath,
  onSelectExcerpt,
}: {
  context: RepositoryContext;
  note: string;
  selectedExcerptPath: string | null;
  onSelectExcerpt: (path: string) => void;
}) {
  const [pathQuery, setPathQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const visibleEntries = useMemo(() => {
    const normalizedQuery = pathQuery.trim().toLowerCase();
    return context.tree
      .filter((entry) => !normalizedQuery || entry.path.toLowerCase().includes(normalizedQuery))
      .slice(0, MAX_VISIBLE_PATHS);
  }, [context.tree, pathQuery]);
  const selectedExcerpt =
    context.excerpts.find((excerpt) => excerpt.path === selectedExcerptPath) ?? context.excerpts[0];

  async function copyContext() {
    await navigator.clipboard.writeText(JSON.stringify(context, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="inspector">
      <header className="repository-header">
        <div>
          <p className="source-label">{context.source === 'github' ? 'Live GitHub data' : 'Offline workshop fixture'}</p>
          <h2>{context.repository.fullName}</h2>
          <p>{context.repository.description ?? 'No repository description is available.'}</p>
        </div>
        <a href={context.repository.url} target="_blank" rel="noreferrer">
          Open on GitHub <span aria-hidden="true">↗</span>
        </a>
      </header>

      <div className="stat-grid">
        <Stat label="Default branch" value={context.repository.defaultBranch} />
        <Stat label="Language" value={context.repository.primaryLanguage ?? 'Mixed'} />
        <Stat label="Files retained" value={context.counts.files.toLocaleString()} />
        <Stat label="Source excerpts" value={context.counts.selectedExcerpts.toLocaleString()} />
        <Stat label="Stars" value={context.repository.stars.toLocaleString()} />
      </div>

      <p className="collection-note">{note}</p>

      {context.warnings.length ? (
        <div className="warning-list">
          {context.warnings.map((warning) => (
            <p key={warning}>⚠ {warning}</p>
          ))}
        </div>
      ) : null}

      <div className="inspector-grid">
        <section className="inspector-card structure-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 · Repository structure</p>
              <h3>Verified paths</h3>
            </div>
            <span>{context.counts.retainedEntries.toLocaleString()} retained</span>
          </div>
          <input
            className="path-search"
            type="search"
            value={pathQuery}
            placeholder="Filter paths…"
            onChange={(event) => setPathQuery(event.target.value)}
          />
          <div className="path-list">
            {visibleEntries.map((entry) => (
              <div className={`path-row path-row--${entry.type}`} key={`${entry.type}:${entry.path}`}>
                <span className="path-icon" aria-hidden="true">
                  {entry.type === 'directory' ? '▸' : '·'}
                </span>
                <code>{entry.path}</code>
                <small>{entry.type === 'directory' ? 'DIR' : entry.extension?.toUpperCase() || 'FILE'}</small>
              </div>
            ))}
          </div>
          {context.tree.length > MAX_VISIBLE_PATHS && !pathQuery ? (
            <p className="limit-note">Showing the first {MAX_VISIBLE_PATHS} retained paths. Search to narrow the list.</p>
          ) : null}
        </section>

        <section className="inspector-card evidence-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 · Model evidence</p>
              <h3>Selected source excerpts</h3>
            </div>
            <span>{context.counts.excerptCharacters.toLocaleString()} chars</span>
          </div>
          <div className="excerpt-tabs" role="tablist" aria-label="Selected source excerpts">
            {context.excerpts.map((excerpt) => (
              <button
                key={excerpt.path}
                type="button"
                className={excerpt.path === selectedExcerpt?.path ? 'excerpt-tab excerpt-tab--active' : 'excerpt-tab'}
                onClick={() => onSelectExcerpt(excerpt.path)}
              >
                {excerpt.path}
              </button>
            ))}
          </div>
          <ExcerptPreview excerpt={selectedExcerpt} />
        </section>

        <section className="inspector-card readme-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 · Project intent</p>
              <h3>README preview</h3>
            </div>
          </div>
          <pre>{context.readme?.slice(0, 2_400) ?? 'No README was found for this repository.'}</pre>
        </section>

        <section className="inspector-card json-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">04 · Live-build handoff</p>
              <h3>RepositoryContext JSON</h3>
            </div>
            <button type="button" onClick={() => void copyContext()}>
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
          <pre>{JSON.stringify(context, null, 2)}</pre>
        </section>
      </div>

      <section className="next-stage">
        <div>
          <p className="eyebrow">Workshop next step</p>
          <h3>Turn this context into a flowchart.</h3>
        </div>
        <ol>
          <li><span>1</span> Backboard identifies semantic components and relationships.</li>
          <li><span>2</span> Zod validates every node, edge, group, and repository path.</li>
          <li><span>3</span> Mermaid renders clickable nodes and exports the result as PNG.</li>
        </ol>
      </section>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="currentColor"
        d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.19 1.78 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.29-5.27-1.28-5.27-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.71 5.39-5.29 5.68.42.36.79 1.06.79 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"
      />
    </svg>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ExcerptPreview({ excerpt }: { excerpt?: SourceExcerpt }) {
  if (!excerpt) {
    return <p className="missing-evidence">No source excerpts were selected for this repository.</p>;
  }

  return (
    <div className="excerpt-preview">
      <div>
        <code>{excerpt.path}</code>
        <a href={excerpt.githubUrl} target="_blank" rel="noreferrer">
          View file ↗
        </a>
      </div>
      <pre>{excerpt.content}</pre>
      <p>
        {excerpt.truncated ? 'Excerpt was truncated' : 'Complete fetched content'} ·{' '}
        {excerpt.originalCharacters.toLocaleString()} original characters
      </p>
    </div>
  );
}

export default App;
