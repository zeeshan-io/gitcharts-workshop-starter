import { describe, expect, it } from 'vitest';

import { demoRepositoryContext } from '../fixtures/demoRepositoryContext.ts';
import { repositoryContextSchema } from './repositoryContext.ts';

describe('repositoryContextSchema', () => {
  it('accepts the offline fixture used by the starter and live-build fallback', () => {
    expect(repositoryContextSchema.parse(demoRepositoryContext)).toEqual(demoRepositoryContext);
  });

  it('rejects excerpts without verified GitHub URLs', () => {
    const invalid = structuredClone(demoRepositoryContext);
    invalid.excerpts[0].githubUrl = 'not-a-url';

    expect(() => repositoryContextSchema.parse(invalid)).toThrow();
  });
});

