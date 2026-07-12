import type { DataTableApi } from '../../state/useDataTable.js';
import { DataTableRoot } from './context.js';
import { DataTableSearchField } from './SearchField.js';
import { DataTableGroupBySelect } from './GroupBySelect.js';
import { DataTableBody } from './Body.js';
import { DataTablePagination } from './Pagination.js';
export interface DataTableProps<Row, Field extends string = string, Filters = undefined> {
    api: DataTableApi<Row, Field, Filters>;
    onRowClick?: (row: Row) => void;
    searchPlaceholder?: string;
    emptyMessage?: string;
}
/**
 * The default assembly: search + group-by select, the table, pagination.
 * Covers most screens as-is. For a different layout, compose the same
 * pieces yourself: `DataTable.Root`, `.SearchField`, `.GroupBySelect`, `.Body`, `.Pagination`.
 */
export declare function DataTable<Row, Field extends string = string, Filters = undefined>({ api, onRowClick, searchPlaceholder, emptyMessage, }: DataTableProps<Row, Field, Filters>): import("react").JSX.Element;
export declare namespace DataTable {
    var Root: typeof DataTableRoot;
    var SearchField: typeof DataTableSearchField;
    var GroupBySelect: typeof DataTableGroupBySelect;
    var Body: typeof DataTableBody;
    var Pagination: typeof DataTablePagination;
}
//# sourceMappingURL=DataTable.d.ts.map