import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  type DialogProps,
} from '@kyrobit/kyroui'
import { CloseIcon } from './icons.js'

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
  maxWidth?: DialogProps['maxWidth']
  fullWidth?: DialogProps['fullWidth']
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmColor = 'primary',
  onConfirm,
  onCancel,
  maxWidth,
  fullWidth,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false)

  const confirm = async () => {
    setBusy(true)
    await Promise.resolve()
      .then(onConfirm)
      .finally(() => setBusy(false))
  }

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onCancel}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      <DialogTitle>
        <Stack direction="row" spacing="lg" alignItems="center">
          <span style={{ flex: 1 }}>{title}</span>
          <IconButton size="small" onClick={onCancel} disabled={busy} aria-label="Close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      {description && (
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>{description}</Typography>
        </DialogContent>
      )}

      <DialogActions>
        <Button variant="text" onClick={onCancel} disabled={busy}>
          {cancelLabel}
        </Button>
        {/* KyroUI's Button has only primary and error; warning and success fall back to primary. */}
        <Button variant="contained" color={confirmColor === 'error' ? 'error' : 'primary'} loading={busy} onClick={confirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
