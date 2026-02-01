"use client";

import * as React from "react";
import { FilterChipsGroup } from "@/components/ui/FilterChips";

interface FilterSidebarProps {
    className?: string;
}

export function FilterSidebar({ className }: FilterSidebarProps) {
    // In a real app, these would be controlled by URL state or a parent handler
    const [priceRange, setPriceRange] = React.useState({ min: "", max: "" });
    const [selectedMake, setSelectedMake] = React.useState<string | undefined>();
    const [selectedTransmission, setSelectedTransmission] = React.useState<string | undefined>();

    return (
        <div className={`space-y-8 ${className}`}>
             {/* Price Range */}
            <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900">Price Range</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    />
                    <span className="text-zinc-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    />
                </div>
            </div>

            {/* Make */}
            <div>
                 <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900">Make</h3>
                 <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {["Tesla", "BMW", "Toyota", "Honda", "Mercedes-Benz", "Audi", "Ford", "Mazda"].map((make) => (
                        <label key={make} className="flex items-center gap-3 rounded-lg p-2 hover:bg-zinc-100 cursor-pointer transition">
                            <input 
                                type="radio" 
                                name="make" 
                                className="h-4 w-4 rounded-full border-zinc-300 text-black focus:ring-black"
                                checked={selectedMake === make}
                                onChange={() => setSelectedMake(make)}
                            />
                            <span className="text-sm font-medium text-zinc-700">{make}</span>
                        </label>
                    ))}
                 </div>
            </div>

             {/* Deal Grade */}
             <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900">Deal Grade</h3>
                <div className="space-y-2">
                    {["S", "A", "B", "C", "F"].map((grade) => (
                        <label key={grade} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black" />
                            <span className="text-sm font-medium text-zinc-700">Tier {grade}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Transmission */}
            <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900">Transmission</h3>
                <FilterChipsGroup 
                    options={["Automatic", "Manual", "CVT"]} 
                    value={selectedTransmission}
                    onChange={setSelectedTransmission}
                />
            </div>
            
            <button className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white shadow-md transition hover:bg-zinc-800 active:scale-95">
                Apply Filters
            </button>
        </div>
    );
}
