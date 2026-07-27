import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, Button, Dialog, Divider, IconButton, Menu, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { countFilterValues, filterValuesEqual, summarizeFilterValues } from '@kyrobit/datatable';
import { TrashIcon } from './icons.js';
import { ConfirmDialog } from './ConfirmDialog.js';
function useDebouncedValue(value, delayMs) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(id);
    }, [value, delayMs]);
    return debounced;
}
function FilterChip({ label, active, onClick }) {
    return (_jsx(Box, { component: "button", type: "button", onClick: onClick, sx: (theme) => ({
            border: 'none',
            cursor: 'pointer',
            px: '14px',
            py: '8px',
            borderRadius: '8px',
            fontFamily: 'inherit',
            fontSize: '13px',
            fontWeight: 500,
            bgcolor: active ? theme.palette.text.primary : alpha(theme.palette.text.primary, 0.04),
            color: active ? theme.palette.background.paper : theme.palette.text.secondary,
            transition: 'background-color 0.15s, color 0.15s',
            '&:hover': { bgcolor: active ? alpha(theme.palette.text.primary, 0.85) : alpha(theme.palette.text.primary, 0.08) },
        }), children: label }));
}
function SelectFilterField({ column, value: raw, onChange }) {
    const value = Array.isArray(raw) ? raw : [];
    const isAsync = typeof column.options === 'function';
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebouncedValue(query, 250);
    const [asyncOptions, setAsyncOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [labelCache, setLabelCache] = useState({});
    useEffect(() => {
        if (!isAsync)
            return;
        let cancelled = false;
        const load = column.options;
        setLoading(true);
        load(debouncedQuery)
            .then((results) => {
            if (cancelled)
                return;
            setAsyncOptions(results);
            setLabelCache((prev) => {
                const next = { ...prev };
                for (const option of results)
                    next[option.value] = option.label;
                return next;
            });
        })
            .finally(() => { if (!cancelled)
            setLoading(false); });
        return () => { cancelled = true; };
    }, [isAsync, debouncedQuery, column.options]);
    const options = isAsync ? asyncOptions : column.options;
    const selectedElsewhere = isAsync
        ? value.filter((v) => !options.some((o) => o.value === v)).map((v) => ({ label: labelCache[v] ?? v, value: v }))
        : [];
    const visibleOptions = [...selectedElsewhere, ...options];
    return (_jsxs(Box, { children: [isAsync && (_jsx(TextField, { size: "small", fullWidth: true, placeholder: `Search ${column.label.toLowerCase()}…`, value: query, onChange: (e) => setQuery(e.target.value), sx: { mb: 1 } })), _jsxs(Stack, { direction: "row", sx: { flexWrap: 'wrap', gap: 1, alignItems: 'center' }, children: [visibleOptions.map((option) => (_jsx(FilterChip, { label: option.label, active: value.includes(option.value), onClick: () => onChange(value.includes(option.value) ? value.filter((v) => v !== option.value) : [...value, option.value]) }, option.value))), isAsync && loading && (_jsx(Typography, { sx: { fontSize: '12px', color: 'text.secondary' }, children: "Searching\u2026" })), isAsync && !loading && visibleOptions.length === 0 && (_jsx(Typography, { sx: { fontSize: '12px', color: 'text.secondary' }, children: "No matches" }))] })] }));
}
function TextFilterField({ column, value: raw, onChange }) {
    const value = typeof raw === 'string' ? raw : '';
    return (_jsx(TextField, { size: "small", fullWidth: true, type: column.inputType === 'number' ? 'number' : 'text', placeholder: column.placeholder ?? `Enter ${column.label.toLowerCase()}`, value: value, onChange: (e) => onChange(e.target.value) }));
}
function toIsoDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}
function fromIsoDate(iso) {
    if (!iso)
        return null;
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d)
        return null;
    const date = new Date(y, m - 1, d);
    return Number.isNaN(date.getTime()) ? null : date;
}
/** A single date field: a themed trigger button opening a hand-rolled calendar popover — not `<input type="date">`, whose picker UI is native browser chrome no CSS can restyle. */
function SingleDatePicker({ ariaLabel, value, onChange }) {
    const [anchor, setAnchor] = useState(null);
    const selected = fromIsoDate(value);
    const [viewDate, setViewDate] = useState(selected ?? new Date());
    const open = (e) => {
        setViewDate(selected ?? new Date());
        setAnchor(e.currentTarget);
    };
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const cells = [
        ...Array.from({ length: firstWeekday }, () => null),
        ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
    ];
    return (_jsxs(_Fragment, { children: [_jsxs(Box, { component: "button", type: "button", onClick: open, "aria-label": ariaLabel, sx: (theme) => ({
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    textAlign: 'left',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '8px',
                    bgcolor: 'background.paper',
                    px: '12px',
                    py: '8.5px',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
                    cursor: 'pointer',
                    '&:hover': { borderColor: alpha(theme.palette.text.primary, 0.24) },
                }), children: [selected ? selected.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select date', _jsx(CalendarTodayRoundedIcon, { sx: { fontSize: 14, color: 'text.secondary' } })] }), _jsx(Menu, { anchorEl: anchor, open: Boolean(anchor), onClose: () => setAnchor(null), anchorOrigin: { vertical: 'bottom', horizontal: 'left' }, transformOrigin: { vertical: 'top', horizontal: 'left' }, slotProps: { paper: { sx: { borderRadius: '12px', mt: 0.5 } } }, children: _jsxs(Box, { sx: { p: 1.5, width: 260 }, children: [_jsxs(Stack, { direction: "row", sx: { alignItems: 'center', justifyContent: 'space-between', mb: 1 }, children: [_jsx(IconButton, { size: "small", onClick: () => setViewDate(new Date(year, month - 1, 1)), "aria-label": "Previous month", children: _jsx(ChevronLeftRoundedIcon, { sx: { fontSize: 18 } }) }), _jsx(Typography, { sx: { fontSize: '13px', fontWeight: 600, color: 'text.primary' }, children: viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }), _jsx(IconButton, { size: "small", onClick: () => setViewDate(new Date(year, month + 1, 1)), "aria-label": "Next month", children: _jsx(ChevronRightRoundedIcon, { sx: { fontSize: 18 } }) })] }), _jsx(Box, { sx: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', mb: 0.5 }, children: ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (_jsx(Typography, { sx: { fontSize: '10px', fontWeight: 600, color: 'text.secondary', textAlign: 'center' }, children: d }, i))) }), _jsx(Box, { sx: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }, children: cells.map((date, i) => {
                                if (!date)
                                    return _jsx(Box, {}, i);
                                const isSelected = selected !== null && date.toDateString() === selected.toDateString();
                                const isToday = date.toDateString() === today.toDateString();
                                return (_jsx(Box, { component: "button", type: "button", onClick: () => { onChange(toIsoDate(date)); setAnchor(null); }, sx: (theme) => ({
                                        border: isToday && !isSelected ? '1px solid' : 'none',
                                        borderColor: 'divider',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        fontSize: '12px',
                                        fontWeight: isSelected ? 600 : 500,
                                        height: 30,
                                        bgcolor: isSelected ? theme.palette.primary.main : 'transparent',
                                        color: isSelected ? theme.palette.primary.contrastText : theme.palette.text.primary,
                                        '&:hover': { bgcolor: isSelected ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.06) },
                                    }), children: date.getDate() }, i));
                            }) }), selected && (_jsx(Stack, { direction: "row", sx: { justifyContent: 'flex-end', mt: 1 }, children: _jsx(Box, { component: "button", type: "button", onClick: () => { onChange(undefined); setAnchor(null); }, sx: { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 600, color: 'error.main', p: 0 }, children: "Clear" }) }))] }) })] }));
}
function DateFilterField({ column, value: raw, onChange }) {
    const value = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
    if (!column.range) {
        return (_jsx(SingleDatePicker, { ariaLabel: column.label, value: value.from, onChange: (next) => onChange({ from: next }) }));
    }
    return (_jsxs(Stack, { direction: "row", spacing: 1, children: [_jsxs(Box, { sx: { flex: 1 }, children: [_jsx(Typography, { sx: { fontSize: '11px', fontWeight: 600, color: 'text.secondary', mb: 0.5 }, children: "From" }), _jsx(SingleDatePicker, { ariaLabel: `${column.label} from`, value: value.from, onChange: (next) => onChange({ ...value, from: next }) })] }), _jsxs(Box, { sx: { flex: 1 }, children: [_jsx(Typography, { sx: { fontSize: '11px', fontWeight: 600, color: 'text.secondary', mb: 0.5 }, children: "To" }), _jsx(SingleDatePicker, { ariaLabel: `${column.label} to`, value: value.to, onChange: (next) => onChange({ ...value, to: next }) })] })] }));
}
/**
 * Strategy dispatcher: picks the field renderer by `column.type` and hands it
 * the raw slice of `FilterValues` — each renderer narrows its own value and
 * owns its own markup and state (e.g. the async search box). Add a new filter
 * type by adding a variant to `FilterColumnDef` and a case here; nothing else
 * in the popover or the manage-views dialog needs to change.
 */
function FilterField({ column, value, onChange }) {
    switch (column.type) {
        case 'select': return _jsx(SelectFilterField, { column: column, value: value, onChange: onChange });
        case 'text': return _jsx(TextFilterField, { column: column, value: value, onChange: onChange });
        case 'date': return _jsx(DateFilterField, { column: column, value: value, onChange: onChange });
    }
}
function HeaderIconButton({ onClick, label, children }) {
    return (_jsx(IconButton, { onClick: onClick, "aria-label": label, sx: (theme) => ({
            width: 26,
            height: 26,
            bgcolor: alpha(theme.palette.text.primary, 0.04),
            color: theme.palette.text.primary,
            '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.08) },
        }), children: children }));
}
export function DataTableFilterMenu({ anchorEl, onClose, filterColumns, draft, onDraftChange, onApply, presets, }) {
    const [mode, setMode] = useState('filter');
    const [name, setName] = useState('');
    const draftEmpty = countFilterValues(draft) === 0;
    const close = () => {
        setMode('filter');
        setName('');
        onClose();
    };
    const saveFilter = () => {
        const trimmed = name.trim();
        if (!trimmed || !presets)
            return;
        const id = presets.create(trimmed, draft);
        onApply(draft, id);
        close();
    };
    return (_jsx(Menu, { anchorEl: anchorEl, open: Boolean(anchorEl), onClose: close, anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, transformOrigin: { vertical: 'top', horizontal: 'right' }, slotProps: { paper: { sx: { width: 340, mt: 1, borderRadius: '14px' } } }, children: _jsxs(Box, { sx: { px: 2, pt: 1.25, pb: 2 }, children: [_jsxs(Stack, { direction: "row", sx: { alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }, children: [_jsxs(Stack, { direction: "row", spacing: 1, sx: { alignItems: 'center' }, children: [mode === 'save' && (_jsx(IconButton, { onClick: () => setMode('filter'), "aria-label": "Back", sx: { width: 26, height: 26, ml: -0.5, color: 'text.primary' }, children: _jsx(ArrowBackRoundedIcon, { sx: { fontSize: 16 } }) })), _jsx(Typography, { sx: { fontSize: '16px', fontWeight: 600, color: 'text.primary' }, children: mode === 'save' ? 'Save as view' : 'Filter' })] }), _jsx(HeaderIconButton, { onClick: close, label: "Close filters", children: _jsx(CloseRoundedIcon, { sx: { fontSize: 15 } }) })] }), _jsx(Divider, {}), mode === 'filter' && (_jsxs(_Fragment, { children: [filterColumns.map((column) => (_jsxs(Box, { children: [_jsx(Typography, { sx: { fontSize: '13.5px', fontWeight: 600, color: 'text.primary', mt: 1.75, mb: 1 }, children: column.label }), _jsx(FilterField, { column: column, value: draft[column.field], onChange: (next) => onDraftChange({ ...draft, [column.field]: next }) })] }, column.field))), _jsx(Divider, { sx: { mt: 2 } }), _jsxs(Stack, { direction: "row", sx: { alignItems: 'center', justifyContent: 'space-between', mt: 1.75 }, children: [_jsx(Box, { component: "button", type: "button", onClick: () => { onApply({}); close(); }, sx: {
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        p: 0,
                                        fontFamily: 'inherit',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: 'error.main',
                                        textDecoration: 'underline',
                                        '&:hover': { color: 'error.dark' },
                                    }, children: "Clear all" }), _jsxs(Stack, { direction: "row", spacing: 1, children: [presets && (_jsx(Button, { variant: "outlined", color: "inherit", disabled: draftEmpty, onClick: () => setMode('save'), sx: { height: 36, minHeight: 36, px: '16px', fontSize: '13px', borderRadius: '8px' }, children: "Save" })), _jsx(Button, { variant: "contained", onClick: () => { onApply(draft); close(); }, sx: { height: 36, minHeight: 36, px: '20px', fontSize: '13px' }, children: "Apply" })] })] })] })), mode === 'save' && (_jsxs(_Fragment, { children: [_jsx(TextField, { autoFocus: true, fullWidth: true, placeholder: "View name", value: name, onChange: (e) => setName(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') {
                                e.preventDefault();
                                saveFilter();
                            } }, sx: { mt: 2 } }), _jsx(Typography, { sx: { fontSize: '12px', color: 'text.secondary', mt: 1 }, children: summarizeFilterValues(draft, filterColumns) }), _jsx(Stack, { direction: "row", sx: { justifyContent: 'flex-end', mt: 2 }, children: _jsx(Button, { variant: "contained", disabled: !name.trim(), onClick: saveFilter, sx: { height: 36, minHeight: 36, px: '20px', fontSize: '13px' }, children: "Save & apply" }) })] }))] }) }));
}
export function ManageViewsDialog({ open, onClose, presets, filterColumns }) {
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editFilters, setEditFilters] = useState({});
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const editing = editingId ? presets.all.find((p) => p.id === editingId) : null;
    const close = () => {
        setEditingId(null);
        onClose();
    };
    const startEdit = (id) => {
        const preset = presets.all.find((p) => p.id === id);
        if (!preset)
            return;
        setEditName(preset.name);
        setEditFilters(preset.filters);
        setEditingId(id);
    };
    const commitEdit = () => {
        const trimmed = editName.trim();
        if (!editingId || !trimmed)
            return;
        presets.update(editingId, trimmed, editFilters);
        setEditingId(null);
    };
    const isEditDirty = Boolean(editing && (editName.trim() !== editing.name || !filterValuesEqual(editFilters, editing.filters)));
    const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
    const discardEdit = () => {
        if (isEditDirty) {
            setConfirmDiscardOpen(true);
            return;
        }
        setEditingId(null);
    };
    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id)
            return;
        const from = presets.all.findIndex((p) => p.id === active.id);
        const to = presets.all.findIndex((p) => p.id === over.id);
        if (from !== -1 && to !== -1)
            presets.reorder(from, to);
    };
    return (_jsxs(Dialog, { open: open, onClose: close, slotProps: { paper: { sx: { width: 480, maxWidth: '92vw', borderRadius: '16px' } } }, children: [_jsxs(Box, { sx: { px: 3, pt: 2, pb: 2.5 }, children: [_jsxs(Stack, { direction: "row", sx: { alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }, children: [_jsx(Typography, { sx: { fontSize: '18px', fontWeight: 600, color: 'text.primary' }, children: editing ? 'Edit view' : 'Views' }), _jsx(IconButton, { onClick: close, "aria-label": "Close views", sx: (theme) => ({
                                    width: 28,
                                    height: 28,
                                    bgcolor: alpha(theme.palette.text.primary, 0.04),
                                    color: theme.palette.text.primary,
                                    '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.08) },
                                }), children: _jsx(CloseRoundedIcon, { sx: { fontSize: 16 } }) })] }), _jsx(Divider, {}), editing ? (_jsxs(_Fragment, { children: [_jsx(Typography, { sx: { fontSize: '13.5px', fontWeight: 600, color: 'text.primary', mt: 2, mb: 1 }, children: "Name" }), _jsx(TextField, { autoFocus: true, fullWidth: true, placeholder: "View name", value: editName, onChange: (e) => setEditName(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') {
                                    e.preventDefault();
                                    commitEdit();
                                } } }), filterColumns.map((column) => (_jsxs(Box, { children: [_jsx(Typography, { sx: { fontSize: '13.5px', fontWeight: 600, color: 'text.primary', mt: 2, mb: 1 }, children: column.label }), _jsx(FilterField, { column: column, value: editFilters[column.field], onChange: (next) => setEditFilters({ ...editFilters, [column.field]: next }) })] }, column.field))), _jsxs(Stack, { direction: "row", spacing: 1, sx: { justifyContent: 'flex-end', mt: 3 }, children: [_jsx(Button, { variant: "outlined", color: "inherit", onClick: discardEdit, sx: { height: 36, minHeight: 36, px: '16px', fontSize: '13px', borderRadius: '8px' }, children: "Discard" }), _jsx(Button, { variant: "contained", disabled: !editName.trim(), onClick: commitEdit, sx: { height: 36, minHeight: 36, px: '20px', fontSize: '13px' }, children: "Save" })] })] })) : (_jsxs(_Fragment, { children: [_jsx(Stack, { spacing: 0.25, sx: { mt: 1.5, maxHeight: 380, overflowY: 'auto' }, children: _jsx(DndContext, { sensors: sensors, collisionDetection: closestCenter, modifiers: [restrictToVerticalAxis, restrictToParentElement], onDragEnd: handleDragEnd, children: _jsx(SortableContext, { items: presets.all.map((p) => p.id), strategy: verticalListSortingStrategy, children: presets.all.map((p) => (_jsxs(SortableViewRow, { id: p.id, onClick: () => startEdit(p.id), children: [_jsxs(Box, { sx: { flex: 1, minWidth: 0 }, children: [_jsx(Typography, { noWrap: true, sx: { fontSize: '14px', fontWeight: 600, color: 'text.primary' }, children: p.name }), _jsx(Typography, { noWrap: true, sx: { fontSize: '12.5px', color: 'text.secondary' }, children: summarizeFilterValues(p.filters, filterColumns) })] }), _jsx(Stack, { direction: "row", spacing: 0.25, onClick: (e) => e.stopPropagation(), children: _jsx(Tooltip, { title: "Delete", children: _jsx(IconButton, { size: "small", "aria-label": `Delete ${p.name}`, onClick: () => presets.remove(p.id), sx: { color: 'error.main' }, children: _jsx(TrashIcon, { sx: { fontSize: 15 } }) }) }) })] }, p.id))) }) }) }), _jsx(Stack, { direction: "row", sx: { justifyContent: 'flex-end', mt: 2 }, children: _jsx(Button, { variant: "contained", onClick: close, sx: { height: 36, minHeight: 36, px: '24px', fontSize: '13px' }, children: "Done" }) })] }))] }), _jsx(ConfirmDialog, { open: confirmDiscardOpen, title: "Discard your changes?", description: "Your edits to this view haven't been saved.", confirmLabel: "Discard", cancelLabel: "Keep editing", confirmColor: "error", onCancel: () => setConfirmDiscardOpen(false), onConfirm: () => { setConfirmDiscardOpen(false); setEditingId(null); } })] }));
}
function SortableViewRow({ id, children, onClick }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    return (_jsxs(Stack, { ref: setNodeRef, direction: "row", onClick: onClick, sx: (theme) => ({
            alignItems: 'center',
            gap: 1,
            pl: 1,
            pr: 1,
            py: 1.25,
            borderRadius: '8px',
            cursor: 'pointer',
            transform: CSS.Transform.toString(transform),
            transition,
            position: 'relative',
            zIndex: isDragging ? 1 : undefined,
            bgcolor: isDragging ? alpha(theme.palette.text.primary, 0.04) : undefined,
            boxShadow: isDragging ? '0px 8px 24px rgba(0,0,0,0.12)' : undefined,
            '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.04) },
        }), children: [_jsx(Box, { ...attributes, ...listeners, onClick: (e) => e.stopPropagation(), "aria-label": "Drag to reorder", sx: {
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.disabled',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    touchAction: 'none',
                    '&:hover': { color: 'text.secondary' },
                }, children: _jsx(DragIndicatorIcon, { sx: { fontSize: 18 } }) }), children] }));
}
