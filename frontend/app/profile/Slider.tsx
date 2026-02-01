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
                <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-zinc-100">
                    <div
                        className="absolute h-full bg-zinc-900 transition-all"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div 
                    className="absolute h-5 w-5 rounded-full border-2 border-zinc-900 bg-white ring-offset-2 transition-all hover:scale-110 z-10 pointer-events-none shadow-sm"
                    style={{ left: `${percentage}%`, transform: `translateX(-50%)` }}
                />
            </div>
            {formatLabel && (
                <div className="mt-2 flex justify-between text-xs text-zinc-500">
                    <span>{formatLabel(min)}</span>
                    <span className="font-medium text-zinc-900">{formatLabel(currentValue)}</span>
                    <span>{formatLabel(max)}</span>
                </div>
            )}
        </div>
    );
}
