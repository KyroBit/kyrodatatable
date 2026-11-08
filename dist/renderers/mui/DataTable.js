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
  const $ = _c(155);
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
    let t9;
    if ($[19] !== api.groupByColumns) {
      t9 = field => api.groupByColumns?.find(g => g.field === field)?.label ?? field;
      $[19] = api.groupByColumns;
      $[20] = t9;
    } else {
      t9 = $[20];
    }
    t8 = api.groupBy.map(t9).join(" \u203A ");
    $[16] = api.groupBy;
    $[17] = api.groupByColumns;
    $[18] = t8;
  } else {
    t8 = $[18];
  }
  const groupLabel = t8;
  let t9;
  if ($[21] !== api) {
    t9 = field_0 => api.setGroupBy(api.groupBy.includes(field_0) ? api.groupBy.filter(f => f !== field_0) : [...api.groupBy, field_0]);
    $[21] = api;
    $[22] = t9;
  } else {
    t9 = $[22];
  }
  const toggleGroupField = t9;
  let t10;
  if ($[23] !== api) {
    t10 = async action => {
      await action.handle(api.selectedIds);
      api.clearSelection();
      if (api.groupBy.length > 0) {
        api.setGroupBy(api.groupBy);
      }
      api.refetch();
    };
    $[23] = api;
    $[24] = t10;
  } else {
    t10 = $[24];
  }
  const executeAction = t10;
  let t11;
  if ($[25] !== executeAction) {
    t11 = action_0 => {
      setActionsAnchor(null);
      if (action_0.confirmationMessage) {
        setPendingAction(action_0);
        return;
      }
      executeAction(action_0);
    };
    $[25] = executeAction;
    $[26] = t11;
  } else {
    t11 = $[26];
  }
  const runAction = t11;
  let t12;
  if ($[27] !== api.filters || $[28] !== api.groupBy || $[29] !== api.search || $[30] !== api.selectedIds || $[31] !== api.sort || $[32] !== onExport) {
    t12 = format => {
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
    $[27] = api.filters;
    $[28] = api.groupBy;
    $[29] = api.search;
    $[30] = api.selectedIds;
    $[31] = api.sort;
    $[32] = onExport;
    $[33] = t12;
  } else {
    t12 = $[33];
  }
  const runExport = t12;
  let t13;
  if ($[34] !== activePresetId || $[35] !== applyFilters || $[36] !== createLabel || $[37] !== onCreate || $[38] !== presets || $[39] !== toolbarEnd) {
    t13 = (presets || onCreate || toolbarEnd) && /*#__PURE__*/_jsxs(Stack, {
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
    $[34] = activePresetId;
    $[35] = applyFilters;
    $[36] = createLabel;
    $[37] = onCreate;
    $[38] = presets;
    $[39] = toolbarEnd;
    $[40] = t13;
  } else {
    t13 = $[40];
  }
  let t14;
  let t15;
  if ($[41] === Symbol.for("react.memo_cache_sentinel")) {
    t14 = {
      xs: "column",
      sm: "row"
    };
    t15 = {
      alignItems: {
        xs: "stretch",
        sm: "center"
      },
      justifyContent: "space-between",
      gap: 1,
      minHeight: 40
    };
    $[41] = t14;
    $[42] = t15;
  } else {
    t14 = $[41];
    t15 = $[42];
  }
  let t16;
  if ($[43] === Symbol.for("react.memo_cache_sentinel")) {
    t16 = {
      alignItems: "center",
      flexWrap: "wrap",
      minWidth: 0
    };
    $[43] = t16;
  } else {
    t16 = $[43];
  }
  let t17;
  if ($[44] !== searchPlaceholder || $[45] !== searchWidth) {
    t17 = /*#__PURE__*/_jsx(DataTableSearchField, {
      placeholder: searchPlaceholder,
      width: searchWidth,
      alwaysOpen: true
    });
    $[44] = searchPlaceholder;
    $[45] = searchWidth;
    $[46] = t17;
  } else {
    t17 = $[46];
  }
  let t18;
  if ($[47] !== applyFilters || $[48] !== filterColumns || $[49] !== filterRenderers || $[50] !== presets) {
    t18 = filterColumns && /*#__PURE__*/_jsx(DataTableFilterButton, {
      filterColumns: filterColumns,
      presets: presets,
      filterRenderers: filterRenderers,
      onApply: applyFilters
    });
    $[47] = applyFilters;
    $[48] = filterColumns;
    $[49] = filterRenderers;
    $[50] = presets;
    $[51] = t18;
  } else {
    t18 = $[51];
  }
  let t19;
  if ($[52] === Symbol.for("react.memo_cache_sentinel")) {
    t19 = {
      alignItems: "center",
      flexWrap: "nowrap",
      overflowX: "auto",
      minWidth: 0,
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none"
      }
    };
    $[52] = t19;
  } else {
    t19 = $[52];
  }
  let t20;
  if ($[53] !== api.groupByColumns || $[54] !== groupLabel) {
    t20 = api.groupByColumns && api.groupByColumns.length > 0 && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(GroupIcon, {}),
      label: groupLabel ? `Group: ${groupLabel}` : "Group",
      onClick: e => setGroupAnchor(e.currentTarget)
    });
    $[53] = api.groupByColumns;
    $[54] = groupLabel;
    $[55] = t20;
  } else {
    t20 = $[55];
  }
  let t21;
  if ($[56] !== importTooltip || $[57] !== onImport) {
    t21 = onImport && withTooltip(importTooltip, /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ImportIcon, {}),
      label: "Import",
      menu: false,
      onClick: onImport
    }));
    $[56] = importTooltip;
    $[57] = onImport;
    $[58] = t21;
  } else {
    t21 = $[58];
  }
  let t22;
  if ($[59] !== exportFormats || $[60] !== exportTooltip || $[61] !== onExport || $[62] !== runExport) {
    t22 = onExport && withTooltip(exportTooltip, /*#__PURE__*/_jsx(ToolbarBtn, {
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
    $[59] = exportFormats;
    $[60] = exportTooltip;
    $[61] = onExport;
    $[62] = runExport;
    $[63] = t22;
  } else {
    t22 = $[63];
  }
  let t23;
  if ($[64] !== actions || $[65] !== api.selectedIds) {
    t23 = actions && actions.length > 0 && api.selectedIds.length > 0 && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ActionsIcon, {}),
      label: `Actions (${api.selectedIds.length})`,
      onClick: e_1 => setActionsAnchor(e_1.currentTarget)
    });
    $[64] = actions;
    $[65] = api.selectedIds;
    $[66] = t23;
  } else {
    t23 = $[66];
  }
  let t24;
  if ($[67] !== settings) {
    t24 = settings && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(SettingIcon, {}),
      label: "Settings",
      menu: false,
      onClick: () => setSettingsOpen(true)
    });
    $[67] = settings;
    $[68] = t24;
  } else {
    t24 = $[68];
  }
  let t25;
  if ($[69] !== t20 || $[70] !== t21 || $[71] !== t22 || $[72] !== t23 || $[73] !== t24) {
    t25 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      sx: t19,
      children: [t20, t21, t22, t23, t24]
    });
    $[69] = t20;
    $[70] = t21;
    $[71] = t22;
    $[72] = t23;
    $[73] = t24;
    $[74] = t25;
  } else {
    t25 = $[74];
  }
  let t26;
  if ($[75] !== t17 || $[76] !== t18 || $[77] !== t25) {
    t26 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      sx: t16,
      children: [t17, t18, t25]
    });
    $[75] = t17;
    $[76] = t18;
    $[77] = t25;
    $[78] = t26;
  } else {
    t26 = $[78];
  }
  let t27;
  if ($[79] === Symbol.for("react.memo_cache_sentinel")) {
    t27 = {
      minHeight: 40,
      display: "flex",
      alignItems: "center",
      flexShrink: 0
    };
    $[79] = t27;
  } else {
    t27 = $[79];
  }
  let t28;
  if ($[80] !== rowsPerPageOptions) {
    t28 = /*#__PURE__*/_jsx(DataTablePagination, {
      rowsPerPageOptions: rowsPerPageOptions
    });
    $[80] = rowsPerPageOptions;
    $[81] = t28;
  } else {
    t28 = $[81];
  }
  let t29;
  if ($[82] !== api.groupBy.length || $[83] !== api.groups || $[84] !== api.groupsTotal) {
    t29 = api.groupBy.length > 0 && /*#__PURE__*/_jsxs(Typography, {
      sx: {
        fontSize: "13px",
        fontWeight: 500,
        color: "text.secondary",
        fontVariantNumeric: "tabular-nums"
      },
      children: [api.groups.length, " groups \xB7 ", api.groupsTotal, " records"]
    });
    $[82] = api.groupBy.length;
    $[83] = api.groups;
    $[84] = api.groupsTotal;
    $[85] = t29;
  } else {
    t29 = $[85];
  }
  let t30;
  if ($[86] !== t28 || $[87] !== t29) {
    t30 = /*#__PURE__*/_jsxs(Box, {
      sx: t27,
      children: [t28, t29]
    });
    $[86] = t28;
    $[87] = t29;
    $[88] = t30;
  } else {
    t30 = $[88];
  }
  let t31;
  if ($[89] !== t26 || $[90] !== t30) {
    t31 = /*#__PURE__*/_jsxs(Stack, {
      direction: t14,
      sx: t15,
      children: [t26, t30]
    });
    $[89] = t26;
    $[90] = t30;
    $[91] = t31;
  } else {
    t31 = $[91];
  }
  let t32;
  if ($[92] !== actions || $[93] !== actionsAnchor || $[94] !== runAction) {
    t32 = actions && actions.length > 0 && /*#__PURE__*/_jsx(Menu, {
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
    $[92] = actions;
    $[93] = actionsAnchor;
    $[94] = runAction;
    $[95] = t32;
  } else {
    t32 = $[95];
  }
  let t33;
  if ($[96] !== api.selectedIds || $[97] !== executeAction || $[98] !== pendingAction) {
    t33 = pendingAction && /*#__PURE__*/_jsx(ConfirmDialog, {
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
    $[96] = api.selectedIds;
    $[97] = executeAction;
    $[98] = pendingAction;
    $[99] = t33;
  } else {
    t33 = $[99];
  }
  let t34;
  if ($[100] !== exportAnchor || $[101] !== exportFormats || $[102] !== onExport || $[103] !== runExport) {
    t34 = onExport && exportFormats.length > 1 && /*#__PURE__*/_jsx(Menu, {
      anchorEl: exportAnchor,
      open: Boolean(exportAnchor),
      onClose: () => setExportAnchor(null),
      children: exportFormats.map(format_0 => /*#__PURE__*/_jsx(MenuItem, {
        onClick: () => runExport(format_0.id),
        children: format_0.label
      }, format_0.id))
    });
    $[100] = exportAnchor;
    $[101] = exportFormats;
    $[102] = onExport;
    $[103] = runExport;
    $[104] = t34;
  } else {
    t34 = $[104];
  }
  const t35 = Boolean(groupAnchor);
  let t36;
  if ($[105] === Symbol.for("react.memo_cache_sentinel")) {
    t36 = () => setGroupAnchor(null);
    $[105] = t36;
  } else {
    t36 = $[105];
  }
  const t37 = api.groupBy.length === 0;
  let t38;
  if ($[106] !== api) {
    t38 = () => {
      api.setGroupBy([]);
      setGroupAnchor(null);
    };
    $[106] = api;
    $[107] = t38;
  } else {
    t38 = $[107];
  }
  let t39;
  if ($[108] !== t37 || $[109] !== t38) {
    t39 = /*#__PURE__*/_jsx(MenuItem, {
      selected: t37,
      onClick: t38,
      children: "None"
    });
    $[108] = t37;
    $[109] = t38;
    $[110] = t39;
  } else {
    t39 = $[110];
  }
  let t40;
  if ($[111] !== api.groupByColumns) {
    t40 = api.groupByColumns ?? [];
    $[111] = api.groupByColumns;
    $[112] = t40;
  } else {
    t40 = $[112];
  }
  let t41;
  if ($[113] !== api.groupBy || $[114] !== t40 || $[115] !== toggleGroupField) {
    let t42;
    if ($[117] !== api.groupBy || $[118] !== toggleGroupField) {
      t42 = g_0 => /*#__PURE__*/_jsx(MenuItem, {
        selected: api.groupBy.includes(g_0.field),
        onClick: () => {
          toggleGroupField(g_0.field);
          setGroupAnchor(null);
        },
        children: g_0.label
      }, g_0.field);
      $[117] = api.groupBy;
      $[118] = toggleGroupField;
      $[119] = t42;
    } else {
      t42 = $[119];
    }
    t41 = t40.map(t42);
    $[113] = api.groupBy;
    $[114] = t40;
    $[115] = toggleGroupField;
    $[116] = t41;
  } else {
    t41 = $[116];
  }
  let t42;
  if ($[120] !== groupAnchor || $[121] !== t35 || $[122] !== t39 || $[123] !== t41) {
    t42 = /*#__PURE__*/_jsxs(Menu, {
      anchorEl: groupAnchor,
      open: t35,
      onClose: t36,
      children: [t39, t41]
    });
    $[120] = groupAnchor;
    $[121] = t35;
    $[122] = t39;
    $[123] = t41;
    $[124] = t42;
  } else {
    t42 = $[124];
  }
  let t43;
  if ($[125] !== filterColumns || $[126] !== manageOpen || $[127] !== presets) {
    t43 = presets && filterColumns && /*#__PURE__*/_jsx(ManageViewsDialog, {
      open: manageOpen,
      onClose: () => setManageOpen(false),
      presets: presets,
      filterColumns: filterColumns
    });
    $[125] = filterColumns;
    $[126] = manageOpen;
    $[127] = presets;
    $[128] = t43;
  } else {
    t43 = $[128];
  }
  let t44;
  if ($[129] !== filterColumns || $[130] !== presets || $[131] !== settings || $[132] !== settingsOpen) {
    t44 = settings && /*#__PURE__*/_jsx(DataTableSettingsDialog, {
      open: settingsOpen,
      onClose: () => setSettingsOpen(false),
      onManageViews: presets && filterColumns ? () => {
        setSettingsOpen(false);
        setManageOpen(true);
      } : undefined
    });
    $[129] = filterColumns;
    $[130] = presets;
    $[131] = settings;
    $[132] = settingsOpen;
    $[133] = t44;
  } else {
    t44 = $[133];
  }
  let t45;
  if ($[134] === Symbol.for("react.memo_cache_sentinel")) {
    t45 = {
      p: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      minHeight: 0
    };
    $[134] = t45;
  } else {
    t45 = $[134];
  }
  let t46;
  if ($[135] !== emptyMessage || $[136] !== errorMessage || $[137] !== noResultsMessage || $[138] !== onRowClick || $[139] !== onRowIntent || $[140] !== rowClass || $[141] !== stickyHeader || $[142] !== withSelection) {
    t46 = /*#__PURE__*/_jsx(Card, {
      sx: t45,
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
    $[135] = emptyMessage;
    $[136] = errorMessage;
    $[137] = noResultsMessage;
    $[138] = onRowClick;
    $[139] = onRowIntent;
    $[140] = rowClass;
    $[141] = stickyHeader;
    $[142] = withSelection;
    $[143] = t46;
  } else {
    t46 = $[143];
  }
  let t47;
  if ($[144] !== api || $[145] !== t13 || $[146] !== t31 || $[147] !== t32 || $[148] !== t33 || $[149] !== t34 || $[150] !== t42 || $[151] !== t43 || $[152] !== t44 || $[153] !== t46) {
    t47 = /*#__PURE__*/_jsxs(DataTableRoot, {
      api: api,
      children: [t13, t31, t32, t33, t34, t42, t43, t44, t46]
    });
    $[144] = api;
    $[145] = t13;
    $[146] = t31;
    $[147] = t32;
    $[148] = t33;
    $[149] = t34;
    $[150] = t42;
    $[151] = t43;
    $[152] = t44;
    $[153] = t46;
    $[154] = t47;
  } else {
    t47 = $[154];
  }
  return t47;
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