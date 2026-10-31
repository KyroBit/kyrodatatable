import { c as _c } from "react/compiler-runtime";
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { createClientEngine } from './clientEngine.js';
const DEFAULT_PAGE_SIZE = 25;
export function useDataTable(config) {
  const $ = _c(196);
  const {
    columns,
    getRowId,
    groupByColumns,
    initialPageSize,
    initialSort,
    initialFilters,
    searchDebounceMs
  } = config;
  let t0;
  if ($[0] !== config.initialHiddenColumns) {
    t0 = config.initialHiddenColumns ?? [];
    $[0] = config.initialHiddenColumns;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const [hiddenColumns, setHiddenColumns] = useState(t0);
  let t1;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = (field, hidden) => {
      setHiddenColumns(current => hidden ? current.includes(field) ? current : [...current, field] : current.filter(f => f !== field));
    };
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  const setColumnHidden = t1;
  let t2;
  if ($[3] !== columns || $[4] !== hiddenColumns) {
    let t3;
    if ($[6] !== hiddenColumns) {
      t3 = column => !hiddenColumns.includes(column.field);
      $[6] = hiddenColumns;
      $[7] = t3;
    } else {
      t3 = $[7];
    }
    t2 = columns.filter(t3);
    $[3] = columns;
    $[4] = hiddenColumns;
    $[5] = t2;
  } else {
    t2 = $[5];
  }
  const visibleColumns = t2;
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFiltersInternal] = useState(initialFilters);
  const [sort, setSortInternal] = useState(initialSort ?? null);
  const t3 = initialPageSize ?? DEFAULT_PAGE_SIZE;
  let t4;
  if ($[8] !== t3) {
    t4 = {
      page: 1,
      pageSize: t3
    };
    $[8] = t3;
    $[9] = t4;
  } else {
    t4 = $[9];
  }
  const [pagination, setPagination] = useState(t4);
  let t5;
  if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
    t5 = [];
    $[10] = t5;
  } else {
    t5 = $[10];
  }
  const [rows, setRows] = useState(t5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchTick, setFetchTick] = useState(0);
  const [loadedPage, setLoadedPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const generation = useRef(0);
  const [groupBy, setGroupByField] = useState(null);
  let t6;
  if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = [];
    $[11] = t6;
  } else {
    t6 = $[11];
  }
  const [groups, setGroups] = useState(t6);
  const [groupsTotal, setGroupsTotal] = useState(0);
  const [groupsLoading, setGroupsLoading] = useState(false);
  let t7;
  if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = {};
    $[12] = t7;
  } else {
    t7 = $[12];
  }
  const [expanded, setExpanded] = useState(t7);
  let t8;
  if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = {};
    $[13] = t8;
  } else {
    t8 = $[13];
  }
  const [groupState, setGroupState] = useState(t8);
  let t9;
  if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
    t9 = {};
    $[14] = t9;
  } else {
    t9 = $[14];
  }
  const [selection, setSelectionState] = useState(t9);
  let t10;
  let t11;
  if ($[15] !== search || $[16] !== searchDebounceMs) {
    t10 = () => {
      if (!searchDebounceMs) {
        setDebouncedSearch(search);
        return;
      }
      const id = setTimeout(() => setDebouncedSearch(search), searchDebounceMs);
      return () => clearTimeout(id);
    };
    t11 = [search, searchDebounceMs];
    $[15] = search;
    $[16] = searchDebounceMs;
    $[17] = t10;
    $[18] = t11;
  } else {
    t10 = $[17];
    t11 = $[18];
  }
  useEffect(t10, t11);
  let t12;
  if ($[19] !== columns || $[20] !== config.applyFilters || $[21] !== config.data || $[22] !== groupBy) {
    t12 = config.data ? createClientEngine({
      data: config.data,
      columns,
      applyFilters: config.applyFilters,
      groupField: groupBy ? row => row[groupBy] : undefined
    }) : null;
    $[19] = columns;
    $[20] = config.applyFilters;
    $[21] = config.data;
    $[22] = groupBy;
    $[23] = t12;
  } else {
    t12 = $[23];
  }
  const clientEngine = t12;
  const fetchRecords = config.fetchRecords ?? clientEngine?.fetchRecords;
  const fetchGroups = config.fetchGroups ?? clientEngine?.fetchGroups;
  let t13;
  if ($[24] !== fetchRecords) {
    t13 = params => fetchRecords?.(params);
    $[24] = fetchRecords;
    $[25] = t13;
  } else {
    t13 = $[25];
  }
  const fetchPage = useEffectEvent(t13);
  let t14;
  if ($[26] !== fetchGroups) {
    t14 = params_0 => fetchGroups?.(params_0);
    $[26] = fetchGroups;
    $[27] = t14;
  } else {
    t14 = $[27];
  }
  const fetchGroupPage = useEffectEvent(t14);
  let t15;
  if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
    t15 = next => {
      setFiltersInternal(next);
      setPagination(_temp);
    };
    $[28] = t15;
  } else {
    t15 = $[28];
  }
  const setFilters = t15;
  let t16;
  if ($[29] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = field_0 => {
      setGroupByField(field_0);
      setExpanded({});
      setGroupState({});
      setPagination(_temp2);
    };
    $[29] = t16;
  } else {
    t16 = $[29];
  }
  const setGroupBy = t16;
  let t17;
  if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
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
    $[30] = t17;
  } else {
    t17 = $[30];
  }
  const toggleSort = t17;
  let t18;
  if ($[31] === Symbol.for("react.memo_cache_sentinel")) {
    t18 = next_0 => {
      setSortInternal(next_0);
      setPagination(_temp4);
    };
    $[31] = t18;
  } else {
    t18 = $[31];
  }
  const setSort = t18;
  let t19;
  if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
    t19 = page => {
      setPagination(p_3 => ({
        ...p_3,
        page
      }));
    };
    $[32] = t19;
  } else {
    t19 = $[32];
  }
  const setPage = t19;
  let t20;
  if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
    t20 = pageSize => {
      setPagination({
        page: 1,
        pageSize
      });
    };
    $[33] = t20;
  } else {
    t20 = $[33];
  }
  const setPageSize = t20;
  let t21;
  if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
    t21 = () => setFetchTick(_temp5);
    $[34] = t21;
  } else {
    t21 = $[34];
  }
  const refetch = t21;
  let t22;
  if ($[35] !== config.deps) {
    t22 = JSON.stringify(config.deps ?? []);
    $[35] = config.deps;
    $[36] = t22;
  } else {
    t22 = $[36];
  }
  const depsKey = t22;
  const knownDeps = useRef(depsKey);
  let t23;
  let t24;
  if ($[37] !== depsKey) {
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
    $[37] = depsKey;
    $[38] = t23;
    $[39] = t24;
  } else {
    t23 = $[38];
    t24 = $[39];
  }
  useEffect(t23, t24);
  let t25;
  if ($[40] !== debouncedSearch || $[41] !== fetchPage || $[42] !== filters || $[43] !== groupBy || $[44] !== pagination.page || $[45] !== pagination.pageSize || $[46] !== sort) {
    t25 = () => {
      if (groupBy) {
        return;
      }
      let cancelled = false;
      setLoading(true);
      setError(null);
      const params_1 = {
        page: pagination.page,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sort,
        filters: filters
      };
      const pending = fetchPage(params_1);
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
        setLoadedPage(params_1.page);
      }).catch(err => {
        if (!cancelled) {
          setError(err);
        }
      }).finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
      return () => {
        cancelled = true;
      };
    };
    $[40] = debouncedSearch;
    $[41] = fetchPage;
    $[42] = filters;
    $[43] = groupBy;
    $[44] = pagination.page;
    $[45] = pagination.pageSize;
    $[46] = sort;
    $[47] = t25;
  } else {
    t25 = $[47];
  }
  let t26;
  if ($[48] !== config.data || $[49] !== debouncedSearch || $[50] !== fetchTick || $[51] !== filters || $[52] !== groupBy || $[53] !== pagination.page || $[54] !== pagination.pageSize || $[55] !== sort) {
    t26 = [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, config.data, fetchTick];
    $[48] = config.data;
    $[49] = debouncedSearch;
    $[50] = fetchTick;
    $[51] = filters;
    $[52] = groupBy;
    $[53] = pagination.page;
    $[54] = pagination.pageSize;
    $[55] = sort;
    $[56] = t26;
  } else {
    t26 = $[56];
  }
  useEffect(t25, t26);
  let t27;
  if ($[57] !== debouncedSearch || $[58] !== fetchGroupPage || $[59] !== filters || $[60] !== groupBy || $[61] !== pagination.page || $[62] !== pagination.pageSize || $[63] !== sort) {
    t27 = () => {
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
    $[57] = debouncedSearch;
    $[58] = fetchGroupPage;
    $[59] = filters;
    $[60] = groupBy;
    $[61] = pagination.page;
    $[62] = pagination.pageSize;
    $[63] = sort;
    $[64] = t27;
  } else {
    t27 = $[64];
  }
  let t28;
  if ($[65] !== config.data || $[66] !== debouncedSearch || $[67] !== fetchTick || $[68] !== filters || $[69] !== groupBy || $[70] !== pagination.page || $[71] !== pagination.pageSize || $[72] !== sort) {
    t28 = [groupBy, pagination.page, pagination.pageSize, debouncedSearch, sort, filters, config.data, fetchTick];
    $[65] = config.data;
    $[66] = debouncedSearch;
    $[67] = fetchTick;
    $[68] = filters;
    $[69] = groupBy;
    $[70] = pagination.page;
    $[71] = pagination.pageSize;
    $[72] = sort;
    $[73] = t28;
  } else {
    t28 = $[73];
  }
  useEffect(t27, t28);
  const hasMore = !groupBy && (pagination.page - 1) * pagination.pageSize + rows.length < total;
  let t29;
  if ($[74] !== debouncedSearch || $[75] !== fetchRecords || $[76] !== filters || $[77] !== hasMore || $[78] !== loadedPage || $[79] !== loading || $[80] !== loadingMore || $[81] !== pagination.pageSize || $[82] !== sort) {
    t29 = () => {
      if (!fetchRecords || !hasMore || loading || loadingMore) {
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
    $[74] = debouncedSearch;
    $[75] = fetchRecords;
    $[76] = filters;
    $[77] = hasMore;
    $[78] = loadedPage;
    $[79] = loading;
    $[80] = loadingMore;
    $[81] = pagination.pageSize;
    $[82] = sort;
    $[83] = t29;
  } else {
    t29 = $[83];
  }
  const loadMore = t29;
  let t30;
  if ($[84] !== debouncedSearch || $[85] !== fetchRecords || $[86] !== filters || $[87] !== groupBy || $[88] !== pagination.pageSize || $[89] !== sort) {
    t30 = (key, page_1) => {
      if (!groupBy || !fetchRecords) {
        return;
      }
      setGroupState(prev_1 => ({
        ...prev_1,
        [key]: {
          rows: prev_1[key]?.rows ?? [],
          total: prev_1[key]?.total ?? 0,
          pagination: {
            page: page_1,
            pageSize: pagination.pageSize
          },
          loading: true
        }
      }));
      const params_3 = {
        page: page_1,
        pageSize: pagination.pageSize,
        search: debouncedSearch,
        sort,
        filters: filters,
        groupBy,
        groupKey: key
      };
      fetchRecords(params_3).then(result_2 => {
        setGroupState(prev_2 => ({
          ...prev_2,
          [key]: {
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
          [key]: {
            rows: prev_3[key]?.rows ?? [],
            total: prev_3[key]?.total ?? 0,
            pagination: {
              page: page_1,
              pageSize: pagination.pageSize
            },
            loading: false
          }
        }));
      });
    };
    $[84] = debouncedSearch;
    $[85] = fetchRecords;
    $[86] = filters;
    $[87] = groupBy;
    $[88] = pagination.pageSize;
    $[89] = sort;
    $[90] = t30;
  } else {
    t30 = $[90];
  }
  const fetchGroupRows = t30;
  let t31;
  if ($[91] !== expanded || $[92] !== fetchGroupRows || $[93] !== getRowId || $[94] !== groupState) {
    t31 = key_0 => {
      setExpanded(prev_4 => {
        const next_1 = {
          ...prev_4,
          [key_0]: !prev_4[key_0]
        };
        if (next_1[key_0] && !groupState[key_0]) {
          fetchGroupRows(key_0, 1);
        }
        return next_1;
      });
      if (expanded[key_0]) {
        const rows_0 = groupState[key_0]?.rows ?? [];
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
    $[91] = expanded;
    $[92] = fetchGroupRows;
    $[93] = getRowId;
    $[94] = groupState;
    $[95] = t31;
  } else {
    t31 = $[95];
  }
  const toggleGroup = t31;
  let t32;
  if ($[96] !== fetchGroupRows) {
    t32 = (key_1, page_2) => {
      fetchGroupRows(key_1, page_2);
    };
    $[96] = fetchGroupRows;
    $[97] = t32;
  } else {
    t32 = $[97];
  }
  const setGroupPage = t32;
  let t33;
  if ($[98] !== expanded) {
    t33 = key_2 => Boolean(expanded[key_2]);
    $[98] = expanded;
    $[99] = t33;
  } else {
    t33 = $[99];
  }
  const isGroupExpanded = t33;
  let t34;
  if ($[100] !== groupState) {
    t34 = key_3 => groupState[key_3]?.rows ?? [];
    $[100] = groupState;
    $[101] = t34;
  } else {
    t34 = $[101];
  }
  const groupRowsFor = t34;
  let t35;
  if ($[102] !== groupState) {
    t35 = key_4 => groupState[key_4]?.total ?? 0;
    $[102] = groupState;
    $[103] = t35;
  } else {
    t35 = $[103];
  }
  const groupTotalFor = t35;
  let t36;
  if ($[104] !== groupState) {
    t36 = key_5 => groupState[key_5]?.loading ?? false;
    $[104] = groupState;
    $[105] = t36;
  } else {
    t36 = $[105];
  }
  const groupLoadingFor = t36;
  let t37;
  if ($[106] !== groupState || $[107] !== pagination.pageSize) {
    t37 = key_6 => groupState[key_6]?.pagination ?? {
      page: 1,
      pageSize: pagination.pageSize
    };
    $[106] = groupState;
    $[107] = pagination.pageSize;
    $[108] = t37;
  } else {
    t37 = $[108];
  }
  const groupPaginationFor = t37;
  let t38;
  if ($[109] !== expanded || $[110] !== groupBy || $[111] !== groupState || $[112] !== groups || $[113] !== rows) {
    t38 = groupBy ? groups.flatMap(g => expanded[g.key] ? groupState[g.key]?.rows ?? [] : []) : rows;
    $[109] = expanded;
    $[110] = groupBy;
    $[111] = groupState;
    $[112] = groups;
    $[113] = rows;
    $[114] = t38;
  } else {
    t38 = $[114];
  }
  const selectableRows = t38;
  let t39;
  if ($[115] !== selection) {
    t39 = Object.keys(selection);
    $[115] = selection;
    $[116] = t39;
  } else {
    t39 = $[116];
  }
  let t40;
  if ($[117] !== selection || $[118] !== t39) {
    t40 = t39.filter(id_0 => selection[id_0]);
    $[117] = selection;
    $[118] = t39;
    $[119] = t40;
  } else {
    t40 = $[119];
  }
  const selectedIds = t40;
  let t41;
  if ($[120] !== getRowId || $[121] !== selectableRows || $[122] !== selection) {
    t41 = selectableRows.length > 0 && selectableRows.every(r => selection[getRowId(r)]);
    $[120] = getRowId;
    $[121] = selectableRows;
    $[122] = selection;
    $[123] = t41;
  } else {
    t41 = $[123];
  }
  const allVisibleSelected = t41;
  let t42;
  if ($[124] !== getRowId || $[125] !== selectableRows || $[126] !== selection) {
    let t43;
    if ($[128] !== getRowId || $[129] !== selection) {
      t43 = r_0 => selection[getRowId(r_0)];
      $[128] = getRowId;
      $[129] = selection;
      $[130] = t43;
    } else {
      t43 = $[130];
    }
    t42 = selectableRows.some(t43);
    $[124] = getRowId;
    $[125] = selectableRows;
    $[126] = selection;
    $[127] = t42;
  } else {
    t42 = $[127];
  }
  const someVisibleSelected = t42;
  let t43;
  if ($[131] !== selection) {
    t43 = id_1 => Boolean(selection[id_1]);
    $[131] = selection;
    $[132] = t43;
  } else {
    t43 = $[132];
  }
  const isSelected = t43;
  let t44;
  if ($[133] === Symbol.for("react.memo_cache_sentinel")) {
    t44 = id_2 => {
      setSelectionState(prev_5 => ({
        ...prev_5,
        [id_2]: !prev_5[id_2]
      }));
    };
    $[133] = t44;
  } else {
    t44 = $[133];
  }
  const toggleSelected = t44;
  let t45;
  if ($[134] === Symbol.for("react.memo_cache_sentinel")) {
    t45 = () => setSelectionState({});
    $[134] = t45;
  } else {
    t45 = $[134];
  }
  const clearSelection = t45;
  let t46;
  if ($[135] !== allVisibleSelected || $[136] !== getRowId || $[137] !== selectableRows) {
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
    $[135] = allVisibleSelected;
    $[136] = getRowId;
    $[137] = selectableRows;
    $[138] = t46;
  } else {
    t46 = $[138];
  }
  const toggleSelectAll = t46;
  let t47;
  if ($[139] !== getRowId || $[140] !== groupState || $[141] !== selection) {
    t47 = key_7 => {
      const rows_1 = groupState[key_7]?.rows ?? [];
      return rows_1.length > 0 && rows_1.every(r_1 => selection[getRowId(r_1)]);
    };
    $[139] = getRowId;
    $[140] = groupState;
    $[141] = selection;
    $[142] = t47;
  } else {
    t47 = $[142];
  }
  const groupAllSelected = t47;
  let t48;
  if ($[143] !== getRowId || $[144] !== groupState || $[145] !== selection) {
    t48 = key_8 => {
      const rows_2 = groupState[key_8]?.rows ?? [];
      return rows_2.some(r_2 => selection[getRowId(r_2)]);
    };
    $[143] = getRowId;
    $[144] = groupState;
    $[145] = selection;
    $[146] = t48;
  } else {
    t48 = $[146];
  }
  const groupSomeSelected = t48;
  let t49;
  if ($[147] !== getRowId || $[148] !== groupState || $[149] !== selection) {
    t49 = key_9 => {
      const rows_3 = groupState[key_9]?.rows ?? [];
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
    $[147] = getRowId;
    $[148] = groupState;
    $[149] = selection;
    $[150] = t49;
  } else {
    t49 = $[150];
  }
  const toggleSelectGroup = t49;
  let visibleItems;
  if ($[151] !== expanded || $[152] !== groupBy || $[153] !== groupState || $[154] !== groups || $[155] !== rows) {
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
    $[151] = expanded;
    $[152] = groupBy;
    $[153] = groupState;
    $[154] = groups;
    $[155] = rows;
    $[156] = visibleItems;
  } else {
    visibleItems = $[156];
  }
  let t50;
  if ($[157] === Symbol.for("react.memo_cache_sentinel")) {
    t50 = value => {
      setSearch(value);
      setPagination(_temp8);
    };
    $[157] = t50;
  } else {
    t50 = $[157];
  }
  let t51;
  if ($[158] !== allVisibleSelected || $[159] !== columns || $[160] !== error || $[161] !== filters || $[162] !== getRowId || $[163] !== groupAllSelected || $[164] !== groupBy || $[165] !== groupByColumns || $[166] !== groupLoadingFor || $[167] !== groupPaginationFor || $[168] !== groupRowsFor || $[169] !== groupSomeSelected || $[170] !== groupTotalFor || $[171] !== groups || $[172] !== groupsLoading || $[173] !== groupsTotal || $[174] !== hasMore || $[175] !== hiddenColumns || $[176] !== isGroupExpanded || $[177] !== isSelected || $[178] !== loadMore || $[179] !== loading || $[180] !== loadingMore || $[181] !== pagination || $[182] !== rows || $[183] !== search || $[184] !== selectedIds || $[185] !== selection || $[186] !== setGroupPage || $[187] !== someVisibleSelected || $[188] !== sort || $[189] !== toggleGroup || $[190] !== toggleSelectAll || $[191] !== toggleSelectGroup || $[192] !== total || $[193] !== visibleColumns || $[194] !== visibleItems) {
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
    $[158] = allVisibleSelected;
    $[159] = columns;
    $[160] = error;
    $[161] = filters;
    $[162] = getRowId;
    $[163] = groupAllSelected;
    $[164] = groupBy;
    $[165] = groupByColumns;
    $[166] = groupLoadingFor;
    $[167] = groupPaginationFor;
    $[168] = groupRowsFor;
    $[169] = groupSomeSelected;
    $[170] = groupTotalFor;
    $[171] = groups;
    $[172] = groupsLoading;
    $[173] = groupsTotal;
    $[174] = hasMore;
    $[175] = hiddenColumns;
    $[176] = isGroupExpanded;
    $[177] = isSelected;
    $[178] = loadMore;
    $[179] = loading;
    $[180] = loadingMore;
    $[181] = pagination;
    $[182] = rows;
    $[183] = search;
    $[184] = selectedIds;
    $[185] = selection;
    $[186] = setGroupPage;
    $[187] = someVisibleSelected;
    $[188] = sort;
    $[189] = toggleGroup;
    $[190] = toggleSelectAll;
    $[191] = toggleSelectGroup;
    $[192] = total;
    $[193] = visibleColumns;
    $[194] = visibleItems;
    $[195] = t51;
  } else {
    t51 = $[195];
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