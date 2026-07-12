import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Button, Divider, IconButton, Popover, Stack, TextField, Typography, } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
export function FavoritesMenu({ presets, activeId, currentFilters, filterEditor, summarize, onApply, label = 'Favorites', }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mode, setMode] = useState({ kind: 'list' });
    const open = Boolean(anchorEl);
    const close = () => { setAnchorEl(null); setMode({ kind: 'list' }); };
    return (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outlined", color: "inherit", startIcon: _jsx(StarBorderRoundedIcon, {}), onClick: (e) => setAnchorEl(e.currentTarget), children: label }), _jsx(Popover, { open: open, anchorEl: anchorEl, onClose: close, anchorOrigin: { vertical: 'bottom', horizontal: 'right' }, transformOrigin: { vertical: 'top', horizontal: 'right' }, slotProps: { paper: { sx: { width: 340, mt: 1, borderRadius: 2, overflow: 'hidden' } } }, children: _jsxs(Stack, { children: [_jsxs(Stack, { direction: "row", sx: { alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5, pb: 1 }, children: [_jsx(Typography, { sx: { fontSize: '1rem', fontWeight: 700 }, children: "Favorites" }), mode.kind === 'list' ? (_jsx(Button, { size: "small", color: "primary", startIcon: _jsx(AddRoundedIcon, {}), onClick: () => setMode({ kind: 'add' }), children: "Add" })) : (_jsx(IconButton, { size: "small", onClick: () => setMode({ kind: 'list' }), sx: { color: 'text.secondary' }, children: _jsx(CloseRoundedIcon, { fontSize: "small" }) }))] }), _jsx(Divider, {}), mode.kind === 'add' && (_jsx(PresetForm, { initialFilters: currentFilters, filterEditor: filterEditor, onCancel: () => setMode({ kind: 'list' }), onSubmit: (name, filters) => { presets.create(name, filters); setMode({ kind: 'list' }); } })), mode.kind === 'edit' && (() => {
                            const editing = presets.custom.find((p) => p.id === mode.id);
                            if (!editing)
                                return null;
                            return (_jsx(PresetForm, { initialName: editing.name, initialFilters: editing.filters, filterEditor: filterEditor, onCancel: () => setMode({ kind: 'list' }), onSubmit: (name, filters) => { presets.update(editing.id, name, filters); setMode({ kind: 'list' }); } }));
                        })(), mode.kind === 'list' && (presets.all.length === 0 ? (_jsxs(Box, { sx: { p: 3, textAlign: 'center' }, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "No favorites saved yet." }), _jsx(Typography, { variant: "caption", color: "text.disabled", children: "Click \"Add\" to save the current filters." })] })) : (_jsx(Box, { sx: { maxHeight: 340, overflowY: 'auto', p: 1 }, children: _jsx(Stack, { spacing: 0.5, children: presets.all.map((p, i) => (_jsx(PresetRow, { preset: p, isActive: activeId === p.id, summary: summarize(p.filters), canMoveUp: !p.builtIn && i > presets.builtIn.length, canMoveDown: !p.builtIn && i < presets.all.length - 1, onApply: () => { onApply(p.filters); close(); }, onEdit: p.builtIn ? undefined : () => setMode({ kind: 'edit', id: p.id }), onDelete: p.builtIn ? undefined : () => presets.remove(p.id), onMoveUp: () => presets.reorder(i - presets.builtIn.length, i - presets.builtIn.length - 1), onMoveDown: () => presets.reorder(i - presets.builtIn.length, i - presets.builtIn.length + 1) }, p.id))) }) })))] }) })] }));
}
function PresetRow({ preset, isActive, summary, canMoveUp, canMoveDown, onApply, onEdit, onDelete, onMoveUp, onMoveDown, }) {
    return (_jsxs(Box, { sx: (theme) => ({
            display: 'flex', alignItems: 'center', gap: 0.5, pl: 1.25, pr: 1, py: 0.5, borderRadius: 1.5,
            bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
            '&:hover': { bgcolor: isActive ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.text.primary, 0.04) },
        }), children: [_jsxs(Box, { component: "button", type: "button", onClick: onApply, sx: { flex: 1, minWidth: 0, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', py: 0.5, fontFamily: 'inherit', color: 'inherit' }, children: [_jsx(Typography, { variant: "subtitle2", noWrap: true, sx: { color: isActive ? 'primary.main' : 'text.primary', fontWeight: isActive ? 700 : 600 }, children: preset.name }), _jsx(Typography, { variant: "caption", color: "text.secondary", noWrap: true, sx: { display: 'block' }, children: summary })] }), (onEdit || onDelete) && (_jsxs(_Fragment, { children: [canMoveUp && _jsx(IconButton, { size: "small", onClick: onMoveUp, sx: { color: 'text.secondary' }, children: _jsx(ArrowUpwardRoundedIcon, { sx: { fontSize: 14 } }) }), canMoveDown && _jsx(IconButton, { size: "small", onClick: onMoveDown, sx: { color: 'text.secondary' }, children: _jsx(ArrowDownwardRoundedIcon, { sx: { fontSize: 14 } }) }), onEdit && _jsx(IconButton, { size: "small", onClick: onEdit, sx: { color: 'text.secondary' }, children: _jsx(EditRoundedIcon, { sx: { fontSize: 16 } }) }), onDelete && _jsx(IconButton, { size: "small", onClick: onDelete, sx: { color: 'error.main' }, children: _jsx(DeleteRoundedIcon, { sx: { fontSize: 16 } }) })] }))] }));
}
function PresetForm({ initialName = '', initialFilters, filterEditor, onCancel, onSubmit, }) {
    const [name, setName] = useState(initialName);
    const [filters, setFilters] = useState(initialFilters);
    const submit = () => { const t = name.trim(); if (t)
        onSubmit(t, filters); };
    return (_jsx(Box, { sx: { p: 2 }, children: _jsxs(Stack, { spacing: 1.75, children: [_jsx(TextField, { autoFocus: true, label: "Name", value: name, onChange: (e) => setName(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') {
                        e.preventDefault();
                        submit();
                    } }, required: true }), filterEditor(filters, setFilters), _jsxs(Stack, { direction: "row", spacing: 1, sx: { justifyContent: 'flex-end' }, children: [_jsx(Button, { onClick: onCancel, sx: { color: 'text.secondary' }, children: "Cancel" }), _jsx(Button, { variant: "contained", onClick: submit, disabled: !name.trim(), children: initialName ? 'Save changes' : 'Add favorite' })] })] }) }));
}
