import { c as _c } from "react/compiler-runtime";
import { useTheme } from '@kyrobit/kyroui';
export function useDialogSize() {
  const $ = _c(3);
  const defaults = useTheme().components.Dialog?.defaultProps;
  const t0 = defaults?.fullWidth ?? true;
  const t1 = defaults?.maxWidth ?? "xs";
  let t2;
  if ($[0] !== t0 || $[1] !== t1) {
    t2 = {
      fullWidth: t0,
      maxWidth: t1
    };
    $[0] = t0;
    $[1] = t1;
    $[2] = t2;
  } else {
    t2 = $[2];
  }
  return t2;
}