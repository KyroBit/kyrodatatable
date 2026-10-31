import { c as _c } from "react/compiler-runtime";
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
  const t5 = busy ? undefined : onCancel;
  let t6;
  let t7;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = {
      alignItems: "center"
    };
    t7 = {
      flex: 1
    };
    $[2] = t6;
    $[3] = t7;
  } else {
    t6 = $[2];
    t7 = $[3];
  }
  let t8;
  if ($[4] !== title) {
    t8 = /*#__PURE__*/_jsx("span", {
      style: t7,
      children: title
    });
    $[4] = title;
    $[5] = t8;
  } else {
    t8 = $[5];
  }
  let t9;
  if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
    t9 = /*#__PURE__*/_jsx(CloseRoundedIcon, {
      fontSize: "small"
    });
    $[6] = t9;
  } else {
    t9 = $[6];
  }
  let t10;
  if ($[7] !== busy || $[8] !== onCancel) {
    t10 = /*#__PURE__*/_jsx(IconButton, {
      size: "small",
      edge: "end",
      onClick: onCancel,
      disabled: busy,
      "aria-label": "Close",
      children: t9
    });
    $[7] = busy;
    $[8] = onCancel;
    $[9] = t10;
  } else {
    t10 = $[9];
  }
  let t11;
  if ($[10] !== t10 || $[11] !== t8) {
    t11 = /*#__PURE__*/_jsx(DialogTitle, {
      children: /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        spacing: 2,
        sx: t6,
        children: [t8, t10]
      })
    });
    $[10] = t10;
    $[11] = t8;
    $[12] = t11;
  } else {
    t11 = $[12];
  }
  let t12;
  if ($[13] !== description) {
    t12 = description && /*#__PURE__*/_jsx(DialogContent, {
      children: /*#__PURE__*/_jsx(DialogContentText, {
        children: description
      })
    });
    $[13] = description;
    $[14] = t12;
  } else {
    t12 = $[14];
  }
  let t13;
  if ($[15] !== busy || $[16] !== cancelLabel || $[17] !== onCancel) {
    t13 = /*#__PURE__*/_jsx(Button, {
      color: "inherit",
      onClick: onCancel,
      disabled: busy,
      children: cancelLabel
    });
    $[15] = busy;
    $[16] = cancelLabel;
    $[17] = onCancel;
    $[18] = t13;
  } else {
    t13 = $[18];
  }
  let t14;
  if ($[19] !== busy || $[20] !== confirm || $[21] !== confirmColor || $[22] !== confirmLabel) {
    t14 = /*#__PURE__*/_jsx(Button, {
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
    $[23] = t14;
  } else {
    t14 = $[23];
  }
  let t15;
  if ($[24] !== t13 || $[25] !== t14) {
    t15 = /*#__PURE__*/_jsxs(DialogActions, {
      children: [t13, t14]
    });
    $[24] = t13;
    $[25] = t14;
    $[26] = t15;
  } else {
    t15 = $[26];
  }
  let t16;
  if ($[27] !== fullWidth || $[28] !== maxWidth || $[29] !== open || $[30] !== slotProps || $[31] !== t11 || $[32] !== t12 || $[33] !== t15 || $[34] !== t5) {
    t16 = /*#__PURE__*/_jsxs(Dialog, {
      open: open,
      onClose: t5,
      slotProps: slotProps,
      maxWidth: maxWidth,
      fullWidth: fullWidth,
      children: [t11, t12, t15]
    });
    $[27] = fullWidth;
    $[28] = maxWidth;
    $[29] = open;
    $[30] = slotProps;
    $[31] = t11;
    $[32] = t12;
    $[33] = t15;
    $[34] = t5;
    $[35] = t16;
  } else {
    t16 = $[35];
  }
  return t16;
}