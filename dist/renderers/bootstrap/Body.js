import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useDataTableContext } from './context.js';
function SortArrow({ active, direction }) {
    if (!active)
        return _jsx("span", { className: "text-muted ms-1", children: "\u2195" });
    return _jsx("span", { className: "ms-1", children: direction === 'asc' ? '↑' : '↓' });
}
/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export function DataTableBody({ onRowClick, emptyMessage = 'No records found.' }) {
    const api = useDataTableContext();
    const items = api.visibleItems;
    const colSpan = api.columns.length + (api.groupBy ? 1 : 0);
    const isEmpty = items.length === 0 && !api.loading && !api.groupsLoading;
    return (_jsx("div", { className: "table-responsive", children: _jsxs("table", { className: "table table-hover align-middle mb-0", children: [_jsx("thead", { children: _jsxs("tr", { children: [api.groupBy && _jsx("th", { style: { width: 40 } }), api.columns.map((col) => (_jsxs("th", { className: col.align === 'right' ? 'text-end' : col.align === 'center' ? 'text-center' : undefined, role: col.sortable === false ? undefined : 'button', onClick: col.sortable === false ? undefined : () => api.toggleSort(col.field), children: [col.headerName, col.sortable !== false && _jsx(SortArrow, { active: api.sort?.field === col.field, direction: api.sort?.direction })] }, col.field)))] }) }), _jsx("tbody", { children: isEmpty ? (_jsx("tr", { children: _jsx("td", { colSpan: colSpan, className: "text-center text-muted py-4", children: emptyMessage }) })) : (items.map((item) => {
                        if (item.type === 'group') {
                            return (_jsxs("tr", { className: "table-light", style: { cursor: 'pointer' }, onClick: () => api.toggleGroup(item.group.key), children: [_jsx("td", { style: { width: 40 }, children: item.expanded ? '▼' : '▶' }), _jsxs("td", { colSpan: api.columns.length, className: "fw-semibold", children: [item.group.label, " ", _jsxs("span", { className: "text-muted fw-normal", children: ["(", item.group.count, ")"] }), api.groupLoading(item.group.key) && api.groupRows(item.group.key).length === 0 && (_jsx("span", { className: "text-muted ms-1", children: "loading\u2026" }))] })] }, `group-${item.group.key}`));
                        }
                        const row = item.row;
                        return (_jsxs("tr", { style: onRowClick ? { cursor: 'pointer' } : undefined, onClick: () => onRowClick?.(row), children: [item.type === 'group-row' && _jsx("td", { style: { width: 40 } }), api.columns.map((col) => (_jsx("td", { className: col.align === 'right' ? 'text-end' : col.align === 'center' ? 'text-center' : undefined, children: (col.render ? col.render(row) : row[col.field]) }, col.field)))] }, api.getRowId(row)));
                    })) })] }) }));
}
