export interface DataTableSearchFieldProps {
    placeholder?: string;
    width?: number | string;
    /** Render the field open from the start instead of behind its icon. */
    alwaysOpen?: boolean;
}
/**
 * Search bound to `api.search`. Collapsed to its icon until asked for, so a toolbar
 * spends its width on the table rather than on an empty box.
 */
export declare function DataTableSearchField({ placeholder, width, alwaysOpen }: DataTableSearchFieldProps): import("react").JSX.Element;
//# sourceMappingURL=SearchField.d.ts.map