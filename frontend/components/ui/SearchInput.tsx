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
            <Search className="absolute left-4 h-5 w-5 text-zinc-400" />

            <input
                ref={inputRef}
                value={value}
                onChange={onChange}
                className={cn(
                    "h-12 w-full rounded-2xl border border-zinc-200 bg-white pl-12 pr-12 text-sm font-medium transition-all focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100 placeholder:text-zinc-400",
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
                    className="absolute right-4 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
