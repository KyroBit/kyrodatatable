import type { FilterValues } from '../types/index.js';
export interface Preset<Filters = FilterValues> {
    id: string;
    name: string;
    filters: Filters;
    builtIn?: boolean;
}
export interface PresetsApi<Filters = FilterValues> {
    custom: Preset<Filters>[];
    all: Preset<Filters>[];
    builtIn: Preset<Filters>[];
    create: (name: string, filters: Filters) => string;
    update: (id: string, name: string, filters: Filters) => void;
    remove: (id: string) => void;
    /** Indices into `all`. */
    reorder: (fromIndex: number, toIndex: number) => void;
}
/**
 * Named, saveable filter sets ("Favorites") for a list view — separate from
 * useDataTable on purpose, since a filter's shape is entirely yours (a list
 * of statuses, a date range, whatever your fetchRecords call understands).
 * Wire the active preset's filters into your fetchRecords closure yourself.
 */
export declare function usePresets<Filters = FilterValues>(storageKey: string, defaults?: Preset<Filters>[]): PresetsApi<Filters>;
//# sourceMappingURL=usePresets.d.ts.map