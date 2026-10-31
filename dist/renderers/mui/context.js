import { c as _c } from "react/compiler-runtime";
import { createContext, useContext } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
const DataTableContext = /*#__PURE__*/createContext(null);
/** Makes `api` available to every other piece below it — `<SearchField/>`, `<Body/>`, `<Pagination/>` — without threading it through each one by hand. */
export function DataTableRoot(t0) {
  const $ = _c(3);
  const {
    api,
    children
  } = t0;
  const t1 = api;
  let t2;
  if ($[0] !== children || $[1] !== t1) {
    t2 = /*#__PURE__*/_jsx(DataTableContext.Provider, {
      value: t1,
      children: children
    });
    $[0] = children;
    $[1] = t1;
    $[2] = t2;
  } else {
    t2 = $[2];
  }
  return t2;
}
export function useDataTableContext() {
  const api = useContext(DataTableContext);
  if (!api) {
    throw new Error("KyroDataTable: this component must be rendered inside <DataTable.Root api={table}> (or <DataTable api={table}/>).");
  }
  return api;
}