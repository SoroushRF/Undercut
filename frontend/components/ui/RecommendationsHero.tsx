'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api';
import { Badge, gradeLabels } from '@/components/ui/Badge';

interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    deal_grade: string;
    image_url?: string;
    listing_url?: string;
    body_type?: string;
}

interface RecommendationsHeroProps {
    preferences?: {
        max_budget: number;
        body_types: string[];
        priority: string;
    };
}

export function RecommendationsHero({ preferences }: RecommendationsHeroProps) {
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setIsLoading(true);
            try {
                // Get preferences from localStorage or use defaults
                const stored = localStorage.getItem('userPreferences');
                const prefs = stored ? JSON.parse(stored) : {
                    max_budget: 40000,
                    body_types: [],
                    daily_commute_km: 30,
                    priority: 'deal',
                    additional_instructions: ''
                };

                const res = await fetch(`${API_BASE_URL}/cars/recommendations?limit=6`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(prefs)
                });

                if (!res.ok) throw new Error('Failed to fetch recommendations');
                
                const data = await res.json();
                setCars(data);
            } catch (e) {
                console.error(e);
                setError('Unable to load recommendations');
                // Fallback to regular search
                try {
                    const fallback = await fetch(`${API_BASE_URL}/cars?limit=6`);
                    if (fallback.ok) {
                        setCars(await fallback.json());
                    }
                } catch { }
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-violet-50/30 to-zinc-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 pb-32 pt-20">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/2 h-full w-full rounded-full bg-white/5 blur-3xl animate-pulse" />
                    <div className="absolute -bottom-1/2 -right-1/2 h-full w-full rounded-full bg-violet-400/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm mb-6">
                            <Sparkles className="h-4 w-4" />
                            Powered by AI Matching
                        </div>
                        
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Your Perfect Matches
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-violet-100">
                            Based on your preferences, we've found the best deals just for you.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Cards Section - Overlaps Hero */}
            <div className="relative -mt-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-violet-500 mx-auto mb-4" />
                            <p className="text-zinc-500 font-medium">Finding your perfect matches...</p>
                        </div>
                    </div>
                ) : error && cars.length === 0 ? (
                    <div className="rounded-2xl bg-white p-12 text-center shadow-xl border border-zinc-200">
                        <div className="text-4xl mb-4">😔</div>
                        <h3 className="text-lg font-bold text-zinc-900">No matches found</h3>
                        <p className="text-zinc-500 mb-6">Try adjusting your preferences or check back later.</p>
                        <Link href="/profile?mode=preferences">
                            <button className="rounded-xl bg-violet-600 px-6 py-3 font-bold text-white hover:bg-violet-700 transition">
                                Update Preferences
                            </button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Top 3 Section */}
                        <div className="mb-8">
                            <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-amber-500" />
                                Top 3 Best Matches for You
                            </h2>
                            <div className="grid gap-6 md:grid-cols-3">
                                {cars.slice(0, 3).map((car, index) => (
                                    <motion.div
                                        key={car.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                    >
                                                <div className={`group relative rounded-2xl bg-white p-6 shadow-xl border-2 transition-all hover:scale-[1.02] hover:shadow-2xl ${
                                                    index === 0 ? 'border-amber-400 ring-2 ring-amber-100' : 'border-zinc-200'
                                                }`}>
                                                    {/* AI Analysis Link - Top Right */}
                                                    <Link 
                                                        href={`/cars/${car.id}`}
                                                        className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg hover:bg-violet-700 hover:scale-105 transition-all"
                                                    >
                                                        <Sparkles className="h-3 w-3" />
                                                        AI Analysis
                                                    </Link>

                                                    {/* Main Card Content (Goes to Listing) */}
                                                    <a 
                                                        href={car.listing_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block"
                                                    >
                                                        {/* Rank Badge */}
                                                        <div className={`absolute -top-3 -left-3 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg z-10 ${
                                                            index === 0 ? 'bg-amber-400 text-amber-900' :
                                                            index === 1 ? 'bg-zinc-300 text-zinc-700' :
                                                            'bg-orange-300 text-orange-800'
                                                        }`}>
                                                            #{index + 1}
                                                        </div>

                                                        {/* Image */}
                                                        <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100 mb-4">
                                                            {car.image_url ? (
                                                                <img
                                                                    src={car.image_url}
                                                                    alt={`${car.year} ${car.make} ${car.model}`}
                                                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full flex items-center justify-center text-4xl">🚗</div>
                                                            )}
                                                        </div>

                                                        {/* Info */}
                                                        <div className="space-y-2">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h3 className="font-bold text-zinc-900 text-lg">
                                                                        {car.year} {car.make} {car.model}
                                                                    </h3>
                                                                    <p className="text-sm text-zinc-500">
                                                                        {car.mileage?.toLocaleString()} km • {car.body_type || 'Vehicle'}
                                                                    </p>
                                                                </div>
                                                                <Badge grade={car.deal_grade as any} className="shrink-0">
                                                                    {gradeLabels[car.deal_grade] || car.deal_grade}
                                                                </Badge>
                                                            </div>

                                                            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                                                                <span className="text-2xl font-bold text-zinc-900">
                                                                    ${car.price?.toLocaleString()}
                                                                </span>
                                                                <span className="text-sm font-medium text-violet-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                                                    View Deal <ChevronRight className="h-4 w-4" />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* More Matches */}
                        {cars.length > 3 && (
                            <div>
                                <h2 className="text-lg font-bold text-zinc-900 mb-4">More Great Deals</h2>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {cars.slice(3, 6).map((car, index) => (
                                        <motion.div
                                            key={car.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                        >
                                            <a 
                                                href={car.listing_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block group"
                                            >
                                                <div className="group rounded-xl bg-white p-4 shadow-md border border-zinc-200 transition-all hover:shadow-lg hover:border-violet-200 relative">
                                                    {/* Internal Link icon for Detail Page */}
                                                    <Link 
                                                        href={`/cars/${car.id}`}
                                                        className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-zinc-50 text-zinc-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                                                        onClick={(e) => e.stopPropagation()}
                                                        title="AI Analysis"
                                                    >
                                                        <Sparkles className="h-4 w-4" />
                                                    </Link>

                                                    <div className="flex gap-4">
                                                        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                                                            {car.image_url ? (
                                                                <img
                                                                    src={car.image_url}
                                                                    alt={`${car.year} ${car.make} ${car.model}`}
                                                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full flex items-center justify-center text-2xl">🚗</div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-zinc-900 truncate">
                                                                {car.year} {car.make} {car.model}
                                                            </h3>
                                                            <p className="text-sm text-zinc-500">{car.mileage?.toLocaleString()} km</p>
                                                            <div className="flex items-center justify-between mt-2">
                                                                <span className="font-bold text-zinc-900">${car.price?.toLocaleString()}</span>
                                                                <Badge grade={car.deal_grade as any} className="text-xs">
                                                                    {car.deal_grade}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="mt-12 text-center">
                            <Link href="/search">
                                <button className="rounded-xl bg-zinc-900 px-8 py-4 font-bold text-white shadow-lg hover:bg-zinc-800 hover:scale-105 transition-all">
                                    Browse All Listings →
                                </button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
