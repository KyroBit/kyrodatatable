import { c as _c } from "react/compiler-runtime";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual';
import { Box, Button, Card, Checkbox, IconButton, List, ListItemButton, ListItemText, Skeleton, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@kyrobit/kyroui';
import { useDataTableContext, useDrillTrail, useSelectMode } from './context.js';
import { ChevronLeftIcon, ChevronRightIcon, ExpandMoreIcon } from './icons.js';
import { countFilterValues } from '@kyrobit/datatable';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Stacked up/down triangles — the "double arrow" sort indicator modern apps
 * use. Both grey when the column is unsorted; the active direction darkens.
 */
function SortChevron(t0) {
  const $ = _c(7);
  const {
    points,
    active
  } = t0;
  let t1;
  if ($[0] !== active) {
    t1 = theme => ({
      display: "block",
      fill: "none",
      color: active ? "text.primary" : "text.disabled",
      transition: theme.transitions.create("color", {
        duration: theme.transitions.duration.shortest
      })
    });
    $[0] = active;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  let t2;
  if ($[2] !== points) {
    t2 = /*#__PURE__*/_jsx("path", {
      d: points,
      stroke: "currentColor",
      strokeWidth: 2.5,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    });
    $[2] = points;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  let t3;
  if ($[4] !== t1 || $[5] !== t2) {
    t3 = /*#__PURE__*/_jsx(SvgIcon, {
      width: 11,
      height: 7,
      viewBox: "0 0 24 14",
      sx: t1,
      children: t2
    });
    $[4] = t1;
    $[5] = t2;
    $[6] = t3;
  } else {
    t3 = $[6];
  }
  return t3;
}
function SortArrows(t0) {
  const $ = _c(8);
  const {
    direction
  } = t0;
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = {
      display: "inline-flex",
      flexDirection: "column",
      ml: "xs",
      flex: "none"
    };
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  const t2 = direction === "asc";
  let t3;
  if ($[1] !== t2) {
    t3 = /*#__PURE__*/_jsx(SortChevron, {
      points: "M5 9.5 L12 3.5 L19 9.5",
      active: t2
    });
    $[1] = t2;
    $[2] = t3;
  } else {
    t3 = $[2];
  }
  const t4 = direction === "desc";
  let t5;
  if ($[3] !== t4) {
    t5 = /*#__PURE__*/_jsx(SortChevron, {
      points: "M5 4.5 L12 10.5 L19 4.5",
      active: t4
    });
    $[3] = t4;
    $[4] = t5;
  } else {
    t5 = $[4];
  }
  let t6;
  if ($[5] !== t3 || $[6] !== t5) {
    t6 = /*#__PURE__*/_jsxs(Box, {
      component: "span",
      className: "KyroTable-sortArrows",
      sx: t1,
      children: [t3, t5]
    });
    $[5] = t3;
    $[6] = t5;
    $[7] = t6;
  } else {
    t6 = $[7];
  }
  return t6;
}

/**
 * Compact inline pager shown at the right edge of an expanded group's header
 * row — each group paginates independently (`api.setGroupPage`).
 */
function GroupPager(t0) {
  const $ = _c(29);
  const {
    groupId,
    api
  } = t0;
  let t1;
  if ($[0] !== api || $[1] !== groupId) {
    t1 = api.groupPagination(groupId);
    $[0] = api;
    $[1] = groupId;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  const pagination = t1;
  const total = api.groupTotal(groupId);
  if (total <= 0) {
    return null;
  }
  const from = (pagination.page - 1) * pagination.pageSize + 1;
  const to = Math.min(pagination.page * pagination.pageSize, total);
  let t2;
  if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = {
      display: "flex",
      alignItems: "center",
      gap: "xs",
      flex: "none"
    };
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  let t3;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = {
      fontSize: "sm",
      color: "text.secondary",
      fontVariantNumeric: "tabular-nums",
      mr: "xs"
    };
    $[4] = t3;
  } else {
    t3 = $[4];
  }
  let t4;
  if ($[5] !== from || $[6] !== to || $[7] !== total) {
    t4 = /*#__PURE__*/_jsxs(Typography, {
      component: "span",
      sx: t3,
      children: [from, "\u2013", to, " of ", total]
    });
    $[5] = from;
    $[6] = to;
    $[7] = total;
    $[8] = t4;
  } else {
    t4 = $[8];
  }
  const t5 = pagination.page <= 1;
  let t6;
  if ($[9] !== api || $[10] !== groupId || $[11] !== pagination.page) {
    t6 = () => api.setGroupPage(groupId, pagination.page - 1);
    $[9] = api;
    $[10] = groupId;
    $[11] = pagination.page;
    $[12] = t6;
  } else {
    t6 = $[12];
  }
  let t7;
  if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = /*#__PURE__*/_jsx(ChevronLeftIcon, {
      fontSize: "small"
    });
    $[13] = t7;
  } else {
    t7 = $[13];
  }
  let t8;
  if ($[14] !== t5 || $[15] !== t6) {
    t8 = /*#__PURE__*/_jsx(IconButton, {
      size: "small",
      disabled: t5,
      onClick: t6,
      "aria-label": "Previous page",
      children: t7
    });
    $[14] = t5;
    $[15] = t6;
    $[16] = t8;
  } else {
    t8 = $[16];
  }
  const t9 = to >= total;
  let t10;
  if ($[17] !== api || $[18] !== groupId || $[19] !== pagination.page) {
    t10 = () => api.setGroupPage(groupId, pagination.page + 1);
    $[17] = api;
    $[18] = groupId;
    $[19] = pagination.page;
    $[20] = t10;
  } else {
    t10 = $[20];
  }
  let t11;
  if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
    t11 = /*#__PURE__*/_jsx(ChevronRightIcon, {
      fontSize: "small"
    });
    $[21] = t11;
  } else {
    t11 = $[21];
  }
  let t12;
  if ($[22] !== t10 || $[23] !== t9) {
    t12 = /*#__PURE__*/_jsx(IconButton, {
      size: "small",
      disabled: t9,
      onClick: t10,
      "aria-label": "Next page",
      children: t11
    });
    $[22] = t10;
    $[23] = t9;
    $[24] = t12;
  } else {
    t12 = $[24];
  }
  let t13;
  if ($[25] !== t12 || $[26] !== t4 || $[27] !== t8) {
    t13 = /*#__PURE__*/_jsxs(Box, {
      className: "KyroTable-groupPager",
      onClick: _temp,
      sx: t2,
      children: [t4, t8, t12]
    });
    $[25] = t12;
    $[26] = t4;
    $[27] = t8;
    $[28] = t13;
  } else {
    t13 = $[28];
  }
  return t13;
}
function _temp(e) {
  return e.stopPropagation();
}
const SKELETON_ROWS = 10;
const LOADING_MORE_ROWS = 3;
const ESTIMATED_ROW_HEIGHT = 41;
const OVERSCAN = 10;
const ROW_INTENT_DELAY = 80;
const SKELETON_DELAY = 150;
const HOLD_DELAY = 500;
const HOLD_SLOP = 10;
const views = new Map();
const scrollParentOf = node => {
  for (let el = node.parentElement; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
    if (/auto|scroll|overlay/.test(getComputedStyle(el).overflowY)) return el;
  }
  return window;
};
const offsetOf = scroller => scroller instanceof Window ? scroller.scrollY : scroller.scrollTop;
const rectOf = scroller => scroller instanceof Window ? {
  width: scroller.innerWidth,
  height: scroller.innerHeight
} : {
  width: scroller.clientWidth,
  height: scroller.clientHeight
};
const marginOf = (node, scroller) => node.getBoundingClientRect().top + offsetOf(scroller) - (scroller instanceof Window ? 0 : scroller.getBoundingClientRect().top + scroller.clientTop);
/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export function DataTableBody(t0) {
  const $ = _c(99);
  const {
    onRowClick,
    onRowIntent,
    emptyMessage: t1,
    noResultsMessage: t2,
    errorMessage,
    selectable: t3,
    stickyHeader: t4,
    rowClass,
    infiniteScroll: t5,
    pageScroll: t6,
    restoreScroll: t7,
    stickyTop,
    renderListItem,
    listVariant: t8,
    variant: t9
  } = t0;
  const emptyMessage = t1 === undefined ? "No records found." : t1;
  const noResultsMessage = t2 === undefined ? "No records match your search." : t2;
  const selectable = t3 === undefined ? false : t3;
  const stickyHeader = t4 === undefined ? true : t4;
  const infiniteScroll = t5 === undefined ? false : t5;
  const pageScroll = t6 === undefined ? false : t6;
  const restoreScroll = t7 === undefined ? true : t7;
  const listVariant = t8 === undefined ? "plain" : t8;
  const variant = t9 === undefined ? "auto" : t9;
  const api = useDataTableContext();
  const fetching = api.loading || api.groupsLoading;
  let t10;
  if ($[0] !== api.visibleColumns) {
    t10 = api.visibleColumns.some(_temp2);
    $[0] = api.visibleColumns;
    $[1] = t10;
  } else {
    t10 = $[1];
  }
  const hasExplicitWidths = t10;
  const containerRef = useRef(null);
  const [scroller, setScroller] = useState(null);
  const [rowHeight, setRowHeight] = useState(0);
  let t11;
  if ($[2] !== api.visibleColumns) {
    t11 = api.visibleColumns.map(_temp3).join("|");
    $[2] = api.visibleColumns;
    $[3] = t11;
  } else {
    t11 = $[3];
  }
  const columnsKey = t11;
  const [locked, setLocked] = useState(null);
  const lockedWidths = locked?.key === columnsKey ? locked.widths : null;
  const intentTimer = useRef(undefined);
  const snapshot = useRef(_temp4);
  const narrowBelow = useTheme().breakpoints.values.sm;
  const [narrow, setNarrow] = useState(false);
  const watchWidth = variant === "auto";
  const list = renderListItem !== undefined && (variant === "list" || narrow);
  const sideways = narrow && !list;
  const cards = list && listVariant === "cards";
  const drilling = list && api.groupBy.length > 0;
  const groupsKey = api.groupBy.join("|");
  const [trailState, setTrailState] = useDrillTrail();
  const stored = drilling && trailState.key === groupsKey ? trailState.ids : [];
  let t12;
  if ($[4] !== api.visibleItems) {
    t12 = new Set(api.visibleItems.flatMap(_temp5));
    $[4] = api.visibleItems;
    $[5] = t12;
  } else {
    t12 = $[5];
  }
  const shownGroups = t12;
  let t13;
  if ($[6] !== shownGroups) {
    t13 = id => !shownGroups.has(id);
    $[6] = shownGroups;
    $[7] = t13;
  } else {
    t13 = $[7];
  }
  const reachable = stored.findIndex(t13);
  const trail = reachable === -1 ? stored : stored.slice(0, reachable);
  const setTrail = ids => setTrailState({
    key: groupsKey,
    ids
  });
  const drilled = trail.at(-1);
  const viewKey = api.cacheKey === undefined || !restoreScroll ? null : `${api.listKey}${drilled ?? ""}`;
  let t14;
  if ($[8] !== viewKey) {
    t14 = viewKey === null ? undefined : views.get(viewKey);
    $[8] = viewKey;
    $[9] = t14;
  } else {
    t14 = $[9];
  }
  const view = t14;
  let t15;
  if ($[10] !== api) {
    t15 = id_0 => !api.isGroupExpanded(id_0);
    $[10] = api;
    $[11] = t15;
  } else {
    t15 = $[11];
  }
  const closedOnTrail = trail.find(t15);
  useEffect(() => {
    if (closedOnTrail !== undefined) {
      api.toggleGroup(closedOnTrail);
    }
  }, [closedOnTrail]);
  const drilledGroup = api.visibleItems.find(item_0 => item_0.type === "group" && item_0.id === drilled);
  const items = !drilling ? api.visibleItems : api.visibleItems.filter(item_1 => drilled === undefined ? item_1.type === "group" && item_1.depth === 0 : item_1.type === "group" ? item_1.depth === trail.length && item_1.id.startsWith(drilled.slice(0, -1)) : item_1.type === "group-row" && item_1.groupId === drilled);
  const empty = items.length === 0 && !fetching && drilled === undefined;
  const skeletonShape = cards ? "cards" : list ? "list" : "table";
  const more = drilled === undefined ? {
    has: api.hasMore,
    load: api.loadMore,
    loading: api.loadingMore
  } : {
    has: api.groupHasMore(drilled),
    load: () => api.loadMoreInGroup(drilled),
    loading: api.groupLoading(drilled)
  };
  const navigating = drilling && items.length > 0 && items.every(_temp6);
  const drillInto = id_1 => {
    if (!api.isGroupExpanded(id_1)) {
      api.toggleGroup(id_1);
    }
    setTrail([...trail, id_1]);
  };
  const holding = list && selectable;
  const [selectMode, setSelectMode] = useSelectMode();
  const selecting = holding && selectMode;
  const checkboxes = selectable && !list;
  const colSpan = api.visibleColumns.length + (checkboxes ? 1 : 0);
  const holdTimer = useRef(undefined);
  const holdStart = useRef({
    x: 0,
    y: 0
  });
  const held = useRef(false);
  let t16;
  let t17;
  if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = () => () => {
      clearTimeout(intentTimer.current);
      clearTimeout(holdTimer.current);
    };
    t17 = [];
    $[12] = t16;
    $[13] = t17;
  } else {
    t16 = $[12];
    t17 = $[13];
  }
  useEffect(t16, t17);
  let t18;
  if ($[14] !== narrowBelow || $[15] !== watchWidth) {
    t18 = () => {
      const container = containerRef.current;
      if (!container || !watchWidth) {
        return;
      }
      setNarrow(container.clientWidth < narrowBelow);
      const observer = new ResizeObserver(t19 => {
        const [entry] = t19;
        return setNarrow(entry.contentRect.width < narrowBelow);
      });
      observer.observe(container);
      return () => observer.disconnect();
    };
    $[14] = narrowBelow;
    $[15] = watchWidth;
    $[16] = t18;
  } else {
    t18 = $[16];
  }
  let t19;
  if ($[17] !== empty || $[18] !== narrowBelow || $[19] !== watchWidth) {
    t19 = [empty, watchWidth, narrowBelow];
    $[17] = empty;
    $[18] = narrowBelow;
    $[19] = watchWidth;
    $[20] = t19;
  } else {
    t19 = $[20];
  }
  useLayoutEffect(t18, t19);
  let t20;
  if ($[21] !== pageScroll || $[22] !== scroller) {
    t20 = () => {
      const container_0 = containerRef.current;
      if (!container_0) {
        return;
      }
      const next = pageScroll ? scrollParentOf(container_0) : container_0;
      if (next !== scroller) {
        setScroller(next);
      }
    };
    $[21] = pageScroll;
    $[22] = scroller;
    $[23] = t20;
  } else {
    t20 = $[23];
  }
  useLayoutEffect(t20);
  let t21;
  if ($[24] !== pageScroll || $[25] !== view || $[26] !== viewKey) {
    t21 = () => {
      const container_1 = containerRef.current;
      if (!container_1) {
        return;
      }
      const target = pageScroll ? scrollParentOf(container_1) : container_1;
      const edge = target instanceof Window ? 0 : target.getBoundingClientRect().top;
      const pin = container_1.querySelector("thead th")?.getBoundingClientRect().top ?? edge;
      const passed = container_1.getBoundingClientRect().top < Math.max(edge, pin) - 1;
      if (view) {
        target.scrollTo({
          top: view.top,
          behavior: "instant"
        });
      } else {
        if (!pageScroll) {
          container_1.scrollTop = 0;
        } else {
          if (passed) {
            container_1.scrollIntoView({
              block: "start",
              behavior: "instant"
            });
          }
        }
      }
      return () => {
        if (viewKey === null) {
          return;
        }
        views.set(viewKey, {
          top: offsetOf(target),
          rect: rectOf(target),
          ...snapshot.current()
        });
      };
    };
    $[24] = pageScroll;
    $[25] = view;
    $[26] = viewKey;
    $[27] = t21;
  } else {
    t21 = $[27];
  }
  useLayoutEffect(t21, [api.listKey, api.groupBy, drilled]);
  let t22;
  if ($[28] !== checkboxes || $[29] !== columnsKey || $[30] !== hasExplicitWidths || $[31] !== list || $[32] !== lockedWidths || $[33] !== rowHeight) {
    t22 = () => {
      const container_2 = containerRef.current;
      if (!container_2) {
        return;
      }
      const rows = Array.from(container_2.querySelectorAll("tbody tr[data-row]"));
      const tallest = Math.max(0, ...rows.map(_temp7));
      if (tallest > rowHeight) {
        setRowHeight(tallest);
      }
      if (list || hasExplicitWidths || lockedWidths || !rows.length) {
        return;
      }
      const table = container_2.querySelector("table").getBoundingClientRect().width;
      const cells = Array.from(container_2.querySelectorAll("thead th")).slice(checkboxes ? 1 : 0);
      setLocked({
        key: columnsKey,
        widths: cells.map(cell => `${cell.getBoundingClientRect().width / table * 100}%`)
      });
    };
    $[28] = checkboxes;
    $[29] = columnsKey;
    $[30] = hasExplicitWidths;
    $[31] = list;
    $[32] = lockedWidths;
    $[33] = rowHeight;
    $[34] = t22;
  } else {
    t22 = $[34];
  }
  useLayoutEffect(t22);
  const fixedWidths = hasExplicitWidths || lockedWidths !== null;
  if (empty) {
    let t23;
    if ($[35] !== api.filters || $[36] !== api.search) {
      t23 = Boolean(api.search) || countFilterValues(api.filters ?? {}) > 0;
      $[35] = api.filters;
      $[36] = api.search;
      $[37] = t23;
    } else {
      t23 = $[37];
    }
    const filtered = t23;
    let t24;
    if ($[38] !== api || $[39] !== emptyMessage || $[40] !== errorMessage || $[41] !== filtered || $[42] !== noResultsMessage) {
      t24 = api.error ? errorMessage ?? /*#__PURE__*/_jsxs(Box, {
        sx: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "md",
          py: "xl"
        },
        children: [/*#__PURE__*/_jsx(Typography, {
          sx: {
            color: "text.secondary"
          },
          children: "These records could not be loaded."
        }), /*#__PURE__*/_jsx(Button, {
          variant: "outlined",
          onClick: () => api.refetch(),
          children: "Try again"
        })]
      }) : filtered ? noResultsMessage : emptyMessage;
      $[38] = api;
      $[39] = emptyMessage;
      $[40] = errorMessage;
      $[41] = filtered;
      $[42] = noResultsMessage;
      $[43] = t24;
    } else {
      t24 = $[43];
    }
    const message = t24;
    let t25;
    if ($[44] === Symbol.for("react.memo_cache_sentinel")) {
      t25 = {
        flex: 1,
        py: "xl"
      };
      $[44] = t25;
    } else {
      t25 = $[44];
    }
    let t26;
    if ($[45] !== message) {
      t26 = typeof message === "string" ? /*#__PURE__*/_jsx(Typography, {
        sx: {
          color: "text.secondary",
          textAlign: "center",
          py: "xl"
        },
        children: message
      }) : message;
      $[45] = message;
      $[46] = t26;
    } else {
      t26 = $[46];
    }
    let t27;
    if ($[47] !== t26) {
      t27 = /*#__PURE__*/_jsx(Box, {
        className: "KyroTable-empty",
        sx: t25,
        children: t26
      });
      $[47] = t26;
      $[48] = t27;
    } else {
      t27 = $[48];
    }
    return t27;
  }
  const renderItem = (index, measure) => {
    const item_3 = items[index];
    const measured = measure ? {
      "data-index": index,
      ref: measure
    } : {};
    if (item_3.type === "group") {
      return /*#__PURE__*/_jsx(TableRow, {
        "data-row": "",
        ...measured,
        className: "KyroTable-groupRow",
        onClick: () => api.toggleGroup(item_3.id),
        style: {
          cursor: "pointer"
        },
        children: /*#__PURE__*/_jsx(TableCell, {
          className: "KyroTable-groupCell",
          colSpan: colSpan,
          children: /*#__PURE__*/_jsxs(Box, {
            sx: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "sm",
              pl: item_3.depth * 3
            },
            children: [/*#__PURE__*/_jsxs(Box, {
              sx: {
                display: "flex",
                alignItems: "center",
                gap: "sm",
                minWidth: 0
              },
              children: [item_3.expanded ? /*#__PURE__*/_jsx(ExpandMoreIcon, {
                fontSize: "small",
                sx: {
                  color: "text.secondary"
                }
              }) : /*#__PURE__*/_jsx(ChevronRightIcon, {
                fontSize: "small",
                sx: {
                  color: "text.secondary"
                }
              }), selectable && (!list || selecting) && /*#__PURE__*/_jsx(Box, {
                component: "span",
                sx: {
                  display: "inline-flex"
                },
                onClick: _temp8,
                children: /*#__PURE__*/_jsx(Checkbox, {
                  checked: api.groupAllSelected(item_3.id),
                  indeterminate: api.groupSomeSelected(item_3.id) && !api.groupAllSelected(item_3.id),
                  onChange: () => api.toggleSelectGroup(item_3.id),
                  "aria-label": `Select all rows in ${item_3.group.label}`
                })
              }), /*#__PURE__*/_jsx(Box, {
                component: "span",
                sx: {
                  fontWeight: 600,
                  color: "text.primary"
                },
                children: item_3.group.label
              }), /*#__PURE__*/_jsx(Box, {
                component: "span",
                className: "KyroTable-groupCount",
                sx: {
                  fontSize: "sm",
                  fontWeight: 600,
                  lineHeight: 1,
                  px: "sm",
                  py: "xs",
                  borderRadius: "pill",
                  bgcolor: "action.hover",
                  color: "text.secondary"
                },
                children: item_3.group.count
              }), api.groupLoading(item_3.id) && api.groupRows(item_3.id).length === 0 && /*#__PURE__*/_jsx(Box, {
                component: "span",
                sx: {
                  color: "text.secondary",
                  fontSize: "sm"
                },
                children: "loading\u2026"
              })]
            }), item_3.expanded && /*#__PURE__*/_jsx(GroupPager, {
              groupId: item_3.id,
              api: api
            })]
          })
        })
      }, `group-${item_3.id}`);
    }
    const row_0 = item_3.row;
    const rowId = api.getRowId(row_0);
    const classes = [item_3.type === "group-row" ? "KyroTable-groupChildRow" : "", rowClass ? rowClass(row_0) : ""].filter(Boolean).join(" ");
    const hold = holding ? {
      onPointerDown: event => {
        held.current = false;
        holdStart.current = {
          x: event.clientX,
          y: event.clientY
        };
        clearTimeout(holdTimer.current);
        holdTimer.current = setTimeout(() => {
          held.current = true;
          setSelectMode(true);
          api.toggleSelected(rowId);
        }, HOLD_DELAY);
      },
      onPointerMove: event_0 => {
        if (Math.hypot(event_0.clientX - holdStart.current.x, event_0.clientY - holdStart.current.y) > HOLD_SLOP) {
          clearTimeout(holdTimer.current);
        }
      },
      onPointerUp: () => clearTimeout(holdTimer.current),
      onPointerCancel: () => clearTimeout(holdTimer.current),
      onContextMenu: _temp9
    } : {};
    return /*#__PURE__*/_jsxs(TableRow, {
      "data-row": "",
      ...measured,
      ...hold,
      hover: true,
      selected: selectable && api.isSelected(rowId),
      className: classes || undefined,
      style: {
        cursor: onRowClick || selecting ? "pointer" : undefined,
        ...(holding && {
          WebkitTouchCallout: "none",
          userSelect: "none"
        }),
        ...(cards && {
          background: "transparent"
        })
      },
      onClick: () => {
        if (held.current) {
          held.current = false;
        } else {
          if (selecting) {
            api.toggleSelected(rowId);
          } else {
            onRowClick?.(row_0);
          }
        }
      },
      tabIndex: onRowIntent ? 0 : undefined,
      onPointerEnter: onRowIntent && (() => {
        clearTimeout(intentTimer.current);
        intentTimer.current = setTimeout(() => onRowIntent(row_0), ROW_INTENT_DELAY);
      }),
      onPointerLeave: onRowIntent && (() => clearTimeout(intentTimer.current)),
      onFocus: onRowIntent && (event_2 => event_2.target === event_2.currentTarget && onRowIntent(row_0)),
      children: [checkboxes && /*#__PURE__*/_jsx(TableCell, {
        padding: "checkbox",
        onClick: _temp0,
        children: /*#__PURE__*/_jsx(Checkbox, {
          checked: api.isSelected(rowId),
          onChange: () => api.toggleSelected(rowId),
          "aria-label": "Select row"
        })
      }), list ? cards ? /*#__PURE__*/_jsx(TableCell, {
        colSpan: colSpan,
        sx: {
          border: "none",
          px: 0,
          py: "xs"
        },
        children: /*#__PURE__*/_jsx(Card, {
          sx: {
            p: "md",
            ...(api.isSelected(rowId) && {
              bgcolor: "action.selected"
            })
          },
          children: renderListItem(row_0)
        })
      }) : /*#__PURE__*/_jsx(TableCell, {
        colSpan: colSpan,
        children: renderListItem(row_0)
      }) : api.visibleColumns.map(col_1 => /*#__PURE__*/_jsx(TableCell, {
        align: col_1.align,
        children: col_1.render ? col_1.render(row_0) : row_0[col_1.field]
      }, col_1.field))]
    }, rowId);
  };
  const rowsProps = {
    count: items.length,
    body: () => containerRef.current?.querySelector("tbody") ?? null,
    view,
    snapshot,
    rowHeight: rowHeight || ESTIMATED_ROW_HEIGHT,
    colSpan,
    render: renderItem
  };
  const T0 = TableContainer;
  const t23 = pageScroll ? undefined : "";
  let t24;
  if ($[49] !== pageScroll || $[50] !== sideways || $[51] !== stickyTop) {
    t24 = theme => pageScroll ? {
      ...(sideways ? {
        overflowX: "auto",
        overflowY: "hidden"
      } : {
        overflow: "visible"
      }),
      scrollMarginTop: stickyTop
    } : {
      flex: "1 1 0",
      minHeight: `calc(${theme.vars.size.row} * 4)`,
      overflowY: "auto",
      contain: "size"
    };
    $[49] = pageScroll;
    $[50] = sideways;
    $[51] = stickyTop;
    $[52] = t24;
  } else {
    t24 = $[52];
  }
  const T1 = Table;
  const t25 = "small";
  let t26;
  if ($[53] !== fixedWidths) {
    t26 = fixedWidths && {
      tableLayout: "fixed"
    };
    $[53] = fixedWidths;
    $[54] = t26;
  } else {
    t26 = $[54];
  }
  let t27;
  if ($[55] !== narrowBelow || $[56] !== sideways) {
    t27 = sideways && {
      minWidth: narrowBelow
    };
    $[55] = narrowBelow;
    $[56] = sideways;
    $[57] = t27;
  } else {
    t27 = $[57];
  }
  let t28;
  if ($[58] !== stickyTop) {
    t28 = stickyTop && {
      "& thead th": {
        top: stickyTop
      }
    };
    $[58] = stickyTop;
    $[59] = t28;
  } else {
    t28 = $[59];
  }
  let t29;
  if ($[60] !== t26 || $[61] !== t27 || $[62] !== t28) {
    t29 = {
      ...t26,
      ...t27,
      ...t28
    };
    $[60] = t26;
    $[61] = t27;
    $[62] = t28;
    $[63] = t29;
  } else {
    t29 = $[63];
  }
  let t30;
  if ($[64] !== api.visibleColumns || $[65] !== checkboxes || $[66] !== hasExplicitWidths || $[67] !== list || $[68] !== lockedWidths) {
    t30 = list ? null : hasExplicitWidths ? /*#__PURE__*/_jsxs("colgroup", {
      children: [checkboxes && /*#__PURE__*/_jsx("col", {}), api.visibleColumns.map(_temp1)]
    }) : lockedWidths ? /*#__PURE__*/_jsxs("colgroup", {
      children: [checkboxes && /*#__PURE__*/_jsx("col", {}), lockedWidths.map(_temp10)]
    }) : null;
    $[64] = api.visibleColumns;
    $[65] = checkboxes;
    $[66] = hasExplicitWidths;
    $[67] = list;
    $[68] = lockedWidths;
    $[69] = t30;
  } else {
    t30 = $[69];
  }
  const t31 = drilledGroup?.type === "group" && /*#__PURE__*/_jsx(TableHead, {
    children: /*#__PURE__*/_jsx(TableRow, {
      children: /*#__PURE__*/_jsx(TableCell, {
        variant: "head",
        colSpan: colSpan,
        sx: {
          px: 0,
          py: "sm",
          border: "none"
        },
        children: /*#__PURE__*/_jsxs(Box, {
          sx: {
            display: "flex",
            alignItems: "center",
            gap: "sm"
          },
          children: [/*#__PURE__*/_jsx(IconButton, {
            size: "small",
            edge: "start",
            "aria-label": "Back",
            onClick: () => setTrail(trail.slice(0, -1)),
            children: /*#__PURE__*/_jsx(ChevronLeftIcon, {})
          }), /*#__PURE__*/_jsx(Typography, {
            noWrap: true,
            sx: {
              flex: 1,
              minWidth: 0,
              fontSize: "h5",
              fontWeight: 600,
              color: "text.primary",
              textTransform: "none",
              letterSpacing: 0
            },
            children: drilledGroup.group.label
          }), !infiniteScroll && api.groupTotal(drilledGroup.id) > api.groupPagination(drilledGroup.id).pageSize ? /*#__PURE__*/_jsx(GroupPager, {
            groupId: drilledGroup.id,
            api: api
          }) : /*#__PURE__*/_jsx(Typography, {
            sx: {
              color: "text.secondary",
              fontVariantNumeric: "tabular-nums",
              textTransform: "none",
              letterSpacing: 0,
              fontWeight: 400
            },
            children: drilledGroup.group.count
          })]
        })
      })
    })
  });
  let t32;
  if ($[70] !== api || $[71] !== checkboxes || $[72] !== list) {
    t32 = !list && /*#__PURE__*/_jsx(TableHead, {
      children: /*#__PURE__*/_jsxs(TableRow, {
        children: [checkboxes && /*#__PURE__*/_jsx(TableCell, {
          variant: "head",
          padding: "checkbox",
          children: /*#__PURE__*/_jsx(Checkbox, {
            checked: api.allSelected,
            indeterminate: api.someSelected && !api.allSelected,
            onChange: () => api.toggleSelectAll(),
            "aria-label": "Select all rows"
          })
        }), api.visibleColumns.map(col_3 => /*#__PURE__*/_jsx(TableCell, {
          variant: "head",
          align: col_3.align,
          sortDirection: api.sort?.field === col_3.field ? api.sort.direction : false,
          onClick: col_3.sortable === false ? undefined : () => api.toggleSort(col_3.field),
          sx: col_3.sortable === false ? undefined : {
            cursor: "pointer",
            userSelect: "none"
          },
          children: col_3.sortable === false ? col_3.headerName : /*#__PURE__*/_jsxs("button", {
            type: "button",
            className: "KyroTable-sortButton",
            style: {
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              font: "inherit",
              textTransform: "inherit",
              letterSpacing: "inherit",
              color: "inherit",
              cursor: "pointer",
              userSelect: "none",
              whiteSpace: "nowrap"
            },
            children: [col_3.headerName, /*#__PURE__*/_jsx(SortArrows, {
              direction: api.sort?.field === col_3.field ? api.sort.direction : null
            })]
          })
        }, col_3.field))]
      })
    });
    $[70] = api;
    $[71] = checkboxes;
    $[72] = list;
    $[73] = t32;
  } else {
    t32 = $[73];
  }
  const T2 = TableBody;
  const t33 = navigating ? /*#__PURE__*/_jsx(TableRow, {
    children: /*#__PURE__*/_jsx(TableCell, {
      colSpan: colSpan,
      sx: {
        border: "none",
        p: 0
      },
      children: /*#__PURE__*/_jsx(List, {
        variant: "grouped",
        children: items.map(item_4 => item_4.type === "group" && /*#__PURE__*/_jsxs(ListItemButton, {
          onClick: () => drillInto(item_4.id),
          children: [selectable && selecting && /*#__PURE__*/_jsx(Box, {
            component: "span",
            sx: {
              display: "inline-flex"
            },
            onClick: _temp11,
            children: /*#__PURE__*/_jsx(Checkbox, {
              checked: api.groupAllSelected(item_4.id),
              indeterminate: api.groupSomeSelected(item_4.id) && !api.groupAllSelected(item_4.id),
              onChange: () => api.toggleSelectGroup(item_4.id),
              "aria-label": `Select all rows in ${item_4.group.label}`
            })
          }), /*#__PURE__*/_jsx(ListItemText, {
            primary: item_4.group.label
          }), /*#__PURE__*/_jsx(Typography, {
            sx: {
              color: "text.secondary",
              fontVariantNumeric: "tabular-nums"
            },
            children: item_4.group.count
          }), /*#__PURE__*/_jsx(ChevronRightIcon, {
            fontSize: "small",
            sx: {
              color: "text.disabled",
              flex: "none"
            }
          })]
        }, item_4.id))
      })
    })
  }) : items.length === 0 ? /*#__PURE__*/_jsx(SkeletonRows, {
    count: Math.min(api.pagination.pageSize, SKELETON_ROWS),
    selectable: checkboxes,
    shape: skeletonShape,
    colSpan: colSpan
  }) : infiniteScroll ? scroller && (scroller instanceof Window ? /*#__PURE__*/_jsx(WindowRows, {
    ...rowsProps
  }) : /*#__PURE__*/_jsx(ElementRows, {
    scroller: scroller,
    ...rowsProps
  })) : items.map((_, index_1) => renderItem(index_1));
  let t34;
  if ($[74] !== checkboxes || $[75] !== colSpan || $[76] !== infiniteScroll || $[77] !== items || $[78] !== more || $[79] !== scroller || $[80] !== skeletonShape) {
    t34 = infiniteScroll && more.has && scroller && /*#__PURE__*/_jsx(ScrollEnd, {
      scroller: scroller,
      colSpan: colSpan,
      load: more.load,
      loading: more.loading,
      count: items.length,
      placeholder: /*#__PURE__*/_jsx(SkeletonRows, {
        count: LOADING_MORE_ROWS,
        selectable: checkboxes,
        shape: skeletonShape,
        colSpan: colSpan
      })
    });
    $[74] = checkboxes;
    $[75] = colSpan;
    $[76] = infiniteScroll;
    $[77] = items;
    $[78] = more;
    $[79] = scroller;
    $[80] = skeletonShape;
    $[81] = t34;
  } else {
    t34 = $[81];
  }
  let t35;
  if ($[82] !== T2 || $[83] !== t33 || $[84] !== t34) {
    t35 = /*#__PURE__*/_jsxs(T2, {
      children: [t33, t34]
    });
    $[82] = T2;
    $[83] = t33;
    $[84] = t34;
    $[85] = t35;
  } else {
    t35 = $[85];
  }
  let t36;
  if ($[86] !== T1 || $[87] !== stickyHeader || $[88] !== t29 || $[89] !== t30 || $[90] !== t31 || $[91] !== t32 || $[92] !== t35) {
    t36 = /*#__PURE__*/_jsxs(T1, {
      size: t25,
      stickyHeader: stickyHeader,
      sx: t29,
      children: [t30, t31, t32, t35]
    });
    $[86] = T1;
    $[87] = stickyHeader;
    $[88] = t29;
    $[89] = t30;
    $[90] = t31;
    $[91] = t32;
    $[92] = t35;
    $[93] = t36;
  } else {
    t36 = $[93];
  }
  let t37;
  if ($[94] !== T0 || $[95] !== t23 || $[96] !== t24 || $[97] !== t36) {
    t37 = /*#__PURE__*/_jsx(T0, {
      ref: containerRef,
      "data-scroll-root": t23,
      sx: t24,
      children: t36
    });
    $[94] = T0;
    $[95] = t23;
    $[96] = t24;
    $[97] = t36;
    $[98] = t37;
  } else {
    t37 = $[98];
  }
  return t37;
}
function _temp11(e_1) {
  return e_1.stopPropagation();
}
function _temp10(width, index_0) {
  return /*#__PURE__*/_jsx("col", {
    style: {
      width
    }
  }, index_0);
}
function _temp1(col_2) {
  return /*#__PURE__*/_jsx("col", {
    style: col_2.width ? {
      width: col_2.width
    } : undefined
  }, col_2.field);
}
function _temp0(e_0) {
  return e_0.stopPropagation();
}
function _temp9(event_1) {
  return event_1.preventDefault();
}
function _temp8(e) {
  return e.stopPropagation();
}
function _temp7(row) {
  return row.getBoundingClientRect().height;
}
function _temp6(item_2) {
  return item_2.type === "group";
}
function _temp5(item) {
  return item.type === "group" ? [item.id] : [];
}
function _temp4() {
  return {
    rows: [],
    margin: 0
  };
}
function _temp3(col_0) {
  return col_0.field;
}
function _temp2(col) {
  return col.width;
}
function useMargin(body, scroller, initial) {
  const $ = _c(4);
  const [margin, setMargin] = useState(initial);
  let t0;
  if ($[0] !== body || $[1] !== margin || $[2] !== scroller) {
    t0 = () => {
      const node = body();
      if (!node) {
        return;
      }
      const next = marginOf(node, scroller);
      if (Math.abs(next - margin) > 0.5) {
        setMargin(next);
      }
    };
    $[0] = body;
    $[1] = margin;
    $[2] = scroller;
    $[3] = t0;
  } else {
    t0 = $[3];
  }
  useLayoutEffect(t0);
  return margin;
}
const virtualOptions = (props, scroller, margin) => ({
  count: props.count,
  initialOffset: props.view?.top ?? offsetOf(scroller),
  initialRect: props.view?.rect ?? rectOf(scroller),
  initialMeasurementsCache: props.view?.rows,
  estimateSize: () => props.rowHeight,
  overscan: OVERSCAN,
  scrollMargin: margin
});
function ElementRows({
  scroller,
  ...props
}) {
  'use no memo';

  const margin = useMargin(props.body, scroller, props.view?.margin ?? 0);
  const virtualizer = useVirtualizer({
    ...virtualOptions(props, scroller, margin),
    getScrollElement: () => scroller
  });
  return /*#__PURE__*/_jsx(Windowed, {
    virtualizer: virtualizer,
    margin: margin,
    ...props
  });
}
function WindowRows(props) {
  'use no memo';

  const margin = useMargin(props.body, window, props.view?.margin ?? 0);
  const virtualizer = useWindowVirtualizer(virtualOptions(props, window, margin));
  return /*#__PURE__*/_jsx(Windowed, {
    virtualizer: virtualizer,
    margin: margin,
    ...props
  });
}

/** Only the rows in view, plus a margin, are in the document; spacer rows stand in for the rest so the scrollbar stays true. */
function Windowed({
  virtualizer,
  margin,
  snapshot,
  colSpan,
  render
}) {
  'use no memo';

  snapshot.current = () => ({
    rows: virtualizer.takeSnapshot(),
    margin
  });
  const windowed = virtualizer.getVirtualItems();
  const above = windowed.length ? windowed[0].start - margin : 0;
  const below = virtualizer.getTotalSize() - (windowed.length ? windowed.at(-1).end - margin : 0);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [above > 0 && /*#__PURE__*/_jsx(Spacer, {
      height: above,
      colSpan: colSpan
    }), windowed.map(entry => render(entry.index, virtualizer.measureElement)), below > 0 && /*#__PURE__*/_jsx(Spacer, {
      height: below,
      colSpan: colSpan
    })]
  });
}
function Spacer(t0) {
  const $ = _c(5);
  const {
    height,
    colSpan
  } = t0;
  let t1;
  if ($[0] !== height) {
    t1 = {
      height,
      padding: 0,
      border: 0
    };
    $[0] = height;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  let t2;
  if ($[2] !== colSpan || $[3] !== t1) {
    t2 = /*#__PURE__*/_jsx("tr", {
      "aria-hidden": "true",
      children: /*#__PURE__*/_jsx("td", {
        colSpan: colSpan,
        style: t1
      })
    });
    $[2] = colSpan;
    $[3] = t1;
    $[4] = t2;
  } else {
    t2 = $[4];
  }
  return t2;
}
function SkeletonRows(t0) {
  const $ = _c(16);
  const {
    count,
    selectable,
    shape,
    colSpan
  } = t0;
  const api = useDataTableContext();
  const [shown, setShown] = useState(false);
  let t1;
  let t2;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = () => {
      const timer = setTimeout(() => setShown(true), SKELETON_DELAY);
      return () => clearTimeout(timer);
    };
    t2 = [];
    $[0] = t1;
    $[1] = t2;
  } else {
    t1 = $[0];
    t2 = $[1];
  }
  useEffect(t1, t2);
  if (!shown) {
    return null;
  }
  let t3;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = {
      display: "flex",
      flexDirection: "column",
      gap: "sm",
      py: "xs"
    };
    $[2] = t3;
  } else {
    t3 = $[2];
  }
  let t4;
  if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = /*#__PURE__*/_jsx(Skeleton, {
      variant: "rounded",
      sx: {
        width: "55%",
        height: 14,
        borderRadius: "pill"
      }
    });
    $[3] = t4;
  } else {
    t4 = $[3];
  }
  let t5;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t5 = /*#__PURE__*/_jsxs(Box, {
      sx: t3,
      children: [t4, /*#__PURE__*/_jsx(Skeleton, {
        variant: "rounded",
        sx: {
          width: "35%",
          height: 10,
          borderRadius: "pill"
        }
      })]
    });
    $[4] = t5;
  } else {
    t5 = $[4];
  }
  const lines = t5;
  let t6;
  if ($[5] !== api || $[6] !== colSpan || $[7] !== count || $[8] !== selectable || $[9] !== shape) {
    let t7;
    if ($[11] !== api || $[12] !== colSpan || $[13] !== selectable || $[14] !== shape) {
      t7 = (_, index) => /*#__PURE__*/_jsx(TableRow, {
        className: "KyroTable-skeletonRow",
        children: shape === "cards" ? /*#__PURE__*/_jsx(TableCell, {
          colSpan: colSpan,
          sx: {
            border: "none",
            px: 0,
            py: "xs"
          },
          children: /*#__PURE__*/_jsx(Card, {
            sx: {
              p: "md"
            },
            children: lines
          })
        }) : shape === "list" ? /*#__PURE__*/_jsx(TableCell, {
          colSpan: colSpan,
          children: lines
        }) : /*#__PURE__*/_jsxs(_Fragment, {
          children: [selectable && /*#__PURE__*/_jsx(TableCell, {
            padding: "checkbox"
          }), api.visibleColumns.map(_temp12)]
        })
      }, `skeleton-${index}`);
      $[11] = api;
      $[12] = colSpan;
      $[13] = selectable;
      $[14] = shape;
      $[15] = t7;
    } else {
      t7 = $[15];
    }
    t6 = Array.from({
      length: count
    }, t7);
    $[5] = api;
    $[6] = colSpan;
    $[7] = count;
    $[8] = selectable;
    $[9] = shape;
    $[10] = t6;
  } else {
    t6 = $[10];
  }
  return t6;
}
function _temp12(col) {
  return /*#__PURE__*/_jsx(TableCell, {
    align: col.align,
    children: /*#__PURE__*/_jsx(Skeleton, {
      variant: "rounded",
      sx: {
        display: "inline-block",
        width: "60%",
        maxWidth: 120,
        height: 12,
        borderRadius: "pill"
      }
    })
  }, col.field);
}
function ScrollEnd(t0) {
  const $ = _c(16);
  const {
    scroller,
    colSpan,
    load,
    loading,
    count,
    placeholder
  } = t0;
  const marker = useRef(null);
  const [reached, setReached] = useState(false);
  let t1;
  if ($[0] !== load || $[1] !== scroller) {
    t1 = () => {
      const node = marker.current;
      if (!node) {
        return;
      }
      const observer = new IntersectionObserver(t2 => {
        const [entry] = t2;
        return entry?.isIntersecting && load();
      }, {
        root: scroller instanceof Window ? null : scroller,
        rootMargin: `0px 0px ${rectOf(scroller).height}px 0px`
      });
      observer.observe(node);
      return () => observer.disconnect();
    };
    $[0] = load;
    $[1] = scroller;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  let t2;
  if ($[3] !== count || $[4] !== load || $[5] !== scroller) {
    t2 = [load, count, scroller];
    $[3] = count;
    $[4] = load;
    $[5] = scroller;
    $[6] = t2;
  } else {
    t2 = $[6];
  }
  useEffect(t1, t2);
  let t3;
  let t4;
  if ($[7] !== scroller) {
    t3 = () => {
      const node_0 = marker.current;
      if (!node_0) {
        return;
      }
      const observer_0 = new IntersectionObserver(t5 => {
        const [entry_0] = t5;
        return setReached(Boolean(entry_0?.isIntersecting));
      }, {
        root: scroller instanceof Window ? null : scroller
      });
      observer_0.observe(node_0);
      return () => observer_0.disconnect();
    };
    t4 = [scroller];
    $[7] = scroller;
    $[8] = t3;
    $[9] = t4;
  } else {
    t3 = $[8];
    t4 = $[9];
  }
  useEffect(t3, t4);
  let t5;
  if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
    t5 = {
      padding: 0,
      height: 1,
      border: 0
    };
    $[10] = t5;
  } else {
    t5 = $[10];
  }
  let t6;
  if ($[11] !== colSpan) {
    t6 = /*#__PURE__*/_jsx("tr", {
      ref: marker,
      "aria-hidden": "true",
      children: /*#__PURE__*/_jsx("td", {
        colSpan: colSpan,
        style: t5
      })
    });
    $[11] = colSpan;
    $[12] = t6;
  } else {
    t6 = $[12];
  }
  const t7 = reached && loading && placeholder;
  let t8;
  if ($[13] !== t6 || $[14] !== t7) {
    t8 = /*#__PURE__*/_jsxs(_Fragment, {
      children: [t6, t7]
    });
    $[13] = t6;
    $[14] = t7;
    $[15] = t8;
  } else {
    t8 = $[15];
  }
  return t8;
}