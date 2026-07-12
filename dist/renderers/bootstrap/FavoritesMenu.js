import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useRef, useState } from 'react';
export function FavoritesMenu({ presets, activeId, currentFilters, filterEditor, summarize, onApply, label = 'Favorites', }) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState({ kind: 'list' });
    const rootRef = useRef(null);
    const close = () => { setOpen(false); setMode({ kind: 'list' }); };
    return (_jsxs("div", { className: "position-relative d-inline-block", ref: rootRef, children: [_jsxs("button", { type: "button", className: "btn btn-outline-secondary btn-sm", onClick: () => setOpen((v) => !v), children: ["\u2605 ", label] }), open && (_jsxs("div", { className: "card shadow-sm position-absolute end-0 mt-1", style: { width: 320, zIndex: 1000 }, children: [_jsxs("div", { className: "card-header d-flex justify-content-between align-items-center py-2", children: [_jsx("strong", { className: "small", children: "Favorites" }), mode.kind === 'list' ? (_jsx("button", { type: "button", className: "btn btn-sm btn-link p-0", onClick: () => setMode({ kind: 'add' }), children: "+ Add" })) : (_jsx("button", { type: "button", className: "btn-close", "aria-label": "Close", onClick: () => setMode({ kind: 'list' }) }))] }), mode.kind === 'add' && (_jsx(PresetForm, { initialFilters: currentFilters, filterEditor: filterEditor, onCancel: () => setMode({ kind: 'list' }), onSubmit: (name, filters) => { presets.create(name, filters); setMode({ kind: 'list' }); } })), mode.kind === 'edit' && (() => {
                        const editing = presets.custom.find((p) => p.id === mode.id);
                        if (!editing)
                            return null;
                        return (_jsx(PresetForm, { initialName: editing.name, initialFilters: editing.filters, filterEditor: filterEditor, onCancel: () => setMode({ kind: 'list' }), onSubmit: (name, filters) => { presets.update(editing.id, name, filters); setMode({ kind: 'list' }); } }));
                    })(), mode.kind === 'list' && (presets.all.length === 0 ? (_jsx("div", { className: "card-body text-center text-muted small py-4", children: "No favorites saved yet." })) : (_jsx("ul", { className: "list-group list-group-flush", style: { maxHeight: 300, overflowY: 'auto' }, children: presets.all.map((p, i) => (_jsx(PresetRow, { preset: p, isActive: activeId === p.id, summary: summarize(p.filters), canMoveUp: !p.builtIn && i > presets.builtIn.length, canMoveDown: !p.builtIn && i < presets.all.length - 1, onApply: () => { onApply(p.filters); close(); }, onEdit: p.builtIn ? undefined : () => setMode({ kind: 'edit', id: p.id }), onDelete: p.builtIn ? undefined : () => presets.remove(p.id), onMoveUp: () => presets.reorder(i - presets.builtIn.length, i - presets.builtIn.length - 1), onMoveDown: () => presets.reorder(i - presets.builtIn.length, i - presets.builtIn.length + 1) }, p.id))) })))] }))] }));
}
function PresetRow({ preset, isActive, summary, canMoveUp, canMoveDown, onApply, onEdit, onDelete, onMoveUp, onMoveDown, }) {
    return (_jsxs("li", { className: `list-group-item d-flex align-items-center gap-1 ${isActive ? 'bg-body-secondary' : ''}`, children: [_jsxs("button", { type: "button", className: "btn btn-link p-0 text-start flex-grow-1 text-decoration-none", onClick: onApply, children: [_jsx("div", { className: `small ${isActive ? 'fw-bold' : 'fw-semibold'}`, children: preset.name }), _jsx("div", { className: "text-muted", style: { fontSize: '0.75rem' }, children: summary })] }), (onEdit || onDelete) && (_jsxs("div", { className: "d-flex gap-1", children: [canMoveUp && _jsx("button", { type: "button", className: "btn btn-sm btn-link p-0", onClick: onMoveUp, children: "\u2191" }), canMoveDown && _jsx("button", { type: "button", className: "btn btn-sm btn-link p-0", onClick: onMoveDown, children: "\u2193" }), onEdit && _jsx("button", { type: "button", className: "btn btn-sm btn-link p-0", onClick: onEdit, children: "\u270E" }), onDelete && _jsx("button", { type: "button", className: "btn btn-sm btn-link p-0 text-danger", onClick: onDelete, children: "\u2715" })] }))] }));
}
function PresetForm({ initialName = '', initialFilters, filterEditor, onCancel, onSubmit, }) {
    const [name, setName] = useState(initialName);
    const [filters, setFilters] = useState(initialFilters);
    const submit = () => { const t = name.trim(); if (t)
        onSubmit(t, filters); };
    return (_jsxs("div", { className: "card-body", children: [_jsx("input", { autoFocus: true, type: "text", className: "form-control form-control-sm mb-2", placeholder: "Name", value: name, onChange: (e) => setName(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') {
                    e.preventDefault();
                    submit();
                } } }), _jsx("div", { className: "mb-2", children: filterEditor(filters, setFilters) }), _jsxs("div", { className: "d-flex justify-content-end gap-2", children: [_jsx("button", { type: "button", className: "btn btn-sm btn-outline-secondary", onClick: onCancel, children: "Cancel" }), _jsx("button", { type: "button", className: "btn btn-sm btn-primary", disabled: !name.trim(), onClick: submit, children: initialName ? 'Save changes' : 'Add favorite' })] })] }));
}
