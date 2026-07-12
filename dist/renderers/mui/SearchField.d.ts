import { type TextFieldProps } from '@mui/material';
export interface DataTableSearchFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
    placeholder?: string;
}
export declare function DataTableSearchField({ placeholder, ...rest }: DataTableSearchFieldProps): import("react").JSX.Element;
//# sourceMappingURL=SearchField.d.ts.map