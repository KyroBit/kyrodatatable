import { c as _c } from "react/compiler-runtime";
import { useState } from 'react';
import { Button, FormDialog, Typography } from '@kyrobit/kyroui';
import { useDialogSize } from './dialogSize.js';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
export function ConfirmDialog(t0) {
  const $ = _c(24);
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
  const size = useDialogSize();
  const t5 = busy ? _temp : onCancel;
  const t6 = maxWidth ?? size.maxWidth;
  const t7 = fullWidth ?? size.fullWidth;
  let t8;
  if ($[2] !== busy || $[3] !== cancelLabel || $[4] !== onCancel) {
    t8 = /*#__PURE__*/_jsx(Button, {
      variant: "text",
      onClick: onCancel,
      disabled: busy,
      children: cancelLabel
    });
    $[2] = busy;
    $[3] = cancelLabel;
    $[4] = onCancel;
    $[5] = t8;
  } else {
    t8 = $[5];
  }
  const t9 = confirmColor === "error" ? "error" : "primary";
  let t10;
  if ($[6] !== busy || $[7] !== confirm || $[8] !== confirmLabel || $[9] !== t9) {
    t10 = /*#__PURE__*/_jsx(Button, {
      variant: "contained",
      color: t9,
      loading: busy,
      onClick: confirm,
      children: confirmLabel
    });
    $[6] = busy;
    $[7] = confirm;
    $[8] = confirmLabel;
    $[9] = t9;
    $[10] = t10;
  } else {
    t10 = $[10];
  }
  let t11;
  if ($[11] !== t10 || $[12] !== t8) {
    t11 = /*#__PURE__*/_jsxs(_Fragment, {
      children: [t8, t10]
    });
    $[11] = t10;
    $[12] = t8;
    $[13] = t11;
  } else {
    t11 = $[13];
  }
  let t12;
  if ($[14] !== description) {
    t12 = description && /*#__PURE__*/_jsx(Typography, {
      sx: {
        color: "text.secondary"
      },
      children: description
    });
    $[14] = description;
    $[15] = t12;
  } else {
    t12 = $[15];
  }
  let t13;
  if ($[16] !== open || $[17] !== t11 || $[18] !== t12 || $[19] !== t5 || $[20] !== t6 || $[21] !== t7 || $[22] !== title) {
    t13 = /*#__PURE__*/_jsx(FormDialog, {
      open: open,
      onClose: t5,
      title: title,
      maxWidth: t6,
      fullWidth: t7,
      actions: t11,
      children: t12
    });
    $[16] = open;
    $[17] = t11;
    $[18] = t12;
    $[19] = t5;
    $[20] = t6;
    $[21] = t7;
    $[22] = title;
    $[23] = t13;
  } else {
    t13 = $[23];
  }
  return t13;
}
function _temp() {}