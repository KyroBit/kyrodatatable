import { type ReactNode } from 'react';
import type { PresetsApi } from '../../state/usePresets.js';
export interface FavoritesMenuProps<Filters> {
    presets: PresetsApi<Filters>;
    activeId: string | null;
    currentFilters: Filters;
    filterEditor: (value: Filters, onChange: (next: Filters) => void) => ReactNode;
    summarize: (filters: Filters) => string;
    onApply: (filters: Filters) => void;
    label?: string;
}
export declare function FavoritesMenu<Filters>({ presets, activeId, currentFilters, filterEditor, summarize, onApply, label, }: FavoritesMenuProps<Filters>): import("react").JSX.Element;
//# sourceMappingURL=FavoritesMenu.d.ts.map