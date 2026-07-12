import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from '@mui/material';
import { DataTableRoot } from './context.js';
import { DataTableSearchField } from './SearchField.js';
import { DataTableGroupBySelect } from './GroupBySelect.js';
import { DataTableBody } from './Body.js';
import { DataTablePagination } from './Pagination.js';
/**
 * The default assembly: search + group-by select, the table, pagination.
 * Covers most screens as-is. For a different layout — preset tabs, a custom
 * sort menu, import/export buttons — compose the same pieces yourself:
 * `DataTable.Root`, `.SearchField`, `.GroupBySelect`, `.Body`, `.Pagination`.
 */
export function DataTable({ api, onRowClick, searchPlaceholder, emptyMessage, }) {
    return (_jsx(DataTableRoot, { api: api, children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 1.5 }, children: [_jsxs(Box, { sx: { display: 'flex', gap: 1.5, flexWrap: 'wrap' }, children: [_jsx(DataTableSearchField, { placeholder: searchPlaceholder }), _jsx(DataTableGroupBySelect, {})] }), _jsx(DataTableBody, { onRowClick: onRowClick, emptyMessage: emptyMessage }), _jsx(DataTablePagination, {})] }) }));
}
DataTable.Root = DataTableRoot;
DataTable.SearchField = DataTableSearchField;
DataTable.GroupBySelect = DataTableGroupBySelect;
DataTable.Body = DataTableBody;
DataTable.Pagination = DataTablePagination;
