import { c as _c } from "react/compiler-runtime";
import { createContext, useContext, useState } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
const DataTableContext = /*#__PURE__*/createContext(null);
const SelectModeContext = /*#__PURE__*/createContext([false, () => {}]);
const DrillContext = /*#__PURE__*/createContext([{
  key: '',
  ids: []
}, () => {}]);
/** Makes `api` available to every other piece below it — `<SearchField/>`, `<Body/>`, `<Pagination/>` — without threading it through each one by hand. */
export function DataTableRoot(t0) {
  const $ = _c(10);
  const {
    api,
    selectMode,
    drill,
    children
  } = t0;
  const own = useState(false);
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = {
      key: "",
      ids: []
    };
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  const ownDrill = useState(t1);
  const t2 = api;
  const t3 = selectMode ?? own;
  const t4 = drill ?? ownDrill;
  let t5;
  if ($[1] !== children || $[2] !== t4) {
    t5 = /*#__PURE__*/_jsx(DrillContext.Provider, {
      value: t4,
      children: children
    });
    $[1] = children;
    $[2] = t4;
    $[3] = t5;
  } else {
    t5 = $[3];
  }
  let t6;
  if ($[4] !== t3 || $[5] !== t5) {
    t6 = /*#__PURE__*/_jsx(SelectModeContext.Provider, {
      value: t3,
      children: t5
    });
    $[4] = t3;
    $[5] = t5;
    $[6] = t6;
  } else {
    t6 = $[6];
  }
  let t7;
  if ($[7] !== t2 || $[8] !== t6) {
    t7 = /*#__PURE__*/_jsx(DataTableContext.Provider, {
      value: t2,
      children: t6
    });
    $[7] = t2;
    $[8] = t6;
    $[9] = t7;
  } else {
    t7 = $[9];
  }
  return t7;
}
export function useDataTableContext() {
  const api = useContext(DataTableContext);
  if (!api) {
    throw new Error("KyroDataTable: this component must be rendered inside <DataTable.Root api={table}> (or <DataTable api={table}/>).");
  }
  return api;
}
export const useSelectMode = () => {
  return useContext(SelectModeContext);
};
export const useDrillTrail = () => {
  return useContext(DrillContext);
};