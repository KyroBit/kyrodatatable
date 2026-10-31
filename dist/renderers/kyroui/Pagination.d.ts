export interface DataTablePaginationProps {
    /** Page-size choices. Empty (the default) hides the rows-per-page select entirely. */
    rowsPerPageOptions?: number[];
}
/** Invisible while there is nothing to page through, keeping its space so the toolbar does not shift when rows arrive. Hidden while grouped — pagination happens per-group there instead (`api.setGroupPage`). */
export declare function DataTablePagination({ rowsPerPageOptions }: DataTablePaginationProps): import("react").JSX.Element | null;
//# sourceMappingURL=Pagination.d.ts.map