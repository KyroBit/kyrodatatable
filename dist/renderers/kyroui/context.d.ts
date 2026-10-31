import { type ReactNode } from 'react';
import type { DataTableApi } from '@kyrobit/datatable';
export interface DataTableRootProps<Row, Field extends string, Filters> {
    api: DataTableApi<Row, Field, Filters>;
    children: ReactNode;
}
/** Makes `api` available to every other piece below it — `<SearchField/>`, `<Body/>`, `<Pagination/>` — without threading it through each one by hand. */
export declare function DataTableRoot<Row, Field extends string, Filters>({ api, children }: DataTableRootProps<Row, Field, Filters>): import("react").JSX.Element;
export declare function useDataTableContext<Row, Field extends string = string, Filters = undefined>(): DataTableApi<Row, Field, Filters>;
//# sourceMappingURL=context.d.ts.map