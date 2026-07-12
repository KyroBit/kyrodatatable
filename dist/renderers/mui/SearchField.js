import { jsx as _jsx } from "react/jsx-runtime";
import { TextField } from '@mui/material';
import { useDataTableContext } from './context.js';
export function DataTableSearchField({ placeholder = 'Search…', ...rest }) {
    const api = useDataTableContext();
    return (_jsx(TextField, { size: "small", placeholder: placeholder, value: api.search, onChange: (e) => api.setSearch(e.target.value), sx: { minWidth: 240 }, ...rest }));
}
