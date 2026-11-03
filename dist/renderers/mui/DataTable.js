import { c as _c } from "react/compiler-runtime";
import { useMemo, useState } from 'react';
import { Badge, Box, Button, Card, Menu, MenuItem, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { countFilterValues, filterValuesEqual } from '@kyrobit/datatable';
import { DataTableRoot } from './context.js';
import { DataTableSearchField } from './SearchField.js';
import { DataTableBody } from './Body.js';
import { DataTablePagination } from './Pagination.js';
import { DataTableFilterMenu, ManageViewsDialog } from './FilterMenu.js';
import { DataTableSettingsDialog } from './SettingsDialog.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { ActionsIcon, ExportIcon, FilterIcon, GroupIcon, ImportIcon, SettingIcon } from './icons.js';
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
  const $ = _c(154);
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
  const [filterAnchor, setFilterAnchor] = useState(null);
  let t5;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t5 = {};
    $[2] = t5;
  } else {
    t5 = $[2];
  }
  const [filterDraft, setFilterDraft] = useState(t5);
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [groupAnchor, setGroupAnchor] = useState(null);
  const [actionsAnchor, setActionsAnchor] = useState(null);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  let t6;
  if ($[3] !== api.filters) {
    t6 = api.filters ?? {};
    $[3] = api.filters;
    $[4] = t6;
  } else {
    t6 = $[4];
  }
  const filters = t6;
  let t7;
  if ($[5] !== filters) {
    t7 = countFilterValues(filters);
    $[5] = filters;
    $[6] = t7;
  } else {
    t7 = $[6];
  }
  const filterCount = t7;
  const withSelection = Boolean(selectable || actions && actions.length > 0);
  let t8;
  bb0: {
    if (selectedPresetId && presets) {
      let selected;
      let t9;
      if ($[7] !== filters || $[8] !== presets.all || $[9] !== selectedPresetId) {
        let t10;
        if ($[12] !== selectedPresetId) {
          t10 = p => p.id === selectedPresetId;
          $[12] = selectedPresetId;
          $[13] = t10;
        } else {
          t10 = $[13];
        }
        selected = presets.all.find(t10);
        t9 = selected && filterValuesEqual(selected.filters, filters);
        $[7] = filters;
        $[8] = presets.all;
        $[9] = selectedPresetId;
        $[10] = selected;
        $[11] = t9;
      } else {
        selected = $[10];
        t9 = $[11];
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
    if ($[14] !== filters || $[15] !== presets?.all) {
      t9 = presets?.all.find(p_0 => filterValuesEqual(p_0.filters, filters))?.id ?? null;
      $[14] = filters;
      $[15] = presets?.all;
      $[16] = t9;
    } else {
      t9 = $[16];
    }
    t8 = t9;
  }
  const activePresetId = t8;
  let t9;
  if ($[17] !== api) {
    t9 = (next, presetId) => {
      setSelectedPresetId(presetId ?? null);
      api.setFilters(next);
    };
    $[17] = api;
    $[18] = t9;
  } else {
    t9 = $[18];
  }
  const applyFilters = t9;
  let t10;
  if ($[19] !== api.groupBy || $[20] !== api.groupByColumns) {
    t10 = api.groupByColumns?.find(g => g.field === api.groupBy)?.label;
    $[19] = api.groupBy;
    $[20] = api.groupByColumns;
    $[21] = t10;
  } else {
    t10 = $[21];
  }
  const activeGroupLabel = t10;
  let t11;
  if ($[22] !== api) {
    t11 = async action => {
      await action.handle(api.selectedIds);
      api.clearSelection();
      if (api.groupBy) {
        api.setGroupBy(api.groupBy);
      }
      api.refetch();
    };
    $[22] = api;
    $[23] = t11;
  } else {
    t11 = $[23];
  }
  const executeAction = t11;
  let t12;
  if ($[24] !== executeAction) {
    t12 = action_0 => {
      setActionsAnchor(null);
      if (action_0.confirmationMessage) {
        setPendingAction(action_0);
        return;
      }
      executeAction(action_0);
    };
    $[24] = executeAction;
    $[25] = t12;
  } else {
    t12 = $[25];
  }
  const runAction = t12;
  let t13;
  if ($[26] !== api.filters || $[27] !== api.groupBy || $[28] !== api.search || $[29] !== api.selectedIds || $[30] !== api.sort || $[31] !== onExport) {
    t13 = format => {
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
    $[26] = api.filters;
    $[27] = api.groupBy;
    $[28] = api.search;
    $[29] = api.selectedIds;
    $[30] = api.sort;
    $[31] = onExport;
    $[32] = t13;
  } else {
    t13 = $[32];
  }
  const runExport = t13;
  let t14;
  if ($[33] !== activePresetId || $[34] !== applyFilters || $[35] !== createLabel || $[36] !== onCreate || $[37] !== presets || $[38] !== toolbarEnd) {
    t14 = (presets || onCreate || toolbarEnd) && /*#__PURE__*/_jsxs(Stack, {
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
    $[33] = activePresetId;
    $[34] = applyFilters;
    $[35] = createLabel;
    $[36] = onCreate;
    $[37] = presets;
    $[38] = toolbarEnd;
    $[39] = t14;
  } else {
    t14 = $[39];
  }
  let t15;
  let t16;
  if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
    t15 = {
      xs: "column",
      sm: "row"
    };
    t16 = {
      alignItems: {
        xs: "stretch",
        sm: "center"
      },
      justifyContent: "space-between",
      gap: 1,
      minHeight: 40
    };
    $[40] = t15;
    $[41] = t16;
  } else {
    t15 = $[40];
    t16 = $[41];
  }
  let t17;
  if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
    t17 = {
      alignItems: "center",
      flexWrap: "wrap",
      minWidth: 0
    };
    $[42] = t17;
  } else {
    t17 = $[42];
  }
  let t18;
  if ($[43] !== searchPlaceholder || $[44] !== searchWidth) {
    t18 = /*#__PURE__*/_jsx(DataTableSearchField, {
      placeholder: searchPlaceholder,
      width: searchWidth,
      alwaysOpen: true
    });
    $[43] = searchPlaceholder;
    $[44] = searchWidth;
    $[45] = t18;
  } else {
    t18 = $[45];
  }
  let t19;
  if ($[46] !== filterColumns || $[47] !== filterCount || $[48] !== filters) {
    t19 = filterColumns && /*#__PURE__*/_jsx(Badge, {
      badgeContent: filterCount,
      color: "primary",
      children: /*#__PURE__*/_jsx(ToolbarBtn, {
        icon: /*#__PURE__*/_jsx(FilterIcon, {}),
        label: "Filters",
        menu: false,
        onClick: e => {
          setFilterDraft(filters);
          setFilterAnchor(e.currentTarget);
        }
      })
    });
    $[46] = filterColumns;
    $[47] = filterCount;
    $[48] = filters;
    $[49] = t19;
  } else {
    t19 = $[49];
  }
  let t20;
  if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
    t20 = {
      alignItems: "center",
      flexWrap: "nowrap",
      overflowX: "auto",
      minWidth: 0,
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none"
      }
    };
    $[50] = t20;
  } else {
    t20 = $[50];
  }
  let t21;
  if ($[51] !== activeGroupLabel || $[52] !== api.groupByColumns) {
    t21 = api.groupByColumns && api.groupByColumns.length > 0 && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(GroupIcon, {}),
      label: activeGroupLabel ? `Group: ${activeGroupLabel}` : "Group",
      onClick: e_0 => setGroupAnchor(e_0.currentTarget)
    });
    $[51] = activeGroupLabel;
    $[52] = api.groupByColumns;
    $[53] = t21;
  } else {
    t21 = $[53];
  }
  let t22;
  if ($[54] !== importTooltip || $[55] !== onImport) {
    t22 = onImport && withTooltip(importTooltip, /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ImportIcon, {}),
      label: "Import",
      menu: false,
      onClick: onImport
    }));
    $[54] = importTooltip;
    $[55] = onImport;
    $[56] = t22;
  } else {
    t22 = $[56];
  }
  let t23;
  if ($[57] !== exportFormats || $[58] !== exportTooltip || $[59] !== onExport || $[60] !== runExport) {
    t23 = onExport && withTooltip(exportTooltip, /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ExportIcon, {}),
      label: "Export",
      menu: exportFormats.length > 1,
      onClick: e_1 => {
        if (exportFormats.length > 1) {
          setExportAnchor(e_1.currentTarget);
        } else {
          runExport(exportFormats[0]?.id ?? "csv");
        }
      }
    }));
    $[57] = exportFormats;
    $[58] = exportTooltip;
    $[59] = onExport;
    $[60] = runExport;
    $[61] = t23;
  } else {
    t23 = $[61];
  }
  let t24;
  if ($[62] !== actions || $[63] !== api.selectedIds) {
    t24 = actions && actions.length > 0 && api.selectedIds.length > 0 && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ActionsIcon, {}),
      label: `Actions (${api.selectedIds.length})`,
      onClick: e_2 => setActionsAnchor(e_2.currentTarget)
    });
    $[62] = actions;
    $[63] = api.selectedIds;
    $[64] = t24;
  } else {
    t24 = $[64];
  }
  let t25;
  if ($[65] !== settings) {
    t25 = settings && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(SettingIcon, {}),
      label: "Settings",
      menu: false,
      onClick: () => setSettingsOpen(true)
    });
    $[65] = settings;
    $[66] = t25;
  } else {
    t25 = $[66];
  }
  let t26;
  if ($[67] !== t21 || $[68] !== t22 || $[69] !== t23 || $[70] !== t24 || $[71] !== t25) {
    t26 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      sx: t20,
      children: [t21, t22, t23, t24, t25]
    });
    $[67] = t21;
    $[68] = t22;
    $[69] = t23;
    $[70] = t24;
    $[71] = t25;
    $[72] = t26;
  } else {
    t26 = $[72];
  }
  let t27;
  if ($[73] !== t18 || $[74] !== t19 || $[75] !== t26) {
    t27 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      sx: t17,
      children: [t18, t19, t26]
    });
    $[73] = t18;
    $[74] = t19;
    $[75] = t26;
    $[76] = t27;
  } else {
    t27 = $[76];
  }
  let t28;
  if ($[77] === Symbol.for("react.memo_cache_sentinel")) {
    t28 = {
      minHeight: 40,
      display: "flex",
      alignItems: "center",
      flexShrink: 0
    };
    $[77] = t28;
  } else {
    t28 = $[77];
  }
  let t29;
  if ($[78] !== rowsPerPageOptions) {
    t29 = /*#__PURE__*/_jsx(DataTablePagination, {
      rowsPerPageOptions: rowsPerPageOptions
    });
    $[78] = rowsPerPageOptions;
    $[79] = t29;
  } else {
    t29 = $[79];
  }
  let t30;
  if ($[80] !== api.groupBy || $[81] !== api.groups || $[82] !== api.groupsTotal) {
    t30 = api.groupBy && /*#__PURE__*/_jsxs(Typography, {
      sx: {
        fontSize: "13px",
        fontWeight: 500,
        color: "text.secondary",
        fontVariantNumeric: "tabular-nums"
      },
      children: [api.groups.length, " groups \xB7 ", api.groupsTotal, " records"]
    });
    $[80] = api.groupBy;
    $[81] = api.groups;
    $[82] = api.groupsTotal;
    $[83] = t30;
  } else {
    t30 = $[83];
  }
  let t31;
  if ($[84] !== t29 || $[85] !== t30) {
    t31 = /*#__PURE__*/_jsxs(Box, {
      sx: t28,
      children: [t29, t30]
    });
    $[84] = t29;
    $[85] = t30;
    $[86] = t31;
  } else {
    t31 = $[86];
  }
  let t32;
  if ($[87] !== t27 || $[88] !== t31) {
    t32 = /*#__PURE__*/_jsxs(Stack, {
      direction: t15,
      sx: t16,
      children: [t27, t31]
    });
    $[87] = t27;
    $[88] = t31;
    $[89] = t32;
  } else {
    t32 = $[89];
  }
  let t33;
  if ($[90] !== actions || $[91] !== actionsAnchor || $[92] !== runAction) {
    t33 = actions && actions.length > 0 && /*#__PURE__*/_jsx(Menu, {
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
    $[90] = actions;
    $[91] = actionsAnchor;
    $[92] = runAction;
    $[93] = t33;
  } else {
    t33 = $[93];
  }
  let t34;
  if ($[94] !== api.selectedIds || $[95] !== executeAction || $[96] !== pendingAction) {
    t34 = pendingAction && /*#__PURE__*/_jsx(ConfirmDialog, {
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
    $[94] = api.selectedIds;
    $[95] = executeAction;
    $[96] = pendingAction;
    $[97] = t34;
  } else {
    t34 = $[97];
  }
  let t35;
  if ($[98] !== exportAnchor || $[99] !== exportFormats || $[100] !== onExport || $[101] !== runExport) {
    t35 = onExport && exportFormats.length > 1 && /*#__PURE__*/_jsx(Menu, {
      anchorEl: exportAnchor,
      open: Boolean(exportAnchor),
      onClose: () => setExportAnchor(null),
      children: exportFormats.map(format_0 => /*#__PURE__*/_jsx(MenuItem, {
        onClick: () => runExport(format_0.id),
        children: format_0.label
      }, format_0.id))
    });
    $[98] = exportAnchor;
    $[99] = exportFormats;
    $[100] = onExport;
    $[101] = runExport;
    $[102] = t35;
  } else {
    t35 = $[102];
  }
  const t36 = Boolean(groupAnchor);
  let t37;
  if ($[103] === Symbol.for("react.memo_cache_sentinel")) {
    t37 = () => setGroupAnchor(null);
    $[103] = t37;
  } else {
    t37 = $[103];
  }
  let t38;
  if ($[104] === Symbol.for("react.memo_cache_sentinel")) {
    t38 = {
      field: null,
      label: "None"
    };
    $[104] = t38;
  } else {
    t38 = $[104];
  }
  let t39;
  if ($[105] !== api.groupByColumns) {
    t39 = api.groupByColumns ?? [];
    $[105] = api.groupByColumns;
    $[106] = t39;
  } else {
    t39 = $[106];
  }
  let t40;
  if ($[107] !== t39) {
    t40 = [t38, ...t39];
    $[107] = t39;
    $[108] = t40;
  } else {
    t40 = $[108];
  }
  let t41;
  if ($[109] !== api || $[110] !== t40) {
    t41 = t40.map(g_0 => /*#__PURE__*/_jsx(MenuItem, {
      selected: api.groupBy === g_0.field,
      onClick: () => {
        api.setGroupBy(g_0.field);
        setGroupAnchor(null);
      },
      children: g_0.label
    }, g_0.label));
    $[109] = api;
    $[110] = t40;
    $[111] = t41;
  } else {
    t41 = $[111];
  }
  let t42;
  if ($[112] !== groupAnchor || $[113] !== t36 || $[114] !== t41) {
    t42 = /*#__PURE__*/_jsx(Menu, {
      anchorEl: groupAnchor,
      open: t36,
      onClose: t37,
      children: t41
    });
    $[112] = groupAnchor;
    $[113] = t36;
    $[114] = t41;
    $[115] = t42;
  } else {
    t42 = $[115];
  }
  let t43;
  if ($[116] !== applyFilters || $[117] !== filterAnchor || $[118] !== filterColumns || $[119] !== filterDraft || $[120] !== filterRenderers || $[121] !== presets) {
    t43 = filterColumns && /*#__PURE__*/_jsx(DataTableFilterMenu, {
      filterRenderers: filterRenderers,
      anchorEl: filterAnchor,
      onClose: () => setFilterAnchor(null),
      filterColumns: filterColumns,
      draft: filterDraft,
      onDraftChange: setFilterDraft,
      onApply: applyFilters,
      presets: presets
    });
    $[116] = applyFilters;
    $[117] = filterAnchor;
    $[118] = filterColumns;
    $[119] = filterDraft;
    $[120] = filterRenderers;
    $[121] = presets;
    $[122] = t43;
  } else {
    t43 = $[122];
  }
  let t44;
  if ($[123] !== filterColumns || $[124] !== manageOpen || $[125] !== presets) {
    t44 = presets && filterColumns && /*#__PURE__*/_jsx(ManageViewsDialog, {
      open: manageOpen,
      onClose: () => setManageOpen(false),
      presets: presets,
      filterColumns: filterColumns
    });
    $[123] = filterColumns;
    $[124] = manageOpen;
    $[125] = presets;
    $[126] = t44;
  } else {
    t44 = $[126];
  }
  let t45;
  if ($[127] !== filterColumns || $[128] !== presets || $[129] !== settings || $[130] !== settingsOpen) {
    t45 = settings && /*#__PURE__*/_jsx(DataTableSettingsDialog, {
      open: settingsOpen,
      onClose: () => setSettingsOpen(false),
      onManageViews: presets && filterColumns ? () => {
        setSettingsOpen(false);
        setManageOpen(true);
      } : undefined
    });
    $[127] = filterColumns;
    $[128] = presets;
    $[129] = settings;
    $[130] = settingsOpen;
    $[131] = t45;
  } else {
    t45 = $[131];
  }
  let t46;
  if ($[132] === Symbol.for("react.memo_cache_sentinel")) {
    t46 = {
      p: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      minHeight: 0
    };
    $[132] = t46;
  } else {
    t46 = $[132];
  }
  let t47;
  if ($[133] !== emptyMessage || $[134] !== errorMessage || $[135] !== noResultsMessage || $[136] !== onRowClick || $[137] !== onRowIntent || $[138] !== rowClass || $[139] !== stickyHeader || $[140] !== withSelection) {
    t47 = /*#__PURE__*/_jsx(Card, {
      sx: t46,
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
    $[133] = emptyMessage;
    $[134] = errorMessage;
    $[135] = noResultsMessage;
    $[136] = onRowClick;
    $[137] = onRowIntent;
    $[138] = rowClass;
    $[139] = stickyHeader;
    $[140] = withSelection;
    $[141] = t47;
  } else {
    t47 = $[141];
  }
  let t48;
  if ($[142] !== api || $[143] !== t14 || $[144] !== t32 || $[145] !== t33 || $[146] !== t34 || $[147] !== t35 || $[148] !== t42 || $[149] !== t43 || $[150] !== t44 || $[151] !== t45 || $[152] !== t47) {
    t48 = /*#__PURE__*/_jsxs(DataTableRoot, {
      api: api,
      children: [t14, t32, t33, t34, t35, t42, t43, t44, t45, t47]
    });
    $[142] = api;
    $[143] = t14;
    $[144] = t32;
    $[145] = t33;
    $[146] = t34;
    $[147] = t35;
    $[148] = t42;
    $[149] = t43;
    $[150] = t44;
    $[151] = t45;
    $[152] = t47;
    $[153] = t48;
  } else {
    t48 = $[153];
  }
  return t48;
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