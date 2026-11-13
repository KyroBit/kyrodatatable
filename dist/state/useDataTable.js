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
  const $ = _c(259);
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
  const [groupPageSize, setGroupPageSizeState] = useState(config.initialGroupPageSize ?? initial.params.pageSize);
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
    t27 = size => startTransition(() => {
      setGroupPageSizeState(size);
      setExpanded({});
      setGroupState({});
      setPagination(_temp5);
    });
    $[52] = t27;
  } else {
    t27 = $[52];
  }
  const setGroupPageSize = t27;
  let t28;
  if ($[53] === Symbol.for("react.memo_cache_sentinel")) {
    t28 = () => setFetchTick(_temp6);
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
      setPicked(nothingPicked);
      setPagination(_temp7);
      setFetchTick(_temp8);
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
      queue.current = pending.catch(_temp9);
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
  if ($[84] !== debouncedSearch || $[85] !== fetchGroupPage || $[86] !== filters || $[87] !== groupBy[0] || $[88] !== groupBy.length || $[89] !== groupPageSize || $[90] !== pagination.page || $[91] !== sort) {
    t36 = () => {
      if (groupBy.length === 0) {
        return;
      }
      const params_2 = {
        page: pagination.page,
        pageSize: groupPageSize,
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
          setExpanded({});
          setGroupState({});
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
    $[89] = groupPageSize;
    $[90] = pagination.page;
    $[91] = sort;
    $[92] = t36;
  } else {
    t36 = $[92];
  }
  let t37;
  if ($[93] !== dataKey || $[94] !== debouncedSearch || $[95] !== fetchTick || $[96] !== filters || $[97] !== groupBy || $[98] !== groupPageSize || $[99] !== pagination.page || $[100] !== sort) {
    t37 = [groupBy, pagination.page, groupPageSize, debouncedSearch, sort, filters, dataKey, fetchTick];
    $[93] = dataKey;
    $[94] = debouncedSearch;
    $[95] = fetchTick;
    $[96] = filters;
    $[97] = groupBy;
    $[98] = groupPageSize;
    $[99] = pagination.page;
    $[100] = sort;
    $[101] = t37;
  } else {
    t37 = $[101];
  }
  useEffect(t36, t37);
  const hasMore = grouped ? (pagination.page - 1) * groupPageSize + groups.length < groupsTotal : (pagination.page - 1) * pagination.pageSize + rows.length < total;
  let t38;
  if ($[102] !== fetchGroups || $[103] !== groupBy[0] || $[104] !== groupPageSize || $[105] !== groupsLoading || $[106] !== groupsPage || $[107] !== hasMore || $[108] !== listParams || $[109] !== loadingMore) {
    t38 = () => {
      if (!hasMore || groupsLoading || loadingMore) {
        return;
      }
      const page_1 = groupsPage + 1;
      const pending_1 = fetchGroups?.({
        ...listParams,
        page: page_1,
        pageSize: groupPageSize,
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
    $[102] = fetchGroups;
    $[103] = groupBy[0];
    $[104] = groupPageSize;
    $[105] = groupsLoading;
    $[106] = groupsPage;
    $[107] = hasMore;
    $[108] = listParams;
    $[109] = loadingMore;
    $[110] = t38;
  } else {
    t38 = $[110];
  }
  const loadMoreGroups = t38;
  let t39;
  if ($[111] !== cacheKey || $[112] !== fetchRecords || $[113] !== hasMore || $[114] !== listKey || $[115] !== listParams || $[116] !== loadedPage || $[117] !== loading) {
    t39 = () => {
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
    $[111] = cacheKey;
    $[112] = fetchRecords;
    $[113] = hasMore;
    $[114] = listKey;
    $[115] = listParams;
    $[116] = loadedPage;
    $[117] = loading;
    $[118] = t39;
  } else {
    t39 = $[118];
  }
  const loadFlatPage = t39;
  const loadMore = grouped ? loadMoreGroups : loadFlatPage;
  let nodes;
  let rowGroups;
  let visibleItems;
  if ($[119] !== expanded || $[120] !== getRowId || $[121] !== groupBy || $[122] !== groupState || $[123] !== grouped || $[124] !== groups || $[125] !== rows) {
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
    $[119] = expanded;
    $[120] = getRowId;
    $[121] = groupBy;
    $[122] = groupState;
    $[123] = grouped;
    $[124] = groups;
    $[125] = rows;
    $[126] = nodes;
    $[127] = rowGroups;
    $[128] = visibleItems;
  } else {
    nodes = $[126];
    rowGroups = $[127];
    visibleItems = $[128];
  }
  let t40;
  if ($[129] !== pagination) {
    t40 = (id_1, patch) => setGroupState(prev_2 => ({
      ...prev_2,
      [id_1]: {
        ...(prev_2[id_1] ?? {
          rows: [],
          groups: [],
          total: 0,
          pagination: {
            page: 1,
            pageSize: pagination.pageSize
          },
          loading: false
        }),
        ...patch
      }
    }));
    $[129] = pagination;
    $[130] = t40;
  } else {
    t40 = $[130];
  }
  const updateGroup = t40;
  let t41;
  if ($[131] !== debouncedSearch || $[132] !== fetchGroups || $[133] !== fetchRecords || $[134] !== filters || $[135] !== groupBy || $[136] !== groupPageSize || $[137] !== nodes || $[138] !== pagination || $[139] !== sort) {
    t41 = (id_2, page_3) => {
      const node = nodes.get(id_2);
      if (!node) {
        return;
      }
      const pageSize_0 = node.leaf ? pagination.pageSize : groupPageSize;
      const params_4 = {
        page: page_3,
        pageSize: pageSize_0,
        search: debouncedSearch,
        sort,
        filters: filters,
        groupPath: node.path
      };
      const pending_2 = node.leaf ? fetchRecords?.(params_4).then(_temp0) : fetchGroups?.({
        ...params_4,
        groupBy: groupBy[node.path.length]
      }).then(_temp1);
      return pending_2 && {
        pending: pending_2,
        pageSize: pageSize_0
      };
    };
    $[131] = debouncedSearch;
    $[132] = fetchGroups;
    $[133] = fetchRecords;
    $[134] = filters;
    $[135] = groupBy;
    $[136] = groupPageSize;
    $[137] = nodes;
    $[138] = pagination;
    $[139] = sort;
    $[140] = t41;
  } else {
    t41 = $[140];
  }
  const requestChildren = t41;
  let t42;
  if ($[141] !== requestChildren || $[142] !== updateGroup) {
    t42 = (id_3, page_4) => {
      const request = requestChildren(id_3, page_4);
      if (!request) {
        return;
      }
      updateGroup(id_3, {
        pagination: {
          page: page_4,
          pageSize: request.pageSize
        },
        loading: true
      });
      request.pending.then(patch_0 => startTransition(() => updateGroup(id_3, {
        ...patch_0,
        loading: false
      }))).catch(err_3 => {
        setError(err_3);
        updateGroup(id_3, {
          loading: false
        });
      });
    };
    $[141] = requestChildren;
    $[142] = updateGroup;
    $[143] = t42;
  } else {
    t42 = $[143];
  }
  const fetchChildren = t42;
  let t43;
  if ($[144] !== groupState) {
    t43 = id_4 => {
      const state = groupState[id_4];
      return state !== undefined && state.pagination.page * state.pagination.pageSize < state.total;
    };
    $[144] = groupState;
    $[145] = t43;
  } else {
    t43 = $[145];
  }
  const groupHasMore = t43;
  let t44;
  if ($[146] !== groupHasMore || $[147] !== groupState || $[148] !== requestChildren || $[149] !== updateGroup) {
    t44 = id_5 => {
      const state_0 = groupState[id_5];
      if (!state_0 || state_0.loading || !groupHasMore(id_5)) {
        return;
      }
      const page_5 = state_0.pagination.page + 1;
      const request_0 = requestChildren(id_5, page_5);
      if (!request_0) {
        return;
      }
      updateGroup(id_5, {
        loading: true
      });
      request_0.pending.then(patch_1 => startTransition(() => setGroupState(prev_3 => {
        const current_1 = prev_3[id_5];
        return {
          ...prev_3,
          [id_5]: {
            ...current_1,
            rows: [...current_1.rows, ...(patch_1.rows ?? [])],
            groups: [...current_1.groups, ...(patch_1.groups ?? [])],
            total: patch_1.total ?? current_1.total,
            pagination: {
              page: page_5,
              pageSize: request_0.pageSize
            },
            loading: false
          }
        };
      }))).catch(err_4 => {
        setError(err_4);
        updateGroup(id_5, {
          loading: false
        });
      });
    };
    $[146] = groupHasMore;
    $[147] = groupState;
    $[148] = requestChildren;
    $[149] = updateGroup;
    $[150] = t44;
  } else {
    t44 = $[150];
  }
  const loadMoreInGroup = t44;
  let t45;
  if ($[151] !== expanded || $[152] !== fetchChildren || $[153] !== groupState) {
    t45 = id_6 => {
      setExpanded(prev_4 => ({
        ...prev_4,
        [id_6]: !prev_4[id_6]
      }));
      if (!expanded[id_6] && !groupState[id_6]) {
        fetchChildren(id_6, 1);
      }
    };
    $[151] = expanded;
    $[152] = fetchChildren;
    $[153] = groupState;
    $[154] = t45;
  } else {
    t45 = $[154];
  }
  const toggleGroup = t45;
  let t46;
  if ($[155] !== expanded) {
    t46 = id_7 => Boolean(expanded[id_7]);
    $[155] = expanded;
    $[156] = t46;
  } else {
    t46 = $[156];
  }
  const isGroupExpanded = t46;
  let t47;
  if ($[157] !== groupState) {
    t47 = id_8 => groupState[id_8]?.rows ?? [];
    $[157] = groupState;
    $[158] = t47;
  } else {
    t47 = $[158];
  }
  const groupRowsFor = t47;
  let t48;
  if ($[159] !== groupState) {
    t48 = id_9 => groupState[id_9]?.total ?? 0;
    $[159] = groupState;
    $[160] = t48;
  } else {
    t48 = $[160];
  }
  const groupTotalFor = t48;
  let t49;
  if ($[161] !== groupState) {
    t49 = id_10 => groupState[id_10]?.loading ?? false;
    $[161] = groupState;
    $[162] = t49;
  } else {
    t49 = $[162];
  }
  const groupLoadingFor = t49;
  let t50;
  if ($[163] !== groupState || $[164] !== pagination) {
    t50 = id_11 => groupState[id_11]?.pagination ?? {
      page: 1,
      pageSize: pagination.pageSize
    };
    $[163] = groupState;
    $[164] = pagination;
    $[165] = t50;
  } else {
    t50 = $[165];
  }
  const groupPaginationFor = t50;
  const pathOf = _temp11;
  let groupAllSelected;
  let groupSomeSelected;
  let rowPath;
  let selection;
  let t51;
  if ($[166] !== groupBy || $[167] !== groupState || $[168] !== grouped || $[169] !== groups || $[170] !== picked.all || $[171] !== picked.groups || $[172] !== picked.rows || $[173] !== rowGroups || $[174] !== total) {
    selection = {
      all: picked.all,
      groups: Object.entries(picked.groups).map(t52 => {
        const [id_13, selected] = t52;
        return {
          path: pathOf(id_13),
          selected
        };
      }),
      rows: Object.entries(picked.rows).map(_temp12)
    };
    let t53;
    if ($[180] !== rowGroups) {
      t53 = id_15 => {
        const group_0 = rowGroups.get(id_15);
        return group_0 === undefined ? [] : pathOf(group_0);
      };
      $[180] = rowGroups;
      $[181] = t53;
    } else {
      t53 = $[181];
    }
    rowPath = t53;
    let t54;
    if ($[182] !== picked.groups || $[183] !== picked.rows) {
      t54 = (id_16, selected_0) => Object.entries(picked.groups).some(t55 => {
        const [key_1, value_0] = t55;
        return key_1 !== id_16 && contains(id_16, key_1) && value_0 === selected_0;
      }) || Object.values(picked.rows).some(row_2 => row_2.group !== null && contains(id_16, row_2.group) && row_2.selected === selected_0);
      $[182] = picked.groups;
      $[183] = picked.rows;
      $[184] = t54;
    } else {
      t54 = $[184];
    }
    const decidedBeneath = t54;
    groupAllSelected = id_17 => isPathSelected(selection, pathOf(id_17)) && !decidedBeneath(id_17, false);
    groupSomeSelected = id_18 => isPathSelected(selection, pathOf(id_18)) || decidedBeneath(id_18, true);
    let t55;
    if ($[185] !== picked.rows) {
      t55 = Object.values(picked.rows);
      $[185] = picked.rows;
      $[186] = t55;
    } else {
      t55 = $[186];
    }
    let t56;
    if ($[187] !== picked.all || $[188] !== t55) {
      t56 = t55.filter(row_3 => row_3.selected !== picked.all);
      $[187] = picked.all;
      $[188] = t55;
      $[189] = t56;
    } else {
      t56 = $[189];
    }
    const exceptions = t56.length;
    const countIn = (list_2, parent_0, records) => {
      const unloaded = records - list_2.reduce(_temp13, 0);
      return list_2.reduce((sum_0, group_2) => {
        const path_0 = [...parent_0, {
          field: groupBy[parent_0.length],
          key: group_2.key
        }];
        const id_19 = groupIdOf(path_0);
        const on = isPathSelected(selection, path_0);
        const children = groupState[id_19]?.groups;
        if (!decidedBeneath(id_19, !on)) {
          return sum_0 + (on ? group_2.count : 0);
        }
        if (path_0.length < groupBy.length && children) {
          return sum_0 + countIn(children, path_0, group_2.count);
        }
        const flipped = Object.values(picked.rows).filter(row_4 => row_4.group === id_19 && row_4.selected !== on).length;
        return sum_0 + (on ? group_2.count - flipped : flipped);
      }, isPathSelected(selection, parent_0) ? unloaded : 0);
    };
    t51 = grouped ? countIn(groups, [], total) : picked.all ? total - exceptions : exceptions;
    $[166] = groupBy;
    $[167] = groupState;
    $[168] = grouped;
    $[169] = groups;
    $[170] = picked.all;
    $[171] = picked.groups;
    $[172] = picked.rows;
    $[173] = rowGroups;
    $[174] = total;
    $[175] = groupAllSelected;
    $[176] = groupSomeSelected;
    $[177] = rowPath;
    $[178] = selection;
    $[179] = t51;
  } else {
    groupAllSelected = $[175];
    groupSomeSelected = $[176];
    rowPath = $[177];
    selection = $[178];
    t51 = $[179];
  }
  const selectedCount = t51;
  let t52;
  if ($[190] !== picked.all || $[191] !== picked.groups || $[192] !== picked.rows) {
    t52 = picked.all && !Object.values(picked.groups).includes(false) && !Object.values(picked.rows).some(_temp14);
    $[190] = picked.all;
    $[191] = picked.groups;
    $[192] = picked.rows;
    $[193] = t52;
  } else {
    t52 = $[193];
  }
  const allSelected = t52;
  let t53;
  if ($[194] !== picked.all || $[195] !== picked.groups || $[196] !== picked.rows) {
    t53 = picked.all || Object.values(picked.groups).includes(true) || Object.values(picked.rows).some(_temp15);
    $[194] = picked.all;
    $[195] = picked.groups;
    $[196] = picked.rows;
    $[197] = t53;
  } else {
    t53 = $[197];
  }
  const someSelected = t53;
  let t54;
  if ($[198] !== rowPath || $[199] !== selection) {
    t54 = id_20 => isRowSelected(selection, id_20, rowPath(id_20));
    $[198] = rowPath;
    $[199] = selection;
    $[200] = t54;
  } else {
    t54 = $[200];
  }
  const isSelected = t54;
  let t55;
  if ($[201] !== isSelected || $[202] !== rowGroups || $[203] !== rowPath || $[204] !== selection) {
    t55 = id_21 => {
      const group_3 = rowGroups.get(id_21) ?? null;
      const next_1 = !isSelected(id_21);
      const inherited = isPathSelected(selection, rowPath(id_21));
      setPicked(prev_5 => {
        const rows_0 = {
          ...prev_5.rows
        };
        if (next_1 === inherited) {
          delete rows_0[id_21];
        } else {
          rows_0[id_21] = {
            selected: next_1,
            group: group_3
          };
        }
        return {
          ...prev_5,
          rows: rows_0
        };
      });
    };
    $[201] = isSelected;
    $[202] = rowGroups;
    $[203] = rowPath;
    $[204] = selection;
    $[205] = t55;
  } else {
    t55 = $[205];
  }
  const toggleSelected = t55;
  let t56;
  if ($[206] !== groupAllSelected || $[207] !== selection) {
    t56 = id_22 => {
      const path_1 = pathOf(id_22);
      const next_2 = !groupAllSelected(id_22);
      const inherited_0 = isPathSelected(selection, path_1.slice(0, -1));
      setPicked(prev_6 => {
        const groups_0 = Object.fromEntries(Object.entries(prev_6.groups).filter(t57 => {
          const [key_2] = t57;
          return !contains(id_22, key_2);
        }));
        const rows_1 = Object.fromEntries(Object.entries(prev_6.rows).filter(t58 => {
          const [, row_7] = t58;
          return row_7.group === null || !contains(id_22, row_7.group);
        }));
        if (next_2 !== inherited_0) {
          groups_0[id_22] = next_2;
        }
        return {
          ...prev_6,
          groups: groups_0,
          rows: rows_1
        };
      });
    };
    $[206] = groupAllSelected;
    $[207] = selection;
    $[208] = t56;
  } else {
    t56 = $[208];
  }
  const toggleSelectGroup = t56;
  let t57;
  if ($[209] === Symbol.for("react.memo_cache_sentinel")) {
    t57 = next_3 => setPicked({
      all: next_3.all,
      groups: Object.fromEntries(next_3.groups.map(_temp16)),
      rows: Object.fromEntries(next_3.rows.map(_temp17))
    });
    $[209] = t57;
  } else {
    t57 = $[209];
  }
  const setSelection = t57;
  let t58;
  if ($[210] === Symbol.for("react.memo_cache_sentinel")) {
    t58 = value_1 => {
      setSearch(value_1);
      setPagination(_temp18);
    };
    $[210] = t58;
  } else {
    t58 = $[210];
  }
  let t59;
  if ($[211] === Symbol.for("react.memo_cache_sentinel")) {
    t59 = () => setPicked(nothingPicked);
    $[211] = t59;
  } else {
    t59 = $[211];
  }
  let t60;
  if ($[212] !== allSelected) {
    t60 = () => setPicked({
      all: !allSelected,
      groups: {},
      rows: {}
    });
    $[212] = allSelected;
    $[213] = t60;
  } else {
    t60 = $[213];
  }
  let t61;
  if ($[214] !== allSelected || $[215] !== cacheKey || $[216] !== columns || $[217] !== error || $[218] !== fetchChildren || $[219] !== filterLabel || $[220] !== filters || $[221] !== getRowId || $[222] !== groupAllSelected || $[223] !== groupBy || $[224] !== groupByColumns || $[225] !== groupHasMore || $[226] !== groupLoadingFor || $[227] !== groupPageSize || $[228] !== groupPaginationFor || $[229] !== groupRowsFor || $[230] !== groupSomeSelected || $[231] !== groupTotalFor || $[232] !== groups || $[233] !== groupsLoading || $[234] !== groupsTotal || $[235] !== hasMore || $[236] !== hiddenColumns || $[237] !== isGroupExpanded || $[238] !== isSelected || $[239] !== listKey || $[240] !== loadMore || $[241] !== loadMoreInGroup || $[242] !== loading || $[243] !== loadingMore || $[244] !== pagination || $[245] !== rows || $[246] !== search || $[247] !== selectedCount || $[248] !== selection || $[249] !== someSelected || $[250] !== sort || $[251] !== t60 || $[252] !== toggleGroup || $[253] !== toggleSelectGroup || $[254] !== toggleSelected || $[255] !== total || $[256] !== visibleColumns || $[257] !== visibleItems) {
    t61 = {
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
      groupPageSize,
      setGroupPageSize,
      isGroupExpanded,
      toggleGroup,
      groupRows: groupRowsFor,
      groupTotal: groupTotalFor,
      groupLoading: groupLoadingFor,
      groupPagination: groupPaginationFor,
      setGroupPage: fetchChildren,
      groupHasMore,
      loadMoreInGroup,
      visibleItems,
      selection,
      selectedCount,
      isSelected,
      toggleSelected,
      setSelection,
      clearSelection: t59,
      toggleSelectAll: t60,
      allSelected,
      someSelected,
      groupAllSelected,
      groupSomeSelected,
      toggleSelectGroup,
      refetch
    };
    $[214] = allSelected;
    $[215] = cacheKey;
    $[216] = columns;
    $[217] = error;
    $[218] = fetchChildren;
    $[219] = filterLabel;
    $[220] = filters;
    $[221] = getRowId;
    $[222] = groupAllSelected;
    $[223] = groupBy;
    $[224] = groupByColumns;
    $[225] = groupHasMore;
    $[226] = groupLoadingFor;
    $[227] = groupPageSize;
    $[228] = groupPaginationFor;
    $[229] = groupRowsFor;
    $[230] = groupSomeSelected;
    $[231] = groupTotalFor;
    $[232] = groups;
    $[233] = groupsLoading;
    $[234] = groupsTotal;
    $[235] = hasMore;
    $[236] = hiddenColumns;
    $[237] = isGroupExpanded;
    $[238] = isSelected;
    $[239] = listKey;
    $[240] = loadMore;
    $[241] = loadMoreInGroup;
    $[242] = loading;
    $[243] = loadingMore;
    $[244] = pagination;
    $[245] = rows;
    $[246] = search;
    $[247] = selectedCount;
    $[248] = selection;
    $[249] = someSelected;
    $[250] = sort;
    $[251] = t60;
    $[252] = toggleGroup;
    $[253] = toggleSelectGroup;
    $[254] = toggleSelected;
    $[255] = total;
    $[256] = visibleColumns;
    $[257] = visibleItems;
    $[258] = t61;
  } else {
    t61 = $[258];
  }
  return t61;
}
function _temp18(p_5) {
  return {
    ...p_5,
    page: 1
  };
}
function _temp17(row_8) {
  return [row_8.id, {
    selected: row_8.selected,
    group: null
  }];
}
function _temp16(group_4) {
  return [groupIdOf(group_4.path), group_4.selected];
}
function _temp15(row_6) {
  return row_6.selected;
}
function _temp14(row_5) {
  return !row_5.selected;
}
function _temp13(sum, group_1) {
  return sum + group_1.count;
}
function _temp12(t0) {
  const [id_14, row_1] = t0;
  return {
    id: id_14,
    selected: row_1.selected
  };
}
function _temp11(id_12) {
  return JSON.parse(id_12).map(_temp10);
}
function _temp10(t0) {
  const [field_4, key_0] = t0;
  return {
    field: field_4,
    key: key_0
  };
}
function _temp1(result_3) {
  return {
    groups: result_3.groups,
    total: result_3.total
  };
}
function _temp0(result_2) {
  return {
    rows: result_2.rows,
    total: result_2.total
  };
}
function _temp9() {}
function _temp8(t_0) {
  return t_0 + 1;
}
function _temp7(prev) {
  return {
    ...prev,
    page: 1
  };
}
function _temp6(t) {
  return t + 1;
}
function _temp5(p_4) {
  return {
    ...p_4,
    page: 1
  };
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