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
            <main className="min-h-screen bg-zinc-50 pb-20">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Sidebar - Desktop */}
                        <aside className="hidden w-64 shrink-0 lg:block">
                            <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                                <FilterSidebar />
                            </div>
                        </aside>

                        {/* Mobile Filter Toggle (Visible only on mobile) */}
                        <div className="lg:hidden">
                            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white border border-zinc-200 p-4 font-bold text-zinc-900 shadow-sm">
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                            </button>
                        </div>

                        {/* Results Feed */}
                        <div className="flex-1">
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-bold text-zinc-900">
                                    {MOCK_CARS.length} Results
                                </h1>
                                <div className="text-sm font-medium text-zinc-500">
                                    Sort by: <span className="text-zinc-900 cursor-pointer">Relevance</span>
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
