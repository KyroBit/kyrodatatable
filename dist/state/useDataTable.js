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
  const $ = _c(221);
  const {
    columns,
    getRowId,
    groupByColumns,
    searchDebounceMs,
    cacheKey
  } = config;
  let t0;
  if ($[0] !== config.initialGroupBy || $[1] !== groupByColumns) {
    t0 = groupByColumns?.find(column => column.field === config.initialGroupBy)?.field ?? null;
    $[0] = config.initialGroupBy;
    $[1] = groupByColumns;
    $[2] = t0;
  } else {
    t0 = $[2];
  }
  const startingGroup = t0;
  let t1;
  if ($[3] !== cacheKey || $[4] !== config || $[5] !== startingGroup) {
    t1 = () => {
      const params = firstPage(config);
      const flat = startingGroup === null && cacheKey !== undefined;
      return {
        params,
        groupBy: startingGroup,
        result: flat ? cachedList(cacheKey, params) : undefined
      };
    };
    $[3] = cacheKey;
    $[4] = config;
    $[5] = startingGroup;
    $[6] = t1;
  } else {
    t1 = $[6];
  }
  const [initial] = useState(t1);
  let t2;
  if ($[7] !== config.initialHiddenColumns) {
    t2 = config.initialHiddenColumns ?? [];
    $[7] = config.initialHiddenColumns;
    $[8] = t2;
  } else {
    t2 = $[8];
  }
  const [hiddenColumns, setHiddenColumns] = useState(t2);
  let t3;
  if ($[9] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = (field, hidden) => {
      setHiddenColumns(current => hidden ? current.includes(field) ? current : [...current, field] : current.filter(f => f !== field));
    };
    $[9] = t3;
  } else {
    t3 = $[9];
  }
  const setColumnHidden = t3;
  let t4;
  if ($[10] !== columns || $[11] !== hiddenColumns) {
    let t5;
    if ($[13] !== hiddenColumns) {
      t5 = column_0 => !hiddenColumns.includes(column_0.field);
      $[13] = hiddenColumns;
      $[14] = t5;
    } else {
      t5 = $[14];
    }
    t4 = columns.filter(t5);
    $[10] = columns;
    $[11] = hiddenColumns;
    $[12] = t4;
  } else {
    t4 = $[12];
  }
  const visibleColumns = t4;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFiltersInternal] = useState(initial.params.filters);
  let t5;
  if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
    t5 = {};
    $[15] = t5;
  } else {
    t5 = $[15];
  }
  const [filterLabels, setFilterLabels] = useState(t5);
  const [sort, setSortInternal] = useState(initial.params.sort);
  let t6;
  if ($[16] !== initial.params.page || $[17] !== initial.params.pageSize) {
    t6 = {
      page: initial.params.page,
      pageSize: initial.params.pageSize
    };
    $[16] = initial.params.page;
    $[17] = initial.params.pageSize;
    $[18] = t6;
  } else {
    t6 = $[18];
  }
  const [pagination, setPagination] = useState(t6);
  let t7;
  if ($[19] !== initial.result?.rows) {
    t7 = initial.result?.rows ?? [];
    $[19] = initial.result?.rows;
    $[20] = t7;
  } else {
    t7 = $[20];
  }
  const [rows, setRows] = useState(t7);
  const [total, setTotal] = useState(initial.result?.total ?? 0);
  const [loading, setLoading] = useState(!initial.result && initial.groupBy === null);
  const [error, setError] = useState(null);
  const [fetchTick, setFetchTick] = useState(0);
  const [loadedPage, setLoadedPage] = useState(initial.result?.lastPage ?? 1);
  const [loadingMore, setLoadingMore] = useState(false);
  const generation = useRef(0);
  let t8;
  if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = Promise.resolve();
    $[21] = t8;
  } else {
    t8 = $[21];
  }
  const queue = useRef(t8);
  const requestedMore = useRef(null);
  const [groupBy, setGroupByField] = useState(initial.groupBy);
  let t9;
  if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
    t9 = [];
    $[22] = t9;
  } else {
    t9 = $[22];
  }
  const [groups, setGroups] = useState(t9);
  const [groupsTotal, setGroupsTotal] = useState(0);
  const [groupsLoading, setGroupsLoading] = useState(initial.groupBy !== null);
  let t10;
  if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = {};
    $[23] = t10;
  } else {
    t10 = $[23];
  }
  const [expanded, setExpanded] = useState(t10);
  let t11;
  if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
    t11 = {};
    $[24] = t11;
  } else {
    t11 = $[24];
  }
  const [groupState, setGroupState] = useState(t11);
  let t12;
  if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
    t12 = {};
    $[25] = t12;
  } else {
    t12 = $[25];
  }
  const [selection, setSelectionState] = useState(t12);
  let t13;
  let t14;
  if ($[26] !== search || $[27] !== searchDebounceMs) {
    t13 = () => {
      if (!searchDebounceMs) {
        setDebouncedSearch(search);
        return;
      }
      const id = setTimeout(() => startTransition(() => setDebouncedSearch(search)), searchDebounceMs);
      return () => clearTimeout(id);
    };
    t14 = [search, searchDebounceMs];
    $[26] = search;
    $[27] = searchDebounceMs;
    $[28] = t13;
    $[29] = t14;
  } else {
    t13 = $[28];
    t14 = $[29];
  }
  useEffect(t13, t14);
  let t15;
  if ($[30] !== config.data) {
    t15 = rowsKey(config.data);
    $[30] = config.data;
    $[31] = t15;
  } else {
    t15 = $[31];
  }
  const dataKey = t15;
  let t16;
  if ($[32] !== columns || $[33] !== config.applyFilters || $[34] !== config.data || $[35] !== groupBy) {
    t16 = config.data ? createClientEngine({
      data: config.data,
      columns,
      applyFilters: config.applyFilters,
      groupField: groupBy ? row => row[groupBy] : undefined
    }) : null;
    $[32] = columns;
    $[33] = config.applyFilters;
    $[34] = config.data;
    $[35] = groupBy;
    $[36] = t16;
  } else {
    t16 = $[36];
  }
  const clientEngine = t16;
  const fetchRecords = config.fetchRecords ?? clientEngine?.fetchRecords;
  const fetchGroups = config.fetchGroups ?? clientEngine?.fetchGroups;
  let t17;
  if ($[37] !== fetchRecords) {
    t17 = params_0 => fetchRecords?.(params_0);
    $[37] = fetchRecords;
    $[38] = t17;
  } else {
    t17 = $[38];
  }
  const fetchPage = useEffectEvent(t17);
  let t18;
  if ($[39] !== fetchGroups) {
    t18 = params_1 => fetchGroups?.(params_1);
    $[39] = fetchGroups;
    $[40] = t18;
  } else {
    t18 = $[40];
  }
  const fetchGroupPage = useEffectEvent(t18);
  let t19;
  if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
    t19 = next => startTransition(() => {
      setFiltersInternal(next);
      setPagination(_temp);
    });
    $[41] = t19;
  } else {
    t19 = $[41];
  }
  const setFilters = t19;
  let t20;
  if ($[42] !== filterLabels) {
    t20 = (field_0, value) => filterLabels[field_0]?.[value];
    $[42] = filterLabels;
    $[43] = t20;
  } else {
    t20 = $[43];
  }
  const filterLabel = t20;
  let t21;
  if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
    t21 = (field_1, options) => setFilterLabels(known => {
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
    $[44] = t21;
  } else {
    t21 = $[44];
  }
  const rememberFilterLabels = t21;
  let t22;
  if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
    t22 = field_2 => startTransition(() => {
      setGroupByField(field_2);
      setExpanded({});
      setGroupState({});
      setPagination(_temp2);
    });
    $[45] = t22;
  } else {
    t22 = $[45];
  }
  const setGroupBy = t22;
  let t23;
  if ($[46] === Symbol.for("react.memo_cache_sentinel")) {
    t23 = field_3 => startTransition(() => {
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
    $[46] = t23;
  } else {
    t23 = $[46];
  }
  const toggleSort = t23;
  let t24;
  if ($[47] === Symbol.for("react.memo_cache_sentinel")) {
    t24 = next_0 => startTransition(() => {
      setSortInternal(next_0);
      setPagination(_temp4);
    });
    $[47] = t24;
  } else {
    t24 = $[47];
  }
  const setSort = t24;
  let t25;
  if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
    t25 = page => startTransition(() => setPagination(p_3 => ({
      ...p_3,
      page
    })));
    $[48] = t25;
  } else {
    t25 = $[48];
  }
  const setPage = t25;
  let t26;
  if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
    t26 = pageSize => startTransition(() => setPagination({
      page: 1,
      pageSize
    }));
    $[49] = t26;
  } else {
    t26 = $[49];
  }
  const setPageSize = t26;
  let t27;
  if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
    t27 = () => setFetchTick(_temp5);
    $[50] = t27;
  } else {
    t27 = $[50];
  }
  const refetch = t27;
  let t28;
  if ($[51] !== config.deps) {
    t28 = JSON.stringify(config.deps ?? []);
    $[51] = config.deps;
    $[52] = t28;
  } else {
    t28 = $[52];
  }
  const depsKey = t28;
  const knownDeps = useRef(depsKey);
  let t29;
  if ($[53] !== depsKey || $[54] !== startingGroup) {
    t29 = () => {
      if (knownDeps.current === depsKey) {
        return;
      }
      knownDeps.current = depsKey;
      if (startingGroup !== null) {
        setGroupByField(startingGroup);
        setExpanded({});
        setGroupState({});
      }
      setSelectionState({});
      setPagination(_temp6);
      setFetchTick(_temp7);
    };
    $[53] = depsKey;
    $[54] = startingGroup;
    $[55] = t29;
  } else {
    t29 = $[55];
  }
  let t30;
  if ($[56] !== depsKey) {
    t30 = [depsKey];
    $[56] = depsKey;
    $[57] = t30;
  } else {
    t30 = $[57];
  }
  useEffect(t29, t30);
  const t31 = filters;
  let listParams;
  let t32;
  if ($[58] !== cacheKey || $[59] !== debouncedSearch || $[60] !== pagination.page || $[61] !== pagination.pageSize || $[62] !== sort || $[63] !== t31) {
    listParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: debouncedSearch,
      sort,
      filters: t31
    };
    t32 = entryKey(cacheKey ?? "", listParams);
    $[58] = cacheKey;
    $[59] = debouncedSearch;
    $[60] = pagination.page;
    $[61] = pagination.pageSize;
    $[62] = sort;
    $[63] = t31;
    $[64] = listParams;
    $[65] = t32;
  } else {
    listParams = $[64];
    t32 = $[65];
  }
  const listKey = t32;
  let t33;
  if ($[66] !== cacheKey || $[67] !== fetchPage || $[68] !== groupBy || $[69] !== listParams) {
    t33 = () => {
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
    $[66] = cacheKey;
    $[67] = fetchPage;
    $[68] = groupBy;
    $[69] = listParams;
    $[70] = t33;
  } else {
    t33 = $[70];
  }
  let t34;
  if ($[71] !== cacheKey || $[72] !== dataKey || $[73] !== debouncedSearch || $[74] !== fetchTick || $[75] !== filters || $[76] !== groupBy || $[77] !== pagination.page || $[78] !== pagination.pageSize || $[79] !== sort) {
    t34 = [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick, cacheKey];
    $[71] = cacheKey;
    $[72] = dataKey;
    $[73] = debouncedSearch;
    $[74] = fetchTick;
    $[75] = filters;
    $[76] = groupBy;
    $[77] = pagination.page;
    $[78] = pagination.pageSize;
    $[79] = sort;
    $[80] = t34;
  } else {
    t34 = $[80];
  }
  useEffect(t33, t34);
  let t35;
  if ($[81] !== debouncedSearch || $[82] !== fetchGroupPage || $[83] !== filters || $[84] !== groupBy || $[85] !== pagination.page || $[86] !== pagination.pageSize || $[87] !== sort) {
    t35 = () => {
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
    $[81] = debouncedSearch;
    $[82] = fetchGroupPage;
    $[83] = filters;
    $[84] = groupBy;
    $[85] = pagination.page;
    $[86] = pagination.pageSize;
    $[87] = sort;
    $[88] = t35;
  } else {
    t35 = $[88];
  }
  let t36;
  if ($[89] !== dataKey || $[90] !== debouncedSearch || $[91] !== fetchTick || $[92] !== filters || $[93] !== groupBy || $[94] !== pagination.page || $[95] !== pagination.pageSize || $[96] !== sort) {
    t36 = [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick];
    $[89] = dataKey;
    $[90] = debouncedSearch;
    $[91] = fetchTick;
    $[92] = filters;
    $[93] = groupBy;
    $[94] = pagination.page;
    $[95] = pagination.pageSize;
    $[96] = sort;
    $[97] = t36;
  } else {
    t36 = $[97];
  }
  useEffect(t35, t36);
  const hasMore = !groupBy && (pagination.page - 1) * pagination.pageSize + rows.length < total;
  let t37;
  if ($[98] !== cacheKey || $[99] !== fetchRecords || $[100] !== hasMore || $[101] !== listKey || $[102] !== listParams || $[103] !== loadedPage || $[104] !== loading) {
    t37 = () => {
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
    $[98] = cacheKey;
    $[99] = fetchRecords;
    $[100] = hasMore;
    $[101] = listKey;
    $[102] = listParams;
    $[103] = loadedPage;
    $[104] = loading;
    $[105] = t37;
  } else {
    t37 = $[105];
  }
  const loadMore = t37;
  let t38;
  if ($[106] !== debouncedSearch || $[107] !== fetchRecords || $[108] !== filters || $[109] !== groupBy || $[110] !== pagination.pageSize || $[111] !== sort) {
    t38 = (key_0, page_2) => {
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
    $[106] = debouncedSearch;
    $[107] = fetchRecords;
    $[108] = filters;
    $[109] = groupBy;
    $[110] = pagination.pageSize;
    $[111] = sort;
    $[112] = t38;
  } else {
    t38 = $[112];
  }
  const fetchGroupRows = t38;
  let t39;
  if ($[113] !== expanded || $[114] !== fetchGroupRows || $[115] !== getRowId || $[116] !== groupState) {
    t39 = key_1 => {
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
    $[113] = expanded;
    $[114] = fetchGroupRows;
    $[115] = getRowId;
    $[116] = groupState;
    $[117] = t39;
  } else {
    t39 = $[117];
  }
  const toggleGroup = t39;
  let t40;
  if ($[118] !== fetchGroupRows) {
    t40 = (key_2, page_3) => {
      fetchGroupRows(key_2, page_3);
    };
    $[118] = fetchGroupRows;
    $[119] = t40;
  } else {
    t40 = $[119];
  }
  const setGroupPage = t40;
  let t41;
  if ($[120] !== expanded) {
    t41 = key_3 => Boolean(expanded[key_3]);
    $[120] = expanded;
    $[121] = t41;
  } else {
    t41 = $[121];
  }
  const isGroupExpanded = t41;
  let t42;
  if ($[122] !== groupState) {
    t42 = key_4 => groupState[key_4]?.rows ?? [];
    $[122] = groupState;
    $[123] = t42;
  } else {
    t42 = $[123];
  }
  const groupRowsFor = t42;
  let t43;
  if ($[124] !== groupState) {
    t43 = key_5 => groupState[key_5]?.total ?? 0;
    $[124] = groupState;
    $[125] = t43;
  } else {
    t43 = $[125];
  }
  const groupTotalFor = t43;
  let t44;
  if ($[126] !== groupState) {
    t44 = key_6 => groupState[key_6]?.loading ?? false;
    $[126] = groupState;
    $[127] = t44;
  } else {
    t44 = $[127];
  }
  const groupLoadingFor = t44;
  let t45;
  if ($[128] !== groupState || $[129] !== pagination.pageSize) {
    t45 = key_7 => groupState[key_7]?.pagination ?? {
      page: 1,
      pageSize: pagination.pageSize
    };
    $[128] = groupState;
    $[129] = pagination.pageSize;
    $[130] = t45;
  } else {
    t45 = $[130];
  }
  const groupPaginationFor = t45;
  let t46;
  if ($[131] !== expanded || $[132] !== groupBy || $[133] !== groupState || $[134] !== groups || $[135] !== rows) {
    t46 = groupBy ? groups.flatMap(g => expanded[g.key] ? groupState[g.key]?.rows ?? [] : []) : rows;
    $[131] = expanded;
    $[132] = groupBy;
    $[133] = groupState;
    $[134] = groups;
    $[135] = rows;
    $[136] = t46;
  } else {
    t46 = $[136];
  }
  const selectableRows = t46;
  let t47;
  if ($[137] !== selection) {
    t47 = Object.keys(selection);
    $[137] = selection;
    $[138] = t47;
  } else {
    t47 = $[138];
  }
  let t48;
  if ($[139] !== selection || $[140] !== t47) {
    t48 = t47.filter(id_0 => selection[id_0]);
    $[139] = selection;
    $[140] = t47;
    $[141] = t48;
  } else {
    t48 = $[141];
  }
  const selectedIds = t48;
  let t49;
  if ($[142] !== getRowId || $[143] !== selectableRows || $[144] !== selection) {
    t49 = selectableRows.length > 0 && selectableRows.every(r => selection[getRowId(r)]);
    $[142] = getRowId;
    $[143] = selectableRows;
    $[144] = selection;
    $[145] = t49;
  } else {
    t49 = $[145];
  }
  const allVisibleSelected = t49;
  let t50;
  if ($[146] !== getRowId || $[147] !== selectableRows || $[148] !== selection) {
    let t51;
    if ($[150] !== getRowId || $[151] !== selection) {
      t51 = r_0 => selection[getRowId(r_0)];
      $[150] = getRowId;
      $[151] = selection;
      $[152] = t51;
    } else {
      t51 = $[152];
    }
    t50 = selectableRows.some(t51);
    $[146] = getRowId;
    $[147] = selectableRows;
    $[148] = selection;
    $[149] = t50;
  } else {
    t50 = $[149];
  }
  const someVisibleSelected = t50;
  let t51;
  if ($[153] !== selection) {
    t51 = id_1 => Boolean(selection[id_1]);
    $[153] = selection;
    $[154] = t51;
  } else {
    t51 = $[154];
  }
  const isSelected = t51;
  let t52;
  if ($[155] === Symbol.for("react.memo_cache_sentinel")) {
    t52 = id_2 => {
      setSelectionState(prev_5 => ({
        ...prev_5,
        [id_2]: !prev_5[id_2]
      }));
    };
    $[155] = t52;
  } else {
    t52 = $[155];
  }
  const toggleSelected = t52;
  let t53;
  if ($[156] === Symbol.for("react.memo_cache_sentinel")) {
    t53 = () => setSelectionState({});
    $[156] = t53;
  } else {
    t53 = $[156];
  }
  const clearSelection = t53;
  let t54;
  if ($[157] !== allVisibleSelected || $[158] !== getRowId || $[159] !== selectableRows) {
    t54 = () => {
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
    $[157] = allVisibleSelected;
    $[158] = getRowId;
    $[159] = selectableRows;
    $[160] = t54;
  } else {
    t54 = $[160];
  }
  const toggleSelectAll = t54;
  let t55;
  if ($[161] !== getRowId || $[162] !== groupState || $[163] !== selection) {
    t55 = key_8 => {
      const rows_1 = groupState[key_8]?.rows ?? [];
      return rows_1.length > 0 && rows_1.every(r_1 => selection[getRowId(r_1)]);
    };
    $[161] = getRowId;
    $[162] = groupState;
    $[163] = selection;
    $[164] = t55;
  } else {
    t55 = $[164];
  }
  const groupAllSelected = t55;
  let t56;
  if ($[165] !== getRowId || $[166] !== groupState || $[167] !== selection) {
    t56 = key_9 => {
      const rows_2 = groupState[key_9]?.rows ?? [];
      return rows_2.some(r_2 => selection[getRowId(r_2)]);
    };
    $[165] = getRowId;
    $[166] = groupState;
    $[167] = selection;
    $[168] = t56;
  } else {
    t56 = $[168];
  }
  const groupSomeSelected = t56;
  let t57;
  if ($[169] !== getRowId || $[170] !== groupState || $[171] !== selection) {
    t57 = key_10 => {
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
    $[169] = getRowId;
    $[170] = groupState;
    $[171] = selection;
    $[172] = t57;
  } else {
    t57 = $[172];
  }
  const toggleSelectGroup = t57;
  let visibleItems;
  if ($[173] !== expanded || $[174] !== groupBy || $[175] !== groupState || $[176] !== groups || $[177] !== rows) {
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
    $[173] = expanded;
    $[174] = groupBy;
    $[175] = groupState;
    $[176] = groups;
    $[177] = rows;
    $[178] = visibleItems;
  } else {
    visibleItems = $[178];
  }
  let t58;
  if ($[179] === Symbol.for("react.memo_cache_sentinel")) {
    t58 = value_0 => {
      setSearch(value_0);
      setPagination(_temp9);
    };
    $[179] = t58;
  } else {
    t58 = $[179];
  }
  let t59;
  if ($[180] !== allVisibleSelected || $[181] !== cacheKey || $[182] !== columns || $[183] !== error || $[184] !== filterLabel || $[185] !== filters || $[186] !== getRowId || $[187] !== groupAllSelected || $[188] !== groupBy || $[189] !== groupByColumns || $[190] !== groupLoadingFor || $[191] !== groupPaginationFor || $[192] !== groupRowsFor || $[193] !== groupSomeSelected || $[194] !== groupTotalFor || $[195] !== groups || $[196] !== groupsLoading || $[197] !== groupsTotal || $[198] !== hasMore || $[199] !== hiddenColumns || $[200] !== isGroupExpanded || $[201] !== isSelected || $[202] !== listKey || $[203] !== loadMore || $[204] !== loading || $[205] !== loadingMore || $[206] !== pagination || $[207] !== rows || $[208] !== search || $[209] !== selectedIds || $[210] !== selection || $[211] !== setGroupPage || $[212] !== someVisibleSelected || $[213] !== sort || $[214] !== toggleGroup || $[215] !== toggleSelectAll || $[216] !== toggleSelectGroup || $[217] !== total || $[218] !== visibleColumns || $[219] !== visibleItems) {
    t59 = {
      columns,
      getRowId,
      groupByColumns,
      cacheKey,
      visibleColumns,
      hiddenColumns,
      setColumnHidden,
      search,
      setSearch: t58,
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
    $[180] = allVisibleSelected;
    $[181] = cacheKey;
    $[182] = columns;
    $[183] = error;
    $[184] = filterLabel;
    $[185] = filters;
    $[186] = getRowId;
    $[187] = groupAllSelected;
    $[188] = groupBy;
    $[189] = groupByColumns;
    $[190] = groupLoadingFor;
    $[191] = groupPaginationFor;
    $[192] = groupRowsFor;
    $[193] = groupSomeSelected;
    $[194] = groupTotalFor;
    $[195] = groups;
    $[196] = groupsLoading;
    $[197] = groupsTotal;
    $[198] = hasMore;
    $[199] = hiddenColumns;
    $[200] = isGroupExpanded;
    $[201] = isSelected;
    $[202] = listKey;
    $[203] = loadMore;
    $[204] = loading;
    $[205] = loadingMore;
    $[206] = pagination;
    $[207] = rows;
    $[208] = search;
    $[209] = selectedIds;
    $[210] = selection;
    $[211] = setGroupPage;
    $[212] = someVisibleSelected;
    $[213] = sort;
    $[214] = toggleGroup;
    $[215] = toggleSelectAll;
    $[216] = toggleSelectGroup;
    $[217] = total;
    $[218] = visibleColumns;
    $[219] = visibleItems;
    $[220] = t59;
  } else {
    t59 = $[220];
  }
  return t59;
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