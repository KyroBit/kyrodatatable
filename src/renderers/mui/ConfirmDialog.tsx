import { Box, Button, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'primary' | 'error' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

/** A styled stand-in for `window.confirm()` — same header/body/actions shape already used by
 * `ManageViewsDialog` in this file, so anything in this library asking "are you sure?" (bulk
 * actions, discarding a dirty edit, or a consumer's own use) looks native to it. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmColor = 'primary',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} slotProps={{ paper: { sx: { width: 400, maxWidth: '92vw', borderRadius: '16px' } } }}>
      <Box sx={{ px: 3, pt: 2, pb: 2.5 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 600, color: 'text.primary' }}>{title}</Typography>
          <IconButton
            onClick={onCancel}
            aria-label="Close"
            sx={(theme) => ({
              width: 28,
              height: 28,
              bgcolor: alpha(theme.palette.text.primary, 0.04),
              color: theme.palette.text.primary,
              '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.08) },
            })}
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
        <Divider />
        {description && (
          <Typography sx={{ fontSize: '13.5px', color: 'text.secondary', mt: 2 }}>{description}</Typography>
        )}
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onCancel}
            sx={{ height: 36, minHeight: 36, px: '16px', fontSize: '13px', borderRadius: '8px' }}
          >
            {cancelLabel}
          </Button>
          <Button variant="contained" color={confirmColor} onClick={onConfirm} sx={{ height: 36, minHeight: 36, px: '20px', fontSize: '13px' }}>
            {confirmLabel}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  )
}
