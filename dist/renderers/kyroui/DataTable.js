import { c as _c } from "react/compiler-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Badge, Box, Button, Card, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@kyrobit/kyroui';
import { countFilterValues, filterValuesEqual } from '@kyrobit/datatable';
import { DataTableRoot } from './context.js';
import { DataTableSearchField } from './SearchField.js';
import { DataTableBody } from './Body.js';
import { DataTablePagination } from './Pagination.js';
import { DataTableFilterMenu, ManageViewsDialog } from './FilterMenu.js';
import { DataTableSettingsDialog } from './SettingsDialog.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { ActionsIcon, AddIcon, ExportIcon, FilterIcon, GroupIcon, ImportIcon, SettingIcon } from './icons.js';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The full list-page assembly: views pills + manage, create, search with the
 * filter popover, group-by, export/import, contextual bulk actions, the table
 * card, and top-right pagination. Every section is opt-in through props; for
 * a custom layout compose the exported pieces yourself.
 */
export function DataTable(t0) {
  const $ = _c(122);
  const {
    api,
    presets,
    filterColumns,
    searchPlaceholder,
    searchWidth,
    createLabel: t1,
    onCreate,
    toolbarEnd,
    onExport,
    exportFormats: t2,
    filterRenderers,
    onImport,
    exportTooltip: t3,
    importTooltip: t4,
    actions,
    selectable,
    settings: t5,
    onRowClick,
    onRowIntent,
    rowClass,
    emptyMessage,
    noResultsMessage,
    errorMessage,
    stickyHeader,
    rowsPerPageOptions,
    infiniteScroll
  } = t0;
  const createLabel = t1 === undefined ? "Create" : t1;
  let t6;
  if ($[0] !== t2) {
    t6 = t2 === undefined ? [{
      id: "csv",
      label: "CSV"
    }] : t2;
    $[0] = t2;
    $[1] = t6;
  } else {
    t6 = $[1];
  }
  const exportFormats = t6;
  const exportTooltip = t3 === undefined ? "Export current results" : t3;
  const importTooltip = t4 === undefined ? "Import from CSV" : t4;
  const settings = t5 === undefined ? true : t5;
  const [filterAnchor, setFilterAnchor] = useState(null);
  let t7;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t7 = {};
    $[2] = t7;
  } else {
    t7 = $[2];
  }
  const [filterDraft, setFilterDraft] = useState(t7);
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const {
    page
  } = api.pagination;
  const {
    setPage
  } = api;
  let t8;
  let t9;
  if ($[3] !== infiniteScroll || $[4] !== page || $[5] !== setPage) {
    t8 = () => {
      if (infiniteScroll && page !== 1) {
        setPage(1);
      }
    };
    t9 = [infiniteScroll, page, setPage];
    $[3] = infiniteScroll;
    $[4] = page;
    $[5] = setPage;
    $[6] = t8;
    $[7] = t9;
  } else {
    t8 = $[6];
    t9 = $[7];
  }
  useEffect(t8, t9);
  let t10;
  if ($[8] !== api.filters) {
    t10 = api.filters ?? {};
    $[8] = api.filters;
    $[9] = t10;
  } else {
    t10 = $[9];
  }
  const filters = t10;
  let t11;
  if ($[10] !== filters) {
    t11 = countFilterValues(filters);
    $[10] = filters;
    $[11] = t11;
  } else {
    t11 = $[11];
  }
  const filterCount = t11;
  const withSelection = Boolean(selectable || actions && actions.length > 0);
  let t12;
  bb0: {
    if (selectedPresetId && presets) {
      let selected;
      let t13;
      if ($[12] !== filters || $[13] !== presets.all || $[14] !== selectedPresetId) {
        let t14;
        if ($[17] !== selectedPresetId) {
          t14 = p => p.id === selectedPresetId;
          $[17] = selectedPresetId;
          $[18] = t14;
        } else {
          t14 = $[18];
        }
        selected = presets.all.find(t14);
        t13 = selected && filterValuesEqual(selected.filters, filters);
        $[12] = filters;
        $[13] = presets.all;
        $[14] = selectedPresetId;
        $[15] = selected;
        $[16] = t13;
      } else {
        selected = $[15];
        t13 = $[16];
      }
      if (t13) {
        t12 = selected.id;
        break bb0;
      }
    }
    if (countFilterValues(filters) === 0) {
      t12 = "all";
      break bb0;
    }
    let t13;
    if ($[19] !== filters || $[20] !== presets?.all) {
      t13 = presets?.all.find(p_0 => filterValuesEqual(p_0.filters, filters))?.id ?? null;
      $[19] = filters;
      $[20] = presets?.all;
      $[21] = t13;
    } else {
      t13 = $[21];
    }
    t12 = t13;
  }
  const activePresetId = t12;
  let t13;
  if ($[22] !== api) {
    t13 = (next, presetId) => {
      setSelectedPresetId(presetId ?? null);
      api.setFilters(next);
    };
    $[22] = api;
    $[23] = t13;
  } else {
    t13 = $[23];
  }
  const applyFilters = t13;
  let t14;
  if ($[24] !== api.groupBy || $[25] !== api.groupByColumns) {
    t14 = api.groupByColumns?.find(g => g.field === api.groupBy)?.label;
    $[24] = api.groupBy;
    $[25] = api.groupByColumns;
    $[26] = t14;
  } else {
    t14 = $[26];
  }
  const activeGroupLabel = t14;
  let t15;
  if ($[27] !== api) {
    t15 = async action => {
      await action.handle(api.selectedIds);
      api.clearSelection();
      if (api.groupBy) {
        api.setGroupBy(api.groupBy);
      }
      api.refetch();
    };
    $[27] = api;
    $[28] = t15;
  } else {
    t15 = $[28];
  }
  const executeAction = t15;
  let t16;
  if ($[29] !== executeAction) {
    t16 = action_0 => {
      if (action_0.confirmationMessage) {
        setPendingAction(action_0);
        return;
      }
      executeAction(action_0);
    };
    $[29] = executeAction;
    $[30] = t16;
  } else {
    t16 = $[30];
  }
  const runAction = t16;
  let t17;
  if ($[31] !== api.filters || $[32] !== api.groupBy || $[33] !== api.search || $[34] !== api.selectedIds || $[35] !== api.sort || $[36] !== onExport) {
    t17 = format => {
      onExport?.({
        format,
        search: api.search,
        sort: api.sort,
        filters: api.filters,
        groupBy: api.groupBy,
        selectedIds: api.selectedIds
      });
    };
    $[31] = api.filters;
    $[32] = api.groupBy;
    $[33] = api.search;
    $[34] = api.selectedIds;
    $[35] = api.sort;
    $[36] = onExport;
    $[37] = t17;
  } else {
    t17 = $[37];
  }
  const runExport = t17;
  let t18;
  if ($[38] !== activePresetId || $[39] !== applyFilters || $[40] !== createLabel || $[41] !== onCreate || $[42] !== presets || $[43] !== toolbarEnd) {
    t18 = (presets || onCreate || toolbarEnd) && /*#__PURE__*/_jsxs(Stack, {
      sx: {
        flexDirection: {
          xs: "column",
          sm: "row"
        },
        alignItems: {
          xs: "stretch",
          sm: "center"
        },
        justifyContent: "space-between",
        gap: "md"
      },
      children: [/*#__PURE__*/_jsx(Stack, {
        direction: "row",
        spacing: "sm",
        sx: {
          alignItems: "center",
          minWidth: 0,
          flexWrap: "wrap"
        },
        children: presets && presets.all.length > 0 && /*#__PURE__*/_jsxs(ToggleButtonGroup, {
          exclusive: true,
          value: activePresetId,
          onChange: (_, nextId) => {
            if (!nextId) {
              return;
            }
            if (nextId === "all") {
              applyFilters({});
              return;
            }
            const p_1 = presets.all.find(preset => preset.id === nextId);
            if (p_1) {
              applyFilters(p_1.filters, p_1.id);
            }
          },
          children: [/*#__PURE__*/_jsx(ToggleButton, {
            value: "all",
            "data-label": "All",
            children: "All"
          }), presets.all.map(_temp)]
        })
      }), /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        spacing: "sm",
        sx: {
          alignItems: "center",
          flexShrink: 0
        },
        children: [onCreate && /*#__PURE__*/_jsx(Button, {
          variant: "contained",
          startIcon: /*#__PURE__*/_jsx(AddIcon, {}),
          onClick: onCreate,
          children: createLabel
        }), toolbarEnd]
      })]
    });
    $[38] = activePresetId;
    $[39] = applyFilters;
    $[40] = createLabel;
    $[41] = onCreate;
    $[42] = presets;
    $[43] = toolbarEnd;
    $[44] = t18;
  } else {
    t18 = $[44];
  }
  let t19;
  if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
    t19 = {
      flexDirection: {
        xs: "column",
        sm: "row"
      },
      alignItems: {
        xs: "stretch",
        sm: "center"
      },
      justifyContent: "space-between",
      gap: "sm",
      minHeight: "var(--kyro-row-height)"
    };
    $[45] = t19;
  } else {
    t19 = $[45];
  }
  let t20;
  if ($[46] === Symbol.for("react.memo_cache_sentinel")) {
    t20 = {
      alignItems: "center",
      flexWrap: "wrap",
      minWidth: 0
    };
    $[46] = t20;
  } else {
    t20 = $[46];
  }
  let t21;
  if ($[47] !== filterColumns || $[48] !== filterCount || $[49] !== filters) {
    t21 = filterColumns && /*#__PURE__*/_jsx(Badge, {
      badgeContent: filterCount,
      color: "primary",
      children: /*#__PURE__*/_jsx(IconButton, {
        size: "small",
        "aria-label": "Filters",
        onClick: e => {
          setFilterDraft(filters);
          setFilterAnchor(e.currentTarget.closest(".search-field") ?? e.currentTarget);
        },
        children: /*#__PURE__*/_jsx(FilterIcon, {
          fontSize: "small"
        })
      })
    });
    $[47] = filterColumns;
    $[48] = filterCount;
    $[49] = filters;
    $[50] = t21;
  } else {
    t21 = $[50];
  }
  let t22;
  if ($[51] !== searchPlaceholder || $[52] !== searchWidth || $[53] !== t21) {
    t22 = /*#__PURE__*/_jsx(DataTableSearchField, {
      placeholder: searchPlaceholder,
      width: searchWidth,
      alwaysOpen: true,
      endAdornment: t21
    });
    $[51] = searchPlaceholder;
    $[52] = searchWidth;
    $[53] = t21;
    $[54] = t22;
  } else {
    t22 = $[54];
  }
  let t23;
  if ($[55] !== activeGroupLabel || $[56] !== api) {
    t23 = api.groupByColumns && api.groupByColumns.length > 0 && /*#__PURE__*/_jsx(Menu, {
      label: activeGroupLabel ? `Group: ${activeGroupLabel}` : "Group",
      startIcon: /*#__PURE__*/_jsx(GroupIcon, {}),
      children: [{
        field: null,
        label: "None"
      }, ...api.groupByColumns].map(g_0 => /*#__PURE__*/_jsx(MenuItem, {
        selected: api.groupBy === g_0.field,
        onClick: () => api.setGroupBy(g_0.field),
        children: g_0.label
      }, g_0.label))
    });
    $[55] = activeGroupLabel;
    $[56] = api;
    $[57] = t23;
  } else {
    t23 = $[57];
  }
  let t24;
  if ($[58] !== actions || $[59] !== api.selectedIds || $[60] !== runAction) {
    t24 = actions && actions.length > 0 && api.selectedIds.length > 0 && /*#__PURE__*/_jsx(Menu, {
      label: `Actions (${api.selectedIds.length})`,
      startIcon: /*#__PURE__*/_jsx(ActionsIcon, {}),
      children: actions.map(action_1 => /*#__PURE__*/_jsx(MenuItem, {
        onClick: () => runAction(action_1),
        children: action_1.label
      }, action_1.label))
    });
    $[58] = actions;
    $[59] = api.selectedIds;
    $[60] = runAction;
    $[61] = t24;
  } else {
    t24 = $[61];
  }
  let t25;
  if ($[62] !== exportFormats || $[63] !== exportTooltip || $[64] !== importTooltip || $[65] !== onExport || $[66] !== onImport || $[67] !== runExport || $[68] !== settings) {
    t25 = (onExport || onImport || settings) && /*#__PURE__*/_jsxs(Menu, {
      "aria-label": "More",
      variant: "outlined",
      morph: true,
      placement: "bottom-start",
      children: [onExport && exportFormats.map(format_0 => /*#__PURE__*/_jsxs(MenuItem, {
        onClick: () => runExport(format_0.id),
        children: [/*#__PURE__*/_jsx(ListItemIcon, {
          children: /*#__PURE__*/_jsx(ExportIcon, {})
        }), /*#__PURE__*/_jsx(ListItemText, {
          primary: exportFormats.length > 1 ? `Export as ${format_0.label}` : "Export",
          secondary: exportFormats.length > 1 ? undefined : exportTooltip
        })]
      }, format_0.id)), onImport && /*#__PURE__*/_jsxs(MenuItem, {
        onClick: onImport,
        children: [/*#__PURE__*/_jsx(ListItemIcon, {
          children: /*#__PURE__*/_jsx(ImportIcon, {})
        }), /*#__PURE__*/_jsx(ListItemText, {
          primary: "Import",
          secondary: importTooltip
        })]
      }), settings && /*#__PURE__*/_jsxs(MenuItem, {
        onClick: () => setSettingsOpen(true),
        children: [/*#__PURE__*/_jsx(ListItemIcon, {
          children: /*#__PURE__*/_jsx(SettingIcon, {})
        }), /*#__PURE__*/_jsx(ListItemText, {
          primary: "Settings"
        })]
      })]
    });
    $[62] = exportFormats;
    $[63] = exportTooltip;
    $[64] = importTooltip;
    $[65] = onExport;
    $[66] = onImport;
    $[67] = runExport;
    $[68] = settings;
    $[69] = t25;
  } else {
    t25 = $[69];
  }
  let t26;
  if ($[70] !== t22 || $[71] !== t23 || $[72] !== t24 || $[73] !== t25) {
    t26 = /*#__PURE__*/_jsx(Stack, {
      sx: t19,
      children: /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        spacing: "sm",
        sx: t20,
        children: [t22, t23, t24, t25]
      })
    });
    $[70] = t22;
    $[71] = t23;
    $[72] = t24;
    $[73] = t25;
    $[74] = t26;
  } else {
    t26 = $[74];
  }
  let t27;
  if ($[75] !== api.selectedIds || $[76] !== executeAction || $[77] !== pendingAction) {
    t27 = pendingAction && /*#__PURE__*/_jsx(ConfirmDialog, {
      open: true,
      title: pendingAction.confirmationMessage(api.selectedIds.length),
      description: pendingAction.confirmationDescription?.(api.selectedIds.length),
      confirmLabel: pendingAction.label,
      confirmColor: pendingAction.confirmColor ?? "error",
      onCancel: () => setPendingAction(null),
      onConfirm: () => {
        const action_2 = pendingAction;
        setPendingAction(null);
        executeAction(action_2);
      }
    });
    $[75] = api.selectedIds;
    $[76] = executeAction;
    $[77] = pendingAction;
    $[78] = t27;
  } else {
    t27 = $[78];
  }
  let t28;
  if ($[79] !== applyFilters || $[80] !== filterAnchor || $[81] !== filterColumns || $[82] !== filterDraft || $[83] !== filterRenderers || $[84] !== presets) {
    t28 = filterColumns && /*#__PURE__*/_jsx(DataTableFilterMenu, {
      filterRenderers: filterRenderers,
      anchorEl: filterAnchor,
      onClose: () => setFilterAnchor(null),
      filterColumns: filterColumns,
      draft: filterDraft,
      onDraftChange: setFilterDraft,
      onApply: applyFilters,
      presets: presets
    });
    $[79] = applyFilters;
    $[80] = filterAnchor;
    $[81] = filterColumns;
    $[82] = filterDraft;
    $[83] = filterRenderers;
    $[84] = presets;
    $[85] = t28;
  } else {
    t28 = $[85];
  }
  let t29;
  if ($[86] !== filterColumns || $[87] !== manageOpen || $[88] !== presets) {
    t29 = presets && filterColumns && /*#__PURE__*/_jsx(ManageViewsDialog, {
      open: manageOpen,
      onClose: () => setManageOpen(false),
      presets: presets,
      filterColumns: filterColumns
    });
    $[86] = filterColumns;
    $[87] = manageOpen;
    $[88] = presets;
    $[89] = t29;
  } else {
    t29 = $[89];
  }
  let t30;
  if ($[90] !== filterColumns || $[91] !== presets || $[92] !== settings || $[93] !== settingsOpen) {
    t30 = settings && /*#__PURE__*/_jsx(DataTableSettingsDialog, {
      open: settingsOpen,
      onClose: () => setSettingsOpen(false),
      onManageViews: presets && filterColumns ? () => {
        setSettingsOpen(false);
        setManageOpen(true);
      } : undefined
    });
    $[90] = filterColumns;
    $[91] = presets;
    $[92] = settings;
    $[93] = settingsOpen;
    $[94] = t30;
  } else {
    t30 = $[94];
  }
  let t31;
  if ($[95] === Symbol.for("react.memo_cache_sentinel")) {
    t31 = {
      p: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      flex: "1 1 auto",
      minHeight: 0
    };
    $[95] = t31;
  } else {
    t31 = $[95];
  }
  let t32;
  if ($[96] !== emptyMessage || $[97] !== errorMessage || $[98] !== infiniteScroll || $[99] !== noResultsMessage || $[100] !== onRowClick || $[101] !== onRowIntent || $[102] !== rowClass || $[103] !== stickyHeader || $[104] !== withSelection) {
    t32 = /*#__PURE__*/_jsx(Card, {
      sx: t31,
      children: /*#__PURE__*/_jsx(DataTableBody, {
        selectable: withSelection,
        emptyMessage: emptyMessage,
        noResultsMessage: noResultsMessage,
        errorMessage: errorMessage,
        stickyHeader: stickyHeader,
        onRowClick: onRowClick,
        onRowIntent: onRowIntent,
        rowClass: rowClass,
        infiniteScroll: infiniteScroll
      })
    });
    $[96] = emptyMessage;
    $[97] = errorMessage;
    $[98] = infiniteScroll;
    $[99] = noResultsMessage;
    $[100] = onRowClick;
    $[101] = onRowIntent;
    $[102] = rowClass;
    $[103] = stickyHeader;
    $[104] = withSelection;
    $[105] = t32;
  } else {
    t32 = $[105];
  }
  let t33;
  if ($[106] !== api.groupBy || $[107] !== api.groups || $[108] !== api.groupsTotal || $[109] !== infiniteScroll || $[110] !== rowsPerPageOptions) {
    t33 = (!infiniteScroll || api.groupBy) && /*#__PURE__*/_jsxs(Box, {
      "data-table-footer": "",
      sx: {
        minHeight: "var(--kyro-row-height)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end"
      },
      children: [!infiniteScroll && /*#__PURE__*/_jsx(DataTablePagination, {
        rowsPerPageOptions: rowsPerPageOptions
      }), api.groupBy && /*#__PURE__*/_jsxs(Typography, {
        sx: {
          fontSize: "md",
          fontWeight: 500,
          color: "text.secondary",
          fontVariantNumeric: "tabular-nums"
        },
        children: [api.groups.length, " groups \xB7 ", api.groupsTotal, " records"]
      })]
    });
    $[106] = api.groupBy;
    $[107] = api.groups;
    $[108] = api.groupsTotal;
    $[109] = infiniteScroll;
    $[110] = rowsPerPageOptions;
    $[111] = t33;
  } else {
    t33 = $[111];
  }
  let t34;
  if ($[112] !== api || $[113] !== t18 || $[114] !== t26 || $[115] !== t27 || $[116] !== t28 || $[117] !== t29 || $[118] !== t30 || $[119] !== t32 || $[120] !== t33) {
    t34 = /*#__PURE__*/_jsxs(DataTableRoot, {
      api: api,
      children: [t18, t26, t27, t28, t29, t30, t32, t33]
    });
    $[112] = api;
    $[113] = t18;
    $[114] = t26;
    $[115] = t27;
    $[116] = t28;
    $[117] = t29;
    $[118] = t30;
    $[119] = t32;
    $[120] = t33;
    $[121] = t34;
  } else {
    t34 = $[121];
  }
  return t34;
}
function _temp(p_2) {
  return /*#__PURE__*/_jsx(ToggleButton, {
    value: p_2.id,
    "data-label": p_2.name,
    children: p_2.name
  }, p_2.id);
}
DataTable.Root = DataTableRoot;
DataTable.SearchField = DataTableSearchField;
DataTable.Body = DataTableBody;
DataTable.Pagination = DataTablePagination;