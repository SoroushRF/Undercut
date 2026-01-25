// frontend/components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
    { className, error, helperText, ...props },
    ref
) {
    return (
        <div className="w-full">
            <input
                ref={ref}
                className={cn(
                    "h-10 w-full rounded-xl border bg-white px-3 text-sm outline-none transition",
                    "border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200",
                    error ? "border-red-500 focus:border-red-600 focus:ring-red-200" : "",
                    className
                )}
                aria-invalid={!!error}
                {...props}
            />
            {error ? (
                <p className="mt-1 text-xs text-red-600">{error}</p>
            ) : helperText ? (
                <p className="mt-1 text-xs text-zinc-600">{helperText}</p>
            ) : null}
        </div>
    );
});
