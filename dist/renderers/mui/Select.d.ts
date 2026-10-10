import { type ReactNode, type Ref } from 'react';
import { type SxProps, type Theme } from '@mui/material';
export interface SelectOption {
    id: string;
}
interface SelectBaseProps<T extends SelectOption> {
    onBlur?: () => void;
    inputRef?: Ref<HTMLInputElement>;
    options?: T[];
    search?: (query: string) => Promise<T[]>;
    fetchPage?: (params: {
        query: string;
        page: number;
    }) => Promise<{
        rows: T[];
        hasMore: boolean;
    }>;
    getOptionLabel: (option: T) => string;
    getOptionSubLabel?: (option: T) => string | undefined;
    getOptionIcon?: (option: T) => ReactNode;
    label?: string;
    placeholder?: string;
    required?: boolean;
    error?: boolean;
    helperText?: string;
    debounceMs?: number;
    hideSearch?: boolean;
    dense?: boolean;
    onCreate?: (query: string) => Promise<T | null>;
    createLabel?: string;
    sx?: SxProps<Theme>;
    loading?: boolean;
    disabled?: boolean;
    emptyText?: string;
    searchPlaceholder?: string;
}
export type SelectProps<T extends SelectOption> = SelectBaseProps<T> & ({
    multiple?: false;
    value: T | null;
    onChange: (option: T | null) => void;
} | {
    multiple: true;
    value: T[];
    onChange: (options: T[]) => void;
});
export declare function Select<T extends SelectOption>(props: SelectProps<T>): import("react").JSX.Element;
export {};
//# sourceMappingURL=Select.d.ts.map