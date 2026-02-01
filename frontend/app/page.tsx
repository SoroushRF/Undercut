'use client';

import * as React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { DealCard } from "@/components/ui/DealCard";
import { MOCK_CARS } from "@/lib/mock-data";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/Sheet";
import { FilterChipsGroup } from "@/components/ui/FilterChips";
import { Slider } from "@/components/ui/Sliders";
import { Select } from "@/components/ui/Select";

// UX Engineer Motion Components
import { CardHover } from "@/components/motion/CardHover";
import { SoldBadge } from "@/components/motion/SoldBadge";
import { FreshnessBadge } from "@/components/motion/FreshnessBadge";
import { PageTransition } from "@/components/motion/PageTransition";

// UX Engineer Visualization Components
import { TcoChart } from "@/components/viz/TcoChart";

export default function Home() {
    const [priceRange, setPriceRange] = React.useState<[number, number]>([5000, 85000]);
    const [selectedBrand, setSelectedBrand] = React.useState<string>("All");
    const [sortBy, setSortBy] = React.useState<string>("Newest");

    const brands = ["All", "Tesla", "BMW", "Audi", "Porsche", "Mercedes"];
    const sortOptions = [
        { label: "Newest first", value: "Newest" },
        { label: "Price: Low to High", value: "PriceLow" },
        { label: "Price: High to Low", value: "PriceHigh" },
        { label: "Mileage: Lowest first", value: "Mileage" },
    ];

    return (
        <PageTransition>
            <Navbar />
            <main className="min-h-screen bg-background pb-20 pt-8 px-4 sm:px-8">
                <div className="mx-auto max-w-7xl">
                    <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-foreground">Trending Deals</h1>
                            <p className="text-muted-foreground mt-1 text-lg">Find the best underpriced cars in the market.</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="gap-2 rounded-xl shadow-sm">
                                        <SlidersHorizontal className="h-4 w-4" />
                                        Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent className="w-full sm:max-w-md">
                                    <SheetHeader>
                                        <SheetTitle className="text-2xl font-black">Refine Search</SheetTitle>
                                        <SheetDescription>
                                            Adjust your preferences to find the perfect deal.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-8 space-y-8">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Price Range</h4>
                                            <Slider
                                                min={0}
                                                max={150000}
                                                step={1000}
                                                value={priceRange}
                                                onChange={(val) => setPriceRange(val as [number, number])}
                                                showLabels
                                                formatLabel={(v) => `$${(v / 1000).toFixed(0)}k`}
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Popular Brands</h4>
                                            <FilterChipsGroup
                                                options={brands}
                                                value={selectedBrand}
                                                onChange={setSelectedBrand}
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Sort By</h4>
                                            <Select
                                                options={sortOptions}
                                                value={sortBy}
                                                onChange={(val) => setSortBy(val as string)}
                                            />
                                        </div>

                                        <div className="pt-8 border-t border-border flex gap-3">
                                            <Button variant="outline" className="flex-1" onClick={() => {
                                                setPriceRange([5000, 85000]);
                                                setSelectedBrand("All");
                                            }}>Reset</Button>
                                            <Button className="flex-[2]">Apply Results</Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <Button variant="outline" className="sm:hidden gap-2 rounded-xl shadow-sm">
                                <ArrowUpDown className="h-4 w-4" />
                            </Button>
                        </div>
                    </section>

                    {/* Task 4.1: TCO Chart - Market Analysis Preview */}
                    <section className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">Market Analysis Preview</h2>
                                <p className="text-sm text-muted-foreground">
                                    5-year cost of ownership comparison.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="secondary" className="text-xs">Compact</Button>
                                <Button size="sm" variant="ghost" className="text-xs opacity-50">SUV</Button>
                                <Button size="sm" variant="ghost" className="text-xs opacity-50">Luxury</Button>
                            </div>
                        </div>
                        <TcoChart />
                    </section>

                    {/* Tasks 3.1, 3.2, 3.3: DealCards with CardHover, SoldBadge, FreshnessBadge */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {MOCK_CARS.map((car) => (
                            <CardHover key={car.id}>
                                <div className="relative">
                                    {/* Task 3.2: SoldBadge overlay for sold cars */}
                                    {car.status === "sold" && <SoldBadge />}

                                    {/* Task 3.3: FreshnessBadge overlay */}
                                    {car.last_seen_at && (
                                        <div className="absolute top-3 right-3 z-20">
                                            <FreshnessBadge timestamp="2h ago" />
                                        </div>
                                    )}

                                    <DealCard
                                        id={car.id}
                                        make={car.make}
                                        model={car.model}
                                        year={car.year}
                                        trim={car.trim || undefined}
                                        price={car.price}
                                        mileage={car.mileage}
                                        location={car.postal_code || "Toronto, ON"}
                                        grade={(car.deal_grade || "C") as "S" | "A" | "B" | "C" | "F"}
                                        imageUrl={car.image_url || undefined}
                                    />
                                </div>
                            </CardHover>
                        ))}
                    </div>
                </div>
            </main>
        </PageTransition>
    );
}
