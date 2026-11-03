import { useState } from 'react'
import { Button, FormDialog, Typography, type DialogProps } from '@kyrobit/kyroui'
import { useDialogSize } from './dialogSize.js'

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

  const size = useDialogSize()

  return (
    <FormDialog
      open={open}
      onClose={busy ? () => {} : onCancel}
      title={title}
      maxWidth={maxWidth ?? size.maxWidth}
      fullWidth={fullWidth ?? size.fullWidth}
      actions={
        <>
          <Button variant="text" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant="contained" color={confirmColor === 'error' ? 'error' : 'primary'} loading={busy} onClick={confirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {description && <Typography sx={{ color: 'text.secondary' }}>{description}</Typography>}
    </FormDialog>
  )
}
