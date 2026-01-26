// Bug fixed by Architect - 'use client' added to SearchInput.tsx
import { Navbar } from "@/components/ui/Navbar";
import { ShieldCheck, Wallet } from "lucide-react";
import { DealCard } from "@/components/ui/DealCard";
import { MOCK_CARS } from "@/lib/mock-data";

// UX Engineer Motion Components
import { CardHover } from "@/components/motion/CardHover";
import { SoldBadge } from "@/components/motion/SoldBadge";
import { FreshnessBadge } from "@/components/motion/FreshnessBadge";
import { PageTransition } from "@/components/motion/PageTransition";

// UX Engineer Visualization Components
import { TcoChart } from "@/components/viz/TcoChart";

export default function Home() {
    return (
        <PageTransition>
            <Navbar />
            <main className="bg-zinc-50">
                <div className="mx-auto max-w-7xl px-8 py-12 lg:py-24">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
                        {/* Left Column: Text + Buttons */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
                                    Drive the car you deserve for less.
                                </h1>
                                <p className="text-lg text-zinc-600">
                                    Undercut finds the best underpriced cars in the market so you never overpay again.
                                </p>
                            </div>
                            
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <button className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">
                                    Sign Up
                                </button>
                                <button className="rounded-lg border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900">
                                    Log In
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Hero Image */}
                        <div className="relative overflow-hidden rounded-2xl shadow-xl">
                            <img 
                                src="/hero.png" 
                                alt="Undercut Car Marketplace" 
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* New Sections: Shop Smart & Finding your fit */}
                <div className="flex min-h-screen flex-col md:flex-row">
                    {/* Shop Smart */}
                    <div className="relative flex w-full flex-col justify-end p-12 md:w-1/2">
                        <img 
                            src="/shop-smart.png" 
                            alt="Shop Smart" 
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <h2 className="relative text-4xl font-bold text-white">Shop Smart</h2>
                    </div>

                    {/* Finding your fit */}
                    <div className="relative flex w-full flex-col justify-end p-12 md:w-1/2">
                        <img 
                            src="/finding-fit.png" 
                            alt="Finding your fit" 
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <h2 className="relative text-4xl font-bold text-white">Finding your fit</h2>
                    </div>
                </div>

                {/* Why Choose Undercut Section */}
                <div className="bg-zinc-50 py-24">
                    <div className="mx-auto max-w-7xl px-8 text-center">
                        <h2 className="mb-16 text-3xl font-bold text-zinc-900">Why choose Undercut?</h2>
                        
                        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2">
                            <div className="flex flex-col items-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                                    <Wallet className="h-8 w-8 text-zinc-900" />
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-zinc-900">Best Market Prices</h3>
                                <p className="max-w-sm text-center text-zinc-600">
                                    Our AI scans thousands of listings to find deals that are significantly underpriced, saving you money instantly.
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                                    <ShieldCheck className="h-8 w-8 text-zinc-900" />
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-zinc-900">Verified Quality</h3>
                                <p className="max-w-sm text-center text-zinc-600">
                                    Every car is pre-vetted for quality and reliability, so you can drive away with complete peace of mind.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <button className="rounded-lg bg-zinc-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">
                                Sign Up Now
                            </button>
                            <button className="rounded-lg border border-zinc-200 bg-white px-8 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900">
                                Log In
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-white px-8 py-24">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="mb-12 text-3xl font-bold text-zinc-900">Find your perfect match</h2>

                        {/* Body Types */}
                        <div className="mb-12">
                            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-zinc-500">Body Type</h3>
                            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4 sm:justify-center">
                                {["SUV", "Sedan", "Coupe", "Truck", "Hatchback", "Van"].map((type) => (
                                    <button 
                                        key={type}
                                        className="flex h-24 w-32 min-w-[8rem] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 transition hover:border-zinc-900 hover:bg-white"
                                    >
                                        <span className="text-sm font-medium text-zinc-900">{type}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Power Types */}
                        <div className="mb-12">
                             <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-zinc-500">Power Source</h3>
                             <div className="flex justify-center gap-4">
                                {["Gas", "Electric", "Hybrid"].map((type) => (
                                    <button 
                                        key={type}
                                        className="rounded-full border border-zinc-200 px-6 py-2 text-sm font-medium text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
                                    >
                                        {type}
                                    </button>
                                ))}
                             </div>
                        </div>

                        {/* Search Button */}
                        <button className="w-full rounded-xl bg-zinc-900 px-8 py-4 text-lg font-bold text-white transition hover:bg-zinc-800 sm:w-auto">
                            Search Inventory
                        </button>
                    </div>
                </div>

                {/* Scrollable Brand List Section */}
                <div className="bg-zinc-50 py-24">
                    <div className="mx-auto max-w-2xl px-8 text-center">
                        <h2 className="mb-8 text-2xl font-bold text-zinc-900">Browse by Brand</h2>
                        
                        <div className="mb-8 h-64 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                            <div className="flex flex-col gap-2">
                                {["Toyota", "Honda", "Ford", "Chevrolet", "Tesla", "BMW", "Mercedes-Benz", "Audi", "Hyundai", "Kia", "Nissan", "Subaru", "Volkswagen", "Mazda", "Lexus", "Jeep", "Dodge", "Ram", "GMC", "Porsche"].map((brand) => (
                                    <button 
                                        key={brand}
                                        className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="w-full rounded-xl border-2 border-zinc-900 bg-transparent px-8 py-3 text-lg font-bold text-zinc-900 transition hover:bg-zinc-900 hover:text-white sm:w-auto">
                            Submit Selection
                        </button>
                    </div>
                </div>
            </main>
        </PageTransition>
    );
}

