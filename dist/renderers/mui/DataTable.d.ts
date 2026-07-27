import { type ReactNode } from 'react';
import type { DataTableApi, PresetsApi, ExportFormat, ExportRequest, FilterColumnDef, FilterValues, ResourceAction } from '@kyrobit/datatable';
import { DataTableRoot } from './context.js';
import { DataTableSearchField } from './SearchField.js';
import { DataTableBody } from './Body.js';
import { DataTablePagination } from './Pagination.js';
export interface DataTableProps<Row, Field extends string = string> {
    api: DataTableApi<Row, Field, FilterValues>;
    /** Enables the views pill bar, save-as-view, and the manage dialog. */
    presets?: PresetsApi<FilterValues>;
    /** Enables the filter popover; each entry renders a chip section. */
    filterColumns?: FilterColumnDef[];
    searchPlaceholder?: string;
    searchWidth?: number | string;
    createLabel?: string;
    onCreate?: () => void;
    /** Rendered at the trailing end of the views-pill row, alongside the built-in Create
     * button if `onCreate` is also given. An escape hatch for whatever a consumer needs there
     * that this component has no opinion on (a different button, a breakpoint-swapped Fab,
     * more than one action, etc.) — DataTable itself doesn't inspect or care what it is. */
    toolbarEnd?: ReactNode;
    /** Receives the full query context; POST it to your export endpoint. */
    onExport?: (request: ExportRequest<Field, FilterValues>) => void | Promise<void>;
    /** More than one format turns the Export button into a dropdown. */
    exportFormats?: ExportFormat[];
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
export declare function DataTable<Row, Field extends string = string>({ api, presets, filterColumns, searchPlaceholder, searchWidth, createLabel, onCreate, toolbarEnd, onExport, exportFormats, onImport, exportTooltip, importTooltip, actions, selectable, onRowClick, rowClass, emptyMessage, stickyHeader, rowsPerPageOptions, }: DataTableProps<Row, Field>): import("react").JSX.Element;
export declare namespace DataTable {
    var Root: typeof DataTableRoot;
    var SearchField: typeof DataTableSearchField;
    var Body: typeof DataTableBody;
    var Pagination: typeof DataTablePagination;
}
//# sourceMappingURL=DataTable.d.ts.map