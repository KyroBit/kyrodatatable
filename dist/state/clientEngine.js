function searchableFields(columns) {
  return columns.filter(c => c.searchable !== false).map(c => c.field);
}
function matchesSearch(row, search, fields) {
  if (!search) return true;
  const needle = search.toLowerCase();
  return fields.some(field => {
    const value = row[field];
    return typeof value === 'string' && value.toLowerCase().includes(needle);
  });
}
function sortRows(rows, sort) {
  if (!sort) return rows;
  const {
    field,
    direction
  } = sort;
  const dir = direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av === bv) return 0;
    return av > bv ? dir : -dir;
  });
}
function paginate(rows, page, pageSize) {
  const total = rows.length;
  const start = (page - 1) * pageSize;
  return {
    rows: rows.slice(start, start + pageSize),
    total
  };
}
const valueOf = (row, field) => String(row[field]);
export function createClientEngine({
  data,
  columns,
  applyFilters
}) {
  const fields = searchableFields(columns);
  function filtered(params) {
    const path = params.groupPath ?? [];
    return data.filter(row => path.every(entry => valueOf(row, entry.field) === entry.key) && matchesSearch(row, params.search, fields) && (!applyFilters || params.filters === undefined || applyFilters(row, params.filters)));
  }
  async function fetchRecords(params) {
    return paginate(sortRows(filtered(params), params.sort), params.page, params.pageSize);
  }
  async function fetchGroups(params) {
    const field = params.groupBy;
    if (!field) return {
      total: 0,
      groups: []
    };
    const rows = filtered(params);
    const buckets = new Map();
    for (const row of rows) {
      const key = valueOf(row, field);
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    const groups = [...buckets.entries()].map(([key, count]) => ({
      key,
      field,
      label: key,
      count
    }));
    return {
      total: rows.length,
      groups
    };
  }
  return {
    fetchRecords,
    fetchGroups
  };
}