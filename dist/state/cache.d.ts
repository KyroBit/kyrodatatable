import type { FetchParams, FetchResult, FilterValues, ServerDataTableConfig } from '../types/index.js';
type FirstPageOptions<Field extends string, Filters> = Pick<ServerDataTableConfig<unknown, Field, Filters>, 'initialPageSize' | 'initialSort' | 'initialFilters'>;
export declare const firstPage: <Field extends string, Filters>(options: FirstPageOptions<Field, Filters>) => FetchParams<Field, Filters>;
export declare const entryKey: (cacheKey: string, params: FetchParams<string, unknown>) => string;
export interface CachedList<Row> extends FetchResult<Row> {
    lastPage: number;
}
export declare function cachedList<Row>(cacheKey: string, params: FetchParams<string, unknown>): CachedList<Row> | undefined;
export declare const rememberLastPage: (listKey: string, page: number) => Map<string, number>;
export declare function load<Row>(key: string, request: () => Promise<FetchResult<Row>>): Promise<FetchResult<Row>>;
export interface PrefetchOptions<Row, Field extends string, Filters> extends FirstPageOptions<Field, Filters> {
    cacheKey: string;
    fetchRecords: ServerDataTableConfig<Row, Field, Filters>['fetchRecords'];
}
export declare function prefetchDataTable<Row, Field extends string = string, Filters = FilterValues>(options: PrefetchOptions<Row, Field, Filters>): void;
export {};
//# sourceMappingURL=cache.d.ts.map