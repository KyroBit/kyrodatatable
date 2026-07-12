import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DataTableRoot } from './context.js';
import { DataTableSearchField } from './SearchField.js';
import { DataTableGroupBySelect } from './GroupBySelect.js';
import { DataTableBody } from './Body.js';
import { DataTablePagination } from './Pagination.js';
/**
 * The default assembly: search + group-by select, the table, pagination.
 * Covers most screens as-is. For a different layout, compose the same
 * pieces yourself: `DataTable.Root`, `.SearchField`, `.GroupBySelect`, `.Body`, `.Pagination`.
 */
export function DataTable({ api, onRowClick, searchPlaceholder, emptyMessage, }) {
    return (_jsx(DataTableRoot, { api: api, children: _jsxs("div", { className: "d-flex flex-column gap-3", children: [_jsxs("div", { className: "d-flex gap-2 flex-wrap align-items-center", children: [_jsx(DataTableSearchField, { placeholder: searchPlaceholder }), _jsx(DataTableGroupBySelect, {})] }), _jsx(DataTableBody, { onRowClick: onRowClick, emptyMessage: emptyMessage }), _jsx(DataTablePagination, {})] }) }));
}
DataTable.Root = DataTableRoot;
DataTable.SearchField = DataTableSearchField;
DataTable.GroupBySelect = DataTableGroupBySelect;
DataTable.Body = DataTableBody;
DataTable.Pagination = DataTablePagination;
