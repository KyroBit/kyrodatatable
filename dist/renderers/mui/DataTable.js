import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Box, Button, Card, IconButton, Menu, MenuItem, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography, } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { DataTableRoot } from './context.js';
import { DataTableSearchField } from './SearchField.js';
import { DataTableBody } from './Body.js';
import { DataTablePagination } from './Pagination.js';
import { DataTableFilterMenu, ManageViewsDialog, chipFiltersEqual, countChipFilters } from './FilterMenu.js';
import { ActionsIcon, ExportIcon, GroupIcon, ImportIcon, SettingIcon } from './icons.js';
/**
 * The full list-page assembly: views pills + manage, create, search with the
 * filter popover, group-by, export/import, contextual bulk actions, the table
 * card, and top-right pagination. Every section is opt-in through props; for
 * a custom layout compose the exported pieces yourself.
 */
export function DataTable({ api, presets, filterColumns, emptyFilters = {}, searchPlaceholder, searchWidth, createLabel = 'Create', onCreate, onExport, exportFormats = [{ id: 'csv', label: 'CSV' }], onImport, exportTooltip = 'Export current results', importTooltip = 'Import from CSV', actions, selectable, onRowClick, rowClass, emptyMessage, stickyHeader, rowsPerPageOptions, }) {
    const [filterAnchor, setFilterAnchor] = useState(null);
    const [filterDraft, setFilterDraft] = useState(emptyFilters);
    const [selectedPresetId, setSelectedPresetId] = useState(null);
    const [groupAnchor, setGroupAnchor] = useState(null);
    const [actionsAnchor, setActionsAnchor] = useState(null);
    const [exportAnchor, setExportAnchor] = useState(null);
    const [manageOpen, setManageOpen] = useState(false);
    const filters = api.filters ?? emptyFilters;
    const filterCount = countChipFilters(filters);
    const withSelection = Boolean(selectable || (actions && actions.length > 0));
    const activePresetId = useMemo(() => {
        if (selectedPresetId && presets) {
            const selected = presets.all.find((p) => p.id === selectedPresetId);
            if (selected && chipFiltersEqual(selected.filters, filters))
                return selected.id;
        }
        if (chipFiltersEqual(filters, emptyFilters))
            return 'all';
        return presets?.all.find((p) => chipFiltersEqual(p.filters, filters))?.id ?? null;
    }, [presets, selectedPresetId, filters, emptyFilters]);
    const applyFilters = (next, presetId) => {
        setSelectedPresetId(presetId ?? null);
        api.setFilters(next);
    };
    const activeGroupLabel = api.groupByColumns?.find((g) => g.field === api.groupBy)?.label;
    const runAction = async (action) => {
        setActionsAnchor(null);
        const count = api.selectedIds.length;
        if (action.confirmationMessage && !confirm(action.confirmationMessage(count)))
            return;
        await action.handle(api.selectedIds);
        api.clearSelection();
        if (api.groupBy)
            api.setGroupBy(api.groupBy);
        api.refetch();
    };
    const runExport = (format) => {
        setExportAnchor(null);
        void onExport?.({
            format,
            search: api.search,
            sort: api.sort,
            filters: api.filters,
            groupBy: api.groupBy,
            selectedIds: api.selectedIds,
        });
    };
    return (_jsxs(DataTableRoot, { api: api, children: [(presets || onCreate) && (_jsxs(Stack, { direction: "row", sx: { alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }, children: [_jsx(Stack, { direction: "row", spacing: 1, sx: { alignItems: 'center', minWidth: 0 }, children: presets && (_jsxs(_Fragment, { children: [_jsxs(ToggleButtonGroup, { exclusive: true, value: activePresetId, onChange: (_, nextId) => {
                                        if (!nextId)
                                            return;
                                        if (nextId === 'all') {
                                            applyFilters(emptyFilters);
                                            return;
                                        }
                                        const p = presets.all.find((preset) => preset.id === nextId);
                                        if (p)
                                            applyFilters(p.filters, p.id);
                                    }, children: [_jsx(ToggleButton, { value: "all", "data-label": "All", children: "All" }), presets.all.map((p) => (_jsx(ToggleButton, { value: p.id, "data-label": p.name, children: p.name }, p.id)))] }), _jsx(Tooltip, { title: "Manage views", children: _jsx(IconButton, { onClick: () => setManageOpen(true), "aria-label": "Manage views", sx: {
                                            width: 45,
                                            height: 45,
                                            borderRadius: '8px',
                                            bgcolor: '#F6F7FB',
                                            border: '1px solid #E8E8E8',
                                            color: '#292D32',
                                            '&:hover': { bgcolor: '#EDEFF5' },
                                        }, children: _jsx(SettingIcon, { sx: { fontSize: 18 } }) }) })] })) }), onCreate && (_jsx(Button, { variant: "contained", startIcon: _jsx(AddIcon, {}), onClick: onCreate, children: createLabel }))] })), _jsxs(Stack, { direction: "row", sx: { alignItems: 'center', justifyContent: 'space-between', gap: 1, minHeight: 40 }, children: [_jsxs(Stack, { direction: "row", spacing: 1, sx: { alignItems: 'center', flexShrink: 0 }, children: [_jsx(DataTableSearchField, { placeholder: searchPlaceholder, width: searchWidth, filterCount: filterColumns ? filterCount : 0, onOpenFilters: filterColumns ? (anchor) => { setFilterDraft(filters); setFilterAnchor(anchor); } : undefined }), api.groupByColumns && api.groupByColumns.length > 0 && (_jsx(ToolbarBtn, { icon: _jsx(GroupIcon, {}), label: activeGroupLabel ? `Group: ${activeGroupLabel}` : 'Group', onClick: (e) => setGroupAnchor(e.currentTarget) })), onExport && (_jsx(Tooltip, { title: exportTooltip, children: _jsx("span", { children: _jsx(ToolbarBtn, { icon: _jsx(ExportIcon, {}), label: "Export", menu: exportFormats.length > 1, onClick: (e) => {
                                            if (exportFormats.length > 1)
                                                setExportAnchor(e.currentTarget);
                                            else
                                                runExport(exportFormats[0]?.id ?? 'csv');
                                        } }) }) })), onImport && (_jsx(Tooltip, { title: importTooltip, children: _jsx("span", { children: _jsx(ToolbarBtn, { icon: _jsx(ImportIcon, {}), label: "Import", menu: false, onClick: onImport }) }) })), actions && actions.length > 0 && api.selectedIds.length > 0 && (_jsx(ToolbarBtn, { icon: _jsx(ActionsIcon, {}), label: `Actions (${api.selectedIds.length})`, onClick: (e) => setActionsAnchor(e.currentTarget) }))] }), _jsxs(Box, { sx: { minHeight: 40, display: 'flex', alignItems: 'center', flexShrink: 0 }, children: [_jsx(DataTablePagination, { rowsPerPageOptions: rowsPerPageOptions }), api.groupBy && (_jsxs(Typography, { sx: { fontSize: '13px', fontWeight: 500, color: '#595959', fontVariantNumeric: 'tabular-nums' }, children: [api.groups.length, " groups \u00B7 ", api.groupsTotal, " records"] }))] })] }), actions && actions.length > 0 && (_jsx(Menu, { anchorEl: actionsAnchor, open: Boolean(actionsAnchor), onClose: () => setActionsAnchor(null), children: actions.map((action) => (_jsx(MenuItem, { onClick: () => { void runAction(action); }, children: action.label }, action.label))) })), onExport && exportFormats.length > 1 && (_jsx(Menu, { anchorEl: exportAnchor, open: Boolean(exportAnchor), onClose: () => setExportAnchor(null), children: exportFormats.map((format) => (_jsx(MenuItem, { onClick: () => runExport(format.id), children: format.label }, format.id))) })), _jsx(Menu, { anchorEl: groupAnchor, open: Boolean(groupAnchor), onClose: () => setGroupAnchor(null), children: [{ field: null, label: 'None' }, ...(api.groupByColumns ?? [])].map((g) => (_jsx(MenuItem, { selected: api.groupBy === g.field, onClick: () => { api.setGroupBy(g.field); setGroupAnchor(null); }, children: g.label }, g.label))) }), filterColumns && (_jsx(DataTableFilterMenu, { anchorEl: filterAnchor, onClose: () => setFilterAnchor(null), filterColumns: filterColumns, draft: filterDraft, onDraftChange: setFilterDraft, onApply: applyFilters, emptyFilters: emptyFilters, presets: presets })), presets && filterColumns && (_jsx(ManageViewsDialog, { open: manageOpen, onClose: () => setManageOpen(false), presets: presets, filterColumns: filterColumns, onApply: (next, presetId) => { applyFilters(next, presetId); setManageOpen(false); } })), _jsx(Card, { sx: { p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }, children: _jsx(DataTableBody, { selectable: withSelection, emptyMessage: emptyMessage, stickyHeader: stickyHeader, onRowClick: onRowClick, rowClass: rowClass }) })] }));
}
function ToolbarBtn({ icon, label, onClick, menu = true }) {
    return (_jsx(Button, { variant: "outlined", color: "inherit", startIcon: icon, endIcon: menu ? _jsx(ExpandMoreRoundedIcon, {}) : undefined, onClick: onClick, children: label }));
}
DataTable.Root = DataTableRoot;
DataTable.SearchField = DataTableSearchField;
DataTable.Body = DataTableBody;
DataTable.Pagination = DataTablePagination;
