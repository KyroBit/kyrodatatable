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
import { ActionsIcon, AddIcon, ExpandMoreIcon, ExportIcon, FilterIcon, GroupIcon, ImportIcon, MoreIcon, SettingIcon } from './icons.js';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The full list-page assembly: views pills + manage, create, search with the
 * filter popover, group-by, export/import, contextual bulk actions, the table
 * card, and top-right pagination. Every section is opt-in through props; for
 * a custom layout compose the exported pieces yourself.
 */
export function DataTable(t0) {
  const $ = _c(156);
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
  const [groupAnchor, setGroupAnchor] = useState(null);
  const [actionsAnchor, setActionsAnchor] = useState(null);
  const [moreAnchor, setMoreAnchor] = useState(null);
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
      setActionsAnchor(null);
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
      setMoreAnchor(null);
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
  if ($[55] === Symbol.for("react.memo_cache_sentinel")) {
    t23 = {
      alignItems: "center",
      flexWrap: "nowrap",
      overflowX: "auto",
      minWidth: 0,
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": {
        display: "none"
      }
    };
    $[55] = t23;
  } else {
    t23 = $[55];
  }
  let t24;
  if ($[56] !== activeGroupLabel || $[57] !== api.groupByColumns) {
    t24 = api.groupByColumns && api.groupByColumns.length > 0 && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(GroupIcon, {}),
      label: activeGroupLabel ? `Group: ${activeGroupLabel}` : "Group",
      onClick: e_0 => setGroupAnchor(e_0.currentTarget)
    });
    $[56] = activeGroupLabel;
    $[57] = api.groupByColumns;
    $[58] = t24;
  } else {
    t24 = $[58];
  }
  let t25;
  if ($[59] !== actions || $[60] !== api.selectedIds) {
    t25 = actions && actions.length > 0 && api.selectedIds.length > 0 && /*#__PURE__*/_jsx(ToolbarBtn, {
      icon: /*#__PURE__*/_jsx(ActionsIcon, {}),
      label: `Actions (${api.selectedIds.length})`,
      onClick: e_1 => setActionsAnchor(e_1.currentTarget)
    });
    $[59] = actions;
    $[60] = api.selectedIds;
    $[61] = t25;
  } else {
    t25 = $[61];
  }
  let t26;
  if ($[62] !== onExport || $[63] !== onImport || $[64] !== settings) {
    t26 = (onExport || onImport || settings) && /*#__PURE__*/_jsx(Button, {
      variant: "outlined",
      "aria-label": "More",
      onClick: e_2 => setMoreAnchor(e_2.currentTarget),
      children: /*#__PURE__*/_jsx(MoreIcon, {})
    });
    $[62] = onExport;
    $[63] = onImport;
    $[64] = settings;
    $[65] = t26;
  } else {
    t26 = $[65];
  }
  let t27;
  if ($[66] !== t24 || $[67] !== t25 || $[68] !== t26) {
    t27 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      spacing: "sm",
      sx: t23,
      children: [t24, t25, t26]
    });
    $[66] = t24;
    $[67] = t25;
    $[68] = t26;
    $[69] = t27;
  } else {
    t27 = $[69];
  }
  let t28;
  if ($[70] !== t22 || $[71] !== t27) {
    t28 = /*#__PURE__*/_jsx(Stack, {
      sx: t19,
      children: /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        spacing: "sm",
        sx: t20,
        children: [t22, t27]
      })
    });
    $[70] = t22;
    $[71] = t27;
    $[72] = t28;
  } else {
    t28 = $[72];
  }
  let t29;
  if ($[73] !== actions || $[74] !== actionsAnchor || $[75] !== runAction) {
    t29 = actions && actions.length > 0 && /*#__PURE__*/_jsx(Menu, {
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
    $[73] = actions;
    $[74] = actionsAnchor;
    $[75] = runAction;
    $[76] = t29;
  } else {
    t29 = $[76];
  }
  let t30;
  if ($[77] !== api.selectedIds || $[78] !== executeAction || $[79] !== pendingAction) {
    t30 = pendingAction && /*#__PURE__*/_jsx(ConfirmDialog, {
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
    $[77] = api.selectedIds;
    $[78] = executeAction;
    $[79] = pendingAction;
    $[80] = t30;
  } else {
    t30 = $[80];
  }
  const t31 = Boolean(moreAnchor);
  let t32;
  if ($[81] === Symbol.for("react.memo_cache_sentinel")) {
    t32 = () => setMoreAnchor(null);
    $[81] = t32;
  } else {
    t32 = $[81];
  }
  let t33;
  if ($[82] !== exportFormats || $[83] !== exportTooltip || $[84] !== onExport || $[85] !== runExport) {
    t33 = onExport && exportFormats.map(format_0 => /*#__PURE__*/_jsxs(MenuItem, {
      onClick: () => runExport(format_0.id),
      children: [/*#__PURE__*/_jsx(ListItemIcon, {
        children: /*#__PURE__*/_jsx(ExportIcon, {})
      }), /*#__PURE__*/_jsx(ListItemText, {
        primary: exportFormats.length > 1 ? `Export as ${format_0.label}` : "Export",
        secondary: exportFormats.length > 1 ? undefined : exportTooltip
      })]
    }, format_0.id));
    $[82] = exportFormats;
    $[83] = exportTooltip;
    $[84] = onExport;
    $[85] = runExport;
    $[86] = t33;
  } else {
    t33 = $[86];
  }
  let t34;
  if ($[87] !== importTooltip || $[88] !== onImport) {
    t34 = onImport && /*#__PURE__*/_jsxs(MenuItem, {
      onClick: () => {
        setMoreAnchor(null);
        onImport();
      },
      children: [/*#__PURE__*/_jsx(ListItemIcon, {
        children: /*#__PURE__*/_jsx(ImportIcon, {})
      }), /*#__PURE__*/_jsx(ListItemText, {
        primary: "Import",
        secondary: importTooltip
      })]
    });
    $[87] = importTooltip;
    $[88] = onImport;
    $[89] = t34;
  } else {
    t34 = $[89];
  }
  let t35;
  if ($[90] !== settings) {
    t35 = settings && /*#__PURE__*/_jsxs(MenuItem, {
      onClick: () => {
        setMoreAnchor(null);
        setSettingsOpen(true);
      },
      children: [/*#__PURE__*/_jsx(ListItemIcon, {
        children: /*#__PURE__*/_jsx(SettingIcon, {})
      }), /*#__PURE__*/_jsx(ListItemText, {
        primary: "Settings"
      })]
    });
    $[90] = settings;
    $[91] = t35;
  } else {
    t35 = $[91];
  }
  let t36;
  if ($[92] !== moreAnchor || $[93] !== t31 || $[94] !== t33 || $[95] !== t34 || $[96] !== t35) {
    t36 = /*#__PURE__*/_jsxs(Menu, {
      anchorEl: moreAnchor,
      open: t31,
      onClose: t32,
      children: [t33, t34, t35]
    });
    $[92] = moreAnchor;
    $[93] = t31;
    $[94] = t33;
    $[95] = t34;
    $[96] = t35;
    $[97] = t36;
  } else {
    t36 = $[97];
  }
  const t37 = Boolean(groupAnchor);
  let t38;
  if ($[98] === Symbol.for("react.memo_cache_sentinel")) {
    t38 = () => setGroupAnchor(null);
    $[98] = t38;
  } else {
    t38 = $[98];
  }
  let t39;
  if ($[99] === Symbol.for("react.memo_cache_sentinel")) {
    t39 = {
      field: null,
      label: "None"
    };
    $[99] = t39;
  } else {
    t39 = $[99];
  }
  let t40;
  if ($[100] !== api.groupByColumns) {
    t40 = api.groupByColumns ?? [];
    $[100] = api.groupByColumns;
    $[101] = t40;
  } else {
    t40 = $[101];
  }
  let t41;
  if ($[102] !== t40) {
    t41 = [t39, ...t40];
    $[102] = t40;
    $[103] = t41;
  } else {
    t41 = $[103];
  }
  let t42;
  if ($[104] !== api || $[105] !== t41) {
    t42 = t41.map(g_0 => /*#__PURE__*/_jsx(MenuItem, {
      selected: api.groupBy === g_0.field,
      onClick: () => {
        api.setGroupBy(g_0.field);
        setGroupAnchor(null);
      },
      children: g_0.label
    }, g_0.label));
    $[104] = api;
    $[105] = t41;
    $[106] = t42;
  } else {
    t42 = $[106];
  }
  let t43;
  if ($[107] !== groupAnchor || $[108] !== t37 || $[109] !== t42) {
    t43 = /*#__PURE__*/_jsx(Menu, {
      anchorEl: groupAnchor,
      open: t37,
      onClose: t38,
      children: t42
    });
    $[107] = groupAnchor;
    $[108] = t37;
    $[109] = t42;
    $[110] = t43;
  } else {
    t43 = $[110];
  }
  let t44;
  if ($[111] !== applyFilters || $[112] !== filterAnchor || $[113] !== filterColumns || $[114] !== filterDraft || $[115] !== filterRenderers || $[116] !== presets) {
    t44 = filterColumns && /*#__PURE__*/_jsx(DataTableFilterMenu, {
      filterRenderers: filterRenderers,
      anchorEl: filterAnchor,
      onClose: () => setFilterAnchor(null),
      filterColumns: filterColumns,
      draft: filterDraft,
      onDraftChange: setFilterDraft,
      onApply: applyFilters,
      presets: presets
    });
    $[111] = applyFilters;
    $[112] = filterAnchor;
    $[113] = filterColumns;
    $[114] = filterDraft;
    $[115] = filterRenderers;
    $[116] = presets;
    $[117] = t44;
  } else {
    t44 = $[117];
  }
  let t45;
  if ($[118] !== filterColumns || $[119] !== manageOpen || $[120] !== presets) {
    t45 = presets && filterColumns && /*#__PURE__*/_jsx(ManageViewsDialog, {
      open: manageOpen,
      onClose: () => setManageOpen(false),
      presets: presets,
      filterColumns: filterColumns
    });
    $[118] = filterColumns;
    $[119] = manageOpen;
    $[120] = presets;
    $[121] = t45;
  } else {
    t45 = $[121];
  }
  let t46;
  if ($[122] !== filterColumns || $[123] !== presets || $[124] !== settings || $[125] !== settingsOpen) {
    t46 = settings && /*#__PURE__*/_jsx(DataTableSettingsDialog, {
      open: settingsOpen,
      onClose: () => setSettingsOpen(false),
      onManageViews: presets && filterColumns ? () => {
        setSettingsOpen(false);
        setManageOpen(true);
      } : undefined
    });
    $[122] = filterColumns;
    $[123] = presets;
    $[124] = settings;
    $[125] = settingsOpen;
    $[126] = t46;
  } else {
    t46 = $[126];
  }
  let t47;
  if ($[127] === Symbol.for("react.memo_cache_sentinel")) {
    t47 = {
      p: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      minHeight: 0
    };
    $[127] = t47;
  } else {
    t47 = $[127];
  }
  let t48;
  if ($[128] !== emptyMessage || $[129] !== errorMessage || $[130] !== infiniteScroll || $[131] !== noResultsMessage || $[132] !== onRowClick || $[133] !== rowClass || $[134] !== stickyHeader || $[135] !== withSelection) {
    t48 = /*#__PURE__*/_jsx(Card, {
      sx: t47,
      children: /*#__PURE__*/_jsx(DataTableBody, {
        selectable: withSelection,
        emptyMessage: emptyMessage,
        noResultsMessage: noResultsMessage,
        errorMessage: errorMessage,
        stickyHeader: stickyHeader,
        onRowClick: onRowClick,
        rowClass: rowClass,
        infiniteScroll: infiniteScroll
      })
    });
    $[128] = emptyMessage;
    $[129] = errorMessage;
    $[130] = infiniteScroll;
    $[131] = noResultsMessage;
    $[132] = onRowClick;
    $[133] = rowClass;
    $[134] = stickyHeader;
    $[135] = withSelection;
    $[136] = t48;
  } else {
    t48 = $[136];
  }
  let t49;
  if ($[137] !== api.groupBy || $[138] !== api.groups || $[139] !== api.groupsTotal || $[140] !== infiniteScroll || $[141] !== rowsPerPageOptions) {
    t49 = (!infiniteScroll || api.groupBy) && /*#__PURE__*/_jsxs(Box, {
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
    $[137] = api.groupBy;
    $[138] = api.groups;
    $[139] = api.groupsTotal;
    $[140] = infiniteScroll;
    $[141] = rowsPerPageOptions;
    $[142] = t49;
  } else {
    t49 = $[142];
  }
  let t50;
  if ($[143] !== api || $[144] !== t18 || $[145] !== t28 || $[146] !== t29 || $[147] !== t30 || $[148] !== t36 || $[149] !== t43 || $[150] !== t44 || $[151] !== t45 || $[152] !== t46 || $[153] !== t48 || $[154] !== t49) {
    t50 = /*#__PURE__*/_jsxs(DataTableRoot, {
      api: api,
      children: [t18, t28, t29, t30, t36, t43, t44, t45, t46, t48, t49]
    });
    $[143] = api;
    $[144] = t18;
    $[145] = t28;
    $[146] = t29;
    $[147] = t30;
    $[148] = t36;
    $[149] = t43;
    $[150] = t44;
    $[151] = t45;
    $[152] = t46;
    $[153] = t48;
    $[154] = t49;
    $[155] = t50;
  } else {
    t50 = $[155];
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
    t2 = menu ? /*#__PURE__*/_jsx(ExpandMoreIcon, {}) : undefined;
    $[0] = menu;
    $[1] = t2;
  } else {
    t2 = $[1];
  }
  let t3;
  if ($[2] !== icon || $[3] !== label || $[4] !== onClick || $[5] !== t2) {
    t3 = /*#__PURE__*/_jsx(Button, {
      variant: "outlined",
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