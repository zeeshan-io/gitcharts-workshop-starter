import type { RepositoryContext } from '../types.ts';

const repositoryUrl = 'https://github.com/acme-school/study-planner';
const branch = 'main';

function blobUrl(path: string) {
  return `${repositoryUrl}/blob/${branch}/${path}`;
}

export const demoRepositoryContext: RepositoryContext = {
  repository: {
    owner: 'acme-school',
    name: 'study-planner',
    fullName: 'acme-school/study-planner',
    url: repositoryUrl,
    description: 'A small full-stack study planner used as the offline GitCharts workshop fixture.',
    defaultBranch: branch,
    primaryLanguage: 'TypeScript',
    stars: 24,
    updatedAt: '2026-09-18T18:30:00.000Z',
  },
  tree: [
    { path: 'README.md', type: 'file', size: 2120, extension: 'md' },
    { path: 'package.json', type: 'file', size: 912, extension: 'json' },
    { path: 'src', type: 'directory', size: null, extension: null },
    { path: 'src/App.tsx', type: 'file', size: 4280, extension: 'tsx' },
    { path: 'src/components', type: 'directory', size: null, extension: null },
    { path: 'src/components/AssignmentBoard.tsx', type: 'file', size: 3180, extension: 'tsx' },
    { path: 'src/lib', type: 'directory', size: null, extension: null },
    { path: 'src/lib/api.ts', type: 'file', size: 1640, extension: 'ts' },
    { path: 'server', type: 'directory', size: null, extension: null },
    { path: 'server/index.ts', type: 'file', size: 2840, extension: 'ts' },
    { path: 'server/routes', type: 'directory', size: null, extension: null },
    { path: 'server/routes/assignments.ts', type: 'file', size: 3510, extension: 'ts' },
    { path: 'database', type: 'directory', size: null, extension: null },
    { path: 'database/schema.sql', type: 'file', size: 1320, extension: 'sql' },
  ],
  readme:
    '# Study Planner\n\nA small student project for tracking assignments, deadlines, and completion status. The React client talks to an Express API backed by a SQLite database.',
  excerpts: [
    {
      path: 'package.json',
      content:
        '{\n  "scripts": { "dev": "vite", "server": "tsx server/index.ts" },\n  "dependencies": { "express": "latest", "react": "latest", "better-sqlite3": "latest" }\n}',
      truncated: false,
      originalCharacters: 171,
      githubUrl: blobUrl('package.json'),
    },
    {
      path: 'src/App.tsx',
      content:
        "import { AssignmentBoard } from './components/AssignmentBoard';\n\nexport default function App() {\n  return <AssignmentBoard />;\n}",
      truncated: false,
      originalCharacters: 132,
      githubUrl: blobUrl('src/App.tsx'),
    },
    {
      path: 'src/lib/api.ts',
      content:
        "export async function listAssignments() {\n  const response = await fetch('/api/assignments');\n  return response.json();\n}",
      truncated: false,
      originalCharacters: 126,
      githubUrl: blobUrl('src/lib/api.ts'),
    },
    {
      path: 'server/index.ts',
      content:
        "import express from 'express';\nimport assignments from './routes/assignments';\n\nconst app = express();\napp.use('/api/assignments', assignments);",
      truncated: false,
      originalCharacters: 153,
      githubUrl: blobUrl('server/index.ts'),
    },
    {
      path: 'database/schema.sql',
      content:
        'CREATE TABLE assignments (\n  id INTEGER PRIMARY KEY,\n  title TEXT NOT NULL,\n  due_at TEXT NOT NULL,\n  completed INTEGER DEFAULT 0\n);',
      truncated: false,
      originalCharacters: 142,
      githubUrl: blobUrl('database/schema.sql'),
    },
  ],
  counts: {
    retainedEntries: 14,
    files: 8,
    directories: 6,
    selectedExcerpts: 5,
    excerptCharacters: 724,
  },
  warnings: ['Fixture data is being used; no GitHub request was made.'],
  collectedAt: '2026-09-19T12:00:00.000Z',
  source: 'fixture',
};

