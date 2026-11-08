import { c as _c } from "react/compiler-runtime";
import { startTransition, useEffect, useEffectEvent, useRef, useState } from 'react';
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
  const $ = _c(211);
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
  let t4;
  if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = {};
    $[11] = t4;
  } else {
    t4 = $[11];
  }
  const [filterLabels, setFilterLabels] = useState(t4);
  const [sort, setSortInternal] = useState(initial.params.sort);
  let t5;
  if ($[12] !== initial.params.page || $[13] !== initial.params.pageSize) {
    t5 = {
      page: initial.params.page,
      pageSize: initial.params.pageSize
    };
    $[12] = initial.params.page;
    $[13] = initial.params.pageSize;
    $[14] = t5;
  } else {
    t5 = $[14];
  }
  const [pagination, setPagination] = useState(t5);
  let t6;
  if ($[15] !== initial.result?.rows) {
    t6 = initial.result?.rows ?? [];
    $[15] = initial.result?.rows;
    $[16] = t6;
  } else {
    t6 = $[16];
  }
  const [rows, setRows] = useState(t6);
  const [total, setTotal] = useState(initial.result?.total ?? 0);
  const [loading, setLoading] = useState(!initial.result);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [fetchTick, setFetchTick] = useState(0);
  const [loadedPage, setLoadedPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const generation = useRef(0);
  const [groupBy, setGroupByField] = useState(null);
  let t7;
  if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = [];
    $[17] = t7;
  } else {
    t7 = $[17];
  }
  const [groups, setGroups] = useState(t7);
  const [groupsTotal, setGroupsTotal] = useState(0);
  const [groupsLoading, setGroupsLoading] = useState(false);
  let t8;
  if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = {};
    $[18] = t8;
  } else {
    t8 = $[18];
  }
  const [expanded, setExpanded] = useState(t8);
  let t9;
  if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
    t9 = {};
    $[19] = t9;
  } else {
    t9 = $[19];
  }
  const [groupState, setGroupState] = useState(t9);
  let t10;
  if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = {};
    $[20] = t10;
  } else {
    t10 = $[20];
  }
  const [selection, setSelectionState] = useState(t10);
  let t11;
  let t12;
  if ($[21] !== search || $[22] !== searchDebounceMs) {
    t11 = () => {
      if (!searchDebounceMs) {
        setDebouncedSearch(search);
        return;
      }
      const id = setTimeout(() => startTransition(() => setDebouncedSearch(search)), searchDebounceMs);
      return () => clearTimeout(id);
    };
    t12 = [search, searchDebounceMs];
    $[21] = search;
    $[22] = searchDebounceMs;
    $[23] = t11;
    $[24] = t12;
  } else {
    t11 = $[23];
    t12 = $[24];
  }
  useEffect(t11, t12);
  let t13;
  if ($[25] !== config.data) {
    t13 = rowsKey(config.data);
    $[25] = config.data;
    $[26] = t13;
  } else {
    t13 = $[26];
  }
  const dataKey = t13;
  let t14;
  if ($[27] !== columns || $[28] !== config.applyFilters || $[29] !== config.data || $[30] !== groupBy) {
    t14 = config.data ? createClientEngine({
      data: config.data,
      columns,
      applyFilters: config.applyFilters,
      groupField: groupBy ? row => row[groupBy] : undefined
    }) : null;
    $[27] = columns;
    $[28] = config.applyFilters;
    $[29] = config.data;
    $[30] = groupBy;
    $[31] = t14;
  } else {
    t14 = $[31];
  }
  const clientEngine = t14;
  const fetchRecords = config.fetchRecords ?? clientEngine?.fetchRecords;
  const fetchGroups = config.fetchGroups ?? clientEngine?.fetchGroups;
  let t15;
  if ($[32] !== fetchRecords) {
    t15 = params_0 => fetchRecords?.(params_0);
    $[32] = fetchRecords;
    $[33] = t15;
  } else {
    t15 = $[33];
  }
  const fetchPage = useEffectEvent(t15);
  let t16;
  if ($[34] !== fetchGroups) {
    t16 = params_1 => fetchGroups?.(params_1);
    $[34] = fetchGroups;
    $[35] = t16;
  } else {
    t16 = $[35];
  }
  const fetchGroupPage = useEffectEvent(t16);
  let t17;
  if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
    t17 = next => startTransition(() => {
      setFiltersInternal(next);
      setPagination(_temp);
    });
    $[36] = t17;
  } else {
    t17 = $[36];
  }
  const setFilters = t17;
  let t18;
  if ($[37] !== filterLabels) {
    t18 = (field_0, value) => filterLabels[field_0]?.[value];
    $[37] = filterLabels;
    $[38] = t18;
  } else {
    t18 = $[38];
  }
  const filterLabel = t18;
  let t19;
  if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
    t19 = (field_1, options) => setFilterLabels(known => {
      const fresh = options.filter(option => known[field_1]?.[option.value] !== option.label);
      if (fresh.length === 0) {
        return known;
      }
      const labels = {
        ...known[field_1]
      };
      for (const option_0 of fresh) {
        labels[option_0.value] = option_0.label;
      }
      return {
        ...known,
        [field_1]: labels
      };
    });
    $[39] = t19;
  } else {
    t19 = $[39];
  }
  const rememberFilterLabels = t19;
  let t20;
  if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
    t20 = field_2 => startTransition(() => {
      setGroupByField(field_2);
      setExpanded({});
      setGroupState({});
      setPagination(_temp2);
    });
    $[40] = t20;
  } else {
    t20 = $[40];
  }
  const setGroupBy = t20;
  let t21;
  if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
    t21 = field_3 => startTransition(() => {
      setSortInternal(current_0 => {
        if (!current_0 || current_0.field !== field_3) {
          return {
            field: field_3,
            direction: "asc"
          };
        }
        if (current_0.direction === "asc") {
          return {
            field: field_3,
            direction: "desc"
          };
        }
        return null;
      });
      setPagination(_temp3);
    });
    $[41] = t21;
  } else {
    t21 = $[41];
  }
  const toggleSort = t21;
  let t22;
  if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
    t22 = next_0 => startTransition(() => {
      setSortInternal(next_0);
      setPagination(_temp4);
    });
    $[42] = t22;
  } else {
    t22 = $[42];
  }
  const setSort = t22;
  let t23;
  if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
    t23 = page => startTransition(() => setPagination(p_3 => ({
      ...p_3,
      page
    })));
    $[43] = t23;
  } else {
    t23 = $[43];
  }
  const setPage = t23;
  let t24;
  if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
    t24 = pageSize => startTransition(() => setPagination({
      page: 1,
      pageSize
    }));
    $[44] = t24;
  } else {
    t24 = $[44];
  }
  const setPageSize = t24;
  let t25;
  if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
    t25 = () => setFetchTick(_temp5);
    $[45] = t25;
  } else {
    t25 = $[45];
  }
  const refetch = t25;
  let t26;
  if ($[46] !== config.deps) {
    t26 = JSON.stringify(config.deps ?? []);
    $[46] = config.deps;
    $[47] = t26;
  } else {
    t26 = $[47];
  }
  const depsKey = t26;
  const knownDeps = useRef(depsKey);
  let t27;
  let t28;
  if ($[48] !== depsKey) {
    t27 = () => {
      if (knownDeps.current === depsKey) {
        return;
      }
      knownDeps.current = depsKey;
      setSelectionState({});
      setPagination(_temp6);
      setFetchTick(_temp7);
    };
    t28 = [depsKey];
    $[48] = depsKey;
    $[49] = t27;
    $[50] = t28;
  } else {
    t27 = $[49];
    t28 = $[50];
  }
  useEffect(t27, t28);
  let t29;
  if ($[51] !== cacheKey || $[52] !== debouncedSearch || $[53] !== fetchPage || $[54] !== filters || $[55] !== groupBy || $[56] !== pagination.page || $[57] !== pagination.pageSize || $[58] !== sort) {
    t29 = () => {
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
        startTransition(() => {
          setRows(result.rows);
          setTotal(result.total);
          setLoadedPage(params_2.page);
        });
      }).catch(err => {
        if (!cancelled) {
          startTransition(() => setError(err));
        }
      }).finally(() => {
        if (cancelled) {
          return;
        }
        startTransition(() => {
          setLoading(false);
          setRefreshing(false);
        });
      });
      return () => {
        cancelled = true;
      };
    };
    $[51] = cacheKey;
    $[52] = debouncedSearch;
    $[53] = fetchPage;
    $[54] = filters;
    $[55] = groupBy;
    $[56] = pagination.page;
    $[57] = pagination.pageSize;
    $[58] = sort;
    $[59] = t29;
  } else {
    t29 = $[59];
  }
  let t30;
  if ($[60] !== cacheKey || $[61] !== dataKey || $[62] !== debouncedSearch || $[63] !== fetchTick || $[64] !== filters || $[65] !== groupBy || $[66] !== pagination.page || $[67] !== pagination.pageSize || $[68] !== sort) {
    t30 = [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick, cacheKey];
    $[60] = cacheKey;
    $[61] = dataKey;
    $[62] = debouncedSearch;
    $[63] = fetchTick;
    $[64] = filters;
    $[65] = groupBy;
    $[66] = pagination.page;
    $[67] = pagination.pageSize;
    $[68] = sort;
    $[69] = t30;
  } else {
    t30 = $[69];
  }
  useEffect(t29, t30);
  let t31;
  if ($[70] !== debouncedSearch || $[71] !== fetchGroupPage || $[72] !== filters || $[73] !== groupBy || $[74] !== pagination.page || $[75] !== pagination.pageSize || $[76] !== sort) {
    t31 = () => {
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
        startTransition(() => {
          setGroups(result_0.groups);
          setGroupsTotal(result_0.total);
        });
      }).catch(err_0 => {
        if (!cancelled_0) {
          startTransition(() => setError(err_0));
        }
      }).finally(() => {
        if (!cancelled_0) {
          startTransition(() => setGroupsLoading(false));
        }
      });
      return () => {
        cancelled_0 = true;
      };
    };
    $[70] = debouncedSearch;
    $[71] = fetchGroupPage;
    $[72] = filters;
    $[73] = groupBy;
    $[74] = pagination.page;
    $[75] = pagination.pageSize;
    $[76] = sort;
    $[77] = t31;
  } else {
    t31 = $[77];
  }
  let t32;
  if ($[78] !== dataKey || $[79] !== debouncedSearch || $[80] !== fetchTick || $[81] !== filters || $[82] !== groupBy || $[83] !== pagination.page || $[84] !== pagination.pageSize || $[85] !== sort) {
    t32 = [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick];
    $[78] = dataKey;
    $[79] = debouncedSearch;
    $[80] = fetchTick;
    $[81] = filters;
    $[82] = groupBy;
    $[83] = pagination.page;
    $[84] = pagination.pageSize;
    $[85] = sort;
    $[86] = t32;
  } else {
    t32 = $[86];
  }
  useEffect(t31, t32);
  const hasMore = !groupBy && (pagination.page - 1) * pagination.pageSize + rows.length < total;
  let t33;
  if ($[87] !== debouncedSearch || $[88] !== fetchRecords || $[89] !== filters || $[90] !== hasMore || $[91] !== loadedPage || $[92] !== loading || $[93] !== loadingMore || $[94] !== pagination.pageSize || $[95] !== refreshing || $[96] !== sort) {
    t33 = () => {
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
        startTransition(() => {
          setRows(prev_0 => [...prev_0, ...result_1.rows]);
          setTotal(result_1.total);
          setLoadedPage(page_0);
        });
      }).catch(err_1 => {
        if (generation.current === started) {
          setError(err_1);
        }
      }).finally(() => setLoadingMore(false));
    };
    $[87] = debouncedSearch;
    $[88] = fetchRecords;
    $[89] = filters;
    $[90] = hasMore;
    $[91] = loadedPage;
    $[92] = loading;
    $[93] = loadingMore;
    $[94] = pagination.pageSize;
    $[95] = refreshing;
    $[96] = sort;
    $[97] = t33;
  } else {
    t33 = $[97];
  }
  const loadMore = t33;
  let t34;
  if ($[98] !== debouncedSearch || $[99] !== fetchRecords || $[100] !== filters || $[101] !== groupBy || $[102] !== pagination.pageSize || $[103] !== sort) {
    t34 = (key_0, page_1) => {
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
        startTransition(() => setGroupState(prev_2 => ({
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
        })));
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
    $[98] = debouncedSearch;
    $[99] = fetchRecords;
    $[100] = filters;
    $[101] = groupBy;
    $[102] = pagination.pageSize;
    $[103] = sort;
    $[104] = t34;
  } else {
    t34 = $[104];
  }
  const fetchGroupRows = t34;
  let t35;
  if ($[105] !== expanded || $[106] !== fetchGroupRows || $[107] !== getRowId || $[108] !== groupState) {
    t35 = key_1 => {
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
    $[105] = expanded;
    $[106] = fetchGroupRows;
    $[107] = getRowId;
    $[108] = groupState;
    $[109] = t35;
  } else {
    t35 = $[109];
  }
  const toggleGroup = t35;
  let t36;
  if ($[110] !== fetchGroupRows) {
    t36 = (key_2, page_2) => {
      fetchGroupRows(key_2, page_2);
    };
    $[110] = fetchGroupRows;
    $[111] = t36;
  } else {
    t36 = $[111];
  }
  const setGroupPage = t36;
  let t37;
  if ($[112] !== expanded) {
    t37 = key_3 => Boolean(expanded[key_3]);
    $[112] = expanded;
    $[113] = t37;
  } else {
    t37 = $[113];
  }
  const isGroupExpanded = t37;
  let t38;
  if ($[114] !== groupState) {
    t38 = key_4 => groupState[key_4]?.rows ?? [];
    $[114] = groupState;
    $[115] = t38;
  } else {
    t38 = $[115];
  }
  const groupRowsFor = t38;
  let t39;
  if ($[116] !== groupState) {
    t39 = key_5 => groupState[key_5]?.total ?? 0;
    $[116] = groupState;
    $[117] = t39;
  } else {
    t39 = $[117];
  }
  const groupTotalFor = t39;
  let t40;
  if ($[118] !== groupState) {
    t40 = key_6 => groupState[key_6]?.loading ?? false;
    $[118] = groupState;
    $[119] = t40;
  } else {
    t40 = $[119];
  }
  const groupLoadingFor = t40;
  let t41;
  if ($[120] !== groupState || $[121] !== pagination.pageSize) {
    t41 = key_7 => groupState[key_7]?.pagination ?? {
      page: 1,
      pageSize: pagination.pageSize
    };
    $[120] = groupState;
    $[121] = pagination.pageSize;
    $[122] = t41;
  } else {
    t41 = $[122];
  }
  const groupPaginationFor = t41;
  let t42;
  if ($[123] !== expanded || $[124] !== groupBy || $[125] !== groupState || $[126] !== groups || $[127] !== rows) {
    t42 = groupBy ? groups.flatMap(g => expanded[g.key] ? groupState[g.key]?.rows ?? [] : []) : rows;
    $[123] = expanded;
    $[124] = groupBy;
    $[125] = groupState;
    $[126] = groups;
    $[127] = rows;
    $[128] = t42;
  } else {
    t42 = $[128];
  }
  const selectableRows = t42;
  let t43;
  if ($[129] !== selection) {
    t43 = Object.keys(selection);
    $[129] = selection;
    $[130] = t43;
  } else {
    t43 = $[130];
  }
  let t44;
  if ($[131] !== selection || $[132] !== t43) {
    t44 = t43.filter(id_0 => selection[id_0]);
    $[131] = selection;
    $[132] = t43;
    $[133] = t44;
  } else {
    t44 = $[133];
  }
  const selectedIds = t44;
  let t45;
  if ($[134] !== getRowId || $[135] !== selectableRows || $[136] !== selection) {
    t45 = selectableRows.length > 0 && selectableRows.every(r => selection[getRowId(r)]);
    $[134] = getRowId;
    $[135] = selectableRows;
    $[136] = selection;
    $[137] = t45;
  } else {
    t45 = $[137];
  }
  const allVisibleSelected = t45;
  let t46;
  if ($[138] !== getRowId || $[139] !== selectableRows || $[140] !== selection) {
    let t47;
    if ($[142] !== getRowId || $[143] !== selection) {
      t47 = r_0 => selection[getRowId(r_0)];
      $[142] = getRowId;
      $[143] = selection;
      $[144] = t47;
    } else {
      t47 = $[144];
    }
    t46 = selectableRows.some(t47);
    $[138] = getRowId;
    $[139] = selectableRows;
    $[140] = selection;
    $[141] = t46;
  } else {
    t46 = $[141];
  }
  const someVisibleSelected = t46;
  let t47;
  if ($[145] !== selection) {
    t47 = id_1 => Boolean(selection[id_1]);
    $[145] = selection;
    $[146] = t47;
  } else {
    t47 = $[146];
  }
  const isSelected = t47;
  let t48;
  if ($[147] === Symbol.for("react.memo_cache_sentinel")) {
    t48 = id_2 => {
      setSelectionState(prev_5 => ({
        ...prev_5,
        [id_2]: !prev_5[id_2]
      }));
    };
    $[147] = t48;
  } else {
    t48 = $[147];
  }
  const toggleSelected = t48;
  let t49;
  if ($[148] === Symbol.for("react.memo_cache_sentinel")) {
    t49 = () => setSelectionState({});
    $[148] = t49;
  } else {
    t49 = $[148];
  }
  const clearSelection = t49;
  let t50;
  if ($[149] !== allVisibleSelected || $[150] !== getRowId || $[151] !== selectableRows) {
    t50 = () => {
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
    $[149] = allVisibleSelected;
    $[150] = getRowId;
    $[151] = selectableRows;
    $[152] = t50;
  } else {
    t50 = $[152];
  }
  const toggleSelectAll = t50;
  let t51;
  if ($[153] !== getRowId || $[154] !== groupState || $[155] !== selection) {
    t51 = key_8 => {
      const rows_1 = groupState[key_8]?.rows ?? [];
      return rows_1.length > 0 && rows_1.every(r_1 => selection[getRowId(r_1)]);
    };
    $[153] = getRowId;
    $[154] = groupState;
    $[155] = selection;
    $[156] = t51;
  } else {
    t51 = $[156];
  }
  const groupAllSelected = t51;
  let t52;
  if ($[157] !== getRowId || $[158] !== groupState || $[159] !== selection) {
    t52 = key_9 => {
      const rows_2 = groupState[key_9]?.rows ?? [];
      return rows_2.some(r_2 => selection[getRowId(r_2)]);
    };
    $[157] = getRowId;
    $[158] = groupState;
    $[159] = selection;
    $[160] = t52;
  } else {
    t52 = $[160];
  }
  const groupSomeSelected = t52;
  let t53;
  if ($[161] !== getRowId || $[162] !== groupState || $[163] !== selection) {
    t53 = key_10 => {
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
    $[161] = getRowId;
    $[162] = groupState;
    $[163] = selection;
    $[164] = t53;
  } else {
    t53 = $[164];
  }
  const toggleSelectGroup = t53;
  let visibleItems;
  if ($[165] !== expanded || $[166] !== groupBy || $[167] !== groupState || $[168] !== groups || $[169] !== rows) {
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
    $[165] = expanded;
    $[166] = groupBy;
    $[167] = groupState;
    $[168] = groups;
    $[169] = rows;
    $[170] = visibleItems;
  } else {
    visibleItems = $[170];
  }
  let t54;
  if ($[171] === Symbol.for("react.memo_cache_sentinel")) {
    t54 = value_0 => {
      setSearch(value_0);
      setPagination(_temp8);
    };
    $[171] = t54;
  } else {
    t54 = $[171];
  }
  let t55;
  if ($[172] !== allVisibleSelected || $[173] !== columns || $[174] !== error || $[175] !== filterLabel || $[176] !== filters || $[177] !== getRowId || $[178] !== groupAllSelected || $[179] !== groupBy || $[180] !== groupByColumns || $[181] !== groupLoadingFor || $[182] !== groupPaginationFor || $[183] !== groupRowsFor || $[184] !== groupSomeSelected || $[185] !== groupTotalFor || $[186] !== groups || $[187] !== groupsLoading || $[188] !== groupsTotal || $[189] !== hasMore || $[190] !== hiddenColumns || $[191] !== isGroupExpanded || $[192] !== isSelected || $[193] !== loadMore || $[194] !== loading || $[195] !== loadingMore || $[196] !== pagination || $[197] !== rows || $[198] !== search || $[199] !== selectedIds || $[200] !== selection || $[201] !== setGroupPage || $[202] !== someVisibleSelected || $[203] !== sort || $[204] !== toggleGroup || $[205] !== toggleSelectAll || $[206] !== toggleSelectGroup || $[207] !== total || $[208] !== visibleColumns || $[209] !== visibleItems) {
    t55 = {
      columns,
      getRowId,
      groupByColumns,
      visibleColumns,
      hiddenColumns,
      setColumnHidden,
      search,
      setSearch: t54,
      filters,
      setFilters,
      filterLabel,
      rememberFilterLabels,
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
    $[172] = allVisibleSelected;
    $[173] = columns;
    $[174] = error;
    $[175] = filterLabel;
    $[176] = filters;
    $[177] = getRowId;
    $[178] = groupAllSelected;
    $[179] = groupBy;
    $[180] = groupByColumns;
    $[181] = groupLoadingFor;
    $[182] = groupPaginationFor;
    $[183] = groupRowsFor;
    $[184] = groupSomeSelected;
    $[185] = groupTotalFor;
    $[186] = groups;
    $[187] = groupsLoading;
    $[188] = groupsTotal;
    $[189] = hasMore;
    $[190] = hiddenColumns;
    $[191] = isGroupExpanded;
    $[192] = isSelected;
    $[193] = loadMore;
    $[194] = loading;
    $[195] = loadingMore;
    $[196] = pagination;
    $[197] = rows;
    $[198] = search;
    $[199] = selectedIds;
    $[200] = selection;
    $[201] = setGroupPage;
    $[202] = someVisibleSelected;
    $[203] = sort;
    $[204] = toggleGroup;
    $[205] = toggleSelectAll;
    $[206] = toggleSelectGroup;
    $[207] = total;
    $[208] = visibleColumns;
    $[209] = visibleItems;
    $[210] = t55;
  } else {
    t55 = $[210];
  }
  return t55;
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