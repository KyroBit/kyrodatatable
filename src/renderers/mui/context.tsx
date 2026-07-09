import { createContext, useContext, type ReactNode } from 'react'
import type { DataTableApi } from '../../state/useDataTable.js'

const DataTableContext = createContext<DataTableApi<unknown, string, unknown> | null>(null)

export interface DataTableRootProps<Row, Field extends string, Filters> {
  api: DataTableApi<Row, Field, Filters>
  children: ReactNode
}

/** Makes `api` available to every other piece below it — `<SearchField/>`, `<Body/>`, `<Pagination/>` — without threading it through each one by hand. */
export function DataTableRoot<Row, Field extends string, Filters>({ api, children }: DataTableRootProps<Row, Field, Filters>) {
  return (
    <DataTableContext.Provider value={api as unknown as DataTableApi<unknown, string, unknown>}>
      {children}
    </DataTableContext.Provider>
  )
}

export function useDataTableContext<Row, Field extends string = string, Filters = undefined>(): DataTableApi<Row, Field, Filters> {
  const api = useContext(DataTableContext)
  if (!api) {
    throw new Error('KyroDataTable: this component must be rendered inside <DataTable.Root api={table}> (or <DataTable api={table}/>).')
  }
  return api as unknown as DataTableApi<Row, Field, Filters>
}
