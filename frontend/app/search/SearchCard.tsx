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
    className?: string; // Allow minimal styling injection if needed, but rely on internal styles primarily
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
                    "group flex w-full overflow-hidden rounded-xl border border-transparent bg-white transition-all duration-300 hover:border-zinc-200 hover:shadow-lg hover:-translate-y-0.5",
                    className
                )}
            >
                {/* Image Section - Fixed width/aspect */}
                <div className="relative h-40 w-40 shrink-0 overflow-hidden bg-zinc-100 sm:h-48 sm:w-64">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={`${year} ${make} ${model}`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-4xl text-zinc-300">
                            🚗
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
                    <div>
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="text-lg font-bold text-zinc-900 line-clamp-1 sm:text-xl">
                                {year} {make} {model}
                            </h3>
                            <Badge grade={grade} className="shrink-0 shadow-sm">
                                {gradeLabels[grade]}
                            </Badge>
                        </div>
                    </div>

                    <div className="mt-2">
                        <p className="text-2xl font-bold text-zinc-900">
                            ${price.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
