import type { PresetsApi } from '../../state/usePresets.js';
import type { ChipFilters, FilterColumnDef } from '../../types/index.js';
export declare function chipFiltersEqual(a: ChipFilters, b: ChipFilters): boolean;
export declare function summarizeChipFilters(filters: ChipFilters, columns: FilterColumnDef[]): string;
export declare function countChipFilters(filters: ChipFilters): number;
export interface DataTableFilterMenuProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    filterColumns: FilterColumnDef[];
    draft: ChipFilters;
    onDraftChange: (next: ChipFilters) => void;
    onApply: (filters: ChipFilters) => void;
    emptyFilters: ChipFilters;
    presets?: PresetsApi<ChipFilters>;
}
export declare function DataTableFilterMenu({ anchorEl, onClose, filterColumns, draft, onDraftChange, onApply, emptyFilters, presets, }: DataTableFilterMenuProps): import("react").JSX.Element;
export interface ManageViewsDialogProps {
    open: boolean;
    onClose: () => void;
    presets: PresetsApi<ChipFilters>;
    filterColumns: FilterColumnDef[];
    onApply: (filters: ChipFilters) => void;
}
export declare function ManageViewsDialog({ open, onClose, presets, filterColumns, onApply }: ManageViewsDialogProps): import("react").JSX.Element;
//# sourceMappingURL=FilterMenu.d.ts.map