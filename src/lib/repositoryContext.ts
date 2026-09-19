import { z } from 'zod';

export const repositoryEntrySchema = z.object({
  path: z.string().min(1),
  type: z.enum(['file', 'directory']),
  size: z.number().int().nonnegative().nullable(),
  extension: z.string().nullable(),
});

export const sourceExcerptSchema = z.object({
  path: z.string().min(1),
  content: z.string(),
  truncated: z.boolean(),
  originalCharacters: z.number().int().nonnegative(),
  githubUrl: z.string().url(),
});

export const repositoryContextSchema = z.object({
  repository: z.object({
    owner: z.string().min(1),
    name: z.string().min(1),
    fullName: z.string().min(1),
    url: z.string().url(),
    description: z.string().nullable(),
    defaultBranch: z.string().min(1),
    primaryLanguage: z.string().nullable(),
    stars: z.number().int().nonnegative(),
    updatedAt: z.string().min(1),
  }),
  tree: z.array(repositoryEntrySchema),
  readme: z.string().nullable(),
  excerpts: z.array(sourceExcerptSchema),
  counts: z.object({
    retainedEntries: z.number().int().nonnegative(),
    files: z.number().int().nonnegative(),
    directories: z.number().int().nonnegative(),
    selectedExcerpts: z.number().int().nonnegative(),
    excerptCharacters: z.number().int().nonnegative(),
  }),
  warnings: z.array(z.string()),
  collectedAt: z.string().min(1),
  source: z.enum(['github', 'fixture']),
});

