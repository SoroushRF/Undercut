'use client';

// frontend/components/ui/FilterChips.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface FilterChipProps {
    label: string;
    selected?: boolean;
    onClick?: () => void;
    className?: string;
}

export function FilterChip({ label, selected, onClick, className }: FilterChipProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 border",
                selected
                    ? "bg-black text-white border-black shadow-md shadow-black/10"
                    : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300",
                className
            )}
        >
            {label}
        </button>
    );
}

export function FilterChipsGroup({
    options,
    value,
    onChange,
    className
}: {
    options: string[],
    value?: string,
    onChange: (val: string) => void,
    className?: string
}) {
    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {options.map((option) => (
                <FilterChip
                    key={option}
                    label={option}
                    selected={value === option}
                    onClick={() => onChange(option)}
                />
            ))}
        </div>
    );
}
