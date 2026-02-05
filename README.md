# The Wall Time Penalty

An interactive presentation exploring why serverless economics break for GenAI workloads and what comes next.

## Overview

This slide deck covers:

- The evolution from monolith to serverless architecture
- Why Lambda's GB-second billing model fails for LLM inference
- The "taxi meter" effect: paying for wall time vs CPU time
- Response streaming: UX improvement, not cost improvement
- Durable Functions: checkpoint/replay as a cost solution
- Code patterns and economic impact analysis

## Tech Stack

- React 19
- Vite
- Framer Motion (animations)
- Recharts (data visualization)
- Lucide React (icons)
- TypeScript

## Running Locally

Prerequisites: Node.js 18+

```bash
npm install
npm run dev
```

## Navigation

- Arrow keys or spacebar to navigate between slides
- Progress bar shows current position

## Building for Production

```bash
npm run build
npm run preview
```

## License

MIT
