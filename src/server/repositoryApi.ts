import type { IncomingMessage, ServerResponse } from 'node:http';

import { demoRepositoryContext } from '../fixtures/demoRepositoryContext.ts';
import type { RepositoryContextRequest, RepositoryContextResponse } from '../types.ts';
import { collectRepositoryContext, GitHubCollectionError } from './githubRepository.ts';

const MAX_BODY_BYTES = 16_384;

function sendJson(response: ServerResponse, statusCode: number, body: unknown) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(body));
}

async function readJsonBody(request: IncomingMessage): Promise<RepositoryContextRequest> {
  let body = '';

  for await (const chunk of request) {
    body += chunk;
    if (body.length > MAX_BODY_BYTES) {
      throw new Error('Request body is too large.');
    }
  }

  return JSON.parse(body || '{}') as RepositoryContextRequest;
}

export async function handleRepositoryContextRequest(
  request: IncomingMessage,
  response: ServerResponse,
  options: { githubToken?: string } = {},
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    sendJson(response, 405, { error: 'Use POST /api/repository-context.' });
    return;
  }

  try {
    const body = await readJsonBody(request);

    if (body.useFixture) {
      const payload: RepositoryContextResponse = {
        context: demoRepositoryContext,
        note: 'Loaded the deterministic workshop fixture without making a network request.',
      };
      sendJson(response, 200, payload);
      return;
    }

    const repositoryUrl = body.repositoryUrl?.trim();
    if (!repositoryUrl) {
      sendJson(response, 400, { error: 'repositoryUrl is required.' });
      return;
    }

    const context = await collectRepositoryContext(repositoryUrl, {
      githubToken: options.githubToken,
    });

    const payload: RepositoryContextResponse = {
      context,
      note: 'Collected bounded repository evidence from the GitHub API. No AI analysis was performed.',
    };
    sendJson(response, 200, payload);
  } catch (error) {
    const statusCode = error instanceof GitHubCollectionError ? error.statusCode : 400;
    sendJson(response, statusCode, {
      error: error instanceof Error ? error.message : 'Unable to inspect the repository.',
    });
  }
}

