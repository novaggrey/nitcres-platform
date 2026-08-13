# Vercel deployment investigation

Observed URL: https://nitcres.vercel.app/

Observed on 2026-08-13: The root page renders a large plain-text JavaScript bundle beginning with `// server/_core/index.ts` and imports such as `express`, `@trpc/server/adapters/express`, and the bundled Drizzle schema. No NITCRES login page or dashboard UI was rendered, and the browser reported no interactive elements. This strongly indicates that the Vercel deployment is serving a generated/server source artifact or incorrect build output at the root instead of the Vite client application.

The project currently has no `vercel.json` at the repository root. Its package scripts use `vite build` followed by an esbuild server bundle, with output under `dist/public` and `dist/index.js`; Vercel’s default framework/build/output detection may therefore be incompatible unless explicitly configured. This is an observation to verify against Vercel project settings and deployment logs; no deployment action has been taken.
