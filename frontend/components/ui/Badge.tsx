'use client';

// frontend/components/ui/Badge.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "primary" | "secondary" | "outline" | "destructive" | "success" | "warning";
    grade?: "S" | "A" | "B" | "C" | "D" | "F";
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
    S: "bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 text-amber-950 border-2 border-white/50 shadow-[0_0_25px_rgba(251,191,36,0.8)] font-black tracking-wide bg-[length:200%_auto] animate-background-shine",
    A: "bg-success text-success-foreground",
    B: "bg-blue-500 text-white",
    C: "bg-warning text-warning-foreground",
    D: "bg-orange-600 text-white",
    F: "bg-destructive text-destructive-foreground",
};

export const gradeLabels: Record<string, string> = {
    S: "Incredible Deal",
    A: "Great Deal",
    B: "Good Price",
    C: "Fair Price",
    D: "High Price",
    F: "Overpriced",
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
