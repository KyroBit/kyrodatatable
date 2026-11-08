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
  const $ = _c(248);
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
    $[129] = pagination;
    $[130] = t40;
  } else {
    t40 = $[130];
  }
  const updateGroup = t40;
  let t41;
  if ($[131] !== debouncedSearch || $[132] !== fetchGroups || $[133] !== fetchRecords || $[134] !== filters || $[135] !== groupBy || $[136] !== groupPageSize || $[137] !== nodes || $[138] !== pagination || $[139] !== sort || $[140] !== updateGroup) {
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
      if (!pending_2) {
        return;
      }
      updateGroup(id_2, {
        pagination: {
          page: page_3,
          pageSize: pageSize_0
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
    $[131] = debouncedSearch;
    $[132] = fetchGroups;
    $[133] = fetchRecords;
    $[134] = filters;
    $[135] = groupBy;
    $[136] = groupPageSize;
    $[137] = nodes;
    $[138] = pagination;
    $[139] = sort;
    $[140] = updateGroup;
    $[141] = t41;
  } else {
    t41 = $[141];
  }
  const fetchChildren = t41;
  let t42;
  if ($[142] !== expanded || $[143] !== fetchChildren || $[144] !== groupState) {
    t42 = id_3 => {
      setExpanded(prev_3 => ({
        ...prev_3,
        [id_3]: !prev_3[id_3]
      }));
      if (!expanded[id_3] && !groupState[id_3]) {
        fetchChildren(id_3, 1);
      }
    };
    $[142] = expanded;
    $[143] = fetchChildren;
    $[144] = groupState;
    $[145] = t42;
  } else {
    t42 = $[145];
  }
  const toggleGroup = t42;
  let t43;
  if ($[146] !== expanded) {
    t43 = id_4 => Boolean(expanded[id_4]);
    $[146] = expanded;
    $[147] = t43;
  } else {
    t43 = $[147];
  }
  const isGroupExpanded = t43;
  let t44;
  if ($[148] !== groupState) {
    t44 = id_5 => groupState[id_5]?.rows ?? [];
    $[148] = groupState;
    $[149] = t44;
  } else {
    t44 = $[149];
  }
  const groupRowsFor = t44;
  let t45;
  if ($[150] !== groupState) {
    t45 = id_6 => groupState[id_6]?.total ?? 0;
    $[150] = groupState;
    $[151] = t45;
  } else {
    t45 = $[151];
  }
  const groupTotalFor = t45;
  let t46;
  if ($[152] !== groupState) {
    t46 = id_7 => groupState[id_7]?.loading ?? false;
    $[152] = groupState;
    $[153] = t46;
  } else {
    t46 = $[153];
  }
  const groupLoadingFor = t46;
  let t47;
  if ($[154] !== groupState || $[155] !== pagination) {
    t47 = id_8 => groupState[id_8]?.pagination ?? {
      page: 1,
      pageSize: pagination.pageSize
    };
    $[154] = groupState;
    $[155] = pagination;
    $[156] = t47;
  } else {
    t47 = $[156];
  }
  const groupPaginationFor = t47;
  const pathOf = _temp11;
  let groupAllSelected;
  let groupSomeSelected;
  let rowPath;
  let selection;
  let t48;
  if ($[157] !== groupBy || $[158] !== groupState || $[159] !== grouped || $[160] !== groups || $[161] !== picked.all || $[162] !== picked.groups || $[163] !== picked.rows || $[164] !== rowGroups || $[165] !== total) {
    selection = {
      all: picked.all,
      groups: Object.entries(picked.groups).map(t49 => {
        const [id_10, selected] = t49;
        return {
          path: pathOf(id_10),
          selected
        };
      }),
      rows: Object.entries(picked.rows).map(_temp12)
    };
    let t50;
    if ($[171] !== rowGroups) {
      t50 = id_12 => {
        const group_0 = rowGroups.get(id_12);
        return group_0 === undefined ? [] : pathOf(group_0);
      };
      $[171] = rowGroups;
      $[172] = t50;
    } else {
      t50 = $[172];
    }
    rowPath = t50;
    let t51;
    if ($[173] !== picked.groups || $[174] !== picked.rows) {
      t51 = (id_13, selected_0) => Object.entries(picked.groups).some(t52 => {
        const [key_1, value_0] = t52;
        return key_1 !== id_13 && contains(id_13, key_1) && value_0 === selected_0;
      }) || Object.values(picked.rows).some(row_2 => row_2.group !== null && contains(id_13, row_2.group) && row_2.selected === selected_0);
      $[173] = picked.groups;
      $[174] = picked.rows;
      $[175] = t51;
    } else {
      t51 = $[175];
    }
    const decidedBeneath = t51;
    groupAllSelected = id_14 => isPathSelected(selection, pathOf(id_14)) && !decidedBeneath(id_14, false);
    groupSomeSelected = id_15 => isPathSelected(selection, pathOf(id_15)) || decidedBeneath(id_15, true);
    let t52;
    if ($[176] !== picked.rows) {
      t52 = Object.values(picked.rows);
      $[176] = picked.rows;
      $[177] = t52;
    } else {
      t52 = $[177];
    }
    let t53;
    if ($[178] !== picked.all || $[179] !== t52) {
      t53 = t52.filter(row_3 => row_3.selected !== picked.all);
      $[178] = picked.all;
      $[179] = t52;
      $[180] = t53;
    } else {
      t53 = $[180];
    }
    const exceptions = t53.length;
    const countIn = (list_2, parent_0, records) => {
      const unloaded = records - list_2.reduce(_temp13, 0);
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
    t48 = grouped ? countIn(groups, [], total) : picked.all ? total - exceptions : exceptions;
    $[157] = groupBy;
    $[158] = groupState;
    $[159] = grouped;
    $[160] = groups;
    $[161] = picked.all;
    $[162] = picked.groups;
    $[163] = picked.rows;
    $[164] = rowGroups;
    $[165] = total;
    $[166] = groupAllSelected;
    $[167] = groupSomeSelected;
    $[168] = rowPath;
    $[169] = selection;
    $[170] = t48;
  } else {
    groupAllSelected = $[166];
    groupSomeSelected = $[167];
    rowPath = $[168];
    selection = $[169];
    t48 = $[170];
  }
  const selectedCount = t48;
  let t49;
  if ($[181] !== picked.all || $[182] !== picked.groups || $[183] !== picked.rows) {
    t49 = picked.all && !Object.values(picked.groups).includes(false) && !Object.values(picked.rows).some(_temp14);
    $[181] = picked.all;
    $[182] = picked.groups;
    $[183] = picked.rows;
    $[184] = t49;
  } else {
    t49 = $[184];
  }
  const allSelected = t49;
  let t50;
  if ($[185] !== picked.all || $[186] !== picked.groups || $[187] !== picked.rows) {
    t50 = picked.all || Object.values(picked.groups).includes(true) || Object.values(picked.rows).some(_temp15);
    $[185] = picked.all;
    $[186] = picked.groups;
    $[187] = picked.rows;
    $[188] = t50;
  } else {
    t50 = $[188];
  }
  const someSelected = t50;
  let t51;
  if ($[189] !== rowPath || $[190] !== selection) {
    t51 = id_17 => isRowSelected(selection, id_17, rowPath(id_17));
    $[189] = rowPath;
    $[190] = selection;
    $[191] = t51;
  } else {
    t51 = $[191];
  }
  const isSelected = t51;
  let t52;
  if ($[192] !== isSelected || $[193] !== rowGroups || $[194] !== rowPath || $[195] !== selection) {
    t52 = id_18 => {
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
    $[192] = isSelected;
    $[193] = rowGroups;
    $[194] = rowPath;
    $[195] = selection;
    $[196] = t52;
  } else {
    t52 = $[196];
  }
  const toggleSelected = t52;
  let t53;
  if ($[197] !== groupAllSelected || $[198] !== selection) {
    t53 = id_19 => {
      const path_1 = pathOf(id_19);
      const next_2 = !groupAllSelected(id_19);
      const inherited_0 = isPathSelected(selection, path_1.slice(0, -1));
      setPicked(prev_5 => {
        const groups_0 = Object.fromEntries(Object.entries(prev_5.groups).filter(t54 => {
          const [key_2] = t54;
          return !contains(id_19, key_2);
        }));
        const rows_1 = Object.fromEntries(Object.entries(prev_5.rows).filter(t55 => {
          const [, row_7] = t55;
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
    $[197] = groupAllSelected;
    $[198] = selection;
    $[199] = t53;
  } else {
    t53 = $[199];
  }
  const toggleSelectGroup = t53;
  let t54;
  if ($[200] === Symbol.for("react.memo_cache_sentinel")) {
    t54 = next_3 => setPicked({
      all: next_3.all,
      groups: Object.fromEntries(next_3.groups.map(_temp16)),
      rows: Object.fromEntries(next_3.rows.map(_temp17))
    });
    $[200] = t54;
  } else {
    t54 = $[200];
  }
  const setSelection = t54;
  let t55;
  if ($[201] === Symbol.for("react.memo_cache_sentinel")) {
    t55 = value_1 => {
      setSearch(value_1);
      setPicked(nothingPicked);
      setPagination(_temp18);
    };
    $[201] = t55;
  } else {
    t55 = $[201];
  }
  let t56;
  if ($[202] === Symbol.for("react.memo_cache_sentinel")) {
    t56 = () => setPicked(nothingPicked);
    $[202] = t56;
  } else {
    t56 = $[202];
  }
  let t57;
  if ($[203] !== allSelected) {
    t57 = () => setPicked({
      all: !allSelected,
      groups: {},
      rows: {}
    });
    $[203] = allSelected;
    $[204] = t57;
  } else {
    t57 = $[204];
  }
  let t58;
  if ($[205] !== allSelected || $[206] !== cacheKey || $[207] !== columns || $[208] !== error || $[209] !== fetchChildren || $[210] !== filterLabel || $[211] !== filters || $[212] !== getRowId || $[213] !== groupAllSelected || $[214] !== groupBy || $[215] !== groupByColumns || $[216] !== groupLoadingFor || $[217] !== groupPageSize || $[218] !== groupPaginationFor || $[219] !== groupRowsFor || $[220] !== groupSomeSelected || $[221] !== groupTotalFor || $[222] !== groups || $[223] !== groupsLoading || $[224] !== groupsTotal || $[225] !== hasMore || $[226] !== hiddenColumns || $[227] !== isGroupExpanded || $[228] !== isSelected || $[229] !== listKey || $[230] !== loadMore || $[231] !== loading || $[232] !== loadingMore || $[233] !== pagination || $[234] !== rows || $[235] !== search || $[236] !== selectedCount || $[237] !== selection || $[238] !== someSelected || $[239] !== sort || $[240] !== t57 || $[241] !== toggleGroup || $[242] !== toggleSelectGroup || $[243] !== toggleSelected || $[244] !== total || $[245] !== visibleColumns || $[246] !== visibleItems) {
    t58 = {
      columns,
      getRowId,
      groupByColumns,
      cacheKey,
      visibleColumns,
      hiddenColumns,
      setColumnHidden,
      search,
      setSearch: t55,
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
      visibleItems,
      selection,
      selectedCount,
      isSelected,
      toggleSelected,
      setSelection,
      clearSelection: t56,
      toggleSelectAll: t57,
      allSelected,
      someSelected,
      groupAllSelected,
      groupSomeSelected,
      toggleSelectGroup,
      refetch
    };
    $[205] = allSelected;
    $[206] = cacheKey;
    $[207] = columns;
    $[208] = error;
    $[209] = fetchChildren;
    $[210] = filterLabel;
    $[211] = filters;
    $[212] = getRowId;
    $[213] = groupAllSelected;
    $[214] = groupBy;
    $[215] = groupByColumns;
    $[216] = groupLoadingFor;
    $[217] = groupPageSize;
    $[218] = groupPaginationFor;
    $[219] = groupRowsFor;
    $[220] = groupSomeSelected;
    $[221] = groupTotalFor;
    $[222] = groups;
    $[223] = groupsLoading;
    $[224] = groupsTotal;
    $[225] = hasMore;
    $[226] = hiddenColumns;
    $[227] = isGroupExpanded;
    $[228] = isSelected;
    $[229] = listKey;
    $[230] = loadMore;
    $[231] = loading;
    $[232] = loadingMore;
    $[233] = pagination;
    $[234] = rows;
    $[235] = search;
    $[236] = selectedCount;
    $[237] = selection;
    $[238] = someSelected;
    $[239] = sort;
    $[240] = t57;
    $[241] = toggleGroup;
    $[242] = toggleSelectGroup;
    $[243] = toggleSelected;
    $[244] = total;
    $[245] = visibleColumns;
    $[246] = visibleItems;
    $[247] = t58;
  } else {
    t58 = $[247];
  }
  return t58;
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
  const [id_11, row_1] = t0;
  return {
    id: id_11,
    selected: row_1.selected
  };
}
function _temp11(id_9) {
  return JSON.parse(id_9).map(_temp10);
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