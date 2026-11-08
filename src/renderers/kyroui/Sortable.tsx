import type { ReactNode } from 'react'
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Box, Stack } from '@kyrobit/kyroui'
import { DragIcon } from './icons.js'

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
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        position: 'relative',
        zIndex: isDragging ? 1 : undefined,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        onClick={onClick}
        sx={{
          gap: 'sm',
          px: 'sm',
          py: 'md',
          borderRadius: 'md',
          cursor: onClick ? 'pointer' : undefined,
          bgcolor: isDragging ? 'grey.50' : undefined,
          boxShadow: isDragging ? 3 : undefined,
          '&:hover': { bgcolor: 'grey.50' },
        }}
      >
        <Box
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          aria-label="Drag to reorder"
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
            '&': { color: 'text.disabled' },
            '&:hover': { color: 'text.secondary' },
          }}
        >
          <DragIcon fontSize="small" />
        </Box>
        {children}
      </Stack>
    </div>
  )
}

