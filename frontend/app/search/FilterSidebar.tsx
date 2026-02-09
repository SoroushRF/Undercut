"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterChipsGroup } from "@/components/ui/FilterChips";
import { gradeLabels } from "@/components/ui/Badge";

interface FilterSidebarProps {
    className?: string;
}

export function FilterSidebar({ className }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const [priceRange, setPriceRange] = React.useState({
        min: searchParams.get("price_min") || "",
        max: searchParams.get("price_max") || ""
    });

    const [yearRange, setYearRange] = React.useState({
        min: searchParams.get("year_min") || "",
        max: searchParams.get("year_max") || ""
    });

    const [mileageMax, setMileageMax] = React.useState(
        searchParams.get("mileage_max") || ""
    );

    const [selectedMakes, setSelectedMakes] = React.useState<string[]>(
        searchParams.getAll("make") || []
    );
    const [selectedTransmission, setSelectedTransmission] = React.useState<string | undefined>(
        searchParams.get("transmission")?.toLowerCase() || undefined
    );
    const [selectedFuelType, setSelectedFuelType] = React.useState<string | undefined>(
        searchParams.get("fuel_type")?.toLowerCase() || undefined
    );
    const [selectedGrades, setSelectedGrades] = React.useState<string[]>(
        searchParams.get("deal_grade") ? [searchParams.get("deal_grade")!] : []
    );

    // Sync state if URL changes externally (e.g. back button)
    React.useEffect(() => {
        setPriceRange({
            min: searchParams.get("price_min") || "",
            max: searchParams.get("price_max") || ""
        });
        setYearRange({
            min: searchParams.get("year_min") || "",
            max: searchParams.get("year_max") || ""
        });
        setMileageMax(searchParams.get("mileage_max") || "");
        setSelectedMakes(searchParams.getAll("make") || []);
        setSelectedTransmission(searchParams.get("transmission")?.toLowerCase() || undefined);
        setSelectedFuelType(searchParams.get("fuel_type")?.toLowerCase() || undefined);
        setSelectedGrades(searchParams.get("deal_grade") ? [searchParams.get("deal_grade")!] : []);
    }, [searchParams]);

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        
        // Price
        if (priceRange.min) params.set("price_min", priceRange.min);
        else params.delete("price_min");
        
        if (priceRange.max) params.set("price_max", priceRange.max);
        else params.delete("price_max");

        // Year
        if (yearRange.min) params.set("year_min", yearRange.min);
        else params.delete("year_min");

        if (yearRange.max) params.set("year_max", yearRange.max);
        else params.delete("year_max");

        // Mileage
        if (mileageMax) params.set("mileage_max", mileageMax);
        else params.delete("mileage_max");

        // Make (Multi-select)
        params.delete("make"); // Clear existing
        selectedMakes.forEach(make => params.append("make", make));

        // Transmission
        if (selectedTransmission) params.set("transmission", selectedTransmission);
        else params.delete("transmission");

        // Fuel Type
        if (selectedFuelType) params.set("fuel_type", selectedFuelType);
        else params.delete("fuel_type");
        
        // Deal Grade
        if (selectedGrades.length > 0) params.set("deal_grade", selectedGrades[0]);
        else params.delete("deal_grade");

        // Reset pagination
        params.delete("skip");

        router.push(`/search?${params.toString()}`);
    };

    const toggleGrade = (grade: string) => {
        if (selectedGrades.includes(grade)) {
            setSelectedGrades([]); // Single select mode for now
        } else {
            setSelectedGrades([grade]);
        }
    };

    const toggleMake = (make: string) => {
        if (selectedMakes.includes(make)) {
            setSelectedMakes(selectedMakes.filter(m => m !== make));
        } else {
            setSelectedMakes([...selectedMakes, make]);
        }
    };

    return (
        <div className={`space-y-8 ${className}`}>
             {/* Year Range */}
             <div>
                <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Year</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                        value={yearRange.min}
                        onChange={(e) => setYearRange({ ...yearRange, min: e.target.value })}
                    />
                    <span className="text-muted-foreground font-bold opacity-50 px-1">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                        value={yearRange.max}
                        onChange={(e) => setYearRange({ ...yearRange, max: e.target.value })}
                    />
                </div>
            </div>

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

            {/* Mileage */}
            <div>
                <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Max Mileage (km)</h3>
                 <input
                    type="number"
                    placeholder="Any"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                    value={mileageMax}
                    onChange={(e) => setMileageMax(e.target.value)}
                />
            </div>

            {/* Make */}
            <div>
                 <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Make</h3>
                 <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {["Tesla", "BMW", "Toyota", "Honda", "Mercedes-Benz", "Audi", "Ford", "Mazda", "Hyundai", "Kia", "Volkswagen", "Lexus", "Subaru", "Nissan", "Chevrolet"].map((make) => (
                        <label key={make} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-muted cursor-pointer transition-colors group">
                            <input 
                                type="checkbox" 
                                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary transition-all"
                                checked={selectedMakes.includes(make)}
                                onChange={() => toggleMake(make)}
                            />
                            <span className={selectedMakes.includes(make) ? "text-sm font-bold text-foreground" : "text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors"}>
                                {make}
                            </span>
                        </label>
                    ))}
                    {/* Clear selection */}
                    {selectedMakes.length > 0 && (
                         <button 
                            onClick={() => setSelectedMakes([])}
                            className="text-xs text-red-500 hover:text-red-700 font-medium pl-2"
                        >
                            Clear Selection
                        </button>
                    )}
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
                                checked={selectedGrades.includes(grade)}
                                onChange={() => toggleGrade(grade)}
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
                    value={selectedTransmission ? selectedTransmission.charAt(0).toUpperCase() + selectedTransmission.slice(1) : undefined}
                    onChange={(val) => setSelectedTransmission(selectedTransmission === val.toLowerCase() ? undefined : val.toLowerCase())}
                />
            </div>

            {/* Fuel Type */}
             <div>
                <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Fuel Type</h3>
                <FilterChipsGroup 
                    options={["Gasoline", "Hybrid", "Electric", "Diesel"]} 
                    value={selectedFuelType ? selectedFuelType.charAt(0).toUpperCase() + selectedFuelType.slice(1) : undefined}
                    onChange={(val) => setSelectedFuelType(selectedFuelType === val.toLowerCase() ? undefined : val.toLowerCase())}
                />
            </div>
            
            <button 
                onClick={handleApplyFilters}
                className="w-full rounded-xl bg-primary py-4 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
            >
                Apply Filters
            </button>
        </div>
    );
}
