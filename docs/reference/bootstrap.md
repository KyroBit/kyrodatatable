# Reference — Bootstrap

`import { ... } from '@kyrobit/kyro-datatable/bootstrap'`

Same props as [MUI](/reference/mui) for both `<DataTable />` and `<FavoritesMenu />` — the two renderers implement an identical contract on purpose, so switching between them (or supporting both) is an import change, not a rewrite. See that page for the full prop tables.

## What's different from the MUI renderer

- No npm dependency at all — plain HTML with Bootstrap's own utility classes (`table`, `form-control`, `btn`, `pagination`, `card`). Your app supplies Bootstrap's CSS; nothing here imports `bootstrap` or `react-bootstrap`.
- Sort indicators are plain characters (`↑` `↓` `↕`), not an icon font.
- `<FavoritesMenu />`'s popover is a plain `position: absolute` card, not Bootstrap's JS `Dropdown`/`Popover` component — so no Bootstrap JavaScript bundle is needed either, just the CSS.
