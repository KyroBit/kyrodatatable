# Bootstrap renderer

`@kyrobit/kyro-datatable/bootstrap` mirrors `./mui` piece for piece — same [quick start](/guide/quick-start), same `table`, same `DataTable.Root`/`.SearchField`/`.GroupBySelect`/`.Body`/`.Pagination` composition model — drawn with plain HTML and Bootstrap's own utility classes instead: `table table-hover`, `form-control`, `btn btn-outline-secondary`, `pagination`. No `bootstrap` or `react-bootstrap` npm package anywhere in this renderer — your app just needs Bootstrap's CSS loaded globally, the same way it would for any other page using those class names.

## `<DataTable/>`

Swap one import from the quick start's `App.tsx` and everything else is unchanged:

```tsx
import { useDataTable } from '@kyrobit/kyro-datatable'
import { DataTable } from '@kyrobit/kyro-datatable/bootstrap' // was '/mui'
import { CATEGORIES, type Category } from './categories'

const table = useDataTable<Category, 'name' | 'created_at'>({ data: CATEGORIES, columns, getRowId: (r) => r.id })

<DataTable api={table} />
```

Same props, same behavior — search, header-click sort, page changes, all work identically to `./mui`. What differs is only how it's drawn:

- Sort indicators are plain arrow characters (`↑`/`↓`/`↕`) next to the header text, not an MUI icon component.
- The "Group by" control is a native `<select>`.
- Pagination is a Bootstrap `<nav><ul class="pagination">` with Previous/Next and a page-size `<select>`, not `TablePagination`.
- Grouped rows expand via plain conditional rendering, not an animated collapse — Bootstrap's own collapse transition needs its JS bundle, which this renderer deliberately doesn't pull in.

## Composing your own layout

Same pattern as [MUI](/guide/mui) — every piece is also a static property on `DataTable`:

```tsx
import { DataTable } from '@kyrobit/kyro-datatable/bootstrap'

<DataTable.Root api={table}>
  <div className="d-flex justify-content-between mb-2">
    <PresetTabs presets={presets} />
    <DataTable.SearchField placeholder="Search categories" />
  </div>
  <div className="d-flex gap-2 mb-2">
    <FavoritesMenu presets={presets} /* ...see Favorites */ />
    <DataTable.GroupBySelect />
  </div>
  <DataTable.Body onRowClick={(row) => navigate(`/blog-categories/${row.id}/edit`)} />
  <DataTable.Pagination />
</DataTable.Root>
```

## `<FavoritesMenu/>`

```tsx
import { FavoritesMenu } from '@kyrobit/kyro-datatable/bootstrap'

<FavoritesMenu
  presets={presets}
  activeId={activePresetId}
  currentFilters={table.filters ?? EMPTY}
  filterEditor={(value, onChange) => <StatusFilterForm value={value} onChange={onChange} />}
  summarize={(f) => (f.statuses.length ? `Status: ${f.statuses.join(', ')}` : 'No filters')}
  onApply={table.setFilters}
/>
```

The popover here is a plain `<div className="card position-absolute">` anchored under the button with inline positioning — not Bootstrap's JS `Dropdown`/`Popover` component (which needs Popper internally). That's why this renderer needs zero Bootstrap JavaScript, only its CSS.

## Why bother with a second renderer at all

Because the whole point of the state/UI split (see [Introduction](/guide/introduction)) is that this choice shouldn't be expensive. If one internal tool is built on MUI and another on Bootstrap, both get real grouping and Favorites without either one importing a design system it doesn't already use — and if a third tool needs something neither offers, [writing one](/guide/custom-renderer) is a components-only exercise, not a rewrite of state, sorting, or grouping logic.
