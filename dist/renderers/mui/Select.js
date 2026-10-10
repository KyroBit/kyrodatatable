import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Box, Button, Chip, CircularProgress, FormHelperText, IconButton, InputAdornment, InputLabel, List, ListItemButton, ListItemText, OutlinedInput, Popover, TextField, Typography, } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { SearchIcon } from './icons.js';
const PANEL_GAP = 8;
const SCREEN_MARGIN = 16;
const PANEL_MAX_HEIGHT = 320;
const PANEL_MIN_HEIGHT = 140;
const SEARCH_BLOCK = 64;
function measurePlacement(trigger) {
    if (!trigger)
        return { below: true, maxHeight: PANEL_MAX_HEIGHT };
    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - PANEL_GAP - SCREEN_MARGIN;
    const spaceAbove = rect.top - PANEL_GAP - SCREEN_MARGIN;
    const below = spaceBelow >= PANEL_MAX_HEIGHT || spaceBelow >= spaceAbove;
    const available = below ? spaceBelow : spaceAbove;
    return { below, maxHeight: Math.max(PANEL_MIN_HEIGHT, Math.min(PANEL_MAX_HEIGHT, available)) };
}
const SelectTrigger = forwardRef(function SelectTrigger({ value, placeholder, error, disabled, startAdornment, endAdornment, onOpen, dense, wrap, inputRef, ...aria }, ref) {
    const handleKeyDown = (event) => {
        if (event.key !== 'Enter' && event.key !== ' ')
            return;
        event.preventDefault();
        onOpen();
    };
    return (_jsx(OutlinedInput, { ref: ref, inputRef: inputRef, className: dense ? 'dense-field' : undefined, fullWidth: true, readOnly: true, error: error, disabled: disabled, value: value, placeholder: placeholder, startAdornment: startAdornment, endAdornment: endAdornment, onClick: disabled ? undefined : onOpen, onKeyDown: disabled ? undefined : handleKeyDown, inputProps: {
            role: 'button',
            ...aria,
            style: { cursor: disabled ? 'default' : 'pointer', caretColor: 'transparent' },
        }, sx: {
            cursor: disabled ? 'default' : 'pointer',
            userSelect: 'none',
            ...(wrap && {
                height: 'auto',
                alignItems: 'center',
                '& .MuiOutlinedInput-input': { flex: '0 0 0px', width: 0, minWidth: 0, p: 0, height: 0 },
            }),
        } }));
});
export function Select(props) {
    const { onBlur, inputRef, options: staticOptions, search, fetchPage, getOptionLabel, getOptionSubLabel, getOptionIcon, label, placeholder = 'Select…', required, error, helperText, debounceMs = 300, hideSearch = false, dense = false, onCreate, createLabel = 'Add', sx, loading = false, disabled = false, emptyText = 'No results found.', searchPlaceholder = 'Search…', } = props;
    const multiple = props.multiple === true;
    const selected = props.multiple
        ? props.value ?? []
        : props.value
            ? [props.value]
            : [];
    const emit = (next) => {
        if (props.multiple)
            props.onChange(next);
        else
            props.onChange(next[0] ?? null);
    };
    const isPaged = typeof fetchPage === 'function';
    const isAsync = typeof search === 'function' || isPaged;
    const showSearch = !hideSearch;
    const triggerRef = useRef(null);
    const searchInputRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [placement, setPlacement] = useState({ below: true, maxHeight: PANEL_MAX_HEIGHT });
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [asyncOptions, setAsyncOptions] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const listRef = useRef(null);
    const inFlight = useRef(false);
    const pageRef = useRef(1);
    const requestToken = useRef(0);
    const open = Boolean(anchorEl);
    useEffect(() => {
        if (!isAsync)
            return;
        const timer = setTimeout(() => setDebouncedQuery(query), debounceMs);
        return () => clearTimeout(timer);
    }, [query, debounceMs, isAsync]);
    useEffect(() => {
        if (!open || !search)
            return;
        let cancelled = false;
        setSearchLoading(true);
        search(debouncedQuery)
            .then((results) => { if (!cancelled)
            setAsyncOptions(results); })
            .finally(() => { if (!cancelled)
            setSearchLoading(false); });
        return () => { cancelled = true; };
    }, [debouncedQuery, open, search]);
    useEffect(() => {
        if (!open || !fetchPage)
            return;
        let cancelled = false;
        const token = ++requestToken.current;
        pageRef.current = 1;
        setSearchLoading(true);
        fetchPage({ query: debouncedQuery, page: 1 })
            .then((result) => {
            if (cancelled || token !== requestToken.current)
                return;
            setAsyncOptions(result.rows);
            setHasMore(result.hasMore);
            listRef.current?.scrollTo({ top: 0 });
        })
            .finally(() => { if (!cancelled)
            setSearchLoading(false); });
        return () => { cancelled = true; };
    }, [debouncedQuery, open, fetchPage]);
    const loadMore = () => {
        if (!fetchPage || inFlight.current || !hasMore)
            return;
        const next = pageRef.current + 1;
        const token = requestToken.current;
        inFlight.current = true;
        setLoadingMore(true);
        fetchPage({ query: debouncedQuery, page: next })
            .then((result) => {
            if (token !== requestToken.current)
                return;
            pageRef.current = next;
            setAsyncOptions((prev) => {
                const seen = new Set(prev.map((option) => option.id));
                return [...prev, ...result.rows.filter((option) => !seen.has(option.id))];
            });
            setHasMore(result.hasMore);
        })
            .finally(() => {
            inFlight.current = false;
            setLoadingMore(false);
        });
    };
    const handleListScroll = (event) => {
        if (!isPaged)
            return;
        const el = event.currentTarget;
        if (el.scrollHeight - el.scrollTop - el.clientHeight < 48)
            loadMore();
    };
    const options = isAsync
        ? asyncOptions
        : (staticOptions ?? []).filter((option) => getOptionLabel(option).toLowerCase().includes(query.trim().toLowerCase()));
    const handleOpen = () => {
        setQuery('');
        if (isAsync) {
            setAsyncOptions([]);
            setSearchLoading(true);
        }
        setPlacement(measurePlacement(triggerRef.current));
        setAnchorEl(triggerRef.current);
    };
    const handleClose = () => {
        setAnchorEl(null);
        if (isAsync)
            setAsyncOptions([]);
        onBlur?.();
    };
    const handleSelect = (option) => {
        if (!multiple) {
            emit([option]);
            handleClose();
            return;
        }
        const already = selected.some((item) => item.id === option.id);
        emit(already ? selected.filter((item) => item.id !== option.id) : [...selected, option]);
    };
    const handleCreate = async () => {
        if (!onCreate)
            return;
        const typed = query.trim();
        handleClose();
        const created = await onCreate(typed);
        if (created)
            emit(multiple ? [...selected, created] : [created]);
    };
    const showClear = !required && selected.length > 0;
    const isLoading = searchLoading || loading;
    return (_jsxs(Box, { sx: sx, children: [label && _jsx(InputLabel, { error: error, required: required, children: label }), _jsx(SelectTrigger, { ref: triggerRef, inputRef: inputRef, value: multiple ? '' : selected[0] ? getOptionLabel(selected[0]) : '', placeholder: selected.length ? '' : placeholder, error: error, dense: dense, disabled: disabled, onOpen: handleOpen, "aria-haspopup": "listbox", "aria-expanded": open, wrap: multiple && selected.length > 0, startAdornment: multiple && selected.length ? (_jsx(Box, { sx: { display: 'flex', flexWrap: 'wrap', gap: 0.5, py: 0.75, mr: 0.5, flex: '1 1 auto', minWidth: 0 }, children: selected.map((option) => (_jsx(Chip, { size: "small", label: getOptionLabel(option), onMouseDown: (event) => event.stopPropagation(), onDelete: disabled ? undefined : () => emit(selected.filter((item) => item.id !== option.id)), sx: { maxWidth: '100%' } }, option.id))) })) : selected[0] && getOptionIcon ? (_jsx(InputAdornment, { position: "start", sx: { mr: 1.25 }, children: getOptionIcon(selected[0]) })) : undefined, endAdornment: _jsxs(InputAdornment, { position: "end", children: [showClear && (_jsx(IconButton, { size: "small", tabIndex: -1, "aria-label": "Clear", onClick: (event) => { event.stopPropagation(); emit([]); }, sx: { p: '2px', mr: '2px' }, children: _jsx(CloseRoundedIcon, { sx: { fontSize: 16, color: 'text.secondary' } }) })), _jsx(ExpandMoreRoundedIcon, { sx: {
                                fontSize: 20,
                                color: 'text.secondary',
                                transform: open ? 'rotate(180deg)' : 'none',
                                transition: 'transform 0.15s ease',
                            } })] }) }), helperText && _jsx(FormHelperText, { error: error, children: helperText }), _jsxs(Popover, { open: open, anchorEl: anchorEl, onClose: handleClose, onKeyDown: (event) => { if (event.key === 'Tab')
                    handleClose(); }, anchorOrigin: { vertical: placement.below ? 'bottom' : 'top', horizontal: 'left' }, transformOrigin: { vertical: placement.below ? 'top' : 'bottom', horizontal: 'left' }, disableRestoreFocus: true, transitionDuration: { enter: 180, exit: 120 }, slotProps: {
                    transition: {
                        easing: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
                        onEntered: () => { if (showSearch)
                            searchInputRef.current?.focus(); },
                    },
                    paper: {
                        sx: (theme) => ({
                            mt: placement.below ? 1 : 0,
                            mb: placement.below ? 0 : 1,
                            width: 'auto',
                            minWidth: Math.min(triggerRef.current?.offsetWidth ?? 400, 400),
                            maxWidth: Math.min(triggerRef.current?.offsetWidth ?? 560, 560),
                            borderRadius: `${theme.shape.borderRadius}px`,
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
                        }),
                    },
                }, children: [showSearch && (_jsxs(Box, { sx: { p: 1.5, pb: 1, display: 'flex', gap: 1, alignItems: 'center' }, children: [_jsx(TextField, { inputRef: searchInputRef, fullWidth: true, placeholder: searchPlaceholder, value: query, onChange: (event) => setQuery(event.target.value), slotProps: {
                                    input: {
                                        className: 'search-field',
                                        startAdornment: (_jsx(InputAdornment, { position: "start", sx: { mr: '11px' }, children: _jsx(SearchIcon, { sx: { fontSize: 20, color: 'text.secondary' } }) })),
                                    },
                                }, sx: (theme) => ({
                                    '& .MuiOutlinedInput-root.Mui-focused': {
                                        borderColor: theme.palette.divider,
                                        boxShadow: 'none',
                                    },
                                }) }), onCreate && (_jsx(Button, { size: "small", variant: "contained", startIcon: _jsx(AddRoundedIcon, { sx: { fontSize: 17 } }), onClick: handleCreate, sx: { flexShrink: 0, height: (theme) => theme.spacing(5), whiteSpace: 'nowrap' }, children: createLabel }))] })), _jsxs(List, { ref: listRef, onScroll: handleListScroll, sx: {
                            maxHeight: placement.maxHeight - (showSearch ? SEARCH_BLOCK : 0),
                            overflowY: 'auto',
                            p: 1,
                            pt: showSearch ? 0.5 : 1,
                        }, children: [isLoading && (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', py: 3 }, children: _jsx(CircularProgress, { size: 22 }) })), loadingMore && !isLoading && (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', py: 1.5 }, children: _jsx(CircularProgress, { size: 18 }) })), !isLoading && options.length === 0 && (_jsx(Box, { sx: { px: 1.5, py: 2 }, children: _jsx(Typography, { variant: "body2", color: "textSecondary", children: emptyText }) })), !isLoading && options.map((option) => {
                                const isSelected = selected.some((item) => item.id === option.id);
                                return (_jsxs(ListItemButton, { selected: isSelected, onClick: () => handleSelect(option), sx: (theme) => ({
                                        borderRadius: `${theme.shape.borderRadius}px`,
                                        width: 'auto',
                                        px: 1.5,
                                        py: 1,
                                        mb: 0.25,
                                        '&:active': { transform: 'none' },
                                        '&.Mui-selected': {
                                            bgcolor: alpha(theme.palette.text.primary, 0.06),
                                            '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.1) },
                                        },
                                    }), children: [getOptionIcon && (_jsx(Box, { sx: { display: 'flex', alignItems: 'center', mr: 1.25 }, children: getOptionIcon(option) })), _jsx(ListItemText, { primary: getOptionLabel(option), secondary: getOptionSubLabel?.(option), slotProps: {
                                                primary: { sx: { fontSize: '0.875rem' } },
                                                secondary: { sx: { fontSize: '0.75rem' } },
                                            } }), isSelected && _jsx(CheckRoundedIcon, { sx: { fontSize: 18, color: 'primary.main', flexShrink: 0 } })] }, option.id));
                            })] })] })] }));
}
