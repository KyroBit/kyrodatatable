import type { FilterColumnDef, FilterValues } from '../types/index.js';
import type { DataTableApi } from './useDataTable.js';
type LabelSource = Pick<DataTableApi<unknown, string, FilterValues>, 'filterLabel' | 'rememberFilterLabels'>;
export declare function useFilterLabels(api: LabelSource, columns: FilterColumnDef[], filters: FilterValues): (column: FilterColumnDef, value: string) => string;
export {};
//# sourceMappingURL=useFilterLabels.d.ts.map