# Favorites (saved filter sets)

Same 14 categories from the [quick start](/guide/quick-start). Someone using this screen filters to "Active" every single day. Favorites is the one-click shortcut for that — click "Add," name it, and it's there next time, saved in the browser, no server round-trip needed to define one.

Favorites is a separate hook, `usePresets`, used alongside `table.filters`/`table.setFilters` from [Filtering](/guide/filtering) — read that page first if you haven't, since this one assumes filtering is already wired up.

## Define built-in presets

```ts
import { usePresets } from '@kyrobit/datatable'

const EMPTY: Filters = { statuses: [] }

const BUILT_IN = [
  { id: 'all',      name: 'All',      filters: EMPTY },
  { id: 'active',   name: 'Active',   filters: { statuses: ['active'] } },
  { id: 'inactive', name: 'Inactive', filters: { statuses: ['inactive'] } },
]

const presets = usePresets<Filters>('blog-categories', BUILT_IN)
```

Built-ins ship with the page every time — not user-editable, not deletable, always present at the top of the list. Most of what people actually save shows up in `presets.custom` instead. The first argument, `'blog-categories'`, namespaces the `localStorage` key (`kyro-datatable:presets:blog-categories`) — two different tables on the same page need two different keys, or they'd share saved presets with each other.

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

`filterEditor` is the one custom piece — the checkboxes, date pickers, or dropdowns someone fills in while saving or editing a favorite. Everything around it (the popover, the list, Add/Edit/Delete, reordering) is built in and identical regardless of what `Filters` actually contains.

`activeId` isn't tracked by `usePresets` or by `table` either, for the same reason `filters` isn't fixed-shape: "which preset currently matches" is a derived value, computed by comparing `table.filters` against every preset's stored filters with your own equality check (`filtersEqual` above — for `{ statuses: string[] }`, order-independent array equality; for a different `Filters` shape, a different comparison).

## What to actually try

1. Apply the "Active" built-in from the Favorites menu (or call `table.setFilters({ statuses: ['active'] })` yourself). The table narrows to 10 rows.
2. Click "Add" in the Favorites popover, adjust the filter form to something narrower, name it, save. It appears in the list immediately, above the built-ins' divider.
3. **Reload the page.** The custom preset is still there — it's in `localStorage` under `kyro-datatable:presets:blog-categories`, not component state, so a full page reload doesn't lose it. Only clearing that key (or using a different `storageKey` argument) resets it. `table.filters` itself, on the other hand, is plain React state — it resets to `initialFilters` on reload, same as `table.search` resets to `''`. Favorites persisting while the *currently applied* filter doesn't is deliberate: it mirrors how search boxes and filter panels behave everywhere else.
4. Click the up/down arrows next to your saved preset (visible on hover) to reorder it relative to other custom presets — built-ins never move.

## Next

- [MUI renderer](/guide/mui) / [Bootstrap renderer](/guide/bootstrap) — the full `FavoritesMenu` prop reference.
