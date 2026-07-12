import type { ColumnDef, FetchGroupsResult, FetchParams, FetchResult } from '../types/index.js';
export interface ClientEngineOptions<Row, Field extends string, Filters> {
    data: Row[];
    columns: ColumnDef<Row, Field>[];
    applyFilters?: (row: Row, filters: Filters) => boolean;
    groupField?: (row: Row) => unknown;
}
/** Builds fetchRecords/fetchGroups equivalents that run entirely in memory against `data` — the client-mode counterpart to the server-side functions you'd otherwise write by hand. */
export declare function createClientEngine<Row, Field extends string, Filters>({ data, columns, applyFilters, groupField, }: ClientEngineOptions<Row, Field, Filters>): {
    fetchRecords: (params: FetchParams<Field, Filters>) => Promise<FetchResult<Row>>;
    fetchGroups: (params: FetchParams<Field, Filters>) => Promise<FetchGroupsResult<Field>>;
};
//# sourceMappingURL=clientEngine.d.ts.map