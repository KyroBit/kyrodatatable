import { c as _c } from "react/compiler-runtime";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
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
/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export function DataTableBody(t0) {
  const $ = _c(100);
  const {
    onRowClick,
    onRowIntent,
    emptyMessage: t1,
    noResultsMessage: t2,
    errorMessage,
    selectable: t3,
    stickyHeader: t4,
    rowClass,
    infiniteScroll: t5
  } = t0;
  const emptyMessage = t1 === undefined ? "No records found." : t1;
  const noResultsMessage = t2 === undefined ? "No records match your search." : t2;
  const selectable = t3 === undefined ? false : t3;
  const stickyHeader = t4 === undefined ? true : t4;
  const infiniteScroll = t5 === undefined ? false : t5;
  const api = useDataTableContext();
  const items = api.visibleItems;
  const colSpan = api.visibleColumns.length + (selectable ? 1 : 0);
  const fetching = api.loading || api.groupsLoading;
  let t6;
  if ($[0] !== api.visibleColumns) {
    t6 = api.visibleColumns.some(_temp2);
    $[0] = api.visibleColumns;
    $[1] = t6;
  } else {
    t6 = $[1];
  }
  const hasExplicitWidths = t6;
  const containerRef = useRef(null);
  const [rowHeight, setRowHeight] = useState(0);
  const [headHeight, setHeadHeight] = useState(0);
  let t7;
  if ($[2] !== api.visibleColumns) {
    t7 = api.visibleColumns.map(_temp3).join("|");
    $[2] = api.visibleColumns;
    $[3] = t7;
  } else {
    t7 = $[3];
  }
  const columnsKey = t7;
  const [locked, setLocked] = useState(null);
  const lockedWidths = locked?.key === columnsKey ? locked.widths : null;
  const intentTimer = useRef(undefined);
  const viewKey = api.cacheKey === undefined ? null : api.listKey;
  let t8;
  if ($[4] !== viewKey) {
    t8 = viewKey === null ? undefined : views.get(viewKey);
    $[4] = viewKey;
    $[5] = t8;
  } else {
    t8 = $[5];
  }
  const view = t8;
  const snapshot = useRef(_temp4);
  let t10;
  let t9;
  if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
    t9 = () => () => clearTimeout(intentTimer.current);
    t10 = [];
    $[6] = t10;
    $[7] = t9;
  } else {
    t10 = $[6];
    t9 = $[7];
  }
  useEffect(t9, t10);
  let t11;
  if ($[8] !== view?.top || $[9] !== viewKey) {
    t11 = () => {
      const container = containerRef.current;
      if (!container) {
        return;
      }
      container.scrollTop = view?.top ?? 0;
      return () => {
        if (viewKey === null) {
          return;
        }
        const rect = {
          width: container.clientWidth,
          height: container.clientHeight
        };
        views.set(viewKey, {
          top: container.scrollTop,
          rect,
          rows: snapshot.current()
        });
      };
    };
    $[8] = view?.top;
    $[9] = viewKey;
    $[10] = t11;
  } else {
    t11 = $[10];
  }
  let t12;
  if ($[11] !== api.groupBy || $[12] !== api.listKey) {
    t12 = [api.listKey, api.groupBy];
    $[11] = api.groupBy;
    $[12] = api.listKey;
    $[13] = t12;
  } else {
    t12 = $[13];
  }
  useLayoutEffect(t11, t12);
  let t13;
  if ($[14] !== columnsKey || $[15] !== hasExplicitWidths || $[16] !== headHeight || $[17] !== lockedWidths || $[18] !== rowHeight || $[19] !== selectable) {
    t13 = () => {
      const container_0 = containerRef.current;
      if (!container_0) {
        return;
      }
      const head = container_0.querySelector("thead")?.getBoundingClientRect().height ?? 0;
      const rows = Array.from(container_0.querySelectorAll("tbody tr[data-row]"));
      const tallest = Math.max(0, ...rows.map(_temp5));
      if (head > headHeight) {
        setHeadHeight(head);
      }
      if (tallest > rowHeight) {
        setRowHeight(tallest);
      }
      if (hasExplicitWidths || lockedWidths || !rows.length) {
        return;
      }
      const table = container_0.querySelector("table").getBoundingClientRect().width;
      const cells = Array.from(container_0.querySelectorAll("thead th")).slice(selectable ? 1 : 0);
      setLocked({
        key: columnsKey,
        widths: cells.map(cell => `${cell.getBoundingClientRect().width / table * 100}%`)
      });
    };
    $[14] = columnsKey;
    $[15] = hasExplicitWidths;
    $[16] = headHeight;
    $[17] = lockedWidths;
    $[18] = rowHeight;
    $[19] = selectable;
    $[20] = t13;
  } else {
    t13 = $[20];
  }
  useLayoutEffect(t13);
  const fixedWidths = hasExplicitWidths || lockedWidths !== null;
  if (items.length === 0 && !fetching) {
    let t14;
    if ($[21] !== api.filters || $[22] !== api.search) {
      t14 = Boolean(api.search) || countFilterValues(api.filters ?? {}) > 0;
      $[21] = api.filters;
      $[22] = api.search;
      $[23] = t14;
    } else {
      t14 = $[23];
    }
    const filtered = t14;
    let t15;
    if ($[24] !== api || $[25] !== emptyMessage || $[26] !== errorMessage || $[27] !== filtered || $[28] !== noResultsMessage) {
      t15 = api.error ? errorMessage ?? /*#__PURE__*/_jsxs(Box, {
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
      $[24] = api;
      $[25] = emptyMessage;
      $[26] = errorMessage;
      $[27] = filtered;
      $[28] = noResultsMessage;
      $[29] = t15;
    } else {
      t15 = $[29];
    }
    const message = t15;
    let t16;
    if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
      t16 = {
        flex: 1,
        py: "xl"
      };
      $[30] = t16;
    } else {
      t16 = $[30];
    }
    let t17;
    if ($[31] !== message) {
      t17 = typeof message === "string" ? /*#__PURE__*/_jsx(Typography, {
        sx: {
          color: "text.secondary",
          textAlign: "center",
          py: "xl"
        },
        children: message
      }) : message;
      $[31] = message;
      $[32] = t17;
    } else {
      t17 = $[32];
    }
    let t18;
    if ($[33] !== t17) {
      t18 = /*#__PURE__*/_jsx(Box, {
        className: "KyroTable-empty",
        sx: t16,
        children: t17
      });
      $[33] = t17;
      $[34] = t18;
    } else {
      t18 = $[34];
    }
    return t18;
  }
  let T0;
  let T1;
  let T2;
  let t14;
  let t15;
  let t16;
  let t17;
  let t18;
  let t19;
  let t20;
  let t21;
  let t22;
  if ($[35] !== api || $[36] !== colSpan || $[37] !== fixedWidths || $[38] !== hasExplicitWidths || $[39] !== headHeight || $[40] !== infiniteScroll || $[41] !== items || $[42] !== lockedWidths || $[43] !== onRowClick || $[44] !== onRowIntent || $[45] !== rowClass || $[46] !== rowHeight || $[47] !== selectable || $[48] !== stickyHeader || $[49] !== view) {
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
    T2 = TableContainer;
    t20 = containerRef;
    t21 = "";
    t22 = _temp8;
    T1 = Table;
    t15 = "small";
    t16 = stickyHeader;
    if ($[62] !== fixedWidths) {
      t17 = fixedWidths ? {
        tableLayout: "fixed"
      } : undefined;
      $[62] = fixedWidths;
      $[63] = t17;
    } else {
      t17 = $[63];
    }
    if ($[64] !== api.visibleColumns || $[65] !== hasExplicitWidths || $[66] !== lockedWidths || $[67] !== selectable) {
      t18 = hasExplicitWidths ? /*#__PURE__*/_jsxs("colgroup", {
        children: [selectable && /*#__PURE__*/_jsx("col", {}), api.visibleColumns.map(_temp9)]
      }) : lockedWidths ? /*#__PURE__*/_jsxs("colgroup", {
        children: [selectable && /*#__PURE__*/_jsx("col", {}), lockedWidths.map(_temp0)]
      }) : null;
      $[64] = api.visibleColumns;
      $[65] = hasExplicitWidths;
      $[66] = lockedWidths;
      $[67] = selectable;
      $[68] = t18;
    } else {
      t18 = $[68];
    }
    let t23;
    if ($[69] !== api || $[70] !== selectable) {
      t23 = selectable && /*#__PURE__*/_jsx(TableCell, {
        variant: "head",
        padding: "checkbox",
        children: /*#__PURE__*/_jsx(Checkbox, {
          checked: api.allSelected,
          indeterminate: api.someSelected && !api.allSelected,
          onChange: () => api.toggleSelectAll(),
          "aria-label": "Select all rows"
        })
      });
      $[69] = api;
      $[70] = selectable;
      $[71] = t23;
    } else {
      t23 = $[71];
    }
    let t24;
    if ($[72] !== api) {
      t24 = api.visibleColumns.map(col_3 => /*#__PURE__*/_jsx(TableCell, {
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
      $[72] = api;
      $[73] = t24;
    } else {
      t24 = $[73];
    }
    if ($[74] !== t23 || $[75] !== t24) {
      t19 = /*#__PURE__*/_jsx(TableHead, {
        children: /*#__PURE__*/_jsxs(TableRow, {
          children: [t23, t24]
        })
      });
      $[74] = t23;
      $[75] = t24;
      $[76] = t19;
    } else {
      t19 = $[76];
    }
    T0 = TableBody;
    t14 = items.length === 0 ? /*#__PURE__*/_jsx(SkeletonRows, {
      count: Math.min(api.pagination.pageSize, SKELETON_ROWS),
      selectable: selectable
    }) : infiniteScroll ? /*#__PURE__*/_jsx(VirtualRows, {
      count: items.length,
      scrollRef: containerRef,
      view: view,
      snapshot: snapshot,
      rowHeight: rowHeight || ESTIMATED_ROW_HEIGHT,
      offset: headHeight,
      colSpan: colSpan,
      render: renderItem
    }) : items.map((_, index_1) => renderItem(index_1));
    $[35] = api;
    $[36] = colSpan;
    $[37] = fixedWidths;
    $[38] = hasExplicitWidths;
    $[39] = headHeight;
    $[40] = infiniteScroll;
    $[41] = items;
    $[42] = lockedWidths;
    $[43] = onRowClick;
    $[44] = onRowIntent;
    $[45] = rowClass;
    $[46] = rowHeight;
    $[47] = selectable;
    $[48] = stickyHeader;
    $[49] = view;
    $[50] = T0;
    $[51] = T1;
    $[52] = T2;
    $[53] = t14;
    $[54] = t15;
    $[55] = t16;
    $[56] = t17;
    $[57] = t18;
    $[58] = t19;
    $[59] = t20;
    $[60] = t21;
    $[61] = t22;
  } else {
    T0 = $[50];
    T1 = $[51];
    T2 = $[52];
    t14 = $[53];
    t15 = $[54];
    t16 = $[55];
    t17 = $[56];
    t18 = $[57];
    t19 = $[58];
    t20 = $[59];
    t21 = $[60];
    t22 = $[61];
  }
  let t23;
  if ($[77] !== api.hasMore || $[78] !== colSpan || $[79] !== infiniteScroll || $[80] !== selectable) {
    t23 = infiniteScroll && api.hasMore && /*#__PURE__*/_jsx(ScrollEnd, {
      colSpan: colSpan,
      selectable: selectable
    });
    $[77] = api.hasMore;
    $[78] = colSpan;
    $[79] = infiniteScroll;
    $[80] = selectable;
    $[81] = t23;
  } else {
    t23 = $[81];
  }
  let t24;
  if ($[82] !== T0 || $[83] !== t14 || $[84] !== t23) {
    t24 = /*#__PURE__*/_jsxs(T0, {
      children: [t14, t23]
    });
    $[82] = T0;
    $[83] = t14;
    $[84] = t23;
    $[85] = t24;
  } else {
    t24 = $[85];
  }
  let t25;
  if ($[86] !== T1 || $[87] !== t15 || $[88] !== t16 || $[89] !== t17 || $[90] !== t18 || $[91] !== t19 || $[92] !== t24) {
    t25 = /*#__PURE__*/_jsxs(T1, {
      size: t15,
      stickyHeader: t16,
      sx: t17,
      children: [t18, t19, t24]
    });
    $[86] = T1;
    $[87] = t15;
    $[88] = t16;
    $[89] = t17;
    $[90] = t18;
    $[91] = t19;
    $[92] = t24;
    $[93] = t25;
  } else {
    t25 = $[93];
  }
  let t26;
  if ($[94] !== T2 || $[95] !== t20 || $[96] !== t21 || $[97] !== t22 || $[98] !== t25) {
    t26 = /*#__PURE__*/_jsx(T2, {
      ref: t20,
      "data-scroll-root": t21,
      sx: t22,
      children: t25
    });
    $[94] = T2;
    $[95] = t20;
    $[96] = t21;
    $[97] = t22;
    $[98] = t25;
    $[99] = t26;
  } else {
    t26 = $[99];
  }
  return t26;
}
function _temp0(width, index_0) {
  return /*#__PURE__*/_jsx("col", {
    style: {
      width
    }
  }, index_0);
}
function _temp9(col_2) {
  return /*#__PURE__*/_jsx("col", {
    style: col_2.width ? {
      width: col_2.width
    } : undefined
  }, col_2.field);
}
function _temp8(theme) {
  return {
    flex: "1 1 0",
    minHeight: `calc(${theme.vars.size.row} * 4)`,
    overflowY: "auto",
    contain: "size"
  };
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
  return [];
}
function _temp3(col_0) {
  return col_0.field;
}
function _temp2(col) {
  return col.width;
}
/** Only the rows in view, plus a margin, are in the document; spacer rows stand in for the rest so the scrollbar stays true. */
function VirtualRows({
  count,
  scrollRef,
  view,
  snapshot,
  rowHeight,
  offset,
  colSpan,
  render
}) {
  'use no memo';

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollRef.current,
    initialOffset: view?.top,
    initialRect: view?.rect,
    initialMeasurementsCache: view?.rows,
    estimateSize: () => rowHeight,
    overscan: OVERSCAN,
    scrollMargin: offset
  });
  snapshot.current = virtualizer.takeSnapshot;
  const windowed = virtualizer.getVirtualItems();
  const above = windowed.length ? windowed[0].start - offset : 0;
  const below = virtualizer.getTotalSize() - (windowed.length ? windowed.at(-1).end - offset : 0);
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
        }), api.visibleColumns.map(_temp1)]
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
function _temp1(col) {
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
  const $ = _c(17);
  const {
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
  if ($[0] !== loadMore) {
    t1 = () => {
      const node = marker.current;
      const root = node?.closest("[data-scroll-root]");
      if (!node || !root) {
        return;
      }
      const observer = new IntersectionObserver(t2 => {
        const [entry] = t2;
        return entry?.isIntersecting && loadMore();
      }, {
        root,
        rootMargin: `0px 0px ${root.clientHeight}px 0px`
      });
      observer.observe(node);
      return () => observer.disconnect();
    };
    $[0] = loadMore;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  let t2;
  if ($[2] !== loadMore || $[3] !== rows.length) {
    t2 = [loadMore, rows.length];
    $[2] = loadMore;
    $[3] = rows.length;
    $[4] = t2;
  } else {
    t2 = $[4];
  }
  useEffect(t1, t2);
  let t3;
  let t4;
  if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = () => {
      const node_0 = marker.current;
      if (!node_0) {
        return;
      }
      const observer_0 = new IntersectionObserver(t5 => {
        const [entry_0] = t5;
        return setReached(Boolean(entry_0?.isIntersecting));
      }, {
        root: node_0.closest("[data-scroll-root]")
      });
      observer_0.observe(node_0);
      return () => observer_0.disconnect();
    };
    t4 = [];
    $[5] = t3;
    $[6] = t4;
  } else {
    t3 = $[5];
    t4 = $[6];
  }
  useEffect(t3, t4);
  let t5;
  if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
    t5 = {
      padding: 0,
      height: 1,
      border: 0
    };
    $[7] = t5;
  } else {
    t5 = $[7];
  }
  let t6;
  if ($[8] !== colSpan) {
    t6 = /*#__PURE__*/_jsx("tr", {
      ref: marker,
      "aria-hidden": "true",
      children: /*#__PURE__*/_jsx("td", {
        colSpan: colSpan,
        style: t5
      })
    });
    $[8] = colSpan;
    $[9] = t6;
  } else {
    t6 = $[9];
  }
  let t7;
  if ($[10] !== loadingMore || $[11] !== reached || $[12] !== selectable) {
    t7 = reached && loadingMore && /*#__PURE__*/_jsx(SkeletonRows, {
      count: LOADING_MORE_ROWS,
      selectable: selectable
    });
    $[10] = loadingMore;
    $[11] = reached;
    $[12] = selectable;
    $[13] = t7;
  } else {
    t7 = $[13];
  }
  let t8;
  if ($[14] !== t6 || $[15] !== t7) {
    t8 = /*#__PURE__*/_jsxs(_Fragment, {
      children: [t6, t7]
    });
    $[14] = t6;
    $[15] = t7;
    $[16] = t8;
  } else {
    t8 = $[16];
  }
  return t8;
}