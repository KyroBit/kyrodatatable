import { c as _c } from "react/compiler-runtime";
import { useMemo, useState } from 'react';
import { Box, Button, Card, Menu, MenuItem, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { countFilterValues, filterValuesEqual } from '@kyrobit/datatable';
import { DataTableRoot } from './context.js';
import { DataTableSearchField } from './SearchField.js';
import { DataTableBody } from './Body.js';
import { DataTablePagination } from './Pagination.js';
import { ManageViewsDialog } from './FilterMenu.js';
import { DataTableFilterButton } from './FilterButton.js';
import { DataTableSettingsDialog } from './SettingsDialog.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { ActionsIcon, ExportIcon, GroupIcon, ImportIcon, SettingIcon } from './icons.js';
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
  const $ = _c(144);
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
  const [groupAnchor, setGroupAnchor] = useState(null);
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
  if ($[16] !== api.groupBy || $[17] !== api.groupByColumns) {
    t8 = api.groupByColumns?.find(g => g.field === api.groupBy)?.label;
    $[16] = api.groupBy;
    $[17] = api.groupByColumns;
    $[18] = t8;
  } else {
    t8 = $[18];
  }
  const activeGroupLabel = t8;
  let t9;
  if ($[19] !== api) {
    t9 = async action => {
      await action.handle(api.selectedIds);
      api.clearSelection();
      if (api.groupBy) {
        api.setGroupBy(api.groupBy);
      }
      api.refetch();
    };
    $[19] = api;
    $[20] = t9;
  } else {
    t9 = $[20];
  }
  const executeAction = t9;
  let t10;
  if ($[21] !== executeAction) {
    t10 = action_0 => {
      setActionsAnchor(null);
      if (action_0.confirmationMessage) {
        setPendingAction(action_0);
        return;
      }
      executeAction(action_0);
    };
    $[21] = executeAction;
    $[22] = t10;
  } else {
    t10 = $[22];
  }
  const runAction = t10;
  let t11;
  if ($[23] !== api.filters || $[24] !== api.groupBy || $[25] !== api.search || $[26] !== api.selectedIds || $[27] !== api.sort || $[28] !== onExport) {
    t11 = format => {
      setExportAnchor(null);
      onExport?.({
        format,
        search: api.search,
        sort: api.sort,
        filters: api.filters,
        groupBy: api.groupBy,
        selectedIds: api.selectedIds
      });
    };
    $[23] = api.filters;
    $[24] = api.groupBy;
    $[25] = api.search;
    $[26] = api.selectedIds;
    $[27] = api.sort;
    $[28] = onExport;
    $[29] = t11;
  } else {
    t11 = $[29];
  }
  const runExport = t11;
  let t12;
  if ($[30] !== activePresetId || $[31] !== applyFilters || $[32] !== createLabel || $[33] !== onCreate || $[34] !== presets || $[35] !== toolbarEnd) {
    t12 = (presets || onCreate || toolbarEnd) && /*#__PURE__*/_jsxs(Stack, {
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
    $[30] = activePresetId;
    $[31] = applyFilters;
    $[32] = createLabel;
    $[33] = onCreate;
    $[34] = presets;
    $[35] = toolbarEnd;
    $[36] = t12;
  } else {
    t12 = $[36];
  }
  let t13;
  let t14;
  if ($[37] === Symbol.for("react.memo_cache_sentinel")) {
    t13 = {
      xs: "column",
      sm: "row"
    };
    t14 = {
      alignItems: {
        xs: "stretch",
        sm: "center"
      },
      justifyContent: "space-between",
      gap: 1,
      minHeight: 40
    };
    $[37] = t13;
    $[38] = t14;
  } else {
    t13 = $[37];
    t14 = $[38];
  }
  let t15;
  if ($[39] === Symbol.for("react.memo_cache_sentinel")) {
    t15 = {
      alignItems: "center",
      flexWrap: "wrap",
      minWidth: 0
    };
    $[39] = t15;
  } else {
    t15 = $[39];
  }
  let t16;
  if ($[40] !== searchPlaceholder || $[41] !== searchWidth) {
    t16 = /*#__PURE__*/_jsx(DataTableSearchField, {
      placeholder: searchPlaceholder,
      width: searchWidth,
      alwaysOpen: true
    });
    $[40] = searchPlaceholder;
    $[41] = searchWidth;
    $[42] = t16;
  } else {
    t16 = $[42];
  }
  let t17;
  if ($[43] !== applyFilters || $[44] !== filterColumns || $[45] !== filterRenderers || $[46] !== presets) {
    t17 = filterColumns && /*#__PURE__*/_jsx(DataTableFilterButton, {
      filterColumns: filterColumns,
      presets: presets,
      filterRenderers: filterRenderers,
      onApply: applyFilters
    });
    $[43] = applyFilters;
    $[44] = filterColumns;
    $[45] = filterRenderers;
    $[46] = presets;
    $[47] = t17;
  } else {
    t17 = $[47];
  }
  let t18;
  if ($[48] === Symbol.for("react.memo_cache_sentinel")) {
    t18 = {
      alignItems: "center",
      flexWrap: "nowrap",
      overflowX: "auto",
      minWidth: 0,
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none"
      }
    };
    $[48] = t18;
  } else {
    t18 = $[48];
  }
  let t19;
  if ($[49] !== activeGroupLabel || $[50] !== api.groupByColumns) {
    t19 = api.groupByColumns && api.groupByColumns.length > 0 && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(GroupIcon, {}),
      label: activeGroupLabel ? `Group: ${activeGroupLabel}` : "Group",
      onClick: e => setGroupAnchor(e.currentTarget)
    });
    $[49] = activeGroupLabel;
    $[50] = api.groupByColumns;
    $[51] = t19;
  } else {
    t19 = $[51];
  }
  let t20;
  if ($[52] !== importTooltip || $[53] !== onImport) {
    t20 = onImport && withTooltip(importTooltip, /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ImportIcon, {}),
      label: "Import",
      menu: false,
      onClick: onImport
    }));
    $[52] = importTooltip;
    $[53] = onImport;
    $[54] = t20;
  } else {
    t20 = $[54];
  }
  let t21;
  if ($[55] !== exportFormats || $[56] !== exportTooltip || $[57] !== onExport || $[58] !== runExport) {
    t21 = onExport && withTooltip(exportTooltip, /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ExportIcon, {}),
      label: "Export",
      menu: exportFormats.length > 1,
      onClick: e_0 => {
        if (exportFormats.length > 1) {
          setExportAnchor(e_0.currentTarget);
        } else {
          runExport(exportFormats[0]?.id ?? "csv");
        }
      }
    }));
    $[55] = exportFormats;
    $[56] = exportTooltip;
    $[57] = onExport;
    $[58] = runExport;
    $[59] = t21;
  } else {
    t21 = $[59];
  }
  let t22;
  if ($[60] !== actions || $[61] !== api.selectedIds) {
    t22 = actions && actions.length > 0 && api.selectedIds.length > 0 && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ActionsIcon, {}),
      label: `Actions (${api.selectedIds.length})`,
      onClick: e_1 => setActionsAnchor(e_1.currentTarget)
    });
    $[60] = actions;
    $[61] = api.selectedIds;
    $[62] = t22;
  } else {
    t22 = $[62];
  }
  let t23;
  if ($[63] !== settings) {
    t23 = settings && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(SettingIcon, {}),
      label: "Settings",
      menu: false,
      onClick: () => setSettingsOpen(true)
    });
    $[63] = settings;
    $[64] = t23;
  } else {
    t23 = $[64];
  }
  let t24;
  if ($[65] !== t19 || $[66] !== t20 || $[67] !== t21 || $[68] !== t22 || $[69] !== t23) {
    t24 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      sx: t18,
      children: [t19, t20, t21, t22, t23]
    });
    $[65] = t19;
    $[66] = t20;
    $[67] = t21;
    $[68] = t22;
    $[69] = t23;
    $[70] = t24;
  } else {
    t24 = $[70];
  }
  let t25;
  if ($[71] !== t16 || $[72] !== t17 || $[73] !== t24) {
    t25 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      sx: t15,
      children: [t16, t17, t24]
    });
    $[71] = t16;
    $[72] = t17;
    $[73] = t24;
    $[74] = t25;
  } else {
    t25 = $[74];
  }
  let t26;
  if ($[75] === Symbol.for("react.memo_cache_sentinel")) {
    t26 = {
      minHeight: 40,
      display: "flex",
      alignItems: "center",
      flexShrink: 0
    };
    $[75] = t26;
  } else {
    t26 = $[75];
  }
  let t27;
  if ($[76] !== rowsPerPageOptions) {
    t27 = /*#__PURE__*/_jsx(DataTablePagination, {
      rowsPerPageOptions: rowsPerPageOptions
    });
    $[76] = rowsPerPageOptions;
    $[77] = t27;
  } else {
    t27 = $[77];
  }
  let t28;
  if ($[78] !== api.groupBy || $[79] !== api.groups || $[80] !== api.groupsTotal) {
    t28 = api.groupBy && /*#__PURE__*/_jsxs(Typography, {
      sx: {
        fontSize: "13px",
        fontWeight: 500,
        color: "text.secondary",
        fontVariantNumeric: "tabular-nums"
      },
      children: [api.groups.length, " groups \xB7 ", api.groupsTotal, " records"]
    });
    $[78] = api.groupBy;
    $[79] = api.groups;
    $[80] = api.groupsTotal;
    $[81] = t28;
  } else {
    t28 = $[81];
  }
  let t29;
  if ($[82] !== t27 || $[83] !== t28) {
    t29 = /*#__PURE__*/_jsxs(Box, {
      sx: t26,
      children: [t27, t28]
    });
    $[82] = t27;
    $[83] = t28;
    $[84] = t29;
  } else {
    t29 = $[84];
  }
  let t30;
  if ($[85] !== t25 || $[86] !== t29) {
    t30 = /*#__PURE__*/_jsxs(Stack, {
      direction: t13,
      sx: t14,
      children: [t25, t29]
    });
    $[85] = t25;
    $[86] = t29;
    $[87] = t30;
  } else {
    t30 = $[87];
  }
  let t31;
  if ($[88] !== actions || $[89] !== actionsAnchor || $[90] !== runAction) {
    t31 = actions && actions.length > 0 && /*#__PURE__*/_jsx(Menu, {
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
    $[88] = actions;
    $[89] = actionsAnchor;
    $[90] = runAction;
    $[91] = t31;
  } else {
    t31 = $[91];
  }
  let t32;
  if ($[92] !== api.selectedIds || $[93] !== executeAction || $[94] !== pendingAction) {
    t32 = pendingAction && /*#__PURE__*/_jsx(ConfirmDialog, {
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
    $[92] = api.selectedIds;
    $[93] = executeAction;
    $[94] = pendingAction;
    $[95] = t32;
  } else {
    t32 = $[95];
  }
  let t33;
  if ($[96] !== exportAnchor || $[97] !== exportFormats || $[98] !== onExport || $[99] !== runExport) {
    t33 = onExport && exportFormats.length > 1 && /*#__PURE__*/_jsx(Menu, {
      anchorEl: exportAnchor,
      open: Boolean(exportAnchor),
      onClose: () => setExportAnchor(null),
      children: exportFormats.map(format_0 => /*#__PURE__*/_jsx(MenuItem, {
        onClick: () => runExport(format_0.id),
        children: format_0.label
      }, format_0.id))
    });
    $[96] = exportAnchor;
    $[97] = exportFormats;
    $[98] = onExport;
    $[99] = runExport;
    $[100] = t33;
  } else {
    t33 = $[100];
  }
  const t34 = Boolean(groupAnchor);
  let t35;
  if ($[101] === Symbol.for("react.memo_cache_sentinel")) {
    t35 = () => setGroupAnchor(null);
    $[101] = t35;
  } else {
    t35 = $[101];
  }
  let t36;
  if ($[102] === Symbol.for("react.memo_cache_sentinel")) {
    t36 = {
      field: null,
      label: "None"
    };
    $[102] = t36;
  } else {
    t36 = $[102];
  }
  let t37;
  if ($[103] !== api.groupByColumns) {
    t37 = api.groupByColumns ?? [];
    $[103] = api.groupByColumns;
    $[104] = t37;
  } else {
    t37 = $[104];
  }
  let t38;
  if ($[105] !== t37) {
    t38 = [t36, ...t37];
    $[105] = t37;
    $[106] = t38;
  } else {
    t38 = $[106];
  }
  let t39;
  if ($[107] !== api || $[108] !== t38) {
    t39 = t38.map(g_0 => /*#__PURE__*/_jsx(MenuItem, {
      selected: api.groupBy === g_0.field,
      onClick: () => {
        api.setGroupBy(g_0.field);
        setGroupAnchor(null);
      },
      children: g_0.label
    }, g_0.label));
    $[107] = api;
    $[108] = t38;
    $[109] = t39;
  } else {
    t39 = $[109];
  }
  let t40;
  if ($[110] !== groupAnchor || $[111] !== t34 || $[112] !== t39) {
    t40 = /*#__PURE__*/_jsx(Menu, {
      anchorEl: groupAnchor,
      open: t34,
      onClose: t35,
      children: t39
    });
    $[110] = groupAnchor;
    $[111] = t34;
    $[112] = t39;
    $[113] = t40;
  } else {
    t40 = $[113];
  }
  let t41;
  if ($[114] !== filterColumns || $[115] !== manageOpen || $[116] !== presets) {
    t41 = presets && filterColumns && /*#__PURE__*/_jsx(ManageViewsDialog, {
      open: manageOpen,
      onClose: () => setManageOpen(false),
      presets: presets,
      filterColumns: filterColumns
    });
    $[114] = filterColumns;
    $[115] = manageOpen;
    $[116] = presets;
    $[117] = t41;
  } else {
    t41 = $[117];
  }
  let t42;
  if ($[118] !== filterColumns || $[119] !== presets || $[120] !== settings || $[121] !== settingsOpen) {
    t42 = settings && /*#__PURE__*/_jsx(DataTableSettingsDialog, {
      open: settingsOpen,
      onClose: () => setSettingsOpen(false),
      onManageViews: presets && filterColumns ? () => {
        setSettingsOpen(false);
        setManageOpen(true);
      } : undefined
    });
    $[118] = filterColumns;
    $[119] = presets;
    $[120] = settings;
    $[121] = settingsOpen;
    $[122] = t42;
  } else {
    t42 = $[122];
  }
  let t43;
  if ($[123] === Symbol.for("react.memo_cache_sentinel")) {
    t43 = {
      p: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      minHeight: 0
    };
    $[123] = t43;
  } else {
    t43 = $[123];
  }
  let t44;
  if ($[124] !== emptyMessage || $[125] !== errorMessage || $[126] !== noResultsMessage || $[127] !== onRowClick || $[128] !== onRowIntent || $[129] !== rowClass || $[130] !== stickyHeader || $[131] !== withSelection) {
    t44 = /*#__PURE__*/_jsx(Card, {
      sx: t43,
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
    $[124] = emptyMessage;
    $[125] = errorMessage;
    $[126] = noResultsMessage;
    $[127] = onRowClick;
    $[128] = onRowIntent;
    $[129] = rowClass;
    $[130] = stickyHeader;
    $[131] = withSelection;
    $[132] = t44;
  } else {
    t44 = $[132];
  }
  let t45;
  if ($[133] !== api || $[134] !== t12 || $[135] !== t30 || $[136] !== t31 || $[137] !== t32 || $[138] !== t33 || $[139] !== t40 || $[140] !== t41 || $[141] !== t42 || $[142] !== t44) {
    t45 = /*#__PURE__*/_jsxs(DataTableRoot, {
      api: api,
      children: [t12, t30, t31, t32, t33, t40, t41, t42, t44]
    });
    $[133] = api;
    $[134] = t12;
    $[135] = t30;
    $[136] = t31;
    $[137] = t32;
    $[138] = t33;
    $[139] = t40;
    $[140] = t41;
    $[141] = t42;
    $[142] = t44;
    $[143] = t45;
  } else {
    t45 = $[143];
  }
  return t45;
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