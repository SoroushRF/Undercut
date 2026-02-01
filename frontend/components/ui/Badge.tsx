'use client';

// frontend/components/ui/Badge.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "primary" | "secondary" | "outline" | "destructive" | "success" | "warning";
    grade?: "S" | "A" | "B" | "C" | "F";
}

const badgeVariants = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border text-foreground",
    destructive: "bg-destructive/10 text-destructive border border-destructive/20",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
};

const gradeColors = {
    S: "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(147,51,234,0.3)]",
    A: "bg-success text-success-foreground",
    B: "bg-blue-500 text-white",
    C: "bg-warning text-warning-foreground",
    F: "bg-destructive text-destructive-foreground",
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
