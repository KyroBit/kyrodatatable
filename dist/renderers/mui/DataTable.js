import { c as _c } from "react/compiler-runtime";
import { useMemo, useState } from 'react';
import { Box, Button, Card, Menu, MenuItem, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
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
import { ActionsIcon, ExportIcon, ImportIcon, SettingIcon } from './icons.js';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The full list-page assembly: views pills + manage, create, search with the
 * filter popover, group-by, export/import, contextual bulk actions, the table
 * card, and top-right pagination. Every section is opt-in through props; for
 * a custom layout compose the exported pieces yourself.
 */
const withTooltip = (title, child) => title ? /*#__PURE__*/_jsx(Tooltip, {
  title: title,
  children: /*#__PURE__*/_jsx("span", {
    children: child
  })
}) : child;
export function DataTable(t0) {
  const $ = _c(118);
  const {
    api,
    presets,
    filterColumns,
    searchPlaceholder,
    searchWidth,
    toolbarEnd,
    onExport,
    exportFormats: t1,
    filterRenderers,
    onImport,
    exportTooltip,
    importTooltip,
    actions,
    selectable,
    settings: t2,
    onRowClick,
    onRowIntent,
    rowClass,
    emptyMessage,
    noResultsMessage,
    errorMessage,
    stickyHeader,
    rowsPerPageOptions,
    groupsPerPageOptions
  } = t0;
  let t3;
  if ($[0] !== t1) {
    t3 = t1 === undefined ? [{
      id: "csv",
      label: "CSV"
    }] : t1;
    $[0] = t1;
    $[1] = t3;
  } else {
    t3 = $[1];
  }
  const exportFormats = t3;
  const settings = t2 === undefined ? true : t2;
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [actionsAnchor, setActionsAnchor] = useState(null);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  let t4;
  if ($[2] !== api.filters) {
    t4 = api.filters ?? {};
    $[2] = api.filters;
    $[3] = t4;
  } else {
    t4 = $[3];
  }
  const filters = t4;
  const withSelection = Boolean(selectable || actions && actions.length > 0);
  let t5;
  bb0: {
    if (selectedPresetId && presets) {
      let selected;
      let t6;
      if ($[4] !== filters || $[5] !== presets.all || $[6] !== selectedPresetId) {
        let t7;
        if ($[9] !== selectedPresetId) {
          t7 = p => p.id === selectedPresetId;
          $[9] = selectedPresetId;
          $[10] = t7;
        } else {
          t7 = $[10];
        }
        selected = presets.all.find(t7);
        t6 = selected && filterValuesEqual(selected.filters, filters);
        $[4] = filters;
        $[5] = presets.all;
        $[6] = selectedPresetId;
        $[7] = selected;
        $[8] = t6;
      } else {
        selected = $[7];
        t6 = $[8];
      }
      if (t6) {
        t5 = selected.id;
        break bb0;
      }
    }
    if (countFilterValues(filters) === 0) {
      t5 = "all";
      break bb0;
    }
    let t6;
    if ($[11] !== filters || $[12] !== presets?.all) {
      t6 = presets?.all.find(p_0 => filterValuesEqual(p_0.filters, filters))?.id ?? null;
      $[11] = filters;
      $[12] = presets?.all;
      $[13] = t6;
    } else {
      t6 = $[13];
    }
    t5 = t6;
  }
  const activePresetId = t5;
  let t6;
  if ($[14] !== api) {
    t6 = (next, presetId) => {
      setSelectedPresetId(presetId ?? null);
      api.setFilters(next);
    };
    $[14] = api;
    $[15] = t6;
  } else {
    t6 = $[15];
  }
  const applyFilters = t6;
  let t7;
  if ($[16] !== api) {
    t7 = async action => {
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
    $[16] = api;
    $[17] = t7;
  } else {
    t7 = $[17];
  }
  const executeAction = t7;
  let t8;
  if ($[18] !== executeAction) {
    t8 = action_0 => {
      setActionsAnchor(null);
      if (action_0.confirmationMessage) {
        setPendingAction(action_0);
        return;
      }
      executeAction(action_0);
    };
    $[18] = executeAction;
    $[19] = t8;
  } else {
    t8 = $[19];
  }
  const runAction = t8;
  let t9;
  if ($[20] !== api.filters || $[21] !== api.groupBy || $[22] !== api.search || $[23] !== api.selection || $[24] !== api.sort || $[25] !== onExport) {
    t9 = format => {
      setExportAnchor(null);
      onExport?.({
        format,
        search: api.search,
        sort: api.sort,
        filters: api.filters,
        groupBy: api.groupBy,
        selection: api.selection
      });
    };
    $[20] = api.filters;
    $[21] = api.groupBy;
    $[22] = api.search;
    $[23] = api.selection;
    $[24] = api.sort;
    $[25] = onExport;
    $[26] = t9;
  } else {
    t9 = $[26];
  }
  const runExport = t9;
  let t10;
  if ($[27] !== activePresetId || $[28] !== applyFilters || $[29] !== presets || $[30] !== toolbarEnd) {
    t10 = (presets || toolbarEnd) && /*#__PURE__*/_jsxs(Stack, {
      direction: {
        xs: "column",
        sm: "row"
      },
      sx: {
        alignItems: {
          xs: "stretch",
          sm: "center"
        },
        justifyContent: "space-between",
        gap: 1.5
      },
      children: [/*#__PURE__*/_jsx(Stack, {
        direction: "row",
        spacing: 1,
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
      }), /*#__PURE__*/_jsx(Stack, {
        direction: "row",
        spacing: 1,
        sx: {
          alignItems: "center",
          flexShrink: 0
        },
        children: toolbarEnd
      })]
    });
    $[27] = activePresetId;
    $[28] = applyFilters;
    $[29] = presets;
    $[30] = toolbarEnd;
    $[31] = t10;
  } else {
    t10 = $[31];
  }
  let t11;
  let t12;
  if ($[32] === Symbol.for("react.memo_cache_sentinel")) {
    t11 = {
      xs: "column",
      sm: "row"
    };
    t12 = {
      alignItems: {
        xs: "stretch",
        sm: "center"
      },
      justifyContent: "space-between",
      gap: 1,
      minHeight: 40
    };
    $[32] = t11;
    $[33] = t12;
  } else {
    t11 = $[32];
    t12 = $[33];
  }
  let t13;
  if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
    t13 = {
      alignItems: "center",
      flexWrap: "wrap",
      minWidth: 0
    };
    $[34] = t13;
  } else {
    t13 = $[34];
  }
  let t14;
  if ($[35] !== searchPlaceholder || $[36] !== searchWidth) {
    t14 = /*#__PURE__*/_jsx(DataTableSearchField, {
      placeholder: searchPlaceholder,
      width: searchWidth,
      alwaysOpen: true
    });
    $[35] = searchPlaceholder;
    $[36] = searchWidth;
    $[37] = t14;
  } else {
    t14 = $[37];
  }
  let t15;
  if ($[38] !== applyFilters || $[39] !== filterColumns || $[40] !== filterRenderers || $[41] !== presets) {
    t15 = filterColumns && /*#__PURE__*/_jsx(DataTableFilterButton, {
      filterColumns: filterColumns,
      presets: presets,
      filterRenderers: filterRenderers,
      onApply: applyFilters
    });
    $[38] = applyFilters;
    $[39] = filterColumns;
    $[40] = filterRenderers;
    $[41] = presets;
    $[42] = t15;
  } else {
    t15 = $[42];
  }
  let t16;
  if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = {
      alignItems: "center",
      flexWrap: "nowrap",
      overflowX: "auto",
      minWidth: 0,
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none"
      }
    };
    $[43] = t16;
  } else {
    t16 = $[43];
  }
  let t17;
  if ($[44] !== api.groupByColumns) {
    t17 = api.groupByColumns && api.groupByColumns.length > 0 && /*#__PURE__*/_jsx(DataTableGroupMenu, {});
    $[44] = api.groupByColumns;
    $[45] = t17;
  } else {
    t17 = $[45];
  }
  let t18;
  if ($[46] !== importTooltip || $[47] !== onImport) {
    t18 = onImport && withTooltip(importTooltip, /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ImportIcon, {}),
      label: "Import",
      menu: false,
      onClick: onImport
    }));
    $[46] = importTooltip;
    $[47] = onImport;
    $[48] = t18;
  } else {
    t18 = $[48];
  }
  let t19;
  if ($[49] !== exportFormats || $[50] !== exportTooltip || $[51] !== onExport || $[52] !== runExport) {
    t19 = onExport && withTooltip(exportTooltip, /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ExportIcon, {}),
      label: "Export",
      menu: exportFormats.length > 1,
      onClick: e => {
        if (exportFormats.length > 1) {
          setExportAnchor(e.currentTarget);
        } else {
          runExport(exportFormats[0]?.id ?? "csv");
        }
      }
    }));
    $[49] = exportFormats;
    $[50] = exportTooltip;
    $[51] = onExport;
    $[52] = runExport;
    $[53] = t19;
  } else {
    t19 = $[53];
  }
  let t20;
  if ($[54] !== actions || $[55] !== api.selectedCount) {
    t20 = actions && actions.length > 0 && api.selectedCount > 0 && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ActionsIcon, {}),
      label: `Actions (${api.selectedCount})`,
      onClick: e_0 => setActionsAnchor(e_0.currentTarget)
    });
    $[54] = actions;
    $[55] = api.selectedCount;
    $[56] = t20;
  } else {
    t20 = $[56];
  }
  let t21;
  if ($[57] !== settings) {
    t21 = settings && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(SettingIcon, {}),
      label: "Settings",
      menu: false,
      onClick: () => setSettingsOpen(true)
    });
    $[57] = settings;
    $[58] = t21;
  } else {
    t21 = $[58];
  }
  let t22;
  if ($[59] !== t17 || $[60] !== t18 || $[61] !== t19 || $[62] !== t20 || $[63] !== t21) {
    t22 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      sx: t16,
      children: [t17, t18, t19, t20, t21]
    });
    $[59] = t17;
    $[60] = t18;
    $[61] = t19;
    $[62] = t20;
    $[63] = t21;
    $[64] = t22;
  } else {
    t22 = $[64];
  }
  let t23;
  if ($[65] !== t14 || $[66] !== t15 || $[67] !== t22) {
    t23 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      sx: t13,
      children: [t14, t15, t22]
    });
    $[65] = t14;
    $[66] = t15;
    $[67] = t22;
    $[68] = t23;
  } else {
    t23 = $[68];
  }
  let t24;
  if ($[69] === Symbol.for("react.memo_cache_sentinel")) {
    t24 = {
      minHeight: 40,
      display: "flex",
      alignItems: "center",
      flexShrink: 0
    };
    $[69] = t24;
  } else {
    t24 = $[69];
  }
  let t25;
  if ($[70] !== groupsPerPageOptions || $[71] !== rowsPerPageOptions) {
    t25 = /*#__PURE__*/_jsx(Box, {
      sx: t24,
      children: /*#__PURE__*/_jsx(DataTablePagination, {
        rowsPerPageOptions: rowsPerPageOptions,
        groupsPerPageOptions: groupsPerPageOptions
      })
    });
    $[70] = groupsPerPageOptions;
    $[71] = rowsPerPageOptions;
    $[72] = t25;
  } else {
    t25 = $[72];
  }
  let t26;
  if ($[73] !== t23 || $[74] !== t25) {
    t26 = /*#__PURE__*/_jsxs(Stack, {
      direction: t11,
      sx: t12,
      children: [t23, t25]
    });
    $[73] = t23;
    $[74] = t25;
    $[75] = t26;
  } else {
    t26 = $[75];
  }
  let t27;
  if ($[76] !== actions || $[77] !== actionsAnchor || $[78] !== runAction) {
    t27 = actions && actions.length > 0 && /*#__PURE__*/_jsx(Menu, {
      anchorEl: actionsAnchor,
      open: Boolean(actionsAnchor),
      onClose: () => setActionsAnchor(null),
      children: actions.map(action_1 => /*#__PURE__*/_jsx(MenuItem, {
        onClick: () => {
          runAction(action_1);
        },
        children: action_1.label
      }, action_1.label))
    });
    $[76] = actions;
    $[77] = actionsAnchor;
    $[78] = runAction;
    $[79] = t27;
  } else {
    t27 = $[79];
  }
  let t28;
  if ($[80] !== api.selectedCount || $[81] !== executeAction || $[82] !== pendingAction) {
    t28 = pendingAction && /*#__PURE__*/_jsx(ConfirmDialog, {
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
    $[80] = api.selectedCount;
    $[81] = executeAction;
    $[82] = pendingAction;
    $[83] = t28;
  } else {
    t28 = $[83];
  }
  let t29;
  if ($[84] !== exportAnchor || $[85] !== exportFormats || $[86] !== onExport || $[87] !== runExport) {
    t29 = onExport && exportFormats.length > 1 && /*#__PURE__*/_jsx(Menu, {
      anchorEl: exportAnchor,
      open: Boolean(exportAnchor),
      onClose: () => setExportAnchor(null),
      children: exportFormats.map(format_0 => /*#__PURE__*/_jsx(MenuItem, {
        onClick: () => runExport(format_0.id),
        children: format_0.label
      }, format_0.id))
    });
    $[84] = exportAnchor;
    $[85] = exportFormats;
    $[86] = onExport;
    $[87] = runExport;
    $[88] = t29;
  } else {
    t29 = $[88];
  }
  let t30;
  if ($[89] !== filterColumns || $[90] !== manageOpen || $[91] !== presets) {
    t30 = presets && filterColumns && /*#__PURE__*/_jsx(ManageViewsDialog, {
      open: manageOpen,
      onClose: () => setManageOpen(false),
      presets: presets,
      filterColumns: filterColumns
    });
    $[89] = filterColumns;
    $[90] = manageOpen;
    $[91] = presets;
    $[92] = t30;
  } else {
    t30 = $[92];
  }
  let t31;
  if ($[93] !== filterColumns || $[94] !== presets || $[95] !== settings || $[96] !== settingsOpen) {
    t31 = settings && /*#__PURE__*/_jsx(DataTableSettingsDialog, {
      open: settingsOpen,
      onClose: () => setSettingsOpen(false),
      onManageViews: presets && filterColumns ? () => {
        setSettingsOpen(false);
        setManageOpen(true);
      } : undefined
    });
    $[93] = filterColumns;
    $[94] = presets;
    $[95] = settings;
    $[96] = settingsOpen;
    $[97] = t31;
  } else {
    t31 = $[97];
  }
  let t32;
  if ($[98] === Symbol.for("react.memo_cache_sentinel")) {
    t32 = {
      p: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      minHeight: 0
    };
    $[98] = t32;
  } else {
    t32 = $[98];
  }
  let t33;
  if ($[99] !== emptyMessage || $[100] !== errorMessage || $[101] !== noResultsMessage || $[102] !== onRowClick || $[103] !== onRowIntent || $[104] !== rowClass || $[105] !== stickyHeader || $[106] !== withSelection) {
    t33 = /*#__PURE__*/_jsx(Card, {
      sx: t32,
      children: /*#__PURE__*/_jsx(DataTableBody, {
        selectable: withSelection,
        emptyMessage: emptyMessage,
        noResultsMessage: noResultsMessage,
        errorMessage: errorMessage,
        stickyHeader: stickyHeader,
        onRowClick: onRowClick,
        onRowIntent: onRowIntent,
        rowClass: rowClass
      })
    });
    $[99] = emptyMessage;
    $[100] = errorMessage;
    $[101] = noResultsMessage;
    $[102] = onRowClick;
    $[103] = onRowIntent;
    $[104] = rowClass;
    $[105] = stickyHeader;
    $[106] = withSelection;
    $[107] = t33;
  } else {
    t33 = $[107];
  }
  let t34;
  if ($[108] !== api || $[109] !== t10 || $[110] !== t26 || $[111] !== t27 || $[112] !== t28 || $[113] !== t29 || $[114] !== t30 || $[115] !== t31 || $[116] !== t33) {
    t34 = /*#__PURE__*/_jsxs(DataTableRoot, {
      api: api,
      children: [t10, t26, t27, t28, t29, t30, t31, t33]
    });
    $[108] = api;
    $[109] = t10;
    $[110] = t26;
    $[111] = t27;
    $[112] = t28;
    $[113] = t29;
    $[114] = t30;
    $[115] = t31;
    $[116] = t33;
    $[117] = t34;
  } else {
    t34 = $[117];
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
function ToolbarBtn(t0) {
  const $ = _c(7);
  const {
    icon,
    label,
    onClick,
    menu: t1
  } = t0;
  const menu = t1 === undefined ? true : t1;
  let t2;
  if ($[0] !== menu) {
    t2 = menu ? /*#__PURE__*/_jsx(ExpandMoreRoundedIcon, {}) : undefined;
    $[0] = menu;
    $[1] = t2;
  } else {
    t2 = $[1];
  }
  let t3;
  if ($[2] !== icon || $[3] !== label || $[4] !== onClick || $[5] !== t2) {
    t3 = /*#__PURE__*/_jsx(Button, {
      variant: "outlined",
      color: "inherit",
      startIcon: icon,
      endIcon: t2,
      onClick: onClick,
      children: label
    });
    $[2] = icon;
    $[3] = label;
    $[4] = onClick;
    $[5] = t2;
    $[6] = t3;
  } else {
    t3 = $[6];
  }
  return t3;
}
DataTable.Root = DataTableRoot;
DataTable.SearchField = DataTableSearchField;
DataTable.Body = DataTableBody;
DataTable.Pagination = DataTablePagination;