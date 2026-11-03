import { c as _c } from "react/compiler-runtime";
import { useDialogSize } from './dialogSize.js';
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** A stand-in for `window.confirm()` built from MUI's dialog slots, so it inherits whatever the
 * consumer's theme says a dialog looks like rather than carrying its own opinion. */
export function ConfirmDialog(t0) {
  const $ = _c(36);
  const {
    open,
    title,
    description,
    confirmLabel: t1,
    cancelLabel: t2,
    confirmColor: t3,
    onConfirm,
    onCancel,
    slotProps,
    maxWidth,
    fullWidth
  } = t0;
  const confirmLabel = t1 === undefined ? "Confirm" : t1;
  const cancelLabel = t2 === undefined ? "Cancel" : t2;
  const confirmColor = t3 === undefined ? "primary" : t3;
  const [busy, setBusy] = useState(false);
  let t4;
  if ($[0] !== onConfirm) {
    t4 = async () => {
      setBusy(true);
      await Promise.resolve().then(onConfirm).finally(() => setBusy(false));
    };
    $[0] = onConfirm;
    $[1] = t4;
  } else {
    t4 = $[1];
  }
  const confirm = t4;
  const size = useDialogSize();
  const t5 = busy ? undefined : onCancel;
  const t6 = maxWidth ?? size.maxWidth;
  const t7 = fullWidth ?? size.fullWidth;
  let t8;
  let t9;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = {
      alignItems: "center"
    };
    t9 = {
      flex: 1
    };
    $[2] = t8;
    $[3] = t9;
  } else {
    t8 = $[2];
    t9 = $[3];
  }
  let t10;
  if ($[4] !== title) {
    t10 = /*#__PURE__*/_jsx("span", {
      style: t9,
      children: title
    });
    $[4] = title;
    $[5] = t10;
  } else {
    t10 = $[5];
  }
  let t11;
  if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
    t11 = /*#__PURE__*/_jsx(CloseRoundedIcon, {
      fontSize: "small"
    });
    $[6] = t11;
  } else {
    t11 = $[6];
  }
  let t12;
  if ($[7] !== busy || $[8] !== onCancel) {
    t12 = /*#__PURE__*/_jsx(IconButton, {
      size: "small",
      edge: "end",
      onClick: onCancel,
      disabled: busy,
      "aria-label": "Close",
      children: t11
    });
    $[7] = busy;
    $[8] = onCancel;
    $[9] = t12;
  } else {
    t12 = $[9];
  }
  let t13;
  if ($[10] !== t10 || $[11] !== t12) {
    t13 = /*#__PURE__*/_jsx(DialogTitle, {
      children: /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        spacing: 2,
        sx: t8,
        children: [t10, t12]
      })
    });
    $[10] = t10;
    $[11] = t12;
    $[12] = t13;
  } else {
    t13 = $[12];
  }
  let t14;
  if ($[13] !== description) {
    t14 = description && /*#__PURE__*/_jsx(DialogContent, {
      children: /*#__PURE__*/_jsx(DialogContentText, {
        children: description
      })
    });
    $[13] = description;
    $[14] = t14;
  } else {
    t14 = $[14];
  }
  let t15;
  if ($[15] !== busy || $[16] !== cancelLabel || $[17] !== onCancel) {
    t15 = /*#__PURE__*/_jsx(Button, {
      color: "inherit",
      onClick: onCancel,
      disabled: busy,
      children: cancelLabel
    });
    $[15] = busy;
    $[16] = cancelLabel;
    $[17] = onCancel;
    $[18] = t15;
  } else {
    t15 = $[18];
  }
  let t16;
  if ($[19] !== busy || $[20] !== confirm || $[21] !== confirmColor || $[22] !== confirmLabel) {
    t16 = /*#__PURE__*/_jsx(Button, {
      variant: "contained",
      color: confirmColor,
      loading: busy,
      onClick: confirm,
      children: confirmLabel
    });
    $[19] = busy;
    $[20] = confirm;
    $[21] = confirmColor;
    $[22] = confirmLabel;
    $[23] = t16;
  } else {
    t16 = $[23];
  }
  let t17;
  if ($[24] !== t15 || $[25] !== t16) {
    t17 = /*#__PURE__*/_jsxs(DialogActions, {
      children: [t15, t16]
    });
    $[24] = t15;
    $[25] = t16;
    $[26] = t17;
  } else {
    t17 = $[26];
  }
  let t18;
  if ($[27] !== open || $[28] !== slotProps || $[29] !== t13 || $[30] !== t14 || $[31] !== t17 || $[32] !== t5 || $[33] !== t6 || $[34] !== t7) {
    t18 = /*#__PURE__*/_jsxs(Dialog, {
      open: open,
      onClose: t5,
      slotProps: slotProps,
      maxWidth: t6,
      fullWidth: t7,
      children: [t13, t14, t17]
    });
    $[27] = open;
    $[28] = slotProps;
    $[29] = t13;
    $[30] = t14;
    $[31] = t17;
    $[32] = t5;
    $[33] = t6;
    $[34] = t7;
    $[35] = t18;
  } else {
    t18 = $[35];
  }
  return t18;
}