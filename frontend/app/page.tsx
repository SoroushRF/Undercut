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
            <main className="min-h-screen bg-zinc-50 p-8">
                <div className="mx-auto max-w-7xl">
                    <section className="mb-8">
                        <h1 className="text-3xl font-bold text-zinc-900">Trending Deals</h1>
                        <p className="text-zinc-500 mt-1">Find the best underpriced cars in the market.</p>
                    </section>

                    {/* Task 4.1: TCO Chart - Market Analysis Preview */}
                    <section className="mb-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-zinc-900 mb-2">Market Analysis Preview</h2>
                        <p className="text-sm text-zinc-500 mb-4">
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
"use client";

import { useCars } from "@/hooks/use-cars";

export default function Home() {
  const { cars, loading } = useCars();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Undercut - The Integrator
        </p>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <h1 className="text-4xl font-bold">Latest Deals</h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-4">
        {loading ? (
            <p>Loading cars...</p>
        ) : (
            cars.map((car) => (
            <div
                key={car.id}
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            >
                <h2 className={`mb-3 text-2xl font-semibold`}>
                {car.year} {car.make} {car.model}{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                    -&gt;
                </span>
                </h2>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                {car.trim} - ${car.price.toLocaleString()}
                </p>
                <p className="text-xs mt-2 text-green-500 font-bold">
                    Grade: {car.deal_grade}
                </p>
            </div>
            ))
        )}
      </div>
    </main>
  );
}
