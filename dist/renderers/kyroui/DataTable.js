import { c as _c } from "react/compiler-runtime";
import { startTransition, useEffect, useLayoutEffect, useMemo, useOptimistic, useState } from 'react';
import { Badge, Box, Button, Card, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Submenu, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@kyrobit/kyroui';
import { countFilterValues, filterValuesEqual } from '@kyrobit/datatable';
import { DataTableRoot } from './context.js';
import { DataTableSearchField } from './SearchField.js';
import { DataTableBody } from './Body.js';
import { DataTablePagination } from './Pagination.js';
import { ManageViewsDialog } from './FilterMenu.js';
import { DataTableFilterButton } from './FilterButton.js';
import { DataTableGroupMenu, DataTableGroupPanel } from './GroupMenu.js';
import { DataTableSettingsDialog } from './SettingsDialog.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { ActionsIcon, CloseIcon, ExportIcon, GroupIcon, ImportIcon, SettingIcon } from './icons.js';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * The full list-page assembly: views pills + manage, create, search with the
 * filter popover, group-by, export/import, contextual bulk actions, the table
 * card, and top-right pagination. Every section is opt-in through props; for
 * a custom layout compose the exported pieces yourself.
 */
export function DataTable(t0) {
  const $ = _c(161);
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
    groupsPerPageOptions,
    infiniteScroll,
    restoreScroll,
    renderListItem,
    listVariant,
    variant
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
  const [manageOpen, setManageOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [toolbar, setToolbar] = useState(null);
  const [compact, setCompact] = useState(false);
  const [groupAnchor, setGroupAnchor] = useState(null);
  const selectMode = useState(false);
  const [selectModeOn, setSelectModeOn] = selectMode;
  let t4;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = {
      key: "",
      ids: []
    };
    $[2] = t4;
  } else {
    t4 = $[2];
  }
  const drill = useState(t4);
  const compactBelow = useTheme().breakpoints.values.sm;
  let t5;
  let t6;
  if ($[3] !== compactBelow || $[4] !== toolbar) {
    t5 = () => {
      if (!toolbar) {
        return;
      }
      setCompact(toolbar.clientWidth < compactBelow);
      const observer = new ResizeObserver(t7 => {
        const [entry] = t7;
        return setCompact(entry.contentRect.width < compactBelow);
      });
      observer.observe(toolbar);
      return () => observer.disconnect();
    };
    t6 = [toolbar, compactBelow];
    $[3] = compactBelow;
    $[4] = toolbar;
    $[5] = t5;
    $[6] = t6;
  } else {
    t5 = $[5];
    t6 = $[6];
  }
  useLayoutEffect(t5, t6);
  const {
    page
  } = api.pagination;
  const {
    setPage
  } = api;
  let t7;
  let t8;
  if ($[7] !== infiniteScroll || $[8] !== page || $[9] !== setPage) {
    t7 = () => {
      if (infiniteScroll && page !== 1) {
        setPage(1);
      }
    };
    t8 = [infiniteScroll, page, setPage];
    $[7] = infiniteScroll;
    $[8] = page;
    $[9] = setPage;
    $[10] = t7;
    $[11] = t8;
  } else {
    t7 = $[10];
    t8 = $[11];
  }
  useEffect(t7, t8);
  let t9;
  if ($[12] !== api.filters) {
    t9 = api.filters ?? {};
    $[12] = api.filters;
    $[13] = t9;
  } else {
    t9 = $[13];
  }
  const filters = t9;
  const withSelection = Boolean(selectable || actions && actions.length > 0);
  let t10;
  bb0: {
    if (selectedPresetId && presets) {
      let selected;
      let t11;
      if ($[14] !== filters || $[15] !== presets.all || $[16] !== selectedPresetId) {
        let t12;
        if ($[19] !== selectedPresetId) {
          t12 = p => p.id === selectedPresetId;
          $[19] = selectedPresetId;
          $[20] = t12;
        } else {
          t12 = $[20];
        }
        selected = presets.all.find(t12);
        t11 = selected && filterValuesEqual(selected.filters, filters);
        $[14] = filters;
        $[15] = presets.all;
        $[16] = selectedPresetId;
        $[17] = selected;
        $[18] = t11;
      } else {
        selected = $[17];
        t11 = $[18];
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
    if ($[21] !== filters || $[22] !== presets?.all) {
      t11 = presets?.all.find(p_0 => filterValuesEqual(p_0.filters, filters))?.id ?? null;
      $[21] = filters;
      $[22] = presets?.all;
      $[23] = t11;
    } else {
      t11 = $[23];
    }
    t10 = t11;
  }
  const activePresetId = t10;
  const [shownPresetId, showPreset] = useOptimistic(activePresetId);
  let t11;
  if ($[24] !== api) {
    t11 = (next, presetId) => {
      setSelectedPresetId(presetId ?? null);
      api.setFilters(next);
    };
    $[24] = api;
    $[25] = t11;
  } else {
    t11 = $[25];
  }
  const applyFilters = t11;
  let t12;
  if ($[26] !== applyFilters || $[27] !== showPreset) {
    t12 = (presetId_0, next_0) => startTransition(() => {
      showPreset(presetId_0);
      applyFilters(next_0, presetId_0 === "all" ? undefined : presetId_0);
    });
    $[26] = applyFilters;
    $[27] = showPreset;
    $[28] = t12;
  } else {
    t12 = $[28];
  }
  const pickPreset = t12;
  let t13;
  if ($[29] !== api) {
    t13 = async action => {
      await action.handle({
        selection: api.selection,
        count: api.selectedCount,
        search: api.search,
        filters: api.filters
      });
      api.clearSelection();
      setSelectModeOn(false);
      if (api.groupBy.length > 0) {
        api.setGroupBy(api.groupBy);
      }
      api.refetch();
    };
    $[29] = api;
    $[30] = t13;
  } else {
    t13 = $[30];
  }
  const executeAction = t13;
  let t14;
  if ($[31] !== executeAction) {
    t14 = action_0 => {
      if (action_0.confirmationMessage) {
        setPendingAction(action_0);
        return;
      }
      executeAction(action_0);
    };
    $[31] = executeAction;
    $[32] = t14;
  } else {
    t14 = $[32];
  }
  const runAction = t14;
  let t15;
  if ($[33] !== api.filters || $[34] !== api.groupBy || $[35] !== api.search || $[36] !== api.selection || $[37] !== api.sort || $[38] !== onExport) {
    t15 = format => {
      onExport?.({
        format,
        search: api.search,
        sort: api.sort,
        filters: api.filters,
        groupBy: api.groupBy,
        selection: api.selection
      });
    };
    $[33] = api.filters;
    $[34] = api.groupBy;
    $[35] = api.search;
    $[36] = api.selection;
    $[37] = api.sort;
    $[38] = onExport;
    $[39] = t15;
  } else {
    t15 = $[39];
  }
  const runExport = t15;
  const groupable = Boolean(api.groupByColumns && api.groupByColumns.length > 0);
  const hasActions = Boolean(actions && actions.length > 0);
  const selecting = compact && selectModeOn;
  const listed = renderListItem !== undefined && (variant === "list" || compact);
  let t16;
  if ($[40] !== api.groupBy || $[41] !== drill || $[42] !== listed) {
    t16 = listed && drill[0].key === api.groupBy.join("|") && drill[0].ids.length > 0;
    $[40] = api.groupBy;
    $[41] = drill;
    $[42] = listed;
    $[43] = t16;
  } else {
    t16 = $[43];
  }
  const drilledIn = t16;
  let t17;
  if ($[44] !== pickPreset || $[45] !== presets || $[46] !== shownPresetId) {
    t17 = presets && presets.all.length > 0 && /*#__PURE__*/_jsxs(ToggleButtonGroup, {
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
    });
    $[44] = pickPreset;
    $[45] = presets;
    $[46] = shownPresetId;
    $[47] = t17;
  } else {
    t17 = $[47];
  }
  const views = t17;
  const t18 = compact ? "100%" : searchWidth;
  let t19;
  if ($[48] !== applyFilters || $[49] !== filterColumns || $[50] !== filterRenderers || $[51] !== presets) {
    t19 = filterColumns && /*#__PURE__*/_jsx(DataTableFilterButton, {
      filterColumns: filterColumns,
      presets: presets,
      filterRenderers: filterRenderers,
      onApply: applyFilters
    });
    $[48] = applyFilters;
    $[49] = filterColumns;
    $[50] = filterRenderers;
    $[51] = presets;
    $[52] = t19;
  } else {
    t19 = $[52];
  }
  let t20;
  if ($[53] !== searchPlaceholder || $[54] !== t18 || $[55] !== t19) {
    t20 = /*#__PURE__*/_jsx(DataTableSearchField, {
      placeholder: searchPlaceholder,
      width: t18,
      alwaysOpen: true,
      endAdornment: t19
    });
    $[53] = searchPlaceholder;
    $[54] = t18;
    $[55] = t19;
    $[56] = t20;
  } else {
    t20 = $[56];
  }
  const search = t20;
  let t21;
  if ($[57] !== actions || $[58] !== runAction) {
    t21 = actions?.map(action_1 => /*#__PURE__*/_jsx(MenuItem, {
      onClick: () => runAction(action_1),
      children: action_1.label
    }, action_1.label));
    $[57] = actions;
    $[58] = runAction;
    $[59] = t21;
  } else {
    t21 = $[59];
  }
  const actionItems = t21;
  let t22;
  if ($[60] !== importTooltip || $[61] !== onImport) {
    t22 = onImport && /*#__PURE__*/_jsxs(MenuItem, {
      onClick: onImport,
      children: [/*#__PURE__*/_jsx(ListItemIcon, {
        children: /*#__PURE__*/_jsx(ImportIcon, {})
      }), /*#__PURE__*/_jsx(ListItemText, {
        primary: "Import",
        secondary: importTooltip
      })]
    }, "import");
    $[60] = importTooltip;
    $[61] = onImport;
    $[62] = t22;
  } else {
    t22 = $[62];
  }
  let t23;
  if ($[63] !== exportFormats || $[64] !== onExport || $[65] !== runExport) {
    t23 = onExport && exportFormats.length > 1 && /*#__PURE__*/_jsx(Submenu, {
      label: "Export",
      icon: /*#__PURE__*/_jsx(ExportIcon, {}),
      children: exportFormats.map(format_0 => /*#__PURE__*/_jsx(MenuItem, {
        onClick: () => runExport(format_0.id),
        children: format_0.label
      }, format_0.id))
    }, "export");
    $[63] = exportFormats;
    $[64] = onExport;
    $[65] = runExport;
    $[66] = t23;
  } else {
    t23 = $[66];
  }
  let t24;
  if ($[67] !== exportFormats || $[68] !== exportTooltip || $[69] !== onExport || $[70] !== runExport) {
    t24 = onExport && exportFormats.length === 1 && /*#__PURE__*/_jsxs(MenuItem, {
      onClick: () => runExport(exportFormats[0].id),
      children: [/*#__PURE__*/_jsx(ListItemIcon, {
        children: /*#__PURE__*/_jsx(ExportIcon, {})
      }), /*#__PURE__*/_jsx(ListItemText, {
        primary: "Export",
        secondary: exportTooltip
      })]
    }, "export");
    $[67] = exportFormats;
    $[68] = exportTooltip;
    $[69] = onExport;
    $[70] = runExport;
    $[71] = t24;
  } else {
    t24 = $[71];
  }
  let t25;
  if ($[72] !== listed || $[73] !== settings) {
    t25 = settings && !listed && /*#__PURE__*/_jsxs(MenuItem, {
      onClick: () => setSettingsOpen(true),
      children: [/*#__PURE__*/_jsx(ListItemIcon, {
        children: /*#__PURE__*/_jsx(SettingIcon, {})
      }), /*#__PURE__*/_jsx(ListItemText, {
        primary: "Settings"
      })]
    }, "settings");
    $[72] = listed;
    $[73] = settings;
    $[74] = t25;
  } else {
    t25 = $[74];
  }
  let t26;
  if ($[75] !== filterColumns || $[76] !== listed || $[77] !== presets || $[78] !== settings) {
    t26 = settings && listed && presets && filterColumns && /*#__PURE__*/_jsxs(MenuItem, {
      onClick: () => setManageOpen(true),
      children: [/*#__PURE__*/_jsx(ListItemIcon, {
        children: /*#__PURE__*/_jsx(SettingIcon, {})
      }), /*#__PURE__*/_jsx(ListItemText, {
        primary: "Manage views"
      })]
    }, "views");
    $[75] = filterColumns;
    $[76] = listed;
    $[77] = presets;
    $[78] = settings;
    $[79] = t26;
  } else {
    t26 = $[79];
  }
  let t27;
  if ($[80] !== t22 || $[81] !== t23 || $[82] !== t24 || $[83] !== t25 || $[84] !== t26) {
    t27 = [t22, t23, t24, t25, t26];
    $[80] = t22;
    $[81] = t23;
    $[82] = t24;
    $[83] = t25;
    $[84] = t26;
    $[85] = t27;
  } else {
    t27 = $[85];
  }
  const moreItems = t27;
  let t28;
  if ($[86] !== actionItems || $[87] !== api || $[88] !== compact || $[89] !== groupAnchor || $[90] !== groupable || $[91] !== hasActions || $[92] !== moreItems || $[93] !== presets || $[94] !== search || $[95] !== selecting || $[96] !== toolbarEnd || $[97] !== views) {
    t28 = compact ? /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsxs(Stack, {
        ref: setToolbar,
        direction: "row",
        spacing: "sm",
        sx: {
          alignItems: "center"
        },
        children: [/*#__PURE__*/_jsx(Box, {
          sx: {
            flex: 1,
            minWidth: 0
          },
          children: search
        }), groupable && /*#__PURE__*/_jsx(Badge, {
          badgeContent: api.groupBy.length,
          color: "primary",
          children: /*#__PURE__*/_jsx(IconButton, {
            variant: "outlined",
            "aria-label": "Group",
            "aria-haspopup": "dialog",
            "aria-expanded": Boolean(groupAnchor),
            onClick: event => setGroupAnchor(event.currentTarget),
            children: /*#__PURE__*/_jsx(GroupIcon, {})
          })
        }), !selecting && moreItems.some(Boolean) && /*#__PURE__*/_jsx(Menu, {
          "aria-label": "More",
          variant: "outlined",
          placement: "bottom-end",
          children: moreItems
        })]
      }), selecting ? /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        spacing: "sm",
        sx: _temp2,
        children: [/*#__PURE__*/_jsx(IconButton, {
          "aria-label": "Clear selection",
          onClick: () => {
            api.clearSelection();
            setSelectModeOn(false);
          },
          children: /*#__PURE__*/_jsx(CloseIcon, {})
        }), /*#__PURE__*/_jsxs(Typography, {
          sx: {
            flex: 1,
            fontWeight: 600,
            color: "text.primary",
            fontVariantNumeric: "tabular-nums"
          },
          children: [api.selectedCount, " selected"]
        }), /*#__PURE__*/_jsx(Button, {
          variant: "text",
          onClick: () => api.toggleSelectAll(),
          children: api.allSelected ? "Deselect all" : "Select all"
        }), hasActions && /*#__PURE__*/_jsx(Menu, {
          "aria-label": "Actions",
          placement: "bottom-end",
          children: actionItems
        })]
      }) : views && /*#__PURE__*/_jsx(Box, {
        sx: {
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none"
          }
        },
        children: /*#__PURE__*/_jsx(Box, {
          sx: {
            display: "inline-flex"
          },
          children: views
        })
      })]
    }) : /*#__PURE__*/_jsxs(_Fragment, {
      children: [(presets || toolbarEnd) && /*#__PURE__*/_jsxs(Stack, {
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
          children: views
        }), /*#__PURE__*/_jsx(Stack, {
          direction: "row",
          spacing: "sm",
          sx: {
            alignItems: "center",
            flexShrink: 0
          },
          children: toolbarEnd
        })]
      }), /*#__PURE__*/_jsx(Stack, {
        ref: setToolbar,
        sx: _temp3,
        children: /*#__PURE__*/_jsxs(Stack, {
          direction: "row",
          spacing: "sm",
          sx: {
            alignItems: "center",
            flexWrap: "wrap",
            minWidth: 0
          },
          children: [search, groupable && /*#__PURE__*/_jsx(DataTableGroupMenu, {}), hasActions && api.selectedCount > 0 && /*#__PURE__*/_jsx(Menu, {
            label: `Actions (${api.selectedCount})`,
            startIcon: /*#__PURE__*/_jsx(ActionsIcon, {}),
            children: actionItems
          }), moreItems.some(Boolean) && /*#__PURE__*/_jsx(Menu, {
            "aria-label": "More",
            variant: "outlined",
            placement: "bottom-start",
            children: moreItems
          })]
        })
      })]
    });
    $[86] = actionItems;
    $[87] = api;
    $[88] = compact;
    $[89] = groupAnchor;
    $[90] = groupable;
    $[91] = hasActions;
    $[92] = moreItems;
    $[93] = presets;
    $[94] = search;
    $[95] = selecting;
    $[96] = toolbarEnd;
    $[97] = views;
    $[98] = t28;
  } else {
    t28 = $[98];
  }
  let t29;
  if ($[99] !== groupAnchor || $[100] !== groupable) {
    t29 = groupable && /*#__PURE__*/_jsx(DataTableGroupPanel, {
      anchor: groupAnchor,
      onClose: () => setGroupAnchor(null)
    });
    $[99] = groupAnchor;
    $[100] = groupable;
    $[101] = t29;
  } else {
    t29 = $[101];
  }
  let t30;
  if ($[102] !== api.selectedCount || $[103] !== executeAction || $[104] !== pendingAction) {
    t30 = pendingAction && /*#__PURE__*/_jsx(ConfirmDialog, {
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
    $[102] = api.selectedCount;
    $[103] = executeAction;
    $[104] = pendingAction;
    $[105] = t30;
  } else {
    t30 = $[105];
  }
  let t31;
  if ($[106] !== filterColumns || $[107] !== manageOpen || $[108] !== presets) {
    t31 = presets && filterColumns && /*#__PURE__*/_jsx(ManageViewsDialog, {
      open: manageOpen,
      onClose: () => setManageOpen(false),
      presets: presets,
      filterColumns: filterColumns
    });
    $[106] = filterColumns;
    $[107] = manageOpen;
    $[108] = presets;
    $[109] = t31;
  } else {
    t31 = $[109];
  }
  let t32;
  if ($[110] !== filterColumns || $[111] !== presets || $[112] !== settings || $[113] !== settingsOpen) {
    t32 = settings && /*#__PURE__*/_jsx(DataTableSettingsDialog, {
      open: settingsOpen,
      onClose: () => setSettingsOpen(false),
      onManageViews: presets && filterColumns ? () => {
        setSettingsOpen(false);
        setManageOpen(true);
      } : undefined
    });
    $[110] = filterColumns;
    $[111] = presets;
    $[112] = settings;
    $[113] = settingsOpen;
    $[114] = t32;
  } else {
    t32 = $[114];
  }
  let t33;
  if ($[115] !== compact) {
    t33 = compact && {
      overflow: "clip",
      flex: "none"
    };
    $[115] = compact;
    $[116] = t33;
  } else {
    t33 = $[116];
  }
  let t34;
  if ($[117] !== compact || $[118] !== renderListItem) {
    t34 = compact && renderListItem && {
      overflow: "visible",
      border: "none",
      borderRadius: 0,
      bgcolor: "transparent",
      boxShadow: "none"
    };
    $[117] = compact;
    $[118] = renderListItem;
    $[119] = t34;
  } else {
    t34 = $[119];
  }
  let t35;
  if ($[120] !== t33 || $[121] !== t34) {
    t35 = {
      p: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      flex: "1 1 auto",
      minHeight: 0,
      position: "relative",
      ...t33,
      ...t34
    };
    $[120] = t33;
    $[121] = t34;
    $[122] = t35;
  } else {
    t35 = $[122];
  }
  let t36;
  if ($[123] !== compact || $[124] !== emptyMessage || $[125] !== errorMessage || $[126] !== infiniteScroll || $[127] !== listVariant || $[128] !== noResultsMessage || $[129] !== onRowClick || $[130] !== onRowIntent || $[131] !== renderListItem || $[132] !== restoreScroll || $[133] !== rowClass || $[134] !== stickyHeader || $[135] !== variant || $[136] !== withSelection) {
    t36 = /*#__PURE__*/_jsx(DataTableBody, {
      selectable: withSelection,
      emptyMessage: emptyMessage,
      noResultsMessage: noResultsMessage,
      errorMessage: errorMessage,
      stickyHeader: stickyHeader,
      onRowClick: onRowClick,
      onRowIntent: onRowIntent,
      rowClass: rowClass,
      infiniteScroll: infiniteScroll,
      restoreScroll: restoreScroll,
      renderListItem: renderListItem,
      listVariant: listVariant,
      variant: variant,
      pageScroll: compact
    });
    $[123] = compact;
    $[124] = emptyMessage;
    $[125] = errorMessage;
    $[126] = infiniteScroll;
    $[127] = listVariant;
    $[128] = noResultsMessage;
    $[129] = onRowClick;
    $[130] = onRowIntent;
    $[131] = renderListItem;
    $[132] = restoreScroll;
    $[133] = rowClass;
    $[134] = stickyHeader;
    $[135] = variant;
    $[136] = withSelection;
    $[137] = t36;
  } else {
    t36 = $[137];
  }
  let t37;
  if ($[138] !== t35 || $[139] !== t36) {
    t37 = /*#__PURE__*/_jsx(Card, {
      sx: t35,
      children: t36
    });
    $[138] = t35;
    $[139] = t36;
    $[140] = t37;
  } else {
    t37 = $[140];
  }
  let t38;
  if ($[141] !== api.groupBy.length || $[142] !== api.groupsTotal || $[143] !== api.total || $[144] !== compact || $[145] !== drilledIn || $[146] !== groupsPerPageOptions || $[147] !== infiniteScroll || $[148] !== rowsPerPageOptions) {
    t38 = (!infiniteScroll || api.groupBy.length > 0) && !drilledIn && /*#__PURE__*/_jsxs(Box, {
      "data-table-footer": "",
      sx: _temp4,
      children: [!infiniteScroll && /*#__PURE__*/_jsx(DataTablePagination, {
        rowsPerPageOptions: compact ? [] : rowsPerPageOptions,
        groupsPerPageOptions: compact ? [] : groupsPerPageOptions
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
    $[141] = api.groupBy.length;
    $[142] = api.groupsTotal;
    $[143] = api.total;
    $[144] = compact;
    $[145] = drilledIn;
    $[146] = groupsPerPageOptions;
    $[147] = infiniteScroll;
    $[148] = rowsPerPageOptions;
    $[149] = t38;
  } else {
    t38 = $[149];
  }
  let t39;
  if ($[150] !== api || $[151] !== drill || $[152] !== selectMode || $[153] !== t28 || $[154] !== t29 || $[155] !== t30 || $[156] !== t31 || $[157] !== t32 || $[158] !== t37 || $[159] !== t38) {
    t39 = /*#__PURE__*/_jsxs(DataTableRoot, {
      api: api,
      selectMode: selectMode,
      drill: drill,
      children: [t28, t29, t30, t31, t32, t37, t38]
    });
    $[150] = api;
    $[151] = drill;
    $[152] = selectMode;
    $[153] = t28;
    $[154] = t29;
    $[155] = t30;
    $[156] = t31;
    $[157] = t32;
    $[158] = t37;
    $[159] = t38;
    $[160] = t39;
  } else {
    t39 = $[160];
  }
  return t39;
}
function _temp4(theme_1) {
  return {
    minHeight: theme_1.vars.size.row,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  };
}
function _temp3(theme_0) {
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
    minHeight: theme_0.vars.size.row
  };
}
function _temp2(theme) {
  return {
    alignItems: "center",
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