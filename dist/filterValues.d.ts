import type { DateRangeValue, FilterColumnDef, FilterValues } from './types/index.js';
export declare function filterValuesEqual(a: FilterValues, b: FilterValues): boolean;
export declare function isFilterFieldActive(value: FilterValues[string] | undefined): boolean;
export declare function countFilterValues(filters: FilterValues): number;
export declare function summarizeFilterValues(filters: FilterValues, columns: FilterColumnDef[]): string;
/** Narrows a field's value for a `select` column — the shape a `fetchRecords` call typically needs. */
export declare function asSelectValues(value: FilterValues[string] | undefined): string[];
/** Narrows a field's value for a `text` column. */
export declare function asTextValue(value: FilterValues[string] | undefined): string;
/** Narrows a field's value for a `date` column. */
export declare function asDateRange(value: FilterValues[string] | undefined): DateRangeValue;
//# sourceMappingURL=filterValues.d.ts.map