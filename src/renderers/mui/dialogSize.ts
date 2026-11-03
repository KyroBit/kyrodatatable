import { useTheme, type DialogProps } from '@mui/material'

export function useDialogSize() {
  const defaults = useTheme().components?.MuiDialog?.defaultProps as Pick<DialogProps, 'fullWidth' | 'maxWidth'> | undefined
  return { fullWidth: defaults?.fullWidth ?? true, maxWidth: defaults?.maxWidth ?? 'xs' }
}
