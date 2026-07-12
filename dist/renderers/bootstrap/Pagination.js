import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useDataTableContext } from './context.js';
/** Hidden automatically while grouped — pagination happens per-group there instead (`api.setGroupPage`). */
export function DataTablePagination() {
    const api = useDataTableContext();
    if (api.groupBy)
        return null;
    const totalPages = Math.max(1, Math.ceil(api.total / api.pagination.pageSize));
    return (_jsxs("div", { className: "d-flex justify-content-between align-items-center flex-wrap gap-2", children: [_jsx("select", { className: "form-select form-select-sm", style: { width: 'auto' }, value: api.pagination.pageSize, onChange: (e) => api.setPageSize(Number(e.target.value)), children: [10, 25, 50, 100].map((n) => _jsxs("option", { value: n, children: [n, " / page"] }, n)) }), _jsx("nav", { children: _jsxs("ul", { className: "pagination pagination-sm mb-0", children: [_jsx("li", { className: `page-item ${api.pagination.page <= 1 ? 'disabled' : ''}`, children: _jsx("button", { type: "button", className: "page-link", onClick: () => api.setPage(api.pagination.page - 1), children: "Previous" }) }), _jsx("li", { className: "page-item disabled", children: _jsxs("span", { className: "page-link", children: ["Page ", api.pagination.page, " of ", totalPages] }) }), _jsx("li", { className: `page-item ${api.pagination.page >= totalPages ? 'disabled' : ''}`, children: _jsx("button", { type: "button", className: "page-link", onClick: () => api.setPage(api.pagination.page + 1), children: "Next" }) })] }) })] }));
}
