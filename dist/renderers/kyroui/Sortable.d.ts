import type { ReactNode } from 'react';
export declare function SortableList({ ids, onMove, children }: {
    ids: string[];
    onMove: (from: number, to: number) => void;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function SortableRow({ id, children, onClick }: {
    id: string;
    children: ReactNode;
    onClick?: () => void;
}): import("react").JSX.Element;
//# sourceMappingURL=Sortable.d.ts.map