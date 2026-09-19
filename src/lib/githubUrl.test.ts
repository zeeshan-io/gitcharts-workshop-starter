import { describe, expect, it } from 'vitest';

import { buildGitHubBlobUrl, parseGitHubRepositoryUrl } from './githubUrl';

describe('parseGitHubRepositoryUrl', () => {
  it('normalizes a repository URL', () => {
    expect(parseGitHubRepositoryUrl(' https://github.com/owner/repo.git ')).toEqual({
      owner: 'owner',
      repo: 'repo',
      normalizedUrl: 'https://github.com/owner/repo',
    });
  });

  it('rejects non-root GitHub URLs', () => {
    expect(() => parseGitHubRepositoryUrl('https://github.com/owner/repo/blob/main/src/App.tsx')).toThrow(
      /repository root/i,
    );
  });

  it('rejects unsupported hosts', () => {
    expect(() => parseGitHubRepositoryUrl('https://gitlab.com/owner/repo')).toThrow(/github\.com/i);
  });
});

describe('buildGitHubBlobUrl', () => {
  it('encodes branch and path segments without allowing the model to construct URLs', () => {
    expect(
      buildGitHubBlobUrl({
        owner: 'acme',
        repo: 'shop',
        branch: 'feature/read me',
        path: 'src/pages/Product Grid.tsx',
      }),
    ).toBe('https://github.com/acme/shop/blob/feature%2Fread%20me/src/pages/Product%20Grid.tsx');
  });
});
