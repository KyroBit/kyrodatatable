import { useDataTableContext } from './context.js'

export interface DataTableSearchFieldProps {
  placeholder?: string
  className?: string
}

export function DataTableSearchField({ placeholder = 'Search…', className }: DataTableSearchFieldProps) {
  const api = useDataTableContext()
  return (
    <input
      type="text"
      className={className ?? 'form-control form-control-sm'}
      style={className ? undefined : { maxWidth: 260 }}
      placeholder={placeholder}
      value={api.search}
      onChange={(e) => api.setSearch(e.target.value)}
    />
  )
}
