import type { DataTableApi } from '../../state/useDataTable.js';
import type { PresetsApi } from '../../state/usePresets.js';
import type { ChipFilters, FilterColumnDef, ResourceAction } from '../../types/index.js';
import { DataTableRoot } from './context.js';
import { DataTableSearchField } from './SearchField.js';
import { DataTableBody } from './Body.js';
import { DataTablePagination } from './Pagination.js';
export interface DataTableProps<Row, Field extends string = string> {
    api: DataTableApi<Row, Field, ChipFilters>;
    /** Enables the views pill bar, save-as-view, and the manage dialog. */
    presets?: PresetsApi<ChipFilters>;
    /** Enables the filter popover; each entry renders a chip section. */
    filterColumns?: FilterColumnDef[];
    emptyFilters?: ChipFilters;
    searchPlaceholder?: string;
    searchWidth?: number | string;
    createLabel?: string;
    onCreate?: () => void;
    onExport?: () => void;
    onImport?: () => void;
    exportTooltip?: string;
    importTooltip?: string;
    /** Bulk actions offered while rows are selected. Enables the checkbox column. */
    actions?: ResourceAction[];
    selectable?: boolean;
    onRowClick?: (row: Row) => void;
    rowClass?: (row: Row) => string;
    emptyMessage?: string;
    stickyHeader?: boolean;
    rowsPerPageOptions?: number[];
}
/**
 * The full list-page assembly: views pills + manage, create, search with the
 * filter popover, group-by, export/import, contextual bulk actions, the table
 * card, and top-right pagination. Every section is opt-in through props; for
 * a custom layout compose the exported pieces yourself.
 */
export declare function DataTable<Row, Field extends string = string>({ api, presets, filterColumns, emptyFilters, searchPlaceholder, searchWidth, createLabel, onCreate, onExport, onImport, exportTooltip, importTooltip, actions, selectable, onRowClick, rowClass, emptyMessage, stickyHeader, rowsPerPageOptions, }: DataTableProps<Row, Field>): import("react").JSX.Element;
export declare namespace DataTable {
    var Root: typeof DataTableRoot;
    var SearchField: typeof DataTableSearchField;
    var Body: typeof DataTableBody;
    var Pagination: typeof DataTablePagination;
}
//# sourceMappingURL=DataTable.d.ts.map