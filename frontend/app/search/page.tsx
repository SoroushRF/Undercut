import { Navbar } from "@/components/ui/Navbar";
import { FilterSidebar } from "./FilterSidebar";
import { SearchCard } from "./SearchCard";
import { PageTransition } from "@/components/motion/PageTransition";
import { SlidersHorizontal } from "lucide-react";
import { carService } from "@/lib/api";
import { Car } from "@/lib/types";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";

interface SearchPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    // Construct filters from searchParams
    const filters = {
        query: searchParams.query as string,
        // searchParams.make can be string or string[]
        make: searchParams.make 
            ? (Array.isArray(searchParams.make) ? searchParams.make : [searchParams.make]) 
            : undefined,
        model: searchParams.model as string,
        year_min: searchParams.year_min ? Number(searchParams.year_min) : undefined,
        year_max: searchParams.year_max ? Number(searchParams.year_max) : undefined,
        price_min: searchParams.price_min ? Number(searchParams.price_min) : undefined,
        price_max: searchParams.price_max ? Number(searchParams.price_max) : undefined,
        mileage_max: searchParams.mileage_max ? Number(searchParams.mileage_max) : undefined,
        transmission: searchParams.transmission as string,
        fuel_type: searchParams.fuel_type as string,
        deal_grade: searchParams.deal_grade as string,
        skip: searchParams.skip ? Number(searchParams.skip) : 0,
        limit: 50, 
    };

    // clean undefined
    const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined)
    );

    let cars: Car[] = [];
    try {
        cars = await carService.search(cleanFilters);
    } catch (error) {
        console.error("Failed to load cars", error);
        // We could also show an error UI here
    }

    return (
        <PageTransition>
            <Navbar />

            {/* Dynamic Ambient Background Glows */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px] transition-colors duration-1000" />
                <div className="absolute top-[40%] -right-[10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px] transition-colors duration-1000" />
            </div>

            <main className="min-h-screen bg-transparent pb-20">
                <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Sidebar - Desktop */}
                        <aside className="hidden w-64 shrink-0 lg:block">
                            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-sm custom-scrollbar">
                                <FilterSidebar />
                            </div>
                        </aside>

                        {/* Mobile Filter Toggle (Visible only on mobile) */}
                         <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-card border border-border p-4 font-bold text-foreground shadow-sm transition hover:bg-muted/50">
                                        <SlidersHorizontal className="h-4 w-4" />
                                        Filters
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="left" className="overflow-y-auto w-full sm:max-w-md">
                                    <div className="py-4">
                                        <h2 className="mb-6 text-xl font-bold">Filters</h2>
                                        <FilterSidebar />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Results Feed */}
                        <div className="flex-1">
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-bold text-foreground">
                                    {cars.length} Results
                                </h1>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Sort by: <span className="text-foreground cursor-pointer font-bold">Relevance</span>
                                </div>
                            </div>

                            {cars.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
                                    <div className="mb-4 text-4xl">🔍</div>
                                    <h3 className="text-lg font-bold text-foreground">No cars found</h3>
                                    <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {cars.map((car) => (
                                        <SearchCard
                                            key={car.id}
                                            id={car.id}
                                            make={car.make}
                                            model={car.model}
                                            year={car.year}
                                            price={car.price}
                                            grade={car.deal_grade as "S" | "A" | "B" | "C" | "D" | "F"}
                                            imageUrl={car.image_url || undefined}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </PageTransition>
    );
}
