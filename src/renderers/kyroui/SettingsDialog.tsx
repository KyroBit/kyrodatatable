import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Switch,
  Typography,
} from '@kyrobit/kyroui'
import { ChevronRightIcon, CloseIcon } from './icons.js'
import { useDataTableContext } from './context.js'

export interface DataTableSettingsDialogProps {
  open: boolean
  onClose: () => void
  onManageViews?: () => void
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography sx={{ fontSize: 'md', fontWeight: 600, color: 'text.secondary', mb: 'sm' }}>
      {children}
    </Typography>
  )
}

function Group({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ borderRadius: 'popup', overflow: 'hidden', bgcolor: 'background.surface' }}>
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
      alignItems="center"
      onClick={onClick}
      sx={(theme) => ({
        gap: 'lg',
        px: 'lg',
        py: 'md',
        cursor: onClick ? 'pointer' : 'default',
        '& + &': { boxShadow: `inset 0 1px 0 ${theme.vars.palette.divider}` },
        '&:hover': onClick ? { bgcolor: 'background.surfaceHover' } : undefined,
      })}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 'lg' }}>{title}</Typography>
        {description && (
          <Typography sx={{ fontSize: 'md', color: 'text.secondary' }}>{description}</Typography>
        )}
      </Box>
      {control}
    </Stack>
  )
}

export function DataTableSettingsDialog({
  open,
  onClose,
  onManageViews,
}: DataTableSettingsDialogProps) {
  const api = useDataTableContext()
  const lastVisible = api.visibleColumns.length === 1

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Stack direction="row" spacing="lg" alignItems="center">
          <Box component="span" sx={{ flex: 1 }}>
            Settings
          </Box>
          <IconButton size="small" onClick={onClose} aria-label="Close">
            <CloseIcon fontSize="small" />
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
                    onChange={(_, checked) => api.setColumnHidden(column.field, !checked)}
                    aria-label={column.headerName}
                  />
                }
              />
            )
          })}
        </Group>

        {onManageViews && (
          <Box sx={{ mt: 'xl' }}>
            <SectionLabel>Views</SectionLabel>
            <Group>
              <Row
                title="Manage views"
                description="Rename, reorder or delete your saved views"
                onClick={onManageViews}
                control={<ChevronRightIcon sx={{ color: 'text.disabled' }} />}
              />
            </Group>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
