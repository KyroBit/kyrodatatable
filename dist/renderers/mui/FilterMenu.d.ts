import { type DialogProps as MuiDialogProps } from '@mui/material';
import type { PresetsApi, FilterRenderers, FilterColumnDef, FilterValues } from '@kyrobit/datatable';
export interface DataTableFilterMenuProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    filterColumns: FilterColumnDef[];
    draft: FilterValues;
    onDraftChange: (next: FilterValues) => void;
    /** `presetId` is set when the apply came from saving a view. */
    onApply: (filters: FilterValues, presetId?: string) => void;
    presets?: PresetsApi<FilterValues>;
    /** Swap the component used for a filter type; anything omitted keeps the MUI default. */
    filterRenderers?: FilterRenderers;
}
export declare function DataTableFilterMenu({ anchorEl, onClose, filterColumns, draft, onDraftChange, onApply, presets, filterRenderers, }: DataTableFilterMenuProps): import("react").JSX.Element;
export interface ManageViewsDialogProps {
    open: boolean;
    onClose: () => void;
    presets: PresetsApi<FilterValues>;
    filterColumns: FilterColumnDef[];
    /** Forwarded to the underlying MUI `Dialog`. Sizing and chrome otherwise come from your theme. */
    DialogProps?: Omit<MuiDialogProps, 'open' | 'onClose' | 'children'>;
}
export declare function ManageViewsDialog({ open, onClose, presets, filterColumns, DialogProps }: ManageViewsDialogProps): import("react").JSX.Element;
//# sourceMappingURL=FilterMenu.d.ts.map