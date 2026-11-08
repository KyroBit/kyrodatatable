import { c as _c } from "react/compiler-runtime";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box, Button, Checkbox, IconButton, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useDataTableContext } from './context.js';
import { countFilterValues } from '@kyrobit/datatable';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
  const t1 = active ? "text.primary" : "action.disabled";
  let t2;
  if ($[0] !== t1) {
    t2 = {
      display: "block",
      fill: "none",
      color: t1,
      transition: "color 0.15s"
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
    t4 = /*#__PURE__*/_jsx(Box, {
      component: "svg",
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
      gap: "2px",
      ml: 0.75,
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
      gap: 0.25,
      flex: "none"
    };
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  let t3;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = {
      fontSize: 12,
      color: "text.secondary",
      fontVariantNumeric: "tabular-nums",
      mr: 0.5
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
    t7 = /*#__PURE__*/_jsx(KeyboardArrowLeftIcon, {
      sx: {
        fontSize: 18
      }
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
    t11 = /*#__PURE__*/_jsx(KeyboardArrowRightIcon, {
      sx: {
        fontSize: 18
      }
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
const ROW_INTENT_DELAY = 80;
const SKELETON_DELAY = 150;
/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export function DataTableBody(t0) {
  const $ = _c(57);
  const {
    onRowClick,
    onRowIntent,
    emptyMessage: t1,
    noResultsMessage: t2,
    errorMessage,
    selectable: t3,
    stickyHeader: t4,
    rowClass
  } = t0;
  const emptyMessage = t1 === undefined ? "No records found." : t1;
  const noResultsMessage = t2 === undefined ? "No records match your search." : t2;
  const selectable = t3 === undefined ? false : t3;
  const stickyHeader = t4 === undefined ? true : t4;
  const api = useDataTableContext();
  const items = api.visibleItems;
  const colSpan = api.visibleColumns.length + (selectable ? 1 : 0);
  const fetching = api.loading || api.groupsLoading;
  let t5;
  if ($[0] !== api.visibleColumns) {
    t5 = api.visibleColumns.some(_temp2);
    $[0] = api.visibleColumns;
    $[1] = t5;
  } else {
    t5 = $[1];
  }
  const hasExplicitWidths = t5;
  const intentTimer = useRef(undefined);
  const containerRef = useRef(null);
  const {
    page,
    pageSize
  } = api.pagination;
  let t6;
  let t7;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = () => () => clearTimeout(intentTimer.current);
    t7 = [];
    $[2] = t6;
    $[3] = t7;
  } else {
    t6 = $[2];
    t7 = $[3];
  }
  useEffect(t6, t7);
  let t8;
  if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = () => {
      containerRef.current?.scrollTo({
        top: 0
      });
    };
    $[4] = t8;
  } else {
    t8 = $[4];
  }
  let t9;
  if ($[5] !== api.filters || $[6] !== api.groupBy || $[7] !== api.search || $[8] !== api.sort || $[9] !== page || $[10] !== pageSize) {
    t9 = [page, pageSize, api.search, api.sort, api.filters, api.groupBy];
    $[5] = api.filters;
    $[6] = api.groupBy;
    $[7] = api.search;
    $[8] = api.sort;
    $[9] = page;
    $[10] = pageSize;
    $[11] = t9;
  } else {
    t9 = $[11];
  }
  useLayoutEffect(t8, t9);
  if (items.length === 0 && !fetching) {
    let t10;
    if ($[12] !== api.filters || $[13] !== api.search) {
      t10 = Boolean(api.search) || countFilterValues(api.filters ?? {}) > 0;
      $[12] = api.filters;
      $[13] = api.search;
      $[14] = t10;
    } else {
      t10 = $[14];
    }
    const filtered = t10;
    let t11;
    if ($[15] !== api || $[16] !== emptyMessage || $[17] !== errorMessage || $[18] !== filtered || $[19] !== noResultsMessage) {
      t11 = api.error ? errorMessage ?? /*#__PURE__*/_jsxs(Box, {
        sx: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          py: 6
        },
        children: [/*#__PURE__*/_jsx(Typography, {
          sx: {
            color: "text.secondary"
          },
          children: "These records could not be loaded."
        }), /*#__PURE__*/_jsx(Button, {
          variant: "outlined",
          color: "inherit",
          onClick: () => api.refetch(),
          children: "Try again"
        })]
      }) : filtered ? noResultsMessage : emptyMessage;
      $[15] = api;
      $[16] = emptyMessage;
      $[17] = errorMessage;
      $[18] = filtered;
      $[19] = noResultsMessage;
      $[20] = t11;
    } else {
      t11 = $[20];
    }
    const message = t11;
    let t12;
    if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
      t12 = {
        flex: "1 1 auto",
        py: 4
      };
      $[21] = t12;
    } else {
      t12 = $[21];
    }
    let t13;
    if ($[22] !== message) {
      t13 = typeof message === "string" ? /*#__PURE__*/_jsx(Typography, {
        sx: {
          color: "text.secondary",
          textAlign: "center",
          py: 6
        },
        children: message
      }) : message;
      $[22] = message;
      $[23] = t13;
    } else {
      t13 = $[23];
    }
    let t14;
    if ($[24] !== t13) {
      t14 = /*#__PURE__*/_jsx(Box, {
        className: "KyroTable-empty",
        sx: t12,
        children: t13
      });
      $[24] = t13;
      $[25] = t14;
    } else {
      t14 = $[25];
    }
    return t14;
  }
  let t10;
  if ($[26] === Symbol.for("react.memo_cache_sentinel")) {
    t10 = {
      flex: "1 1 auto",
      minHeight: 0
    };
    $[26] = t10;
  } else {
    t10 = $[26];
  }
  let t11;
  if ($[27] !== hasExplicitWidths) {
    t11 = hasExplicitWidths ? {
      tableLayout: "fixed"
    } : undefined;
    $[27] = hasExplicitWidths;
    $[28] = t11;
  } else {
    t11 = $[28];
  }
  let t12;
  if ($[29] !== api.visibleColumns || $[30] !== hasExplicitWidths || $[31] !== selectable) {
    t12 = hasExplicitWidths && /*#__PURE__*/_jsxs("colgroup", {
      children: [selectable && /*#__PURE__*/_jsx("col", {}), api.visibleColumns.map(_temp3)]
    });
    $[29] = api.visibleColumns;
    $[30] = hasExplicitWidths;
    $[31] = selectable;
    $[32] = t12;
  } else {
    t12 = $[32];
  }
  let t13;
  if ($[33] !== api || $[34] !== selectable) {
    t13 = selectable && /*#__PURE__*/_jsx(TableCell, {
      padding: "checkbox",
      children: /*#__PURE__*/_jsx(Checkbox, {
        size: "small",
        checked: api.allVisibleSelected,
        indeterminate: api.someVisibleSelected && !api.allVisibleSelected,
        onChange: () => api.toggleSelectAll(),
        slotProps: {
          input: {
            "aria-label": "Select all rows"
          }
        }
      })
    });
    $[33] = api;
    $[34] = selectable;
    $[35] = t13;
  } else {
    t13 = $[35];
  }
  let t14;
  if ($[36] !== api) {
    t14 = api.visibleColumns.map(col_1 => /*#__PURE__*/_jsx(TableCell, {
      align: col_1.align,
      sortDirection: api.sort?.field === col_1.field ? api.sort.direction : false,
      onClick: col_1.sortable === false ? undefined : () => api.toggleSort(col_1.field),
      sx: col_1.sortable === false ? undefined : {
        cursor: "pointer",
        userSelect: "none",
        "&:hover": {
          color: "text.primary"
        }
      },
      children: col_1.sortable === false ? col_1.headerName : /*#__PURE__*/_jsxs(Box, {
        component: "button",
        type: "button",
        className: "KyroTable-sortButton",
        sx: {
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
          whiteSpace: "nowrap",
          "&:hover": {
            color: "text.primary"
          }
        },
        children: [col_1.headerName, /*#__PURE__*/_jsx(SortArrows, {
          direction: api.sort?.field === col_1.field ? api.sort.direction : null
        })]
      })
    }, col_1.field));
    $[36] = api;
    $[37] = t14;
  } else {
    t14 = $[37];
  }
  let t15;
  if ($[38] !== t13 || $[39] !== t14) {
    t15 = /*#__PURE__*/_jsx(TableHead, {
      children: /*#__PURE__*/_jsxs(TableRow, {
        children: [t13, t14]
      })
    });
    $[38] = t13;
    $[39] = t14;
    $[40] = t15;
  } else {
    t15 = $[40];
  }
  let t16;
  if ($[41] !== api || $[42] !== colSpan || $[43] !== items || $[44] !== onRowClick || $[45] !== onRowIntent || $[46] !== rowClass || $[47] !== selectable) {
    t16 = items.length === 0 ? /*#__PURE__*/_jsx(SkeletonRows, {
      count: Math.min(api.pagination.pageSize, SKELETON_ROWS),
      selectable: selectable
    }) : items.map(item => {
      if (item.type === "group") {
        return /*#__PURE__*/_jsx(TableRow, {
          className: "KyroTable-groupRow",
          onClick: () => api.toggleGroup(item.id),
          sx: {
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
                gap: 1,
                pl: item.depth * 3
              },
              children: [/*#__PURE__*/_jsxs(Box, {
                sx: {
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: 0
                },
                children: [item.expanded ? /*#__PURE__*/_jsx(KeyboardArrowDownIcon, {
                  sx: {
                    fontSize: 18,
                    color: "text.secondary"
                  }
                }) : /*#__PURE__*/_jsx(KeyboardArrowRightIcon, {
                  sx: {
                    fontSize: 18,
                    color: "text.secondary"
                  }
                }), selectable && item.expanded && /*#__PURE__*/_jsx(Checkbox, {
                  size: "small",
                  sx: {
                    p: 0.25,
                    ml: -0.5
                  },
                  onClick: _temp4,
                  checked: api.groupAllSelected(item.id),
                  indeterminate: api.groupSomeSelected(item.id) && !api.groupAllSelected(item.id),
                  onChange: () => api.toggleSelectGroup(item.id),
                  slotProps: {
                    input: {
                      "aria-label": `Select all rows in ${item.group.label}`
                    }
                  }
                }), /*#__PURE__*/_jsx(Typography, {
                  component: "span",
                  sx: {
                    fontSize: "inherit",
                    fontWeight: 600,
                    color: "text.primary"
                  },
                  children: item.group.label
                }), /*#__PURE__*/_jsx(Box, {
                  component: "span",
                  className: "KyroTable-groupCount",
                  sx: {
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: 1,
                    px: 1,
                    py: "3px",
                    borderRadius: 999,
                    bgcolor: "action.selected",
                    color: "text.secondary"
                  },
                  children: item.group.count
                }), api.groupLoading(item.id) && api.groupRows(item.id).length === 0 && /*#__PURE__*/_jsx(Box, {
                  component: "span",
                  sx: {
                    color: "text.secondary",
                    fontSize: 12
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
      const row = item.row;
      const rowId = api.getRowId(row);
      const classes = [item.type === "group-row" ? "KyroTable-groupChildRow" : "", rowClass ? rowClass(row) : ""].filter(Boolean).join(" ");
      return /*#__PURE__*/_jsxs(TableRow, {
        hover: true,
        selected: selectable && api.isSelected(rowId),
        className: classes || undefined,
        sx: {
          cursor: onRowClick ? "pointer" : undefined
        },
        onClick: () => onRowClick?.(row),
        tabIndex: onRowIntent ? 0 : undefined,
        onPointerEnter: onRowIntent && (() => {
          clearTimeout(intentTimer.current);
          intentTimer.current = setTimeout(() => onRowIntent(row), ROW_INTENT_DELAY);
        }),
        onPointerLeave: onRowIntent && (() => clearTimeout(intentTimer.current)),
        onFocus: onRowIntent && (event => event.target === event.currentTarget && onRowIntent(row)),
        children: [selectable && /*#__PURE__*/_jsx(TableCell, {
          padding: "checkbox",
          onClick: _temp5,
          children: /*#__PURE__*/_jsx(Checkbox, {
            size: "small",
            checked: api.isSelected(rowId),
            onChange: () => api.toggleSelected(rowId),
            slotProps: {
              input: {
                "aria-label": "Select row"
              }
            }
          })
        }), api.visibleColumns.map(col_2 => /*#__PURE__*/_jsx(TableCell, {
          align: col_2.align,
          children: col_2.render ? col_2.render(row) : row[col_2.field]
        }, col_2.field))]
      }, rowId);
    });
    $[41] = api;
    $[42] = colSpan;
    $[43] = items;
    $[44] = onRowClick;
    $[45] = onRowIntent;
    $[46] = rowClass;
    $[47] = selectable;
    $[48] = t16;
  } else {
    t16 = $[48];
  }
  let t17;
  if ($[49] !== t16) {
    t17 = /*#__PURE__*/_jsx(TableBody, {
      children: t16
    });
    $[49] = t16;
    $[50] = t17;
  } else {
    t17 = $[50];
  }
  let t18;
  if ($[51] !== stickyHeader || $[52] !== t11 || $[53] !== t12 || $[54] !== t15 || $[55] !== t17) {
    t18 = /*#__PURE__*/_jsx(TableContainer, {
      ref: containerRef,
      sx: t10,
      children: /*#__PURE__*/_jsxs(Table, {
        size: "small",
        stickyHeader: stickyHeader,
        sx: t11,
        children: [t12, t15, t17]
      })
    });
    $[51] = stickyHeader;
    $[52] = t11;
    $[53] = t12;
    $[54] = t15;
    $[55] = t17;
    $[56] = t18;
  } else {
    t18 = $[56];
  }
  return t18;
}
function _temp5(e_0) {
  return e_0.stopPropagation();
}
function _temp4(e) {
  return e.stopPropagation();
}
function _temp3(col_0) {
  return /*#__PURE__*/_jsx("col", {
    style: col_0.width ? {
      width: col_0.width
    } : undefined
  }, col_0.field);
}
function _temp2(col) {
  return col.width;
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
        }), api.visibleColumns.map(_temp6)]
      }, index);
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
function _temp6(col) {
  return /*#__PURE__*/_jsx(TableCell, {
    align: col.align,
    children: /*#__PURE__*/_jsx(Skeleton, {
      variant: "rounded",
      animation: "wave",
      sx: {
        display: "inline-block",
        width: "60%",
        maxWidth: 120,
        height: 12,
        borderRadius: 999
      }
    })
  }, col.field);
}