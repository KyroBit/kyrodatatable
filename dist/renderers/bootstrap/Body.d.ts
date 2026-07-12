export interface DataTableBodyProps<Row> {
    onRowClick?: (row: Row) => void;
    emptyMessage?: string;
}
/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export declare function DataTableBody<Row>({ onRowClick, emptyMessage }: DataTableBodyProps<Row>): import("react").JSX.Element;
//# sourceMappingURL=Body.d.ts.map