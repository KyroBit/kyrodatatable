import { c as _c } from "react/compiler-runtime";
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { cachedResult, entryKey, firstPage, load } from './cache.js';
import { createClientEngine } from './clientEngine.js';
const rowIds = new WeakMap();
let lastRowId = 0;
const idOf = row => {
  if (typeof row !== 'object' || row === null) return 0;
  const known = rowIds.get(row);
  if (known !== undefined) return known;
  lastRowId += 1;
  rowIds.set(row, lastRowId);
  return lastRowId;
};
const rowsKey = rows => rows === undefined ? undefined : `${rows.length}:${rows.reduce((hash, row) => Math.imul(hash, 31) + idOf(row) | 0, 7)}`;
export function useDataTable(config) {
  const $ = _c(206);
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
  let t12;
  if ($[24] !== config.data) {
    t12 = rowsKey(config.data);
    $[24] = config.data;
    $[25] = t12;
  } else {
    t12 = $[25];
  }
  const dataKey = t12;
  let t13;
  if ($[26] !== columns || $[27] !== config.applyFilters || $[28] !== config.data || $[29] !== groupBy) {
    t13 = config.data ? createClientEngine({
      data: config.data,
      columns,
      applyFilters: config.applyFilters,
      groupField: groupBy ? row => row[groupBy] : undefined
    }) : null;
    $[26] = columns;
    $[27] = config.applyFilters;
    $[28] = config.data;
    $[29] = groupBy;
    $[30] = t13;
  } else {
    t13 = $[30];
  }
  const clientEngine = t13;
  const fetchRecords = config.fetchRecords ?? clientEngine?.fetchRecords;
  const fetchGroups = config.fetchGroups ?? clientEngine?.fetchGroups;
  let t14;
  if ($[31] !== fetchRecords) {
    t14 = params_0 => fetchRecords?.(params_0);
    $[31] = fetchRecords;
    $[32] = t14;
  } else {
    t14 = $[32];
  }
  const fetchPage = useEffectEvent(t14);
  let t15;
  if ($[33] !== fetchGroups) {
    t15 = params_1 => fetchGroups?.(params_1);
    $[33] = fetchGroups;
    $[34] = t15;
  } else {
    t15 = $[34];
  }
  const fetchGroupPage = useEffectEvent(t15);
  let t16;
  if ($[35] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = next => {
      setFiltersInternal(next);
      setPagination(_temp);
    };
    $[35] = t16;
  } else {
    t16 = $[35];
  }
  const setFilters = t16;
  let t17;
  if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
    t17 = field_0 => {
      setGroupByField(field_0);
      setExpanded({});
      setGroupState({});
      setPagination(_temp2);
    };
    $[36] = t17;
  } else {
    t17 = $[36];
  }
  const setGroupBy = t17;
  let t18;
  if ($[37] === Symbol.for("react.memo_cache_sentinel")) {
    t18 = field_1 => {
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
    $[37] = t18;
  } else {
    t18 = $[37];
  }
  const toggleSort = t18;
  let t19;
  if ($[38] === Symbol.for("react.memo_cache_sentinel")) {
    t19 = next_0 => {
      setSortInternal(next_0);
      setPagination(_temp4);
    };
    $[38] = t19;
  } else {
    t19 = $[38];
  }
  const setSort = t19;
  let t20;
  if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
    t20 = page => {
      setPagination(p_3 => ({
        ...p_3,
        page
      }));
    };
    $[39] = t20;
  } else {
    t20 = $[39];
  }
  const setPage = t20;
  let t21;
  if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
    t21 = pageSize => {
      setPagination({
        page: 1,
        pageSize
      });
    };
    $[40] = t21;
  } else {
    t21 = $[40];
  }
  const setPageSize = t21;
  let t22;
  if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
    t22 = () => setFetchTick(_temp5);
    $[41] = t22;
  } else {
    t22 = $[41];
  }
  const refetch = t22;
  let t23;
  if ($[42] !== config.deps) {
    t23 = JSON.stringify(config.deps ?? []);
    $[42] = config.deps;
    $[43] = t23;
  } else {
    t23 = $[43];
  }
  const depsKey = t23;
  const knownDeps = useRef(depsKey);
  let t24;
  let t25;
  if ($[44] !== depsKey) {
    t24 = () => {
      if (knownDeps.current === depsKey) {
        return;
      }
      knownDeps.current = depsKey;
      setSelectionState({});
      setPagination(_temp6);
      setFetchTick(_temp7);
    };
    t25 = [depsKey];
    $[44] = depsKey;
    $[45] = t24;
    $[46] = t25;
  } else {
    t24 = $[45];
    t25 = $[46];
  }
  useEffect(t24, t25);
  let t26;
  if ($[47] !== cacheKey || $[48] !== debouncedSearch || $[49] !== fetchPage || $[50] !== filters || $[51] !== groupBy || $[52] !== pagination.page || $[53] !== pagination.pageSize || $[54] !== sort) {
    t26 = () => {
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
    $[47] = cacheKey;
    $[48] = debouncedSearch;
    $[49] = fetchPage;
    $[50] = filters;
    $[51] = groupBy;
    $[52] = pagination.page;
    $[53] = pagination.pageSize;
    $[54] = sort;
    $[55] = t26;
  } else {
    t26 = $[55];
  }
  let t27;
  if ($[56] !== cacheKey || $[57] !== dataKey || $[58] !== debouncedSearch || $[59] !== fetchTick || $[60] !== filters || $[61] !== groupBy || $[62] !== pagination.page || $[63] !== pagination.pageSize || $[64] !== sort) {
    t27 = [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick, cacheKey];
    $[56] = cacheKey;
    $[57] = dataKey;
    $[58] = debouncedSearch;
    $[59] = fetchTick;
    $[60] = filters;
    $[61] = groupBy;
    $[62] = pagination.page;
    $[63] = pagination.pageSize;
    $[64] = sort;
    $[65] = t27;
  } else {
    t27 = $[65];
  }
  useEffect(t26, t27);
  let t28;
  if ($[66] !== debouncedSearch || $[67] !== fetchGroupPage || $[68] !== filters || $[69] !== groupBy || $[70] !== pagination.page || $[71] !== pagination.pageSize || $[72] !== sort) {
    t28 = () => {
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
    $[66] = debouncedSearch;
    $[67] = fetchGroupPage;
    $[68] = filters;
    $[69] = groupBy;
    $[70] = pagination.page;
    $[71] = pagination.pageSize;
    $[72] = sort;
    $[73] = t28;
  } else {
    t28 = $[73];
  }
  let t29;
  if ($[74] !== dataKey || $[75] !== debouncedSearch || $[76] !== fetchTick || $[77] !== filters || $[78] !== groupBy || $[79] !== pagination.page || $[80] !== pagination.pageSize || $[81] !== sort) {
    t29 = [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick];
    $[74] = dataKey;
    $[75] = debouncedSearch;
    $[76] = fetchTick;
    $[77] = filters;
    $[78] = groupBy;
    $[79] = pagination.page;
    $[80] = pagination.pageSize;
    $[81] = sort;
    $[82] = t29;
  } else {
    t29 = $[82];
  }
  useEffect(t28, t29);
  const hasMore = !groupBy && (pagination.page - 1) * pagination.pageSize + rows.length < total;
  let t30;
  if ($[83] !== debouncedSearch || $[84] !== fetchRecords || $[85] !== filters || $[86] !== hasMore || $[87] !== loadedPage || $[88] !== loading || $[89] !== loadingMore || $[90] !== pagination.pageSize || $[91] !== refreshing || $[92] !== sort) {
    t30 = () => {
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
    $[83] = debouncedSearch;
    $[84] = fetchRecords;
    $[85] = filters;
    $[86] = hasMore;
    $[87] = loadedPage;
    $[88] = loading;
    $[89] = loadingMore;
    $[90] = pagination.pageSize;
    $[91] = refreshing;
    $[92] = sort;
    $[93] = t30;
  } else {
    t30 = $[93];
  }
  const loadMore = t30;
  let t31;
  if ($[94] !== debouncedSearch || $[95] !== fetchRecords || $[96] !== filters || $[97] !== groupBy || $[98] !== pagination.pageSize || $[99] !== sort) {
    t31 = (key_0, page_1) => {
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
    $[94] = debouncedSearch;
    $[95] = fetchRecords;
    $[96] = filters;
    $[97] = groupBy;
    $[98] = pagination.pageSize;
    $[99] = sort;
    $[100] = t31;
  } else {
    t31 = $[100];
  }
  const fetchGroupRows = t31;
  let t32;
  if ($[101] !== expanded || $[102] !== fetchGroupRows || $[103] !== getRowId || $[104] !== groupState) {
    t32 = key_1 => {
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
    $[101] = expanded;
    $[102] = fetchGroupRows;
    $[103] = getRowId;
    $[104] = groupState;
    $[105] = t32;
  } else {
    t32 = $[105];
  }
  const toggleGroup = t32;
  let t33;
  if ($[106] !== fetchGroupRows) {
    t33 = (key_2, page_2) => {
      fetchGroupRows(key_2, page_2);
    };
    $[106] = fetchGroupRows;
    $[107] = t33;
  } else {
    t33 = $[107];
  }
  const setGroupPage = t33;
  let t34;
  if ($[108] !== expanded) {
    t34 = key_3 => Boolean(expanded[key_3]);
    $[108] = expanded;
    $[109] = t34;
  } else {
    t34 = $[109];
  }
  const isGroupExpanded = t34;
  let t35;
  if ($[110] !== groupState) {
    t35 = key_4 => groupState[key_4]?.rows ?? [];
    $[110] = groupState;
    $[111] = t35;
  } else {
    t35 = $[111];
  }
  const groupRowsFor = t35;
  let t36;
  if ($[112] !== groupState) {
    t36 = key_5 => groupState[key_5]?.total ?? 0;
    $[112] = groupState;
    $[113] = t36;
  } else {
    t36 = $[113];
  }
  const groupTotalFor = t36;
  let t37;
  if ($[114] !== groupState) {
    t37 = key_6 => groupState[key_6]?.loading ?? false;
    $[114] = groupState;
    $[115] = t37;
  } else {
    t37 = $[115];
  }
  const groupLoadingFor = t37;
  let t38;
  if ($[116] !== groupState || $[117] !== pagination.pageSize) {
    t38 = key_7 => groupState[key_7]?.pagination ?? {
      page: 1,
      pageSize: pagination.pageSize
    };
    $[116] = groupState;
    $[117] = pagination.pageSize;
    $[118] = t38;
  } else {
    t38 = $[118];
  }
  const groupPaginationFor = t38;
  let t39;
  if ($[119] !== expanded || $[120] !== groupBy || $[121] !== groupState || $[122] !== groups || $[123] !== rows) {
    t39 = groupBy ? groups.flatMap(g => expanded[g.key] ? groupState[g.key]?.rows ?? [] : []) : rows;
    $[119] = expanded;
    $[120] = groupBy;
    $[121] = groupState;
    $[122] = groups;
    $[123] = rows;
    $[124] = t39;
  } else {
    t39 = $[124];
  }
  const selectableRows = t39;
  let t40;
  if ($[125] !== selection) {
    t40 = Object.keys(selection);
    $[125] = selection;
    $[126] = t40;
  } else {
    t40 = $[126];
  }
  let t41;
  if ($[127] !== selection || $[128] !== t40) {
    t41 = t40.filter(id_0 => selection[id_0]);
    $[127] = selection;
    $[128] = t40;
    $[129] = t41;
  } else {
    t41 = $[129];
  }
  const selectedIds = t41;
  let t42;
  if ($[130] !== getRowId || $[131] !== selectableRows || $[132] !== selection) {
    t42 = selectableRows.length > 0 && selectableRows.every(r => selection[getRowId(r)]);
    $[130] = getRowId;
    $[131] = selectableRows;
    $[132] = selection;
    $[133] = t42;
  } else {
    t42 = $[133];
  }
  const allVisibleSelected = t42;
  let t43;
  if ($[134] !== getRowId || $[135] !== selectableRows || $[136] !== selection) {
    let t44;
    if ($[138] !== getRowId || $[139] !== selection) {
      t44 = r_0 => selection[getRowId(r_0)];
      $[138] = getRowId;
      $[139] = selection;
      $[140] = t44;
    } else {
      t44 = $[140];
    }
    t43 = selectableRows.some(t44);
    $[134] = getRowId;
    $[135] = selectableRows;
    $[136] = selection;
    $[137] = t43;
  } else {
    t43 = $[137];
  }
  const someVisibleSelected = t43;
  let t44;
  if ($[141] !== selection) {
    t44 = id_1 => Boolean(selection[id_1]);
    $[141] = selection;
    $[142] = t44;
  } else {
    t44 = $[142];
  }
  const isSelected = t44;
  let t45;
  if ($[143] === Symbol.for("react.memo_cache_sentinel")) {
    t45 = id_2 => {
      setSelectionState(prev_5 => ({
        ...prev_5,
        [id_2]: !prev_5[id_2]
      }));
    };
    $[143] = t45;
  } else {
    t45 = $[143];
  }
  const toggleSelected = t45;
  let t46;
  if ($[144] === Symbol.for("react.memo_cache_sentinel")) {
    t46 = () => setSelectionState({});
    $[144] = t46;
  } else {
    t46 = $[144];
  }
  const clearSelection = t46;
  let t47;
  if ($[145] !== allVisibleSelected || $[146] !== getRowId || $[147] !== selectableRows) {
    t47 = () => {
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
    $[145] = allVisibleSelected;
    $[146] = getRowId;
    $[147] = selectableRows;
    $[148] = t47;
  } else {
    t47 = $[148];
  }
  const toggleSelectAll = t47;
  let t48;
  if ($[149] !== getRowId || $[150] !== groupState || $[151] !== selection) {
    t48 = key_8 => {
      const rows_1 = groupState[key_8]?.rows ?? [];
      return rows_1.length > 0 && rows_1.every(r_1 => selection[getRowId(r_1)]);
    };
    $[149] = getRowId;
    $[150] = groupState;
    $[151] = selection;
    $[152] = t48;
  } else {
    t48 = $[152];
  }
  const groupAllSelected = t48;
  let t49;
  if ($[153] !== getRowId || $[154] !== groupState || $[155] !== selection) {
    t49 = key_9 => {
      const rows_2 = groupState[key_9]?.rows ?? [];
      return rows_2.some(r_2 => selection[getRowId(r_2)]);
    };
    $[153] = getRowId;
    $[154] = groupState;
    $[155] = selection;
    $[156] = t49;
  } else {
    t49 = $[156];
  }
  const groupSomeSelected = t49;
  let t50;
  if ($[157] !== getRowId || $[158] !== groupState || $[159] !== selection) {
    t50 = key_10 => {
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
    $[157] = getRowId;
    $[158] = groupState;
    $[159] = selection;
    $[160] = t50;
  } else {
    t50 = $[160];
  }
  const toggleSelectGroup = t50;
  let visibleItems;
  if ($[161] !== expanded || $[162] !== groupBy || $[163] !== groupState || $[164] !== groups || $[165] !== rows) {
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
    $[161] = expanded;
    $[162] = groupBy;
    $[163] = groupState;
    $[164] = groups;
    $[165] = rows;
    $[166] = visibleItems;
  } else {
    visibleItems = $[166];
  }
  let t51;
  if ($[167] === Symbol.for("react.memo_cache_sentinel")) {
    t51 = value => {
      setSearch(value);
      setPagination(_temp8);
    };
    $[167] = t51;
  } else {
    t51 = $[167];
  }
  let t52;
  if ($[168] !== allVisibleSelected || $[169] !== columns || $[170] !== error || $[171] !== filters || $[172] !== getRowId || $[173] !== groupAllSelected || $[174] !== groupBy || $[175] !== groupByColumns || $[176] !== groupLoadingFor || $[177] !== groupPaginationFor || $[178] !== groupRowsFor || $[179] !== groupSomeSelected || $[180] !== groupTotalFor || $[181] !== groups || $[182] !== groupsLoading || $[183] !== groupsTotal || $[184] !== hasMore || $[185] !== hiddenColumns || $[186] !== isGroupExpanded || $[187] !== isSelected || $[188] !== loadMore || $[189] !== loading || $[190] !== loadingMore || $[191] !== pagination || $[192] !== rows || $[193] !== search || $[194] !== selectedIds || $[195] !== selection || $[196] !== setGroupPage || $[197] !== someVisibleSelected || $[198] !== sort || $[199] !== toggleGroup || $[200] !== toggleSelectAll || $[201] !== toggleSelectGroup || $[202] !== total || $[203] !== visibleColumns || $[204] !== visibleItems) {
    t52 = {
      columns,
      getRowId,
      groupByColumns,
      visibleColumns,
      hiddenColumns,
      setColumnHidden,
      search,
      setSearch: t51,
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
    $[168] = allVisibleSelected;
    $[169] = columns;
    $[170] = error;
    $[171] = filters;
    $[172] = getRowId;
    $[173] = groupAllSelected;
    $[174] = groupBy;
    $[175] = groupByColumns;
    $[176] = groupLoadingFor;
    $[177] = groupPaginationFor;
    $[178] = groupRowsFor;
    $[179] = groupSomeSelected;
    $[180] = groupTotalFor;
    $[181] = groups;
    $[182] = groupsLoading;
    $[183] = groupsTotal;
    $[184] = hasMore;
    $[185] = hiddenColumns;
    $[186] = isGroupExpanded;
    $[187] = isSelected;
    $[188] = loadMore;
    $[189] = loading;
    $[190] = loadingMore;
    $[191] = pagination;
    $[192] = rows;
    $[193] = search;
    $[194] = selectedIds;
    $[195] = selection;
    $[196] = setGroupPage;
    $[197] = someVisibleSelected;
    $[198] = sort;
    $[199] = toggleGroup;
    $[200] = toggleSelectAll;
    $[201] = toggleSelectGroup;
    $[202] = total;
    $[203] = visibleColumns;
    $[204] = visibleItems;
    $[205] = t52;
  } else {
    t52 = $[205];
  }
  return t52;
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