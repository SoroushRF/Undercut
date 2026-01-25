'use client';

// frontend/components/ui/LockedPreview.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface LockedPreviewProps {
    locked: boolean;
    title?: string;
    message?: string;
    ctaLabel?: string;
    onCtaClick?: () => void;
    children: React.ReactNode;
    className?: string;
}

/**
 * A component that wraps content and shows a lock screen if "locked" is true.
 * SECURE: Does not render children to the DOM when locked.
 */
export function LockedPreview({
    locked,
    title = "Member-only",
    message = "Sign in to unlock this feature.",
    ctaLabel = "Sign in",
    onCtaClick,
    children,
    className,
}: LockedPreviewProps) {
    return (
        <div className={cn("relative overflow-hidden rounded-2xl", className)}>
            {/* 
                Security Fix: If locked, we do NOT render {children}. 
                This prevents users from inspecting the DOM to see the hidden content.
            */}
            {!locked ? (
                <div>{children}</div>
            ) : (
                <>
                    {/* Placeholder content to maintain layout shape if needed, otherwise just show the lock UI */}
                    <div className="pointer-events-none select-none blur-md grayscale opacity-20">
                        {/* 
                           We could put a skeleton here instead of real children 
                           to be 100% secure about not leaking data.
                        */}
                        <div className="h-64 w-full bg-zinc-100" />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center p-6 bg-white/40 backdrop-blur-sm">
                        <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
                            <div className="text-lg font-bold text-zinc-900">{title}</div>
                            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                                {message}
                            </p>
                            <div className="mt-6">
                                <Button className="w-full" onClick={onCtaClick}>
                                    {ctaLabel}
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
