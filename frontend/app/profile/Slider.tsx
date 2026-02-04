'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
    value: number[];
    min?: number;
    max?: number;
    step?: number;
    onValueChange: (value: number[]) => void;
    formatLabel?: (value: number) => string;
    className?: string;
}

export function Slider({
    value,
    min = 0,
    max = 100,
    step = 1,
    onValueChange,
    formatLabel,
    className,
}: SliderProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        onValueChange([newValue]);
    };

    const currentValue = value[0] ?? min;
    const percentage = ((currentValue - min) / (max - min)) * 100;

    return (
        <div className={cn("w-full", className)}>
            <div className="relative flex w-full touch-none select-none items-center">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={currentValue}
                    onChange={handleChange}
                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-20"
                />
                <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
                    <div
                        className="absolute h-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div
                    className="absolute h-6 w-6 rounded-full border-2 border-primary bg-card ring-offset-background transition-all hover:scale-110 z-10 pointer-events-none shadow-xl"
                    style={{ left: `${percentage}%`, transform: `translateX(-50%)` }}
                />
            </div>
            {formatLabel && (
                <div className="mt-4 flex justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    <span>{formatLabel(min)}</span>
                    <span className="font-black text-foreground bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">{formatLabel(currentValue)}</span>
                    <span>{formatLabel(max)}</span>
                </div>
            )}
        </div>
    );
}
