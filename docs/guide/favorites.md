# Favorites (saved filter sets)

Someone using the Blog Categories table filters down to "Active" categories every day. Favorites is how they save that as a one-click shortcut, instead of re-applying the same filter every visit.

This is deliberately a **separate hook** from `useDataTable` — not a field on `DataTableApi`. A filter's shape is entirely yours (a list of statuses, a date range, a project type — whatever your `fetchRecords` closure reads), so `usePresets` is generic over whatever `Filters` type you define, and you decide how the active preset feeds into your fetch.

## Define your filter shape and built-ins

```ts
type Filters = { statuses: string[] }

const EMPTY: Filters = { statuses: [] }

const BUILT_IN = [
  { id: 'all',      name: 'All',      filters: EMPTY },
  { id: 'active',   name: 'Active',   filters: { statuses: ['active'] } },
  { id: 'inactive', name: 'Inactive', filters: { statuses: ['inactive'] } },
]
```

Built-ins ship with the page — they're not user-editable or deletable. Anything a user adds via the "Add" button is stored separately, per browser, under a key namespaced to whatever string you pass as the first argument.

## Wire it up

```ts
import { usePresets } from '@kyrobit/kyro-datatable'

const presets = usePresets<Filters>('blog-categories', BUILT_IN)
const [filters, setFilters] = useState<Filters>(EMPTY)
```

`presets.all` is built-ins plus saved custom ones, in display order. `presets.create`, `.update`, `.remove`, `.reorder` manage the custom ones — the popover you render calls these for you.

## Feed the active filter into your fetch

`usePresets` only tracks the *saved* filter sets — it doesn't know which one is currently applied, and it doesn't touch your fetch call. That part is a couple lines of your own:

```ts
const fetchRecords = useCallback(
  (params) => fetchCategories({ ...params, status: filters.statuses[0] }),
  [filters],
)

const table = useDataTable({ columns, fetchRecords, getRowId: (r) => r.id })
```

Because `fetchRecords` is a new function reference every time `filters` changes, and `useDataTable` re-runs its fetch effect whenever `fetchRecords` changes, updating `filters` — from a preset, or from your own filter UI — refetches automatically. No extra wiring needed on the hook's side.

## Render the popover

```tsx
import { FavoritesMenu } from '@kyrobit/kyro-datatable/mui'

function summarize(f: Filters) {
  return f.statuses.length === 0 ? 'No filters' : `Status: ${f.statuses.join(', ')}`
}

<FavoritesMenu
  presets={presets}
  activeId={activePresetId}
  currentFilters={filters}
  filterEditor={(value, onChange) => <YourFilterFormHere value={value} onChange={onChange} />}
  summarize={summarize}
  onApply={setFilters}
/>
```

`filterEditor` is the one piece that has to be yours — it's the actual form someone fills in when saving or editing a favorite (checkboxes, a date range, whatever `Filters` holds). Everything around it — the list, add/edit/delete, reordering — is built in.

`activeId` is whatever preset's filters currently match `filters` exactly — compute it with your own equality check, same as computing which preset a `ToggleButtonGroup` should highlight:

```ts
const activePresetId = useMemo(
  () => presets.all.find((p) => filtersEqual(p.filters, filters))?.id ?? null,
  [presets.all, filters],
)
```
