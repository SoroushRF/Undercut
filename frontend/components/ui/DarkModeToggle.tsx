'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DarkModeToggleProps {
    className?: string;
}

/**
 * DarkModeToggle - A button to switch between light and dark mode
 * 
 * Usage in Navbar:
 * <DarkModeToggle />
 */
export function DarkModeToggle({ className }: DarkModeToggleProps) {
    const [isDark, setIsDark] = React.useState(false);

    // Check initial theme on mount
    React.useEffect(() => {
        const root = document.documentElement;
        const initialIsDark = root.classList.contains('dark');
        setIsDark(initialIsDark);

        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            root.classList.add('dark');
            setIsDark(true);
        }
    }, []);

    const toggleDarkMode = () => {
        const root = document.documentElement;
        const newIsDark = !isDark;

        if (newIsDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

        setIsDark(newIsDark);
    };

    return (
        <button
            onClick={toggleDarkMode}
            className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-xl',
                'border border-zinc-200 bg-white text-zinc-700',
                'hover:bg-zinc-50 hover:border-zinc-300',
                'dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
                'dark:hover:bg-zinc-700 dark:hover:border-zinc-600',
                'transition-all duration-200',
                'focus-visible:ring-4 focus-visible:ring-zinc-200 dark:focus-visible:ring-zinc-700',
                'outline-none',
                className
            )}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {/* Sun icon (shows in dark mode) */}
            <Sun
                className={cn(
                    'h-5 w-5 transition-all duration-300',
                    isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
                )}
            />

            {/* Moon icon (shows in light mode) */}
            <Moon
                className={cn(
                    'absolute h-5 w-5 transition-all duration-300',
                    isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100'
                )}
            />
        </button>
    );
}
