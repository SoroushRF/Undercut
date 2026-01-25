'use client';

// frontend/components/ui/DealCard.tsx
import * as React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { MapPin, Gauge, Cpu } from "lucide-react";

export interface DealCardProps {
    id: string;
    make: string;
    model: string;
    year: number;
    trim?: string;
    price: number;
    mileage: number;
    location: string;
    grade: "S" | "A" | "B" | "C" | "F";
    imageUrl?: string;
    className?: string;
    onClick?: () => void;
}

export function DealCard({
    make,
    model,
    year,
    trim,
    price,
    mileage,
    location,
    grade,
    imageUrl,
    className,
    onClick,
}: DealCardProps) {
    return (
        <Card
            className={cn(
                "group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-transparent hover:border-border",
                className
            )}
            onClick={onClick}
        >
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={`${year} ${make} ${model}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        <Cpu className="h-12 w-12 opacity-20" />
                    </div>
                )}

                {/* Grade Badge Overlay */}
                <div className="absolute left-4 top-4">
                    <Badge grade={grade} className="px-3 py-1 text-sm shadow-lg">
                        Tier {grade}
                    </Badge>
                </div>

                {/* Price Tag Overlay */}
                <div className="absolute bottom-4 right-4 rounded-xl bg-black/80 px-3 py-1.5 text-lg font-bold text-white backdrop-blur-md">
                    ${price.toLocaleString()}
                </div>
            </div>

            <CardContent className="p-5">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                        {year} {make} {model}
                    </h3>
                    {trim && <p className="text-sm font-medium text-muted-foreground line-clamp-1">{trim}</p>}
                </div>

                <div className="mt-4 flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Gauge className="h-4 w-4" />
                        <span className="text-sm font-medium">{(mileage / 1000).toFixed(1)}k km</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm font-medium">{location}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="px-5 pb-5 pt-0">
                <div className="w-full rounded-xl bg-muted p-2 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    View Full Analysis
                </div>
            </CardFooter>
        </Card>
    );
}
