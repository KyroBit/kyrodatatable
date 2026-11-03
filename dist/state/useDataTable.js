import { c as _c } from "react/compiler-runtime";
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { cachedResult, entryKey, firstPage, load } from './cache.js';
import { createClientEngine } from './clientEngine.js';
const sameRows = (previous, next) => previous !== undefined && next !== undefined && previous.length === next.length && previous.every((row, index) => row === next[index]);
export function useDataTable(config) {
  const $ = _c(204);
  const {
    columns,
    getRowId,
    groupByColumns,
    searchDebounceMs,
    cacheKey
  } = config;
  let t0;
  if ($[0] !== cacheKey || $[1] !== config) {
    t0 = () => {
      const params = firstPage(config);
      return {
        params,
        result: cacheKey === undefined ? undefined : cachedResult(entryKey(cacheKey, params))
      };
    };
    $[0] = cacheKey;
    $[1] = config;
    $[2] = t0;
  } else {
    t0 = $[2];
  }
  const [initial] = useState(t0);
  let t1;
  if ($[3] !== config.initialHiddenColumns) {
    t1 = config.initialHiddenColumns ?? [];
    $[3] = config.initialHiddenColumns;
    $[4] = t1;
  } else {
    t1 = $[4];
  }
  const [hiddenColumns, setHiddenColumns] = useState(t1);
  let t2;
  if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = (field, hidden) => {
      setHiddenColumns(current => hidden ? current.includes(field) ? current : [...current, field] : current.filter(f => f !== field));
    };
    $[5] = t2;
  } else {
    t2 = $[5];
  }
  const setColumnHidden = t2;
  let t3;
  if ($[6] !== columns || $[7] !== hiddenColumns) {
    let t4;
    if ($[9] !== hiddenColumns) {
      t4 = column => !hiddenColumns.includes(column.field);
      $[9] = hiddenColumns;
      $[10] = t4;
    } else {
      t4 = $[10];
    }
    t3 = columns.filter(t4);
    $[6] = columns;
    $[7] = hiddenColumns;
    $[8] = t3;
  } else {
    t3 = $[8];
  }
  const visibleColumns = t3;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFiltersInternal] = useState(initial.params.filters);
  const [sort, setSortInternal] = useState(initial.params.sort);
  let t4;
  if ($[11] !== initial.params.page || $[12] !== initial.params.pageSize) {
    t4 = {
      page: initial.params.page,
      pageSize: initial.params.pageSize
    };
    $[11] = initial.params.page;
    $[12] = initial.params.pageSize;
    $[13] = t4;
  } else {
    t4 = $[13];
  }
  const [pagination, setPagination] = useState(t4);
  let t5;
  if ($[14] !== initial.result?.rows) {
    t5 = initial.result?.rows ?? [];
    $[14] = initial.result?.rows;
    $[15] = t5;
  } else {
    t5 = $[15];
  }
  const [rows, setRows] = useState(t5);
  const [total, setTotal] = useState(initial.result?.total ?? 0);
  const [loading, setLoading] = useState(!initial.result);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [fetchTick, setFetchTick] = useState(0);
  const [loadedPage, setLoadedPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const generation = useRef(0);
  const [groupBy, setGroupByField] = useState(null);
  let t6;
  if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = [];
    $[16] = t6;
  } else {
    t6 = $[16];
  }
  const [groups, setGroups] = useState(t6);
  const [groupsTotal, setGroupsTotal] = useState(0);
  const [groupsLoading, setGroupsLoading] = useState(false);
  let t7;
  if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = {};
    $[17] = t7;
  } else {
    t7 = $[17];
  }
  const [expanded, setExpanded] = useState(t7);
  let t8;
  if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = {};
    $[18] = t8;
  } else {
    t8 = $[18];
  }
  const [groupState, setGroupState] = useState(t8);
  let t9;
  if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
    t9 = {};
    $[19] = t9;
  } else {
    t9 = $[19];
  }
  const [selection, setSelectionState] = useState(t9);
  let t10;
  let t11;
  if ($[20] !== search || $[21] !== searchDebounceMs) {
    t10 = () => {
      if (!searchDebounceMs) {
        setDebouncedSearch(search);
        return;
      }
      const id = setTimeout(() => setDebouncedSearch(search), searchDebounceMs);
      return () => clearTimeout(id);
    };
    t11 = [search, searchDebounceMs];
    $[20] = search;
    $[21] = searchDebounceMs;
    $[22] = t10;
    $[23] = t11;
  } else {
    t10 = $[22];
    t11 = $[23];
  }
  useEffect(t10, t11);
  const [data, setData] = useState(config.data);
  if (data !== config.data && !sameRows(data, config.data)) {
    setData(config.data);
  }
  let t12;
  if ($[24] !== columns || $[25] !== config.applyFilters || $[26] !== data || $[27] !== groupBy) {
    t12 = data ? createClientEngine({
      data,
      columns,
      applyFilters: config.applyFilters,
      groupField: groupBy ? row => row[groupBy] : undefined
    }) : null;
    $[24] = columns;
    $[25] = config.applyFilters;
    $[26] = data;
    $[27] = groupBy;
    $[28] = t12;
  } else {
    t12 = $[28];
  }
  const clientEngine = t12;
  const fetchRecords = config.fetchRecords ?? clientEngine?.fetchRecords;
  const fetchGroups = config.fetchGroups ?? clientEngine?.fetchGroups;
  let t13;
  if ($[29] !== fetchRecords) {
    t13 = params_0 => fetchRecords?.(params_0);
    $[29] = fetchRecords;
    $[30] = t13;
  } else {
    t13 = $[30];
  }
  const fetchPage = useEffectEvent(t13);
  let t14;
  if ($[31] !== fetchGroups) {
    t14 = params_1 => fetchGroups?.(params_1);
    $[31] = fetchGroups;
    $[32] = t14;
  } else {
    t14 = $[32];
  }
  const fetchGroupPage = useEffectEvent(t14);
  let t15;
  if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
    t15 = next => {
      setFiltersInternal(next);
      setPagination(_temp);
    };
    $[33] = t15;
  } else {
    t15 = $[33];
  }
  const setFilters = t15;
  let t16;
  if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = field_0 => {
      setGroupByField(field_0);
      setExpanded({});
      setGroupState({});
      setPagination(_temp2);
    };
    $[34] = t16;
  } else {
    t16 = $[34];
  }
  const setGroupBy = t16;
  let t17;
  if ($[35] === Symbol.for("react.memo_cache_sentinel")) {
    t17 = field_1 => {
      setSortInternal(current_0 => {
        if (!current_0 || current_0.field !== field_1) {
          return {
            field: field_1,
            direction: "asc"
          };
        }
        if (current_0.direction === "asc") {
          return {
            field: field_1,
            direction: "desc"
          };
        }
        return null;
      });
      setPagination(_temp3);
    };
    $[35] = t17;
  } else {
    t17 = $[35];
  }
  const toggleSort = t17;
  let t18;
  if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
    t18 = next_0 => {
      setSortInternal(next_0);
      setPagination(_temp4);
    };
    $[36] = t18;
  } else {
    t18 = $[36];
  }
  const setSort = t18;
  let t19;
  if ($[37] === Symbol.for("react.memo_cache_sentinel")) {
    t19 = page => {
      setPagination(p_3 => ({
        ...p_3,
        page
      }));
    };
    $[37] = t19;
  } else {
    t19 = $[37];
  }
  const setPage = t19;
  let t20;
  if ($[38] === Symbol.for("react.memo_cache_sentinel")) {
    t20 = pageSize => {
      setPagination({
        page: 1,
        pageSize
      });
    };
    $[38] = t20;
  } else {
    t20 = $[38];
  }
  const setPageSize = t20;
  let t21;
  if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
    t21 = () => setFetchTick(_temp5);
    $[39] = t21;
  } else {
    t21 = $[39];
  }
  const refetch = t21;
  let t22;
  if ($[40] !== config.deps) {
    t22 = JSON.stringify(config.deps ?? []);
    $[40] = config.deps;
    $[41] = t22;
  } else {
    t22 = $[41];
  }
  const depsKey = t22;
  const knownDeps = useRef(depsKey);
  let t23;
  let t24;
  if ($[42] !== depsKey) {
    t23 = () => {
      if (knownDeps.current === depsKey) {
        return;
      }
      knownDeps.current = depsKey;
      setSelectionState({});
      setPagination(_temp6);
      setFetchTick(_temp7);
    };
    t24 = [depsKey];
    $[42] = depsKey;
    $[43] = t23;
    $[44] = t24;
  } else {
    t23 = $[43];
    t24 = $[44];
  }
  useEffect(t23, t24);
  let t25;
  if ($[45] !== cacheKey || $[46] !== debouncedSearch || $[47] !== fetchPage || $[48] !== filters || $[49] !== groupBy || $[50] !== pagination.page || $[51] !== pagination.pageSize || $[52] !== sort) {
    t25 = () => {
      if (groupBy) {
        return;
      }
      let cancelled = false;
      const params_2 = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sort,
        filters: filters
      };
      const key = cacheKey === undefined ? null : entryKey(cacheKey, params_2);
      const cached = key === null ? undefined : cachedResult(key);
      if (cached) {
        setRows(cached.rows);
        setTotal(cached.total);
        setLoadedPage(params_2.page);
      }
      setLoading(!cached);
      setRefreshing(Boolean(cached));
      setError(null);
      const pending = key === null ? fetchPage(params_2) : load(key, () => fetchPage(params_2));
      if (!pending) {
        return;
      }
      generation.current = generation.current + 1;
      pending.then(result => {
        if (cancelled) {
          return;
        }
        setRows(result.rows);
        setTotal(result.total);
        setLoadedPage(params_2.page);
      }).catch(err => {
        if (!cancelled) {
          setError(err);
        }
      }).finally(() => {
        if (cancelled) {
          return;
        }
        setLoading(false);
        setRefreshing(false);
      });
      return () => {
        cancelled = true;
      };
    };
    $[45] = cacheKey;
    $[46] = debouncedSearch;
    $[47] = fetchPage;
    $[48] = filters;
    $[49] = groupBy;
    $[50] = pagination.page;
    $[51] = pagination.pageSize;
    $[52] = sort;
    $[53] = t25;
  } else {
    t25 = $[53];
  }
  let t26;
  if ($[54] !== cacheKey || $[55] !== data || $[56] !== debouncedSearch || $[57] !== fetchTick || $[58] !== filters || $[59] !== groupBy || $[60] !== pagination.page || $[61] !== pagination.pageSize || $[62] !== sort) {
    t26 = [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, data, fetchTick, cacheKey];
    $[54] = cacheKey;
    $[55] = data;
    $[56] = debouncedSearch;
    $[57] = fetchTick;
    $[58] = filters;
    $[59] = groupBy;
    $[60] = pagination.page;
    $[61] = pagination.pageSize;
    $[62] = sort;
    $[63] = t26;
  } else {
    t26 = $[63];
  }
  useEffect(t25, t26);
  let t27;
  if ($[64] !== debouncedSearch || $[65] !== fetchGroupPage || $[66] !== filters || $[67] !== groupBy || $[68] !== pagination.page || $[69] !== pagination.pageSize || $[70] !== sort) {
    t27 = () => {
      if (!groupBy) {
        return;
      }
      const params_3 = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sort,
        filters: filters,
        groupBy
      };
      const pending_0 = fetchGroupPage(params_3);
      if (!pending_0) {
        return;
      }
      let cancelled_0 = false;
      setGroupsLoading(true);
      pending_0.then(result_0 => {
        if (cancelled_0) {
          return;
        }
        setGroups(result_0.groups);
        setGroupsTotal(result_0.total);
      }).catch(err_0 => {
        if (!cancelled_0) {
          setError(err_0);
        }
      }).finally(() => {
        if (!cancelled_0) {
          setGroupsLoading(false);
        }
      });
      return () => {
        cancelled_0 = true;
      };
    };
    $[64] = debouncedSearch;
    $[65] = fetchGroupPage;
    $[66] = filters;
    $[67] = groupBy;
    $[68] = pagination.page;
    $[69] = pagination.pageSize;
    $[70] = sort;
    $[71] = t27;
  } else {
    t27 = $[71];
  }
  let t28;
  if ($[72] !== data || $[73] !== debouncedSearch || $[74] !== fetchTick || $[75] !== filters || $[76] !== groupBy || $[77] !== pagination.page || $[78] !== pagination.pageSize || $[79] !== sort) {
    t28 = [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, data, fetchTick];
    $[72] = data;
    $[73] = debouncedSearch;
    $[74] = fetchTick;
    $[75] = filters;
    $[76] = groupBy;
    $[77] = pagination.page;
    $[78] = pagination.pageSize;
    $[79] = sort;
    $[80] = t28;
  } else {
    t28 = $[80];
  }
  useEffect(t27, t28);
  const hasMore = !groupBy && (pagination.page - 1) * pagination.pageSize + rows.length < total;
  let t29;
  if ($[81] !== debouncedSearch || $[82] !== fetchRecords || $[83] !== filters || $[84] !== hasMore || $[85] !== loadedPage || $[86] !== loading || $[87] !== loadingMore || $[88] !== pagination.pageSize || $[89] !== refreshing || $[90] !== sort) {
    t29 = () => {
      if (!fetchRecords || !hasMore || loading || refreshing || loadingMore) {
        return;
      }
      const page_0 = loadedPage + 1;
      const started = generation.current;
      setLoadingMore(true);
      fetchRecords({
        page: page_0,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sort,
        filters: filters
      }).then(result_1 => {
        if (generation.current !== started) {
          return;
        }
        setRows(prev_0 => [...prev_0, ...result_1.rows]);
        setTotal(result_1.total);
        setLoadedPage(page_0);
      }).catch(err_1 => {
        if (generation.current === started) {
          setError(err_1);
        }
      }).finally(() => setLoadingMore(false));
    };
    $[81] = debouncedSearch;
    $[82] = fetchRecords;
    $[83] = filters;
    $[84] = hasMore;
    $[85] = loadedPage;
    $[86] = loading;
    $[87] = loadingMore;
    $[88] = pagination.pageSize;
    $[89] = refreshing;
    $[90] = sort;
    $[91] = t29;
  } else {
    t29 = $[91];
  }
  const loadMore = t29;
  let t30;
  if ($[92] !== debouncedSearch || $[93] !== fetchRecords || $[94] !== filters || $[95] !== groupBy || $[96] !== pagination.pageSize || $[97] !== sort) {
    t30 = (key_0, page_1) => {
      if (!groupBy || !fetchRecords) {
        return;
      }
      setGroupState(prev_1 => ({
        ...prev_1,
        [key_0]: {
          rows: prev_1[key_0]?.rows ?? [],
          total: prev_1[key_0]?.total ?? 0,
          pagination: {
            page: page_1,
            pageSize: pagination.pageSize
          },
          loading: true
        }
      }));
      const params_4 = {
        page: page_1,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sort,
        filters: filters,
        groupBy,
        groupKey: key_0
      };
      fetchRecords(params_4).then(result_2 => {
        setGroupState(prev_2 => ({
          ...prev_2,
          [key_0]: {
            rows: result_2.rows,
            total: result_2.total,
            pagination: {
              page: page_1,
              pageSize: pagination.pageSize
            },
            loading: false
          }
        }));
      }).catch(err_2 => {
        setError(err_2);
        setGroupState(prev_3 => ({
          ...prev_3,
          [key_0]: {
            rows: prev_3[key_0]?.rows ?? [],
            total: prev_3[key_0]?.total ?? 0,
            pagination: {
              page: page_1,
              pageSize: pagination.pageSize
            },
            loading: false
          }
        }));
      });
    };
    $[92] = debouncedSearch;
    $[93] = fetchRecords;
    $[94] = filters;
    $[95] = groupBy;
    $[96] = pagination.pageSize;
    $[97] = sort;
    $[98] = t30;
  } else {
    t30 = $[98];
  }
  const fetchGroupRows = t30;
  let t31;
  if ($[99] !== expanded || $[100] !== fetchGroupRows || $[101] !== getRowId || $[102] !== groupState) {
    t31 = key_1 => {
      setExpanded(prev_4 => {
        const next_1 = {
          ...prev_4,
          [key_1]: !prev_4[key_1]
        };
        if (next_1[key_1] && !groupState[key_1]) {
          fetchGroupRows(key_1, 1);
        }
        return next_1;
      });
      if (expanded[key_1]) {
        const rows_0 = groupState[key_1]?.rows ?? [];
        if (rows_0.length) {
          setSelectionState(sel => {
            const next_2 = {
              ...sel
            };
            for (const row_0 of rows_0) {
              delete next_2[getRowId(row_0)];
            }
            return next_2;
          });
        }
      }
    };
    $[99] = expanded;
    $[100] = fetchGroupRows;
    $[101] = getRowId;
    $[102] = groupState;
    $[103] = t31;
  } else {
    t31 = $[103];
  }
  const toggleGroup = t31;
  let t32;
  if ($[104] !== fetchGroupRows) {
    t32 = (key_2, page_2) => {
      fetchGroupRows(key_2, page_2);
    };
    $[104] = fetchGroupRows;
    $[105] = t32;
  } else {
    t32 = $[105];
  }
  const setGroupPage = t32;
  let t33;
  if ($[106] !== expanded) {
    t33 = key_3 => Boolean(expanded[key_3]);
    $[106] = expanded;
    $[107] = t33;
  } else {
    t33 = $[107];
  }
  const isGroupExpanded = t33;
  let t34;
  if ($[108] !== groupState) {
    t34 = key_4 => groupState[key_4]?.rows ?? [];
    $[108] = groupState;
    $[109] = t34;
  } else {
    t34 = $[109];
  }
  const groupRowsFor = t34;
  let t35;
  if ($[110] !== groupState) {
    t35 = key_5 => groupState[key_5]?.total ?? 0;
    $[110] = groupState;
    $[111] = t35;
  } else {
    t35 = $[111];
  }
  const groupTotalFor = t35;
  let t36;
  if ($[112] !== groupState) {
    t36 = key_6 => groupState[key_6]?.loading ?? false;
    $[112] = groupState;
    $[113] = t36;
  } else {
    t36 = $[113];
  }
  const groupLoadingFor = t36;
  let t37;
  if ($[114] !== groupState || $[115] !== pagination.pageSize) {
    t37 = key_7 => groupState[key_7]?.pagination ?? {
      page: 1,
      pageSize: pagination.pageSize
    };
    $[114] = groupState;
    $[115] = pagination.pageSize;
    $[116] = t37;
  } else {
    t37 = $[116];
  }
  const groupPaginationFor = t37;
  let t38;
  if ($[117] !== expanded || $[118] !== groupBy || $[119] !== groupState || $[120] !== groups || $[121] !== rows) {
    t38 = groupBy ? groups.flatMap(g => expanded[g.key] ? groupState[g.key]?.rows ?? [] : []) : rows;
    $[117] = expanded;
    $[118] = groupBy;
    $[119] = groupState;
    $[120] = groups;
    $[121] = rows;
    $[122] = t38;
  } else {
    t38 = $[122];
  }
  const selectableRows = t38;
  let t39;
  if ($[123] !== selection) {
    t39 = Object.keys(selection);
    $[123] = selection;
    $[124] = t39;
  } else {
    t39 = $[124];
  }
  let t40;
  if ($[125] !== selection || $[126] !== t39) {
    t40 = t39.filter(id_0 => selection[id_0]);
    $[125] = selection;
    $[126] = t39;
    $[127] = t40;
  } else {
    t40 = $[127];
  }
  const selectedIds = t40;
  let t41;
  if ($[128] !== getRowId || $[129] !== selectableRows || $[130] !== selection) {
    t41 = selectableRows.length > 0 && selectableRows.every(r => selection[getRowId(r)]);
    $[128] = getRowId;
    $[129] = selectableRows;
    $[130] = selection;
    $[131] = t41;
  } else {
    t41 = $[131];
  }
  const allVisibleSelected = t41;
  let t42;
  if ($[132] !== getRowId || $[133] !== selectableRows || $[134] !== selection) {
    let t43;
    if ($[136] !== getRowId || $[137] !== selection) {
      t43 = r_0 => selection[getRowId(r_0)];
      $[136] = getRowId;
      $[137] = selection;
      $[138] = t43;
    } else {
      t43 = $[138];
    }
    t42 = selectableRows.some(t43);
    $[132] = getRowId;
    $[133] = selectableRows;
    $[134] = selection;
    $[135] = t42;
  } else {
    t42 = $[135];
  }
  const someVisibleSelected = t42;
  let t43;
  if ($[139] !== selection) {
    t43 = id_1 => Boolean(selection[id_1]);
    $[139] = selection;
    $[140] = t43;
  } else {
    t43 = $[140];
  }
  const isSelected = t43;
  let t44;
  if ($[141] === Symbol.for("react.memo_cache_sentinel")) {
    t44 = id_2 => {
      setSelectionState(prev_5 => ({
        ...prev_5,
        [id_2]: !prev_5[id_2]
      }));
    };
    $[141] = t44;
  } else {
    t44 = $[141];
  }
  const toggleSelected = t44;
  let t45;
  if ($[142] === Symbol.for("react.memo_cache_sentinel")) {
    t45 = () => setSelectionState({});
    $[142] = t45;
  } else {
    t45 = $[142];
  }
  const clearSelection = t45;
  let t46;
  if ($[143] !== allVisibleSelected || $[144] !== getRowId || $[145] !== selectableRows) {
    t46 = () => {
      setSelectionState(prev_6 => {
        const next_3 = {
          ...prev_6
        };
        if (allVisibleSelected) {
          for (const row_1 of selectableRows) {
            delete next_3[getRowId(row_1)];
          }
        } else {
          for (const row_2 of selectableRows) {
            next_3[getRowId(row_2)] = true;
          }
        }
        return next_3;
      });
    };
    $[143] = allVisibleSelected;
    $[144] = getRowId;
    $[145] = selectableRows;
    $[146] = t46;
  } else {
    t46 = $[146];
  }
  const toggleSelectAll = t46;
  let t47;
  if ($[147] !== getRowId || $[148] !== groupState || $[149] !== selection) {
    t47 = key_8 => {
      const rows_1 = groupState[key_8]?.rows ?? [];
      return rows_1.length > 0 && rows_1.every(r_1 => selection[getRowId(r_1)]);
    };
    $[147] = getRowId;
    $[148] = groupState;
    $[149] = selection;
    $[150] = t47;
  } else {
    t47 = $[150];
  }
  const groupAllSelected = t47;
  let t48;
  if ($[151] !== getRowId || $[152] !== groupState || $[153] !== selection) {
    t48 = key_9 => {
      const rows_2 = groupState[key_9]?.rows ?? [];
      return rows_2.some(r_2 => selection[getRowId(r_2)]);
    };
    $[151] = getRowId;
    $[152] = groupState;
    $[153] = selection;
    $[154] = t48;
  } else {
    t48 = $[154];
  }
  const groupSomeSelected = t48;
  let t49;
  if ($[155] !== getRowId || $[156] !== groupState || $[157] !== selection) {
    t49 = key_10 => {
      const rows_3 = groupState[key_10]?.rows ?? [];
      if (rows_3.length === 0) {
        return;
      }
      const all = rows_3.every(r_3 => selection[getRowId(r_3)]);
      setSelectionState(prev_7 => {
        const next_4 = {
          ...prev_7
        };
        if (all) {
          for (const row_3 of rows_3) {
            delete next_4[getRowId(row_3)];
          }
        } else {
          for (const row_4 of rows_3) {
            next_4[getRowId(row_4)] = true;
          }
        }
        return next_4;
      });
    };
    $[155] = getRowId;
    $[156] = groupState;
    $[157] = selection;
    $[158] = t49;
  } else {
    t49 = $[158];
  }
  const toggleSelectGroup = t49;
  let visibleItems;
  if ($[159] !== expanded || $[160] !== groupBy || $[161] !== groupState || $[162] !== groups || $[163] !== rows) {
    visibleItems = [];
    if (groupBy) {
      for (const group of groups) {
        const open = Boolean(expanded[group.key]);
        visibleItems.push({
          type: "group",
          group,
          expanded: open
        });
        if (open) {
          for (const row_5 of groupState[group.key]?.rows ?? []) {
            visibleItems.push({
              type: "group-row",
              row: row_5,
              groupKey: group.key
            });
          }
        }
      }
    } else {
      for (const row_6 of rows) {
        visibleItems.push({
          type: "row",
          row: row_6
        });
      }
    }
    $[159] = expanded;
    $[160] = groupBy;
    $[161] = groupState;
    $[162] = groups;
    $[163] = rows;
    $[164] = visibleItems;
  } else {
    visibleItems = $[164];
  }
  let t50;
  if ($[165] === Symbol.for("react.memo_cache_sentinel")) {
    t50 = value => {
      setSearch(value);
      setPagination(_temp8);
    };
    $[165] = t50;
  } else {
    t50 = $[165];
  }
  let t51;
  if ($[166] !== allVisibleSelected || $[167] !== columns || $[168] !== error || $[169] !== filters || $[170] !== getRowId || $[171] !== groupAllSelected || $[172] !== groupBy || $[173] !== groupByColumns || $[174] !== groupLoadingFor || $[175] !== groupPaginationFor || $[176] !== groupRowsFor || $[177] !== groupSomeSelected || $[178] !== groupTotalFor || $[179] !== groups || $[180] !== groupsLoading || $[181] !== groupsTotal || $[182] !== hasMore || $[183] !== hiddenColumns || $[184] !== isGroupExpanded || $[185] !== isSelected || $[186] !== loadMore || $[187] !== loading || $[188] !== loadingMore || $[189] !== pagination || $[190] !== rows || $[191] !== search || $[192] !== selectedIds || $[193] !== selection || $[194] !== setGroupPage || $[195] !== someVisibleSelected || $[196] !== sort || $[197] !== toggleGroup || $[198] !== toggleSelectAll || $[199] !== toggleSelectGroup || $[200] !== total || $[201] !== visibleColumns || $[202] !== visibleItems) {
    t51 = {
      columns,
      getRowId,
      groupByColumns,
      visibleColumns,
      hiddenColumns,
      setColumnHidden,
      search,
      setSearch: t50,
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
      loadMore,
      hasMore,
      loadingMore,
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
      refetch
    };
    $[166] = allVisibleSelected;
    $[167] = columns;
    $[168] = error;
    $[169] = filters;
    $[170] = getRowId;
    $[171] = groupAllSelected;
    $[172] = groupBy;
    $[173] = groupByColumns;
    $[174] = groupLoadingFor;
    $[175] = groupPaginationFor;
    $[176] = groupRowsFor;
    $[177] = groupSomeSelected;
    $[178] = groupTotalFor;
    $[179] = groups;
    $[180] = groupsLoading;
    $[181] = groupsTotal;
    $[182] = hasMore;
    $[183] = hiddenColumns;
    $[184] = isGroupExpanded;
    $[185] = isSelected;
    $[186] = loadMore;
    $[187] = loading;
    $[188] = loadingMore;
    $[189] = pagination;
    $[190] = rows;
    $[191] = search;
    $[192] = selectedIds;
    $[193] = selection;
    $[194] = setGroupPage;
    $[195] = someVisibleSelected;
    $[196] = sort;
    $[197] = toggleGroup;
    $[198] = toggleSelectAll;
    $[199] = toggleSelectGroup;
    $[200] = total;
    $[201] = visibleColumns;
    $[202] = visibleItems;
    $[203] = t51;
  } else {
    t51 = $[203];
  }
  return t51;
}
function _temp8(p_4) {
  return {
    ...p_4,
    page: 1
  };
}
function _temp7(t_0) {
  return t_0 + 1;
}
function _temp6(prev) {
  return {
    ...prev,
    page: 1
  };
}
function _temp5(t) {
  return t + 1;
}
function _temp4(p_2) {
  return {
    ...p_2,
    page: 1
  };
}
function _temp3(p_1) {
  return {
    ...p_1,
    page: 1
  };
}
function _temp2(p_0) {
  return {
    ...p_0,
    page: 1
  };
}
function _temp(p) {
  return {
    ...p,
    page: 1
  };
}