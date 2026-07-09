# Installation

KyroDataTable isn't published to a public registry — it's linked locally.

## From the library repo

```bash
cd kyro-datatable
bun install
bun run build     # writes dist/ — the linked package resolves from here, not src/
bun link
```

## From the app that uses it

```bash
bun link @kyrobit/kyro-datatable
```

If your app is a Bun workspace (most of ours are), run `bun link` from inside the workspace member that needs it, then `bun install` from the **workspace root** — not from the member's own directory — so the symlink resolves correctly into the shared `node_modules`.

## Peer dependencies

`react` and `react-dom` are required — the state hook is, after all, a hook.

`@mui/material` is an **optional** peer dependency, resolved only if you import `@kyrobit/kyro-datatable/mui`. If you only use `./bootstrap` or write your own renderer, you never install it.

`./bootstrap` needs no npm package at all — it renders plain HTML with Bootstrap's own utility classes (`table`, `btn`, `pagination`, ...). Your app just needs Bootstrap's CSS loaded globally, the same way it would for any other page using those classes.

## After a library change

Since it's linked, not installed from a registry, changes to the library's `src/` aren't visible to consuming apps until you rebuild:

```bash
cd kyro-datatable
bun run build
```

Vite's dev server picks up the rebuilt `dist/` automatically on the next request — no restart needed for most changes.
