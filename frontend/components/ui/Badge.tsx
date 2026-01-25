'use client';

// frontend/components/ui/Badge.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "primary" | "secondary" | "outline" | "destructive" | "success" | "warning";
    grade?: "S" | "A" | "B" | "C" | "F";
}

const badgeVariants = {
    primary: "bg-black text-white",
    secondary: "bg-zinc-100 text-zinc-900",
    outline: "border border-zinc-200 text-zinc-900",
    destructive: "bg-red-100 text-red-600 border border-red-200",
    success: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-100 text-amber-700 border border-amber-200",
};

const gradeColors = {
    S: "bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]",
    A: "bg-emerald-500 text-white",
    B: "bg-blue-500 text-white",
    C: "bg-amber-500 text-white",
    F: "bg-red-500 text-white",
};

export function Badge({ className, variant = "secondary", grade, ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
                grade ? gradeColors[grade] : badgeVariants[variant],
                className
            )}
            {...props}
        />
    );
}
