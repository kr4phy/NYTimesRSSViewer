# NYTimes RSS Viewer

Browser extension project for browsing NYTimes RSS feeds by section.

## Current Scope

- Popup-first MVP structure
- Section selection UI
- NYTimes RSS fetch and XML parsing

## Run

```bash
bun i
bun run dev
```

## Build

```bash
bun run build
```

## Key Files

- `src/popup/App.svelte`: Popup main view
- `src/popup/components/SectionForm.svelte`: Section selector form
- `src/popup/services/rss.ts`: RSS request and XML parser
- `src/popup/types/rss.ts`: RSS types and API section enum
- `src/popup/services/rss-api.yaml`: RSS API specification reference
- `manifest.config.ts`: Extension manifest configuration

## API Spec Notes

The section list and path format are based on `src/popup/services/rss-api.yaml`.
Request pattern:

```text
https://rss.nytimes.com/services/xml/rss/nyt/{section}.xml
```
