'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

export interface SliderProps {
    min: number;
    max: number;
    step?: number;
    value: number | [number, number];
    onChange: (value: number | [number, number]) => void;
    disabled?: boolean;
    showLabels?: boolean;
    formatLabel?: (value: number) => string;
    className?: string;
}

function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
}

export function Slider({
    min,
    max,
    step = 1,
    value,
    onChange,
    disabled,
    showLabels,
    formatLabel,
    className,
}: SliderProps) {
    const isRange = Array.isArray(value);
    const radixValue = React.useMemo(() => (isRange ? value : [value]), [isRange, value]);

    const formatted = (v: number) => (formatLabel ? formatLabel(v) : String(v));

    return (
        <div className={cn('w-full', className)}>
            {showLabels ? (
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <span>{formatted(radixValue[0] ?? min)}</span>
                    <span>{formatted(radixValue[radixValue.length - 1] ?? max)}</span>
                </div>
            ) : null}

            <SliderPrimitive.Root
                min={min}
                max={max}
                step={step}
                value={radixValue.map((v) => clamp(v, min, max))}
                onValueChange={(vals) => {
                    if (isRange) onChange([vals[0] ?? min, vals[1] ?? max]);
                    else onChange(vals[0] ?? min);
                }}
                disabled={disabled}
                className={cn(
                    'relative flex w-full touch-none select-none items-center py-4',
                    disabled && 'opacity-60'
                )}
            >
                <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
                    <SliderPrimitive.Range className="absolute h-full bg-primary" />
                </SliderPrimitive.Track>

                {radixValue.map((_, i) => (
                    <SliderPrimitive.Thumb
                        key={i}
                        className={cn(
                            'block h-5 w-5 rounded-full border border-border bg-card shadow-lg outline-none transition-all hover:scale-110 active:scale-95',
                            'focus-visible:ring-4 focus-visible:ring-primary/20'
                        )}
                        aria-label={isRange ? (i === 0 ? 'Minimum' : 'Maximum') : 'Value'}
                    />
                ))}
            </SliderPrimitive.Root>
        </div>
    );
}
