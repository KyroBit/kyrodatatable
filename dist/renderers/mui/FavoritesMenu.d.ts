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
    /** Override the button's leading icon (defaults to a star). */
    icon?: ReactNode;
    /** Trailing icon for the button (e.g. a chevron). */
    endIcon?: ReactNode;
}
export declare function FavoritesMenu<Filters>({ presets, activeId, currentFilters, filterEditor, summarize, onApply, label, icon, endIcon, }: FavoritesMenuProps<Filters>): import("react").JSX.Element;
//# sourceMappingURL=FavoritesMenu.d.ts.map