export interface DataTablePaginationProps {
    /** Page-size choices. Empty (the default) hides the rows-per-page select entirely. */
    rowsPerPageOptions?: number[];
}
/** Hidden automatically while grouped — pagination happens per-group there instead (`api.setGroupPage`). */
export declare function DataTablePagination({ rowsPerPageOptions }: DataTablePaginationProps): import("react").JSX.Element | null;
//# sourceMappingURL=Pagination.d.ts.map