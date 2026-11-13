import { createContext, useContext, useState, type ReactNode } from 'react'
import type { DataTableApi } from '@kyrobit/datatable'

const DataTableContext = createContext<DataTableApi<unknown, string, unknown> | null>(null)
export type SelectMode = [on: boolean, setOn: (on: boolean) => void]

const SelectModeContext = createContext<SelectMode>([false, () => {}])

export interface Trail {
  key: string
  ids: string[]
}

export type DrillTrail = [trail: Trail, setTrail: (trail: Trail) => void]

const DrillContext = createContext<DrillTrail>([{ key: '', ids: [] }, () => {}])

export interface DataTableRootProps<Row, Field extends string, Filters> {
  api: DataTableApi<Row, Field, Filters>
  selectMode?: SelectMode
  drill?: DrillTrail
  children: ReactNode
}

/** Makes `api` available to every other piece below it — `<SearchField/>`, `<Body/>`, `<Pagination/>` — without threading it through each one by hand. */
export function DataTableRoot<Row, Field extends string, Filters>({ api, selectMode, drill, children }: DataTableRootProps<Row, Field, Filters>) {
  const own = useState(false)
  const ownDrill = useState<Trail>({ key: '', ids: [] })
  return (
    <DataTableContext.Provider value={api as unknown as DataTableApi<unknown, string, unknown>}>
      <SelectModeContext.Provider value={selectMode ?? own}>
        <DrillContext.Provider value={drill ?? ownDrill}>{children}</DrillContext.Provider>
      </SelectModeContext.Provider>
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

export const useSelectMode = () => useContext(SelectModeContext)

export const useDrillTrail = () => useContext(DrillContext)
