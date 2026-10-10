import { useState } from 'react'
import { Box, ClickAwayListener, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useDataTableContext } from './context.js'
import { SearchIcon } from './icons.js'

export interface DataTableSearchFieldProps {
  placeholder?: string
  width?: number | string
  /** Render the field open from the start instead of behind its icon. */
  alwaysOpen?: boolean
}

/**
 * Search bound to `api.search`. Collapsed to its icon until asked for, so a toolbar
 * spends its width on the table rather than on an empty box.
 */
export function DataTableSearchField({ placeholder = 'Search', width, alwaysOpen }: DataTableSearchFieldProps) {
  const api = useDataTableContext()
  const [open, setOpen] = useState(false)

  const expanded = alwaysOpen || open || Boolean(api.search)

  if (!expanded) {
    return (
      <Tooltip title={placeholder}>
        <IconButton
          className="search-toggle"
          color="inherit"
          size="large"
          onClick={() => setOpen(true)}
          aria-label={placeholder}
        >
          <SearchIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    )
  }

  const collapse = () => {
    api.setSearch('')
    setOpen(false)
  }

  return (
    <ClickAwayListener onClickAway={() => !api.search && setOpen(false)}>
      <Box sx={{ width: width ?? { xs: '100%', sm: 280 } }}>
        <TextField
          size="small"
          fullWidth
          autoFocus={!alwaysOpen}
          placeholder={placeholder}
          value={api.search}
          onChange={(e) => api.setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && collapse()}
          slotProps={{
            input: {
              className: 'search-field',
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: '11px' }}>
                  <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: api.search ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={collapse} aria-label="Clear search">
                    <CloseRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
      </Box>
    </ClickAwayListener>
  )
}
