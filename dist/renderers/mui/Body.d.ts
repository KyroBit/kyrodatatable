export interface DataTableBodyProps<Row> {
    onRowClick?: (row: Row) => void;
    emptyMessage?: string;
    /** Renders a leading checkbox column wired to `api.selection`. */
    selectable?: boolean;
    /** Keeps the header row visible while rows scroll inside the container. Default `true`. */
    stickyHeader?: boolean;
    /** Extra class name(s) per data row. */
    rowClass?: (row: Row) => string;
}
/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export declare function DataTableBody<Row>({ onRowClick, emptyMessage, selectable, stickyHeader, rowClass, }: DataTableBodyProps<Row>): import("react").JSX.Element;
//# sourceMappingURL=Body.d.ts.map