import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "ghost"
    | "destructive"
    | "outline";

type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}

const base =
    "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition duration-200 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
    primary:
        "bg-black text-white hover:opacity-90 focus-visible:ring-black",
    secondary:
        "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus-visible:ring-zinc-400",
    ghost:
        "bg-transparent text-zinc-900 hover:bg-zinc-100 focus-visible:ring-zinc-400",
    destructive:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
    outline:
        "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 focus-visible:ring-zinc-400",
};

const sizes: Record<ButtonSize, string> = {
    sm: "h-9 px-3",
    md: "h-11 px-6",
    lg: "h-14 px-8 text-base",
    icon: "h-10 w-10",
};

function Spinner() {
    return (
        <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
    );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = "primary",
            size = "md",
            isLoading = false,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || isLoading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                className={cn(base, variants[variant], sizes[size], className)}
                {...props}
            >
                {isLoading && <Spinner />}
                <span>{children}</span>
            </button>
        );
    }
);

Button.displayName = "Button";