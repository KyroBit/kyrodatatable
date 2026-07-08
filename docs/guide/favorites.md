# Favorites (saved filter sets)

Same 14 categories from the [quick start](/guide/quick-start). Someone using this screen filters to "Active" every single day. Favorites is the one-click shortcut for that — click "Add," name it, and it's there next time, saved in the browser, no server round-trip needed to define one.

## Why this isn't part of `useDataTable`

It would be tempting to bolt a `filters` field onto `DataTableApi` and be done with it. The reason it isn't: a filter's *shape* is entirely yours. The Blog Categories screen filters by `{ statuses: string[] }`. A different screen might filter by a date range, or a project type, or three unrelated fields at once. Baking one shape into the core hook means either it's wrong for most screens, or it grows into a generic query-builder nobody asked for. `usePresets<Filters>` sidesteps that by being generic over whatever `Filters` type you hand it — it only ever stores, names, and reorders values of that type; it never inspects them.

That also means `usePresets` doesn't touch your fetch call at all. You already own a `filters` state variable (or you're about to write one) and a `fetchRecords` closure that reads it — Favorites just gives that state variable named, saveable snapshots.

## Define the filter shape

```ts
// still in your component file, not categories.ts — this is UI state, not data
type Filters = { statuses: ('active' | 'inactive')[] }

const EMPTY: Filters = { statuses: [] }

const BUILT_IN = [
  { id: 'all',      name: 'All',      filters: EMPTY },
  { id: 'active',   name: 'Active',   filters: { statuses: ['active'] } },
  { id: 'inactive', name: 'Inactive', filters: { statuses: ['inactive'] } },
]
```

Built-ins ship with the page every time — not user-editable, not deletable, always present at the top of the list. They're just a starting point; most of what people actually save shows up in `presets.custom` instead.

## Make `fetchCategories` filter-aware

One more small change to the function from the quick start — read a `statuses` filter the same way it already reads `groupKey`:

```ts
export async function fetchCategories({ page, pageSize, search, sort, groupKey, statuses }: FetchCategoriesParams & { groupKey?: string; statuses?: string[] }) {
  let rows = ALL_CATEGORIES.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchesGroup = !groupKey || (groupKey === 'active' ? c.is_active : !c.is_active)
    const matchesFilter =
      !statuses?.length || statuses.includes(c.is_active ? 'active' : 'inactive')
    return matchesSearch && matchesGroup && matchesFilter
  })
  // ...unchanged
}
```

## Wire it together

```tsx
import { useDataTable, usePresets } from '@kyrobit/kyro-datatable'
import { FavoritesMenu } from '@kyrobit/kyro-datatable/mui'

const [filters, setFilters] = useState<Filters>(EMPTY)
const presets = usePresets<Filters>('blog-categories', BUILT_IN)

const fetchRecords = useCallback(
  (params: FetchCategoriesParams) => fetchCategories({ ...params, statuses: filters.statuses }),
  [filters],
)

const table = useDataTable<Category, Field>({ columns, fetchRecords, getRowId: (r) => r.id })
```

`fetchRecords` is a new function reference every time `filters` changes — `useCallback`'s dependency array sees to that. `useDataTable` re-runs its fetch effect whenever the `fetchRecords` *reference* changes, so updating `filters` — whether from a preset or from typing into a filter form directly — refetches automatically. This is the entire integration; nothing on the hook's side needs to know Favorites exists.

## Render the menu

```tsx
function summarize(f: Filters) {
  return f.statuses.length === 0 ? 'No filters' : `Status: ${f.statuses.join(', ')}`
}

const activePresetId = useMemo(
  () => presets.all.find((p) => filtersEqual(p.filters, filters))?.id ?? null,
  [presets.all, filters],
)

<FavoritesMenu
  presets={presets}
  activeId={activePresetId}
  currentFilters={filters}
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
  onApply={setFilters}
/>
```

`filterEditor` is the one genuinely custom piece — the checkboxes, date pickers, or dropdowns someone fills in while saving or editing a favorite. Everything around it (the popover, the list, Add/Edit/Delete, reordering) is built in and identical regardless of what `Filters` actually contains.

`activeId` isn't tracked by `usePresets` either, for the same reason `filters` isn't: "which preset currently matches" is a derived value, computed by comparing `filters` against every preset's stored filters with your own equality check (`filtersEqual` above — for `{ statuses: string[] }`, order-independent array equality; for a different `Filters` shape, a different comparison).

## What to actually try

1. Click the "Active" toggle (if you're reusing the preset-tabs pattern from the [layout examples](/guide/mui)) or apply the "Active" built-in from the Favorites menu. The table refetches to 10 rows.
2. Click "Add" in the Favorites popover, type "Active + recent" — but first change the filter form to something narrower, then save. It appears in the list immediately, above the built-ins' divider (built-ins render first, then custom ones).
3. **Reload the page.** The custom preset is still there — it's in `localStorage` under `kyro-datatable:presets:blog-categories`, not component state, so a full page reload doesn't lose it. Only clearing that key (or a different `storageKey` argument) resets it.
4. Click the up/down arrows next to it (visible on hover, in the built-in `FavoritesMenu`) to reorder it relative to other custom presets — built-ins never move.

## Next

- [MUI renderer](/guide/mui) / [Bootstrap renderer](/guide/bootstrap) — the full `FavoritesMenu` prop reference.
