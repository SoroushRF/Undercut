// frontend/components/ui/CardSkeleton.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export function CardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("overflow-hidden rounded-2xl border border-zinc-200 bg-white p-0 shadow-sm", className)}>
            <div className="aspect-[16/10] animate-pulse bg-zinc-100" />
            <div className="p-5">
                <div className="h-6 w-3/4 animate-pulse rounded-md bg-zinc-100" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded-md bg-zinc-100" />

                <div className="mt-6 flex justify-between">
                    <div className="h-4 w-1/4 animate-pulse rounded-md bg-zinc-100" />
                    <div className="h-4 w-1/4 animate-pulse rounded-md bg-zinc-100" />
                </div>
            </div>
            <div className="p-5 pt-0">
                <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-50" />
            </div>
        </div>
    );
}
