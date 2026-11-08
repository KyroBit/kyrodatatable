import type { ReactNode } from 'react'
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

export function SortableList({ ids, onMove, children }: { ids: string[]; onMove: (from: number, to: number) => void; children: ReactNode }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) onMove(ids.indexOf(String(active.id)), ids.indexOf(String(over.id)))
      }}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>{children}</SortableContext>
    </DndContext>
  )
}

export function SortableRow({ id, children, onClick }: { id: string; children: ReactNode; onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <Stack
      ref={setNodeRef}
      direction="row"
      onClick={onClick}
      sx={(theme) => ({
        alignItems: 'center',
        gap: 1,
        pl: 1,
        pr: 1,
        py: 1.25,
        borderRadius: '8px',
        cursor: onClick ? 'pointer' : undefined,
        transform: CSS.Transform.toString(transform),
        transition,
        position: 'relative',
        zIndex: isDragging ? 1 : undefined,
        bgcolor: isDragging ? alpha(theme.palette.text.primary, 0.04) : undefined,
        boxShadow: isDragging ? '0px 8px 24px rgba(0,0,0,0.12)' : undefined,
        '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.04) },
      })}
    >
      <Box
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        aria-label="Drag to reorder"
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'text.disabled',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          '&:hover': { color: 'text.secondary' },
        }}
      >
        <DragIndicatorIcon sx={{ fontSize: 18 }} />
      </Box>
      {children}
    </Stack>
  )
}

