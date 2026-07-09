# Favorites (saved filter sets)

Same 14 categories from the [quick start](/guide/quick-start). Someone using this screen filters to "Active" every single day. Favorites is the one-click shortcut for that — click "Add," name it, and it's there next time, saved in the browser, no server round-trip needed to define one.

## Why this isn't part of `useDataTable`'s built-in filters

`useDataTable` does have a generic `filters`/`setFilters` slot — covered below — but *naming and saving* a filter set is a separate concern from *holding* one, and it's a separate hook, `usePresets`, for the same reason `table.filters` is generic over your own `Filters` type rather than a fixed shape: what counts as "a favorite" varies per screen (a list of statuses here, a date range somewhere else), so `usePresets<Filters>` only ever stores, names, and reorders values of whatever type you give it — it never inspects them.

## Define the filter shape

```ts
type Filters = { statuses: ('active' | 'inactive')[] }

const EMPTY: Filters = { statuses: [] }

const BUILT_IN = [
  { id: 'all',      name: 'All',      filters: EMPTY },
  { id: 'active',   name: 'Active',   filters: { statuses: ['active'] } },
  { id: 'inactive', name: 'Inactive', filters: { statuses: ['inactive'] } },
]
```

Built-ins ship with the page every time — not user-editable, not deletable, always present at the top of the list. Most of what people actually save shows up in `presets.custom` instead.

## Give `useDataTable` the filter type

```tsx
import { useDataTable, usePresets } from '@kyrobit/kyro-datatable'

const table = useDataTable<Category, Field, Filters>({
  data: CATEGORIES, // or fetchRecords — filters work the same in both modes
  columns,
  getRowId: (row) => row.id,
  initialFilters: EMPTY,
})

const presets = usePresets<Filters>('blog-categories', BUILT_IN)
```

The third type parameter on `useDataTable` is `Filters` — pass it once, and `table.filters`/`table.setFilters` are typed to match. In **client mode**, filtering by `statuses` needs one more thing, since the library can't know what your `Filters` shape means without being told:

```ts
const table = useDataTable<Category, Field, Filters>({
  data: CATEGORIES,
  columns,
  getRowId: (row) => row.id,
  initialFilters: EMPTY,
  applyFilters: (row, filters) =>
    filters.statuses.length === 0 || filters.statuses.includes(row.is_active ? 'active' : 'inactive'),
})
```

In **server mode**, there's no `applyFilters` — `table.filters` is simply included in what gets passed to `fetchRecords`/`fetchGroups`, and your function reads it the same way it already reads `search` and `sort`:

```ts
async function fetchCategories(params: FetchParams<Field, Filters>) {
  const { data } = await api.get('/admin/blog-categories', {
    params: { q: params.search, statuses: params.filters?.statuses, sort: params.sort?.field, dir: params.sort?.direction },
  })
  return { rows: data.data, total: data.total }
}
```

Either way, calling `table.setFilters({ statuses: ['active'] })` refetches (or re-filters, in client mode) automatically — it's the same mechanism as `setSearch` or `toggleSort`, not something you wire up by hand.

## Render the menu

```tsx
function summarize(f: Filters) {
  return f.statuses.length === 0 ? 'No filters' : `Status: ${f.statuses.join(', ')}`
}

const activePresetId = useMemo(
  () => presets.all.find((p) => filtersEqual(p.filters, table.filters ?? EMPTY))?.id ?? null,
  [presets.all, table.filters],
)

<FavoritesMenu
  presets={presets}
  activeId={activePresetId}
  currentFilters={table.filters ?? EMPTY}
  filterEditor={(value, onChange) => (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={value.statuses.includes('active')} onChange={(e) =>
          onChange({ statuses: e.target.checked ? [...value.statuses, 'active'] : value.statuses.filter((s) => s !== 'active') })
        } />}
        label="Active"
      />
      {/* same pattern for "inactive" */}
    </FormGroup>
  )}
  summarize={summarize}
  onApply={table.setFilters}
/>
```

`filterEditor` is the one genuinely custom piece — the checkboxes, date pickers, or dropdowns someone fills in while saving or editing a favorite. Everything around it (the popover, the list, Add/Edit/Delete, reordering) is built in and identical regardless of what `Filters` actually contains.

`activeId` isn't tracked by `usePresets` or by `table` either, for the same reason `filters` isn't fixed-shape: "which preset currently matches" is a derived value, computed by comparing `table.filters` against every preset's stored filters with your own equality check (`filtersEqual` above — for `{ statuses: string[] }`, order-independent array equality; for a different `Filters` shape, a different comparison).

## What to actually try

1. Apply the "Active" built-in from the Favorites menu (or call `table.setFilters({ statuses: ['active'] })` yourself). The table narrows to 10 rows.
2. Click "Add" in the Favorites popover, adjust the filter form to something narrower, name it, save. It appears in the list immediately, above the built-ins' divider.
3. **Reload the page.** The custom preset is still there — it's in `localStorage` under `kyro-datatable:presets:blog-categories`, not component state, so a full page reload doesn't lose it. Only clearing that key (or using a different `storageKey` argument) resets it. `table.filters` itself, on the other hand, is plain React state — it resets to `initialFilters` on reload, same as `table.search` resets to `''`. Favorites persisting while the *currently applied* filter doesn't is deliberate: it mirrors how search boxes and filter panels behave everywhere else.
4. Click the up/down arrows next to your saved preset (visible on hover) to reorder it relative to other custom presets — built-ins never move.

## Next

- [MUI renderer](/guide/mui) / [Bootstrap renderer](/guide/bootstrap) — the full `FavoritesMenu` prop reference.
