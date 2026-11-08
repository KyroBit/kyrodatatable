import { c as _c } from "react/compiler-runtime";
import { TablePagination } from '@kyrobit/kyroui';
import { useDataTableContext } from './context.js';
import { jsx as _jsx } from "react/jsx-runtime";
export function DataTablePagination(t0) {
  const $ = _c(21);
  const {
    rowsPerPageOptions: t1,
    groupsPerPageOptions: t2
  } = t0;
  let t3;
  if ($[0] !== t1) {
    t3 = t1 === undefined ? [] : t1;
    $[0] = t1;
    $[1] = t3;
  } else {
    t3 = $[1];
  }
  const rowsPerPageOptions = t3;
  let t4;
  if ($[2] !== t2) {
    t4 = t2 === undefined ? [] : t2;
    $[2] = t2;
    $[3] = t4;
  } else {
    t4 = $[3];
  }
  const groupsPerPageOptions = t4;
  const api = useDataTableContext();
  const grouped = api.groupBy.length > 0;
  const count = grouped ? api.groupsTotal : api.total;
  const t5 = grouped ? groupsPerPageOptions : rowsPerPageOptions;
  const t6 = grouped ? "Groups per page:" : "Rows per page:";
  const t7 = api.pagination.page - 1;
  const t8 = grouped ? api.groupPageSize : api.pagination.pageSize;
  let t9;
  if ($[4] !== api) {
    t9 = (_, page) => api.setPage(page + 1);
    $[4] = api;
    $[5] = t9;
  } else {
    t9 = $[5];
  }
  let t10;
  if ($[6] !== api.setGroupPageSize || $[7] !== api.setPageSize || $[8] !== grouped) {
    t10 = event => (grouped ? api.setGroupPageSize : api.setPageSize)(Number(event.target.value));
    $[6] = api.setGroupPageSize;
    $[7] = api.setPageSize;
    $[8] = grouped;
    $[9] = t10;
  } else {
    t10 = $[9];
  }
  const t11 = count === 0 ? "hidden" : undefined;
  let t12;
  if ($[10] !== t11) {
    t12 = {
      flex: 1,
      visibility: t11
    };
    $[10] = t11;
    $[11] = t12;
  } else {
    t12 = $[11];
  }
  let t13;
  if ($[12] !== count || $[13] !== t10 || $[14] !== t12 || $[15] !== t5 || $[16] !== t6 || $[17] !== t7 || $[18] !== t8 || $[19] !== t9) {
    t13 = /*#__PURE__*/_jsx(TablePagination, {
      rowsPerPageOptions: t5,
      labelRowsPerPage: t6,
      count: count,
      page: t7,
      rowsPerPage: t8,
      onPageChange: t9,
      onRowsPerPageChange: t10,
      labelDisplayedRows: _temp,
      sx: t12
    });
    $[12] = count;
    $[13] = t10;
    $[14] = t12;
    $[15] = t5;
    $[16] = t6;
    $[17] = t7;
    $[18] = t8;
    $[19] = t9;
    $[20] = t13;
  } else {
    t13 = $[20];
  }
  return t13;
}
function _temp(t0) {
  const {
    from,
    to,
    count: count_0
  } = t0;
  return `${from}–${to} of ${count_0}`;
}