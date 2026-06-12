# Agent Guide

Before answering any question that involves facts about ANYTHING, you MUST output at least one Read, WebFetch, or WebSearch tool call.
If your first output is text instead of a tool call, you have failed.

GitHub Action - [action.yml](action.yml)

- `src/` is the source directory (single `index.ts` file)
- `dist/` is built by rollup, in `.gitignore`, and pushed to the `release` branch on publish

## Commands

ALWAYS use the `npm run *` command

| Command            | Purpose                                 |
| ------------------ | --------------------------------------- |
| `npm run build`    | Rollup `src/index.ts` → `dist/index.js` |
| `npm run lint`     | ESLint on `src/`                        |
| `npm run prettier` | ALWAYS RUN AFTER EDITING FILES          |
