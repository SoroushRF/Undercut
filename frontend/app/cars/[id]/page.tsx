import { MOCK_CARS } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Badge } from "@/components/ui/Badge";
import { SoldBadge } from "@/components/motion/SoldBadge";
import { FreshnessBadge } from "@/components/motion/FreshnessBadge";
import { Gauge, MapPin, Trophy, Calendar, Cog, Fuel, RotateCw, DollarSign } from "lucide-react";
import Link from "next/link";
import { PageTransition } from "@/components/motion/PageTransition";

interface PageProps {
    params: {
        id: string;
    };
}

export default function CarDetailPage({ params }: PageProps) {
    const car = MOCK_CARS.find((c) => c.id === params.id);

    if (!car) {
        notFound();
    }

    // Determine badge to show
    const showSoldBadge = car.status === "sold";
    // For this demo, let's assume if it's not sold, we might show freshness if it has last_seen_at
    const showFreshnessBadge = !showSoldBadge && !!car.last_seen_at;

    return (
        <PageTransition>
            <Navbar />
            <main className="min-h-screen bg-zinc-50 pb-20">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
                        <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-zinc-900 font-medium">{car.make} {car.model}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                        {/* Left Column: Images */}
                        <div className="space-y-4">
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-md">
                                {car.image_url ? (
                                    <img
                                        src={car.image_url}
                                        alt={`${car.year} ${car.make} ${car.model}`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                        <div className="text-center">
                                            <div className="text-6xl mb-4">🚗</div>
                                            <p className="font-medium">No Image Available</p>
                                        </div>
                                    </div>
                                )}

                                {/* Overlay Badges */}
                                {showSoldBadge && <SoldBadge />}
                                {showFreshnessBadge && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <FreshnessBadge timestamp="2h ago" />
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail strip (Visual only for now since mock data only has 1 image) */}
                            <div className="grid grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="aspect-[4/3] rounded-xl bg-zinc-200 overflow-hidden cursor-pointer hover:opacity-80 transition active:scale-95">
                                        {car.image_url && <img src={car.image_url} className="h-full w-full object-cover opacity-50 hover:opacity-100 transition" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="flex flex-col">
                            <div className="border-b border-zinc-200 pb-6 mb-6">
                                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl mb-2">
                                    {car.year} {car.make} {car.model}
                                </h1>
                                {car.trim && (
                                    <p className="text-xl text-zinc-500 font-medium">{car.trim}</p>
                                )}
                            </div>

                            <div className="flex items-end justify-between mb-8">
                                <div>
                                    <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-1">Price</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-4xl font-bold text-zinc-900">
                                            ${car.price.toLocaleString()}
                                        </span>
                                        <span className="text-sm font-medium text-zinc-500 self-end mb-1.5">{car.currency}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Deal Grade</p>
                                    <Badge grade={car.deal_grade as "S" | "A" | "B" | "C" | "D" | "F"} className="text-lg px-4 py-1.5 shadow-sm">
                                        Tier {car.deal_grade}
                                    </Badge>
                                </div>
                            </div>

                            {/* Specifications Grid */}
                            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm mb-8">
                                <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                    <Cog className="h-5 w-5 text-zinc-500" />
                                    Specifications
                                </h3>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-500">
                                            <Gauge className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase">Mileage</p>
                                            <p className="text-zinc-900 font-semibold">{car.mileage.toLocaleString()} km</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-500">
                                            <RotateCw className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase">Transmission</p>
                                            <p className="text-zinc-900 font-semibold capitalize">{car.transmission}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-500">
                                            <Fuel className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase">Fuel Type</p>
                                            <p className="text-zinc-900 font-semibold capitalize">{car.fuel_type ? car.fuel_type.replace('_', ' ') : 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-500">
                                            <Cog className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase">Drivetrain</p>
                                            <p className="text-zinc-900 font-semibold uppercase">{car.drivetrain}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-500">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase">Location</p>
                                            <p className="text-zinc-900 font-semibold">{car.postal_code || "Unknown"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-500">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 font-medium uppercase">Year</p>
                                            <p className="text-zinc-900 font-semibold">{car.year}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="font-bold text-zinc-900 mb-2">Description</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    {car.description}
                                </p>
                            </div>

                            {/* AI Verdict */}
                            {car.ai_verdict && (
                                <div className="mb-8 rounded-xl bg-indigo-50 p-4 border border-indigo-100">
                                    <h3 className="font-bold text-indigo-900 mb-1 flex items-center gap-2">
                                        <Trophy className="h-4 w-4" />
                                        AI Verdict
                                    </h3>
                                    <p className="text-indigo-800 text-sm">
                                        {car.ai_verdict}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                                <button className="flex-1 rounded-xl bg-zinc-900 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98]">
                                    Contact Seller
                                </button>
                                <button className="flex-1 rounded-xl border border-zinc-200 bg-white px-6 py-4 text-base font-bold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300">
                                    Make an Offer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </PageTransition>
    );
}
