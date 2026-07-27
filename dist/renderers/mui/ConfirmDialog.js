import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
/** A styled stand-in for `window.confirm()` — same header/body/actions shape already used by
 * `ManageViewsDialog` in this file, so anything in this library asking "are you sure?" (bulk
 * actions, discarding a dirty edit, or a consumer's own use) looks native to it. */
export function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', confirmColor = 'primary', onConfirm, onCancel, }) {
    return (_jsx(Dialog, { open: open, onClose: onCancel, slotProps: { paper: { sx: { width: 400, maxWidth: '92vw', borderRadius: '16px' } } }, children: _jsxs(Box, { sx: { px: 3, pt: 2, pb: 2.5 }, children: [_jsxs(Stack, { direction: "row", sx: { alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }, children: [_jsx(Typography, { sx: { fontSize: '18px', fontWeight: 600, color: 'text.primary' }, children: title }), _jsx(IconButton, { onClick: onCancel, "aria-label": "Close", sx: (theme) => ({
                                width: 28,
                                height: 28,
                                bgcolor: alpha(theme.palette.text.primary, 0.04),
                                color: theme.palette.text.primary,
                                '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.08) },
                            }), children: _jsx(CloseRoundedIcon, { sx: { fontSize: 16 } }) })] }), _jsx(Divider, {}), description && (_jsx(Typography, { sx: { fontSize: '13.5px', color: 'text.secondary', mt: 2 }, children: description })), _jsxs(Stack, { direction: "row", spacing: 1, sx: { justifyContent: 'flex-end', mt: 3 }, children: [_jsx(Button, { variant: "outlined", color: "inherit", onClick: onCancel, sx: { height: 36, minHeight: 36, px: '16px', fontSize: '13px', borderRadius: '8px' }, children: cancelLabel }), _jsx(Button, { variant: "contained", color: confirmColor, onClick: onConfirm, sx: { height: 36, minHeight: 36, px: '20px', fontSize: '13px' }, children: confirmLabel })] })] }) }));
}
