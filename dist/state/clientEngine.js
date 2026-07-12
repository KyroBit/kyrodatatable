function searchableFields(columns) {
    return columns.filter((c) => c.searchable !== false).map((c) => c.field);
}
function matchesSearch(row, search, fields) {
    if (!search)
        return true;
    const needle = search.toLowerCase();
    return fields.some((field) => {
        const value = row[field];
        return typeof value === 'string' && value.toLowerCase().includes(needle);
    });
}
function sortRows(rows, sort) {
    if (!sort)
        return rows;
    const { field, direction } = sort;
    const dir = direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (av === bv)
            return 0;
        return av > bv ? dir : -dir;
    });
}
function paginate(rows, page, pageSize) {
    const total = rows.length;
    const start = (page - 1) * pageSize;
    return { rows: rows.slice(start, start + pageSize), total };
}
/** Builds fetchRecords/fetchGroups equivalents that run entirely in memory against `data` — the client-mode counterpart to the server-side functions you'd otherwise write by hand. */
export function createClientEngine({ data, columns, applyFilters, groupField, }) {
    const fields = searchableFields(columns);
    function filtered(params) {
        let rows = data;
        if (params.groupKey !== undefined && groupField) {
            rows = rows.filter((row) => String(groupField(row)) === params.groupKey);
        }
        rows = rows.filter((row) => matchesSearch(row, params.search, fields));
        if (applyFilters && params.filters !== undefined) {
            rows = rows.filter((row) => applyFilters(row, params.filters));
        }
        return rows;
    }
    async function fetchRecords(params) {
        return paginate(sortRows(filtered(params), params.sort), params.page, params.pageSize);
    }
    async function fetchGroups(params) {
        if (!groupField || !params.groupBy)
            return { total: 0, groups: [] };
        const rows = data.filter((row) => matchesSearch(row, params.search, fields));
        const buckets = new Map();
        for (const row of rows) {
            const key = String(groupField(row));
            buckets.set(key, (buckets.get(key) ?? 0) + 1);
        }
        const groups = [...buckets.entries()].map(([key, count]) => ({
            key, field: params.groupBy, label: key, count,
        }));
        return { total: rows.length, groups };
    }
    return { fetchRecords, fetchGroups };
}
