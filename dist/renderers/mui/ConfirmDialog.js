import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
/** A stand-in for `window.confirm()` built from MUI's dialog slots, so it inherits whatever the
 * consumer's theme says a dialog looks like rather than carrying its own opinion. */
export function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', confirmColor = 'primary', onConfirm, onCancel, slotProps, maxWidth, fullWidth, }) {
    const [busy, setBusy] = useState(false);
    const confirm = async () => {
        setBusy(true);
        try {
            await onConfirm();
        }
        finally {
            setBusy(false);
        }
    };
    return (_jsxs(Dialog, { open: open, onClose: busy ? undefined : onCancel, slotProps: slotProps, maxWidth: maxWidth, fullWidth: fullWidth, children: [_jsx(DialogTitle, { children: _jsxs(Stack, { direction: "row", spacing: 2, sx: { alignItems: 'center' }, children: [_jsx("span", { style: { flex: 1 }, children: title }), _jsx(IconButton, { size: "small", edge: "end", onClick: onCancel, disabled: busy, "aria-label": "Close", children: _jsx(CloseRoundedIcon, { fontSize: "small" }) })] }) }), description && (_jsx(DialogContent, { children: _jsx(DialogContentText, { children: description }) })), _jsxs(DialogActions, { children: [_jsx(Button, { color: "inherit", onClick: onCancel, disabled: busy, children: cancelLabel }), _jsx(Button, { variant: "contained", color: confirmColor, loading: busy, onClick: confirm, children: confirmLabel })] })] }));
}
