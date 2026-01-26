'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
    label?: string;
    description?: string;
}

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    SwitchProps
>(({ className, label, description, ...props }, ref) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
            {label && (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground leading-none">{label}</span>
                    {description && (
                        <span className="text-xs text-muted-foreground mt-1">{description}</span>
                    )}
                </div>
            )}
            <SwitchPrimitives.Root
                className={cn(
                    'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
                    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    'data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted',
                    className
                )}
                {...props}
                ref={ref}
            >
                <SwitchPrimitives.Thumb
                    className={cn(
                        'pointer-events-none block h-5 w-5 rounded-full bg-card shadow-lg ring-0 transition-transform',
                        'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
                    )}
                />
            </SwitchPrimitives.Root>
        </div>
    </div>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
