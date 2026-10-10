import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, ClickAwayListener, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useDataTableContext } from './context.js';
import { SearchIcon } from './icons.js';
/**
 * Search bound to `api.search`. Collapsed to its icon until asked for, so a toolbar
 * spends its width on the table rather than on an empty box.
 */
export function DataTableSearchField({ placeholder = 'Search', width, alwaysOpen }) {
    const api = useDataTableContext();
    const [open, setOpen] = useState(false);
    const expanded = alwaysOpen || open || Boolean(api.search);
    if (!expanded) {
        return (_jsx(Tooltip, { title: placeholder, children: _jsx(IconButton, { className: "search-toggle", color: "inherit", size: "large", onClick: () => setOpen(true), "aria-label": placeholder, children: _jsx(SearchIcon, { sx: { fontSize: 20 } }) }) }));
    }
    const collapse = () => {
        api.setSearch('');
        setOpen(false);
    };
    return (_jsx(ClickAwayListener, { onClickAway: () => !api.search && setOpen(false), children: _jsx(Box, { sx: { width: width ?? { xs: '100%', sm: 280 } }, children: _jsx(TextField, { size: "small", fullWidth: true, autoFocus: !alwaysOpen, placeholder: placeholder, value: api.search, onChange: (e) => api.setSearch(e.target.value), onKeyDown: (e) => e.key === 'Escape' && collapse(), slotProps: {
                    input: {
                        className: 'search-field',
                        startAdornment: (_jsx(InputAdornment, { position: "start", sx: { mr: '11px' }, children: _jsx(SearchIcon, { sx: { fontSize: 20, color: 'text.secondary' } }) })),
                        endAdornment: api.search ? (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { size: "small", onClick: collapse, "aria-label": "Clear search", children: _jsx(CloseRoundedIcon, { sx: { fontSize: 18 } }) }) })) : undefined,
                    },
                } }) }) }));
}
