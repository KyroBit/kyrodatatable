import { c as _c } from "react/compiler-runtime";
import { useEffect, useRef, useState } from 'react';
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
  const $ = _c(49);
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
  if (items.length === 0 && !fetching) {
    let t8;
    if ($[4] !== api.filters || $[5] !== api.search) {
      t8 = Boolean(api.search) || countFilterValues(api.filters ?? {}) > 0;
      $[4] = api.filters;
      $[5] = api.search;
      $[6] = t8;
    } else {
      t8 = $[6];
    }
    const filtered = t8;
    let t9;
    if ($[7] !== api || $[8] !== emptyMessage || $[9] !== errorMessage || $[10] !== filtered || $[11] !== noResultsMessage) {
      t9 = api.error ? errorMessage ?? /*#__PURE__*/_jsxs(Box, {
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
      $[7] = api;
      $[8] = emptyMessage;
      $[9] = errorMessage;
      $[10] = filtered;
      $[11] = noResultsMessage;
      $[12] = t9;
    } else {
      t9 = $[12];
    }
    const message = t9;
    let t10;
    if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
      t10 = {
        flex: "1 1 auto",
        py: 4
      };
      $[13] = t10;
    } else {
      t10 = $[13];
    }
    let t11;
    if ($[14] !== message) {
      t11 = typeof message === "string" ? /*#__PURE__*/_jsx(Typography, {
        sx: {
          color: "text.secondary",
          textAlign: "center",
          py: 6
        },
        children: message
      }) : message;
      $[14] = message;
      $[15] = t11;
    } else {
      t11 = $[15];
    }
    let t12;
    if ($[16] !== t11) {
      t12 = /*#__PURE__*/_jsx(Box, {
        className: "KyroTable-empty",
        sx: t10,
        children: t11
      });
      $[16] = t11;
      $[17] = t12;
    } else {
      t12 = $[17];
    }
    return t12;
  }
  let t8;
  if ($[18] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = {
      flex: "1 1 auto",
      minHeight: 0
    };
    $[18] = t8;
  } else {
    t8 = $[18];
  }
  let t9;
  if ($[19] !== hasExplicitWidths) {
    t9 = hasExplicitWidths ? {
      tableLayout: "fixed"
    } : undefined;
    $[19] = hasExplicitWidths;
    $[20] = t9;
  } else {
    t9 = $[20];
  }
  let t10;
  if ($[21] !== api.visibleColumns || $[22] !== hasExplicitWidths || $[23] !== selectable) {
    t10 = hasExplicitWidths && /*#__PURE__*/_jsxs("colgroup", {
      children: [selectable && /*#__PURE__*/_jsx("col", {}), api.visibleColumns.map(_temp3)]
    });
    $[21] = api.visibleColumns;
    $[22] = hasExplicitWidths;
    $[23] = selectable;
    $[24] = t10;
  } else {
    t10 = $[24];
  }
  let t11;
  if ($[25] !== api || $[26] !== selectable) {
    t11 = selectable && /*#__PURE__*/_jsx(TableCell, {
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
    $[25] = api;
    $[26] = selectable;
    $[27] = t11;
  } else {
    t11 = $[27];
  }
  let t12;
  if ($[28] !== api) {
    t12 = api.visibleColumns.map(col_1 => /*#__PURE__*/_jsx(TableCell, {
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
    $[28] = api;
    $[29] = t12;
  } else {
    t12 = $[29];
  }
  let t13;
  if ($[30] !== t11 || $[31] !== t12) {
    t13 = /*#__PURE__*/_jsx(TableHead, {
      children: /*#__PURE__*/_jsxs(TableRow, {
        children: [t11, t12]
      })
    });
    $[30] = t11;
    $[31] = t12;
    $[32] = t13;
  } else {
    t13 = $[32];
  }
  let t14;
  if ($[33] !== api || $[34] !== colSpan || $[35] !== items || $[36] !== onRowClick || $[37] !== onRowIntent || $[38] !== rowClass || $[39] !== selectable) {
    t14 = items.length === 0 ? /*#__PURE__*/_jsx(SkeletonRows, {
      count: Math.min(api.pagination.pageSize, SKELETON_ROWS),
      selectable: selectable
    }) : items.map(item => {
      if (item.type === "group") {
        return /*#__PURE__*/_jsx(TableRow, {
          className: "KyroTable-groupRow",
          onClick: () => api.toggleGroup(item.group.key),
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
                gap: 1
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
                  checked: api.groupAllSelected(item.group.key),
                  indeterminate: api.groupSomeSelected(item.group.key) && !api.groupAllSelected(item.group.key),
                  onChange: () => api.toggleSelectGroup(item.group.key),
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
                }), api.groupLoading(item.group.key) && api.groupRows(item.group.key).length === 0 && /*#__PURE__*/_jsx(Box, {
                  component: "span",
                  sx: {
                    color: "text.secondary",
                    fontSize: 12
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
    $[33] = api;
    $[34] = colSpan;
    $[35] = items;
    $[36] = onRowClick;
    $[37] = onRowIntent;
    $[38] = rowClass;
    $[39] = selectable;
    $[40] = t14;
  } else {
    t14 = $[40];
  }
  let t15;
  if ($[41] !== t14) {
    t15 = /*#__PURE__*/_jsx(TableBody, {
      children: t14
    });
    $[41] = t14;
    $[42] = t15;
  } else {
    t15 = $[42];
  }
  let t16;
  if ($[43] !== stickyHeader || $[44] !== t10 || $[45] !== t13 || $[46] !== t15 || $[47] !== t9) {
    t16 = /*#__PURE__*/_jsx(TableContainer, {
      sx: t8,
      children: /*#__PURE__*/_jsxs(Table, {
        size: "small",
        stickyHeader: stickyHeader,
        sx: t9,
        children: [t10, t13, t15]
      })
    });
    $[43] = stickyHeader;
    $[44] = t10;
    $[45] = t13;
    $[46] = t15;
    $[47] = t9;
    $[48] = t16;
  } else {
    t16 = $[48];
  }
  return t16;
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