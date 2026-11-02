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
  const t1 = active ? "text.primary" : "text.disabled";
  let t2;
  if ($[0] !== t1) {
    t2 = {
      display: "block",
      fill: "none",
      color: t1,
      transition: "color var(--kyro-duration-fast)"
    };
    $[0] = t1;
    $[1] = t2;
  } else {
    t2 = $[1];
  }
  let t3;
  if ($[2] !== points) {
    t3 = /*#__PURE__*/_jsx("path", {
      d: points,
      stroke: "currentColor",
      strokeWidth: 2.5,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    });
    $[2] = points;
    $[3] = t3;
  } else {
    t3 = $[3];
  }
  let t4;
  if ($[4] !== t2 || $[5] !== t3) {
    t4 = /*#__PURE__*/_jsx(SvgIcon, {
      width: 11,
      height: 7,
      viewBox: "0 0 24 14",
      sx: t2,
      children: t3
    });
    $[4] = t2;
    $[5] = t3;
    $[6] = t4;
  } else {
    t4 = $[6];
  }
  return t4;
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
  const $ = _c(96);
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
  if ($[6] !== columnsKey || $[7] !== hasExplicitWidths || $[8] !== headHeight || $[9] !== lockedWidths || $[10] !== rowHeight) {
    t10 = () => {
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
      const cells = Array.from(container.querySelectorAll("thead th"));
      setLocked({
        key: columnsKey,
        widths: cells.map(cell => `${cell.getBoundingClientRect().width / table * 100}%`)
      });
    };
    $[6] = columnsKey;
    $[7] = hasExplicitWidths;
    $[8] = headHeight;
    $[9] = lockedWidths;
    $[10] = rowHeight;
    $[11] = t10;
  } else {
    t10 = $[11];
  }
  useLayoutEffect(t10);
  const fixedWidths = hasExplicitWidths || lockedWidths !== null;
  if (items.length === 0 && !fetching) {
    let t11;
    if ($[12] !== api.filters || $[13] !== api.search) {
      t11 = Boolean(api.search) || countFilterValues(api.filters ?? {}) > 0;
      $[12] = api.filters;
      $[13] = api.search;
      $[14] = t11;
    } else {
      t11 = $[14];
    }
    const filtered = t11;
    let t12;
    if ($[15] !== api || $[16] !== emptyMessage || $[17] !== errorMessage || $[18] !== filtered || $[19] !== noResultsMessage) {
      t12 = api.error ? errorMessage ?? /*#__PURE__*/_jsxs(Box, {
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
      $[15] = api;
      $[16] = emptyMessage;
      $[17] = errorMessage;
      $[18] = filtered;
      $[19] = noResultsMessage;
      $[20] = t12;
    } else {
      t12 = $[20];
    }
    const message = t12;
    let t13;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
      t13 = {
        flex: 1,
        py: "xl"
      };
      $[21] = t13;
    } else {
      t13 = $[21];
    }
    let t14;
    if ($[22] !== message) {
      t14 = typeof message === "string" ? /*#__PURE__*/_jsx(Typography, {
        sx: {
          color: "text.secondary",
          textAlign: "center",
          py: "xl"
        },
        children: message
      }) : message;
      $[22] = message;
      $[23] = t14;
    } else {
      t14 = $[23];
    }
    let t15;
    if ($[24] !== t14) {
      t15 = /*#__PURE__*/_jsx(Box, {
        className: "KyroTable-empty",
        sx: t13,
        children: t14
      });
      $[24] = t14;
      $[25] = t15;
    } else {
      t15 = $[25];
    }
    return t15;
  }
  let T0;
  let T1;
  let T2;
  let t11;
  let t12;
  let t13;
  let t14;
  let t15;
  let t16;
  let t17;
  let t18;
  let t19;
  if ($[26] !== api || $[27] !== colSpan || $[28] !== fixedWidths || $[29] !== hasExplicitWidths || $[30] !== headHeight || $[31] !== infiniteScroll || $[32] !== items || $[33] !== lockedWidths || $[34] !== onRowClick || $[35] !== onRowIntent || $[36] !== rowClass || $[37] !== rowHeight || $[38] !== selectable || $[39] !== stickyHeader) {
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
    t17 = containerRef;
    t18 = "";
    if ($[52] === Symbol.for("react.memo_cache_sentinel")) {
      t19 = {
        flex: "1 1 0",
        minHeight: "calc(var(--kyro-row-height) * 4)",
        overflowY: "auto",
        contain: "size"
      };
      $[52] = t19;
    } else {
      t19 = $[52];
    }
    T1 = Table;
    t12 = "small";
    t13 = stickyHeader;
    if ($[53] !== fixedWidths) {
      t14 = fixedWidths ? {
        tableLayout: "fixed"
      } : undefined;
      $[53] = fixedWidths;
      $[54] = t14;
    } else {
      t14 = $[54];
    }
    if ($[55] !== api.visibleColumns || $[56] !== hasExplicitWidths || $[57] !== lockedWidths || $[58] !== selectable) {
      t15 = hasExplicitWidths ? /*#__PURE__*/_jsxs("colgroup", {
        children: [selectable && /*#__PURE__*/_jsx("col", {
          style: {
            width: 48
          }
        }), api.visibleColumns.map(_temp7)]
      }) : lockedWidths ? /*#__PURE__*/_jsx("colgroup", {
        children: lockedWidths.map(_temp8)
      }) : null;
      $[55] = api.visibleColumns;
      $[56] = hasExplicitWidths;
      $[57] = lockedWidths;
      $[58] = selectable;
      $[59] = t15;
    } else {
      t15 = $[59];
    }
    let t20;
    if ($[60] !== api || $[61] !== selectable) {
      t20 = selectable && /*#__PURE__*/_jsx(TableCell, {
        variant: "head",
        children: /*#__PURE__*/_jsx(Checkbox, {
          checked: api.allVisibleSelected,
          indeterminate: api.someVisibleSelected && !api.allVisibleSelected,
          onChange: () => api.toggleSelectAll(),
          "aria-label": "Select all rows"
        })
      });
      $[60] = api;
      $[61] = selectable;
      $[62] = t20;
    } else {
      t20 = $[62];
    }
    let t21;
    if ($[63] !== api) {
      t21 = api.visibleColumns.map(col_3 => /*#__PURE__*/_jsx(TableCell, {
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
      $[63] = api;
      $[64] = t21;
    } else {
      t21 = $[64];
    }
    if ($[65] !== t20 || $[66] !== t21) {
      t16 = /*#__PURE__*/_jsx(TableHead, {
        children: /*#__PURE__*/_jsxs(TableRow, {
          children: [t20, t21]
        })
      });
      $[65] = t20;
      $[66] = t21;
      $[67] = t16;
    } else {
      t16 = $[67];
    }
    T0 = TableBody;
    t11 = items.length === 0 ? /*#__PURE__*/_jsx(SkeletonRows, {
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
    $[26] = api;
    $[27] = colSpan;
    $[28] = fixedWidths;
    $[29] = hasExplicitWidths;
    $[30] = headHeight;
    $[31] = infiniteScroll;
    $[32] = items;
    $[33] = lockedWidths;
    $[34] = onRowClick;
    $[35] = onRowIntent;
    $[36] = rowClass;
    $[37] = rowHeight;
    $[38] = selectable;
    $[39] = stickyHeader;
    $[40] = T0;
    $[41] = T1;
    $[42] = T2;
    $[43] = t11;
    $[44] = t12;
    $[45] = t13;
    $[46] = t14;
    $[47] = t15;
    $[48] = t16;
    $[49] = t17;
    $[50] = t18;
    $[51] = t19;
  } else {
    T0 = $[40];
    T1 = $[41];
    T2 = $[42];
    t11 = $[43];
    t12 = $[44];
    t13 = $[45];
    t14 = $[46];
    t15 = $[47];
    t16 = $[48];
    t17 = $[49];
    t18 = $[50];
    t19 = $[51];
  }
  let t20;
  if ($[68] !== api.loadingMore || $[69] !== infiniteScroll || $[70] !== selectable) {
    t20 = infiniteScroll && api.loadingMore && /*#__PURE__*/_jsx(SkeletonRows, {
      count: LOADING_MORE_ROWS,
      selectable: selectable
    });
    $[68] = api.loadingMore;
    $[69] = infiniteScroll;
    $[70] = selectable;
    $[71] = t20;
  } else {
    t20 = $[71];
  }
  let t21;
  if ($[72] !== api.hasMore || $[73] !== api.loadingMore || $[74] !== colSpan || $[75] !== infiniteScroll) {
    t21 = infiniteScroll && api.hasMore && !api.loadingMore && /*#__PURE__*/_jsx(ScrollEnd, {
      colSpan: colSpan
    });
    $[72] = api.hasMore;
    $[73] = api.loadingMore;
    $[74] = colSpan;
    $[75] = infiniteScroll;
    $[76] = t21;
  } else {
    t21 = $[76];
  }
  let t22;
  if ($[77] !== T0 || $[78] !== t11 || $[79] !== t20 || $[80] !== t21) {
    t22 = /*#__PURE__*/_jsxs(T0, {
      children: [t11, t20, t21]
    });
    $[77] = T0;
    $[78] = t11;
    $[79] = t20;
    $[80] = t21;
    $[81] = t22;
  } else {
    t22 = $[81];
  }
  let t23;
  if ($[82] !== T1 || $[83] !== t12 || $[84] !== t13 || $[85] !== t14 || $[86] !== t15 || $[87] !== t16 || $[88] !== t22) {
    t23 = /*#__PURE__*/_jsxs(T1, {
      size: t12,
      stickyHeader: t13,
      sx: t14,
      children: [t15, t16, t22]
    });
    $[82] = T1;
    $[83] = t12;
    $[84] = t13;
    $[85] = t14;
    $[86] = t15;
    $[87] = t16;
    $[88] = t22;
    $[89] = t23;
  } else {
    t23 = $[89];
  }
  let t24;
  if ($[90] !== T2 || $[91] !== t17 || $[92] !== t18 || $[93] !== t19 || $[94] !== t23) {
    t24 = /*#__PURE__*/_jsx(T2, {
      ref: t17,
      "data-scroll-root": t18,
      sx: t19,
      children: t23
    });
    $[90] = T2;
    $[91] = t17;
    $[92] = t18;
    $[93] = t19;
    $[94] = t23;
    $[95] = t24;
  } else {
    t24 = $[95];
  }
  return t24;
}
function _temp8(width, index_0) {
  return /*#__PURE__*/_jsx("col", {
    style: {
      width
    }
  }, index_0);
}
function _temp7(col_2) {
  return /*#__PURE__*/_jsx("col", {
    style: col_2.width ? {
      width: col_2.width
    } : undefined
  }, col_2.field);
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
        children: [selectable && /*#__PURE__*/_jsx(TableCell, {}), api.visibleColumns.map(_temp9)]
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
function _temp9(col) {
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