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
import { DataTableGroupMenu } from './GroupMenu.js';
import { DataTableSettingsDialog } from './SettingsDialog.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { ActionsIcon, AddIcon, ExportIcon, ImportIcon, SettingIcon } from './icons.js';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The full list-page assembly: views pills + manage, create, search with the
 * filter popover, group-by, export/import, contextual bulk actions, the table
 * card, and top-right pagination. Every section is opt-in through props; for
 * a custom layout compose the exported pieces yourself.
 */
export function DataTable(t0) {
  const $ = _c(112);
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
    groupsPerPageOptions,
    infiniteScroll,
    restoreScroll
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
  if ($[24] !== api) {
    t11 = async action => {
      await action.handle({
        selection: api.selection,
        count: api.selectedCount,
        search: api.search,
        filters: api.filters
      });
      api.clearSelection();
      if (api.groupBy.length > 0) {
        api.setGroupBy(api.groupBy);
      }
      api.refetch();
    };
    $[24] = api;
    $[25] = t11;
  } else {
    t11 = $[25];
  }
  const executeAction = t11;
  let t12;
  if ($[26] !== executeAction) {
    t12 = action_0 => {
      if (action_0.confirmationMessage) {
        setPendingAction(action_0);
        return;
      }
      executeAction(action_0);
    };
    $[26] = executeAction;
    $[27] = t12;
  } else {
    t12 = $[27];
  }
  const runAction = t12;
  let t13;
  if ($[28] !== api.filters || $[29] !== api.groupBy || $[30] !== api.search || $[31] !== api.selection || $[32] !== api.sort || $[33] !== onExport) {
    t13 = format => {
      onExport?.({
        format,
        search: api.search,
        sort: api.sort,
        filters: api.filters,
        groupBy: api.groupBy,
        selection: api.selection
      });
    };
    $[28] = api.filters;
    $[29] = api.groupBy;
    $[30] = api.search;
    $[31] = api.selection;
    $[32] = api.sort;
    $[33] = onExport;
    $[34] = t13;
  } else {
    t13 = $[34];
  }
  const runExport = t13;
  let t14;
  if ($[35] !== createLabel || $[36] !== onCreate || $[37] !== pickPreset || $[38] !== presets || $[39] !== shownPresetId || $[40] !== toolbarEnd) {
    t14 = (presets || onCreate || toolbarEnd) && /*#__PURE__*/_jsxs(Stack, {
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
    $[35] = createLabel;
    $[36] = onCreate;
    $[37] = pickPreset;
    $[38] = presets;
    $[39] = shownPresetId;
    $[40] = toolbarEnd;
    $[41] = t14;
  } else {
    t14 = $[41];
  }
  let t15;
  if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
    t15 = {
      alignItems: "center",
      flexWrap: "wrap",
      minWidth: 0
    };
    $[42] = t15;
  } else {
    t15 = $[42];
  }
  let t16;
  if ($[43] !== applyFilters || $[44] !== filterColumns || $[45] !== filterRenderers || $[46] !== presets) {
    t16 = filterColumns && /*#__PURE__*/_jsx(DataTableFilterButton, {
      filterColumns: filterColumns,
      presets: presets,
      filterRenderers: filterRenderers,
      onApply: applyFilters
    });
    $[43] = applyFilters;
    $[44] = filterColumns;
    $[45] = filterRenderers;
    $[46] = presets;
    $[47] = t16;
  } else {
    t16 = $[47];
  }
  let t17;
  if ($[48] !== searchPlaceholder || $[49] !== searchWidth || $[50] !== t16) {
    t17 = /*#__PURE__*/_jsx(DataTableSearchField, {
      placeholder: searchPlaceholder,
      width: searchWidth,
      alwaysOpen: true,
      endAdornment: t16
    });
    $[48] = searchPlaceholder;
    $[49] = searchWidth;
    $[50] = t16;
    $[51] = t17;
  } else {
    t17 = $[51];
  }
  let t18;
  if ($[52] !== api.groupByColumns) {
    t18 = api.groupByColumns && api.groupByColumns.length > 0 && /*#__PURE__*/_jsx(DataTableGroupMenu, {});
    $[52] = api.groupByColumns;
    $[53] = t18;
  } else {
    t18 = $[53];
  }
  let t19;
  if ($[54] !== actions || $[55] !== api.selectedCount || $[56] !== runAction) {
    t19 = actions && actions.length > 0 && api.selectedCount > 0 && /*#__PURE__*/_jsx(Menu, {
      label: `Actions (${api.selectedCount})`,
      startIcon: /*#__PURE__*/_jsx(ActionsIcon, {}),
      children: actions.map(action_1 => /*#__PURE__*/_jsx(MenuItem, {
        onClick: () => runAction(action_1),
        children: action_1.label
      }, action_1.label))
    });
    $[54] = actions;
    $[55] = api.selectedCount;
    $[56] = runAction;
    $[57] = t19;
  } else {
    t19 = $[57];
  }
  let t20;
  if ($[58] !== exportFormats || $[59] !== exportTooltip || $[60] !== importTooltip || $[61] !== onExport || $[62] !== onImport || $[63] !== runExport || $[64] !== settings) {
    t20 = (onExport || onImport || settings) && /*#__PURE__*/_jsxs(Menu, {
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
    $[58] = exportFormats;
    $[59] = exportTooltip;
    $[60] = importTooltip;
    $[61] = onExport;
    $[62] = onImport;
    $[63] = runExport;
    $[64] = settings;
    $[65] = t20;
  } else {
    t20 = $[65];
  }
  let t21;
  if ($[66] !== t17 || $[67] !== t18 || $[68] !== t19 || $[69] !== t20) {
    t21 = /*#__PURE__*/_jsx(Stack, {
      sx: _temp2,
      children: /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        spacing: "sm",
        sx: t15,
        children: [t17, t18, t19, t20]
      })
    });
    $[66] = t17;
    $[67] = t18;
    $[68] = t19;
    $[69] = t20;
    $[70] = t21;
  } else {
    t21 = $[70];
  }
  let t22;
  if ($[71] !== api.selectedCount || $[72] !== executeAction || $[73] !== pendingAction) {
    t22 = pendingAction && /*#__PURE__*/_jsx(ConfirmDialog, {
      open: true,
      title: pendingAction.confirmationMessage(api.selectedCount),
      description: pendingAction.confirmationDescription?.(api.selectedCount),
      confirmLabel: pendingAction.label,
      confirmColor: pendingAction.confirmColor ?? "error",
      onCancel: () => setPendingAction(null),
      onConfirm: () => {
        const action_2 = pendingAction;
        setPendingAction(null);
        executeAction(action_2);
      }
    });
    $[71] = api.selectedCount;
    $[72] = executeAction;
    $[73] = pendingAction;
    $[74] = t22;
  } else {
    t22 = $[74];
  }
  let t23;
  if ($[75] !== filterColumns || $[76] !== manageOpen || $[77] !== presets) {
    t23 = presets && filterColumns && /*#__PURE__*/_jsx(ManageViewsDialog, {
      open: manageOpen,
      onClose: () => setManageOpen(false),
      presets: presets,
      filterColumns: filterColumns
    });
    $[75] = filterColumns;
    $[76] = manageOpen;
    $[77] = presets;
    $[78] = t23;
  } else {
    t23 = $[78];
  }
  let t24;
  if ($[79] !== filterColumns || $[80] !== presets || $[81] !== settings || $[82] !== settingsOpen) {
    t24 = settings && /*#__PURE__*/_jsx(DataTableSettingsDialog, {
      open: settingsOpen,
      onClose: () => setSettingsOpen(false),
      onManageViews: presets && filterColumns ? () => {
        setSettingsOpen(false);
        setManageOpen(true);
      } : undefined
    });
    $[79] = filterColumns;
    $[80] = presets;
    $[81] = settings;
    $[82] = settingsOpen;
    $[83] = t24;
  } else {
    t24 = $[83];
  }
  let t25;
  if ($[84] === Symbol.for("react.memo_cache_sentinel")) {
    t25 = {
      p: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      flex: "1 1 auto",
      minHeight: 0
    };
    $[84] = t25;
  } else {
    t25 = $[84];
  }
  let t26;
  if ($[85] !== emptyMessage || $[86] !== errorMessage || $[87] !== infiniteScroll || $[88] !== noResultsMessage || $[89] !== onRowClick || $[90] !== onRowIntent || $[91] !== restoreScroll || $[92] !== rowClass || $[93] !== stickyHeader || $[94] !== withSelection) {
    t26 = /*#__PURE__*/_jsx(Card, {
      sx: t25,
      children: /*#__PURE__*/_jsx(DataTableBody, {
        selectable: withSelection,
        emptyMessage: emptyMessage,
        noResultsMessage: noResultsMessage,
        errorMessage: errorMessage,
        stickyHeader: stickyHeader,
        onRowClick: onRowClick,
        onRowIntent: onRowIntent,
        rowClass: rowClass,
        infiniteScroll: infiniteScroll,
        restoreScroll: restoreScroll
      })
    });
    $[85] = emptyMessage;
    $[86] = errorMessage;
    $[87] = infiniteScroll;
    $[88] = noResultsMessage;
    $[89] = onRowClick;
    $[90] = onRowIntent;
    $[91] = restoreScroll;
    $[92] = rowClass;
    $[93] = stickyHeader;
    $[94] = withSelection;
    $[95] = t26;
  } else {
    t26 = $[95];
  }
  let t27;
  if ($[96] !== api.groupBy.length || $[97] !== api.groupsTotal || $[98] !== api.total || $[99] !== groupsPerPageOptions || $[100] !== infiniteScroll || $[101] !== rowsPerPageOptions) {
    t27 = (!infiniteScroll || api.groupBy.length > 0) && /*#__PURE__*/_jsxs(Box, {
      "data-table-footer": "",
      sx: _temp3,
      children: [!infiniteScroll && /*#__PURE__*/_jsx(DataTablePagination, {
        rowsPerPageOptions: rowsPerPageOptions,
        groupsPerPageOptions: groupsPerPageOptions
      }), infiniteScroll && /*#__PURE__*/_jsxs(Typography, {
        sx: {
          fontSize: "md",
          fontWeight: 500,
          color: "text.secondary",
          fontVariantNumeric: "tabular-nums"
        },
        children: [api.groupsTotal, " groups \xB7 ", api.total, " records"]
      })]
    });
    $[96] = api.groupBy.length;
    $[97] = api.groupsTotal;
    $[98] = api.total;
    $[99] = groupsPerPageOptions;
    $[100] = infiniteScroll;
    $[101] = rowsPerPageOptions;
    $[102] = t27;
  } else {
    t27 = $[102];
  }
  let t28;
  if ($[103] !== api || $[104] !== t14 || $[105] !== t21 || $[106] !== t22 || $[107] !== t23 || $[108] !== t24 || $[109] !== t26 || $[110] !== t27) {
    t28 = /*#__PURE__*/_jsxs(DataTableRoot, {
      api: api,
      children: [t14, t21, t22, t23, t24, t26, t27]
    });
    $[103] = api;
    $[104] = t14;
    $[105] = t21;
    $[106] = t22;
    $[107] = t23;
    $[108] = t24;
    $[109] = t26;
    $[110] = t27;
    $[111] = t28;
  } else {
    t28 = $[111];
  }
  return t28;
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