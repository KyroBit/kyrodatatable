import { c as _c } from "react/compiler-runtime";
import { useMemo, useState } from 'react';
import { Box, Button, Card, Menu, MenuItem, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
  const $ = _c(119);
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
    rowsPerPageOptions
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
  const [actionsAnchor, setActionsAnchor] = useState(null);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  let t5;
  if ($[2] !== api.filters) {
    t5 = api.filters ?? {};
    $[2] = api.filters;
    $[3] = t5;
  } else {
    t5 = $[3];
  }
  const filters = t5;
  const withSelection = Boolean(selectable || actions && actions.length > 0);
  let t6;
  bb0: {
    if (selectedPresetId && presets) {
      let selected;
      let t7;
      if ($[4] !== filters || $[5] !== presets.all || $[6] !== selectedPresetId) {
        let t8;
        if ($[9] !== selectedPresetId) {
          t8 = p => p.id === selectedPresetId;
          $[9] = selectedPresetId;
          $[10] = t8;
        } else {
          t8 = $[10];
        }
        selected = presets.all.find(t8);
        t7 = selected && filterValuesEqual(selected.filters, filters);
        $[4] = filters;
        $[5] = presets.all;
        $[6] = selectedPresetId;
        $[7] = selected;
        $[8] = t7;
      } else {
        selected = $[7];
        t7 = $[8];
      }
      if (t7) {
        t6 = selected.id;
        break bb0;
      }
    }
    if (countFilterValues(filters) === 0) {
      t6 = "all";
      break bb0;
    }
    let t7;
    if ($[11] !== filters || $[12] !== presets?.all) {
      t7 = presets?.all.find(p_0 => filterValuesEqual(p_0.filters, filters))?.id ?? null;
      $[11] = filters;
      $[12] = presets?.all;
      $[13] = t7;
    } else {
      t7 = $[13];
    }
    t6 = t7;
  }
  const activePresetId = t6;
  let t7;
  if ($[14] !== api) {
    t7 = (next, presetId) => {
      setSelectedPresetId(presetId ?? null);
      api.setFilters(next);
    };
    $[14] = api;
    $[15] = t7;
  } else {
    t7 = $[15];
  }
  const applyFilters = t7;
  let t8;
  if ($[16] !== api) {
    t8 = async action => {
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
    $[17] = t8;
  } else {
    t8 = $[17];
  }
  const executeAction = t8;
  let t9;
  if ($[18] !== executeAction) {
    t9 = action_0 => {
      setActionsAnchor(null);
      if (action_0.confirmationMessage) {
        setPendingAction(action_0);
        return;
      }
      executeAction(action_0);
    };
    $[18] = executeAction;
    $[19] = t9;
  } else {
    t9 = $[19];
  }
  const runAction = t9;
  let t10;
  if ($[20] !== api.filters || $[21] !== api.groupBy || $[22] !== api.search || $[23] !== api.selection || $[24] !== api.sort || $[25] !== onExport) {
    t10 = format => {
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
    $[26] = t10;
  } else {
    t10 = $[26];
  }
  const runExport = t10;
  let t11;
  if ($[27] !== activePresetId || $[28] !== applyFilters || $[29] !== createLabel || $[30] !== onCreate || $[31] !== presets || $[32] !== toolbarEnd) {
    t11 = (presets || onCreate || toolbarEnd) && /*#__PURE__*/_jsxs(Stack, {
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
      }), /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        spacing: 1,
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
    $[27] = activePresetId;
    $[28] = applyFilters;
    $[29] = createLabel;
    $[30] = onCreate;
    $[31] = presets;
    $[32] = toolbarEnd;
    $[33] = t11;
  } else {
    t11 = $[33];
  }
  let t12;
  let t13;
  if ($[34] === Symbol.for("react.memo_cache_sentinel")) {
    t12 = {
      xs: "column",
      sm: "row"
    };
    t13 = {
      alignItems: {
        xs: "stretch",
        sm: "center"
      },
      justifyContent: "space-between",
      gap: 1,
      minHeight: 40
    };
    $[34] = t12;
    $[35] = t13;
  } else {
    t12 = $[34];
    t13 = $[35];
  }
  let t14;
  if ($[36] === Symbol.for("react.memo_cache_sentinel")) {
    t14 = {
      alignItems: "center",
      flexWrap: "wrap",
      minWidth: 0
    };
    $[36] = t14;
  } else {
    t14 = $[36];
  }
  let t15;
  if ($[37] !== searchPlaceholder || $[38] !== searchWidth) {
    t15 = /*#__PURE__*/_jsx(DataTableSearchField, {
      placeholder: searchPlaceholder,
      width: searchWidth,
      alwaysOpen: true
    });
    $[37] = searchPlaceholder;
    $[38] = searchWidth;
    $[39] = t15;
  } else {
    t15 = $[39];
  }
  let t16;
  if ($[40] !== applyFilters || $[41] !== filterColumns || $[42] !== filterRenderers || $[43] !== presets) {
    t16 = filterColumns && /*#__PURE__*/_jsx(DataTableFilterButton, {
      filterColumns: filterColumns,
      presets: presets,
      filterRenderers: filterRenderers,
      onApply: applyFilters
    });
    $[40] = applyFilters;
    $[41] = filterColumns;
    $[42] = filterRenderers;
    $[43] = presets;
    $[44] = t16;
  } else {
    t16 = $[44];
  }
  let t17;
  if ($[45] === Symbol.for("react.memo_cache_sentinel")) {
    t17 = {
      alignItems: "center",
      flexWrap: "nowrap",
      overflowX: "auto",
      minWidth: 0,
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none"
      }
    };
    $[45] = t17;
  } else {
    t17 = $[45];
  }
  let t18;
  if ($[46] !== api.groupByColumns) {
    t18 = api.groupByColumns && api.groupByColumns.length > 0 && /*#__PURE__*/_jsx(DataTableGroupMenu, {});
    $[46] = api.groupByColumns;
    $[47] = t18;
  } else {
    t18 = $[47];
  }
  let t19;
  if ($[48] !== importTooltip || $[49] !== onImport) {
    t19 = onImport && withTooltip(importTooltip, /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ImportIcon, {}),
      label: "Import",
      menu: false,
      onClick: onImport
    }));
    $[48] = importTooltip;
    $[49] = onImport;
    $[50] = t19;
  } else {
    t19 = $[50];
  }
  let t20;
  if ($[51] !== exportFormats || $[52] !== exportTooltip || $[53] !== onExport || $[54] !== runExport) {
    t20 = onExport && withTooltip(exportTooltip, /*#__PURE__*/_jsx(ToolbarBtn, {
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
    $[51] = exportFormats;
    $[52] = exportTooltip;
    $[53] = onExport;
    $[54] = runExport;
    $[55] = t20;
  } else {
    t20 = $[55];
  }
  let t21;
  if ($[56] !== actions || $[57] !== api.selectedCount) {
    t21 = actions && actions.length > 0 && api.selectedCount > 0 && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ActionsIcon, {}),
      label: `Actions (${api.selectedCount})`,
      onClick: e_0 => setActionsAnchor(e_0.currentTarget)
    });
    $[56] = actions;
    $[57] = api.selectedCount;
    $[58] = t21;
  } else {
    t21 = $[58];
  }
  let t22;
  if ($[59] !== settings) {
    t22 = settings && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(SettingIcon, {}),
      label: "Settings",
      menu: false,
      onClick: () => setSettingsOpen(true)
    });
    $[59] = settings;
    $[60] = t22;
  } else {
    t22 = $[60];
  }
  let t23;
  if ($[61] !== t18 || $[62] !== t19 || $[63] !== t20 || $[64] !== t21 || $[65] !== t22) {
    t23 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      sx: t17,
      children: [t18, t19, t20, t21, t22]
    });
    $[61] = t18;
    $[62] = t19;
    $[63] = t20;
    $[64] = t21;
    $[65] = t22;
    $[66] = t23;
  } else {
    t23 = $[66];
  }
  let t24;
  if ($[67] !== t15 || $[68] !== t16 || $[69] !== t23) {
    t24 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      sx: t14,
      children: [t15, t16, t23]
    });
    $[67] = t15;
    $[68] = t16;
    $[69] = t23;
    $[70] = t24;
  } else {
    t24 = $[70];
  }
  let t25;
  if ($[71] === Symbol.for("react.memo_cache_sentinel")) {
    t25 = {
      minHeight: 40,
      display: "flex",
      alignItems: "center",
      flexShrink: 0
    };
    $[71] = t25;
  } else {
    t25 = $[71];
  }
  let t26;
  if ($[72] !== rowsPerPageOptions) {
    t26 = /*#__PURE__*/_jsx(Box, {
      sx: t25,
      children: /*#__PURE__*/_jsx(DataTablePagination, {
        rowsPerPageOptions: rowsPerPageOptions
      })
    });
    $[72] = rowsPerPageOptions;
    $[73] = t26;
  } else {
    t26 = $[73];
  }
  let t27;
  if ($[74] !== t24 || $[75] !== t26) {
    t27 = /*#__PURE__*/_jsxs(Stack, {
      direction: t12,
      sx: t13,
      children: [t24, t26]
    });
    $[74] = t24;
    $[75] = t26;
    $[76] = t27;
  } else {
    t27 = $[76];
  }
  let t28;
  if ($[77] !== actions || $[78] !== actionsAnchor || $[79] !== runAction) {
    t28 = actions && actions.length > 0 && /*#__PURE__*/_jsx(Menu, {
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
    $[77] = actions;
    $[78] = actionsAnchor;
    $[79] = runAction;
    $[80] = t28;
  } else {
    t28 = $[80];
  }
  let t29;
  if ($[81] !== api.selectedCount || $[82] !== executeAction || $[83] !== pendingAction) {
    t29 = pendingAction && /*#__PURE__*/_jsx(ConfirmDialog, {
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
    $[81] = api.selectedCount;
    $[82] = executeAction;
    $[83] = pendingAction;
    $[84] = t29;
  } else {
    t29 = $[84];
  }
  let t30;
  if ($[85] !== exportAnchor || $[86] !== exportFormats || $[87] !== onExport || $[88] !== runExport) {
    t30 = onExport && exportFormats.length > 1 && /*#__PURE__*/_jsx(Menu, {
      anchorEl: exportAnchor,
      open: Boolean(exportAnchor),
      onClose: () => setExportAnchor(null),
      children: exportFormats.map(format_0 => /*#__PURE__*/_jsx(MenuItem, {
        onClick: () => runExport(format_0.id),
        children: format_0.label
      }, format_0.id))
    });
    $[85] = exportAnchor;
    $[86] = exportFormats;
    $[87] = onExport;
    $[88] = runExport;
    $[89] = t30;
  } else {
    t30 = $[89];
  }
  let t31;
  if ($[90] !== filterColumns || $[91] !== manageOpen || $[92] !== presets) {
    t31 = presets && filterColumns && /*#__PURE__*/_jsx(ManageViewsDialog, {
      open: manageOpen,
      onClose: () => setManageOpen(false),
      presets: presets,
      filterColumns: filterColumns
    });
    $[90] = filterColumns;
    $[91] = manageOpen;
    $[92] = presets;
    $[93] = t31;
  } else {
    t31 = $[93];
  }
  let t32;
  if ($[94] !== filterColumns || $[95] !== presets || $[96] !== settings || $[97] !== settingsOpen) {
    t32 = settings && /*#__PURE__*/_jsx(DataTableSettingsDialog, {
      open: settingsOpen,
      onClose: () => setSettingsOpen(false),
      onManageViews: presets && filterColumns ? () => {
        setSettingsOpen(false);
        setManageOpen(true);
      } : undefined
    });
    $[94] = filterColumns;
    $[95] = presets;
    $[96] = settings;
    $[97] = settingsOpen;
    $[98] = t32;
  } else {
    t32 = $[98];
  }
  let t33;
  if ($[99] === Symbol.for("react.memo_cache_sentinel")) {
    t33 = {
      p: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      minHeight: 0
    };
    $[99] = t33;
  } else {
    t33 = $[99];
  }
  let t34;
  if ($[100] !== emptyMessage || $[101] !== errorMessage || $[102] !== noResultsMessage || $[103] !== onRowClick || $[104] !== onRowIntent || $[105] !== rowClass || $[106] !== stickyHeader || $[107] !== withSelection) {
    t34 = /*#__PURE__*/_jsx(Card, {
      sx: t33,
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
    $[100] = emptyMessage;
    $[101] = errorMessage;
    $[102] = noResultsMessage;
    $[103] = onRowClick;
    $[104] = onRowIntent;
    $[105] = rowClass;
    $[106] = stickyHeader;
    $[107] = withSelection;
    $[108] = t34;
  } else {
    t34 = $[108];
  }
  let t35;
  if ($[109] !== api || $[110] !== t11 || $[111] !== t27 || $[112] !== t28 || $[113] !== t29 || $[114] !== t30 || $[115] !== t31 || $[116] !== t32 || $[117] !== t34) {
    t35 = /*#__PURE__*/_jsxs(DataTableRoot, {
      api: api,
      children: [t11, t27, t28, t29, t30, t31, t32, t34]
    });
    $[109] = api;
    $[110] = t11;
    $[111] = t27;
    $[112] = t28;
    $[113] = t29;
    $[114] = t30;
    $[115] = t31;
    $[116] = t32;
    $[117] = t34;
    $[118] = t35;
  } else {
    t35 = $[118];
  }
  return t35;
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