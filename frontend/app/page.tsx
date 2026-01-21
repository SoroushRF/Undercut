import { MOCK_CARS } from "@/lib/mock-data";
import { TcoChart } from "@/components/viz/TcoChart";
import { SoldBadge } from "@/components/motion/SoldBadge";
import { FreshnessBadge } from "@/components/motion/FreshnessBadge";
import { CardHover } from "@/components/motion/CardHover";
import { PageTransition } from "@/components/motion/PageTransition";

export default function Home() {
    return (
        <PageTransition>
            <main className="min-h-screen bg-background p-8">
                <div className="mx-auto max-w-6xl space-y-8">
                    <section className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-primary">Trending Deals</h1>
                        <p className="text-muted-foreground">Find the best underpriced cars in the market.</p>
                    </section>

                    {/* Show TCO Chart for the first specialized deal (Mock Demo) */}
                    <section className="bg-muted/30 p-6 rounded-xl border">
                        <h2 className="text-2xl font-bold mb-4">Market Analysis Preview</h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <p className="mb-4 text-sm text-muted-foreground">
                                    This chart visualizes the 5-year cost of ownership for a 2021 Tesla Model 3 vs Market Average.
                                    Undercut analyzes depreciation, insurance, and fuel costs to find clear arbitrage opportunities.
                                </p>
                                <TcoChart />
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {MOCK_CARS.map((car) => (
                            <CardHover key={car.id} className="cursor-pointer">
                                <div className="rounded-lg border bg-card text-card-foreground shadow-sm relative overflow-hidden h-full">
                                    {/* Status Overlay */}
                                    {car.status === 'sold' && <SoldBadge />}

                                    <div className="p-6 space-y-4">
                                        <div className="relative">
                                            {car.image_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={car.image_url} alt={`${car.make} ${car.model}`} className="aspect-video w-full rounded-md object-cover" />
                                            ) : (
                                                <div className="aspect-video w-full rounded-md bg-muted flex items-center justify-center">
                                                    <span className="text-muted-foreground">No Image</span>
                                                </div>
                                            )}
                                            {/* Freshness Badge overlay on image */}
                                            {car.last_seen_at && (
                                                <div className="absolute top-2 right-2">
                                                    <FreshnessBadge timestamp="2h ago" />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold">{car.year} {car.make} {car.model}</h3>
                                            <p className="text-sm text-muted-foreground">{car.trim}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold">${car.price.toLocaleString()}</span>
                                            {/* ROI / Financial Intelligence Indicator */}
                                            <div className="text-right">
                                                {car.deal_grade === 'S' || car.deal_grade === 'A' ? (
                                                    <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                                                        <span>Generates Equity</span>
                                                    </span>
                                                ) : car.deal_grade === 'F' ? (
                                                    <span className="text-red-500 text-xs font-medium">Overpriced</span>
                                                ) : (
                                                    <span className="text-gray-500 text-xs font-medium">Fair Market Value</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHover>
                        ))}
                    </div>
                </div>
            </main>
        </PageTransition>
    );
}
