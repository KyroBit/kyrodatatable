import { Box, IconButton, InputAdornment, TextField } from '@mui/material'
import { useDataTableContext } from './context.js'
import { FilterIcon, SearchIcon } from './icons.js'

export interface DataTableSearchFieldProps {
  placeholder?: string
  width?: number | string
  onOpenFilters?: (anchor: HTMLElement) => void
  filterCount?: number
}

/** Search input bound to `api.search`, with an optional filter opener and applied-filter badge. */
export function DataTableSearchField({ placeholder = 'Search', width, onOpenFilters, filterCount = 0 }: DataTableSearchFieldProps) {
  const api = useDataTableContext()

  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={api.search}
      onChange={(e) => api.setSearch(e.target.value)}
      sx={{ width: width ?? { xs: '100%', sm: 420 } }}
      slotProps={{
        input: {
          className: 'search-field',
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: '11px' }}>
              <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: onOpenFilters ? (
            <InputAdornment position="end" sx={{ ml: 0, mr: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                <Box sx={{ width: '1.2px', height: 20, bgcolor: 'divider' }} />
                <IconButton
                  size="small"
                  onClick={(e) => onOpenFilters(e.currentTarget)}
                  aria-label="Open filters"
                  sx={{ color: filterCount > 0 ? 'primary.main' : 'text.primary', p: '6px', m: '-6px', borderRadius: '8px' }}
                >
                  <FilterIcon sx={{ fontSize: 20 }} />
                  {filterCount > 0 && (
                    <Box
                      component="span"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        minWidth: 15,
                        height: 15,
                        px: '3px',
                        borderRadius: 999,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        fontSize: '9.5px',
                        fontWeight: 700,
                        lineHeight: '15px',
                        textAlign: 'center',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {filterCount}
                    </Box>
                  )}
                </IconButton>
              </Box>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  )
}
