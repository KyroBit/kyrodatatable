# Quick start

A working, sortable, searchable, paginated table in about ten minutes. No backend needed — a small in-memory array stands in for your API.

The example, reused through every page in these docs: a **Blog Categories** admin screen. Fourteen categories, a mix of active and inactive, created across the last few months — realistic enough that search, sort, and pagination all have something real to do.

## 1. Scaffold a React app

```sh
npm create vite@latest kyro-datatable-demo -- --template react-ts
cd kyro-datatable-demo
npm install
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

(`@kyrobit/datatable` itself isn't on a public registry yet — see [Installation](/guide/installation) for linking it locally.)

## 2. The data

Paste this into `src/categories.ts`:

```ts
// src/categories.ts
export interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
}

export const CATEGORIES: Category[] = [
  { id: '1',  name: 'Web Development',       slug: 'web-development',       is_active: true,  created_at: '2026-01-14' },
  { id: '2',  name: 'AI & Machine Learning', slug: 'ai-machine-learning',   is_active: true,  created_at: '2026-02-03' },
  { id: '3',  name: 'DevOps',                slug: 'devops',                is_active: true,  created_at: '2026-02-11' },
  { id: '4',  name: 'Mobile Development',    slug: 'mobile-development',    is_active: true,  created_at: '2026-02-19' },
  { id: '5',  name: 'Cloud Infrastructure',  slug: 'cloud-infrastructure',  is_active: false, created_at: '2026-03-02' },
  { id: '6',  name: 'Cybersecurity',         slug: 'cybersecurity',         is_active: true,  created_at: '2026-03-15' },
  { id: '7',  name: 'Databases',             slug: 'databases',             is_active: true,  created_at: '2026-03-22' },
  { id: '8',  name: 'UI/UX Design',          slug: 'ui-ux-design',          is_active: true,  created_at: '2026-04-01' },
  { id: '9',  name: 'Product Management',    slug: 'product-management',    is_active: false, created_at: '2026-04-08' },
  { id: '10', name: 'Testing & QA',          slug: 'testing-qa',            is_active: true,  created_at: '2026-04-17' },
  { id: '11', name: 'Career Advice',         slug: 'career-advice',         is_active: false, created_at: '2026-04-25' },
  { id: '12', name: 'Open Source',           slug: 'open-source',           is_active: true,  created_at: '2026-05-03' },
  { id: '13', name: 'Performance',           slug: 'performance',           is_active: true,  created_at: '2026-05-12' },
  { id: '14', name: 'Accessibility',         slug: 'accessibility',         is_active: false, created_at: '2026-05-20' },
]
```

## 3. The page

Replace `src/App.tsx`:

```tsx
// src/App.tsx
import { useDataTable } from '@kyrobit/datatable'
import { DataTable } from '@kyrobit/datatable/mui'
import { CATEGORIES } from './categories'

export default function App() {
  const table = useDataTable({
    data: CATEGORIES, // in-memory — no backend, no fetch functions
    columns: [
      { field: 'name', headerName: 'Name' },
      { field: 'slug', headerName: 'Slug', sortable: false },
      { field: 'is_active', headerName: 'Status', render: (row) => (row.is_active ? 'Active' : 'Inactive') },
      { field: 'created_at', headerName: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
    ],
    getRowId: (row) => row.id,
    initialSort: { field: 'created_at', direction: 'desc' },
    initialPageSize: 5,
  })

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h1>Blog Categories</h1>
      <DataTable api={table} searchPlaceholder="Search categories" />
    </div>
  )
}
```

## 4. Run it

```sh
npm run dev
```

Open the printed `localhost` URL. You should see 5 rows — the initial page size — sorted newest-first by "Created," starting with Accessibility (2026-05-20).

## 5. What to actually try

- **Type "dev" into the search box.** Narrows to Web Development and DevOps as you type.
- **Click the "Name" column header.** Rows re-sort A→Z, click again for Z→A. Click "Created" instead: back to sorting by date. Note "Slug" doesn't respond — it was declared `sortable: false`.
- **Open the pagination control and change the page size, or go to page 2.** 14 categories at page size 5 is 3 pages.

Every one of those interactions is running entirely client-side right now, because `data: CATEGORIES` was passed instead of `fetchRecords` — `useDataTable` filters, sorts, and slices the array in memory. Nothing about `<DataTable/>` or how you interact with it changes based on that; it's an implementation detail of `useDataTable`'s config, not something the renderer or your clicks need to care about.

## 6. Talking to a real backend instead

Swap `data` for `fetchRecords` — a function shaped `(params) => Promise<{ rows, total }>` — and everything else in `App.tsx` is unchanged:

```tsx
import { api } from './api'
import type { FetchParams } from '@kyrobit/datatable'

async function fetchCategories(params: FetchParams) {
  const { data } = await api.get('/admin/blog-categories', {
    params: { q: params.search, sort: params.sort?.field, dir: params.sort?.direction, page: params.page, per_page: params.pageSize },
  })
  return { rows: data.data, total: data.total }
}

const table = useDataTable({
  fetchRecords: fetchCategories, // instead of data: CATEGORIES
  columns,
  getRowId: (row) => row.id,
})
```

For small, fully-loaded lists (a settings page, a handful of team members), `data` avoids a network round-trip on every keystroke or page change.

## Next

Each interaction above gets its own deeper page — what exactly resets what, client vs. server mode's differences, disabling per column, and so on:

- [Searching](/guide/searching) — debouncing, what gets matched, restricting which fields.
- [Sorting](/guide/sorting) — `toggleSort` vs. `setSort`, disabling per column, custom comparisons.
- [Pagination](/guide/pagination) — the 1-indexed page model, what resets it, `total` vs. dataset size.
- [Filtering](/guide/filtering) — the generic `filters`/`setFilters` slot, `applyFilters` in client mode.
- [Grouping](/guide/grouping) — collapse these same 14 categories by status instead of paginating through them.
- [Favorites](/guide/favorites) — save "Active categories" as a one-click filter, on top of Filtering.
- [Installation](/guide/installation) — link the package into a real app.
