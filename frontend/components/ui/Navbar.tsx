'use client';

import * as React from "react";
import Link from "next/link";
import { Search, User, Bell, Car, Heart, Settings, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/ui/SearchInput";
import { ThemeSelector } from "@/components/ui/ThemeSelector";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { toast } from "sonner";

export function Navbar({ className }: { className?: string }) {
    return (
        <nav className={cn(
            "sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl",
            className
        )}>
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-black/10">
                        <Car className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-foreground">UNDERCUT</span>
                </Link>

                {/* Search Bar - Center */}
                <div className="hidden max-w-md flex-1 px-8 md:block">
                    <SearchInput placeholder="Search for deals..." className="h-10" />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <ThemeSelector />

                    <button
                        onClick={() => toast.info("You have no new notifications")}
                        className="relative rounded-xl p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                    >
                        <Bell className="h-5 w-5" />
                    </button>

                    <div className="h-8 w-[1px] bg-border mx-2" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 rounded-xl bg-muted pl-3 pr-1.5 py-1.5 text-sm font-bold text-foreground border border-border transition-all hover:bg-accent hover:text-accent-foreground active:scale-95 outline-none">
                                <span className="hidden sm:inline">Account</span>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border shadow-sm">
                                    <User className="h-4 w-4" />
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="gap-2 cursor-pointer flex items-center w-full">
                                    <User className="h-4 w-4" /> Profile
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/watchlist" className="gap-2 cursor-pointer flex items-center w-full">
                                    <Heart className="h-4 w-4" /> Watchlist
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/membership" className="gap-2 cursor-pointer flex items-center w-full">
                                    <ShieldCheck className="h-4 w-4" /> Membership
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/settings" className="gap-2 cursor-pointer flex items-center w-full">
                                    <Settings className="h-4 w-4" /> Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="gap-2 text-red-500 focus:text-red-500 cursor-pointer"
                                onClick={() => toast.error("Logout feature coming soon!")}
                            >
                                <LogOut className="h-4 w-4" /> Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile Search Toggle */}
                    <button className="md:hidden rounded-xl p-2.5 text-muted-foreground hover:bg-muted">
                        <Search className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
