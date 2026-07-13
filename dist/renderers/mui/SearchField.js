import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { useDataTableContext } from './context.js';
import { FilterIcon, SearchIcon } from './icons.js';
/** Search input bound to `api.search`, with an optional filter opener and applied-filter badge. */
export function DataTableSearchField({ placeholder = 'Search', width = 420, onOpenFilters, filterCount = 0 }) {
    const api = useDataTableContext();
    return (_jsx(TextField, { size: "small", placeholder: placeholder, value: api.search, onChange: (e) => api.setSearch(e.target.value), sx: { width }, slotProps: {
            input: {
                className: 'search-field',
                startAdornment: (_jsx(InputAdornment, { position: "start", sx: { mr: '11px' }, children: _jsx(SearchIcon, { sx: { fontSize: 20, color: '#838383' } }) })),
                endAdornment: onOpenFilters ? (_jsx(InputAdornment, { position: "end", sx: { ml: 0, mr: 0 }, children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: '11px' }, children: [_jsx(Box, { sx: { width: '1.2px', height: 20, bgcolor: '#E8E8E8' } }), _jsxs(IconButton, { size: "small", onClick: (e) => onOpenFilters(e.currentTarget), "aria-label": "Open filters", sx: { color: filterCount > 0 ? 'primary.main' : '#0B0B2C', p: '6px', m: '-6px', borderRadius: '8px' }, children: [_jsx(FilterIcon, { sx: { fontSize: 20 } }), filterCount > 0 && (_jsx(Box, { component: "span", sx: {
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
                                        }, children: filterCount }))] })] }) })) : undefined,
            },
        } }));
}
