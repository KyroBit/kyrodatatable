import { c as _c } from "react/compiler-runtime";
import { startTransition, useEffect, useMemo, useOptimistic, useState } from 'react';
import { Box, Button, Card, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Submenu, ToggleButton, ToggleButtonGroup, Typography } from '@kyrobit/kyroui';
import { countFilterValues, filterValuesEqual } from '@kyrobit/datatable';
import { DataTableRoot } from './context.js';
import { DataTableSearchField } from './SearchField.js';
import { DataTableBody } from './Body.js';
import { DataTablePagination } from './Pagination.js';
import { ManageViewsDialog } from './FilterMenu.js';
import { DataTableFilterButton } from './FilterButton.js';
import { DataTableSettingsDialog } from './SettingsDialog.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { ActionsIcon, AddIcon, ExportIcon, GroupIcon, ImportIcon, SettingIcon } from './icons.js';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The full list-page assembly: views pills + manage, create, search with the
 * filter popover, group-by, export/import, contextual bulk actions, the table
 * card, and top-right pagination. Every section is opt-in through props; for
 * a custom layout compose the exported pieces yourself.
 */
export function DataTable(t0) {
  const $ = _c(114);
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
    exportTooltip,
    importTooltip,
    actions,
    selectable,
    settings: t3,
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
  let t4;
  if ($[0] !== t2) {
    t4 = t2 === undefined ? [{
      id: "csv",
      label: "CSV"
    }] : t2;
    $[0] = t2;
    $[1] = t4;
  } else {
    t4 = $[1];
  }
  const exportFormats = t4;
  const settings = t3 === undefined ? true : t3;
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
  let t5;
  let t6;
  if ($[2] !== infiniteScroll || $[3] !== page || $[4] !== setPage) {
    t5 = () => {
      if (infiniteScroll && page !== 1) {
        setPage(1);
      }
    };
    t6 = [infiniteScroll, page, setPage];
    $[2] = infiniteScroll;
    $[3] = page;
    $[4] = setPage;
    $[5] = t5;
    $[6] = t6;
  } else {
    t5 = $[5];
    t6 = $[6];
  }
  useEffect(t5, t6);
  let t7;
  if ($[7] !== api.filters) {
    t7 = api.filters ?? {};
    $[7] = api.filters;
    $[8] = t7;
  } else {
    t7 = $[8];
  }
  const filters = t7;
  const withSelection = Boolean(selectable || actions && actions.length > 0);
  let t8;
  bb0: {
    if (selectedPresetId && presets) {
      let selected;
      let t9;
      if ($[9] !== filters || $[10] !== presets.all || $[11] !== selectedPresetId) {
        let t10;
        if ($[14] !== selectedPresetId) {
          t10 = p => p.id === selectedPresetId;
          $[14] = selectedPresetId;
          $[15] = t10;
        } else {
          t10 = $[15];
        }
        selected = presets.all.find(t10);
        t9 = selected && filterValuesEqual(selected.filters, filters);
        $[9] = filters;
        $[10] = presets.all;
        $[11] = selectedPresetId;
        $[12] = selected;
        $[13] = t9;
      } else {
        selected = $[12];
        t9 = $[13];
      }
      if (t9) {
        t8 = selected.id;
        break bb0;
      }
    }
    if (countFilterValues(filters) === 0) {
      t8 = "all";
      break bb0;
    }
    let t9;
    if ($[16] !== filters || $[17] !== presets?.all) {
      t9 = presets?.all.find(p_0 => filterValuesEqual(p_0.filters, filters))?.id ?? null;
      $[16] = filters;
      $[17] = presets?.all;
      $[18] = t9;
    } else {
      t9 = $[18];
    }
    t8 = t9;
  }
  const activePresetId = t8;
  const [shownPresetId, showPreset] = useOptimistic(activePresetId);
  let t9;
  if ($[19] !== api) {
    t9 = (next, presetId) => {
      setSelectedPresetId(presetId ?? null);
      api.setFilters(next);
    };
    $[19] = api;
    $[20] = t9;
  } else {
    t9 = $[20];
  }
  const applyFilters = t9;
  let t10;
  if ($[21] !== applyFilters || $[22] !== showPreset) {
    t10 = (presetId_0, next_0) => startTransition(() => {
      showPreset(presetId_0);
      applyFilters(next_0, presetId_0 === "all" ? undefined : presetId_0);
    });
    $[21] = applyFilters;
    $[22] = showPreset;
    $[23] = t10;
  } else {
    t10 = $[23];
  }
  const pickPreset = t10;
  let t11;
  if ($[24] !== api.groupBy || $[25] !== api.groupByColumns) {
    t11 = api.groupByColumns?.find(g => g.field === api.groupBy)?.label;
    $[24] = api.groupBy;
    $[25] = api.groupByColumns;
    $[26] = t11;
  } else {
    t11 = $[26];
  }
  const activeGroupLabel = t11;
  let t12;
  if ($[27] !== api) {
    t12 = async action => {
      await action.handle(api.selectedIds);
      api.clearSelection();
      if (api.groupBy) {
        api.setGroupBy(api.groupBy);
      }
      api.refetch();
    };
    $[27] = api;
    $[28] = t12;
  } else {
    t12 = $[28];
  }
  const executeAction = t12;
  let t13;
  if ($[29] !== executeAction) {
    t13 = action_0 => {
      if (action_0.confirmationMessage) {
        setPendingAction(action_0);
        return;
      }
      executeAction(action_0);
    };
    $[29] = executeAction;
    $[30] = t13;
  } else {
    t13 = $[30];
  }
  const runAction = t13;
  let t14;
  if ($[31] !== api.filters || $[32] !== api.groupBy || $[33] !== api.search || $[34] !== api.selectedIds || $[35] !== api.sort || $[36] !== onExport) {
    t14 = format => {
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
    $[37] = t14;
  } else {
    t14 = $[37];
  }
  const runExport = t14;
  let t15;
  if ($[38] !== createLabel || $[39] !== onCreate || $[40] !== pickPreset || $[41] !== presets || $[42] !== shownPresetId || $[43] !== toolbarEnd) {
    t15 = (presets || onCreate || toolbarEnd) && /*#__PURE__*/_jsxs(Stack, {
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
          value: shownPresetId,
          onChange: (_, nextId) => {
            if (!nextId) {
              return;
            }
            if (nextId === "all") {
              pickPreset("all", {});
              return;
            }
            const p_1 = presets.all.find(preset => preset.id === nextId);
            if (p_1) {
              pickPreset(p_1.id, p_1.filters);
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
    $[38] = createLabel;
    $[39] = onCreate;
    $[40] = pickPreset;
    $[41] = presets;
    $[42] = shownPresetId;
    $[43] = toolbarEnd;
    $[44] = t15;
  } else {
    t15 = $[44];
  }
  let t16;
  if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = {
      alignItems: "center",
      flexWrap: "wrap",
      minWidth: 0
    };
    $[45] = t16;
  } else {
    t16 = $[45];
  }
  let t17;
  if ($[46] !== applyFilters || $[47] !== filterColumns || $[48] !== filterRenderers || $[49] !== presets) {
    t17 = filterColumns && /*#__PURE__*/_jsx(DataTableFilterButton, {
      filterColumns: filterColumns,
      presets: presets,
      filterRenderers: filterRenderers,
      onApply: applyFilters
    });
    $[46] = applyFilters;
    $[47] = filterColumns;
    $[48] = filterRenderers;
    $[49] = presets;
    $[50] = t17;
  } else {
    t17 = $[50];
  }
  let t18;
  if ($[51] !== searchPlaceholder || $[52] !== searchWidth || $[53] !== t17) {
    t18 = /*#__PURE__*/_jsx(DataTableSearchField, {
      placeholder: searchPlaceholder,
      width: searchWidth,
      alwaysOpen: true,
      endAdornment: t17
    });
    $[51] = searchPlaceholder;
    $[52] = searchWidth;
    $[53] = t17;
    $[54] = t18;
  } else {
    t18 = $[54];
  }
  let t19;
  if ($[55] !== activeGroupLabel || $[56] !== api) {
    t19 = api.groupByColumns && api.groupByColumns.length > 0 && /*#__PURE__*/_jsx(Menu, {
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
    $[57] = t19;
  } else {
    t19 = $[57];
  }
  let t20;
  if ($[58] !== actions || $[59] !== api.selectedIds || $[60] !== runAction) {
    t20 = actions && actions.length > 0 && api.selectedIds.length > 0 && /*#__PURE__*/_jsx(Menu, {
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
    $[61] = t20;
  } else {
    t20 = $[61];
  }
  let t21;
  if ($[62] !== exportFormats || $[63] !== exportTooltip || $[64] !== importTooltip || $[65] !== onExport || $[66] !== onImport || $[67] !== runExport || $[68] !== settings) {
    t21 = (onExport || onImport || settings) && /*#__PURE__*/_jsxs(Menu, {
      "aria-label": "More",
      variant: "outlined",
      placement: "bottom-start",
      children: [onImport && /*#__PURE__*/_jsxs(MenuItem, {
        onClick: onImport,
        children: [/*#__PURE__*/_jsx(ListItemIcon, {
          children: /*#__PURE__*/_jsx(ImportIcon, {})
        }), /*#__PURE__*/_jsx(ListItemText, {
          primary: "Import",
          secondary: importTooltip
        })]
      }), onExport && exportFormats.length > 1 && /*#__PURE__*/_jsx(Submenu, {
        label: "Export",
        icon: /*#__PURE__*/_jsx(ExportIcon, {}),
        children: exportFormats.map(format_0 => /*#__PURE__*/_jsx(MenuItem, {
          onClick: () => runExport(format_0.id),
          children: format_0.label
        }, format_0.id))
      }), onExport && exportFormats.length === 1 && /*#__PURE__*/_jsxs(MenuItem, {
        onClick: () => runExport(exportFormats[0].id),
        children: [/*#__PURE__*/_jsx(ListItemIcon, {
          children: /*#__PURE__*/_jsx(ExportIcon, {})
        }), /*#__PURE__*/_jsx(ListItemText, {
          primary: "Export",
          secondary: exportTooltip
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
    $[69] = t21;
  } else {
    t21 = $[69];
  }
  let t22;
  if ($[70] !== t18 || $[71] !== t19 || $[72] !== t20 || $[73] !== t21) {
    t22 = /*#__PURE__*/_jsx(Stack, {
      sx: _temp2,
      children: /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        spacing: "sm",
        sx: t16,
        children: [t18, t19, t20, t21]
      })
    });
    $[70] = t18;
    $[71] = t19;
    $[72] = t20;
    $[73] = t21;
    $[74] = t22;
  } else {
    t22 = $[74];
  }
  let t23;
  if ($[75] !== api.selectedIds || $[76] !== executeAction || $[77] !== pendingAction) {
    t23 = pendingAction && /*#__PURE__*/_jsx(ConfirmDialog, {
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
    $[78] = t23;
  } else {
    t23 = $[78];
  }
  let t24;
  if ($[79] !== filterColumns || $[80] !== manageOpen || $[81] !== presets) {
    t24 = presets && filterColumns && /*#__PURE__*/_jsx(ManageViewsDialog, {
      open: manageOpen,
      onClose: () => setManageOpen(false),
      presets: presets,
      filterColumns: filterColumns
    });
    $[79] = filterColumns;
    $[80] = manageOpen;
    $[81] = presets;
    $[82] = t24;
  } else {
    t24 = $[82];
  }
  let t25;
  if ($[83] !== filterColumns || $[84] !== presets || $[85] !== settings || $[86] !== settingsOpen) {
    t25 = settings && /*#__PURE__*/_jsx(DataTableSettingsDialog, {
      open: settingsOpen,
      onClose: () => setSettingsOpen(false),
      onManageViews: presets && filterColumns ? () => {
        setSettingsOpen(false);
        setManageOpen(true);
      } : undefined
    });
    $[83] = filterColumns;
    $[84] = presets;
    $[85] = settings;
    $[86] = settingsOpen;
    $[87] = t25;
  } else {
    t25 = $[87];
  }
  let t26;
  if ($[88] === Symbol.for("react.memo_cache_sentinel")) {
    t26 = {
      p: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      flex: "1 1 auto",
      minHeight: 0
    };
    $[88] = t26;
  } else {
    t26 = $[88];
  }
  let t27;
  if ($[89] !== emptyMessage || $[90] !== errorMessage || $[91] !== infiniteScroll || $[92] !== noResultsMessage || $[93] !== onRowClick || $[94] !== onRowIntent || $[95] !== rowClass || $[96] !== stickyHeader || $[97] !== withSelection) {
    t27 = /*#__PURE__*/_jsx(Card, {
      sx: t26,
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
    $[89] = emptyMessage;
    $[90] = errorMessage;
    $[91] = infiniteScroll;
    $[92] = noResultsMessage;
    $[93] = onRowClick;
    $[94] = onRowIntent;
    $[95] = rowClass;
    $[96] = stickyHeader;
    $[97] = withSelection;
    $[98] = t27;
  } else {
    t27 = $[98];
  }
  let t28;
  if ($[99] !== api.groupBy || $[100] !== api.groups || $[101] !== api.groupsTotal || $[102] !== infiniteScroll || $[103] !== rowsPerPageOptions) {
    t28 = (!infiniteScroll || api.groupBy) && /*#__PURE__*/_jsxs(Box, {
      "data-table-footer": "",
      sx: _temp3,
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
    $[99] = api.groupBy;
    $[100] = api.groups;
    $[101] = api.groupsTotal;
    $[102] = infiniteScroll;
    $[103] = rowsPerPageOptions;
    $[104] = t28;
  } else {
    t28 = $[104];
  }
  let t29;
  if ($[105] !== api || $[106] !== t15 || $[107] !== t22 || $[108] !== t23 || $[109] !== t24 || $[110] !== t25 || $[111] !== t27 || $[112] !== t28) {
    t29 = /*#__PURE__*/_jsxs(DataTableRoot, {
      api: api,
      children: [t15, t22, t23, t24, t25, t27, t28]
    });
    $[105] = api;
    $[106] = t15;
    $[107] = t22;
    $[108] = t23;
    $[109] = t24;
    $[110] = t25;
    $[111] = t27;
    $[112] = t28;
    $[113] = t29;
  } else {
    t29 = $[113];
  }
  return t29;
}
function _temp3(theme_0) {
  return {
    minHeight: theme_0.vars.size.row,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  };
}
function _temp2(theme) {
  return {
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
    minHeight: theme.vars.size.row
  };
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