'use client';

// Bug fixed by Architect - 'use client' added to SearchInput.tsx
import { Navbar } from "@/components/ui/Navbar";
import { ShieldCheck, Wallet } from "lucide-react";
import { MOCK_CARS } from "@/lib/mock-data";
import { TcoChart } from "@/components/viz/TcoChart";
import { SearchSection } from "@/components/home/SearchSection";

// UX Engineer Motion Components
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "sonner";
import { PageTransition } from "@/components/motion/PageTransition";

export default function Home() {
    return (
        <PageTransition>
            <Navbar />

            {/* Main Content Area */}
            <main className="min-h-screen bg-background text-foreground">

                {/* Hero Section */}
                <div className="mx-auto max-w-7xl px-8 py-12 lg:py-24">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
                        {/* Left Column: Text + Buttons */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                                    Drive the car you deserve for less.
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Undercut finds the best underpriced cars in the market so you never overpay again.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <button className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                                    Sign Up
                                </button>
                                <button className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/50">
                                    Log In
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Hero Image */}
                        <div className="relative overflow-hidden rounded-2xl shadow-xl border border-border">
                            <img
                                src="/hero.png"
                                alt="Undercut Car Marketplace"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Market Analysis Preview Section (From Style Branch) */}
                <div className="mx-auto max-w-7xl px-8 mb-16">
                    <section className="mb-8">
                        <h2 className="text-3xl font-bold text-foreground">Trending Deals</h2>
                        <p className="text-muted-foreground mt-1">Find the best underpriced cars in the market.</p>
                    </section>

                    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-foreground mb-2">Market Analysis Preview</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            5-year cost of ownership comparison. Select a timeframe to see projected costs.
                        </p>
                        <TcoChart />
                    </section>
                </div>

                {/* New Sections: Shop Smart & Finding your fit */}
                <div className="flex min-h-screen flex-col md:flex-row">
                    {/* Shop Smart */}
                    <div className="relative flex w-full flex-col justify-end p-12 md:w-1/2 min-h-[500px]">
                        <img
                            src="/shop-smart.png"
                            alt="Shop Smart"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <h2 className="relative text-4xl font-bold text-white">Shop Smart</h2>
                    </div>

                    {/* Finding your fit */}
                    <div className="relative flex w-full flex-col justify-end p-12 md:w-1/2 min-h-[500px]">
                        <img
                            src="/finding-fit.png"
                            alt="Finding your fit"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <h2 className="relative text-4xl font-bold text-white">Finding your fit</h2>
                    </div>
                </div>

                {/* Why Choose Undercut Section */}
                <div className="bg-secondary/20 py-24">
                    <div className="mx-auto max-w-7xl px-8 text-center">
                        <h2 className="mb-16 text-3xl font-bold text-foreground">Why choose Undercut?</h2>

                        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
                            <div className="flex flex-col items-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-card shadow-sm border border-border">
                                    <Wallet className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-foreground">Best Market Prices</h3>
                                <p className="max-w-sm text-center text-muted-foreground">
                                    Our AI scans thousands of listings to find deals that are significantly underpriced, saving you money instantly.
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-card shadow-sm border border-border">
                                    <ShieldCheck className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-foreground">Verified Quality</h3>
                                <p className="max-w-sm text-center text-muted-foreground">
                                    Every car is pre-vetted for quality and reliability, so you can drive away with complete peace of mind.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <button className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                                Sign Up Now
                            </button>
                            <button className="rounded-lg border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary/50">
                                Log In
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <SearchSection />

                {/* Scrollable Brand List Section */}
                <div className="bg-secondary/20 py-24">
                    <div className="mx-auto max-w-2xl px-8 text-center">
                        <h2 className="mb-8 text-2xl font-bold text-foreground">Browse by Brand</h2>

                        <div className="mb-8 h-64 overflow-y-auto rounded-xl border border-border bg-card p-4 shadow-sm text-left">
                            <div className="flex flex-col gap-2">
                                {["Toyota", "Honda", "Ford", "Chevrolet", "Tesla", "BMW", "Mercedes-Benz", "Audi", "Hyundai", "Kia", "Nissan", "Subaru", "Volkswagen", "Mazda", "Lexus", "Jeep", "Dodge", "Ram", "GMC", "Porsche"].map((brand) => (
                                    <button
                                        key={brand}
                                        className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="w-full rounded-xl border-2 border-primary bg-transparent px-8 py-3 text-lg font-bold text-primary transition hover:bg-primary hover:text-primary-foreground sm:w-auto">
                            Submit Selection
                        </button>
                    </div>
                </div>

                {/* Design System Showcase (Phase 4 & 5 Verification) */}
                <div className="mx-auto max-w-7xl px-8 py-24 border-t border-border">
                    <h2 className="mb-12 text-3xl font-bold text-foreground text-center">Design System Showcase</h2>

                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        {/* ErrorState Demo */}
                        <div className="space-y-4">
                            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground text-center">Error State</p>
                            <ErrorState
                                title="No Connection"
                                description="We couldn't reach the server. Check your internet and try again."
                                onRetry={() => toast.info("Retrying...")}
                            />
                        </div>

                        {/* EmptyState Demo */}
                        <div className="space-y-4">
                            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground text-center">Empty State</p>
                            <EmptyState
                                title="No Saved Cars"
                                description="You haven't saved any deals yet. Start searching to build your watchlist!"
                                actionLabel="Browse Trending"
                                onAction={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </PageTransition>
    );
}
