import { c as _c } from "react/compiler-runtime";
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
/** The table itself: sortable headers, rows, and — for grouped items — an expandable header row. Reads `api.visibleItems`, so grouped and flat modes share one render path instead of two. */
export function DataTableBody(t0) {
  const $ = _c(46);
  const {
    onRowClick,
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
  if (items.length === 0 && !fetching) {
    let t6;
    if ($[2] !== api.filters || $[3] !== api.search) {
      t6 = Boolean(api.search) || countFilterValues(api.filters ?? {}) > 0;
      $[2] = api.filters;
      $[3] = api.search;
      $[4] = t6;
    } else {
      t6 = $[4];
    }
    const filtered = t6;
    let t7;
    if ($[5] !== api || $[6] !== emptyMessage || $[7] !== errorMessage || $[8] !== filtered || $[9] !== noResultsMessage) {
      t7 = api.error ? errorMessage ?? /*#__PURE__*/_jsxs(Box, {
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
      $[5] = api;
      $[6] = emptyMessage;
      $[7] = errorMessage;
      $[8] = filtered;
      $[9] = noResultsMessage;
      $[10] = t7;
    } else {
      t7 = $[10];
    }
    const message = t7;
    let t8;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
      t8 = {
        flex: "1 1 auto",
        py: 4
      };
      $[11] = t8;
    } else {
      t8 = $[11];
    }
    let t9;
    if ($[12] !== message) {
      t9 = typeof message === "string" ? /*#__PURE__*/_jsx(Typography, {
        sx: {
          color: "text.secondary",
          textAlign: "center",
          py: 6
        },
        children: message
      }) : message;
      $[12] = message;
      $[13] = t9;
    } else {
      t9 = $[13];
    }
    let t10;
    if ($[14] !== t9) {
      t10 = /*#__PURE__*/_jsx(Box, {
        className: "KyroTable-empty",
        sx: t8,
        children: t9
      });
      $[14] = t9;
      $[15] = t10;
    } else {
      t10 = $[15];
    }
    return t10;
  }
  let t6;
  if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = {
      flex: "1 1 auto",
      minHeight: 0
    };
    $[16] = t6;
  } else {
    t6 = $[16];
  }
  let t7;
  if ($[17] !== hasExplicitWidths) {
    t7 = hasExplicitWidths ? {
      tableLayout: "fixed"
    } : undefined;
    $[17] = hasExplicitWidths;
    $[18] = t7;
  } else {
    t7 = $[18];
  }
  let t8;
  if ($[19] !== api.visibleColumns || $[20] !== hasExplicitWidths || $[21] !== selectable) {
    t8 = hasExplicitWidths && /*#__PURE__*/_jsxs("colgroup", {
      children: [selectable && /*#__PURE__*/_jsx("col", {
        style: {
          width: 48
        }
      }), api.visibleColumns.map(_temp3)]
    });
    $[19] = api.visibleColumns;
    $[20] = hasExplicitWidths;
    $[21] = selectable;
    $[22] = t8;
  } else {
    t8 = $[22];
  }
  let t9;
  if ($[23] !== api || $[24] !== selectable) {
    t9 = selectable && /*#__PURE__*/_jsx(TableCell, {
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
    $[23] = api;
    $[24] = selectable;
    $[25] = t9;
  } else {
    t9 = $[25];
  }
  let t10;
  if ($[26] !== api) {
    t10 = api.visibleColumns.map(col_1 => /*#__PURE__*/_jsx(TableCell, {
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
    $[26] = api;
    $[27] = t10;
  } else {
    t10 = $[27];
  }
  let t11;
  if ($[28] !== t10 || $[29] !== t9) {
    t11 = /*#__PURE__*/_jsx(TableHead, {
      children: /*#__PURE__*/_jsxs(TableRow, {
        children: [t9, t10]
      })
    });
    $[28] = t10;
    $[29] = t9;
    $[30] = t11;
  } else {
    t11 = $[30];
  }
  let t12;
  if ($[31] !== api || $[32] !== colSpan || $[33] !== items || $[34] !== onRowClick || $[35] !== rowClass || $[36] !== selectable) {
    t12 = items.length === 0 ? Array.from({
      length: Math.min(api.pagination.pageSize, SKELETON_ROWS)
    }, (_, index) => /*#__PURE__*/_jsxs(TableRow, {
      className: "KyroTable-skeletonRow",
      children: [selectable && /*#__PURE__*/_jsx(TableCell, {
        padding: "checkbox"
      }), api.visibleColumns.map(_temp4)]
    }, index)) : items.map(item => {
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
                  onClick: _temp5,
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
        children: [selectable && /*#__PURE__*/_jsx(TableCell, {
          padding: "checkbox",
          onClick: _temp6,
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
        }), api.visibleColumns.map(col_3 => /*#__PURE__*/_jsx(TableCell, {
          align: col_3.align,
          children: col_3.render ? col_3.render(row) : row[col_3.field]
        }, col_3.field))]
      }, rowId);
    });
    $[31] = api;
    $[32] = colSpan;
    $[33] = items;
    $[34] = onRowClick;
    $[35] = rowClass;
    $[36] = selectable;
    $[37] = t12;
  } else {
    t12 = $[37];
  }
  let t13;
  if ($[38] !== t12) {
    t13 = /*#__PURE__*/_jsx(TableBody, {
      children: t12
    });
    $[38] = t12;
    $[39] = t13;
  } else {
    t13 = $[39];
  }
  let t14;
  if ($[40] !== stickyHeader || $[41] !== t11 || $[42] !== t13 || $[43] !== t7 || $[44] !== t8) {
    t14 = /*#__PURE__*/_jsx(TableContainer, {
      sx: t6,
      children: /*#__PURE__*/_jsxs(Table, {
        size: "small",
        stickyHeader: stickyHeader,
        sx: t7,
        children: [t8, t11, t13]
      })
    });
    $[40] = stickyHeader;
    $[41] = t11;
    $[42] = t13;
    $[43] = t7;
    $[44] = t8;
    $[45] = t14;
  } else {
    t14 = $[45];
  }
  return t14;
}
function _temp6(e_0) {
  return e_0.stopPropagation();
}
function _temp5(e) {
  return e.stopPropagation();
}
function _temp4(col_2) {
  return /*#__PURE__*/_jsx(TableCell, {
    align: col_2.align,
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
  }, col_2.field);
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