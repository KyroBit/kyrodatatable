import type { PresetsApi, FilterColumnDef, FilterValues } from '@kyrobit/datatable';
export interface DataTableFilterMenuProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    filterColumns: FilterColumnDef[];
    draft: FilterValues;
    onDraftChange: (next: FilterValues) => void;
    /** `presetId` is set when the apply came from saving a view. */
    onApply: (filters: FilterValues, presetId?: string) => void;
    presets?: PresetsApi<FilterValues>;
}
export declare function DataTableFilterMenu({ anchorEl, onClose, filterColumns, draft, onDraftChange, onApply, presets, }: DataTableFilterMenuProps): import("react").JSX.Element;
export interface ManageViewsDialogProps {
    open: boolean;
    onClose: () => void;
    presets: PresetsApi<FilterValues>;
    filterColumns: FilterColumnDef[];
}
export declare function ManageViewsDialog({ open, onClose, presets, filterColumns }: ManageViewsDialogProps): import("react").JSX.Element;
//# sourceMappingURL=FilterMenu.d.ts.map