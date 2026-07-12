import type { ColumnDef, DataTableConfig, GroupByColumn, PaginationState, ResourceGroup, SortState, VisibleItem } from '../types/index.js';
export interface DataTableApi<Row, Field extends string = string, Filters = undefined> {
    columns: ColumnDef<Row, Field>[];
    getRowId: (row: Row) => string;
    groupByColumns?: GroupByColumn<Field>[];
    search: string;
    setSearch: (value: string) => void;
    filters: Filters | undefined;
    setFilters: (filters: Filters) => void;
    sort: SortState<Field> | null;
    toggleSort: (field: Field) => void;
    setSort: (sort: SortState<Field> | null) => void;
    pagination: PaginationState;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
    rows: Row[];
    total: number;
    loading: boolean;
    error: unknown;
    groupBy: Field | null;
    setGroupBy: (field: Field | null) => void;
    groups: ResourceGroup<Field>[];
    groupsTotal: number;
    groupsLoading: boolean;
    isGroupExpanded: (key: string) => boolean;
    toggleGroup: (key: string) => void;
    groupRows: (key: string) => Row[];
    groupTotal: (key: string) => number;
    groupLoading: (key: string) => boolean;
    groupPagination: (key: string) => PaginationState;
    setGroupPage: (key: string, page: number) => void;
    /** Flat + grouped rows in one display-ordered list — see the `VisibleItem` type. What every built-in renderer actually iterates. */
    visibleItems: VisibleItem<Row, Field>[];
    refetch: () => void;
}
export declare function useDataTable<Row, Field extends string = string, Filters = undefined>(config: DataTableConfig<Row, Field, Filters>): DataTableApi<Row, Field, Filters>;
//# sourceMappingURL=useDataTable.d.ts.map