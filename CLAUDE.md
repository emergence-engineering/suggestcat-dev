# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```sh
# Install dependencies (all workspaces)
pnpm install

# Build all packages (respects dependency order)
pnpm run build

# Watch mode for individual packages
pnpm --filter prosemirror-slash-menu dev
pnpm --filter prosemirror-suggestcat-plugin dev
pnpm --filter prosemirror-slash-menu-react dev
pnpm --filter prosemirror-suggestcat-plugin-react dev

# Run all packages in watch mode (may be buggy)
pnpm run dev-all

# Start the editor demo app (runs on port 3001)
pnpm --filter editor run start

# Lint a specific package
pnpm --filter <package-name> run lint

# Run tests in suggestcat-plugin (only package with actual tests)
pnpm --filter prosemirror-suggestcat-plugin test

# Clean all node_modules
pnpm run clean:modules
```

## Architecture

This is a **pnpm monorepo** with 4 ProseMirror plugin packages (git submodules) and 1 demo app:

### Package Dependency Graph
```
prosemirror-slash-menu (core)
    ↓
prosemirror-slash-menu-react (React wrapper)
    ↓
prosemirror-suggestcat-plugin (core AI features)
    ↓
prosemirror-suggestcat-plugin-react (React wrapper, depends on all above)
    ↓
apps/editor (demo CRA app, depends on all packages)
```

### Packages (`/packages/` - all are git submodules)

- **prosemirror-slash-menu**: Core slash menu plugin for ProseMirror. Provides `SlashMenuPlugin`, keyboard handlers, and menu state management.

- **prosemirror-slash-menu-react**: React component wrapper for the slash menu. Exports `SlashMenuReact` display component.

- **prosemirror-suggestcat-plugin**: Core AI suggestion plugin. Contains `grammarSuggestPlugin` for grammar suggestions and `completePlugin` for AI completions. Uses `@emergence-engineering/fast-diff-merge` for text diffing.

- **prosemirror-suggestcat-plugin-react**: React integration combining slash menu with AI features. Exports `ProsemirrorSuggestcatPluginReact`, prompt commands, and icons.

### Apps (`/apps/`)

- **editor**: Create React App demo showing the plugins in action.

## Important Notes

- **Use pnpm exclusively** - never use npm (avoid committing package-lock.json)
- Submodules in `/packages/` are separate git repos - commit changes inside those folders to their respective repos
- Build order matters: `slash-menu` → `slash-menu-react` → `suggestcat-plugin` → `suggestcat-plugin-react`
- Workspace dependencies use `workspace:*` protocol

## Publishing

```sh
pnpm changeset           # Generate changeset
pnpm changeset version   # Bump versions
pnpm install            # Update lockfile
cd packages/<package>
pnpm publish            # Publish from package root
```