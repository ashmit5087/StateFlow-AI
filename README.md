# StateFlow AI

StateFlow AI is a production-grade web application for modeling, comparing, and
simulating finite state machines. It includes an animated graph canvas, real-time
Moore and Mealy machine playback, scenario presets, and a polished educational
interface for exploring output timing.

## Tech Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, Radix UI, Framer Motion
- Visualization: React Flow, custom FSM simulation engine
- Backend: Node.js, Express, TypeScript
- Data: Drizzle ORM, PostgreSQL
- Tooling: pnpm workspaces, OpenAPI, Orval, Zod

## Project Structure

```text
artifacts/stateflow-ai/    Main frontend application
artifacts/api-server/      REST API server
artifacts/mockup-sandbox/  Component development sandbox
lib/api-spec/              OpenAPI specification
lib/api-client-react/      Generated React Query API client
lib/api-zod/               Generated Zod schemas
lib/db/                    Database layer and schema exports
scripts/                   Workspace maintenance scripts
```

## Getting Started

```bash
pnpm install
pnpm --filter @workspace/stateflow-ai dev
pnpm --filter @workspace/api-server dev
```

## Build

```bash
pnpm build
```

## Environment

Create an environment file for the API server with:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/stateflow
PORT=3000
```

The frontend can be built and served independently as a static Vite app.
