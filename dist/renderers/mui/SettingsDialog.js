import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Stack, Switch, Typography, alpha, } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useDataTableContext } from './context.js';
function SectionLabel({ children }) {
    return (_jsx(Typography, { sx: { fontSize: '13px', fontWeight: 600, color: 'text.secondary', mb: 1 }, children: children }));
}
function Group({ children }) {
    return (_jsx(Box, { sx: (theme) => ({
            borderRadius: '12px',
            overflow: 'hidden',
            bgcolor: alpha(theme.palette.text.primary, 0.03),
        }), children: children }));
}
function Row({ title, description, control, onClick, }) {
    return (_jsxs(Stack, { direction: "row", onClick: onClick, sx: (theme) => ({
            alignItems: 'center',
            gap: 2,
            px: 2,
            py: 1.5,
            cursor: onClick ? 'pointer' : 'default',
            '& + &': { boxShadow: `inset 0 1px 0 ${theme.palette.divider}` },
            '&:hover': onClick ? { bgcolor: alpha(theme.palette.text.primary, 0.04) } : undefined,
        }), children: [_jsxs(Box, { sx: { flex: 1, minWidth: 0 }, children: [_jsx(Typography, { sx: { fontSize: '14px' }, children: title }), description && (_jsx(Typography, { sx: { fontSize: '13px', color: 'text.secondary' }, children: description }))] }), control] }));
}
/**
 * Everything about how this table is presented, in one place: which columns show,
 * and the saved views when the table has them.
 */
export function DataTableSettingsDialog({ open, onClose, onManageViews, DialogProps, }) {
    const api = useDataTableContext();
    const lastVisible = api.visibleColumns.length === 1;
    return (_jsxs(Dialog, { open: open, onClose: onClose, ...DialogProps, children: [_jsx(DialogTitle, { children: _jsxs(Stack, { direction: "row", spacing: 2, sx: { alignItems: 'center' }, children: [_jsx(Box, { component: "span", sx: { flex: 1 }, children: "Settings" }), _jsx(IconButton, { size: "small", edge: "end", onClick: onClose, "aria-label": "Close", children: _jsx(CloseRoundedIcon, { fontSize: "small" }) })] }) }), _jsxs(DialogContent, { children: [_jsx(SectionLabel, { children: "Columns" }), _jsx(Group, { children: api.columns.map((column) => {
                            const visible = !api.hiddenColumns.includes(column.field);
                            return (_jsx(Row, { title: column.headerName, control: _jsx(Switch, { checked: visible, 
                                    // A table with no columns left has nothing to show, so the last one stays.
                                    disabled: visible && lastVisible, onChange: (event) => api.setColumnHidden(column.field, !event.target.checked), slotProps: { input: { 'aria-label': column.headerName } } }) }, column.field));
                        }) }), onManageViews && (_jsxs(Box, { sx: { mt: 3 }, children: [_jsx(SectionLabel, { children: "Views" }), _jsx(Group, { children: _jsx(Row, { title: "Manage views", description: "Rename, reorder or delete your saved views", onClick: onManageViews, control: _jsx(ChevronRightRoundedIcon, { sx: { color: 'text.disabled' } }) }) })] }))] })] }));
}
