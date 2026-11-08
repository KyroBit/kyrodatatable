import type { GroupPathEntry, Selection } from '../types/index.js'

const within = <Field extends string>(outer: GroupPathEntry<Field>[], inner: GroupPathEntry<Field>[]) =>
  outer.length <= inner.length && outer.every((entry, i) => entry.field === inner[i]!.field && entry.key === inner[i]!.key)

export function isPathSelected<Field extends string>(selection: Selection<Field>, path: GroupPathEntry<Field>[]): boolean {
  let match: { depth: number; selected: boolean } | undefined
  for (const group of selection.groups) {
    if (within(group.path, path) && group.path.length > (match?.depth ?? 0)) match = { depth: group.path.length, selected: group.selected }
  }
  return match ? match.selected : selection.all
}

export const isRowSelected = <Field extends string>(selection: Selection<Field>, id: string, path: GroupPathEntry<Field>[]) =>
  selection.rows.find((row) => row.id === id)?.selected ?? isPathSelected(selection, path)
