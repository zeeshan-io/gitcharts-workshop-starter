export interface ParsedGitHubUrl {
  owner: string;
  repo: string;
  normalizedUrl: string;
}

const GITHUB_HOST = 'github.com';

export function parseGitHubRepositoryUrl(input: string): ParsedGitHubUrl {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error('Enter a public GitHub repository URL.');
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error('Use a full URL like https://github.com/owner/repo.');
  }

  if (url.protocol !== 'https:') {
    throw new Error('GitCharts only accepts HTTPS GitHub repository URLs.');
  }

  if (url.hostname.toLowerCase() !== GITHUB_HOST) {
    throw new Error('Only github.com repository URLs are supported in the MVP.');
  }

  const [owner, repoWithSuffix, ...extra] = url.pathname.split('/').filter(Boolean);
  const repo = repoWithSuffix?.replace(/\.git$/i, '');

  if (!owner || !repo || extra.length > 0) {
    throw new Error('Paste the repository root URL, not a file, branch, or issue URL.');
  }

  return {
    owner,
    repo,
    normalizedUrl: `https://${GITHUB_HOST}/${owner}/${repo}`,
  };
}

export function buildGitHubBlobUrl(params: {
  owner: string;
  repo: string;
  branch: string;
  path: string;
}): string {
  const encodedPath = params.path
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');

  return `https://${GITHUB_HOST}/${params.owner}/${params.repo}/blob/${encodeURIComponent(
    params.branch,
  )}/${encodedPath}`;
}
