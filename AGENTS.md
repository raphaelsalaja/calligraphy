# Calligraph — Agent Guidelines

Rules for AI agents working on this package.

## Architecture

Single-file package. One export: `Calligraph`. Keep it that way unless there's a strong reason to split.

```
src/
  index.tsx   # everything lives here
```

## Key internals

- `computeLCS` — standard LCS dynamic programming over two strings, returns `[oldIndex, newIndex][]` pairs
- `Calligraph` — the component. Uses `useState` + render-phase diffing (not `useEffect`) to reconcile character keys when `children` changes
- Character identity is tracked via string keys (`c0`, `c1`, ...) managed by `nextIdRef`
- Entering characters get a drift offset based on position (left-side drifts left, right-side drifts right) via the `drift` prop

## Constraints

- **Client component** — the `"use client"` directive is required. This component uses `useState` and `useRef`.
- **Peer dependencies** — `motion`, `react`, `react-dom`. Do not add these to `dependencies`.
- **Single export** — consumers import `{ Calligraph }` from `"calligraph"`. Don't add default exports.
- **No internal state leaks** — `computeLCS`, key refs, and prev-text tracking are implementation details. Don't export them.

## Build

- Uses `bunchee` for bundling
- Output: `dist/index.js` + `dist/index.d.ts`
- ESM only (`"type": "module"`)

## Style

- Follow existing Biome config (spaces, double quotes, recommended rules)
- No comments explaining obvious code
- Keep JSDoc on the public export for IDE tooltips
