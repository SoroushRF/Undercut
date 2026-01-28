"use client";

import { useState } from "react";
import { carService } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function SearchSection() {
    const [isLoading, setIsLoading] = useState(false);

    // Filters State
    const [bodyType, setBodyType] = useState<string | null>(null);
    const [powerSource, setPowerSource] = useState<string | null>(null);

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const filters: any = {};
            if (bodyType) filters.style = bodyType; // Note: Adapter might be needed if backend field is different (e.g. 'type' vs 'style')
            if (powerSource) filters.fuel_type = powerSource.toLowerCase();

            // Just a test call to show it works
            console.log("Searching with filters:", filters);
            
            // For now, let's just use the search endpoint to prove connectivity
            // In a real app, this would redirect to /search page with query params
            // or fetch results and display them here.
            
            const results = await carService.search(filters);
            console.log("Results:", results);
            
            if (results.length > 0) {
                 toast.success(`Found ${results.length} cars!`);
            } else {
                 toast.info("No cars found matching your criteria.");
            }

        } catch (error) {
            console.error("Search failed:", error);
            toast.error("Failed to connect to backend. Is it running?");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-card px-8 py-24 border-y border-border">
            <div className="mx-auto max-w-4xl text-center">
                <h2 className="mb-12 text-3xl font-bold text-foreground">Find your perfect match</h2>

                {/* Body Types */}
                <div className="mb-12">
                    <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Body Type</h3>
                    <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4 sm:justify-center">
                        {["SUV", "Sedan", "Coupe", "Truck", "Hatchback", "Van"].map((type) => (
                            <button 
                                key={type}
                                onClick={() => setBodyType(type === bodyType ? null : type)}
                                className={`flex h-24 w-32 min-w-[8rem] flex-col items-center justify-center rounded-xl border transition hover:border-primary hover:bg-card
                                    ${bodyType === type 
                                        ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2 ring-offset-background" 
                                        : "border-border bg-secondary/10"
                                    }`}
                            >
                                <span className={`text-sm font-medium ${bodyType === type ? "text-primary" : "text-foreground"}`}>
                                    {type}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Power Types */}
                <div className="mb-12">
                        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Power Source</h3>
                        <div className="flex justify-center gap-4 flex-wrap">
                        {["Gas", "Electric", "Hybrid"].map((type) => (
                            <button 
                                key={type}
                                onClick={() => setPowerSource(type === powerSource ? null : type)}
                                className={`rounded-full border px-6 py-2 text-sm font-medium transition hover:border-primary hover:text-primary
                                    ${powerSource === type
                                        ? "border-primary bg-primary text-primary-foreground hover:text-primary-foreground hover:bg-primary/90"
                                        : "border-border text-muted-foreground"
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                        </div>
                </div>

                {/* Search Button */}
                <button 
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="w-full rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition hover:opacity-90 sm:w-auto disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : null}
                    {isLoading ? "Searching..." : "Search Inventory"}
                </button>
            </div>
        </div>
    );
}
