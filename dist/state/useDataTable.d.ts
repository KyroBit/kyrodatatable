import type { ColumnDef, DataTableConfig, FilterOption, FilterValues, GroupByColumn, PaginationState, ResourceGroup, Selection, SortState, VisibleItem } from '../types/index.js';
export interface DataTableApi<Row, Field extends string = string, Filters = FilterValues> {
    columns: ColumnDef<Row, Field>[];
    getRowId: (row: Row) => string;
    groupByColumns?: GroupByColumn<Field>[];
    cacheKey?: string;
    /** `columns` minus the hidden ones, in the original order. What a renderer draws. */
    visibleColumns: ColumnDef<Row, Field>[];
    hiddenColumns: Field[];
    setColumnHidden: (field: Field, hidden: boolean) => void;
    search: string;
    setSearch: (value: string) => void;
    filters: Filters | undefined;
    setFilters: (filters: Filters) => void;
    filterLabel: (field: string, value: string) => string | undefined;
    rememberFilterLabels: (field: string, options: FilterOption[]) => void;
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
    /** Appends the next page to `rows` instead of replacing them, for scroll-to-load lists. A new search, sort or filter starts again from the first page. */
    loadMore: () => void;
    /** More rows exist beyond those loaded. Always false while grouped. */
    hasMore: boolean;
    loadingMore: boolean;
    listKey: string;
    groupBy: Field[];
    setGroupBy: (fields: Field[]) => void;
    groups: ResourceGroup<Field>[];
    groupsTotal: number;
    groupsLoading: boolean;
    isGroupExpanded: (id: string) => boolean;
    toggleGroup: (id: string) => void;
    groupRows: (id: string) => Row[];
    groupTotal: (id: string) => number;
    groupLoading: (id: string) => boolean;
    groupPagination: (id: string) => PaginationState;
    setGroupPage: (id: string, page: number) => void;
    /** Flat + grouped rows in one display-ordered list — see the `VisibleItem` type. What every built-in renderer actually iterates. */
    visibleItems: VisibleItem<Row, Field>[];
    selection: Selection<Field>;
    selectedCount: number;
    isSelected: (id: string) => boolean;
    toggleSelected: (id: string) => void;
    setSelection: (selection: Selection<Field>) => void;
    clearSelection: () => void;
    toggleSelectAll: () => void;
    allSelected: boolean;
    someSelected: boolean;
    groupAllSelected: (id: string) => boolean;
    groupSomeSelected: (id: string) => boolean;
    toggleSelectGroup: (id: string) => void;
    refetch: () => void;
}
export declare function useDataTable<Row, Field extends string = string, Filters = FilterValues>(config: DataTableConfig<Row, Field, Filters>): DataTableApi<Row, Field, Filters>;
//# sourceMappingURL=useDataTable.d.ts.map