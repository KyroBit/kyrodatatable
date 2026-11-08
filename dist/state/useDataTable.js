import { c as _c } from "react/compiler-runtime";
import { startTransition, useEffect, useEffectEvent, useRef, useState } from 'react';
import { cachedList, entryKey, firstPage, load, rememberLastPage } from './cache.js';
import { createClientEngine } from './clientEngine.js';
import { isPathSelected, isRowSelected } from './selection.js';
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
const nothingPicked = {
  all: false,
  groups: {},
  rows: {}
};
const groupIdOf = path => JSON.stringify(path.map(entry => [entry.field, entry.key]));
const contains = (id, other) => other === id || other.startsWith(`${id.slice(0, -1)},`);
const enqueue = (queue, request) => {
  const next = queue.current.then(request);
  queue.current = next.catch(() => undefined);
  return next;
};
export function useDataTable(config) {
  const $ = _c(244);
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
  const [groupsPage, setGroupsPage] = useState(1);
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
  const [picked, setPicked] = useState(nothingPicked);
  let t13;
  let t14;
  if ($[29] !== search || $[30] !== searchDebounceMs) {
    t13 = () => {
      if (!searchDebounceMs) {
        setDebouncedSearch(search);
        return;
      }
      const id = setTimeout(() => startTransition(() => setDebouncedSearch(search)), searchDebounceMs);
      return () => clearTimeout(id);
    };
    t14 = [search, searchDebounceMs];
    $[29] = search;
    $[30] = searchDebounceMs;
    $[31] = t13;
    $[32] = t14;
  } else {
    t13 = $[31];
    t14 = $[32];
  }
  useEffect(t13, t14);
  let t15;
  if ($[33] !== config.data) {
    t15 = rowsKey(config.data);
    $[33] = config.data;
    $[34] = t15;
  } else {
    t15 = $[34];
  }
  const dataKey = t15;
  let t16;
  if ($[35] !== columns || $[36] !== config.applyFilters || $[37] !== config.data) {
    t16 = config.data ? createClientEngine({
      data: config.data,
      columns,
      applyFilters: config.applyFilters
    }) : null;
    $[35] = columns;
    $[36] = config.applyFilters;
    $[37] = config.data;
    $[38] = t16;
  } else {
    t16 = $[38];
  }
  const clientEngine = t16;
  const fetchRecords = config.fetchRecords ?? clientEngine?.fetchRecords;
  const fetchGroups = config.fetchGroups ?? clientEngine?.fetchGroups;
  let t17;
  if ($[39] !== fetchRecords) {
    t17 = params_0 => fetchRecords?.(params_0);
    $[39] = fetchRecords;
    $[40] = t17;
  } else {
    t17 = $[40];
  }
  const fetchPage = useEffectEvent(t17);
  let t18;
  if ($[41] !== fetchGroups) {
    t18 = params_1 => fetchGroups?.(params_1);
    $[41] = fetchGroups;
    $[42] = t18;
  } else {
    t18 = $[42];
  }
  const fetchGroupPage = useEffectEvent(t18);
  let t19;
  if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
    t19 = next => startTransition(() => {
      setFiltersInternal(next);
      setPicked(nothingPicked);
      setPagination(_temp);
    });
    $[43] = t19;
  } else {
    t19 = $[43];
  }
  const setFilters = t19;
  let t20;
  if ($[44] !== filterLabels) {
    t20 = (field_1, value) => filterLabels[field_1]?.[value];
    $[44] = filterLabels;
    $[45] = t20;
  } else {
    t20 = $[45];
  }
  const filterLabel = t20;
  let t21;
  if ($[46] === Symbol.for("react.memo_cache_sentinel")) {
    t21 = (field_2, options) => setFilterLabels(known => {
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
    $[46] = t21;
  } else {
    t21 = $[46];
  }
  const rememberFilterLabels = t21;
  let t22;
  if ($[47] === Symbol.for("react.memo_cache_sentinel")) {
    t22 = fields => startTransition(() => {
      setGroupByField(fields);
      setPicked(nothingPicked);
      setExpanded({});
      setGroupState({});
      setPagination(_temp2);
    });
    $[47] = t22;
  } else {
    t22 = $[47];
  }
  const setGroupBy = t22;
  let t23;
  if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
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
    $[48] = t23;
  } else {
    t23 = $[48];
  }
  const toggleSort = t23;
  let t24;
  if ($[49] === Symbol.for("react.memo_cache_sentinel")) {
    t24 = next_0 => startTransition(() => {
      setSortInternal(next_0);
      setPagination(_temp4);
    });
    $[49] = t24;
  } else {
    t24 = $[49];
  }
  const setSort = t24;
  let t25;
  if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
    t25 = page => startTransition(() => setPagination(p_3 => ({
      ...p_3,
      page
    })));
    $[50] = t25;
  } else {
    t25 = $[50];
  }
  const setPage = t25;
  let t26;
  if ($[51] === Symbol.for("react.memo_cache_sentinel")) {
    t26 = pageSize => startTransition(() => setPagination({
      page: 1,
      pageSize
    }));
    $[51] = t26;
  } else {
    t26 = $[51];
  }
  const setPageSize = t26;
  let t27;
  if ($[52] === Symbol.for("react.memo_cache_sentinel")) {
    t27 = () => setFetchTick(_temp5);
    $[52] = t27;
  } else {
    t27 = $[52];
  }
  const refetch = t27;
  let t28;
  if ($[53] !== config.deps) {
    t28 = JSON.stringify(config.deps ?? []);
    $[53] = config.deps;
    $[54] = t28;
  } else {
    t28 = $[54];
  }
  const depsKey = t28;
  const knownDeps = useRef(depsKey);
  let t29;
  if ($[55] !== depsKey || $[56] !== startingGroup) {
    t29 = () => {
      if (knownDeps.current === depsKey) {
        return;
      }
      knownDeps.current = depsKey;
      if (startingGroup.length > 0) {
        setGroupByField(startingGroup);
        setExpanded({});
        setGroupState({});
      }
      setPicked(nothingPicked);
      setPagination(_temp6);
      setFetchTick(_temp7);
    };
    $[55] = depsKey;
    $[56] = startingGroup;
    $[57] = t29;
  } else {
    t29 = $[57];
  }
  let t30;
  if ($[58] !== depsKey) {
    t30 = [depsKey];
    $[58] = depsKey;
    $[59] = t30;
  } else {
    t30 = $[59];
  }
  useEffect(t29, t30);
  const t31 = filters;
  let listParams;
  let t32;
  if ($[60] !== cacheKey || $[61] !== debouncedSearch || $[62] !== pagination.page || $[63] !== pagination.pageSize || $[64] !== sort || $[65] !== t31) {
    listParams = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: debouncedSearch,
      sort,
      filters: t31
    };
    t32 = entryKey(cacheKey ?? "", listParams);
    $[60] = cacheKey;
    $[61] = debouncedSearch;
    $[62] = pagination.page;
    $[63] = pagination.pageSize;
    $[64] = sort;
    $[65] = t31;
    $[66] = listParams;
    $[67] = t32;
  } else {
    listParams = $[66];
    t32 = $[67];
  }
  const listKey = t32;
  let t33;
  if ($[68] !== cacheKey || $[69] !== fetchPage || $[70] !== grouped || $[71] !== listParams) {
    t33 = () => {
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
    $[68] = cacheKey;
    $[69] = fetchPage;
    $[70] = grouped;
    $[71] = listParams;
    $[72] = t33;
  } else {
    t33 = $[72];
  }
  let t34;
  if ($[73] !== cacheKey || $[74] !== dataKey || $[75] !== debouncedSearch || $[76] !== fetchTick || $[77] !== filters || $[78] !== grouped || $[79] !== pagination.page || $[80] !== pagination.pageSize || $[81] !== sort) {
    t34 = [grouped, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick, cacheKey];
    $[73] = cacheKey;
    $[74] = dataKey;
    $[75] = debouncedSearch;
    $[76] = fetchTick;
    $[77] = filters;
    $[78] = grouped;
    $[79] = pagination.page;
    $[80] = pagination.pageSize;
    $[81] = sort;
    $[82] = t34;
  } else {
    t34 = $[82];
  }
  useEffect(t33, t34);
  let t35;
  if ($[83] !== debouncedSearch || $[84] !== fetchGroupPage || $[85] !== filters || $[86] !== groupBy[0] || $[87] !== groupBy.length || $[88] !== pagination.page || $[89] !== pagination.pageSize || $[90] !== sort) {
    t35 = () => {
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
      generation.current = generation.current + 1;
      setLoadingMore(false);
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
          setTotal(result.records);
          setGroupsPage(params_2.page);
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
    $[83] = debouncedSearch;
    $[84] = fetchGroupPage;
    $[85] = filters;
    $[86] = groupBy[0];
    $[87] = groupBy.length;
    $[88] = pagination.page;
    $[89] = pagination.pageSize;
    $[90] = sort;
    $[91] = t35;
  } else {
    t35 = $[91];
  }
  let t36;
  if ($[92] !== dataKey || $[93] !== debouncedSearch || $[94] !== fetchTick || $[95] !== filters || $[96] !== groupBy || $[97] !== pagination.page || $[98] !== pagination.pageSize || $[99] !== sort) {
    t36 = [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, dataKey, fetchTick];
    $[92] = dataKey;
    $[93] = debouncedSearch;
    $[94] = fetchTick;
    $[95] = filters;
    $[96] = groupBy;
    $[97] = pagination.page;
    $[98] = pagination.pageSize;
    $[99] = sort;
    $[100] = t36;
  } else {
    t36 = $[100];
  }
  useEffect(t35, t36);
  const hasMore = grouped ? (pagination.page - 1) * pagination.pageSize + groups.length < groupsTotal : (pagination.page - 1) * pagination.pageSize + rows.length < total;
  let t37;
  if ($[101] !== fetchGroups || $[102] !== groupBy[0] || $[103] !== groupsLoading || $[104] !== groupsPage || $[105] !== hasMore || $[106] !== listParams || $[107] !== loadingMore) {
    t37 = () => {
      if (!hasMore || groupsLoading || loadingMore) {
        return;
      }
      const page_1 = groupsPage + 1;
      const pending_1 = fetchGroups?.({
        ...listParams,
        page: page_1,
        groupBy: groupBy[0],
        groupPath: []
      });
      if (!pending_1) {
        return;
      }
      const started = generation.current;
      setLoadingMore(true);
      pending_1.then(result_0 => {
        if (generation.current !== started) {
          return;
        }
        startTransition(() => {
          setGroups(prev_0 => [...prev_0, ...result_0.groups]);
          setGroupsTotal(result_0.total);
          setTotal(result_0.records);
          setGroupsPage(page_1);
          setLoadingMore(false);
        });
      }).catch(err_1 => {
        if (generation.current !== started) {
          return;
        }
        startTransition(() => {
          setError(err_1);
          setLoadingMore(false);
        });
      });
    };
    $[101] = fetchGroups;
    $[102] = groupBy[0];
    $[103] = groupsLoading;
    $[104] = groupsPage;
    $[105] = hasMore;
    $[106] = listParams;
    $[107] = loadingMore;
    $[108] = t37;
  } else {
    t37 = $[108];
  }
  const loadMoreGroups = t37;
  let t38;
  if ($[109] !== cacheKey || $[110] !== fetchRecords || $[111] !== hasMore || $[112] !== listKey || $[113] !== listParams || $[114] !== loadedPage || $[115] !== loading) {
    t38 = () => {
      const page_2 = loadedPage + 1;
      const params_3 = {
        ...listParams,
        page: page_2
      };
      const key = entryKey(cacheKey ?? "", params_3);
      if (!fetchRecords || !hasMore || loading || requestedMore.current === key) {
        return;
      }
      requestedMore.current = key;
      const started_0 = generation.current;
      setLoadingMore(true);
      enqueue(queue, () => cacheKey === undefined ? fetchRecords(params_3) : load(key, () => fetchRecords(params_3))).then(result_1 => {
        if (generation.current !== started_0) {
          return;
        }
        if (cacheKey !== undefined) {
          rememberLastPage(listKey, page_2);
        }
        startTransition(() => {
          setRows(prev_1 => [...prev_1, ...result_1.rows]);
          setTotal(result_1.total);
          setLoadedPage(page_2);
          setLoadingMore(false);
        });
      }).catch(err_2 => {
        requestedMore.current = null;
        if (generation.current !== started_0) {
          return;
        }
        startTransition(() => {
          setError(err_2);
          setLoadingMore(false);
        });
      });
    };
    $[109] = cacheKey;
    $[110] = fetchRecords;
    $[111] = hasMore;
    $[112] = listKey;
    $[113] = listParams;
    $[114] = loadedPage;
    $[115] = loading;
    $[116] = t38;
  } else {
    t38 = $[116];
  }
  const loadFlatPage = t38;
  const loadMore = grouped ? loadMoreGroups : loadFlatPage;
  let nodes;
  let rowGroups;
  let visibleItems;
  if ($[117] !== expanded || $[118] !== getRowId || $[119] !== groupBy || $[120] !== groupState || $[121] !== grouped || $[122] !== groups || $[123] !== rows) {
    visibleItems = [];
    nodes = new Map();
    rowGroups = new Map();
    const walk = (list_1, parent) => {
      for (const group of list_1) {
        const depth = parent.length;
        const path = [...parent, {
          field: groupBy[depth],
          key: group.key
        }];
        const id_0 = groupIdOf(path);
        const leaf = depth === groupBy.length - 1;
        const open = Boolean(expanded[id_0]);
        nodes.set(id_0, {
          path,
          leaf
        });
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
        if (!leaf) {
          walk(groupState[id_0]?.groups ?? [], path);
          continue;
        }
        for (const row of groupState[id_0]?.rows ?? []) {
          rowGroups.set(getRowId(row), id_0);
          visibleItems.push({
            type: "group-row",
            row,
            groupId: id_0,
            depth: depth + 1
          });
        }
      }
    };
    if (grouped) {
      walk(groups, []);
    } else {
      for (const row_0 of rows) {
        visibleItems.push({
          type: "row",
          row: row_0
        });
      }
    }
    $[117] = expanded;
    $[118] = getRowId;
    $[119] = groupBy;
    $[120] = groupState;
    $[121] = grouped;
    $[122] = groups;
    $[123] = rows;
    $[124] = nodes;
    $[125] = rowGroups;
    $[126] = visibleItems;
  } else {
    nodes = $[124];
    rowGroups = $[125];
    visibleItems = $[126];
  }
  let t39;
  if ($[127] !== pagination) {
    t39 = (id_1, patch) => setGroupState(prev_2 => ({
      ...prev_2,
      [id_1]: {
        rows: [],
        groups: [],
        total: 0,
        pagination: {
          page: 1,
          pageSize: pagination.pageSize
        },
        loading: false,
        ...prev_2[id_1],
        ...patch
      }
    }));
    $[127] = pagination;
    $[128] = t39;
  } else {
    t39 = $[128];
  }
  const updateGroup = t39;
  let t40;
  if ($[129] !== debouncedSearch || $[130] !== fetchGroups || $[131] !== fetchRecords || $[132] !== filters || $[133] !== groupBy || $[134] !== nodes || $[135] !== pagination || $[136] !== sort || $[137] !== updateGroup) {
    t40 = (id_2, page_3) => {
      const node = nodes.get(id_2);
      if (!node) {
        return;
      }
      const params_4 = {
        page: page_3,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sort,
        filters: filters,
        groupPath: node.path
      };
      const pending_2 = node.leaf ? fetchRecords?.(params_4).then(_temp9) : fetchGroups?.({
        ...params_4,
        groupBy: groupBy[node.path.length]
      }).then(_temp0);
      if (!pending_2) {
        return;
      }
      updateGroup(id_2, {
        pagination: {
          page: page_3,
          pageSize: pagination.pageSize
        },
        loading: true
      });
      pending_2.then(patch_0 => startTransition(() => updateGroup(id_2, {
        ...patch_0,
        loading: false
      }))).catch(err_3 => {
        setError(err_3);
        updateGroup(id_2, {
          loading: false
        });
      });
    };
    $[129] = debouncedSearch;
    $[130] = fetchGroups;
    $[131] = fetchRecords;
    $[132] = filters;
    $[133] = groupBy;
    $[134] = nodes;
    $[135] = pagination;
    $[136] = sort;
    $[137] = updateGroup;
    $[138] = t40;
  } else {
    t40 = $[138];
  }
  const fetchChildren = t40;
  let t41;
  if ($[139] !== expanded || $[140] !== fetchChildren || $[141] !== groupState) {
    t41 = id_3 => {
      setExpanded(prev_3 => ({
        ...prev_3,
        [id_3]: !prev_3[id_3]
      }));
      if (!expanded[id_3] && !groupState[id_3]) {
        fetchChildren(id_3, 1);
      }
    };
    $[139] = expanded;
    $[140] = fetchChildren;
    $[141] = groupState;
    $[142] = t41;
  } else {
    t41 = $[142];
  }
  const toggleGroup = t41;
  let t42;
  if ($[143] !== expanded) {
    t42 = id_4 => Boolean(expanded[id_4]);
    $[143] = expanded;
    $[144] = t42;
  } else {
    t42 = $[144];
  }
  const isGroupExpanded = t42;
  let t43;
  if ($[145] !== groupState) {
    t43 = id_5 => groupState[id_5]?.rows ?? [];
    $[145] = groupState;
    $[146] = t43;
  } else {
    t43 = $[146];
  }
  const groupRowsFor = t43;
  let t44;
  if ($[147] !== groupState) {
    t44 = id_6 => groupState[id_6]?.total ?? 0;
    $[147] = groupState;
    $[148] = t44;
  } else {
    t44 = $[148];
  }
  const groupTotalFor = t44;
  let t45;
  if ($[149] !== groupState) {
    t45 = id_7 => groupState[id_7]?.loading ?? false;
    $[149] = groupState;
    $[150] = t45;
  } else {
    t45 = $[150];
  }
  const groupLoadingFor = t45;
  let t46;
  if ($[151] !== groupState || $[152] !== pagination) {
    t46 = id_8 => groupState[id_8]?.pagination ?? {
      page: 1,
      pageSize: pagination.pageSize
    };
    $[151] = groupState;
    $[152] = pagination;
    $[153] = t46;
  } else {
    t46 = $[153];
  }
  const groupPaginationFor = t46;
  const pathOf = _temp10;
  let groupAllSelected;
  let groupSomeSelected;
  let rowPath;
  let selection;
  let t47;
  if ($[154] !== groupBy || $[155] !== groupState || $[156] !== grouped || $[157] !== groups || $[158] !== picked.all || $[159] !== picked.groups || $[160] !== picked.rows || $[161] !== rowGroups || $[162] !== total) {
    selection = {
      all: picked.all,
      groups: Object.entries(picked.groups).map(t48 => {
        const [id_10, selected] = t48;
        return {
          path: pathOf(id_10),
          selected
        };
      }),
      rows: Object.entries(picked.rows).map(_temp11)
    };
    let t49;
    if ($[168] !== rowGroups) {
      t49 = id_12 => {
        const group_0 = rowGroups.get(id_12);
        return group_0 === undefined ? [] : pathOf(group_0);
      };
      $[168] = rowGroups;
      $[169] = t49;
    } else {
      t49 = $[169];
    }
    rowPath = t49;
    let t50;
    if ($[170] !== picked.groups || $[171] !== picked.rows) {
      t50 = (id_13, selected_0) => Object.entries(picked.groups).some(t51 => {
        const [key_1, value_0] = t51;
        return key_1 !== id_13 && contains(id_13, key_1) && value_0 === selected_0;
      }) || Object.values(picked.rows).some(row_2 => row_2.group !== null && contains(id_13, row_2.group) && row_2.selected === selected_0);
      $[170] = picked.groups;
      $[171] = picked.rows;
      $[172] = t50;
    } else {
      t50 = $[172];
    }
    const decidedBeneath = t50;
    groupAllSelected = id_14 => isPathSelected(selection, pathOf(id_14)) && !decidedBeneath(id_14, false);
    groupSomeSelected = id_15 => isPathSelected(selection, pathOf(id_15)) || decidedBeneath(id_15, true);
    let t51;
    if ($[173] !== picked.rows) {
      t51 = Object.values(picked.rows);
      $[173] = picked.rows;
      $[174] = t51;
    } else {
      t51 = $[174];
    }
    let t52;
    if ($[175] !== picked.all || $[176] !== t51) {
      t52 = t51.filter(row_3 => row_3.selected !== picked.all);
      $[175] = picked.all;
      $[176] = t51;
      $[177] = t52;
    } else {
      t52 = $[177];
    }
    const exceptions = t52.length;
    const countIn = (list_2, parent_0, records) => {
      const unloaded = records - list_2.reduce(_temp12, 0);
      return list_2.reduce((sum_0, group_2) => {
        const path_0 = [...parent_0, {
          field: groupBy[parent_0.length],
          key: group_2.key
        }];
        const id_16 = groupIdOf(path_0);
        const on = isPathSelected(selection, path_0);
        const children = groupState[id_16]?.groups;
        if (!decidedBeneath(id_16, !on)) {
          return sum_0 + (on ? group_2.count : 0);
        }
        if (path_0.length < groupBy.length && children) {
          return sum_0 + countIn(children, path_0, group_2.count);
        }
        const flipped = Object.values(picked.rows).filter(row_4 => row_4.group === id_16 && row_4.selected !== on).length;
        return sum_0 + (on ? group_2.count - flipped : flipped);
      }, isPathSelected(selection, parent_0) ? unloaded : 0);
    };
    t47 = grouped ? countIn(groups, [], total) : picked.all ? total - exceptions : exceptions;
    $[154] = groupBy;
    $[155] = groupState;
    $[156] = grouped;
    $[157] = groups;
    $[158] = picked.all;
    $[159] = picked.groups;
    $[160] = picked.rows;
    $[161] = rowGroups;
    $[162] = total;
    $[163] = groupAllSelected;
    $[164] = groupSomeSelected;
    $[165] = rowPath;
    $[166] = selection;
    $[167] = t47;
  } else {
    groupAllSelected = $[163];
    groupSomeSelected = $[164];
    rowPath = $[165];
    selection = $[166];
    t47 = $[167];
  }
  const selectedCount = t47;
  let t48;
  if ($[178] !== picked.all || $[179] !== picked.groups || $[180] !== picked.rows) {
    t48 = picked.all && !Object.values(picked.groups).includes(false) && !Object.values(picked.rows).some(_temp13);
    $[178] = picked.all;
    $[179] = picked.groups;
    $[180] = picked.rows;
    $[181] = t48;
  } else {
    t48 = $[181];
  }
  const allSelected = t48;
  let t49;
  if ($[182] !== picked.all || $[183] !== picked.groups || $[184] !== picked.rows) {
    t49 = picked.all || Object.values(picked.groups).includes(true) || Object.values(picked.rows).some(_temp14);
    $[182] = picked.all;
    $[183] = picked.groups;
    $[184] = picked.rows;
    $[185] = t49;
  } else {
    t49 = $[185];
  }
  const someSelected = t49;
  let t50;
  if ($[186] !== rowPath || $[187] !== selection) {
    t50 = id_17 => isRowSelected(selection, id_17, rowPath(id_17));
    $[186] = rowPath;
    $[187] = selection;
    $[188] = t50;
  } else {
    t50 = $[188];
  }
  const isSelected = t50;
  let t51;
  if ($[189] !== isSelected || $[190] !== rowGroups || $[191] !== rowPath || $[192] !== selection) {
    t51 = id_18 => {
      const group_3 = rowGroups.get(id_18) ?? null;
      const next_1 = !isSelected(id_18);
      const inherited = isPathSelected(selection, rowPath(id_18));
      setPicked(prev_4 => {
        const rows_0 = {
          ...prev_4.rows
        };
        if (next_1 === inherited) {
          delete rows_0[id_18];
        } else {
          rows_0[id_18] = {
            selected: next_1,
            group: group_3
          };
        }
        return {
          ...prev_4,
          rows: rows_0
        };
      });
    };
    $[189] = isSelected;
    $[190] = rowGroups;
    $[191] = rowPath;
    $[192] = selection;
    $[193] = t51;
  } else {
    t51 = $[193];
  }
  const toggleSelected = t51;
  let t52;
  if ($[194] !== groupAllSelected || $[195] !== selection) {
    t52 = id_19 => {
      const path_1 = pathOf(id_19);
      const next_2 = !groupAllSelected(id_19);
      const inherited_0 = isPathSelected(selection, path_1.slice(0, -1));
      setPicked(prev_5 => {
        const groups_0 = Object.fromEntries(Object.entries(prev_5.groups).filter(t53 => {
          const [key_2] = t53;
          return !contains(id_19, key_2);
        }));
        const rows_1 = Object.fromEntries(Object.entries(prev_5.rows).filter(t54 => {
          const [, row_7] = t54;
          return row_7.group === null || !contains(id_19, row_7.group);
        }));
        if (next_2 !== inherited_0) {
          groups_0[id_19] = next_2;
        }
        return {
          ...prev_5,
          groups: groups_0,
          rows: rows_1
        };
      });
    };
    $[194] = groupAllSelected;
    $[195] = selection;
    $[196] = t52;
  } else {
    t52 = $[196];
  }
  const toggleSelectGroup = t52;
  let t53;
  if ($[197] === Symbol.for("react.memo_cache_sentinel")) {
    t53 = next_3 => setPicked({
      all: next_3.all,
      groups: Object.fromEntries(next_3.groups.map(_temp15)),
      rows: Object.fromEntries(next_3.rows.map(_temp16))
    });
    $[197] = t53;
  } else {
    t53 = $[197];
  }
  const setSelection = t53;
  let t54;
  if ($[198] === Symbol.for("react.memo_cache_sentinel")) {
    t54 = value_1 => {
      setSearch(value_1);
      setPicked(nothingPicked);
      setPagination(_temp17);
    };
    $[198] = t54;
  } else {
    t54 = $[198];
  }
  let t55;
  if ($[199] === Symbol.for("react.memo_cache_sentinel")) {
    t55 = () => setPicked(nothingPicked);
    $[199] = t55;
  } else {
    t55 = $[199];
  }
  let t56;
  if ($[200] !== allSelected) {
    t56 = () => setPicked({
      all: !allSelected,
      groups: {},
      rows: {}
    });
    $[200] = allSelected;
    $[201] = t56;
  } else {
    t56 = $[201];
  }
  let t57;
  if ($[202] !== allSelected || $[203] !== cacheKey || $[204] !== columns || $[205] !== error || $[206] !== fetchChildren || $[207] !== filterLabel || $[208] !== filters || $[209] !== getRowId || $[210] !== groupAllSelected || $[211] !== groupBy || $[212] !== groupByColumns || $[213] !== groupLoadingFor || $[214] !== groupPaginationFor || $[215] !== groupRowsFor || $[216] !== groupSomeSelected || $[217] !== groupTotalFor || $[218] !== groups || $[219] !== groupsLoading || $[220] !== groupsTotal || $[221] !== hasMore || $[222] !== hiddenColumns || $[223] !== isGroupExpanded || $[224] !== isSelected || $[225] !== listKey || $[226] !== loadMore || $[227] !== loading || $[228] !== loadingMore || $[229] !== pagination || $[230] !== rows || $[231] !== search || $[232] !== selectedCount || $[233] !== selection || $[234] !== someSelected || $[235] !== sort || $[236] !== t56 || $[237] !== toggleGroup || $[238] !== toggleSelectGroup || $[239] !== toggleSelected || $[240] !== total || $[241] !== visibleColumns || $[242] !== visibleItems) {
    t57 = {
      columns,
      getRowId,
      groupByColumns,
      cacheKey,
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
      selectedCount,
      isSelected,
      toggleSelected,
      setSelection,
      clearSelection: t55,
      toggleSelectAll: t56,
      allSelected,
      someSelected,
      groupAllSelected,
      groupSomeSelected,
      toggleSelectGroup,
      refetch
    };
    $[202] = allSelected;
    $[203] = cacheKey;
    $[204] = columns;
    $[205] = error;
    $[206] = fetchChildren;
    $[207] = filterLabel;
    $[208] = filters;
    $[209] = getRowId;
    $[210] = groupAllSelected;
    $[211] = groupBy;
    $[212] = groupByColumns;
    $[213] = groupLoadingFor;
    $[214] = groupPaginationFor;
    $[215] = groupRowsFor;
    $[216] = groupSomeSelected;
    $[217] = groupTotalFor;
    $[218] = groups;
    $[219] = groupsLoading;
    $[220] = groupsTotal;
    $[221] = hasMore;
    $[222] = hiddenColumns;
    $[223] = isGroupExpanded;
    $[224] = isSelected;
    $[225] = listKey;
    $[226] = loadMore;
    $[227] = loading;
    $[228] = loadingMore;
    $[229] = pagination;
    $[230] = rows;
    $[231] = search;
    $[232] = selectedCount;
    $[233] = selection;
    $[234] = someSelected;
    $[235] = sort;
    $[236] = t56;
    $[237] = toggleGroup;
    $[238] = toggleSelectGroup;
    $[239] = toggleSelected;
    $[240] = total;
    $[241] = visibleColumns;
    $[242] = visibleItems;
    $[243] = t57;
  } else {
    t57 = $[243];
  }
  return t57;
}
function _temp17(p_4) {
  return {
    ...p_4,
    page: 1
  };
}
function _temp16(row_8) {
  return [row_8.id, {
    selected: row_8.selected,
    group: null
  }];
}
function _temp15(group_4) {
  return [groupIdOf(group_4.path), group_4.selected];
}
function _temp14(row_6) {
  return row_6.selected;
}
function _temp13(row_5) {
  return !row_5.selected;
}
function _temp12(sum, group_1) {
  return sum + group_1.count;
}
function _temp11(t0) {
  const [id_11, row_1] = t0;
  return {
    id: id_11,
    selected: row_1.selected
  };
}
function _temp10(id_9) {
  return JSON.parse(id_9).map(_temp1);
}
function _temp1(t0) {
  const [field_4, key_0] = t0;
  return {
    field: field_4,
    key: key_0
  };
}
function _temp0(result_3) {
  return {
    groups: result_3.groups,
    total: result_3.total
  };
}
function _temp9(result_2) {
  return {
    rows: result_2.rows,
    total: result_2.total
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