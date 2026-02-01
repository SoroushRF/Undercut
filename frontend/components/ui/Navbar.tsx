'use client';

import * as React from "react";
import { User, Bell, Car, Heart, Settings, LogOut, ShieldCheck, Menu } from "lucide-react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/Sheet";
import { toast } from "sonner";

export function Navbar({ className }: { className?: string }) {
    return (
        <nav className={cn(
            "sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl",
            className
        )}>
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-black/10">
                        <Car className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-foreground">UNDERCUT</span>
                </div>

                {/* Search Bar - Center */}
                <div className="hidden max-w-md flex-1 px-8 md:block">
                    <SearchInput placeholder="Search for deals..." className="h-10" />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <ThemeSelector />

                    <div className="hidden sm:flex items-center gap-2">
                        <button
                            onClick={() => toast.info("You have no new notifications")}
                            className="relative rounded-xl p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                        >
                            <Bell className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="hidden sm:block h-8 w-[1px] bg-border mx-2" />

                    <div className="hidden sm:block">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 rounded-xl bg-muted pl-3 pr-1.5 py-1.5 text-sm font-bold text-foreground border border-border transition-all hover:bg-accent hover:text-accent-foreground active:scale-95 outline-none">
                                    <span>Account</span>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border shadow-sm">
                                        <User className="h-4 w-4" />
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <User className="h-4 w-4" /> Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Heart className="h-4 w-4" /> Watchlist
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <ShieldCheck className="h-4 w-4" /> Membership
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Settings className="h-4 w-4" /> Settings
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
                    </div>

                    {/* Mobile Menu Trigger */}
                    <div className="flex sm:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="rounded-xl p-2.5 bg-muted text-foreground hover:bg-accent transition-all">
                                    <Menu className="h-6 w-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetHeader>
                                    <SheetTitle className="text-left">Navigation</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-6 mt-8">
                                    <div className="space-y-4">
                                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground px-2">Discovery</p>
                                        <div className="flex flex-col gap-1">
                                            <SearchInput placeholder="Search deals..." className="w-full" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground px-2">Account & Settings</p>
                                        <div className="flex flex-col gap-2">
                                            <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted text-sm font-bold transition-all">
                                                <User className="h-5 w-5 text-primary" /> Profile
                                            </button>
                                            <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted text-sm font-bold transition-all">
                                                <Heart className="h-5 w-5 text-red-500" /> Watchlist
                                            </button>
                                            <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted text-sm font-bold transition-all">
                                                <Settings className="h-5 w-5 text-muted-foreground" /> Settings
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-8 border-t border-border">
                                        <button
                                            onClick={() => toast.error("Logout feature coming soon!")}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive/10 px-4 py-4 text-sm font-black uppercase tracking-tighter text-destructive hover:bg-destructive/20 transition-all"
                                        >
                                            <LogOut className="h-5 w-5" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
