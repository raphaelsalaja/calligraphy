# Workflow

How to develop, release, and publish Calligraph.

## Development

```sh
git checkout -b my-feature
pnpm dev
```

This starts Turborepo in watch mode — the library rebuilds on changes and the demo site hot-reloads.

## Releasing

### 1. Add a changeset

```sh
pnpm changeset
```

Pick `patch`, `minor`, or `major` and write a short summary. This creates a file in `.changeset/`.

### 2. Commit and push

```sh
git add .
git commit -m "feat: describe your change"
git push
```

### 3. CI opens a version PR

The release workflow detects the pending changeset and opens a **"chore: version packages"** PR. This PR bumps `package.json` and updates `CHANGELOG.md`.

### 4. Merge the version PR

Once merged, the release workflow runs again and:

- Detects no pending changesets
- Compares your version to what's on npm
- Publishes via OIDC (no tokens needed)
- Attaches provenance attestation automatically

### 5. Create a GitHub Release (optional)

```sh
gh release create v1.x.x --title "v1.x.x" --generate-notes
```

## Manual publish

If you ever need to publish without CI:

```sh
pnpm publish-packages
```

## Quick reference

| Action           | Command                  |
| ---------------- | ------------------------ |
| Dev              | `pnpm dev`               |
| Lint             | `pnpm lint`              |
| Build            | `pnpm build`             |
| Add changeset    | `pnpm changeset`         |
| Publish manually | `pnpm publish-packages`  |
| Create release   | `gh release create v1.x.x` |
