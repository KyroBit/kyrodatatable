import type { ColumnDef, FetchGroupsResult, FetchParams, FetchResult } from '../types/index.js';
export interface ClientEngineOptions<Row, Field extends string, Filters> {
    data: Row[];
    columns: ColumnDef<Row, Field>[];
    applyFilters?: (row: Row, filters: Filters) => boolean;
}
export declare function createClientEngine<Row, Field extends string, Filters>({ data, columns, applyFilters, }: ClientEngineOptions<Row, Field, Filters>): {
    fetchRecords: (params: FetchParams<Field, Filters>) => Promise<FetchResult<Row>>;
    fetchGroups: (params: FetchParams<Field, Filters>) => Promise<FetchGroupsResult<Field>>;
};
//# sourceMappingURL=clientEngine.d.ts.map