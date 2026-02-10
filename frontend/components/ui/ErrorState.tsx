'use client';

import * as React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
    className?: string;
}

/**
 * Standardized error state for failed data fetching or application crashes.
 * Uses a red-tinted design to stand out as a "Safety Net".
 */
export function ErrorState({
    title = "Something went wrong",
    description = "We encountered an error while loading the data. Please try again or contact support if the problem persists.",
    onRetry,
    className,
}: ErrorStateProps) {
    const handleRefresh = () => {
        if (onRetry) {
            onRetry();
        } else {
            window.location.reload();
        }
    };

    return (
        <div className={cn(
            "flex min-h-[400px] w-full flex-col items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center animate-in fade-in zoom-in duration-300",
            className
        )}>
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 shadow-inner">
                <AlertCircle className="h-10 w-10 text-destructive" strokeWidth={1.5} />
            </div>

            <h2 className="mb-2 text-2xl font-black tracking-tight text-foreground">
                {title}
            </h2>

            <p className="mb-8 max-w-sm text-sm font-medium text-muted-foreground leading-relaxed">
                {description}
            </p>

            <Button
                onClick={handleRefresh}
                variant="destructive"
                className="gap-2 px-8 font-bold shadow-lg shadow-destructive/20 active:scale-95 transition-all"
            >
                <RefreshCcw className="h-4 w-4" />
                {onRetry ? "Try Again" : "Refresh Page"}
            </Button>
        </div>
    );
}
