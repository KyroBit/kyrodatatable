import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClientEngine } from './clientEngine.js';
const DEFAULT_PAGE_SIZE = 25;
export function useDataTable(config) {
    const { columns, getRowId, groupByColumns, initialPageSize, initialSort, initialFilters, searchDebounceMs } = config;
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFiltersInternal] = useState(initialFilters);
    const [sort, setSortInternal] = useState(initialSort ?? null);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: initialPageSize ?? DEFAULT_PAGE_SIZE,
    });
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetchTick, setFetchTick] = useState(0);
    const [groupBy, setGroupByField] = useState(null);
    const [groups, setGroups] = useState([]);
    const [groupsTotal, setGroupsTotal] = useState(0);
    const [groupsLoading, setGroupsLoading] = useState(false);
    const [expanded, setExpanded] = useState({});
    const [groupState, setGroupState] = useState({});
    const [selection, setSelectionState] = useState({});
    useEffect(() => {
        if (!searchDebounceMs) {
            setDebouncedSearch(search);
            return;
        }
        const id = setTimeout(() => setDebouncedSearch(search), searchDebounceMs);
        return () => clearTimeout(id);
    }, [search, searchDebounceMs]);
    const clientEngine = useMemo(() => {
        if (!config.data)
            return null;
        return createClientEngine({
            data: config.data,
            columns,
            applyFilters: config.applyFilters,
            groupField: groupBy ? (row) => row[groupBy] : undefined,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.data, config.applyFilters, columns, groupBy]);
    const fetchRecords = config.fetchRecords ?? clientEngine.fetchRecords;
    const fetchGroups = config.fetchGroups ?? (clientEngine ? clientEngine.fetchGroups : undefined);
    const setFilters = useCallback((next) => {
        setFiltersInternal(next);
        setPagination((p) => ({ ...p, page: 1 }));
    }, []);
    const setGroupBy = useCallback((field) => {
        setGroupByField(field);
        setExpanded({});
        setGroupState({});
        setPagination((p) => ({ ...p, page: 1 }));
    }, []);
    const toggleSort = useCallback((field) => {
        setSortInternal((current) => {
            if (!current || current.field !== field)
                return { field, direction: 'asc' };
            if (current.direction === 'asc')
                return { field, direction: 'desc' };
            return null;
        });
        setPagination((p) => ({ ...p, page: 1 }));
    }, []);
    const setSort = useCallback((next) => {
        setSortInternal(next);
        setPagination((p) => ({ ...p, page: 1 }));
    }, []);
    const setPage = useCallback((page) => {
        setPagination((p) => ({ ...p, page }));
    }, []);
    const setPageSize = useCallback((pageSize) => {
        setPagination({ page: 1, pageSize });
    }, []);
    const refetch = useCallback(() => setFetchTick((t) => t + 1), []);
    // ─── ungrouped mode: fetch a flat page of rows ─────────────────────────────
    useEffect(() => {
        if (groupBy)
            return;
        let cancelled = false;
        setLoading(true);
        setError(null);
        const params = { page: pagination.page, pageSize: pagination.pageSize, search: debouncedSearch, sort, filters: filters };
        fetchRecords(params)
            .then((result) => {
            if (cancelled)
                return;
            setRows(result.rows);
            setTotal(result.total);
        })
            .catch((err) => {
            if (!cancelled)
                setError(err);
        })
            .finally(() => {
            if (!cancelled)
                setLoading(false);
        });
        return () => { cancelled = true; };
    }, [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, fetchRecords, fetchTick]);
    // ─── grouped mode: fetch the group list ────────────────────────────────────
    useEffect(() => {
        if (!groupBy || !fetchGroups)
            return;
        let cancelled = false;
        setGroupsLoading(true);
        const params = {
            page: pagination.page, pageSize: pagination.pageSize, search: debouncedSearch, sort, filters: filters, groupBy,
        };
        fetchGroups(params)
            .then((result) => {
            if (cancelled)
                return;
            setGroups(result.groups);
            setGroupsTotal(result.total);
        })
            .catch((err) => {
            if (!cancelled)
                setError(err);
        })
            .finally(() => {
            if (!cancelled)
                setGroupsLoading(false);
        });
        return () => { cancelled = true; };
    }, [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, fetchGroups, fetchTick]);
    const fetchGroupRows = useCallback((key, page) => {
        if (!groupBy)
            return;
        setGroupState((prev) => ({
            ...prev,
            [key]: { rows: prev[key]?.rows ?? [], total: prev[key]?.total ?? 0, pagination: { page, pageSize: pagination.pageSize }, loading: true },
        }));
        const params = {
            page, pageSize: pagination.pageSize, search: debouncedSearch, sort, filters: filters, groupBy, groupKey: key,
        };
        fetchRecords(params)
            .then((result) => {
            setGroupState((prev) => ({
                ...prev,
                [key]: { rows: result.rows, total: result.total, pagination: { page, pageSize: pagination.pageSize }, loading: false },
            }));
        })
            .catch((err) => {
            setError(err);
            setGroupState((prev) => ({
                ...prev,
                [key]: { rows: prev[key]?.rows ?? [], total: prev[key]?.total ?? 0, pagination: { page, pageSize: pagination.pageSize }, loading: false },
            }));
        });
    }, [groupBy, pagination.pageSize, debouncedSearch, sort, filters, fetchRecords]);
    const toggleGroup = useCallback((key) => {
        setExpanded((prev) => {
            const next = { ...prev, [key]: !prev[key] };
            if (next[key] && !groupState[key])
                fetchGroupRows(key, 1);
            return next;
        });
        if (expanded[key]) {
            const rows = groupState[key]?.rows ?? [];
            if (rows.length) {
                setSelectionState((sel) => {
                    const next = { ...sel };
                    for (const row of rows)
                        delete next[getRowId(row)];
                    return next;
                });
            }
        }
    }, [groupState, fetchGroupRows, expanded, getRowId]);
    const setGroupPage = useCallback((key, page) => {
        fetchGroupRows(key, page);
    }, [fetchGroupRows]);
    const isGroupExpanded = useCallback((key) => Boolean(expanded[key]), [expanded]);
    const groupRowsFor = useCallback((key) => groupState[key]?.rows ?? [], [groupState]);
    const groupTotalFor = useCallback((key) => groupState[key]?.total ?? 0, [groupState]);
    const groupLoadingFor = useCallback((key) => groupState[key]?.loading ?? false, [groupState]);
    const groupPaginationFor = useCallback((key) => groupState[key]?.pagination ?? { page: 1, pageSize: pagination.pageSize }, [groupState, pagination.pageSize]);
    // ─── selection ──────────────────────────────────────────────────────────────
    const selectableRows = useMemo(() => {
        if (!groupBy)
            return rows;
        return groups.flatMap((g) => (expanded[g.key] ? groupState[g.key]?.rows ?? [] : []));
    }, [groupBy, rows, groups, expanded, groupState]);
    const selectedIds = useMemo(() => Object.keys(selection).filter((id) => selection[id]), [selection]);
    const allVisibleSelected = selectableRows.length > 0 && selectableRows.every((r) => selection[getRowId(r)]);
    const someVisibleSelected = selectableRows.some((r) => selection[getRowId(r)]);
    const isSelected = useCallback((id) => Boolean(selection[id]), [selection]);
    const toggleSelected = useCallback((id) => {
        setSelectionState((prev) => ({ ...prev, [id]: !prev[id] }));
    }, []);
    const clearSelection = useCallback(() => setSelectionState({}), []);
    const toggleSelectAll = useCallback(() => {
        setSelectionState((prev) => {
            const next = { ...prev };
            if (allVisibleSelected) {
                for (const row of selectableRows)
                    delete next[getRowId(row)];
            }
            else {
                for (const row of selectableRows)
                    next[getRowId(row)] = true;
            }
            return next;
        });
    }, [allVisibleSelected, selectableRows, getRowId]);
    const groupAllSelected = useCallback((key) => {
        const rows = groupState[key]?.rows ?? [];
        return rows.length > 0 && rows.every((r) => selection[getRowId(r)]);
    }, [groupState, selection, getRowId]);
    const groupSomeSelected = useCallback((key) => {
        const rows = groupState[key]?.rows ?? [];
        return rows.some((r) => selection[getRowId(r)]);
    }, [groupState, selection, getRowId]);
    const toggleSelectGroup = useCallback((key) => {
        const rows = groupState[key]?.rows ?? [];
        if (rows.length === 0)
            return;
        const all = rows.every((r) => selection[getRowId(r)]);
        setSelectionState((prev) => {
            const next = { ...prev };
            if (all) {
                for (const row of rows)
                    delete next[getRowId(row)];
            }
            else {
                for (const row of rows)
                    next[getRowId(row)] = true;
            }
            return next;
        });
    }, [groupState, selection, getRowId]);
    const visibleItems = useMemo(() => {
        if (!groupBy)
            return rows.map((row) => ({ type: 'row', row }));
        const items = [];
        for (const group of groups) {
            items.push({ type: 'group', group, expanded: isGroupExpanded(group.key) });
            if (isGroupExpanded(group.key)) {
                for (const row of groupRowsFor(group.key)) {
                    items.push({ type: 'group-row', row, groupKey: group.key });
                }
            }
        }
        return items;
    }, [groupBy, rows, groups, expanded, groupState, isGroupExpanded, groupRowsFor]); // eslint-disable-line react-hooks/exhaustive-deps
    return useMemo(() => ({
        columns,
        getRowId,
        groupByColumns,
        search,
        setSearch: (value) => { setSearch(value); setPagination((p) => ({ ...p, page: 1 })); },
        filters,
        setFilters,
        sort,
        toggleSort,
        setSort,
        pagination,
        setPage,
        setPageSize,
        rows,
        total,
        loading,
        error,
        groupBy,
        setGroupBy,
        groups,
        groupsTotal,
        groupsLoading,
        isGroupExpanded,
        toggleGroup,
        groupRows: groupRowsFor,
        groupTotal: groupTotalFor,
        groupLoading: groupLoadingFor,
        groupPagination: groupPaginationFor,
        setGroupPage,
        visibleItems,
        selection,
        selectedIds,
        isSelected,
        toggleSelected,
        setSelection: setSelectionState,
        clearSelection,
        toggleSelectAll,
        allVisibleSelected,
        someVisibleSelected,
        groupAllSelected,
        groupSomeSelected,
        toggleSelectGroup,
        refetch,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [
        columns, getRowId, groupByColumns,
        search, filters, sort, pagination, rows, total, loading, error,
        groupBy, groups, groupsTotal, groupsLoading,
        setFilters, toggleSort, setSort, setPage, setPageSize, setGroupBy,
        isGroupExpanded, toggleGroup, groupRowsFor, groupTotalFor, groupLoadingFor, groupPaginationFor, setGroupPage,
        visibleItems, refetch,
        selection, selectedIds, isSelected, toggleSelected, clearSelection, toggleSelectAll,
        allVisibleSelected, someVisibleSelected,
        groupAllSelected, groupSomeSelected, toggleSelectGroup,
    ]);
}
