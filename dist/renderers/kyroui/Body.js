import { c as _c } from "react/compiler-runtime";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual';
import { Box, Button, Checkbox, IconButton, Skeleton, SvgIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@kyrobit/kyroui';
import { useDataTableContext } from './context.js';
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
  const $ = _c(114);
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
    stickyTop
  } = t0;
  const emptyMessage = t1 === undefined ? "No records found." : t1;
  const noResultsMessage = t2 === undefined ? "No records match your search." : t2;
  const selectable = t3 === undefined ? false : t3;
  const stickyHeader = t4 === undefined ? true : t4;
  const infiniteScroll = t5 === undefined ? false : t5;
  const pageScroll = t6 === undefined ? false : t6;
  const api = useDataTableContext();
  const items = api.visibleItems;
  const colSpan = api.visibleColumns.length + (selectable ? 1 : 0);
  const fetching = api.loading || api.groupsLoading;
  let t7;
  if ($[0] !== api.visibleColumns) {
    t7 = api.visibleColumns.some(_temp2);
    $[0] = api.visibleColumns;
    $[1] = t7;
  } else {
    t7 = $[1];
  }
  const hasExplicitWidths = t7;
  const containerRef = useRef(null);
  const [scroller, setScroller] = useState(null);
  const [rowHeight, setRowHeight] = useState(0);
  let t8;
  if ($[2] !== api.visibleColumns) {
    t8 = api.visibleColumns.map(_temp3).join("|");
    $[2] = api.visibleColumns;
    $[3] = t8;
  } else {
    t8 = $[3];
  }
  const columnsKey = t8;
  const [locked, setLocked] = useState(null);
  const lockedWidths = locked?.key === columnsKey ? locked.widths : null;
  const intentTimer = useRef(undefined);
  const viewKey = api.cacheKey === undefined ? null : api.listKey;
  let t9;
  if ($[4] !== viewKey) {
    t9 = viewKey === null ? undefined : views.get(viewKey);
    $[4] = viewKey;
    $[5] = t9;
  } else {
    t9 = $[5];
  }
  const view = t9;
  const snapshot = useRef(_temp4);
  let t10;
  let t11;
  if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = () => () => clearTimeout(intentTimer.current);
    t11 = [];
    $[6] = t10;
    $[7] = t11;
  } else {
    t10 = $[6];
    t11 = $[7];
  }
  useEffect(t10, t11);
  let t12;
  if ($[8] !== pageScroll || $[9] !== scroller) {
    t12 = () => {
      const container = containerRef.current;
      if (!container) {
        return;
      }
      const next = pageScroll ? scrollParentOf(container) : container;
      if (next !== scroller) {
        setScroller(next);
      }
    };
    $[8] = pageScroll;
    $[9] = scroller;
    $[10] = t12;
  } else {
    t12 = $[10];
  }
  useLayoutEffect(t12);
  let t13;
  if ($[11] !== pageScroll || $[12] !== view || $[13] !== viewKey) {
    t13 = () => {
      const container_0 = containerRef.current;
      if (!container_0) {
        return;
      }
      const target = pageScroll ? scrollParentOf(container_0) : container_0;
      const head = container_0.querySelector("thead");
      const pinned = head !== null && head.getBoundingClientRect().top > container_0.getBoundingClientRect().top + 1;
      if (view) {
        target.scrollTo({
          top: view.top,
          behavior: "instant"
        });
      } else {
        if (!pageScroll) {
          container_0.scrollTop = 0;
        } else {
          if (pinned) {
            container_0.scrollIntoView({
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
    $[11] = pageScroll;
    $[12] = view;
    $[13] = viewKey;
    $[14] = t13;
  } else {
    t13 = $[14];
  }
  let t14;
  if ($[15] !== api.groupBy || $[16] !== api.listKey) {
    t14 = [api.listKey, api.groupBy];
    $[15] = api.groupBy;
    $[16] = api.listKey;
    $[17] = t14;
  } else {
    t14 = $[17];
  }
  useLayoutEffect(t13, t14);
  let t15;
  if ($[18] !== columnsKey || $[19] !== hasExplicitWidths || $[20] !== lockedWidths || $[21] !== rowHeight || $[22] !== selectable) {
    t15 = () => {
      const container_1 = containerRef.current;
      if (!container_1) {
        return;
      }
      const rows = Array.from(container_1.querySelectorAll("tbody tr[data-row]"));
      const tallest = Math.max(0, ...rows.map(_temp5));
      if (tallest > rowHeight) {
        setRowHeight(tallest);
      }
      if (hasExplicitWidths || lockedWidths || !rows.length) {
        return;
      }
      const table = container_1.querySelector("table").getBoundingClientRect().width;
      const cells = Array.from(container_1.querySelectorAll("thead th")).slice(selectable ? 1 : 0);
      setLocked({
        key: columnsKey,
        widths: cells.map(cell => `${cell.getBoundingClientRect().width / table * 100}%`)
      });
    };
    $[18] = columnsKey;
    $[19] = hasExplicitWidths;
    $[20] = lockedWidths;
    $[21] = rowHeight;
    $[22] = selectable;
    $[23] = t15;
  } else {
    t15 = $[23];
  }
  useLayoutEffect(t15);
  const fixedWidths = hasExplicitWidths || lockedWidths !== null;
  if (items.length === 0 && !fetching) {
    let t16;
    if ($[24] !== api.filters || $[25] !== api.search) {
      t16 = Boolean(api.search) || countFilterValues(api.filters ?? {}) > 0;
      $[24] = api.filters;
      $[25] = api.search;
      $[26] = t16;
    } else {
      t16 = $[26];
    }
    const filtered = t16;
    let t17;
    if ($[27] !== api || $[28] !== emptyMessage || $[29] !== errorMessage || $[30] !== filtered || $[31] !== noResultsMessage) {
      t17 = api.error ? errorMessage ?? /*#__PURE__*/_jsxs(Box, {
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
      $[27] = api;
      $[28] = emptyMessage;
      $[29] = errorMessage;
      $[30] = filtered;
      $[31] = noResultsMessage;
      $[32] = t17;
    } else {
      t17 = $[32];
    }
    const message = t17;
    let t18;
    if ($[33] === Symbol.for("react.memo_cache_sentinel")) {
      t18 = {
        flex: 1,
        py: "xl"
      };
      $[33] = t18;
    } else {
      t18 = $[33];
    }
    let t19;
    if ($[34] !== message) {
      t19 = typeof message === "string" ? /*#__PURE__*/_jsx(Typography, {
        sx: {
          color: "text.secondary",
          textAlign: "center",
          py: "xl"
        },
        children: message
      }) : message;
      $[34] = message;
      $[35] = t19;
    } else {
      t19 = $[35];
    }
    let t20;
    if ($[36] !== t19) {
      t20 = /*#__PURE__*/_jsx(Box, {
        className: "KyroTable-empty",
        sx: t18,
        children: t19
      });
      $[36] = t19;
      $[37] = t20;
    } else {
      t20 = $[37];
    }
    return t20;
  }
  let T0;
  let T1;
  let T2;
  let t16;
  let t17;
  let t18;
  let t19;
  let t20;
  let t21;
  let t22;
  let t23;
  let t24;
  if ($[38] !== api || $[39] !== colSpan || $[40] !== fixedWidths || $[41] !== hasExplicitWidths || $[42] !== infiniteScroll || $[43] !== items || $[44] !== lockedWidths || $[45] !== onRowClick || $[46] !== onRowIntent || $[47] !== pageScroll || $[48] !== rowClass || $[49] !== rowHeight || $[50] !== scroller || $[51] !== selectable || $[52] !== stickyHeader || $[53] !== stickyTop || $[54] !== view) {
    const renderItem = (index, measure) => {
      const item = items[index];
      const measured = measure ? {
        "data-index": index,
        ref: measure
      } : {};
      if (item.type === "group") {
        return /*#__PURE__*/_jsx(TableRow, {
          "data-row": "",
          ...measured,
          className: "KyroTable-groupRow",
          onClick: () => api.toggleGroup(item.id),
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
                pl: item.depth * 3
              },
              children: [/*#__PURE__*/_jsxs(Box, {
                sx: {
                  display: "flex",
                  alignItems: "center",
                  gap: "sm",
                  minWidth: 0
                },
                children: [item.expanded ? /*#__PURE__*/_jsx(ExpandMoreIcon, {
                  fontSize: "small",
                  sx: {
                    color: "text.secondary"
                  }
                }) : /*#__PURE__*/_jsx(ChevronRightIcon, {
                  fontSize: "small",
                  sx: {
                    color: "text.secondary"
                  }
                }), selectable && /*#__PURE__*/_jsx(Box, {
                  component: "span",
                  sx: {
                    display: "inline-flex"
                  },
                  onClick: _temp6,
                  children: /*#__PURE__*/_jsx(Checkbox, {
                    checked: api.groupAllSelected(item.id),
                    indeterminate: api.groupSomeSelected(item.id) && !api.groupAllSelected(item.id),
                    onChange: () => api.toggleSelectGroup(item.id),
                    "aria-label": `Select all rows in ${item.group.label}`
                  })
                }), /*#__PURE__*/_jsx(Box, {
                  component: "span",
                  sx: {
                    fontWeight: 600,
                    color: "text.primary"
                  },
                  children: item.group.label
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
                  children: item.group.count
                }), api.groupLoading(item.id) && api.groupRows(item.id).length === 0 && /*#__PURE__*/_jsx(Box, {
                  component: "span",
                  sx: {
                    color: "text.secondary",
                    fontSize: "sm"
                  },
                  children: "loading\u2026"
                })]
              }), item.expanded && /*#__PURE__*/_jsx(GroupPager, {
                groupId: item.id,
                api: api
              })]
            })
          })
        }, `group-${item.id}`);
      }
      const row_0 = item.row;
      const rowId = api.getRowId(row_0);
      const classes = [item.type === "group-row" ? "KyroTable-groupChildRow" : "", rowClass ? rowClass(row_0) : ""].filter(Boolean).join(" ");
      return /*#__PURE__*/_jsxs(TableRow, {
        "data-row": "",
        ...measured,
        hover: true,
        selected: selectable && api.isSelected(rowId),
        className: classes || undefined,
        style: {
          cursor: onRowClick ? "pointer" : undefined
        },
        onClick: () => onRowClick?.(row_0),
        tabIndex: onRowIntent ? 0 : undefined,
        onPointerEnter: onRowIntent && (() => {
          clearTimeout(intentTimer.current);
          intentTimer.current = setTimeout(() => onRowIntent(row_0), ROW_INTENT_DELAY);
        }),
        onPointerLeave: onRowIntent && (() => clearTimeout(intentTimer.current)),
        onFocus: onRowIntent && (event => event.target === event.currentTarget && onRowIntent(row_0)),
        children: [selectable && /*#__PURE__*/_jsx(TableCell, {
          padding: "checkbox",
          onClick: _temp7,
          children: /*#__PURE__*/_jsx(Checkbox, {
            checked: api.isSelected(rowId),
            onChange: () => api.toggleSelected(rowId),
            "aria-label": "Select row"
          })
        }), api.visibleColumns.map(col_1 => /*#__PURE__*/_jsx(TableCell, {
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
    T2 = TableContainer;
    t22 = containerRef;
    t23 = pageScroll ? undefined : "";
    if ($[67] !== pageScroll || $[68] !== stickyTop) {
      t24 = theme => pageScroll ? {
        overflow: "visible",
        scrollMarginTop: stickyTop
      } : {
        flex: "1 1 0",
        minHeight: `calc(${theme.vars.size.row} * 4)`,
        overflowY: "auto",
        contain: "size"
      };
      $[67] = pageScroll;
      $[68] = stickyTop;
      $[69] = t24;
    } else {
      t24 = $[69];
    }
    T1 = Table;
    t17 = "small";
    t18 = stickyHeader;
    let t25;
    if ($[70] !== fixedWidths) {
      t25 = fixedWidths && {
        tableLayout: "fixed"
      };
      $[70] = fixedWidths;
      $[71] = t25;
    } else {
      t25 = $[71];
    }
    let t26;
    if ($[72] !== stickyTop) {
      t26 = stickyTop && {
        "& thead th": {
          top: stickyTop
        }
      };
      $[72] = stickyTop;
      $[73] = t26;
    } else {
      t26 = $[73];
    }
    if ($[74] !== t25 || $[75] !== t26) {
      t19 = {
        ...t25,
        ...t26
      };
      $[74] = t25;
      $[75] = t26;
      $[76] = t19;
    } else {
      t19 = $[76];
    }
    if ($[77] !== api.visibleColumns || $[78] !== hasExplicitWidths || $[79] !== lockedWidths || $[80] !== selectable) {
      t20 = hasExplicitWidths ? /*#__PURE__*/_jsxs("colgroup", {
        children: [selectable && /*#__PURE__*/_jsx("col", {}), api.visibleColumns.map(_temp8)]
      }) : lockedWidths ? /*#__PURE__*/_jsxs("colgroup", {
        children: [selectable && /*#__PURE__*/_jsx("col", {}), lockedWidths.map(_temp9)]
      }) : null;
      $[77] = api.visibleColumns;
      $[78] = hasExplicitWidths;
      $[79] = lockedWidths;
      $[80] = selectable;
      $[81] = t20;
    } else {
      t20 = $[81];
    }
    let t27;
    if ($[82] !== api || $[83] !== selectable) {
      t27 = selectable && /*#__PURE__*/_jsx(TableCell, {
        variant: "head",
        padding: "checkbox",
        children: /*#__PURE__*/_jsx(Checkbox, {
          checked: api.allSelected,
          indeterminate: api.someSelected && !api.allSelected,
          onChange: () => api.toggleSelectAll(),
          "aria-label": "Select all rows"
        })
      });
      $[82] = api;
      $[83] = selectable;
      $[84] = t27;
    } else {
      t27 = $[84];
    }
    let t28;
    if ($[85] !== api) {
      t28 = api.visibleColumns.map(col_3 => /*#__PURE__*/_jsx(TableCell, {
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
      }, col_3.field));
      $[85] = api;
      $[86] = t28;
    } else {
      t28 = $[86];
    }
    if ($[87] !== t27 || $[88] !== t28) {
      t21 = /*#__PURE__*/_jsx(TableHead, {
        children: /*#__PURE__*/_jsxs(TableRow, {
          children: [t27, t28]
        })
      });
      $[87] = t27;
      $[88] = t28;
      $[89] = t21;
    } else {
      t21 = $[89];
    }
    T0 = TableBody;
    t16 = items.length === 0 ? /*#__PURE__*/_jsx(SkeletonRows, {
      count: Math.min(api.pagination.pageSize, SKELETON_ROWS),
      selectable: selectable
    }) : infiniteScroll ? scroller && (scroller instanceof Window ? /*#__PURE__*/_jsx(WindowRows, {
      ...rowsProps
    }) : /*#__PURE__*/_jsx(ElementRows, {
      scroller: scroller,
      ...rowsProps
    })) : items.map((_, index_1) => renderItem(index_1));
    $[38] = api;
    $[39] = colSpan;
    $[40] = fixedWidths;
    $[41] = hasExplicitWidths;
    $[42] = infiniteScroll;
    $[43] = items;
    $[44] = lockedWidths;
    $[45] = onRowClick;
    $[46] = onRowIntent;
    $[47] = pageScroll;
    $[48] = rowClass;
    $[49] = rowHeight;
    $[50] = scroller;
    $[51] = selectable;
    $[52] = stickyHeader;
    $[53] = stickyTop;
    $[54] = view;
    $[55] = T0;
    $[56] = T1;
    $[57] = T2;
    $[58] = t16;
    $[59] = t17;
    $[60] = t18;
    $[61] = t19;
    $[62] = t20;
    $[63] = t21;
    $[64] = t22;
    $[65] = t23;
    $[66] = t24;
  } else {
    T0 = $[55];
    T1 = $[56];
    T2 = $[57];
    t16 = $[58];
    t17 = $[59];
    t18 = $[60];
    t19 = $[61];
    t20 = $[62];
    t21 = $[63];
    t22 = $[64];
    t23 = $[65];
    t24 = $[66];
  }
  let t25;
  if ($[90] !== api.hasMore || $[91] !== colSpan || $[92] !== infiniteScroll || $[93] !== scroller || $[94] !== selectable) {
    t25 = infiniteScroll && api.hasMore && scroller && /*#__PURE__*/_jsx(ScrollEnd, {
      scroller: scroller,
      colSpan: colSpan,
      selectable: selectable
    });
    $[90] = api.hasMore;
    $[91] = colSpan;
    $[92] = infiniteScroll;
    $[93] = scroller;
    $[94] = selectable;
    $[95] = t25;
  } else {
    t25 = $[95];
  }
  let t26;
  if ($[96] !== T0 || $[97] !== t16 || $[98] !== t25) {
    t26 = /*#__PURE__*/_jsxs(T0, {
      children: [t16, t25]
    });
    $[96] = T0;
    $[97] = t16;
    $[98] = t25;
    $[99] = t26;
  } else {
    t26 = $[99];
  }
  let t27;
  if ($[100] !== T1 || $[101] !== t17 || $[102] !== t18 || $[103] !== t19 || $[104] !== t20 || $[105] !== t21 || $[106] !== t26) {
    t27 = /*#__PURE__*/_jsxs(T1, {
      size: t17,
      stickyHeader: t18,
      sx: t19,
      children: [t20, t21, t26]
    });
    $[100] = T1;
    $[101] = t17;
    $[102] = t18;
    $[103] = t19;
    $[104] = t20;
    $[105] = t21;
    $[106] = t26;
    $[107] = t27;
  } else {
    t27 = $[107];
  }
  let t28;
  if ($[108] !== T2 || $[109] !== t22 || $[110] !== t23 || $[111] !== t24 || $[112] !== t27) {
    t28 = /*#__PURE__*/_jsx(T2, {
      ref: t22,
      "data-scroll-root": t23,
      sx: t24,
      children: t27
    });
    $[108] = T2;
    $[109] = t22;
    $[110] = t23;
    $[111] = t24;
    $[112] = t27;
    $[113] = t28;
  } else {
    t28 = $[113];
  }
  return t28;
}
function _temp9(width, index_0) {
  return /*#__PURE__*/_jsx("col", {
    style: {
      width
    }
  }, index_0);
}
function _temp8(col_2) {
  return /*#__PURE__*/_jsx("col", {
    style: col_2.width ? {
      width: col_2.width
    } : undefined
  }, col_2.field);
}
function _temp7(e_0) {
  return e_0.stopPropagation();
}
function _temp6(e) {
  return e.stopPropagation();
}
function _temp5(row) {
  return row.getBoundingClientRect().height;
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
  const $ = _c(9);
  const {
    count,
    selectable
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
  if ($[2] !== api || $[3] !== count || $[4] !== selectable) {
    let t4;
    if ($[6] !== api || $[7] !== selectable) {
      t4 = (_, index) => /*#__PURE__*/_jsxs(TableRow, {
        className: "KyroTable-skeletonRow",
        children: [selectable && /*#__PURE__*/_jsx(TableCell, {
          padding: "checkbox"
        }), api.visibleColumns.map(_temp0)]
      }, `skeleton-${index}`);
      $[6] = api;
      $[7] = selectable;
      $[8] = t4;
    } else {
      t4 = $[8];
    }
    t3 = Array.from({
      length: count
    }, t4);
    $[2] = api;
    $[3] = count;
    $[4] = selectable;
    $[5] = t3;
  } else {
    t3 = $[5];
  }
  return t3;
}
function _temp0(col) {
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
  const $ = _c(20);
  const {
    scroller,
    colSpan,
    selectable
  } = t0;
  const api = useDataTableContext();
  const marker = useRef(null);
  const [reached, setReached] = useState(false);
  const {
    loadMore,
    loadingMore,
    rows
  } = api;
  let t1;
  if ($[0] !== loadMore || $[1] !== scroller) {
    t1 = () => {
      const node = marker.current;
      if (!node) {
        return;
      }
      const observer = new IntersectionObserver(t2 => {
        const [entry] = t2;
        return entry?.isIntersecting && loadMore();
      }, {
        root: scroller instanceof Window ? null : scroller,
        rootMargin: `0px 0px ${rectOf(scroller).height}px 0px`
      });
      observer.observe(node);
      return () => observer.disconnect();
    };
    $[0] = loadMore;
    $[1] = scroller;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  let t2;
  if ($[3] !== loadMore || $[4] !== rows.length || $[5] !== scroller) {
    t2 = [loadMore, rows.length, scroller];
    $[3] = loadMore;
    $[4] = rows.length;
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
  let t7;
  if ($[13] !== loadingMore || $[14] !== reached || $[15] !== selectable) {
    t7 = reached && loadingMore && /*#__PURE__*/_jsx(SkeletonRows, {
      count: LOADING_MORE_ROWS,
      selectable: selectable
    });
    $[13] = loadingMore;
    $[14] = reached;
    $[15] = selectable;
    $[16] = t7;
  } else {
    t7 = $[16];
  }
  let t8;
  if ($[17] !== t6 || $[18] !== t7) {
    t8 = /*#__PURE__*/_jsxs(_Fragment, {
      children: [t6, t7]
    });
    $[17] = t6;
    $[18] = t7;
    $[19] = t8;
  } else {
    t8 = $[19];
  }
  return t8;
}