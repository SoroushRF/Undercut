'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function HeroAuthButtons() {
    const { user } = useAuth();

    if (user) return null;

    return (
        <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/profile?mode=signup" className="flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                Sign Up
            </Link>
            <Link href="/profile?mode=login" className="flex items-center justify-center rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/50">
                Log In
            </Link>
        </div>
    );
}

export function FooterAuthButtons() {
    const { user } = useAuth();

    if (user) return null;

    return (
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/profile?mode=signup" className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                Sign Up Now
            </Link>
            <Link href="/profile?mode=login" className="rounded-lg border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/50">
                Log In
            </Link>
        </div>
    );
}
