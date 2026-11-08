import { c as _c } from "react/compiler-runtime";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function SortableList(t0) {
  const $ = _c(13);
  const {
    ids,
    onMove,
    children
  } = t0;
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = {
      activationConstraint: {
        distance: 4
      }
    };
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  let t2;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = {
      coordinateGetter: sortableKeyboardCoordinates
    };
    $[1] = t2;
  } else {
    t2 = $[1];
  }
  const sensors = useSensors(useSensor(PointerSensor, t1), useSensor(KeyboardSensor, t2));
  let t3;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t3 = [restrictToVerticalAxis, restrictToParentElement];
    $[2] = t3;
  } else {
    t3 = $[2];
  }
  let t4;
  if ($[3] !== ids || $[4] !== onMove) {
    t4 = t5 => {
      const {
        active,
        over
      } = t5;
      if (over && active.id !== over.id) {
        onMove(ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
      }
    };
    $[3] = ids;
    $[4] = onMove;
    $[5] = t4;
  } else {
    t4 = $[5];
  }
  let t5;
  if ($[6] !== children || $[7] !== ids) {
    t5 = /*#__PURE__*/_jsx(SortableContext, {
      items: ids,
      strategy: verticalListSortingStrategy,
      children: children
    });
    $[6] = children;
    $[7] = ids;
    $[8] = t5;
  } else {
    t5 = $[8];
  }
  let t6;
  if ($[9] !== sensors || $[10] !== t4 || $[11] !== t5) {
    t6 = /*#__PURE__*/_jsx(DndContext, {
      sensors: sensors,
      collisionDetection: closestCenter,
      modifiers: t3,
      onDragEnd: t4,
      children: t5
    });
    $[9] = sensors;
    $[10] = t4;
    $[11] = t5;
    $[12] = t6;
  } else {
    t6 = $[12];
  }
  return t6;
}
export function SortableRow(t0) {
  const $ = _c(21);
  const {
    id,
    children,
    onClick
  } = t0;
  let t1;
  if ($[0] !== id) {
    t1 = {
      id
    };
    $[0] = id;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable(t1);
  let t2;
  if ($[2] !== isDragging || $[3] !== onClick || $[4] !== transform || $[5] !== transition) {
    t2 = theme => ({
      alignItems: "center",
      gap: 1,
      pl: 1,
      pr: 1,
      py: 1.25,
      borderRadius: "8px",
      cursor: onClick ? "pointer" : undefined,
      transform: CSS.Transform.toString(transform),
      transition,
      position: "relative",
      zIndex: isDragging ? 1 : undefined,
      bgcolor: isDragging ? alpha(theme.palette.text.primary, 0.04) : undefined,
      boxShadow: isDragging ? "0px 8px 24px rgba(0,0,0,0.12)" : undefined,
      "&:hover": {
        bgcolor: alpha(theme.palette.text.primary, 0.04)
      }
    });
    $[2] = isDragging;
    $[3] = onClick;
    $[4] = transform;
    $[5] = transition;
    $[6] = t2;
  } else {
    t2 = $[6];
  }
  const t3 = isDragging ? "grabbing" : "grab";
  let t4;
  if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = {
      color: "text.secondary"
    };
    $[7] = t4;
  } else {
    t4 = $[7];
  }
  let t5;
  if ($[8] !== t3) {
    t5 = {
      display: "flex",
      alignItems: "center",
      color: "text.disabled",
      cursor: t3,
      touchAction: "none",
      "&:hover": t4
    };
    $[8] = t3;
    $[9] = t5;
  } else {
    t5 = $[9];
  }
  let t6;
  if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = /*#__PURE__*/_jsx(DragIndicatorIcon, {
      sx: {
        fontSize: 18
      }
    });
    $[10] = t6;
  } else {
    t6 = $[10];
  }
  let t7;
  if ($[11] !== attributes || $[12] !== listeners || $[13] !== t5) {
    t7 = /*#__PURE__*/_jsx(Box, {
      ...attributes,
      ...listeners,
      onClick: _temp,
      "aria-label": "Drag to reorder",
      sx: t5,
      children: t6
    });
    $[11] = attributes;
    $[12] = listeners;
    $[13] = t5;
    $[14] = t7;
  } else {
    t7 = $[14];
  }
  let t8;
  if ($[15] !== children || $[16] !== onClick || $[17] !== setNodeRef || $[18] !== t2 || $[19] !== t7) {
    t8 = /*#__PURE__*/_jsxs(Stack, {
      ref: setNodeRef,
      direction: "row",
      onClick: onClick,
      sx: t2,
      children: [t7, children]
    });
    $[15] = children;
    $[16] = onClick;
    $[17] = setNodeRef;
    $[18] = t2;
    $[19] = t7;
    $[20] = t8;
  } else {
    t8 = $[20];
  }
  return t8;
}
function _temp(e) {
  return e.stopPropagation();
}