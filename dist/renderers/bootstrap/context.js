import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
const DataTableContext = createContext(null);
export function DataTableRoot({ api, children }) {
    return (_jsx(DataTableContext.Provider, { value: api, children: children }));
}
export function useDataTableContext() {
    const api = useContext(DataTableContext);
    if (!api) {
        throw new Error('KyroDataTable: this component must be rendered inside <DataTable.Root api={table}> (or <DataTable api={table}/>).');
    }
    return api;
}
