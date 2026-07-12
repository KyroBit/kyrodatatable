import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDataTableContext } from './context.js';
export function DataTableGroupBySelect({ noneLabel = 'No grouping' }) {
    const api = useDataTableContext();
    const columns = api.groupByColumns;
    if (!columns || columns.length === 0)
        return null;
    return (_jsxs("select", { className: "form-select form-select-sm", style: { maxWidth: 200 }, value: api.groupBy ?? '', onChange: (e) => api.setGroupBy((e.target.value || null)), children: [_jsx("option", { value: "", children: noneLabel }), columns.map((c) => (_jsx("option", { value: c.field, children: c.label }, c.field)))] }));
}
