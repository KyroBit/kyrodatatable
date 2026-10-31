import { useState, type ChangeEvent, type KeyboardEvent, type ReactNode } from 'react'
import { Box, IconButton, InputAdornment, TextField, Tooltip } from '@kyrobit/kyroui'
import { useDataTableContext } from './context.js'
import { CloseIcon, SearchIcon } from './icons.js'

export interface DataTableSearchFieldProps {
  placeholder?: string
  width?: number | string
  /** Render the field open from the start instead of behind its icon. */
  alwaysOpen?: boolean
  /** Sits at the field's end, after the clear button — the table puts its filter button here. */
  endAdornment?: ReactNode
}

/**
 * Search bound to `api.search`. Collapsed to its icon until asked for, so a toolbar
 * spends its width on the table rather than on an empty box.
 */
export function DataTableSearchField({ placeholder = 'Search', width, alwaysOpen, endAdornment }: DataTableSearchFieldProps) {
  const api = useDataTableContext()
  const [open, setOpen] = useState(false)

  const expanded = alwaysOpen || open || Boolean(api.search)

  if (!expanded) {
    return (
      <Tooltip title={placeholder}>
        <IconButton
          className="search-toggle"
          size="large"
          onClick={() => setOpen(true)}
          aria-label={placeholder}
        >
          <SearchIcon fontSize="medium" />
        </IconButton>
      </Tooltip>
    )
  }

  const collapse = () => {
    api.setSearch('')
    setOpen(false)
  }

  return (
    <Box sx={{ width: width ?? { xs: '100%', sm: 280 } }}>
      <TextField
        size="small"
        fullWidth
        autoFocus={!alwaysOpen}
        placeholder={placeholder}
        value={api.search}
        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => api.setSearch(e.target.value)}
        onBlur={() => !api.search && setOpen(false)}
        inputProps={{ onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => e.key === 'Escape' && collapse() }}
        className="search-field"
        startAdornment={(
          <InputAdornment position="start">
            <SearchIcon fontSize="medium" sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        )}
        endAdornment={api.search || endAdornment ? (
          <InputAdornment position="end">
            {api.search ? (
              <IconButton size="small" onClick={collapse} aria-label="Clear search">
                <CloseIcon fontSize="small" />
              </IconButton>
            ) : null}
            {endAdornment}
          </InputAdornment>
        ) : undefined}
      />
    </Box>
  )
}
