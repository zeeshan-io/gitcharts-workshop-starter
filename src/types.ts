export type PreviewState = 'empty' | 'analyzing' | 'complete';

export type RepositoryEntryType = 'file' | 'directory';

export interface RepositoryMetadata {
  owner: string;
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  defaultBranch: string;
  primaryLanguage: string | null;
  stars: number;
  updatedAt: string;
}

export interface RepositoryEntry {
  path: string;
  type: RepositoryEntryType;
  size: number | null;
  extension: string | null;
}

export interface SourceExcerpt {
  path: string;
  content: string;
  truncated: boolean;
  originalCharacters: number;
  githubUrl: string;
}

export interface RepositoryCounts {
  retainedEntries: number;
  files: number;
  directories: number;
  selectedExcerpts: number;
  excerptCharacters: number;
}

export interface RepositoryContext {
  repository: RepositoryMetadata;
  tree: RepositoryEntry[];
  readme: string | null;
  excerpts: SourceExcerpt[];
  counts: RepositoryCounts;
  warnings: string[];
  collectedAt: string;
  source: 'github' | 'fixture';
}

export interface RepositoryContextRequest {
  repositoryUrl?: string;
  useFixture?: boolean;
}

export interface RepositoryContextResponse {
  context: RepositoryContext;
  note: string;
}

