import type { PresetsApi, FilterRenderers, FilterColumnDef, FilterValues } from '@kyrobit/datatable';
export interface DataTableFilterMenuProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    filterColumns: FilterColumnDef[];
    draft: FilterValues;
    onDraftChange: (next: FilterValues) => void;
    onApply: (filters: FilterValues, presetId?: string) => void;
    presets?: PresetsApi<FilterValues>;
    filterRenderers?: FilterRenderers;
}
export declare function DataTableFilterMenu({ anchorEl, onClose, filterColumns, draft, onDraftChange, onApply, presets, filterRenderers, }: DataTableFilterMenuProps): import("react").JSX.Element;
export interface ManageViewsDialogProps {
    open: boolean;
    onClose: () => void;
    presets: PresetsApi<FilterValues>;
    filterColumns: FilterColumnDef[];
}
export declare function ManageViewsDialog({ open, onClose, presets, filterColumns }: ManageViewsDialogProps): import("react").JSX.Element;
//# sourceMappingURL=FilterMenu.d.ts.map