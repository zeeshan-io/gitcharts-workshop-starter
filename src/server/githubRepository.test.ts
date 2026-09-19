import { describe, expect, it, vi } from 'vitest';

import type { RepositoryEntry } from '../types.ts';
import { collectRepositoryContext, selectHighSignalEntries } from './githubRepository.ts';

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
}

function encoded(content: string) {
  return Buffer.from(content, 'utf8').toString('base64');
}

describe('selectHighSignalEntries', () => {
  it('prioritizes architecture files and excludes generated, lock, and binary files', () => {
    const entries: RepositoryEntry[] = [
      { path: 'package-lock.json', type: 'file', size: 20_000, extension: 'json' },
      { path: 'dist/app.js', type: 'file', size: 1000, extension: 'js' },
      { path: 'src/App.tsx', type: 'file', size: 1200, extension: 'tsx' },
      { path: 'server/routes/users.ts', type: 'file', size: 1800, extension: 'ts' },
      { path: 'server/routes/users.test.ts', type: 'file', size: 1500, extension: 'ts' },
      { path: 'database/schema.sql', type: 'file', size: 900, extension: 'sql' },
      { path: 'assets/logo.png', type: 'file', size: 5000, extension: 'png' },
    ];

    const selected = selectHighSignalEntries(entries).map((entry) => entry.path);

    expect(selected).toContain('src/App.tsx');
    expect(selected).toContain('server/routes/users.ts');
    expect(selected).toContain('database/schema.sql');
    expect(selected).not.toContain('package-lock.json');
    expect(selected).not.toContain('dist/app.js');
    expect(selected).not.toContain('assets/logo.png');
  });

  it('keeps source evidence diverse across architecture areas', () => {
    const entries: RepositoryEntry[] = [
      ...Array.from({ length: 7 }, (_, index) => ({
        path: `src/server/storage/store-${index}.ts`,
        type: 'file' as const,
        size: 1000,
        extension: 'ts',
      })),
      { path: 'src/server/generate/prompts.ts', type: 'file', size: 1000, extension: 'ts' },
      { path: 'src/server/generate/graph.ts', type: 'file', size: 1000, extension: 'ts' },
      { path: 'src/components/mermaid-diagram.tsx', type: 'file', size: 1000, extension: 'tsx' },
      { path: 'src/app/api/generate/route.ts', type: 'file', size: 1000, extension: 'ts' },
      ...Array.from({ length: 8 }, (_, index) => ({
        path: `src/features/feature-${index}/index.ts`,
        type: 'file' as const,
        size: 1000,
        extension: 'ts',
      })),
    ];

    const selected = selectHighSignalEntries(entries);

    expect(selected.filter((entry) => entry.path.startsWith('src/server/storage/')).length).toBeLessThanOrEqual(2);
    expect(selected.map((entry) => entry.path)).toEqual(
      expect.arrayContaining([
        'src/server/generate/prompts.ts',
        'src/server/generate/graph.ts',
        'src/components/mermaid-diagram.tsx',
        'src/app/api/generate/route.ts',
      ]),
    );
  });
});

describe('collectRepositoryContext', () => {
  it('collects bounded, verified repository evidence using injected fetch', async () => {
    const sourceByPath: Record<string, string> = {
      'package.json': '{"name":"demo"}',
      'src/App.tsx': 'export default function App() { return null; }',
      'server/index.ts': 'export const server = true;',
    };

    const fetchImpl = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);

      if (url === 'https://api.github.com/repos/acme/demo') {
        return jsonResponse({
          name: 'demo',
          full_name: 'acme/demo',
          html_url: 'https://github.com/acme/demo',
          description: 'Demo repository',
          default_branch: 'main',
          language: 'TypeScript',
          stargazers_count: 7,
          updated_at: '2026-09-19T10:00:00Z',
        });
      }

      if (url.includes('/git/trees/main')) {
        return jsonResponse({
          truncated: false,
          tree: [
            { path: 'package.json', type: 'blob', size: 20 },
            { path: 'src', type: 'tree' },
            { path: 'src/App.tsx', type: 'blob', size: 50 },
            { path: 'server', type: 'tree' },
            { path: 'server/index.ts', type: 'blob', size: 30 },
            { path: 'node_modules/nope.js', type: 'blob', size: 10 },
          ],
        });
      }

      if (url.endsWith('/readme')) {
        return jsonResponse({ encoding: 'base64', content: encoded('# Demo') });
      }

      const matchedPath = Object.keys(sourceByPath).find((filePath) =>
        url.includes(`/contents/${filePath}?ref=main`),
      );
      if (matchedPath) {
        return jsonResponse({ encoding: 'base64', content: encoded(sourceByPath[matchedPath]) });
      }

      return jsonResponse({ message: 'Not Found' }, { status: 404 });
    }) as unknown as typeof fetch;

    const context = await collectRepositoryContext('https://github.com/acme/demo', { fetchImpl });

    expect(context.source).toBe('github');
    expect(context.repository.fullName).toBe('acme/demo');
    expect(context.readme).toBe('# Demo');
    expect(context.tree.map((entry) => entry.path)).not.toContain('node_modules/nope.js');
    expect(context.excerpts.map((excerpt) => excerpt.path)).toEqual(
      expect.arrayContaining(['package.json', 'src/App.tsx', 'server/index.ts']),
    );
    expect(context.excerpts.every((excerpt) => excerpt.githubUrl.startsWith('https://github.com/acme/demo/blob/main/'))).toBe(
      true,
    );
    expect(fetchImpl).toHaveBeenCalled();
  });

  it('maps a GitHub rate-limit response to an actionable error', async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse(
        { message: 'API rate limit exceeded' },
        { status: 403, headers: { 'x-ratelimit-remaining': '0' } },
      ),
    ) as unknown as typeof fetch;

    await expect(collectRepositoryContext('https://github.com/acme/demo', { fetchImpl })).rejects.toMatchObject({
      statusCode: 429,
    });
  });
});
