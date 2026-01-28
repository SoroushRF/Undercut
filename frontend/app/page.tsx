// Bug fixed by Architect - 'use client' added to SearchInput.tsx
import { Navbar } from "@/components/ui/Navbar";
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
            <main className="min-h-screen bg-background p-8">
                <div className="mx-auto max-w-7xl">
                    <section className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Trending Deals</h1>
                        <p className="text-muted-foreground mt-1">Find the best underpriced cars in the market.</p>
                    </section>

                    {/* Task 4.1: TCO Chart - Market Analysis Preview */}
                    <section className="mb-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-foreground mb-2">Market Analysis Preview</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            5-year cost of ownership comparison. Select a timeframe to see projected costs.
                        </p>
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
