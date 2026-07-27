export interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmColor?: 'primary' | 'error' | 'warning';
    onConfirm: () => void;
    onCancel: () => void;
}
/** A styled stand-in for `window.confirm()` — same header/body/actions shape already used by
 * `ManageViewsDialog` in this file, so anything in this library asking "are you sure?" (bulk
 * actions, discarding a dirty edit, or a consumer's own use) looks native to it. */
export declare function ConfirmDialog({ open, title, description, confirmLabel, cancelLabel, confirmColor, onConfirm, onCancel, }: ConfirmDialogProps): import("react").JSX.Element;
//# sourceMappingURL=ConfirmDialog.d.ts.map