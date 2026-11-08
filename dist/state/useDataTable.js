import { c as _c } from "react/compiler-runtime";
import { startTransition, useEffect, useEffectEvent, useRef, useState } from 'react';
import { cachedList, entryKey, firstPage, load, rememberLastPage } from './cache.js';
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
const enqueue = (queue, request) => {
  const next = queue.current.then(request);
  queue.current = next.catch(() => undefined);
  return next;
};
export function useDataTable(config) {
  const $ = _c(215);
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
        result: cacheKey === undefined ? undefined : cachedList(cacheKey, params)
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
  const [error, setError] = useState(null);
  const [fetchTick, setFetchTick] = useState(0);
  const [loadedPage, setLoadedPage] = useState(initial.result?.lastPage ?? 1);
  const [loadingMore, setLoadingMore] = useState(false);
  const generation = useRef(0);
  let t7;
  if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = Promise.resolve();
    $[17] = t7;
  } else {
    t7 = $[17];
  }
  const queue = useRef(t7);
  const requestedMore = useRef(null);
  const [groupBy, setGroupByField] = useState(null);
  let t8;
  if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = [];
    $[18] = t8;
  } else {
    t8 = $[18];
  }
  const [groups, setGroups] = useState(t8);
  const [groupsTotal, setGroupsTotal] = useState(0);
  const [groupsLoading, setGroupsLoading] = useState(false);
  let t9;
  if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
    t9 = {};
    $[19] = t9;
  } else {
    t9 = $[19];
  }
  const [expanded, setExpanded] = useState(t9);
  let t10;
  if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = {};
    $[20] = t10;
  } else {
    t10 = $[20];
  }
  const [groupState, setGroupState] = useState(t10);
  let t11;
  if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
    t11 = {};
    $[21] = t11;
  } else {
    t11 = $[21];
  }
  const [selection, setSelectionState] = useState(t11);
  let t12;
  let t13;
  if ($[22] !== search || $[23] !== searchDebounceMs) {
    t12 = () => {
      if (!searchDebounceMs) {
        setDebouncedSearch(search);
        return;
      }
      const id = setTimeout(() => startTransition(() => setDebouncedSearch(search)), searchDebounceMs);
      return () => clearTimeout(id);
    };
    t13 = [search, searchDebounceMs];
    $[22] = search;
    $[23] = searchDebounceMs;
    $[24] = t12;
    $[25] = t13;
  } else {
    t12 = $[24];
    t13 = $[25];
  }
  useEffect(t12, t13);
  let t14;
  if ($[26] !== config.data) {
    t14 = rowsKey(config.data);
    $[26] = config.data;
    $[27] = t14;
  } else {
    t14 = $[27];
  }
  const dataKey = t14;
  let t15;
  if ($[28] !== columns || $[29] !== config.applyFilters || $[30] !== config.data || $[31] !== groupBy) {
    t15 = config.data ? createClientEngine({
      data: config.data,
      columns,
      applyFilters: config.applyFilters,
      groupField: groupBy ? row => row[groupBy] : undefined
    }) : null;
    $[28] = columns;
    $[29] = config.applyFilters;
    $[30] = config.data;
    $[31] = groupBy;
    $[32] = t15;
  } else {
    t15 = $[32];
  }
  const clientEngine = t15;
  const fetchRecords = config.fetchRecords ?? clientEngine?.fetchRecords;
  const fetchGroups = config.fetchGroups ?? clientEngine?.fetchGroups;
  let t16;
  if ($[33] !== fetchRecords) {
    t16 = params_0 => fetchRecords?.(params_0);
    $[33] = fetchRecords;
    $[34] = t16;
  } else {
    t16 = $[34];
  }
  const fetchPage = useEffectEvent(t16);
  let t17;
  if ($[35] !== fetchGroups) {
    t17 = params_1 => fetchGroups?.(params_1);
    $[35] = fetchGroups;
    $[36] = t17;
  } else {
    t17 = $[36];
  }
  const fetchGroupPage = useEffectEvent(t17);
  let t18;
  if ($[37] === Symbol.for("react.memo_cache_sentinel")) {
    t18 = next => startTransition(() => {
      setFiltersInternal(next);
      setPagination(_temp);
    });
    $[37] = t18;
  } else {
    t18 = $[37];
  }
  const setFilters = t18;
  let t19;
  if ($[38] !== filterLabels) {
    t19 = (field_0, value) => filterLabels[field_0]?.[value];
    $[38] = filterLabels;
    $[39] = t19;
  } else {
    t19 = $[39];
  }
  const filterLabel = t19;
  let t20;
  if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
    t20 = (field_1, options) => setFilterLabels(known => {
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
    $[40] = t20;
  } else {
    t20 = $[40];
  }
  const rememberFilterLabels = t20;
  let t21;
  if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
    t21 = field_2 => startTransition(() => {
      setGroupByField(field_2);
      setExpanded({});
      setGroupState({});
      setPagination(_temp2);
    });
    $[41] = t21;
  } else {
    t21 = $[41];
  }
  const setGroupBy = t21;
  let t22;
  if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
    t22 = field_3 => startTransition(() => {
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
    $[42] = t22;
  } else {
    t22 = $[42];
  }
  const toggleSort = t22;
  let t23;
  if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
    t23 = next_0 => startTransition(() => {
      setSortInternal(next_0);
      setPagination(_temp4);
    });
    $[43] = t23;
  } else {
    t23 = $[43];
  }
  const setSort = t23;
  let t24;
  if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
    t24 = page => startTransition(() => setPagination(p_3 => ({
      ...p_3,
      page
    })));
    $[44] = t24;
  } else {
    t24 = $[44];
  }
  const setPage = t24;
  let t25;
  if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
    t25 = pageSize => startTransition(() => setPagination({
      page: 1,
      pageSize
    }));
    $[45] = t25;
  } else {
    t25 = $[45];
  }
  const setPageSize = t25;
  let t26;
  if ($[46] === Symbol.for("react.memo_cache_sentinel")) {
    t26 = () => setFetchTick(_temp5);
    $[46] = t26;
  } else {
    t26 = $[46];
  }
  const refetch = t26;
  let t27;
  if ($[47] !== config.deps) {
    t27 = JSON.stringify(config.deps ?? []);
    $[47] = config.deps;
    $[48] = t27;
  } else {
    t27 = $[48];
  }
  const depsKey = t27;
  const knownDeps = useRef(depsKey);
  let t28;
  let t29;
  if ($[49] !== depsKey) {
    t28 = () => {
      if (knownDeps.current === depsKey) {
        return;
      }
      knownDeps.current = depsKey;
      setSelectionState({});
      setPagination(_temp6);
      setFetchTick(_temp7);
    };
    t29 = [depsKey];
    $[49] = depsKey;
    $[50] = t28;
    $[51] = t29;
  } else {
    t28 = $[50];
    t29 = $[51];
  }
  useEffect(t28, t29);
  const t30 = filters;
  let listParams;
  let t31;
  if ($[52] !== cacheKey || $[53] !== debouncedSearch || $[54] !== pagination.page || $[55] !== pagination.pageSize || $[56] !== sort || $[57] !== t30) {
    listParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: debouncedSearch,
      sort,
      filters: t30
    };
    t31 = entryKey(cacheKey ?? "", listParams);
    $[52] = cacheKey;
    $[53] = debouncedSearch;
    $[54] = pagination.page;
    $[55] = pagination.pageSize;
    $[56] = sort;
    $[57] = t30;
    $[58] = listParams;
    $[59] = t31;
  } else {
    listParams = $[58];
    t31 = $[59];
  }
  const listKey = t31;
  let t32;
  if ($[60] !== cacheKey || $[61] !== fetchPage || $[62] !== groupBy || $[63] !== listParams) {
    t32 = () => {
      if (groupBy) {
        return;
      }
      let cancelled = false;
      const restored = cacheKey === undefined ? undefined : cachedList(cacheKey, listParams);
      const setList = list => {
        setRows(list.rows);
        setTotal(list.total);
        setLoadedPage(list.lastPage);
      };
      const show = list_0 => startTransition(() => setList(list_0));
      if (restored) {
        setList(restored);
      }
      setLoading(!restored);
      setLoadingMore(false);
      setError(null);
      requestedMore.current = null;
      const pending = cacheKey === undefined ? fetchPage(listParams) : load(entryKey(cacheKey, listParams), () => fetchPage(listParams));
      if (!pending) {
        return;
      }
      generation.current = generation.current + 1;
      queue.current = pending.catch(_temp8);
      const refreshFrom = page_0 => {
        if (cancelled || cacheKey === undefined || page_0 > (restored?.lastPage ?? 0)) {
          return;
        }
        const pageParams = {
          ...listParams,
          page: page_0
        };
        return enqueue(queue, () => load(entryKey(cacheKey, pageParams), () => fetchPage(pageParams))).then(() => {
          if (cancelled) {
            return;
          }
          show(cachedList(cacheKey, listParams));
          return refreshFrom(page_0 + 1);
        });
      };
      pending.then(first => {
        if (cancelled) {
          return;
        }
        show(cacheKey === undefined ? {
          ...first,
          lastPage: listParams.page
        } : cachedList(cacheKey, listParams));
        startTransition(() => setLoading(false));
        return refreshFrom(listParams.page + 1);
      }).catch(err => {
        if (cancelled) {
          return;
        }
        startTransition(() => {
          setError(err);
          setLoading(false);
        });
      });
      return () => {
        cancelled = true;
      };
    };
    $[60] = cacheKey;
    $[61] = fetchPage;
    $[62] = groupBy;
    $[63] = listParams;
    $[64] = t32;
  } else {
    t32 = $[64];
  }
  let t33;
  if ($[65] !== cacheKey || $[66] !== dataKey || $[67] !== debouncedSearch || $[68] !== fetchTick || $[69] !== filters || $[70] !== groupBy || $[71] !== pagination.page || $[72] !== pagination.pageSize || $[73] !== sort) {
    t33 = [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick, cacheKey];
    $[65] = cacheKey;
    $[66] = dataKey;
    $[67] = debouncedSearch;
    $[68] = fetchTick;
    $[69] = filters;
    $[70] = groupBy;
    $[71] = pagination.page;
    $[72] = pagination.pageSize;
    $[73] = sort;
    $[74] = t33;
  } else {
    t33 = $[74];
  }
  useEffect(t32, t33);
  let t34;
  if ($[75] !== debouncedSearch || $[76] !== fetchGroupPage || $[77] !== filters || $[78] !== groupBy || $[79] !== pagination.page || $[80] !== pagination.pageSize || $[81] !== sort) {
    t34 = () => {
      if (!groupBy) {
        return;
      }
      const params_2 = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sort,
        filters: filters,
        groupBy
      };
      const pending_0 = fetchGroupPage(params_2);
      if (!pending_0) {
        return;
      }
      let cancelled_0 = false;
      setGroupsLoading(true);
      pending_0.then(result => {
        if (cancelled_0) {
          return;
        }
        startTransition(() => {
          setGroups(result.groups);
          setGroupsTotal(result.total);
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
    $[75] = debouncedSearch;
    $[76] = fetchGroupPage;
    $[77] = filters;
    $[78] = groupBy;
    $[79] = pagination.page;
    $[80] = pagination.pageSize;
    $[81] = sort;
    $[82] = t34;
  } else {
    t34 = $[82];
  }
  let t35;
  if ($[83] !== dataKey || $[84] !== debouncedSearch || $[85] !== fetchTick || $[86] !== filters || $[87] !== groupBy || $[88] !== pagination.page || $[89] !== pagination.pageSize || $[90] !== sort) {
    t35 = [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick];
    $[83] = dataKey;
    $[84] = debouncedSearch;
    $[85] = fetchTick;
    $[86] = filters;
    $[87] = groupBy;
    $[88] = pagination.page;
    $[89] = pagination.pageSize;
    $[90] = sort;
    $[91] = t35;
  } else {
    t35 = $[91];
  }
  useEffect(t34, t35);
  const hasMore = !groupBy && (pagination.page - 1) * pagination.pageSize + rows.length < total;
  let t36;
  if ($[92] !== cacheKey || $[93] !== fetchRecords || $[94] !== hasMore || $[95] !== listKey || $[96] !== listParams || $[97] !== loadedPage || $[98] !== loading) {
    t36 = () => {
      const page_1 = loadedPage + 1;
      const params_3 = {
        ...listParams,
        page: page_1
      };
      const key = entryKey(cacheKey ?? "", params_3);
      if (!fetchRecords || !hasMore || loading || requestedMore.current === key) {
        return;
      }
      requestedMore.current = key;
      const started = generation.current;
      setLoadingMore(true);
      enqueue(queue, () => cacheKey === undefined ? fetchRecords(params_3) : load(key, () => fetchRecords(params_3))).then(result_0 => {
        if (generation.current !== started) {
          return;
        }
        if (cacheKey !== undefined) {
          rememberLastPage(listKey, page_1);
        }
        startTransition(() => {
          setRows(prev_0 => [...prev_0, ...result_0.rows]);
          setTotal(result_0.total);
          setLoadedPage(page_1);
          setLoadingMore(false);
        });
      }).catch(err_1 => {
        requestedMore.current = null;
        if (generation.current !== started) {
          return;
        }
        startTransition(() => {
          setError(err_1);
          setLoadingMore(false);
        });
      });
    };
    $[92] = cacheKey;
    $[93] = fetchRecords;
    $[94] = hasMore;
    $[95] = listKey;
    $[96] = listParams;
    $[97] = loadedPage;
    $[98] = loading;
    $[99] = t36;
  } else {
    t36 = $[99];
  }
  const loadMore = t36;
  let t37;
  if ($[100] !== debouncedSearch || $[101] !== fetchRecords || $[102] !== filters || $[103] !== groupBy || $[104] !== pagination.pageSize || $[105] !== sort) {
    t37 = (key_0, page_2) => {
      if (!groupBy || !fetchRecords) {
        return;
      }
      setGroupState(prev_1 => ({
        ...prev_1,
        [key_0]: {
          rows: prev_1[key_0]?.rows ?? [],
          total: prev_1[key_0]?.total ?? 0,
          pagination: {
            page: page_2,
            pageSize: pagination.pageSize
          },
          loading: true
        }
      }));
      const params_4 = {
        page: page_2,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sort,
        filters: filters,
        groupBy,
        groupKey: key_0
      };
      fetchRecords(params_4).then(result_1 => {
        startTransition(() => setGroupState(prev_2 => ({
          ...prev_2,
          [key_0]: {
            rows: result_1.rows,
            total: result_1.total,
            pagination: {
              page: page_2,
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
              page: page_2,
              pageSize: pagination.pageSize
            },
            loading: false
          }
        }));
      });
    };
    $[100] = debouncedSearch;
    $[101] = fetchRecords;
    $[102] = filters;
    $[103] = groupBy;
    $[104] = pagination.pageSize;
    $[105] = sort;
    $[106] = t37;
  } else {
    t37 = $[106];
  }
  const fetchGroupRows = t37;
  let t38;
  if ($[107] !== expanded || $[108] !== fetchGroupRows || $[109] !== getRowId || $[110] !== groupState) {
    t38 = key_1 => {
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
    $[107] = expanded;
    $[108] = fetchGroupRows;
    $[109] = getRowId;
    $[110] = groupState;
    $[111] = t38;
  } else {
    t38 = $[111];
  }
  const toggleGroup = t38;
  let t39;
  if ($[112] !== fetchGroupRows) {
    t39 = (key_2, page_3) => {
      fetchGroupRows(key_2, page_3);
    };
    $[112] = fetchGroupRows;
    $[113] = t39;
  } else {
    t39 = $[113];
  }
  const setGroupPage = t39;
  let t40;
  if ($[114] !== expanded) {
    t40 = key_3 => Boolean(expanded[key_3]);
    $[114] = expanded;
    $[115] = t40;
  } else {
    t40 = $[115];
  }
  const isGroupExpanded = t40;
  let t41;
  if ($[116] !== groupState) {
    t41 = key_4 => groupState[key_4]?.rows ?? [];
    $[116] = groupState;
    $[117] = t41;
  } else {
    t41 = $[117];
  }
  const groupRowsFor = t41;
  let t42;
  if ($[118] !== groupState) {
    t42 = key_5 => groupState[key_5]?.total ?? 0;
    $[118] = groupState;
    $[119] = t42;
  } else {
    t42 = $[119];
  }
  const groupTotalFor = t42;
  let t43;
  if ($[120] !== groupState) {
    t43 = key_6 => groupState[key_6]?.loading ?? false;
    $[120] = groupState;
    $[121] = t43;
  } else {
    t43 = $[121];
  }
  const groupLoadingFor = t43;
  let t44;
  if ($[122] !== groupState || $[123] !== pagination.pageSize) {
    t44 = key_7 => groupState[key_7]?.pagination ?? {
      page: 1,
      pageSize: pagination.pageSize
    };
    $[122] = groupState;
    $[123] = pagination.pageSize;
    $[124] = t44;
  } else {
    t44 = $[124];
  }
  const groupPaginationFor = t44;
  let t45;
  if ($[125] !== expanded || $[126] !== groupBy || $[127] !== groupState || $[128] !== groups || $[129] !== rows) {
    t45 = groupBy ? groups.flatMap(g => expanded[g.key] ? groupState[g.key]?.rows ?? [] : []) : rows;
    $[125] = expanded;
    $[126] = groupBy;
    $[127] = groupState;
    $[128] = groups;
    $[129] = rows;
    $[130] = t45;
  } else {
    t45 = $[130];
  }
  const selectableRows = t45;
  let t46;
  if ($[131] !== selection) {
    t46 = Object.keys(selection);
    $[131] = selection;
    $[132] = t46;
  } else {
    t46 = $[132];
  }
  let t47;
  if ($[133] !== selection || $[134] !== t46) {
    t47 = t46.filter(id_0 => selection[id_0]);
    $[133] = selection;
    $[134] = t46;
    $[135] = t47;
  } else {
    t47 = $[135];
  }
  const selectedIds = t47;
  let t48;
  if ($[136] !== getRowId || $[137] !== selectableRows || $[138] !== selection) {
    t48 = selectableRows.length > 0 && selectableRows.every(r => selection[getRowId(r)]);
    $[136] = getRowId;
    $[137] = selectableRows;
    $[138] = selection;
    $[139] = t48;
  } else {
    t48 = $[139];
  }
  const allVisibleSelected = t48;
  let t49;
  if ($[140] !== getRowId || $[141] !== selectableRows || $[142] !== selection) {
    let t50;
    if ($[144] !== getRowId || $[145] !== selection) {
      t50 = r_0 => selection[getRowId(r_0)];
      $[144] = getRowId;
      $[145] = selection;
      $[146] = t50;
    } else {
      t50 = $[146];
    }
    t49 = selectableRows.some(t50);
    $[140] = getRowId;
    $[141] = selectableRows;
    $[142] = selection;
    $[143] = t49;
  } else {
    t49 = $[143];
  }
  const someVisibleSelected = t49;
  let t50;
  if ($[147] !== selection) {
    t50 = id_1 => Boolean(selection[id_1]);
    $[147] = selection;
    $[148] = t50;
  } else {
    t50 = $[148];
  }
  const isSelected = t50;
  let t51;
  if ($[149] === Symbol.for("react.memo_cache_sentinel")) {
    t51 = id_2 => {
      setSelectionState(prev_5 => ({
        ...prev_5,
        [id_2]: !prev_5[id_2]
      }));
    };
    $[149] = t51;
  } else {
    t51 = $[149];
  }
  const toggleSelected = t51;
  let t52;
  if ($[150] === Symbol.for("react.memo_cache_sentinel")) {
    t52 = () => setSelectionState({});
    $[150] = t52;
  } else {
    t52 = $[150];
  }
  const clearSelection = t52;
  let t53;
  if ($[151] !== allVisibleSelected || $[152] !== getRowId || $[153] !== selectableRows) {
    t53 = () => {
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
    $[151] = allVisibleSelected;
    $[152] = getRowId;
    $[153] = selectableRows;
    $[154] = t53;
  } else {
    t53 = $[154];
  }
  const toggleSelectAll = t53;
  let t54;
  if ($[155] !== getRowId || $[156] !== groupState || $[157] !== selection) {
    t54 = key_8 => {
      const rows_1 = groupState[key_8]?.rows ?? [];
      return rows_1.length > 0 && rows_1.every(r_1 => selection[getRowId(r_1)]);
    };
    $[155] = getRowId;
    $[156] = groupState;
    $[157] = selection;
    $[158] = t54;
  } else {
    t54 = $[158];
  }
  const groupAllSelected = t54;
  let t55;
  if ($[159] !== getRowId || $[160] !== groupState || $[161] !== selection) {
    t55 = key_9 => {
      const rows_2 = groupState[key_9]?.rows ?? [];
      return rows_2.some(r_2 => selection[getRowId(r_2)]);
    };
    $[159] = getRowId;
    $[160] = groupState;
    $[161] = selection;
    $[162] = t55;
  } else {
    t55 = $[162];
  }
  const groupSomeSelected = t55;
  let t56;
  if ($[163] !== getRowId || $[164] !== groupState || $[165] !== selection) {
    t56 = key_10 => {
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
    $[163] = getRowId;
    $[164] = groupState;
    $[165] = selection;
    $[166] = t56;
  } else {
    t56 = $[166];
  }
  const toggleSelectGroup = t56;
  let visibleItems;
  if ($[167] !== expanded || $[168] !== groupBy || $[169] !== groupState || $[170] !== groups || $[171] !== rows) {
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
    $[167] = expanded;
    $[168] = groupBy;
    $[169] = groupState;
    $[170] = groups;
    $[171] = rows;
    $[172] = visibleItems;
  } else {
    visibleItems = $[172];
  }
  let t57;
  if ($[173] === Symbol.for("react.memo_cache_sentinel")) {
    t57 = value_0 => {
      setSearch(value_0);
      setPagination(_temp9);
    };
    $[173] = t57;
  } else {
    t57 = $[173];
  }
  let t58;
  if ($[174] !== allVisibleSelected || $[175] !== cacheKey || $[176] !== columns || $[177] !== error || $[178] !== filterLabel || $[179] !== filters || $[180] !== getRowId || $[181] !== groupAllSelected || $[182] !== groupBy || $[183] !== groupByColumns || $[184] !== groupLoadingFor || $[185] !== groupPaginationFor || $[186] !== groupRowsFor || $[187] !== groupSomeSelected || $[188] !== groupTotalFor || $[189] !== groups || $[190] !== groupsLoading || $[191] !== groupsTotal || $[192] !== hasMore || $[193] !== hiddenColumns || $[194] !== isGroupExpanded || $[195] !== isSelected || $[196] !== listKey || $[197] !== loadMore || $[198] !== loading || $[199] !== loadingMore || $[200] !== pagination || $[201] !== rows || $[202] !== search || $[203] !== selectedIds || $[204] !== selection || $[205] !== setGroupPage || $[206] !== someVisibleSelected || $[207] !== sort || $[208] !== toggleGroup || $[209] !== toggleSelectAll || $[210] !== toggleSelectGroup || $[211] !== total || $[212] !== visibleColumns || $[213] !== visibleItems) {
    t58 = {
      columns,
      getRowId,
      groupByColumns,
      cacheKey,
      visibleColumns,
      hiddenColumns,
      setColumnHidden,
      search,
      setSearch: t57,
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
      listKey,
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
    $[174] = allVisibleSelected;
    $[175] = cacheKey;
    $[176] = columns;
    $[177] = error;
    $[178] = filterLabel;
    $[179] = filters;
    $[180] = getRowId;
    $[181] = groupAllSelected;
    $[182] = groupBy;
    $[183] = groupByColumns;
    $[184] = groupLoadingFor;
    $[185] = groupPaginationFor;
    $[186] = groupRowsFor;
    $[187] = groupSomeSelected;
    $[188] = groupTotalFor;
    $[189] = groups;
    $[190] = groupsLoading;
    $[191] = groupsTotal;
    $[192] = hasMore;
    $[193] = hiddenColumns;
    $[194] = isGroupExpanded;
    $[195] = isSelected;
    $[196] = listKey;
    $[197] = loadMore;
    $[198] = loading;
    $[199] = loadingMore;
    $[200] = pagination;
    $[201] = rows;
    $[202] = search;
    $[203] = selectedIds;
    $[204] = selection;
    $[205] = setGroupPage;
    $[206] = someVisibleSelected;
    $[207] = sort;
    $[208] = toggleGroup;
    $[209] = toggleSelectAll;
    $[210] = toggleSelectGroup;
    $[211] = total;
    $[212] = visibleColumns;
    $[213] = visibleItems;
    $[214] = t58;
  } else {
    t58 = $[214];
  }
  return t58;
}
function _temp9(p_4) {
  return {
    ...p_4,
    page: 1
  };
}
function _temp8() {}
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