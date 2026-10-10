import { type DialogProps as MuiDialogProps } from '@mui/material';
export interface DataTableSettingsDialogProps {
    open: boolean;
    onClose: () => void;
    /** Offered as a row when the table has saved views; opens the manage-views dialog. */
    onManageViews?: () => void;
    /** Forwarded to the underlying MUI `Dialog`. Sizing and chrome otherwise come from your theme. */
    DialogProps?: Omit<MuiDialogProps, 'open' | 'onClose' | 'children'>;
}
/**
 * Everything about how this table is presented, in one place: which columns show,
 * and the saved views when the table has them.
 */
export declare function DataTableSettingsDialog({ open, onClose, onManageViews, DialogProps, }: DataTableSettingsDialogProps): import("react").JSX.Element;
//# sourceMappingURL=SettingsDialog.d.ts.map