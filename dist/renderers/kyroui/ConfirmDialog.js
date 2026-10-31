import { c as _c } from "react/compiler-runtime";
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@kyrobit/kyroui';
import { CloseIcon } from './icons.js';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ConfirmDialog(t0) {
  const $ = _c(34);
  const {
    open,
    title,
    description,
    confirmLabel: t1,
    cancelLabel: t2,
    confirmColor: t3,
    onConfirm,
    onCancel,
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
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t6 = {
      flex: 1
    };
    $[2] = t6;
  } else {
    t6 = $[2];
  }
  let t7;
  if ($[3] !== title) {
    t7 = /*#__PURE__*/_jsx("span", {
      style: t6,
      children: title
    });
    $[3] = title;
    $[4] = t7;
  } else {
    t7 = $[4];
  }
  let t8;
  if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
    t8 = /*#__PURE__*/_jsx(CloseIcon, {
      fontSize: "small"
    });
    $[5] = t8;
  } else {
    t8 = $[5];
  }
  let t9;
  if ($[6] !== busy || $[7] !== onCancel) {
    t9 = /*#__PURE__*/_jsx(IconButton, {
      size: "small",
      onClick: onCancel,
      disabled: busy,
      "aria-label": "Close",
      children: t8
    });
    $[6] = busy;
    $[7] = onCancel;
    $[8] = t9;
  } else {
    t9 = $[8];
  }
  let t10;
  if ($[9] !== t7 || $[10] !== t9) {
    t10 = /*#__PURE__*/_jsx(DialogTitle, {
      children: /*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        spacing: "lg",
        alignItems: "center",
        children: [t7, t9]
      })
    });
    $[9] = t7;
    $[10] = t9;
    $[11] = t10;
  } else {
    t10 = $[11];
  }
  let t11;
  if ($[12] !== description) {
    t11 = description && /*#__PURE__*/_jsx(DialogContent, {
      children: /*#__PURE__*/_jsx(Typography, {
        sx: {
          color: "text.secondary"
        },
        children: description
      })
    });
    $[12] = description;
    $[13] = t11;
  } else {
    t11 = $[13];
  }
  let t12;
  if ($[14] !== busy || $[15] !== cancelLabel || $[16] !== onCancel) {
    t12 = /*#__PURE__*/_jsx(Button, {
      variant: "text",
      onClick: onCancel,
      disabled: busy,
      children: cancelLabel
    });
    $[14] = busy;
    $[15] = cancelLabel;
    $[16] = onCancel;
    $[17] = t12;
  } else {
    t12 = $[17];
  }
  const t13 = confirmColor === "error" ? "error" : "primary";
  let t14;
  if ($[18] !== busy || $[19] !== confirm || $[20] !== confirmLabel || $[21] !== t13) {
    t14 = /*#__PURE__*/_jsx(Button, {
      variant: "contained",
      color: t13,
      loading: busy,
      onClick: confirm,
      children: confirmLabel
    });
    $[18] = busy;
    $[19] = confirm;
    $[20] = confirmLabel;
    $[21] = t13;
    $[22] = t14;
  } else {
    t14 = $[22];
  }
  let t15;
  if ($[23] !== t12 || $[24] !== t14) {
    t15 = /*#__PURE__*/_jsxs(DialogActions, {
      children: [t12, t14]
    });
    $[23] = t12;
    $[24] = t14;
    $[25] = t15;
  } else {
    t15 = $[25];
  }
  let t16;
  if ($[26] !== fullWidth || $[27] !== maxWidth || $[28] !== open || $[29] !== t10 || $[30] !== t11 || $[31] !== t15 || $[32] !== t5) {
    t16 = /*#__PURE__*/_jsxs(Dialog, {
      open: open,
      onClose: t5,
      maxWidth: maxWidth,
      fullWidth: fullWidth,
      children: [t10, t11, t15]
    });
    $[26] = fullWidth;
    $[27] = maxWidth;
    $[28] = open;
    $[29] = t10;
    $[30] = t11;
    $[31] = t15;
    $[32] = t5;
    $[33] = t16;
  } else {
    t16 = $[33];
  }
  return t16;
}