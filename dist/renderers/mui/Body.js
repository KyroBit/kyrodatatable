import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Checkbox, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useDataTableContext } from './context.js';
/**
 * Stacked up/down triangles — the "double arrow" sort indicator modern apps
 * use. Both grey when the column is unsorted; the active direction darkens.
 */
function SortArrows({ direction }) {
    const fill = (dir) => (direction === dir ? 'text.primary' : 'action.disabled');
    return (_jsxs(Box, { component: "span", className: "KyroTable-sortArrows", sx: { display: 'inline-flex', flexDirection: 'column', gap: '2px', ml: 0.75, flex: 'none' }, children: [_jsx(Box, { component: "svg", width: 8, height: 5, viewBox: "0 0 8 5", sx: { display: 'block', color: fill('asc'), transition: 'color 0.15s' }, children: _jsx("path", { d: "M4 0 L7.6 4.6 H0.4 Z", fill: "currentColor" }) }), _jsx(Box, { component: "svg", width: 8, height: 5, viewBox: "0 0 8 5", sx: { display: 'block', color: fill('desc'), transition: 'color 0.15s' }, children: _jsx("path", { d: "M4 5 L7.6 0.4 H0.4 Z", fill: "currentColor" }) })] }));
}
/**
 * Compact inline pager shown at the right edge of an expanded group's header
 * row — each group paginates independently (`api.setGroupPage`).
 */
function GroupPager({ groupKey, api }) {
    const pagination = api.groupPagination(groupKey);
    const total = api.groupTotal(groupKey);
    if (total <= 0)
        return null;
    const from = (pagination.page - 1) * pagination.pageSize + 1;
    const to = Math.min(pagination.page * pagination.pageSize, total);
    return (_jsxs(Box, { className: "KyroTable-groupPager", onClick: (e) => e.stopPropagation(), sx: { display: 'flex', alignItems: 'center', gap: 0.25, flex: 'none' }, children: [_jsxs(Typography, { component: "span", sx: { fontSize: 12, color: 'text.secondary', fontVariantNumeric: 'tabular-nums', mr: 0.5 }, children: [from, "\u2013", to, " of ", total] }), _jsx(IconButton, { size: "small", disabled: pagination.page <= 1, onClick: () => api.setGroupPage(groupKey, pagination.page - 1), "aria-label": "Previous page", children: _jsx(KeyboardArrowLeftIcon, { sx: { fontSize: 18 } }) }), _jsx(IconButton, { size: "small", disabled: to >= total, onClick: () => api.setGroupPage(groupKey, pagination.page + 1), "aria-label": "Next page", children: _jsx(KeyboardArrowRightIcon, { sx: { fontSize: 18 } }) })] }));
}
/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export function DataTableBody({ onRowClick, emptyMessage = 'No records found.', selectable = false, stickyHeader = true, rowClass, }) {
    const api = useDataTableContext();
    const items = api.visibleItems;
    const colSpan = api.columns.length + (selectable ? 1 : 0);
    const isEmpty = items.length === 0 && !api.loading && !api.groupsLoading;
    const hasExplicitWidths = api.columns.some((col) => col.width);
    return (_jsx(TableContainer, { sx: { flex: '1 1 auto', minHeight: 0 }, children: _jsxs(Table, { size: "small", stickyHeader: stickyHeader, sx: hasExplicitWidths ? { tableLayout: 'fixed' } : undefined, children: [hasExplicitWidths && (_jsxs("colgroup", { children: [selectable && _jsx("col", { style: { width: 48 } }), api.columns.map((col) => (_jsx("col", { style: col.width ? { width: col.width } : undefined }, col.field)))] })), _jsx(TableHead, { children: _jsxs(TableRow, { children: [selectable && (_jsx(TableCell, { padding: "checkbox", children: _jsx(Checkbox, { size: "small", checked: api.allVisibleSelected, indeterminate: api.someVisibleSelected && !api.allVisibleSelected, onChange: () => api.toggleSelectAll(), slotProps: { input: { 'aria-label': 'Select all rows' } } }) })), api.columns.map((col) => (_jsx(TableCell, { align: col.align, sortDirection: api.sort?.field === col.field ? api.sort.direction : false, onClick: col.sortable === false ? undefined : () => api.toggleSort(col.field), sx: col.sortable === false ? undefined : {
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    '&:hover': { color: 'text.primary' },
                                }, children: col.sortable === false ? col.headerName : (_jsxs(Box, { component: "button", type: "button", className: "KyroTable-sortButton", sx: {
                                        display: 'flex',
                                        width: '100%',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        margin: 0,
                                        font: 'inherit',
                                        textTransform: 'inherit',
                                        letterSpacing: 'inherit',
                                        color: 'inherit',
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        whiteSpace: 'nowrap',
                                        '&:hover': { color: 'text.primary' },
                                    }, children: [col.headerName, _jsx(SortArrows, { direction: api.sort?.field === col.field ? api.sort.direction : null })] })) }, col.field)))] }) }), _jsx(TableBody, { children: isEmpty ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: colSpan, children: _jsx(Typography, { color: "text.secondary", sx: { py: 4, textAlign: 'center' }, children: emptyMessage }) }) })) : (items.map((item) => {
                        if (item.type === 'group') {
                            return (_jsx(TableRow, { className: "KyroTable-groupRow", onClick: () => api.toggleGroup(item.group.key), sx: { cursor: 'pointer' }, children: _jsx(TableCell, { className: "KyroTable-groupCell", colSpan: colSpan, children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }, children: [item.expanded
                                                        ? _jsx(KeyboardArrowDownIcon, { sx: { fontSize: 18, color: 'text.secondary' } })
                                                        : _jsx(KeyboardArrowRightIcon, { sx: { fontSize: 18, color: 'text.secondary' } }), selectable && item.expanded && (_jsx(Checkbox, { size: "small", sx: { p: 0.25, ml: -0.5 }, onClick: (e) => e.stopPropagation(), checked: api.groupAllSelected(item.group.key), indeterminate: api.groupSomeSelected(item.group.key) && !api.groupAllSelected(item.group.key), onChange: () => api.toggleSelectGroup(item.group.key), slotProps: { input: { 'aria-label': `Select all rows in ${item.group.label}` } } })), _jsx(Typography, { component: "span", sx: { fontSize: 'inherit', fontWeight: 600, color: 'text.primary' }, children: item.group.label }), _jsx(Box, { component: "span", className: "KyroTable-groupCount", sx: {
                                                            fontSize: 12, fontWeight: 600, lineHeight: 1,
                                                            px: 1, py: '3px', borderRadius: 999,
                                                            bgcolor: 'action.selected', color: 'text.secondary',
                                                        }, children: item.group.count }), api.groupLoading(item.group.key) && api.groupRows(item.group.key).length === 0 && (_jsx(Box, { component: "span", sx: { color: 'text.secondary', fontSize: 12 }, children: "loading\u2026" }))] }), item.expanded && _jsx(GroupPager, { groupKey: item.group.key, api: api })] }) }) }, `group-${item.group.key}`));
                        }
                        const row = item.row;
                        const rowId = api.getRowId(row);
                        const classes = [
                            item.type === 'group-row' ? 'KyroTable-groupChildRow' : '',
                            rowClass ? rowClass(row) : '',
                        ].filter(Boolean).join(' ');
                        return (_jsxs(TableRow, { hover: true, selected: selectable && api.isSelected(rowId), className: classes || undefined, sx: { cursor: onRowClick ? 'pointer' : undefined }, onClick: () => onRowClick?.(row), children: [selectable && (_jsx(TableCell, { padding: "checkbox", onClick: (e) => e.stopPropagation(), children: _jsx(Checkbox, { size: "small", checked: api.isSelected(rowId), onChange: () => api.toggleSelected(rowId), slotProps: { input: { 'aria-label': 'Select row' } } }) })), api.columns.map((col) => (_jsx(TableCell, { align: col.align, children: (col.render ? col.render(row) : row[col.field]) }, col.field)))] }, rowId));
                    })) })] }) }));
}
