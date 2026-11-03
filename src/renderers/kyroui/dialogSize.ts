import { useTheme, type DialogProps } from '@kyrobit/kyroui'

export function useDialogSize() {
  const defaults = useTheme().components.Dialog?.defaultProps as Pick<DialogProps, 'fullWidth' | 'maxWidth'> | undefined
  return { fullWidth: defaults?.fullWidth ?? true, maxWidth: defaults?.maxWidth ?? 'xs' }
}
