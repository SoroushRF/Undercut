// frontend/components/ui/Navbar.tsx
import * as React from "react";
import { Search, User, Bell, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchInput } from "@/components/ui/SearchInput";

export function Navbar({ className }: { className?: string }) {
    return (
        <nav className={cn(
            "sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl",
            className
        )}>
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black shadow-lg shadow-black/10">
                        <Car className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-zinc-900">UNDERCUT</span>
                </div>

                {/* Search Bar - Center */}
                <div className="hidden max-w-md flex-1 px-8 md:block">
                    <SearchInput placeholder="Search for deals..." className="h-10" />
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <button className="relative rounded-xl p-2.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
                        <Bell className="h-5 w-5" />
                        <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    </button>

                    <div className="h-8 w-[1px] bg-zinc-100 mx-2" />

                    <button className="flex items-center gap-2 rounded-xl bg-zinc-50 pl-3 pr-1.5 py-1.5 text-sm font-bold text-zinc-900 border border-zinc-200 transition-all hover:bg-zinc-100 active:scale-95">
                        <span>Profile</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-zinc-200 shadow-sm">
                            <User className="h-4 w-4" />
                        </div>
                    </button>

                    {/* Mobile Search Toggle */}
                    <button className="md:hidden rounded-xl p-2.5 text-zinc-500 hover:bg-zinc-50">
                        <Search className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
