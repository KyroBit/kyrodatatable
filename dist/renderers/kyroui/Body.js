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
    groupKey,
    api
  } = t0;
  let t1;
  if ($[0] !== api || $[1] !== groupKey) {
    t1 = api.groupPagination(groupKey);
    $[0] = api;
    $[1] = groupKey;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  const pagination = t1;
  const total = api.groupTotal(groupKey);
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
  if ($[9] !== api || $[10] !== groupKey || $[11] !== pagination.page) {
    t6 = () => api.setGroupPage(groupKey, pagination.page - 1);
    $[9] = api;
    $[10] = groupKey;
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
  if ($[17] !== api || $[18] !== groupKey || $[19] !== pagination.page) {
    t10 = () => api.setGroupPage(groupKey, pagination.page + 1);
    $[17] = api;
    $[18] = groupKey;
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
const SCROLL_END_THRESHOLD = 80;
const ESTIMATED_ROW_HEIGHT = 41;
const OVERSCAN = 10;
const ROW_INTENT_DELAY = 80;
const SKELETON_DELAY = 150;
/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export function DataTableBody(t0) {
  const $ = _c(104);
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
  const {
    page,
    pageSize
  } = api.pagination;
  let t8;
  let t9;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = () => () => clearTimeout(intentTimer.current);
    t9 = [];
    $[4] = t8;
    $[5] = t9;
  } else {
    t8 = $[4];
    t9 = $[5];
  }
  useEffect(t8, t9);
  let t10;
  if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = () => {
      containerRef.current?.scrollTo({
        top: 0
      });
    };
    $[6] = t10;
  } else {
    t10 = $[6];
  }
  let t11;
  if ($[7] !== api.filters || $[8] !== api.groupBy || $[9] !== api.search || $[10] !== api.sort || $[11] !== page || $[12] !== pageSize) {
    t11 = [page, pageSize, api.search, api.sort, api.filters, api.groupBy];
    $[7] = api.filters;
    $[8] = api.groupBy;
    $[9] = api.search;
    $[10] = api.sort;
    $[11] = page;
    $[12] = pageSize;
    $[13] = t11;
  } else {
    t11 = $[13];
  }
  useLayoutEffect(t10, t11);
  let t12;
  if ($[14] !== columnsKey || $[15] !== hasExplicitWidths || $[16] !== headHeight || $[17] !== lockedWidths || $[18] !== rowHeight || $[19] !== selectable) {
    t12 = () => {
      const container = containerRef.current;
      if (!container) {
        return;
      }
      const head = container.querySelector("thead")?.getBoundingClientRect().height ?? 0;
      const rows = Array.from(container.querySelectorAll("tbody tr[data-row]"));
      const tallest = Math.max(0, ...rows.map(_temp4));
      if (head > headHeight) {
        setHeadHeight(head);
      }
      if (tallest > rowHeight) {
        setRowHeight(tallest);
      }
      if (hasExplicitWidths || lockedWidths || !rows.length) {
        return;
      }
      const table = container.querySelector("table").getBoundingClientRect().width;
      const cells = Array.from(container.querySelectorAll("thead th")).slice(selectable ? 1 : 0);
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
    $[20] = t12;
  } else {
    t12 = $[20];
  }
  useLayoutEffect(t12);
  const fixedWidths = hasExplicitWidths || lockedWidths !== null;
  if (items.length === 0 && !fetching) {
    let t13;
    if ($[21] !== api.filters || $[22] !== api.search) {
      t13 = Boolean(api.search) || countFilterValues(api.filters ?? {}) > 0;
      $[21] = api.filters;
      $[22] = api.search;
      $[23] = t13;
    } else {
      t13 = $[23];
    }
    const filtered = t13;
    let t14;
    if ($[24] !== api || $[25] !== emptyMessage || $[26] !== errorMessage || $[27] !== filtered || $[28] !== noResultsMessage) {
      t14 = api.error ? errorMessage ?? /*#__PURE__*/_jsxs(Box, {
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
      $[29] = t14;
    } else {
      t14 = $[29];
    }
    const message = t14;
    let t15;
    if ($[30] === Symbol.for("react.memo_cache_sentinel")) {
      t15 = {
        flex: 1,
        py: "xl"
      };
      $[30] = t15;
    } else {
      t15 = $[30];
    }
    let t16;
    if ($[31] !== message) {
      t16 = typeof message === "string" ? /*#__PURE__*/_jsx(Typography, {
        sx: {
          color: "text.secondary",
          textAlign: "center",
          py: "xl"
        },
        children: message
      }) : message;
      $[31] = message;
      $[32] = t16;
    } else {
      t16 = $[32];
    }
    let t17;
    if ($[33] !== t16) {
      t17 = /*#__PURE__*/_jsx(Box, {
        className: "KyroTable-empty",
        sx: t15,
        children: t16
      });
      $[33] = t16;
      $[34] = t17;
    } else {
      t17 = $[34];
    }
    return t17;
  }
  let T0;
  let T1;
  let T2;
  let t13;
  let t14;
  let t15;
  let t16;
  let t17;
  let t18;
  let t19;
  let t20;
  let t21;
  if ($[35] !== api || $[36] !== colSpan || $[37] !== fixedWidths || $[38] !== hasExplicitWidths || $[39] !== headHeight || $[40] !== infiniteScroll || $[41] !== items || $[42] !== lockedWidths || $[43] !== onRowClick || $[44] !== onRowIntent || $[45] !== rowClass || $[46] !== rowHeight || $[47] !== selectable || $[48] !== stickyHeader) {
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
          onClick: () => api.toggleGroup(item.group.key),
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
                gap: "sm"
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
                }), selectable && item.expanded && /*#__PURE__*/_jsx(Box, {
                  component: "span",
                  sx: {
                    display: "inline-flex"
                  },
                  onClick: _temp5,
                  children: /*#__PURE__*/_jsx(Checkbox, {
                    checked: api.groupAllSelected(item.group.key),
                    indeterminate: api.groupSomeSelected(item.group.key) && !api.groupAllSelected(item.group.key),
                    onChange: () => api.toggleSelectGroup(item.group.key),
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
                    bgcolor: "background.surfaceHover",
                    color: "text.secondary"
                  },
                  children: item.group.count
                }), api.groupLoading(item.group.key) && api.groupRows(item.group.key).length === 0 && /*#__PURE__*/_jsx(Box, {
                  component: "span",
                  sx: {
                    color: "text.secondary",
                    fontSize: "sm"
                  },
                  children: "loading\u2026"
                })]
              }), item.expanded && /*#__PURE__*/_jsx(GroupPager, {
                groupKey: item.group.key,
                api: api
              })]
            })
          })
        }, `group-${item.group.key}`);
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
          onClick: _temp6,
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
    t19 = containerRef;
    t20 = "";
    t21 = _temp7;
    T1 = Table;
    t14 = "small";
    t15 = stickyHeader;
    if ($[61] !== fixedWidths) {
      t16 = fixedWidths ? {
        tableLayout: "fixed"
      } : undefined;
      $[61] = fixedWidths;
      $[62] = t16;
    } else {
      t16 = $[62];
    }
    if ($[63] !== api.visibleColumns || $[64] !== hasExplicitWidths || $[65] !== lockedWidths || $[66] !== selectable) {
      t17 = hasExplicitWidths ? /*#__PURE__*/_jsxs("colgroup", {
        children: [selectable && /*#__PURE__*/_jsx("col", {}), api.visibleColumns.map(_temp8)]
      }) : lockedWidths ? /*#__PURE__*/_jsxs("colgroup", {
        children: [selectable && /*#__PURE__*/_jsx("col", {}), lockedWidths.map(_temp9)]
      }) : null;
      $[63] = api.visibleColumns;
      $[64] = hasExplicitWidths;
      $[65] = lockedWidths;
      $[66] = selectable;
      $[67] = t17;
    } else {
      t17 = $[67];
    }
    let t22;
    if ($[68] !== api || $[69] !== selectable) {
      t22 = selectable && /*#__PURE__*/_jsx(TableCell, {
        variant: "head",
        padding: "checkbox",
        children: /*#__PURE__*/_jsx(Checkbox, {
          checked: api.allVisibleSelected,
          indeterminate: api.someVisibleSelected && !api.allVisibleSelected,
          onChange: () => api.toggleSelectAll(),
          "aria-label": "Select all rows"
        })
      });
      $[68] = api;
      $[69] = selectable;
      $[70] = t22;
    } else {
      t22 = $[70];
    }
    let t23;
    if ($[71] !== api) {
      t23 = api.visibleColumns.map(col_3 => /*#__PURE__*/_jsx(TableCell, {
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
      $[71] = api;
      $[72] = t23;
    } else {
      t23 = $[72];
    }
    if ($[73] !== t22 || $[74] !== t23) {
      t18 = /*#__PURE__*/_jsx(TableHead, {
        children: /*#__PURE__*/_jsxs(TableRow, {
          children: [t22, t23]
        })
      });
      $[73] = t22;
      $[74] = t23;
      $[75] = t18;
    } else {
      t18 = $[75];
    }
    T0 = TableBody;
    t13 = items.length === 0 ? /*#__PURE__*/_jsx(SkeletonRows, {
      count: Math.min(api.pagination.pageSize, SKELETON_ROWS),
      selectable: selectable
    }) : infiniteScroll ? /*#__PURE__*/_jsx(VirtualRows, {
      count: items.length,
      scrollRef: containerRef,
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
    $[49] = T0;
    $[50] = T1;
    $[51] = T2;
    $[52] = t13;
    $[53] = t14;
    $[54] = t15;
    $[55] = t16;
    $[56] = t17;
    $[57] = t18;
    $[58] = t19;
    $[59] = t20;
    $[60] = t21;
  } else {
    T0 = $[49];
    T1 = $[50];
    T2 = $[51];
    t13 = $[52];
    t14 = $[53];
    t15 = $[54];
    t16 = $[55];
    t17 = $[56];
    t18 = $[57];
    t19 = $[58];
    t20 = $[59];
    t21 = $[60];
  }
  let t22;
  if ($[76] !== api.loadingMore || $[77] !== infiniteScroll || $[78] !== selectable) {
    t22 = infiniteScroll && api.loadingMore && /*#__PURE__*/_jsx(SkeletonRows, {
      count: LOADING_MORE_ROWS,
      selectable: selectable
    });
    $[76] = api.loadingMore;
    $[77] = infiniteScroll;
    $[78] = selectable;
    $[79] = t22;
  } else {
    t22 = $[79];
  }
  let t23;
  if ($[80] !== api.hasMore || $[81] !== api.loadingMore || $[82] !== colSpan || $[83] !== infiniteScroll) {
    t23 = infiniteScroll && api.hasMore && !api.loadingMore && /*#__PURE__*/_jsx(ScrollEnd, {
      colSpan: colSpan
    });
    $[80] = api.hasMore;
    $[81] = api.loadingMore;
    $[82] = colSpan;
    $[83] = infiniteScroll;
    $[84] = t23;
  } else {
    t23 = $[84];
  }
  let t24;
  if ($[85] !== T0 || $[86] !== t13 || $[87] !== t22 || $[88] !== t23) {
    t24 = /*#__PURE__*/_jsxs(T0, {
      children: [t13, t22, t23]
    });
    $[85] = T0;
    $[86] = t13;
    $[87] = t22;
    $[88] = t23;
    $[89] = t24;
  } else {
    t24 = $[89];
  }
  let t25;
  if ($[90] !== T1 || $[91] !== t14 || $[92] !== t15 || $[93] !== t16 || $[94] !== t17 || $[95] !== t18 || $[96] !== t24) {
    t25 = /*#__PURE__*/_jsxs(T1, {
      size: t14,
      stickyHeader: t15,
      sx: t16,
      children: [t17, t18, t24]
    });
    $[90] = T1;
    $[91] = t14;
    $[92] = t15;
    $[93] = t16;
    $[94] = t17;
    $[95] = t18;
    $[96] = t24;
    $[97] = t25;
  } else {
    t25 = $[97];
  }
  let t26;
  if ($[98] !== T2 || $[99] !== t19 || $[100] !== t20 || $[101] !== t21 || $[102] !== t25) {
    t26 = /*#__PURE__*/_jsx(T2, {
      ref: t19,
      "data-scroll-root": t20,
      sx: t21,
      children: t25
    });
    $[98] = T2;
    $[99] = t19;
    $[100] = t20;
    $[101] = t21;
    $[102] = t25;
    $[103] = t26;
  } else {
    t26 = $[103];
  }
  return t26;
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
function _temp7(theme) {
  return {
    flex: "1 1 0",
    minHeight: `calc(${theme.vars.size.row} * 4)`,
    overflowY: "auto",
    contain: "size"
  };
}
function _temp6(e_0) {
  return e_0.stopPropagation();
}
function _temp5(e) {
  return e.stopPropagation();
}
function _temp4(row) {
  return row.getBoundingClientRect().height;
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
  rowHeight,
  offset,
  colSpan,
  render
}) {
  'use no memo';

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => rowHeight,
    overscan: OVERSCAN,
    scrollMargin: offset
  });
  const windowed = virtualizer.getVirtualItems();
  const above = windowed.length ? windowed[0].start - offset : 0;
  const below = windowed.length ? virtualizer.getTotalSize() - (windowed.at(-1).end - offset) : 0;
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

/** An invisible last row; reaching within MUI's default 80px of it asks for the next page. Re-arms after each page, so one that still leaves it in view keeps loading. */
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
  const $ = _c(8);
  const {
    colSpan
  } = t0;
  const api = useDataTableContext();
  const marker = useRef(null);
  const {
    loadMore,
    rows
  } = api;
  let t1;
  if ($[0] !== loadMore) {
    t1 = () => {
      const node = marker.current;
      if (!node) {
        return;
      }
      const observer = new IntersectionObserver(t2 => {
        const [entry] = t2;
        return entry?.isIntersecting && loadMore();
      }, {
        root: node.closest("[data-scroll-root]"),
        rootMargin: `0px 0px ${SCROLL_END_THRESHOLD}px 0px`
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
  if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = {
      padding: 0,
      height: 1,
      border: 0
    };
    $[5] = t3;
  } else {
    t3 = $[5];
  }
  let t4;
  if ($[6] !== colSpan) {
    t4 = /*#__PURE__*/_jsx("tr", {
      ref: marker,
      "aria-hidden": "true",
      children: /*#__PURE__*/_jsx("td", {
        colSpan: colSpan,
        style: t3
      })
    });
    $[6] = colSpan;
    $[7] = t4;
  } else {
    t4 = $[7];
  }
  return t4;
}