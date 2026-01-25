'use client';

import * as React from 'react';
import { Sun, Moon, Zap, TreePine, Laptop, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'theme-midnight' | 'theme-forest' | 'system';

export function ThemeSelector({ className }: { className?: string }) {
    const [theme, setTheme] = React.useState<Theme>('system');
    const [open, setOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const themes: { name: Theme; icon: React.ReactNode; label: string }[] = [
        { name: 'system', icon: <Laptop className="h-4 w-4" />, label: 'System' },
        { name: 'light', icon: <Sun className="h-4 w-4 text-amber-500" />, label: 'Light' },
        { name: 'theme-midnight', icon: <Zap className="h-4 w-4 text-indigo-500" />, label: 'Dark' },
        { name: 'dark', icon: <Moon className="h-4 w-4 text-blue-400" />, label: 'Midnight' },
        { name: 'theme-forest', icon: <TreePine className="h-4 w-4 text-emerald-500" />, label: 'Forest' },
    ];

    const applyTheme = React.useCallback((newTheme: Theme) => {
        const root = document.documentElement;

        // Remove all possible theme classes
        root.classList.remove('dark', 'theme-midnight', 'theme-forest');

        let themeToApply = newTheme;

        if (newTheme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            themeToApply = prefersDark ? 'dark' : 'light';
        }

        // Apply classes
        if (themeToApply !== 'light') {
            if (themeToApply === 'theme-midnight' || themeToApply === 'theme-forest') {
                root.classList.add('dark', themeToApply);
            } else {
                root.classList.add(themeToApply);
            }
        }

        localStorage.setItem('undercut-theme', newTheme);
        setTheme(newTheme);
    }, []);

    // Initial mount and system preference listener
    React.useEffect(() => {
        const savedTheme = localStorage.getItem('undercut-theme') as Theme || 'system';
        setTheme(savedTheme);
        applyTheme(savedTheme);

        // Listen for system changes if in system mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (localStorage.getItem('undercut-theme') === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [applyTheme]);

    // Close on outside click
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentThemeInfo = themes.find(t => t.name === theme) || themes[0];

    return (
        <div className={cn('relative', className)} ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    'group flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium transition-all hover:bg-muted',
                    'focus-visible:ring-2 focus-visible:ring-primary outline-none shadow-sm',
                    open && 'bg-muted ring-2 ring-primary/20'
                )}
            >
                <span className="flex items-center gap-2">
                    {currentThemeInfo.icon}
                    <span className="hidden sm:inline-block">{currentThemeInfo.label}</span>
                </span>
                <ChevronDown className={cn('h-3 w-3 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl border border-border bg-card p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Select Mood
                    </div>
                    {themes.map((t) => (
                        <button
                            key={t.name}
                            onClick={() => {
                                applyTheme(t.name);
                                setOpen(false);
                            }}
                            className={cn(
                                'flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm transition-colors',
                                theme === t.name
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-foreground hover:bg-muted'
                            )}
                        >
                            <span className="flex items-center gap-2">
                                {t.icon}
                                {t.label}
                            </span>
                            {theme === t.name && <Check className="h-4 w-4" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
