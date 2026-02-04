"use client";

import * as React from "react";
import Link from "next/link";
import { Badge, gradeLabels } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface SearchCardProps {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    grade: "S" | "A" | "B" | "C" | "D" | "F";
    imageUrl?: string;
    className?: string;
}

export function SearchCard({
    id,
    make,
    model,
    year,
    price,
    grade,
    imageUrl,
    className,
}: SearchCardProps) {
    return (
        <Link href={`/cars/${id}`} className="block w-full">
            <div
                className={cn(
                    "group flex w-full overflow-hidden rounded-xl border border-transparent bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-0.5",
                    className
                )}
            >
                {/* Image Section - Fixed width/aspect */}
                <div className="relative h-40 w-40 shrink-0 overflow-hidden bg-muted sm:h-48 sm:w-64">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={`${year} ${make} ${model}`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl text-muted-foreground">
                            🚗
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
                    <div>
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="text-lg font-bold text-foreground line-clamp-1 sm:text-xl">
                                {year} {make} {model}
                            </h3>
                            <Badge grade={grade} className="shrink-0 shadow-sm border-transparent">
                                Tier {grade}
                            </Badge>
                        </div>
                    </div>

                    <div className="mt-2 text-right sm:text-left">
                        <p className="text-2xl font-black text-primary">
                            ${price.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
