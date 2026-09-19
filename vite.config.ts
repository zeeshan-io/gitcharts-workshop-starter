import react from '@vitejs/plugin-react';
import { loadEnv, type Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

import { handleRepositoryContextRequest } from './src/server/repositoryApi.ts';

function repositoryApiPlugin(githubToken?: string): Plugin {
  return {
    name: 'gitcharts-repository-api',
    configureServer(server) {
      server.middlewares.use('/api/repository-context', (request, response) => {
        void handleRepositoryContextRequest(request, response, { githubToken });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), repositoryApiPlugin(environment.GITHUB_TOKEN || process.env.GITHUB_TOKEN)],
    test: {
      globals: true,
      environment: 'node',
    },
  };
});

