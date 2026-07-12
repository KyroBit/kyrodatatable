import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MenuItem, TextField } from '@mui/material';
import { useDataTableContext } from './context.js';
/** Renders nothing if the hook wasn't given `groupByColumns` — there's nothing to group by. */
export function DataTableGroupBySelect({ noneLabel = 'None' }) {
    const api = useDataTableContext();
    const columns = api.groupByColumns;
    if (!columns || columns.length === 0)
        return null;
    return (_jsxs(TextField, { size: "small", select: true, label: "Group by", value: api.groupBy ?? '', onChange: (e) => api.setGroupBy((e.target.value || null)), sx: { minWidth: 180 }, children: [_jsx(MenuItem, { value: "", children: noneLabel }), columns.map((c) => (_jsx(MenuItem, { value: c.field, children: c.label }, c.field)))] }));
}
