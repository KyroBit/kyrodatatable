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
    rowsPerPageOptions
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
  const [groupAnchor, setGroupAnchor] = useState(null);
  const [actionsAnchor, setActionsAnchor] = useState(null);
  const [exportAnchor, setExportAnchor] = useState(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  let t8;
  if ($[3] !== api.filters) {
    t8 = api.filters ?? {};
    $[3] = api.filters;
    $[4] = t8;
  } else {
    t8 = $[4];
  }
  const filters = t8;
  let t9;
  if ($[5] !== filters) {
    t9 = countFilterValues(filters);
    $[5] = filters;
    $[6] = t9;
  } else {
    t9 = $[6];
  }
  const filterCount = t9;
  const withSelection = Boolean(selectable || actions && actions.length > 0);
  let t10;
  bb0: {
    if (selectedPresetId && presets) {
      let selected;
      let t11;
      if ($[7] !== filters || $[8] !== presets.all || $[9] !== selectedPresetId) {
        let t12;
        if ($[12] !== selectedPresetId) {
          t12 = p => p.id === selectedPresetId;
          $[12] = selectedPresetId;
          $[13] = t12;
        } else {
          t12 = $[13];
        }
        selected = presets.all.find(t12);
        t11 = selected && filterValuesEqual(selected.filters, filters);
        $[7] = filters;
        $[8] = presets.all;
        $[9] = selectedPresetId;
        $[10] = selected;
        $[11] = t11;
      } else {
        selected = $[10];
        t11 = $[11];
      }
      if (t11) {
        t10 = selected.id;
        break bb0;
      }
    }
    if (countFilterValues(filters) === 0) {
      t10 = "all";
      break bb0;
    }
    let t11;
    if ($[14] !== filters || $[15] !== presets?.all) {
      t11 = presets?.all.find(p_0 => filterValuesEqual(p_0.filters, filters))?.id ?? null;
      $[14] = filters;
      $[15] = presets?.all;
      $[16] = t11;
    } else {
      t11 = $[16];
    }
    t10 = t11;
  }
  const activePresetId = t10;
  let t11;
  if ($[17] !== api) {
    t11 = (next, presetId) => {
      setSelectedPresetId(presetId ?? null);
      api.setFilters(next);
    };
    $[17] = api;
    $[18] = t11;
  } else {
    t11 = $[18];
  }
  const applyFilters = t11;
  let t12;
  if ($[19] !== api.groupBy || $[20] !== api.groupByColumns) {
    t12 = api.groupByColumns?.find(g => g.field === api.groupBy)?.label;
    $[19] = api.groupBy;
    $[20] = api.groupByColumns;
    $[21] = t12;
  } else {
    t12 = $[21];
  }
  const activeGroupLabel = t12;
  let t13;
  if ($[22] !== api) {
    t13 = async action => {
      await action.handle(api.selectedIds);
      api.clearSelection();
      if (api.groupBy) {
        api.setGroupBy(api.groupBy);
      }
      api.refetch();
    };
    $[22] = api;
    $[23] = t13;
  } else {
    t13 = $[23];
  }
  const executeAction = t13;
  let t14;
  if ($[24] !== executeAction) {
    t14 = action_0 => {
      setActionsAnchor(null);
      if (action_0.confirmationMessage) {
        setPendingAction(action_0);
        return;
      }
      executeAction(action_0);
    };
    $[24] = executeAction;
    $[25] = t14;
  } else {
    t14 = $[25];
  }
  const runAction = t14;
  let t15;
  if ($[26] !== api.filters || $[27] !== api.groupBy || $[28] !== api.search || $[29] !== api.selectedIds || $[30] !== api.sort || $[31] !== onExport) {
    t15 = format => {
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
    $[32] = t15;
  } else {
    t15 = $[32];
  }
  const runExport = t15;
  let t16;
  if ($[33] !== activePresetId || $[34] !== applyFilters || $[35] !== createLabel || $[36] !== onCreate || $[37] !== presets || $[38] !== toolbarEnd) {
    t16 = (presets || onCreate || toolbarEnd) && /*#__PURE__*/_jsxs(Stack, {
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
    $[39] = t16;
  } else {
    t16 = $[39];
  }
  let t17;
  let t18;
  if ($[40] === Symbol.for("react.memo_cache_sentinel")) {
    t17 = {
      xs: "column",
      sm: "row"
    };
    t18 = {
      alignItems: {
        xs: "stretch",
        sm: "center"
      },
      justifyContent: "space-between",
      gap: 1,
      minHeight: 40
    };
    $[40] = t17;
    $[41] = t18;
  } else {
    t17 = $[40];
    t18 = $[41];
  }
  let t19;
  if ($[42] === Symbol.for("react.memo_cache_sentinel")) {
    t19 = {
      alignItems: "center",
      flexWrap: "wrap",
      minWidth: 0
    };
    $[42] = t19;
  } else {
    t19 = $[42];
  }
  let t20;
  if ($[43] !== searchPlaceholder || $[44] !== searchWidth) {
    t20 = /*#__PURE__*/_jsx(DataTableSearchField, {
      placeholder: searchPlaceholder,
      width: searchWidth,
      alwaysOpen: true
    });
    $[43] = searchPlaceholder;
    $[44] = searchWidth;
    $[45] = t20;
  } else {
    t20 = $[45];
  }
  let t21;
  if ($[46] !== filterColumns || $[47] !== filterCount || $[48] !== filters) {
    t21 = filterColumns && /*#__PURE__*/_jsx(Badge, {
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
    $[49] = t21;
  } else {
    t21 = $[49];
  }
  let t22;
  if ($[50] === Symbol.for("react.memo_cache_sentinel")) {
    t22 = {
      alignItems: "center",
      flexWrap: "nowrap",
      overflowX: "auto",
      minWidth: 0,
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none"
      }
    };
    $[50] = t22;
  } else {
    t22 = $[50];
  }
  let t23;
  if ($[51] !== activeGroupLabel || $[52] !== api.groupByColumns) {
    t23 = api.groupByColumns && api.groupByColumns.length > 0 && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(GroupIcon, {}),
      label: activeGroupLabel ? `Group: ${activeGroupLabel}` : "Group",
      onClick: e_0 => setGroupAnchor(e_0.currentTarget)
    });
    $[51] = activeGroupLabel;
    $[52] = api.groupByColumns;
    $[53] = t23;
  } else {
    t23 = $[53];
  }
  let t24;
  if ($[54] !== exportFormats || $[55] !== exportTooltip || $[56] !== onExport || $[57] !== runExport) {
    t24 = onExport && /*#__PURE__*/_jsx(Tooltip, {
      title: exportTooltip,
      children: /*#__PURE__*/_jsx("span", {
        children: /*#__PURE__*/_jsx(ToolbarBtn, {
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
        })
      })
    });
    $[54] = exportFormats;
    $[55] = exportTooltip;
    $[56] = onExport;
    $[57] = runExport;
    $[58] = t24;
  } else {
    t24 = $[58];
  }
  let t25;
  if ($[59] !== importTooltip || $[60] !== onImport) {
    t25 = onImport && /*#__PURE__*/_jsx(Tooltip, {
      title: importTooltip,
      children: /*#__PURE__*/_jsx("span", {
        children: /*#__PURE__*/_jsx(ToolbarBtn, {
          icon: /*#__PURE__*/_jsx(ImportIcon, {}),
          label: "Import",
          menu: false,
          onClick: onImport
        })
      })
    });
    $[59] = importTooltip;
    $[60] = onImport;
    $[61] = t25;
  } else {
    t25 = $[61];
  }
  let t26;
  if ($[62] !== actions || $[63] !== api.selectedIds) {
    t26 = actions && actions.length > 0 && api.selectedIds.length > 0 && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ActionsIcon, {}),
      label: `Actions (${api.selectedIds.length})`,
      onClick: e_2 => setActionsAnchor(e_2.currentTarget)
    });
    $[62] = actions;
    $[63] = api.selectedIds;
    $[64] = t26;
  } else {
    t26 = $[64];
  }
  let t27;
  if ($[65] !== settings) {
    t27 = settings && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(SettingIcon, {}),
      label: "Settings",
      menu: false,
      onClick: () => setSettingsOpen(true)
    });
    $[65] = settings;
    $[66] = t27;
  } else {
    t27 = $[66];
  }
  let t28;
  if ($[67] !== t23 || $[68] !== t24 || $[69] !== t25 || $[70] !== t26 || $[71] !== t27) {
    t28 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      sx: t22,
      children: [t23, t24, t25, t26, t27]
    });
    $[67] = t23;
    $[68] = t24;
    $[69] = t25;
    $[70] = t26;
    $[71] = t27;
    $[72] = t28;
  } else {
    t28 = $[72];
  }
  let t29;
  if ($[73] !== t20 || $[74] !== t21 || $[75] !== t28) {
    t29 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: 1,
      sx: t19,
      children: [t20, t21, t28]
    });
    $[73] = t20;
    $[74] = t21;
    $[75] = t28;
    $[76] = t29;
  } else {
    t29 = $[76];
  }
  let t30;
  if ($[77] === Symbol.for("react.memo_cache_sentinel")) {
    t30 = {
      minHeight: 40,
      display: "flex",
      alignItems: "center",
      flexShrink: 0
    };
    $[77] = t30;
  } else {
    t30 = $[77];
  }
  let t31;
  if ($[78] !== rowsPerPageOptions) {
    t31 = /*#__PURE__*/_jsx(DataTablePagination, {
      rowsPerPageOptions: rowsPerPageOptions
    });
    $[78] = rowsPerPageOptions;
    $[79] = t31;
  } else {
    t31 = $[79];
  }
  let t32;
  if ($[80] !== api.groupBy || $[81] !== api.groups || $[82] !== api.groupsTotal) {
    t32 = api.groupBy && /*#__PURE__*/_jsxs(Typography, {
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
    $[83] = t32;
  } else {
    t32 = $[83];
  }
  let t33;
  if ($[84] !== t31 || $[85] !== t32) {
    t33 = /*#__PURE__*/_jsxs(Box, {
      sx: t30,
      children: [t31, t32]
    });
    $[84] = t31;
    $[85] = t32;
    $[86] = t33;
  } else {
    t33 = $[86];
  }
  let t34;
  if ($[87] !== t29 || $[88] !== t33) {
    t34 = /*#__PURE__*/_jsxs(Stack, {
      direction: t17,
      sx: t18,
      children: [t29, t33]
    });
    $[87] = t29;
    $[88] = t33;
    $[89] = t34;
  } else {
    t34 = $[89];
  }
  let t35;
  if ($[90] !== actions || $[91] !== actionsAnchor || $[92] !== runAction) {
    t35 = actions && actions.length > 0 && /*#__PURE__*/_jsx(Menu, {
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
    $[93] = t35;
  } else {
    t35 = $[93];
  }
  let t36;
  if ($[94] !== api.selectedIds || $[95] !== executeAction || $[96] !== pendingAction) {
    t36 = pendingAction && /*#__PURE__*/_jsx(ConfirmDialog, {
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
    $[97] = t36;
  } else {
    t36 = $[97];
  }
  let t37;
  if ($[98] !== exportAnchor || $[99] !== exportFormats || $[100] !== onExport || $[101] !== runExport) {
    t37 = onExport && exportFormats.length > 1 && /*#__PURE__*/_jsx(Menu, {
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
    $[102] = t37;
  } else {
    t37 = $[102];
  }
  const t38 = Boolean(groupAnchor);
  let t39;
  if ($[103] === Symbol.for("react.memo_cache_sentinel")) {
    t39 = () => setGroupAnchor(null);
    $[103] = t39;
  } else {
    t39 = $[103];
  }
  let t40;
  if ($[104] === Symbol.for("react.memo_cache_sentinel")) {
    t40 = {
      field: null,
      label: "None"
    };
    $[104] = t40;
  } else {
    t40 = $[104];
  }
  let t41;
  if ($[105] !== api.groupByColumns) {
    t41 = api.groupByColumns ?? [];
    $[105] = api.groupByColumns;
    $[106] = t41;
  } else {
    t41 = $[106];
  }
  let t42;
  if ($[107] !== t41) {
    t42 = [t40, ...t41];
    $[107] = t41;
    $[108] = t42;
  } else {
    t42 = $[108];
  }
  let t43;
  if ($[109] !== api || $[110] !== t42) {
    t43 = t42.map(g_0 => /*#__PURE__*/_jsx(MenuItem, {
      selected: api.groupBy === g_0.field,
      onClick: () => {
        api.setGroupBy(g_0.field);
        setGroupAnchor(null);
      },
      children: g_0.label
    }, g_0.label));
    $[109] = api;
    $[110] = t42;
    $[111] = t43;
  } else {
    t43 = $[111];
  }
  let t44;
  if ($[112] !== groupAnchor || $[113] !== t38 || $[114] !== t43) {
    t44 = /*#__PURE__*/_jsx(Menu, {
      anchorEl: groupAnchor,
      open: t38,
      onClose: t39,
      children: t43
    });
    $[112] = groupAnchor;
    $[113] = t38;
    $[114] = t43;
    $[115] = t44;
  } else {
    t44 = $[115];
  }
  let t45;
  if ($[116] !== applyFilters || $[117] !== filterAnchor || $[118] !== filterColumns || $[119] !== filterDraft || $[120] !== filterRenderers || $[121] !== presets) {
    t45 = filterColumns && /*#__PURE__*/_jsx(DataTableFilterMenu, {
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
    $[122] = t45;
  } else {
    t45 = $[122];
  }
  let t46;
  if ($[123] !== filterColumns || $[124] !== manageOpen || $[125] !== presets) {
    t46 = presets && filterColumns && /*#__PURE__*/_jsx(ManageViewsDialog, {
      open: manageOpen,
      onClose: () => setManageOpen(false),
      presets: presets,
      filterColumns: filterColumns
    });
    $[123] = filterColumns;
    $[124] = manageOpen;
    $[125] = presets;
    $[126] = t46;
  } else {
    t46 = $[126];
  }
  let t47;
  if ($[127] !== filterColumns || $[128] !== presets || $[129] !== settings || $[130] !== settingsOpen) {
    t47 = settings && /*#__PURE__*/_jsx(DataTableSettingsDialog, {
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
    $[131] = t47;
  } else {
    t47 = $[131];
  }
  let t48;
  if ($[132] === Symbol.for("react.memo_cache_sentinel")) {
    t48 = {
      p: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      minHeight: 0
    };
    $[132] = t48;
  } else {
    t48 = $[132];
  }
  let t49;
  if ($[133] !== emptyMessage || $[134] !== errorMessage || $[135] !== noResultsMessage || $[136] !== onRowClick || $[137] !== onRowIntent || $[138] !== rowClass || $[139] !== stickyHeader || $[140] !== withSelection) {
    t49 = /*#__PURE__*/_jsx(Card, {
      sx: t48,
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
    $[141] = t49;
  } else {
    t49 = $[141];
  }
  let t50;
  if ($[142] !== api || $[143] !== t16 || $[144] !== t34 || $[145] !== t35 || $[146] !== t36 || $[147] !== t37 || $[148] !== t44 || $[149] !== t45 || $[150] !== t46 || $[151] !== t47 || $[152] !== t49) {
    t50 = /*#__PURE__*/_jsxs(DataTableRoot, {
      api: api,
      children: [t16, t34, t35, t36, t37, t44, t45, t46, t47, t49]
    });
    $[142] = api;
    $[143] = t16;
    $[144] = t34;
    $[145] = t35;
    $[146] = t36;
    $[147] = t37;
    $[148] = t44;
    $[149] = t45;
    $[150] = t46;
    $[151] = t47;
    $[152] = t49;
    $[153] = t50;
  } else {
    t50 = $[153];
  }
  return t50;
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