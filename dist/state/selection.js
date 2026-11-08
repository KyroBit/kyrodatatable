const within = (outer, inner) => outer.length <= inner.length && outer.every((entry, i) => entry.field === inner[i].field && entry.key === inner[i].key);
export function isPathSelected(selection, path) {
  let match;
  for (const group of selection.groups) {
    if (within(group.path, path) && group.path.length > (match?.depth ?? 0)) match = {
      depth: group.path.length,
      selected: group.selected
    };
  }
  return match ? match.selected : selection.all;
}
export const isRowSelected = (selection, id, path) => selection.rows.find(row => row.id === id)?.selected ?? isPathSelected(selection, path);