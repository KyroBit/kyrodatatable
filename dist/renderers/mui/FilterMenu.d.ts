import type { PresetsApi } from '../../state/usePresets.js';
import type { FilterColumnDef, FilterValues } from '../../types/index.js';
export { filterValuesEqual, countFilterValues, summarizeFilterValues } from '../../filterValues.js';
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
    onApply: (filters: FilterValues, presetId: string) => void;
}
export declare function ManageViewsDialog({ open, onClose, presets, filterColumns, onApply }: ManageViewsDialogProps): import("react").JSX.Element;
//# sourceMappingURL=FilterMenu.d.ts.map