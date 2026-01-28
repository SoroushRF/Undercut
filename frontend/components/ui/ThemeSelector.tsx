'use client';

import * as React from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'midnight';

export function ThemeSelector({ className }: { className?: string }) {
    const [theme, setTheme] = React.useState<Theme>('light');
    const [mounted, setMounted] = React.useState(false);

    const applyTheme = React.useCallback((newTheme: Theme) => {
        const root = document.documentElement;

        if (newTheme === 'midnight') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        localStorage.setItem('undercut-theme', newTheme);
        setTheme(newTheme);
    }, []);

    React.useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('undercut-theme') as Theme || 'light';
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, [applyTheme]);

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'midnight' : 'light';
        applyTheme(nextTheme);
    };

    // Prevent hydration mismatch flicker - render invisible placeholder until mounted
    if (!mounted) return <div className="h-10 w-10" />;

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-all hover:bg-muted active:scale-95',
                'focus-visible:ring-2 focus-visible:ring-primary outline-none shadow-sm',
                className
            )}
            title={`Switch to ${theme === 'light' ? 'Midnight' : 'Light'} Mode`}
        >
            {theme === 'light' ? (
                <Moon className="h-5 w-5 text-indigo-500 fill-indigo-500/10" />
            ) : (
                <Sun className="h-5 w-5 text-amber-500 fill-amber-500/10" />
            )}
        </button>
    );
}
