import { c as _c } from "react/compiler-runtime";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Stack } from '@kyrobit/kyroui';
import { DragIcon } from './icons.js';
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
  const $ = _c(31);
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
  if ($[2] !== transform) {
    t2 = CSS.Transform.toString(transform);
    $[2] = transform;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  const t3 = isDragging ? 1 : undefined;
  let t4;
  if ($[4] !== t2 || $[5] !== t3 || $[6] !== transition) {
    t4 = {
      transform: t2,
      transition,
      position: "relative",
      zIndex: t3
    };
    $[4] = t2;
    $[5] = t3;
    $[6] = transition;
    $[7] = t4;
  } else {
    t4 = $[7];
  }
  const t5 = onClick ? "pointer" : undefined;
  const t6 = isDragging ? "grey.50" : undefined;
  const t7 = isDragging ? 3 : undefined;
  let t8;
  if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = {
      bgcolor: "grey.50"
    };
    $[8] = t8;
  } else {
    t8 = $[8];
  }
  let t9;
  if ($[9] !== t5 || $[10] !== t6 || $[11] !== t7) {
    t9 = {
      gap: "sm",
      px: "sm",
      py: "md",
      borderRadius: "md",
      cursor: t5,
      bgcolor: t6,
      boxShadow: t7,
      "&:hover": t8
    };
    $[9] = t5;
    $[10] = t6;
    $[11] = t7;
    $[12] = t9;
  } else {
    t9 = $[12];
  }
  const t10 = isDragging ? "grabbing" : "grab";
  let t11;
  let t12;
  if ($[13] === Symbol.for("react.memo_cache_sentinel")) {
    t11 = {
      color: "text.disabled"
    };
    t12 = {
      color: "text.secondary"
    };
    $[13] = t11;
    $[14] = t12;
  } else {
    t11 = $[13];
    t12 = $[14];
  }
  let t13;
  if ($[15] !== t10) {
    t13 = {
      display: "flex",
      alignItems: "center",
      cursor: t10,
      touchAction: "none",
      "&": t11,
      "&:hover": t12
    };
    $[15] = t10;
    $[16] = t13;
  } else {
    t13 = $[16];
  }
  let t14;
  if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
    t14 = /*#__PURE__*/_jsx(DragIcon, {
      fontSize: "small"
    });
    $[17] = t14;
  } else {
    t14 = $[17];
  }
  let t15;
  if ($[18] !== attributes || $[19] !== listeners || $[20] !== t13) {
    t15 = /*#__PURE__*/_jsx(Box, {
      ...attributes,
      ...listeners,
      onClick: _temp,
      "aria-label": "Drag to reorder",
      sx: t13,
      children: t14
    });
    $[18] = attributes;
    $[19] = listeners;
    $[20] = t13;
    $[21] = t15;
  } else {
    t15 = $[21];
  }
  let t16;
  if ($[22] !== children || $[23] !== onClick || $[24] !== t15 || $[25] !== t9) {
    t16 = /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      alignItems: "center",
      onClick: onClick,
      sx: t9,
      children: [t15, children]
    });
    $[22] = children;
    $[23] = onClick;
    $[24] = t15;
    $[25] = t9;
    $[26] = t16;
  } else {
    t16 = $[26];
  }
  let t17;
  if ($[27] !== setNodeRef || $[28] !== t16 || $[29] !== t4) {
    t17 = /*#__PURE__*/_jsx("div", {
      ref: setNodeRef,
      style: t4,
      children: t16
    });
    $[27] = setNodeRef;
    $[28] = t16;
    $[29] = t4;
    $[30] = t17;
  } else {
    t17 = $[30];
  }
  return t17;
}
function _temp(e) {
  return e.stopPropagation();
}