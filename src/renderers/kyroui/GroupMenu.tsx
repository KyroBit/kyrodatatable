import { useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { Box, Button, Chip, Divider, IconButton, Popover, Stack, Typography } from '@kyrobit/kyroui'
import { useDataTableContext } from './context.js'
import { SortableList, SortableRow } from './Sortable.js'
import { CloseIcon, ExpandMoreIcon, GroupIcon } from './icons.js'

export interface DataTableGroupPanelProps {
  anchor: HTMLElement | null
  onClose: () => void
}

export function DataTableGroupPanel({ anchor, onClose }: DataTableGroupPanelProps) {
  const api = useDataTableContext()
  const [draft, setDraft] = useState<string[]>([])
  const [openedFor, setOpenedFor] = useState<HTMLElement | null>(null)
  const columns = api.groupByColumns ?? []
  const levels = api.groupBy
  const unused = columns.filter((c) => !draft.includes(c.field))
  const labelOf = (field: string) => columns.find((c) => c.field === field)?.label ?? field
  const changed = draft.length !== levels.length || draft.some((field, i) => field !== levels[i])

  if (anchor !== openedFor) {
    setOpenedFor(anchor)
    if (anchor) setDraft(levels)
  }

  return (
    <Popover
      anchorEl={anchor}
      open={Boolean(anchor)}
      onClose={onClose}
      placement="bottom-start"
      aria-label="Group rows"
      sx={(theme) => ({ width: 320, maxWidth: `calc(100vw - 2 * ${theme.spacing('lg')})` })}
    >
      <Box sx={{ px: 'lg', pt: 'md', pb: 'lg' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 'md' }}>
          <Typography sx={{ fontSize: 'h5', fontWeight: 600, color: 'text.primary' }}>Group</Typography>
          <IconButton variant="tonal" size="small" onClick={onClose} aria-label="Close grouping">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Divider />
        <Box sx={{ mt: 'sm' }}>
          {draft.length === 0 && (
            <Typography sx={{ fontSize: 'md', color: 'text.secondary', px: 'sm', py: 'md' }}>Not grouped</Typography>
          )}
          <SortableList ids={draft} onMove={(from, to) => setDraft(arrayMove(draft, from, to))}>
            {draft.map((field) => (
              <SortableRow key={field} id={field}>
                <Typography noWrap sx={{ flex: 1, fontSize: 'lg', fontWeight: 500, color: 'text.primary' }}>{labelOf(field)}</Typography>
                <IconButton size="small" onClick={() => setDraft(draft.filter((f) => f !== field))} aria-label={`Remove ${labelOf(field)}`}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </SortableRow>
            ))}
          </SortableList>
        </Box>
        {unused.length > 0 && (
          <Stack direction="row" role="group" aria-label="Add a level" sx={{ flexWrap: 'wrap', gap: 'xs', mt: 'sm' }}>
            {unused.map((c) => (
              <Chip
                key={c.field}
                label={c.label}
                onClick={() => setDraft([...draft, c.field])}
                sx={{
                  borderRadius: 'sm',
                  fontSize: 'md',
                  '&': { bgcolor: 'action.hover' },
                  '&:hover': { bgcolor: 'action.selected' },
                }}
              />
            ))}
          </Stack>
        )}
        <Divider sx={{ mt: 'md' }} />
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 'md' }}>
          <Button variant="text" disabled={draft.length === 0} onClick={() => setDraft([])}>Clear</Button>
          <Button
            variant="contained"
            disabled={!changed}
            onClick={() => {
              api.setGroupBy(draft)
              onClose()
            }}
          >
            Apply
          </Button>
        </Stack>
      </Box>
    </Popover>
  )
}

export function DataTableGroupMenu() {
  const api = useDataTableContext()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const levels = api.groupBy
  const labelOf = (field: string) => api.groupByColumns?.find((c) => c.field === field)?.label ?? field
  const label = levels.length === 0 ? 'Group' : `Group: ${labelOf(levels[0]!)}${levels.length > 1 ? ` +${levels.length - 1}` : ''}`

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<GroupIcon />}
        endIcon={<ExpandMoreIcon />}
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchor)}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        {label}
      </Button>
      <DataTableGroupPanel anchor={anchor} onClose={() => setAnchor(null)} />
    </>
  )
}
