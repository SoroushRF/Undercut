'use client';

import * as React from 'react';
import { LucideIcon, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon: Icon = SearchX,
    title,
    description,
    actionLabel,
    onAction,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 p-8 text-center animate-in fade-in zoom-in-95 duration-500',
                className
            )}
        >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-6">
                <Icon className="h-10 w-10 opacity-50" strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2 italic tracking-tight">
                {title}
            </h3>

            <p className="max-w-[300px] text-sm text-muted-foreground leading-relaxed mb-8">
                {description}
            </p>

            {actionLabel && onAction && (
                <Button onClick={onAction} variant="outline" className="px-8 border-dashed">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
