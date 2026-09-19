import { Buffer } from 'node:buffer';
import path from 'node:path';

import { buildGitHubBlobUrl, parseGitHubRepositoryUrl } from '../lib/githubUrl.ts';
import type { RepositoryContext, RepositoryEntry, SourceExcerpt } from '../types.ts';

export const REPOSITORY_LIMITS = {
  maxTreeEntries: 2_000,
  maxExcerpts: 12,
  maxCharactersPerExcerpt: 6_000,
  maxTotalExcerptCharacters: 50_000,
} as const;

const TEXT_EXTENSIONS = new Set([
  'astro',
  'c',
  'cpp',
  'cs',
  'css',
  'go',
  'graphql',
  'h',
  'html',
  'java',
  'js',
  'json',
  'jsx',
  'kt',
  'md',
  'php',
  'prisma',
  'py',
  'rb',
  'rs',
  'scss',
  'sh',
  'sql',
  'svelte',
  'swift',
  'toml',
  'ts',
  'tsx',
  'vue',
  'yaml',
  'yml',
]);

const TEXT_FILENAMES = new Set([
  'dockerfile',
  'gemfile',
  'makefile',
  'procfile',
  'requirements.txt',
  'cargo.toml',
  'composer.json',
  'go.mod',
  'package.json',
  'pom.xml',
  'pyproject.toml',
]);

const IGNORED_SEGMENTS = new Set([
  '.git',
  '.next',
  '.nuxt',
  '.output',
  '.turbo',
  '.venv',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'target',
  'vendor',
]);

const IGNORED_FILENAMES = new Set([
  'bun.lockb',
  'composer.lock',
  'package-lock.json',
  'pnpm-lock.yaml',
  'poetry.lock',
  'yarn.lock',
]);

interface GitHubRepositoryResponse {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  default_branch: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
}

interface GitHubTreeItem {
  path: string;
  type: 'blob' | 'tree' | 'commit';
  size?: number;
}

interface GitHubTreeResponse {
  tree: GitHubTreeItem[];
  truncated: boolean;
}

interface GitHubContentResponse {
  content?: string;
  encoding?: string;
}

export class GitHubCollectionError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'GitHubCollectionError';
  }
}

interface CollectionOptions {
  githubToken?: string;
  fetchImpl?: typeof fetch;
}

function githubHeaders(token?: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'GitCharts-Workshop-Starter',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function readGitHubError(response: Response): Promise<string | undefined> {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message;
  } catch {
    return undefined;
  }
}

async function requestJson<T>(
  url: string,
  fetchImpl: typeof fetch,
  token?: string,
  optional = false,
): Promise<T | null> {
  const response = await fetchImpl(url, { headers: githubHeaders(token) });

  if (optional && response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const githubMessage = await readGitHubError(response);
    const rateLimited = response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0';

    if (rateLimited) {
      throw new GitHubCollectionError(
        'GitHub API rate limit reached. Add GITHUB_TOKEN to .env or use the workshop fixture.',
        429,
      );
    }

    if (response.status === 404) {
      throw new GitHubCollectionError(
        'Repository not found. Confirm that it exists and is public, then try again.',
        404,
      );
    }

    throw new GitHubCollectionError(
      `GitHub could not provide the repository (${githubMessage ?? `HTTP ${response.status}`}).`,
      502,
    );
  }

  return (await response.json()) as T;
}

function decodeBase64(content: string): string {
  return Buffer.from(content.replace(/\s/g, ''), 'base64').toString('utf8');
}

function getExtension(filePath: string): string | null {
  const extension = path.posix.extname(filePath).slice(1).toLowerCase();
  return extension || null;
}

function isIgnoredPath(filePath: string): boolean {
  const segments = filePath.toLowerCase().split('/');
  return segments.some((segment) => IGNORED_SEGMENTS.has(segment));
}

function isTextCandidate(entry: RepositoryEntry): boolean {
  if (entry.type !== 'file' || isIgnoredPath(entry.path)) {
    return false;
  }

  const filename = path.posix.basename(entry.path).toLowerCase();
  if (IGNORED_FILENAMES.has(filename) || /^readme(?:\.|$)/i.test(filename)) {
    return false;
  }

  if ((entry.size ?? 0) > 150_000) {
    return false;
  }

  return TEXT_FILENAMES.has(filename) || (entry.extension !== null && TEXT_EXTENSIONS.has(entry.extension));
}

function scoreCandidate(entry: RepositoryEntry): number {
  const lowerPath = entry.path.toLowerCase();
  const filename = path.posix.basename(lowerPath);
  const depth = lowerPath.split('/').length;
  let score = Math.max(0, 24 - depth * 3);

  if (TEXT_FILENAMES.has(filename)) score += 80;
  if (/^(index|main|app|server|client|router|routes|schema|config)\./.test(filename)) score += 42;
  if (/^(architecture|graph|mermaid|prompts?|repository-context|source-context)\./.test(filename)) score += 50;
  if (/(^|\/)(src|app|server|api|routes|components|database|db|generate|migrations)(\/|$)/.test(lowerPath)) score += 28;
  if (/(architecture|diagram|generate|graph|mermaid|pipeline|planner|prompt|repository-context|source-context|workflow)/.test(lowerPath)) score += 38;
  if (/(schema|route|controller|service|model|store|database|client)/.test(lowerPath)) score += 18;
  if (/(test|spec|fixture|mock|example)/.test(lowerPath)) score -= 32;

  return score;
}

export function selectHighSignalEntries(entries: RepositoryEntry[]): RepositoryEntry[] {
  const ranked = entries
    .filter(isTextCandidate)
    .map((entry) => ({ entry, score: scoreCandidate(entry) }))
    .sort((left, right) => right.score - left.score || left.entry.path.localeCompare(right.entry.path));
  const selected: RepositoryEntry[] = [];
  const selectedPaths = new Set<string>();
  const directoryCounts = new Map<string, number>();

  for (const { entry } of ranked) {
    const directory = path.posix.dirname(entry.path);
    const limitForDirectory = directory === '.' ? 4 : 2;
    const count = directoryCounts.get(directory) ?? 0;
    if (count >= limitForDirectory) continue;

    selected.push(entry);
    selectedPaths.add(entry.path);
    directoryCounts.set(directory, count + 1);
    if (selected.length === REPOSITORY_LIMITS.maxExcerpts) return selected;
  }

  for (const { entry } of ranked) {
    if (selectedPaths.has(entry.path)) continue;
    selected.push(entry);
    if (selected.length === REPOSITORY_LIMITS.maxExcerpts) break;
  }

  return selected;
}

async function fetchContent(
  apiRoot: string,
  filePath: string,
  branch: string,
  fetchImpl: typeof fetch,
  token?: string,
): Promise<string | null> {
  const encodedPath = filePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  const response = await requestJson<GitHubContentResponse>(
    `${apiRoot}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`,
    fetchImpl,
    token,
    true,
  );

  if (!response?.content || response.encoding !== 'base64') {
    return null;
  }

  return decodeBase64(response.content);
}

export async function collectRepositoryContext(
  repositoryUrl: string,
  options: CollectionOptions = {},
): Promise<RepositoryContext> {
  const { owner, repo, normalizedUrl } = parseGitHubRepositoryUrl(repositoryUrl);
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiRoot = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;

  const repository = await requestJson<GitHubRepositoryResponse>(apiRoot, fetchImpl, options.githubToken);
  if (!repository) {
    throw new GitHubCollectionError('GitHub returned an empty repository response.', 502);
  }

  const treeResponse = await requestJson<GitHubTreeResponse>(
    `${apiRoot}/git/trees/${encodeURIComponent(repository.default_branch)}?recursive=1`,
    fetchImpl,
    options.githubToken,
  );
  if (!treeResponse || !Array.isArray(treeResponse.tree)) {
    throw new GitHubCollectionError('GitHub returned an invalid repository tree.', 502);
  }

  const completeTree: RepositoryEntry[] = treeResponse.tree
    .filter((entry) => (entry.type === 'blob' || entry.type === 'tree') && !isIgnoredPath(entry.path))
    .map((entry) => ({
      path: entry.path,
      type: entry.type === 'tree' ? ('directory' as const) : ('file' as const),
      size: entry.type === 'blob' ? (entry.size ?? null) : null,
      extension: entry.type === 'blob' ? getExtension(entry.path) : null,
    }))
    .sort((left, right) => left.path.localeCompare(right.path));

  const warnings: string[] = [];
  if (treeResponse.truncated) {
    warnings.push('GitHub reported that its recursive tree response was truncated.');
  }
  if (completeTree.length > REPOSITORY_LIMITS.maxTreeEntries) {
    warnings.push(
      `Only the first ${REPOSITORY_LIMITS.maxTreeEntries.toLocaleString()} relevant tree entries were retained.`,
    );
  }

  const tree = completeTree.slice(0, REPOSITORY_LIMITS.maxTreeEntries);
  const readmeResponse = await requestJson<GitHubContentResponse>(
    `${apiRoot}/readme`,
    fetchImpl,
    options.githubToken,
    true,
  );
  const readme = readmeResponse?.content && readmeResponse.encoding === 'base64' ? decodeBase64(readmeResponse.content) : null;

  const candidates = selectHighSignalEntries(tree);
  const settled = await Promise.allSettled(
    candidates.map(async (entry) => ({
      entry,
      content: await fetchContent(
        apiRoot,
        entry.path,
        repository.default_branch,
        fetchImpl,
        options.githubToken,
      ),
    })),
  );

  const excerpts: SourceExcerpt[] = [];
  let remainingCharacters = REPOSITORY_LIMITS.maxTotalExcerptCharacters;

  for (const result of settled) {
    if (result.status === 'rejected') {
      warnings.push('One selected source file could not be fetched and was skipped.');
      continue;
    }

    const { entry, content } = result.value;
    if (content === null || remainingCharacters <= 0) {
      continue;
    }

    const characterLimit = Math.min(REPOSITORY_LIMITS.maxCharactersPerExcerpt, remainingCharacters);
    const excerpt = content.slice(0, characterLimit);
    excerpts.push({
      path: entry.path,
      content: excerpt,
      truncated: excerpt.length < content.length,
      originalCharacters: content.length,
      githubUrl: buildGitHubBlobUrl({
        owner,
        repo,
        branch: repository.default_branch,
        path: entry.path,
      }),
    });
    remainingCharacters -= excerpt.length;
  }

  const files = tree.filter((entry) => entry.type === 'file').length;
  const directories = tree.length - files;

  return {
    repository: {
      owner,
      name: repository.name,
      fullName: repository.full_name,
      url: repository.html_url || normalizedUrl,
      description: repository.description,
      defaultBranch: repository.default_branch,
      primaryLanguage: repository.language,
      stars: repository.stargazers_count,
      updatedAt: repository.updated_at,
    },
    tree,
    readme,
    excerpts,
    counts: {
      retainedEntries: tree.length,
      files,
      directories,
      selectedExcerpts: excerpts.length,
      excerptCharacters: excerpts.reduce((total, item) => total + item.content.length, 0),
    },
    warnings,
    collectedAt: new Date().toISOString(),
    source: 'github',
  };
}
