import { useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { Box, Button, Chip, Divider, IconButton, Popover, Stack, Typography } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { useDataTableContext } from './context.js'
import { SortableList, SortableRow } from './Sortable.js'
import { GroupIcon } from './icons.js'

export function DataTableGroupMenu() {
  const api = useDataTableContext()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [draft, setDraft] = useState<string[]>([])
  const columns = api.groupByColumns ?? []
  const levels = api.groupBy
  const unused = columns.filter((c) => !draft.includes(c.field))
  const labelOf = (field: string) => columns.find((c) => c.field === field)?.label ?? field
  const changed = draft.length !== levels.length || draft.some((field, i) => field !== levels[i])
  const label = levels.length === 0 ? 'Group' : `Group: ${labelOf(levels[0]!)}${levels.length > 1 ? ` +${levels.length - 1}` : ''}`

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<GroupIcon />}
        endIcon={<ExpandMoreRoundedIcon />}
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchor)}
        onClick={(e) => {
          setDraft(levels)
          setAnchor(e.currentTarget)
        }}
      >
        {label}
      </Button>
      <Popover
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { 'aria-label': 'Group rows', role: 'dialog', sx: { width: 320, maxWidth: 'calc(100vw - 32px)', mt: 1 } } }}
      >
        <Box sx={{ px: 2.5, pt: 1.5, pb: 2 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 600 }}>Group</Typography>
            <IconButton size="small" onClick={() => setAnchor(null)} aria-label="Close grouping">
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Divider />
          <Box sx={{ mt: 1 }}>
            {draft.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ px: 1, py: 1.5 }}>Not grouped</Typography>
            )}
            <SortableList ids={draft} onMove={(from, to) => setDraft(arrayMove(draft, from, to))}>
              {draft.map((field) => (
                <SortableRow key={field} id={field}>
                  <Typography noWrap sx={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{labelOf(field)}</Typography>
                  <IconButton size="small" onClick={() => setDraft(draft.filter((f) => f !== field))} aria-label={`Remove ${labelOf(field)}`}>
                    <CloseRoundedIcon fontSize="small" />
                  </IconButton>
                </SortableRow>
              ))}
            </SortableList>
          </Box>
          {unused.length > 0 && (
            <Stack direction="row" role="group" aria-label="Add a level" sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
              {unused.map((c) => (
                <Chip
                  key={c.field}
                  label={c.label}
                  onClick={() => setDraft([...draft, c.field])}
                  sx={{ borderRadius: 1, fontWeight: 500, bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}
                />
              ))}
            </Stack>
          )}
          <Divider sx={{ mt: 2 }} />
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Button color="inherit" disabled={draft.length === 0} onClick={() => setDraft([])}>Clear</Button>
            <Button
              variant="contained"
              disabled={!changed}
              onClick={() => {
                api.setGroupBy(draft)
                setAnchor(null)
              }}
            >
              Apply
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  )
}
