import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Switch,
  Typography,
  alpha,
  type DialogProps as MuiDialogProps,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { useDataTableContext } from './context.js'

export interface DataTableSettingsDialogProps {
  open: boolean
  onClose: () => void
  /** Offered as a row when the table has saved views; opens the manage-views dialog. */
  onManageViews?: () => void
  /** Forwarded to the underlying MUI `Dialog`. Sizing and chrome otherwise come from your theme. */
  DialogProps?: Omit<MuiDialogProps, 'open' | 'onClose' | 'children'>
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'text.secondary', mb: 1 }}>
      {children}
    </Typography>
  )
}

function Group({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={(theme) => ({
        borderRadius: '12px',
        overflow: 'hidden',
        bgcolor: alpha(theme.palette.text.primary, 0.03),
      })}
    >
      {children}
    </Box>
  )
}

function Row({
  title,
  description,
  control,
  onClick,
}: {
  title: string
  description?: string
  control?: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Stack
      direction="row"
      onClick={onClick}
      sx={(theme) => ({
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1.5,
        cursor: onClick ? 'pointer' : 'default',
        '& + &': { boxShadow: `inset 0 1px 0 ${theme.palette.divider}` },
        '&:hover': onClick ? { bgcolor: alpha(theme.palette.text.primary, 0.04) } : undefined,
      })}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: '14px' }}>{title}</Typography>
        {description && (
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>{description}</Typography>
        )}
      </Box>
      {control}
    </Stack>
  )
}

/**
 * Everything about how this table is presented, in one place: which columns show,
 * and the saved views when the table has them.
 */
export function DataTableSettingsDialog({
  open,
  onClose,
  onManageViews,
  DialogProps,
}: DataTableSettingsDialogProps) {
  const api = useDataTableContext()
  const lastVisible = api.visibleColumns.length === 1

  return (
    <Dialog open={open} onClose={onClose} {...DialogProps}>
      <DialogTitle>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Box component="span" sx={{ flex: 1 }}>
            Settings
          </Box>
          <IconButton size="small" edge="end" onClick={onClose} aria-label="Close">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <SectionLabel>Columns</SectionLabel>
        <Group>
          {api.columns.map((column) => {
            const visible = !api.hiddenColumns.includes(column.field)
            return (
              <Row
                key={column.field}
                title={column.headerName}
                control={
                  <Switch
                    checked={visible}
                    // A table with no columns left has nothing to show, so the last one stays.
                    disabled={visible && lastVisible}
                    onChange={(event) => api.setColumnHidden(column.field, !event.target.checked)}
                    slotProps={{ input: { 'aria-label': column.headerName } }}
                  />
                }
              />
            )
          })}
        </Group>

        {onManageViews && (
          <Box sx={{ mt: 3 }}>
            <SectionLabel>Views</SectionLabel>
            <Group>
              <Row
                title="Manage views"
                description="Rename, reorder or delete your saved views"
                onClick={onManageViews}
                control={<ChevronRightRoundedIcon sx={{ color: 'text.disabled' }} />}
              />
            </Group>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
