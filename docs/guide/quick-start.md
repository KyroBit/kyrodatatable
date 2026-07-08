# Quick start

A working, sortable, searchable, paginated table in about ten minutes. No backend needed — a small in-memory array stands in for your API, the same way kyroguard's quick start uses its `memoryAdapter` instead of a real database.

The example, reused through every page in these docs: a **Blog Categories** admin screen. Fourteen categories, a mix of active and inactive, created across the last few months — realistic enough that search, sort, and pagination all have something real to do.

## 1. Scaffold a React app

```sh
npm create vite@latest kyro-datatable-demo -- --template react-ts
cd kyro-datatable-demo
npm install
```

## 2. Install the library and the MUI renderer

```sh
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
```

(`@kyrobit/kyro-datatable` itself isn't on a public registry yet — see [Installation](/guide/installation) for linking it locally. Everything below assumes it's already linked.)

## 3. The data

Paste this into `src/categories.ts`. This is the part a real app replaces with an actual API call — for now it's just an array and a function that filters/sorts/pages it, so the whole demo runs with nothing behind it.

```ts
// src/categories.ts
export interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
}

const ALL_CATEGORIES: Category[] = [
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

export interface FetchCategoriesParams {
  page: number
  pageSize: number
  search: string
  sort: { field: 'name' | 'created_at'; direction: 'asc' | 'desc' } | null
}

export async function fetchCategories({ page, pageSize, search, sort }: FetchCategoriesParams) {
  let rows = ALL_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  )

  if (sort) {
    rows = [...rows].sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1
      return a[sort.field] > b[sort.field] ? dir : -dir
    })
  }

  const total = rows.length
  const start = (page - 1) * pageSize
  const paged = rows.slice(start, start + pageSize)

  // simulate real network latency, so loading states are visible
  await new Promise((r) => setTimeout(r, 200))

  return { rows: paged, total }
}
```

Nothing here is `useDataTable`-specific yet — it's just a plain async function shaped `(params) => Promise<{ rows, total }>`. That shape is the entire contract the hook needs from you.

## 4. The page

Replace `src/App.tsx`:

```tsx
// src/App.tsx
import { useDataTable } from '@kyrobit/kyro-datatable'
import { DataTable } from '@kyrobit/kyro-datatable/mui'
import { fetchCategories, type Category } from './categories'

type Field = 'name' | 'slug' | 'is_active' | 'created_at'

export default function App() {
  const table = useDataTable<Category, Field>({
    columns: [
      { field: 'name', headerName: 'Name' },
      { field: 'slug', headerName: 'Slug', sortable: false },
      { field: 'is_active', headerName: 'Status', render: (row) => (row.is_active ? 'Active' : 'Inactive') },
      { field: 'created_at', headerName: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
    ],
    fetchRecords: fetchCategories,
    getRowId: (row) => row.id,
    initialSort: { field: 'created_at', direction: 'desc' },
    initialPageSize: 5,
  })

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h1>Blog Categories</h1>
      <DataTable
        api={table}
        columns={[
          { field: 'name', headerName: 'Name' },
          { field: 'slug', headerName: 'Slug', sortable: false },
          { field: 'is_active', headerName: 'Status', render: (row) => (row.is_active ? 'Active' : 'Inactive') },
          { field: 'created_at', headerName: 'Created', render: (row) => new Date(row.created_at).toLocaleDateString() },
        ]}
        getRowId={(row) => row.id}
        searchPlaceholder="Search categories"
      />
    </div>
  )
}
```

(`table.columns` and `<DataTable columns>` are the same array on purpose — the hook needs it for sorting, the renderer needs it for drawing. In a real app, define it once above both and pass the same reference to each, as the [reference](/reference/core-api) example does.)

## 5. Run it

```sh
npm run dev
```

Open the printed `localhost` URL. You should see 5 rows — the initial page size — sorted newest-first by "Created," starting with Accessibility (2026-05-20).

## 6. What to actually try

- **Type "dev" into the search box.** The list narrows to Web Development and DevOps as you type — each keystroke triggers a new `fetchCategories` call with `search` set, which reruns the filter.
- **Click the "Name" column header.** Rows re-sort A→Z. Click it again: Z→A. Click "Created" instead: jumps back to sorting by date, ascending.
- **Open the pagination control at the bottom and change the page size, or go to page 2.** With page size 5 and 14 total categories (or fewer once filtered), there are 3 pages — page 2 shows the next 5, this all really refetches, it isn't slicing something already in memory on the client.
- **Watch the brief loading state** between typing and results updating — that's the artificial 200ms delay in `fetchCategories`, standing in for real network latency.

That loop — type, click a header, change page, watch it refetch — is the entire hook. Nothing you did there is renderer-specific: swap `@kyrobit/kyro-datatable/mui` for `/bootstrap` and every one of those interactions behaves identically, because they're all driven by `table`, not by which component drew the table.

## Next

- [Server-side grouping](/guide/grouping) — collapse these same 14 categories by status instead of paginating through them.
- [Favorites](/guide/favorites) — save "Active categories" as a one-click filter.
- [Installation](/guide/installation) — link the real package into a real app instead of `npm install`-ing it.
