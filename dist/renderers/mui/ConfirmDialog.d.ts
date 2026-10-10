import { type DialogProps } from '@mui/material';
export type ConfirmColor = 'primary' | 'error' | 'warning' | 'success';
export interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmColor?: ConfirmColor;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
    /** Forwarded to the underlying MUI `Dialog`, so a consumer can size or restyle this instance. */
    slotProps?: DialogProps['slotProps'];
    maxWidth?: DialogProps['maxWidth'];
    fullWidth?: DialogProps['fullWidth'];
}
/** A stand-in for `window.confirm()` built from MUI's dialog slots, so it inherits whatever the
 * consumer's theme says a dialog looks like rather than carrying its own opinion. */
export declare function ConfirmDialog({ open, title, description, confirmLabel, cancelLabel, confirmColor, onConfirm, onCancel, slotProps, maxWidth, fullWidth, }: ConfirmDialogProps): import("react").JSX.Element;
//# sourceMappingURL=ConfirmDialog.d.ts.map