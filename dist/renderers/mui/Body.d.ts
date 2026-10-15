import type { ReactNode } from 'react';
export interface DataTableBodyProps<Row> {
    onRowClick?: (row: Row) => void;
    /** Shown in place of the table when there are no records at all. */
    emptyMessage?: ReactNode;
    /** Shown in place of the table when a search or filter matches nothing. */
    noResultsMessage?: ReactNode;
    /** Shown in place of the table when the fetch fails. Defaults to a message with a retry button. */
    errorMessage?: ReactNode;
    /** Renders a leading checkbox column wired to `api.selection`. */
    selectable?: boolean;
    /** Keeps the header row visible while rows scroll inside the container. Default `true`. */
    stickyHeader?: boolean;
    /** Extra class name(s) per data row. */
    rowClass?: (row: Row) => string;
}
/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export declare function DataTableBody<Row>({ onRowClick, emptyMessage, noResultsMessage, errorMessage, selectable, stickyHeader, rowClass, }: DataTableBodyProps<Row>): import("react").JSX.Element;
//# sourceMappingURL=Body.d.ts.map