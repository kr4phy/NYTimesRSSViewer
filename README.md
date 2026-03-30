# NYTimes RSS Viewer

A Chrome Extension (Manifest V3) built with Svelte 5, Vite, and CRXJS to browse New York Times RSS feeds by section.

## Features

- Section-based RSS feed loading from NYTimes endpoints
- Popup-first UI with expandable feed cards
- Dark mode toggle
- Category badges and article metadata display

## Tech Stack

- Bun runtime and package manager
- Svelte 5
- Vite 7
- CRXJS Vite plugin
- Tailwind CSS v4
- Skeleton UI

## Prerequisites

- Bun installed locally
- Chrome/Chromium-based browser for extension testing
- GitHub repository access (for release workflow)

## Local Development

Install dependencies:

```bash
bun install
```

Run dev server:

```bash
bun run dev
```

Create production build:

```bash
bun run build
```

Build outputs:

- Extension bundle: dist
- Zip package (from vite-plugin-zip-pack): release

## Project Structure

- src/popup/App.svelte: Popup main UI
- src/popup/components/SectionForm.svelte: Section selector form
- src/popup/services/rss.ts: RSS request and XML parsing logic
- src/popup/types/rss.ts: Section list and shared types
- manifest.config.ts: Extension manifest definition
- vite.config.ts: Vite + CRXJS + packaging plugin setup

## RSS Endpoint

Request format:

```text
https://rss.nytimes.com/services/xml/rss/nyt/{section}.xml
```

## Release Workflow (CRX + GitHub Releases)

This repository includes a GitHub Actions workflow at .github/workflows/release-crx.yml.

What it does:

1. Installs dependencies with Bun
2. Builds the extension via CRXJS using bun run build
3. Packages the built dist directory into a .crx file using bunx crx3
4. Uploads .zip and .crx artifacts to GitHub Releases

Trigger:

- Push a tag matching v*

Example:

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Required GitHub Secret

Set this repository secret before using the workflow:

- CRX_PRIVATE_KEY: PEM private key content used to sign the .crx package

Notes:

- Keep this key stable across releases to preserve extension identity.
- Never commit private keys to the repository.

## AI Usage Scope

AI tools may be used in this project for the following tasks:

- UI and implementation drafting
- Refactoring suggestions and boilerplate generation
- Documentation authoring and editing
- Test and workflow scaffolding

No automatic merge is performed purely from AI output.

## Security and Privacy

- This extension requests host permissions for NYTimes RSS endpoints only.
- Validate any manifest permission changes during code review.
- Do not include secrets in source files or logs.

## License

This project is licensed under the MIT License.

See LICENSE for details.
