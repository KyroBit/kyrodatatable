import type { FilterColumnDef, FilterRenderers, FilterValues, PresetsApi } from '@kyrobit/datatable';
export interface DataTableFilterButtonProps {
    filterColumns: FilterColumnDef[];
    presets?: PresetsApi<FilterValues>;
    filterRenderers?: FilterRenderers;
    onApply?: (filters: FilterValues, presetId?: string) => void;
}
export declare function DataTableFilterButton({ filterColumns, presets, filterRenderers, onApply }: DataTableFilterButtonProps): import("react").JSX.Element;
//# sourceMappingURL=FilterButton.d.ts.map