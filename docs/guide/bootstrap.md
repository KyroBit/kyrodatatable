# Bootstrap renderer

`@kyrobit/kyro-datatable/bootstrap` reads the exact same `DataTableApi` as `./mui` — same [quick start](/guide/quick-start), same `fetchCategories`, same `useDataTable` call — and draws it with plain HTML and Bootstrap's own utility classes: `table table-hover`, `form-control`, `btn btn-outline-secondary`, `pagination`. No `bootstrap` or `react-bootstrap` npm package anywhere in this renderer — your app just needs Bootstrap's CSS loaded globally, the same way it would for any other page using those class names.

## `<DataTable />`

Swap one import from the quick start's `App.tsx` and everything else is unchanged:

```tsx
import { useDataTable } from '@kyrobit/kyro-datatable'
import { DataTable } from '@kyrobit/kyro-datatable/bootstrap' // was '/mui'
import { fetchCategories, type Category } from './categories'

const table = useDataTable<Category, 'name' | 'created_at'>({ columns, fetchRecords: fetchCategories, getRowId: (r) => r.id })

<DataTable api={table} columns={columns} getRowId={(row) => row.id} />
```

Same props, same behavior — type into search, click a header, change page, everything from the [quick start's interaction walkthrough](/guide/quick-start) works identically. What actually differs is only how it's drawn:

- Sort indicators are plain arrow characters (`↑` ascending, `↓` descending, `↕` unsorted) next to the header text, not an MUI icon component.
- The "Group by" control is a native `<select>`, not an MUI `TextField`.
- Pagination is a Bootstrap `<nav><ul class="pagination">` with Previous/Next buttons and a page-size `<select>`, not `TablePagination`.
- Grouped rows expand via plain conditional rendering (`{open && <tr>...</tr>}`), not MUI's `Collapse` — so there's no collapse/expand transition animation, just an instant show/hide. If you want the animation, that's the kind of thing worth forking this renderer for (see [Writing your own renderer](/guide/custom-renderer)) rather than requesting it here — Bootstrap's own collapse transition needs its JS bundle, which this renderer deliberately doesn't pull in.

## `<FavoritesMenu />`

```tsx
import { FavoritesMenu } from '@kyrobit/kyro-datatable/bootstrap'

<FavoritesMenu
  presets={presets}
  activeId={activePresetId}
  currentFilters={filters}
  filterEditor={(value, onChange) => <StatusFilterForm value={value} onChange={onChange} />}
  summarize={(f) => (f.statuses.length ? `Status: ${f.statuses.join(', ')}` : 'No filters')}
  onApply={setFilters}
/>
```

The popover here is a plain `<div className="card position-absolute">` anchored under the button with inline `position: absolute` styling — not Bootstrap's JS `Dropdown` or `Popover` component. That's why this renderer needs zero Bootstrap JavaScript, only its CSS: the positioning is hand-rolled instead of relying on Popper (which Bootstrap's own dropdown component depends on internally).

## Why bother with a second renderer at all

Because the whole point of the state/UI split (see [Introduction](/guide/introduction)) is that this choice shouldn't be expensive. If one internal tool is built on MUI and another on Bootstrap, both get real server-side grouping and Favorites without either one importing a design system it doesn't already use — and if a third tool needs something neither renderer offers, [writing one](/guide/custom-renderer) is a components-only exercise, not a rewrite of pagination, sorting, or grouping logic.
