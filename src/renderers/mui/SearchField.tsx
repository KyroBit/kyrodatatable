import { TextField, type TextFieldProps } from '@mui/material'
import { useDataTableContext } from './context.js'

export interface DataTableSearchFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  placeholder?: string
}

export function DataTableSearchField({ placeholder = 'Search…', ...rest }: DataTableSearchFieldProps) {
  const api = useDataTableContext()
  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={api.search}
      onChange={(e) => api.setSearch(e.target.value)}
      sx={{ minWidth: 240 }}
      {...rest}
    />
  )
}
