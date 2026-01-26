// frontend/components/ui/CardSkeleton.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export function CardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("overflow-hidden rounded-3xl border border-border bg-card p-0 shadow-sm transition-all animate-in fade-in duration-500", className)}>
            <div className="aspect-[16/10] bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-shimmer -translate-x-full" />
            </div>
            <div className="p-6">
                <div className="h-6 w-3/4 rounded-lg bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-shimmer -translate-x-full" />
                </div>
                <div className="mt-2 h-4 w-1/2 rounded-lg bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-shimmer -translate-x-full" />
                </div>

                <div className="mt-8 flex justify-between">
                    <div className="h-4 w-1/4 rounded-lg bg-muted relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-shimmer -translate-x-full" />
                    </div>
                    <div className="h-4 w-1/4 rounded-lg bg-muted relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-shimmer -translate-x-full" />
                    </div>
                </div>
            </div>
            <div className="p-6 pt-0">
                <div className="h-10 w-full rounded-xl bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-shimmer -translate-x-full" />
                </div>
            </div>
        </div>
    );
}
