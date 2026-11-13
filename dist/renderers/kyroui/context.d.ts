import { type ReactNode } from 'react';
import type { DataTableApi } from '@kyrobit/datatable';
export type SelectMode = [on: boolean, setOn: (on: boolean) => void];
export interface Trail {
    key: string;
    ids: string[];
}
export type DrillTrail = [trail: Trail, setTrail: (trail: Trail) => void];
export interface DataTableRootProps<Row, Field extends string, Filters> {
    api: DataTableApi<Row, Field, Filters>;
    selectMode?: SelectMode;
    drill?: DrillTrail;
    children: ReactNode;
}
/** Makes `api` available to every other piece below it — `<SearchField/>`, `<Body/>`, `<Pagination/>` — without threading it through each one by hand. */
export declare function DataTableRoot<Row, Field extends string, Filters>({ api, selectMode, drill, children }: DataTableRootProps<Row, Field, Filters>): import("react").JSX.Element;
export declare function useDataTableContext<Row, Field extends string = string, Filters = undefined>(): DataTableApi<Row, Field, Filters>;
export declare const useSelectMode: () => SelectMode;
export declare const useDrillTrail: () => DrillTrail;
//# sourceMappingURL=context.d.ts.map