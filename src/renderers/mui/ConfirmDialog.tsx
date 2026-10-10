import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  type DialogProps,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

export type ConfirmColor = 'primary' | 'error' | 'warning' | 'success'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: ConfirmColor
  onConfirm: () => void | Promise<void>
  onCancel: () => void
  /** Forwarded to the underlying MUI `Dialog`, so a consumer can size or restyle this instance. */
  slotProps?: DialogProps['slotProps']
  maxWidth?: DialogProps['maxWidth']
  fullWidth?: DialogProps['fullWidth']
}

/** A stand-in for `window.confirm()` built from MUI's dialog slots, so it inherits whatever the
 * consumer's theme says a dialog looks like rather than carrying its own opinion. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmColor = 'primary',
  onConfirm,
  onCancel,
  slotProps,
  maxWidth,
  fullWidth,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false)

  const confirm = async () => {
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onCancel}
      slotProps={slotProps}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <DialogTitle>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <span style={{ flex: 1 }}>{title}</span>
          <IconButton size="small" edge="end" onClick={onCancel} disabled={busy} aria-label="Close">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      {description && (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      )}

      <DialogActions>
        <Button color="inherit" onClick={onCancel} disabled={busy}>
          {cancelLabel}
        </Button>
        <Button variant="contained" color={confirmColor} loading={busy} onClick={confirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
