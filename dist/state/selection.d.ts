import type { GroupPathEntry, Selection } from '../types/index.js';
export declare function isPathSelected<Field extends string>(selection: Selection<Field>, path: GroupPathEntry<Field>[]): boolean;
export declare const isRowSelected: <Field extends string>(selection: Selection<Field>, id: string, path: GroupPathEntry<Field>[]) => boolean;
//# sourceMappingURL=selection.d.ts.map