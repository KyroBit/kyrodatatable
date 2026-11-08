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
  const $ = _c(232);
  const {
    columns,
    getRowId,
    groupByColumns,
    searchDebounceMs,
    cacheKey
  } = config;
  let t0;
  if ($[0] !== config.initialGroupBy) {
    t0 = config.initialGroupBy ?? [];
    $[0] = config.initialGroupBy;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  let t1;
  if ($[2] !== groupByColumns || $[3] !== t0) {
    let t2;
    if ($[5] !== groupByColumns) {
      t2 = field => groupByColumns?.some(column => column.field === field);
      $[5] = groupByColumns;
      $[6] = t2;
    } else {
      t2 = $[6];
    }
    t1 = t0.filter(t2);
    $[2] = groupByColumns;
    $[3] = t0;
    $[4] = t1;
  } else {
    t1 = $[4];
  }
  const startingGroup = t1;
  let t2;
  if ($[7] !== cacheKey || $[8] !== config || $[9] !== startingGroup) {
    t2 = () => {
      const params = firstPage(config);
      const flat = startingGroup.length === 0 && cacheKey !== undefined;
      return {
        params,
        groupBy: startingGroup,
        result: flat ? cachedList(cacheKey, params) : undefined
      };
    };
    $[7] = cacheKey;
    $[8] = config;
    $[9] = startingGroup;
    $[10] = t2;
  } else {
    t2 = $[10];
  }
  const [initial] = useState(t2);
  let t3;
  if ($[11] !== config.initialHiddenColumns) {
    t3 = config.initialHiddenColumns ?? [];
    $[11] = config.initialHiddenColumns;
    $[12] = t3;
  } else {
    t3 = $[12];
  }
  const [hiddenColumns, setHiddenColumns] = useState(t3);
  let t4;
  if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = (field_0, hidden) => {
      setHiddenColumns(current => hidden ? current.includes(field_0) ? current : [...current, field_0] : current.filter(f => f !== field_0));
    };
    $[13] = t4;
  } else {
    t4 = $[13];
  }
  const setColumnHidden = t4;
  let t5;
  if ($[14] !== columns || $[15] !== hiddenColumns) {
    let t6;
    if ($[17] !== hiddenColumns) {
      t6 = column_0 => !hiddenColumns.includes(column_0.field);
      $[17] = hiddenColumns;
      $[18] = t6;
    } else {
      t6 = $[18];
    }
    t5 = columns.filter(t6);
    $[14] = columns;
    $[15] = hiddenColumns;
    $[16] = t5;
  } else {
    t5 = $[16];
  }
  const visibleColumns = t5;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFiltersInternal] = useState(initial.params.filters);
  let t6;
  if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = {};
    $[19] = t6;
  } else {
    t6 = $[19];
  }
  const [filterLabels, setFilterLabels] = useState(t6);
  const [sort, setSortInternal] = useState(initial.params.sort);
  let t7;
  if ($[20] !== initial.params.page || $[21] !== initial.params.pageSize) {
    t7 = {
      page: initial.params.page,
      pageSize: initial.params.pageSize
    };
    $[20] = initial.params.page;
    $[21] = initial.params.pageSize;
    $[22] = t7;
  } else {
    t7 = $[22];
  }
  const [pagination, setPagination] = useState(t7);
  let t8;
  if ($[23] !== initial.result?.rows) {
    t8 = initial.result?.rows ?? [];
    $[23] = initial.result?.rows;
    $[24] = t8;
  } else {
    t8 = $[24];
  }
  const [rows, setRows] = useState(t8);
  const [total, setTotal] = useState(initial.result?.total ?? 0);
  const [loading, setLoading] = useState(!initial.result && initial.groupBy.length === 0);
  const [error, setError] = useState(null);
  const [fetchTick, setFetchTick] = useState(0);
  const [loadedPage, setLoadedPage] = useState(initial.result?.lastPage ?? 1);
  const [loadingMore, setLoadingMore] = useState(false);
  const generation = useRef(0);
  let t9;
  if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
    t9 = Promise.resolve();
    $[25] = t9;
  } else {
    t9 = $[25];
  }
  const queue = useRef(t9);
  const requestedMore = useRef(null);
  const [groupBy, setGroupByField] = useState(initial.groupBy);
  const grouped = groupBy.length > 0;
  let t10;
  if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = [];
    $[26] = t10;
  } else {
    t10 = $[26];
  }
  const [groups, setGroups] = useState(t10);
  const [groupsTotal, setGroupsTotal] = useState(0);
  const [groupsLoading, setGroupsLoading] = useState(initial.groupBy.length > 0);
  let t11;
  if ($[27] === Symbol.for("react.memo_cache_sentinel")) {
    t11 = {};
    $[27] = t11;
  } else {
    t11 = $[27];
  }
  const [expanded, setExpanded] = useState(t11);
  let t12;
  if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
    t12 = {};
    $[28] = t12;
  } else {
    t12 = $[28];
  }
  const [groupState, setGroupState] = useState(t12);
  let t13;
  if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
    t13 = {};
    $[29] = t13;
  } else {
    t13 = $[29];
  }
  const [selection, setSelectionState] = useState(t13);
  let t14;
  let t15;
  if ($[30] !== search || $[31] !== searchDebounceMs) {
    t14 = () => {
      if (!searchDebounceMs) {
        setDebouncedSearch(search);
        return;
      }
      const id = setTimeout(() => startTransition(() => setDebouncedSearch(search)), searchDebounceMs);
      return () => clearTimeout(id);
    };
    t15 = [search, searchDebounceMs];
    $[30] = search;
    $[31] = searchDebounceMs;
    $[32] = t14;
    $[33] = t15;
  } else {
    t14 = $[32];
    t15 = $[33];
  }
  useEffect(t14, t15);
  let t16;
  if ($[34] !== config.data) {
    t16 = rowsKey(config.data);
    $[34] = config.data;
    $[35] = t16;
  } else {
    t16 = $[35];
  }
  const dataKey = t16;
  let t17;
  if ($[36] !== columns || $[37] !== config.applyFilters || $[38] !== config.data) {
    t17 = config.data ? createClientEngine({
      data: config.data,
      columns,
      applyFilters: config.applyFilters
    }) : null;
    $[36] = columns;
    $[37] = config.applyFilters;
    $[38] = config.data;
    $[39] = t17;
  } else {
    t17 = $[39];
  }
  const clientEngine = t17;
  const fetchRecords = config.fetchRecords ?? clientEngine?.fetchRecords;
  const fetchGroups = config.fetchGroups ?? clientEngine?.fetchGroups;
  let t18;
  if ($[40] !== fetchRecords) {
    t18 = params_0 => fetchRecords?.(params_0);
    $[40] = fetchRecords;
    $[41] = t18;
  } else {
    t18 = $[41];
  }
  const fetchPage = useEffectEvent(t18);
  let t19;
  if ($[42] !== fetchGroups) {
    t19 = params_1 => fetchGroups?.(params_1);
    $[42] = fetchGroups;
    $[43] = t19;
  } else {
    t19 = $[43];
  }
  const fetchGroupPage = useEffectEvent(t19);
  let t20;
  if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
    t20 = next => startTransition(() => {
      setFiltersInternal(next);
      setPagination(_temp);
    });
    $[44] = t20;
  } else {
    t20 = $[44];
  }
  const setFilters = t20;
  let t21;
  if ($[45] !== filterLabels) {
    t21 = (field_1, value) => filterLabels[field_1]?.[value];
    $[45] = filterLabels;
    $[46] = t21;
  } else {
    t21 = $[46];
  }
  const filterLabel = t21;
  let t22;
  if ($[47] === Symbol.for("react.memo_cache_sentinel")) {
    t22 = (field_2, options) => setFilterLabels(known => {
      const fresh = options.filter(option => known[field_2]?.[option.value] !== option.label);
      if (fresh.length === 0) {
        return known;
      }
      const labels = {
        ...known[field_2]
      };
      for (const option_0 of fresh) {
        labels[option_0.value] = option_0.label;
      }
      return {
        ...known,
        [field_2]: labels
      };
    });
    $[47] = t22;
  } else {
    t22 = $[47];
  }
  const rememberFilterLabels = t22;
  let t23;
  if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
    t23 = fields => startTransition(() => {
      setGroupByField(fields);
      setExpanded({});
      setGroupState({});
      setPagination(_temp2);
    });
    $[48] = t23;
  } else {
    t23 = $[48];
  }
  const setGroupBy = t23;
  let t24;
  if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
    t24 = field_3 => startTransition(() => {
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
    $[49] = t24;
  } else {
    t24 = $[49];
  }
  const toggleSort = t24;
  let t25;
  if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
    t25 = next_0 => startTransition(() => {
      setSortInternal(next_0);
      setPagination(_temp4);
    });
    $[50] = t25;
  } else {
    t25 = $[50];
  }
  const setSort = t25;
  let t26;
  if ($[51] === Symbol.for("react.memo_cache_sentinel")) {
    t26 = page => startTransition(() => setPagination(p_3 => ({
      ...p_3,
      page
    })));
    $[51] = t26;
  } else {
    t26 = $[51];
  }
  const setPage = t26;
  let t27;
  if ($[52] === Symbol.for("react.memo_cache_sentinel")) {
    t27 = pageSize => startTransition(() => setPagination({
      page: 1,
      pageSize
    }));
    $[52] = t27;
  } else {
    t27 = $[52];
  }
  const setPageSize = t27;
  let t28;
  if ($[53] === Symbol.for("react.memo_cache_sentinel")) {
    t28 = () => setFetchTick(_temp5);
    $[53] = t28;
  } else {
    t28 = $[53];
  }
  const refetch = t28;
  let t29;
  if ($[54] !== config.deps) {
    t29 = JSON.stringify(config.deps ?? []);
    $[54] = config.deps;
    $[55] = t29;
  } else {
    t29 = $[55];
  }
  const depsKey = t29;
  const knownDeps = useRef(depsKey);
  let t30;
  if ($[56] !== depsKey || $[57] !== startingGroup) {
    t30 = () => {
      if (knownDeps.current === depsKey) {
        return;
      }
      knownDeps.current = depsKey;
      if (startingGroup.length > 0) {
        setGroupByField(startingGroup);
        setExpanded({});
        setGroupState({});
      }
      setSelectionState({});
      setPagination(_temp6);
      setFetchTick(_temp7);
    };
    $[56] = depsKey;
    $[57] = startingGroup;
    $[58] = t30;
  } else {
    t30 = $[58];
  }
  let t31;
  if ($[59] !== depsKey) {
    t31 = [depsKey];
    $[59] = depsKey;
    $[60] = t31;
  } else {
    t31 = $[60];
  }
  useEffect(t30, t31);
  const t32 = filters;
  let listParams;
  let t33;
  if ($[61] !== cacheKey || $[62] !== debouncedSearch || $[63] !== pagination.page || $[64] !== pagination.pageSize || $[65] !== sort || $[66] !== t32) {
    listParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: debouncedSearch,
      sort,
      filters: t32
    };
    t33 = entryKey(cacheKey ?? "", listParams);
    $[61] = cacheKey;
    $[62] = debouncedSearch;
    $[63] = pagination.page;
    $[64] = pagination.pageSize;
    $[65] = sort;
    $[66] = t32;
    $[67] = listParams;
    $[68] = t33;
  } else {
    listParams = $[67];
    t33 = $[68];
  }
  const listKey = t33;
  let t34;
  if ($[69] !== cacheKey || $[70] !== fetchPage || $[71] !== grouped || $[72] !== listParams) {
    t34 = () => {
      if (grouped) {
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
    $[69] = cacheKey;
    $[70] = fetchPage;
    $[71] = grouped;
    $[72] = listParams;
    $[73] = t34;
  } else {
    t34 = $[73];
  }
  let t35;
  if ($[74] !== cacheKey || $[75] !== dataKey || $[76] !== debouncedSearch || $[77] !== fetchTick || $[78] !== filters || $[79] !== grouped || $[80] !== pagination.page || $[81] !== pagination.pageSize || $[82] !== sort) {
    t35 = [grouped, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick, cacheKey];
    $[74] = cacheKey;
    $[75] = dataKey;
    $[76] = debouncedSearch;
    $[77] = fetchTick;
    $[78] = filters;
    $[79] = grouped;
    $[80] = pagination.page;
    $[81] = pagination.pageSize;
    $[82] = sort;
    $[83] = t35;
  } else {
    t35 = $[83];
  }
  useEffect(t34, t35);
  let t36;
  if ($[84] !== debouncedSearch || $[85] !== fetchGroupPage || $[86] !== filters || $[87] !== groupBy[0] || $[88] !== groupBy.length || $[89] !== pagination.page || $[90] !== pagination.pageSize || $[91] !== sort) {
    t36 = () => {
      if (groupBy.length === 0) {
        return;
      }
      const params_2 = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sort,
        filters: filters,
        groupBy: groupBy[0],
        groupPath: []
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
    $[84] = debouncedSearch;
    $[85] = fetchGroupPage;
    $[86] = filters;
    $[87] = groupBy[0];
    $[88] = groupBy.length;
    $[89] = pagination.page;
    $[90] = pagination.pageSize;
    $[91] = sort;
    $[92] = t36;
  } else {
    t36 = $[92];
  }
  let t37;
  if ($[93] !== dataKey || $[94] !== debouncedSearch || $[95] !== fetchTick || $[96] !== filters || $[97] !== groupBy || $[98] !== pagination.page || $[99] !== pagination.pageSize || $[100] !== sort) {
    t37 = [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick];
    $[93] = dataKey;
    $[94] = debouncedSearch;
    $[95] = fetchTick;
    $[96] = filters;
    $[97] = groupBy;
    $[98] = pagination.page;
    $[99] = pagination.pageSize;
    $[100] = sort;
    $[101] = t37;
  } else {
    t37 = $[101];
  }
  useEffect(t36, t37);
  const hasMore = !grouped && (pagination.page - 1) * pagination.pageSize + rows.length < total;
  let t38;
  if ($[102] !== cacheKey || $[103] !== fetchRecords || $[104] !== hasMore || $[105] !== listKey || $[106] !== listParams || $[107] !== loadedPage || $[108] !== loading) {
    t38 = () => {
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
    $[102] = cacheKey;
    $[103] = fetchRecords;
    $[104] = hasMore;
    $[105] = listKey;
    $[106] = listParams;
    $[107] = loadedPage;
    $[108] = loading;
    $[109] = t38;
  } else {
    t38 = $[109];
  }
  const loadMore = t38;
  let nodes;
  let visibleItems;
  if ($[110] !== expanded || $[111] !== groupBy || $[112] !== groupState || $[113] !== grouped || $[114] !== groups || $[115] !== rows) {
    visibleItems = [];
    nodes = new Map();
    const walk = (list_1, parent, ancestors) => {
      for (const group of list_1) {
        const depth = parent.length;
        const path = [...parent, {
          field: groupBy[depth],
          key: group.key
        }];
        const id_0 = JSON.stringify(path.map(_temp9));
        const node = {
          path,
          leaf: depth === groupBy.length - 1,
          rows: []
        };
        const open = Boolean(expanded[id_0]);
        nodes.set(id_0, node);
        visibleItems.push({
          type: "group",
          id: id_0,
          group,
          depth,
          expanded: open
        });
        if (!open) {
          continue;
        }
        const buckets = [...ancestors, node.rows];
        if (!node.leaf) {
          walk(groupState[id_0]?.groups ?? [], path, buckets);
          continue;
        }
        for (const row of groupState[id_0]?.rows ?? []) {
          visibleItems.push({
            type: "group-row",
            row,
            groupId: id_0,
            depth: depth + 1
          });
          for (const bucket of buckets) {
            bucket.push(row);
          }
        }
      }
    };
    if (grouped) {
      walk(groups, [], []);
    } else {
      for (const row_0 of rows) {
        visibleItems.push({
          type: "row",
          row: row_0
        });
      }
    }
    $[110] = expanded;
    $[111] = groupBy;
    $[112] = groupState;
    $[113] = grouped;
    $[114] = groups;
    $[115] = rows;
    $[116] = nodes;
    $[117] = visibleItems;
  } else {
    nodes = $[116];
    visibleItems = $[117];
  }
  let t39;
  if ($[118] !== pagination) {
    t39 = (id_1, patch) => setGroupState(prev_1 => ({
      ...prev_1,
      [id_1]: {
        rows: [],
        groups: [],
        total: 0,
        pagination: {
          page: 1,
          pageSize: pagination.pageSize
        },
        loading: false,
        ...prev_1[id_1],
        ...patch
      }
    }));
    $[118] = pagination;
    $[119] = t39;
  } else {
    t39 = $[119];
  }
  const updateGroup = t39;
  let t40;
  if ($[120] !== debouncedSearch || $[121] !== fetchGroups || $[122] !== fetchRecords || $[123] !== filters || $[124] !== groupBy || $[125] !== nodes || $[126] !== pagination || $[127] !== sort || $[128] !== updateGroup) {
    t40 = (id_2, page_2) => {
      const node_0 = nodes.get(id_2);
      if (!node_0) {
        return;
      }
      const params_4 = {
        page: page_2,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sort,
        filters: filters,
        groupPath: node_0.path
      };
      const pending_1 = node_0.leaf ? fetchRecords?.(params_4).then(_temp0) : fetchGroups?.({
        ...params_4,
        groupBy: groupBy[node_0.path.length]
      }).then(_temp1);
      if (!pending_1) {
        return;
      }
      updateGroup(id_2, {
        pagination: {
          page: page_2,
          pageSize: pagination.pageSize
        },
        loading: true
      });
      pending_1.then(patch_0 => startTransition(() => updateGroup(id_2, {
        ...patch_0,
        loading: false
      }))).catch(err_2 => {
        setError(err_2);
        updateGroup(id_2, {
          loading: false
        });
      });
    };
    $[120] = debouncedSearch;
    $[121] = fetchGroups;
    $[122] = fetchRecords;
    $[123] = filters;
    $[124] = groupBy;
    $[125] = nodes;
    $[126] = pagination;
    $[127] = sort;
    $[128] = updateGroup;
    $[129] = t40;
  } else {
    t40 = $[129];
  }
  const fetchChildren = t40;
  let t41;
  if ($[130] !== nodes) {
    t41 = id_3 => nodes.get(id_3)?.rows ?? [];
    $[130] = nodes;
    $[131] = t41;
  } else {
    t41 = $[131];
  }
  const loadedRows = t41;
  let t42;
  if ($[132] !== getRowId) {
    t42 = (list_2, selected) => setSelectionState(prev_2 => {
      const next_1 = {
        ...prev_2
      };
      for (const row_1 of list_2) {
        if (selected) {
          next_1[getRowId(row_1)] = true;
        } else {
          delete next_1[getRowId(row_1)];
        }
      }
      return next_1;
    });
    $[132] = getRowId;
    $[133] = t42;
  } else {
    t42 = $[133];
  }
  const setRowsSelected = t42;
  let t43;
  if ($[134] !== expanded || $[135] !== fetchChildren || $[136] !== groupState || $[137] !== loadedRows || $[138] !== setRowsSelected) {
    t43 = id_4 => {
      const opening = !expanded[id_4];
      setExpanded(prev_3 => ({
        ...prev_3,
        [id_4]: opening
      }));
      if (opening && !groupState[id_4]) {
        fetchChildren(id_4, 1);
      }
      if (!opening && loadedRows(id_4).length > 0) {
        setRowsSelected(loadedRows(id_4), false);
      }
    };
    $[134] = expanded;
    $[135] = fetchChildren;
    $[136] = groupState;
    $[137] = loadedRows;
    $[138] = setRowsSelected;
    $[139] = t43;
  } else {
    t43 = $[139];
  }
  const toggleGroup = t43;
  let t44;
  if ($[140] !== expanded) {
    t44 = id_5 => Boolean(expanded[id_5]);
    $[140] = expanded;
    $[141] = t44;
  } else {
    t44 = $[141];
  }
  const isGroupExpanded = t44;
  let t45;
  if ($[142] !== groupState) {
    t45 = id_6 => groupState[id_6]?.rows ?? [];
    $[142] = groupState;
    $[143] = t45;
  } else {
    t45 = $[143];
  }
  const groupRowsFor = t45;
  let t46;
  if ($[144] !== groupState) {
    t46 = id_7 => groupState[id_7]?.total ?? 0;
    $[144] = groupState;
    $[145] = t46;
  } else {
    t46 = $[145];
  }
  const groupTotalFor = t46;
  let t47;
  if ($[146] !== groupState) {
    t47 = id_8 => groupState[id_8]?.loading ?? false;
    $[146] = groupState;
    $[147] = t47;
  } else {
    t47 = $[147];
  }
  const groupLoadingFor = t47;
  let t48;
  if ($[148] !== groupState || $[149] !== pagination) {
    t48 = id_9 => groupState[id_9]?.pagination ?? {
      page: 1,
      pageSize: pagination.pageSize
    };
    $[148] = groupState;
    $[149] = pagination;
    $[150] = t48;
  } else {
    t48 = $[150];
  }
  const groupPaginationFor = t48;
  let t49;
  if ($[151] !== grouped || $[152] !== rows || $[153] !== visibleItems) {
    t49 = grouped ? visibleItems.flatMap(_temp10) : rows;
    $[151] = grouped;
    $[152] = rows;
    $[153] = visibleItems;
    $[154] = t49;
  } else {
    t49 = $[154];
  }
  const selectableRows = t49;
  let t50;
  if ($[155] !== getRowId || $[156] !== selection) {
    t50 = list_3 => list_3.length > 0 && list_3.every(row_2 => selection[getRowId(row_2)]);
    $[155] = getRowId;
    $[156] = selection;
    $[157] = t50;
  } else {
    t50 = $[157];
  }
  const allSelected = t50;
  let t51;
  if ($[158] !== getRowId || $[159] !== selection) {
    t51 = list_4 => list_4.some(row_3 => selection[getRowId(row_3)]);
    $[158] = getRowId;
    $[159] = selection;
    $[160] = t51;
  } else {
    t51 = $[160];
  }
  const someSelected = t51;
  let t52;
  if ($[161] !== selection) {
    t52 = Object.keys(selection);
    $[161] = selection;
    $[162] = t52;
  } else {
    t52 = $[162];
  }
  let t53;
  if ($[163] !== selection || $[164] !== t52) {
    t53 = t52.filter(id_10 => selection[id_10]);
    $[163] = selection;
    $[164] = t52;
    $[165] = t53;
  } else {
    t53 = $[165];
  }
  const selectedIds = t53;
  let t54;
  if ($[166] !== allSelected || $[167] !== selectableRows) {
    t54 = allSelected(selectableRows);
    $[166] = allSelected;
    $[167] = selectableRows;
    $[168] = t54;
  } else {
    t54 = $[168];
  }
  const allVisibleSelected = t54;
  let t55;
  if ($[169] !== selectableRows || $[170] !== someSelected) {
    t55 = someSelected(selectableRows);
    $[169] = selectableRows;
    $[170] = someSelected;
    $[171] = t55;
  } else {
    t55 = $[171];
  }
  const someVisibleSelected = t55;
  let t56;
  if ($[172] !== selection) {
    t56 = id_11 => Boolean(selection[id_11]);
    $[172] = selection;
    $[173] = t56;
  } else {
    t56 = $[173];
  }
  const isSelected = t56;
  let t57;
  if ($[174] === Symbol.for("react.memo_cache_sentinel")) {
    t57 = id_12 => setSelectionState(prev_4 => ({
      ...prev_4,
      [id_12]: !prev_4[id_12]
    }));
    $[174] = t57;
  } else {
    t57 = $[174];
  }
  const toggleSelected = t57;
  let t58;
  if ($[175] === Symbol.for("react.memo_cache_sentinel")) {
    t58 = () => setSelectionState({});
    $[175] = t58;
  } else {
    t58 = $[175];
  }
  const clearSelection = t58;
  let t59;
  if ($[176] !== allVisibleSelected || $[177] !== selectableRows || $[178] !== setRowsSelected) {
    t59 = () => setRowsSelected(selectableRows, !allVisibleSelected);
    $[176] = allVisibleSelected;
    $[177] = selectableRows;
    $[178] = setRowsSelected;
    $[179] = t59;
  } else {
    t59 = $[179];
  }
  const toggleSelectAll = t59;
  let t60;
  if ($[180] !== allSelected || $[181] !== loadedRows || $[182] !== setRowsSelected) {
    t60 = id_13 => {
      const list_5 = loadedRows(id_13);
      if (list_5.length > 0) {
        setRowsSelected(list_5, !allSelected(list_5));
      }
    };
    $[180] = allSelected;
    $[181] = loadedRows;
    $[182] = setRowsSelected;
    $[183] = t60;
  } else {
    t60 = $[183];
  }
  const toggleSelectGroup = t60;
  let t61;
  if ($[184] === Symbol.for("react.memo_cache_sentinel")) {
    t61 = value_0 => {
      setSearch(value_0);
      setPagination(_temp11);
    };
    $[184] = t61;
  } else {
    t61 = $[184];
  }
  let t62;
  if ($[185] !== allSelected || $[186] !== loadedRows) {
    t62 = id_14 => allSelected(loadedRows(id_14));
    $[185] = allSelected;
    $[186] = loadedRows;
    $[187] = t62;
  } else {
    t62 = $[187];
  }
  let t63;
  if ($[188] !== loadedRows || $[189] !== someSelected) {
    t63 = id_15 => someSelected(loadedRows(id_15));
    $[188] = loadedRows;
    $[189] = someSelected;
    $[190] = t63;
  } else {
    t63 = $[190];
  }
  let t64;
  if ($[191] !== allVisibleSelected || $[192] !== cacheKey || $[193] !== columns || $[194] !== error || $[195] !== fetchChildren || $[196] !== filterLabel || $[197] !== filters || $[198] !== getRowId || $[199] !== groupBy || $[200] !== groupByColumns || $[201] !== groupLoadingFor || $[202] !== groupPaginationFor || $[203] !== groupRowsFor || $[204] !== groupTotalFor || $[205] !== groups || $[206] !== groupsLoading || $[207] !== groupsTotal || $[208] !== hasMore || $[209] !== hiddenColumns || $[210] !== isGroupExpanded || $[211] !== isSelected || $[212] !== listKey || $[213] !== loadMore || $[214] !== loading || $[215] !== loadingMore || $[216] !== pagination || $[217] !== rows || $[218] !== search || $[219] !== selectedIds || $[220] !== selection || $[221] !== someVisibleSelected || $[222] !== sort || $[223] !== t62 || $[224] !== t63 || $[225] !== toggleGroup || $[226] !== toggleSelectAll || $[227] !== toggleSelectGroup || $[228] !== total || $[229] !== visibleColumns || $[230] !== visibleItems) {
    t64 = {
      columns,
      getRowId,
      groupByColumns,
      cacheKey,
      visibleColumns,
      hiddenColumns,
      setColumnHidden,
      search,
      setSearch: t61,
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
      setGroupPage: fetchChildren,
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
      groupAllSelected: t62,
      groupSomeSelected: t63,
      toggleSelectGroup,
      refetch
    };
    $[191] = allVisibleSelected;
    $[192] = cacheKey;
    $[193] = columns;
    $[194] = error;
    $[195] = fetchChildren;
    $[196] = filterLabel;
    $[197] = filters;
    $[198] = getRowId;
    $[199] = groupBy;
    $[200] = groupByColumns;
    $[201] = groupLoadingFor;
    $[202] = groupPaginationFor;
    $[203] = groupRowsFor;
    $[204] = groupTotalFor;
    $[205] = groups;
    $[206] = groupsLoading;
    $[207] = groupsTotal;
    $[208] = hasMore;
    $[209] = hiddenColumns;
    $[210] = isGroupExpanded;
    $[211] = isSelected;
    $[212] = listKey;
    $[213] = loadMore;
    $[214] = loading;
    $[215] = loadingMore;
    $[216] = pagination;
    $[217] = rows;
    $[218] = search;
    $[219] = selectedIds;
    $[220] = selection;
    $[221] = someVisibleSelected;
    $[222] = sort;
    $[223] = t62;
    $[224] = t63;
    $[225] = toggleGroup;
    $[226] = toggleSelectAll;
    $[227] = toggleSelectGroup;
    $[228] = total;
    $[229] = visibleColumns;
    $[230] = visibleItems;
    $[231] = t64;
  } else {
    t64 = $[231];
  }
  return t64;
}
function _temp11(p_4) {
  return {
    ...p_4,
    page: 1
  };
}
function _temp10(item) {
  return item.type === "group-row" ? [item.row] : [];
}
function _temp1(result_2) {
  return {
    groups: result_2.groups
  };
}
function _temp0(result_1) {
  return {
    rows: result_1.rows,
    total: result_1.total
  };
}
function _temp9(entry) {
  return [entry.field, entry.key];
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