'use client';

import Link from "next/link";

export function HeroAuthButtons() {
    return (
        <div className="flex flex-col gap-4 sm:flex-row">
            <Link 
                href="/profile?mode=preferences" 
                className="flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition hover:opacity-90 hover:scale-105 transform"
            >
                🚀 Get Started — Find Your Perfect Car
            </Link>
        </div>
    );
}

export function FooterAuthButtons() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link 
                href="/profile?mode=preferences" 
                className="rounded-lg bg-primary px-10 py-4 text-base font-semibold text-primary-foreground transition hover:opacity-90 hover:scale-105 transform"
            >
                🚀 Start Finding Deals
            </Link>
        </div>
    );
}

