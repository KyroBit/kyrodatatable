import { c as _c } from "react/compiler-runtime";
import { TablePagination } from '@mui/material';
import { useDataTableContext } from './context.js';
import { jsx as _jsx } from "react/jsx-runtime";
export function DataTablePagination(t0) {
  const $ = _c(15);
  const {
    rowsPerPageOptions: t1
  } = t0;
  let t2;
  if ($[0] !== t1) {
    t2 = t1 === undefined ? [] : t1;
    $[0] = t1;
    $[1] = t2;
  } else {
    t2 = $[1];
  }
  const rowsPerPageOptions = t2;
  const api = useDataTableContext();
  const count = api.groupBy.length > 0 ? api.groupsTotal : api.total;
  const t3 = api.pagination.page - 1;
  let t4;
  let t5;
  if ($[2] !== api) {
    t4 = (_, page) => api.setPage(page + 1);
    t5 = e => api.setPageSize(Number(e.target.value));
    $[2] = api;
    $[3] = t4;
    $[4] = t5;
  } else {
    t4 = $[3];
    t5 = $[4];
  }
  const t6 = count === 0 ? "hidden" : undefined;
  let t7;
  if ($[5] !== t6) {
    t7 = {
      visibility: t6
    };
    $[5] = t6;
    $[6] = t7;
  } else {
    t7 = $[6];
  }
  let t8;
  if ($[7] !== api.pagination.pageSize || $[8] !== count || $[9] !== rowsPerPageOptions || $[10] !== t3 || $[11] !== t4 || $[12] !== t5 || $[13] !== t7) {
    t8 = /*#__PURE__*/_jsx(TablePagination, {
      component: "div",
      rowsPerPageOptions: rowsPerPageOptions,
      count: count,
      page: t3,
      rowsPerPage: api.pagination.pageSize,
      onPageChange: t4,
      onRowsPerPageChange: t5,
      labelDisplayedRows: _temp,
      sx: t7
    });
    $[7] = api.pagination.pageSize;
    $[8] = count;
    $[9] = rowsPerPageOptions;
    $[10] = t3;
    $[11] = t4;
    $[12] = t5;
    $[13] = t7;
    $[14] = t8;
  } else {
    t8 = $[14];
  }
  return t8;
}
function _temp(t0) {
  const {
    from,
    to,
    count: count_0
  } = t0;
  return `${from}–${to} of ${count_0}`;
}