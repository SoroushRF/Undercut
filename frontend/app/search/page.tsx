import { Navbar } from "@/components/ui/Navbar";
import { FilterSidebar } from "./FilterSidebar";
import { SearchCard } from "./SearchCard";
import { MOCK_CARS } from "@/lib/mock-data";
import { PageTransition } from "@/components/motion/PageTransition";
import { SlidersHorizontal } from "lucide-react";

export default function SearchPage() {
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
                            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <FilterSidebar />
                            </div>
                        </aside>

                        {/* Mobile Filter Toggle (Visible only on mobile) */}
                        <div className="lg:hidden">
                            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-card border border-border p-4 font-bold text-foreground shadow-sm">
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                            </button>
                        </div>

                        {/* Results Feed */}
                        <div className="flex-1">
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-bold text-foreground">
                                    {MOCK_CARS.length} Results
                                </h1>
                                <div className="text-sm font-medium text-muted-foreground">
                                    Sort by: <span className="text-foreground cursor-pointer font-bold">Relevance</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {MOCK_CARS.map((car) => (
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
                        </div>
                    </div>
                </div>
            </main>
        </PageTransition>
    );
}
