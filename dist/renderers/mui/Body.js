import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography, } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useDataTableContext } from './context.js';
/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export function DataTableBody({ onRowClick, emptyMessage = 'No records found.' }) {
    const api = useDataTableContext();
    const items = api.visibleItems;
    const colSpan = api.columns.length + (api.groupBy ? 1 : 0);
    const isEmpty = items.length === 0 && !api.loading && !api.groupsLoading;
    return (_jsx(TableContainer, { children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [api.groupBy && _jsx(TableCell, { sx: { width: 40 } }), api.columns.map((col) => (_jsx(TableCell, { align: col.align, children: col.sortable === false ? col.headerName : (_jsx(TableSortLabel, { active: api.sort?.field === col.field, direction: api.sort?.field === col.field ? api.sort.direction : 'asc', onClick: () => api.toggleSort(col.field), children: col.headerName })) }, col.field)))] }) }), _jsx(TableBody, { children: isEmpty ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: colSpan, children: _jsx(Typography, { color: "text.secondary", sx: { py: 4, textAlign: 'center' }, children: emptyMessage }) }) })) : (items.map((item) => {
                        if (item.type === 'group') {
                            return (_jsxs(TableRow, { hover: true, sx: { cursor: 'pointer', bgcolor: 'action.hover' }, onClick: () => api.toggleGroup(item.group.key), children: [_jsx(TableCell, { sx: { width: 40 }, children: _jsx(IconButton, { size: "small", children: item.expanded ? _jsx(KeyboardArrowDownIcon, { fontSize: "small" }) : _jsx(KeyboardArrowRightIcon, { fontSize: "small" }) }) }), _jsxs(TableCell, { colSpan: api.columns.length, sx: { fontWeight: 600 }, children: [item.group.label, " ", _jsxs(Box, { component: "span", sx: { color: 'text.secondary' }, children: ["(", item.group.count, ")"] }), api.groupLoading(item.group.key) && api.groupRows(item.group.key).length === 0 && (_jsx(Box, { component: "span", sx: { color: 'text.secondary', ml: 1 }, children: "loading\u2026" }))] })] }, `group-${item.group.key}`));
                        }
                        const row = item.row;
                        return (_jsxs(TableRow, { hover: true, sx: { cursor: onRowClick ? 'pointer' : undefined }, onClick: () => onRowClick?.(row), children: [item.type === 'group-row' && _jsx(TableCell, { sx: { width: 40 } }), api.columns.map((col) => (_jsx(TableCell, { align: col.align, children: (col.render ? col.render(row) : row[col.field]) }, col.field)))] }, api.getRowId(row)));
                    })) })] }) }));
}
