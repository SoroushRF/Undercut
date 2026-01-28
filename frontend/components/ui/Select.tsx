'use client';

import * as React from 'react';
import { ChevronDown, Check, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Option<T> = { label: string; value: T };

export interface SelectProps<T = string> {
    options: Array<Option<T>>;
    value: T | T[] | null;
    onChange: (value: T | T[]) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    className?: string;
    searchable?: boolean;
    multiple?: boolean;
    loading?: boolean;
    emptyText?: string;
    clearable?: boolean; // NEW: Allow clearing selection
    onClear?: () => void; // NEW: Callback when cleared
}

function isEqual<T>(a: T, b: T) {
    return Object.is(a, b);
}

export function Select<T = string>({
    options,
    value,
    onChange,
    placeholder = 'Select…',
    disabled,
    error,
    className,
    searchable,
    multiple,
    loading,
    emptyText = 'No options found',
    clearable,
    onClear,
}: SelectProps<T>) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [activeIndex, setActiveIndex] = React.useState<number>(-1);

    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const listRef = React.useRef<HTMLDivElement | null>(null);
    const searchRef = React.useRef<HTMLInputElement | null>(null);

    const valuesArray: T[] = React.useMemo(() => {
        if (!multiple) return value == null ? [] : [value as T];
        return Array.isArray(value) ? (value as T[]) : [];
    }, [value, multiple]);

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!searchable || q.length === 0) return options;
        return options.filter((o) => o.label.toLowerCase().includes(q));
    }, [options, query, searchable]);

    const selectedLabels = React.useMemo(() => {
        if (valuesArray.length === 0) return '';
        const map = new Map(options.map((o) => [o.value, o.label]));
        const labels = valuesArray.map((v) => map.get(v) ?? '—');
        return multiple ? labels.join(', ') : labels[0] ?? '';
    }, [valuesArray, options, multiple]);

    const close = React.useCallback(() => {
        setOpen(false);
        setQuery('');
        setActiveIndex(-1);
        buttonRef.current?.focus();
    }, []);

    const toggleValue = React.useCallback(
        (v: T) => {
            if (multiple) {
                const exists = valuesArray.some((x) => isEqual(x, v));
                const next = exists ? valuesArray.filter((x) => !isEqual(x, v)) : [...valuesArray, v];
                onChange(next);
            } else {
                onChange(v);
                close();
            }
        },
        [multiple, valuesArray, onChange, close]
    );

    const handleClear = React.useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onChange(multiple ? [] : (null as any));
            onClear?.();
        },
        [multiple, onChange, onClear]
    );

    // Close on outside click
    React.useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                buttonRef.current?.contains(target) ||
                listRef.current?.contains(target)
            ) {
                return;
            }
            close();
        };
        window.addEventListener('mousedown', onDown);
        return () => window.removeEventListener('mousedown', onDown);
    }, [open, close]);

    // Focus search when opened
    React.useEffect(() => {
        if (!open) return;
        const t = window.setTimeout(() => {
            if (searchable) searchRef.current?.focus();
        }, 0);
        return () => window.clearTimeout(t);
    }, [open, searchable]);

    // NEW ENHANCEMENT: Auto-scroll active item into view
    React.useEffect(() => {
        if (!open || activeIndex < 0) return;

        const listEl = listRef.current;
        if (!listEl) return;

        const activeEl = listEl.querySelector(`[data-index="${activeIndex}"]`);
        if (activeEl) {
            activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }, [open, activeIndex]);

    const onButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;

        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
            setActiveIndex(0);
            return;
        }
    };

    const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!open) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            close();
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            const opt = filtered[activeIndex];
            if (opt) toggleValue(opt.value);
            return;
        }
    };

    const renderValue = () => {
        if (loading) return 'Loading…';
        if (!selectedLabels) return placeholder;
        return selectedLabels;
    };

    const baseBorder = error
        ? 'border-red-300 focus-visible:ring-red-200'
        : 'border-zinc-200 focus-visible:ring-zinc-200';

    const showClearButton = clearable && selectedLabels && !loading && !disabled;

    return (
        <div className={cn('w-full', className)}>
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => !disabled && setOpen((v) => !v)}
                onKeyDown={onButtonKeyDown}
                className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-xl border bg-card px-3 py-2 text-left text-sm shadow-sm outline-none transition',
                    'focus-visible:ring-4',
                    baseBorder,
                    disabled && 'cursor-not-allowed opacity-60',
                    open && 'ring-4 ring-zinc-100'
                )}
            >
                <span
                    className={cn(
                        'truncate',
                        !selectedLabels && !loading && 'text-zinc-500'
                    )}
                >
                    {renderValue()}
                </span>

                <span className="flex items-center gap-1">
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                    ) : null}

                    {/* NEW ENHANCEMENT: Clear button */}
                    {showClearButton ? (
                        <X
                            className="h-4 w-4 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
                            onClick={handleClear}
                        />
                    ) : null}

                    <ChevronDown
                        className={cn(
                            'h-4 w-4 text-zinc-500 transition-transform',
                            open && 'rotate-180'
                        )}
                    />
                </span>
            </button>

            {open ? (
                <div
                    ref={listRef}
                    tabIndex={-1}
                    onKeyDown={onListKeyDown}
                    className={cn(
                        'relative z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg'
                    )}
                >
                    {searchable ? (
                        <div className="border-b border-zinc-100 p-2">
                            <input
                                ref={searchRef}
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setActiveIndex(0);
                                }}
                                placeholder="Search…"
                                className={cn(
                                    'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none',
                                    'focus-visible:ring-4 focus-visible:ring-zinc-200'
                                )}
                            />
                        </div>
                    ) : null}

                    <div
                        className="max-h-64 overflow-auto p-1"
                        role="listbox"
                        aria-multiselectable={multiple || undefined}
                    >
                        {filtered.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-zinc-500">{emptyText}</div>
                        ) : (
                            filtered.map((opt, idx) => {
                                const selected = valuesArray.some((v) => isEqual(v, opt.value));
                                const active = idx === activeIndex;

                                return (
                                    <button
                                        key={idx}
                                        data-index={idx} // NEW: For auto-scroll
                                        type="button"
                                        role="option"
                                        aria-selected={selected}
                                        onMouseEnter={() => setActiveIndex(idx)}
                                        onClick={() => toggleValue(opt.value)}
                                        className={cn(
                                            'flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition',
                                            active ? 'bg-zinc-100' : 'hover:bg-zinc-50',
                                            selected && 'font-medium'
                                        )}
                                    >
                                        <span className="truncate">{opt.label}</span>
                                        {selected ? (
                                            <Check className="h-4 w-4 flex-shrink-0 text-zinc-700" />
                                        ) : null}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            ) : null}

            {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
        </div>
    );
}
