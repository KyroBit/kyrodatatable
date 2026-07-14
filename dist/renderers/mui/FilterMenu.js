import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Button, Dialog, Divider, IconButton, Menu, Stack, TextField, Tooltip, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditIcon, TrashIcon } from './icons.js';
export function chipFiltersEqual(a, b) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
        const av = a[key] ?? [];
        const bv = b[key] ?? [];
        if (av.length !== bv.length || !av.every((v) => bv.includes(v)))
            return false;
    }
    return true;
}
export function summarizeChipFilters(filters, columns) {
    const parts = columns
        .filter((c) => (filters[c.field] ?? []).length > 0)
        .map((c) => {
        const labels = (filters[c.field] ?? []).map((v) => c.options.find((o) => o.value === v)?.label ?? v);
        return `${c.label}: ${labels.join(', ')}`;
    });
    return parts.length ? parts.join(' · ') : 'No filters';
}
export function countChipFilters(filters) {
    return Object.values(filters).reduce((n, values) => n + values.length, 0);
}
function StatusChips({ options, value, onChange }) {
    return (_jsx(Stack, { direction: "row", spacing: 1, sx: { flexWrap: 'wrap', rowGap: 1 }, children: options.map((option) => {
            const on = value.includes(option.value);
            return (_jsx(Box, { component: "button", type: "button", onClick: () => onChange(on ? value.filter((v) => v !== option.value) : [...value, option.value]), sx: {
                    border: 'none',
                    cursor: 'pointer',
                    px: '14px',
                    py: '8px',
                    borderRadius: '8px',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    fontWeight: 500,
                    bgcolor: on ? '#292D32' : '#F6F7FB',
                    color: on ? '#FFFFFF' : '#595959',
                    transition: 'background-color 0.15s, color 0.15s',
                    '&:hover': { bgcolor: on ? '#3A3F45' : '#EDEFF5' },
                }, children: option.label }, option.value));
        }) }));
}
function HeaderIconButton({ onClick, label, children }) {
    return (_jsx(IconButton, { onClick: onClick, "aria-label": label, sx: { width: 26, height: 26, bgcolor: '#F6F7FB', color: '#292D32', '&:hover': { bgcolor: '#EDEFF5' } }, children: children }));
}
export function DataTableFilterMenu({ anchorEl, onClose, filterColumns, draft, onDraftChange, onApply, emptyFilters, presets, }) {
    const [mode, setMode] = useState('filter');
    const [name, setName] = useState('');
    const draftEmpty = countChipFilters(draft) === 0;
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
    return (_jsx(Menu, { anchorEl: anchorEl, open: Boolean(anchorEl), onClose: close, anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, transformOrigin: { vertical: 'top', horizontal: 'right' }, slotProps: { paper: { sx: { width: 300, mt: 1, borderRadius: '14px' } } }, children: _jsxs(Box, { sx: { px: 2, pt: 1.25, pb: 2 }, children: [_jsxs(Stack, { direction: "row", sx: { alignItems: 'center', justifyContent: 'space-between', mb: 1.25 }, children: [_jsxs(Stack, { direction: "row", spacing: 1, sx: { alignItems: 'center' }, children: [mode === 'save' && (_jsx(IconButton, { onClick: () => setMode('filter'), "aria-label": "Back", sx: { width: 26, height: 26, ml: -0.5, color: '#292D32' }, children: _jsx(ArrowBackRoundedIcon, { sx: { fontSize: 16 } }) })), _jsx(Typography, { sx: { fontSize: '16px', fontWeight: 600, color: '#292D32' }, children: mode === 'save' ? 'Save as view' : 'Filter' })] }), _jsx(HeaderIconButton, { onClick: close, label: "Close filters", children: _jsx(CloseRoundedIcon, { sx: { fontSize: 15 } }) })] }), _jsx(Divider, {}), mode === 'filter' && (_jsxs(_Fragment, { children: [filterColumns.map((column) => (_jsxs(Box, { children: [_jsx(Typography, { sx: { fontSize: '13.5px', fontWeight: 600, color: '#292D32', mt: 1.75, mb: 1 }, children: column.label }), _jsx(StatusChips, { options: column.options, value: draft[column.field] ?? [], onChange: (next) => onDraftChange({ ...draft, [column.field]: next }) })] }, column.field))), _jsx(Divider, { sx: { mt: 2 } }), _jsxs(Stack, { direction: "row", sx: { alignItems: 'center', justifyContent: 'space-between', mt: 1.75 }, children: [_jsx(Box, { component: "button", type: "button", onClick: () => { onApply(emptyFilters); close(); }, sx: {
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
                            } }, sx: { mt: 2 } }), _jsx(Typography, { sx: { fontSize: '12px', color: 'text.secondary', mt: 1 }, children: summarizeChipFilters(draft, filterColumns) }), _jsx(Stack, { direction: "row", sx: { justifyContent: 'flex-end', mt: 2 }, children: _jsx(Button, { variant: "contained", disabled: !name.trim(), onClick: saveFilter, sx: { height: 36, minHeight: 36, px: '20px', fontSize: '13px' }, children: "Save & apply" }) })] }))] }) }));
}
export function ManageViewsDialog({ open, onClose, presets, filterColumns, onApply }) {
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
    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id)
            return;
        const from = presets.all.findIndex((p) => p.id === active.id);
        const to = presets.all.findIndex((p) => p.id === over.id);
        if (from !== -1 && to !== -1)
            presets.reorder(from, to);
    };
    return (_jsx(Dialog, { open: open, onClose: close, slotProps: { paper: { sx: { width: 480, maxWidth: '92vw', borderRadius: '16px' } } }, children: _jsxs(Box, { sx: { px: 3, pt: 2, pb: 2.5 }, children: [_jsxs(Stack, { direction: "row", sx: { alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }, children: [_jsxs(Stack, { direction: "row", spacing: 1, sx: { alignItems: 'center' }, children: [editing && (_jsx(IconButton, { onClick: () => setEditingId(null), "aria-label": "Back to views", sx: { width: 28, height: 28, ml: -0.5, color: '#292D32' }, children: _jsx(ArrowBackRoundedIcon, { sx: { fontSize: 17 } }) })), _jsx(Typography, { sx: { fontSize: '18px', fontWeight: 600, color: '#292D32' }, children: editing ? 'Edit view' : 'Views' })] }), _jsx(IconButton, { onClick: close, "aria-label": "Close views", sx: { width: 28, height: 28, bgcolor: '#F6F7FB', color: '#292D32', '&:hover': { bgcolor: '#EDEFF5' } }, children: _jsx(CloseRoundedIcon, { sx: { fontSize: 16 } }) })] }), _jsx(Divider, {}), editing ? (_jsxs(_Fragment, { children: [_jsx(Typography, { sx: { fontSize: '13.5px', fontWeight: 600, color: '#292D32', mt: 2, mb: 1 }, children: "Name" }), _jsx(TextField, { autoFocus: true, fullWidth: true, placeholder: "View name", value: editName, onChange: (e) => setEditName(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') {
                                e.preventDefault();
                                commitEdit();
                            } } }), filterColumns.map((column) => (_jsxs(Box, { children: [_jsx(Typography, { sx: { fontSize: '13.5px', fontWeight: 600, color: '#292D32', mt: 2, mb: 1 }, children: column.label }), _jsx(StatusChips, { options: column.options, value: editFilters[column.field] ?? [], onChange: (next) => setEditFilters({ ...editFilters, [column.field]: next }) })] }, column.field))), _jsxs(Stack, { direction: "row", spacing: 1, sx: { justifyContent: 'flex-end', mt: 3 }, children: [_jsx(Button, { variant: "outlined", color: "inherit", onClick: () => setEditingId(null), sx: { height: 36, minHeight: 36, px: '16px', fontSize: '13px', borderRadius: '8px' }, children: "Cancel" }), _jsx(Button, { variant: "contained", disabled: !editName.trim(), onClick: commitEdit, sx: { height: 36, minHeight: 36, px: '20px', fontSize: '13px' }, children: "Save changes" })] })] })) : (_jsxs(_Fragment, { children: [_jsx(Stack, { spacing: 0.25, sx: { mt: 1.5, maxHeight: 380, overflowY: 'auto' }, children: _jsx(DndContext, { sensors: sensors, collisionDetection: closestCenter, modifiers: [restrictToVerticalAxis, restrictToParentElement], onDragEnd: handleDragEnd, children: _jsx(SortableContext, { items: presets.all.map((p) => p.id), strategy: verticalListSortingStrategy, children: presets.all.map((p) => (_jsxs(SortableViewRow, { id: p.id, onClick: () => { onApply(p.filters, p.id); close(); }, children: [_jsxs(Box, { sx: { flex: 1, minWidth: 0 }, children: [_jsx(Typography, { noWrap: true, sx: { fontSize: '14px', fontWeight: 600, color: '#292D32' }, children: p.name }), _jsx(Typography, { noWrap: true, sx: { fontSize: '12.5px', color: 'text.secondary' }, children: summarizeChipFilters(p.filters, filterColumns) })] }), _jsxs(Stack, { direction: "row", spacing: 0.25, onClick: (e) => e.stopPropagation(), children: [_jsx(Tooltip, { title: "Edit", children: _jsx(IconButton, { size: "small", "aria-label": `Edit ${p.name}`, onClick: () => startEdit(p.id), sx: { color: 'text.secondary' }, children: _jsx(EditIcon, { sx: { fontSize: 15 } }) }) }), _jsx(Tooltip, { title: "Delete", children: _jsx(IconButton, { size: "small", "aria-label": `Delete ${p.name}`, onClick: () => presets.remove(p.id), sx: { color: 'error.main' }, children: _jsx(TrashIcon, { sx: { fontSize: 15 } }) }) })] })] }, p.id))) }) }) }), _jsx(Stack, { direction: "row", sx: { justifyContent: 'flex-end', mt: 2 }, children: _jsx(Button, { variant: "contained", onClick: close, sx: { height: 36, minHeight: 36, px: '24px', fontSize: '13px' }, children: "Done" }) })] }))] }) }));
}
function SortableViewRow({ id, children, onClick }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    return (_jsxs(Stack, { ref: setNodeRef, direction: "row", onClick: onClick, sx: {
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
            bgcolor: isDragging ? '#F6F7FB' : undefined,
            boxShadow: isDragging ? '0px 8px 24px rgba(0,0,0,0.12)' : undefined,
            '&:hover': { bgcolor: '#F6F7FB' },
        }, children: [_jsx(Box, { ...attributes, ...listeners, onClick: (e) => e.stopPropagation(), "aria-label": "Drag to reorder", sx: {
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.disabled',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    touchAction: 'none',
                    '&:hover': { color: 'text.secondary' },
                }, children: _jsx(DragIndicatorIcon, { sx: { fontSize: 18 } }) }), children] }));
}
