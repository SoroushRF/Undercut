'use client';

// frontend/components/ui/SearchInput.tsx
import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onClear?: () => void;
}

export function SearchInput({ className, onClear, value, onChange, ...props }: SearchInputProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className={cn("relative flex w-full items-center", className)}>
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />

            <input
                ref={inputRef}
                value={value}
                onChange={onChange}
                className={cn(
                    "h-12 w-full rounded-2xl border border-border bg-background pl-12 pr-12 text-sm font-medium transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground",
                )}
                {...props}
            />

            {value && onClear && (
                <button
                    type="button"
                    onClick={() => {
                        onClear();
                        inputRef.current?.focus();
                    }}
                    className="absolute right-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
