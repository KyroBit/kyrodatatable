import { type DialogProps } from '@kyrobit/kyroui';
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
    maxWidth?: DialogProps['maxWidth'];
    fullWidth?: DialogProps['fullWidth'];
}
export declare function ConfirmDialog({ open, title, description, confirmLabel, cancelLabel, confirmColor, onConfirm, onCancel, maxWidth, fullWidth, }: ConfirmDialogProps): import("react").JSX.Element;
//# sourceMappingURL=ConfirmDialog.d.ts.map