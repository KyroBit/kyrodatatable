import { jsx as _jsx } from "react/jsx-runtime";
import { useDataTableContext } from './context.js';
export function DataTableSearchField({ placeholder = 'Search…', className }) {
    const api = useDataTableContext();
    return (_jsx("input", { type: "text", className: className ?? 'form-control form-control-sm', style: className ? undefined : { maxWidth: 260 }, placeholder: placeholder, value: api.search, onChange: (e) => api.setSearch(e.target.value) }));
}
