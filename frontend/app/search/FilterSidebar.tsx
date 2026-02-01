"use client";

import * as React from "react";
import { FilterChipsGroup } from "@/components/ui/FilterChips";
import { gradeLabels } from "@/components/ui/Badge";

interface FilterSidebarProps {
    className?: string;
}

export function FilterSidebar({ className }: FilterSidebarProps) {
    const [priceRange, setPriceRange] = React.useState({ min: "", max: "" });
    const [selectedMake, setSelectedMake] = React.useState<string | undefined>();
    const [selectedTransmission, setSelectedTransmission] = React.useState<string | undefined>();

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Price Range */}
            <div>
                <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Price Range</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    />
                    <span className="text-muted-foreground font-bold opacity-50 px-1">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    />
                </div>
            </div>

            {/* Make */}
            <div>
                <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Make</h3>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {["Tesla", "BMW", "Toyota", "Honda", "Mercedes-Benz", "Audi", "Ford", "Mazda"].map((make) => (
                        <label key={make} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-muted cursor-pointer transition-colors group">
                            <input
                                type="radio"
                                name="make"
                                className="h-4 w-4 border-border bg-background text-primary focus:ring-primary transition-all"
                                checked={selectedMake === make}
                                onChange={() => setSelectedMake(make)}
                            />
                            <span className={make === selectedMake ? "text-sm font-bold text-foreground" : "text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors"}>
                                {make}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Deal Grade */}
            <div>
                <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Deal Grade</h3>
                <div className="grid grid-cols-3 gap-2">
                    {["S", "A", "B", "C", "D", "F"].map((grade) => (
                        <label key={grade} className="flex flex-col items-center gap-2 cursor-pointer group rounded-lg border border-border/50 p-2 hover:bg-muted/50 transition-colors">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary transition-all"
                            />
                            <span className="text-[10px] font-black uppercase tracking-tight group-hover:text-primary transition-colors text-center" title={gradeLabels[grade]}>
                                {grade}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Transmission */}
            <div>
                <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Transmission</h3>
                <FilterChipsGroup
                    options={["Automatic", "Manual", "CVT"]}
                    value={selectedTransmission}
                    onChange={setSelectedTransmission}
                />
            </div>

            <button className="w-full rounded-xl bg-primary py-4 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95">
                Apply Filters
            </button>
        </div>
    );
}
