function isDateRange(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
function fieldValuesEqual(a, b) {
    if (Array.isArray(a) || Array.isArray(b)) {
        const av = Array.isArray(a) ? a : [];
        const bv = Array.isArray(b) ? b : [];
        return av.length === bv.length && av.every((v) => bv.includes(v));
    }
    if (isDateRange(a) || isDateRange(b)) {
        const ar = isDateRange(a) ? a : {};
        const br = isDateRange(b) ? b : {};
        return (ar.from ?? '') === (br.from ?? '') && (ar.to ?? '') === (br.to ?? '');
    }
    return (a ?? '') === (b ?? '');
}
export function filterValuesEqual(a, b) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys)
        if (!fieldValuesEqual(a[key], b[key]))
            return false;
    return true;
}
export function isFilterFieldActive(value) {
    if (Array.isArray(value))
        return value.length > 0;
    if (isDateRange(value))
        return Boolean(value.from || value.to);
    return Boolean(value);
}
export function countFilterValues(filters) {
    return Object.values(filters).reduce((n, value) => {
        if (Array.isArray(value))
            return n + value.length;
        return n + (isFilterFieldActive(value) ? 1 : 0);
    }, 0);
}
function describeFilterValue(value, column) {
    if (column.type === 'select') {
        const values = Array.isArray(value) ? value : [];
        const options = Array.isArray(column.options) ? column.options : [];
        return values.map((v) => options.find((o) => o.value === v)?.label ?? v).join(', ');
    }
    if (column.type === 'date') {
        const range = isDateRange(value) ? value : {};
        if (range.from && range.to)
            return `${range.from} – ${range.to}`;
        return range.from || range.to || '';
    }
    return typeof value === 'string' ? value : '';
}
export function summarizeFilterValues(filters, columns) {
    const parts = columns
        .filter((c) => isFilterFieldActive(filters[c.field]))
        .map((c) => `${c.label}: ${describeFilterValue(filters[c.field], c)}`);
    return parts.length ? parts.join(' · ') : 'No filters';
}
/** Narrows a field's value for a `select` column — the shape a `fetchRecords` call typically needs. */
export function asSelectValues(value) {
    return Array.isArray(value) ? value : [];
}
/** Narrows a field's value for a `text` column. */
export function asTextValue(value) {
    return typeof value === 'string' ? value : '';
}
/** Narrows a field's value for a `date` column. */
export function asDateRange(value) {
    return isDateRange(value) ? value : {};
}
