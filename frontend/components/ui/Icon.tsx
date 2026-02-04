'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    icon: LucideIcon;
    size?: number | string;
    className?: string;
}

/**
 * Standardized Icon wrapper to ensure consistent stroke-width, 
 * anti-aliasing, and sizing across the entire design system.
 */
export function Icon({
    icon: LucideIconComponent,
    size = 20,
    className,
    ...props
}: IconProps) {
    return (
        <LucideIconComponent
            size={size}
            strokeWidth={2}
            className={cn('shrink-0 text-current antialiased', className)}
            {...props}
        />
    );
}
