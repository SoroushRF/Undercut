'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import { Slider } from "./Slider";
import { ChevronRight, ChevronLeft, Wallet, Car, Zap, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/motion/PageTransition";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Body Types for Step 2
const BODY_TYPES = [
    { name: "SUV", emoji: "🚙" },
    { name: "Sedan", emoji: "🚗" },
    { name: "Truck", emoji: "🛻" },
    { name: "Hatchback", emoji: "🚘" },
    { name: "Coupe", emoji: "🏎️" },
    { name: "Van", emoji: "🚐" },
];

import { API_BASE_URL } from "@/lib/api";

const API_URL = API_BASE_URL;

export default function ProfilePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, login } = useAuth();
    
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [direction, setDirection] = useState(0);

    // Simplified Preferences State
    const [preferences, setPreferences] = useState({
        maxBudget: 35000,
        bodyTypes: [] as string[],
        dailyCommute: 30, // KM per day for TCO
        priority: "deal" as "deal" | "reliability" | "performance",
        additionalInstructions: ""
    });

    // Load existing preferences if user exists
    useEffect(() => {
        if (user) {
            setPreferences(prev => ({
                ...prev,
                maxBudget: user.buying_power || 35000,
                bodyTypes: user.preferred_body_types || [],
                additionalInstructions: user.additional_instructions || "",
            }));
        }
    }, [user]);

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        if (newDirection === 1) handleNext();
        else handleBack();
    };

    const toggleBodyType = (type: string) => {
        setPreferences(prev => ({
            ...prev,
            bodyTypes: prev.bodyTypes.includes(type)
                ? prev.bodyTypes.filter(t => t !== type)
                : [...prev.bodyTypes, type]
        }));
    };

    const savePreferences = async () => {
        setIsLoading(true);
        
        // Build preferences payload
        const payload = {
            max_budget: preferences.maxBudget,
            body_types: preferences.bodyTypes,
            daily_commute_km: preferences.dailyCommute,
            priority: preferences.priority,
            additional_instructions: preferences.additionalInstructions
        };

        // Always save to localStorage for the results page
        localStorage.setItem('userPreferences', JSON.stringify(payload));
        
        try {
            // Only try to save to backend if user is logged in
            if (user?.id) {
                const res = await fetch(`${API_URL}/users/me`, {
                    method: 'PATCH',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-User-Id': user.id 
                    },
                    body: JSON.stringify({
                        buying_power: preferences.maxBudget,
                        preferred_body_types: preferences.bodyTypes,
                        daily_commute_km: preferences.dailyCommute,
                        priority: preferences.priority,
                        additional_instructions: preferences.additionalInstructions
                    })
                });
                
                if (res.ok) {
                    await login(user.id); // Refresh user data
                }
            }
            
            // Navigate to results page (works for guests too!)
            router.push('/results');
        } catch (e) {
            console.error(e);
            // Still navigate even if backend fails - we have localStorage
            router.push('/results');
        } finally {
            setIsLoading(false);
        }
    };

    const variants: Variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            transition: { duration: 0.2, ease: "easeIn" }
        })
    };

    const stepIcons = [Wallet, Car, Zap, MessageSquare];
    const stepLabels = ["Budget", "Style", "Priorities", "Requests"];

    return (
        <PageTransition>
            <div className="min-h-screen bg-background overflow-hidden">
                <Navbar />

                {/* Dynamic Ambient Background */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
                    <div className="absolute top-[30%] -right-[10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
                </div>

                <main className="relative mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-12 lg:min-h-[calc(100vh-80px)]">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black tracking-tight text-foreground mb-2">
                            Find Your Perfect Match
                        </h1>
                        <p className="text-muted-foreground">
                            Answer 3 quick questions and we'll find the best deals for you.
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-10 w-full max-w-md">
                        <div className="flex justify-between mb-4">
                            {stepIcons.map((Icon, index) => (
                                <div key={index} className="flex flex-col items-center gap-2">
                                    <motion.div
                                        className={cn(
                                            "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                                            step >= index
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border bg-card text-muted-foreground"
                                        )}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </motion.div>
                                    <span className={cn(
                                        "text-xs font-bold uppercase tracking-wider",
                                        step >= index ? "text-primary" : "text-muted-foreground"
                                    )}>
                                        {stepLabels[index]}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="h-1 w-full rounded-full bg-muted/30 overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "0%" }}
                                animate={{ width: `${((step + 1) / 4) * 100}%` }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            />
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="w-full">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={step}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="w-full rounded-3xl bg-card p-8 md:p-10 shadow-2xl border border-border min-h-[400px] flex flex-col"
                            >
                                {/* Step 1: Budget */}
                                {step === 0 && (
                                    <div className="flex flex-col h-full">
                                        <h2 className="text-2xl font-black text-foreground mb-2">
                                            💰 What's your budget?
                                        </h2>
                                        <p className="text-muted-foreground mb-10">
                                            We'll only show you cars within your price range.
                                        </p>

                                        <div className="flex-grow flex flex-col justify-center space-y-8">
                                            <div className="text-center">
                                                <span className="text-5xl font-black text-primary">
                                                    ${preferences.maxBudget.toLocaleString()}
                                                </span>
                                                <p className="text-muted-foreground mt-2">Maximum Price</p>
                                            </div>
                                            <Slider
                                                value={[preferences.maxBudget]}
                                                min={5000}
                                                max={100000}
                                                step={1000}
                                                onValueChange={(val) => setPreferences({ ...preferences, maxBudget: val[0] })}
                                                formatLabel={(val) => `$${(val / 1000).toFixed(0)}k`}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Body Types */}
                                {step === 1 && (
                                    <div className="flex flex-col h-full">
                                        <h2 className="text-2xl font-black text-foreground mb-2">
                                            🚗 What type of vehicle?
                                        </h2>
                                        <p className="text-muted-foreground mb-8">
                                            Select all that interest you.
                                        </p>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-grow">
                                            {BODY_TYPES.map(({ name, emoji }) => (
                                                <button
                                                    key={name}
                                                    onClick={() => toggleBodyType(name)}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all duration-200",
                                                        preferences.bodyTypes.includes(name)
                                                            ? "border-primary bg-primary/10 text-primary scale-[1.02] shadow-lg"
                                                            : "border-border bg-muted/20 text-muted-foreground hover:border-primary/50 hover:bg-muted/40"
                                                    )}
                                                >
                                                    <span className="text-3xl mb-2">{emoji}</span>
                                                    <span className="font-bold">{name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Daily Commute & Priority */}
                                {step === 2 && (
                                    <div className="flex flex-col h-full">
                                        <h2 className="text-2xl font-black text-foreground mb-2">
                                            ⚡ Your driving habits
                                        </h2>
                                        <p className="text-muted-foreground mb-8">
                                            This helps us calculate your true cost of ownership.
                                        </p>

                                        <div className="space-y-10 flex-grow">
                                            {/* Daily Commute */}
                                            <div>
                                                <div className="flex justify-between mb-4">
                                                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Daily Commute</span>
                                                    <span className="text-2xl font-black text-primary">{preferences.dailyCommute} km</span>
                                                </div>
                                                <Slider
                                                    value={[preferences.dailyCommute]}
                                                    min={5}
                                                    max={150}
                                                    step={5}
                                                    onValueChange={(val) => setPreferences({ ...preferences, dailyCommute: val[0] })}
                                                    formatLabel={(val) => `${val} km`}
                                                />
                                            </div>

                                            {/* Priority */}
                                            <div>
                                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 block">What matters most?</span>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {[
                                                        { value: "deal", label: "Best Deal", emoji: "💎" },
                                                        { value: "reliability", label: "Reliable", emoji: "🛡️" },
                                                        { value: "performance", label: "Fast", emoji: "🏁" }
                                                    ].map(({ value, label, emoji }) => (
                                                        <button
                                                            key={value}
                                                            onClick={() => setPreferences({ ...preferences, priority: value as any })}
                                                            className={cn(
                                                                "flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all",
                                                                preferences.priority === value
                                                                    ? "border-primary bg-primary/10 text-primary"
                                                                    : "border-border bg-muted/20 text-muted-foreground hover:border-primary/50"
                                                            )}
                                                        >
                                                            <span className="text-2xl mb-1">{emoji}</span>
                                                            <span className="text-xs font-bold">{label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Additional Instructions */}
                                {step === 3 && (
                                    <div className="flex flex-col h-full">
                                        <h2 className="text-2xl font-black text-foreground mb-2">
                                            📝 Any specific requests?
                                        </h2>
                                        <p className="text-muted-foreground mb-5">
                                            Tell us what else you're looking for (e.g., "leather seats", "low insurance", "good for snow").
                                        </p>

                                        <div className="flex-grow">
                                            <textarea
                                                className="w-full h-44 p-4 rounded-2xl bg-muted/20 border-2 border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground/40 text-sm"
                                                placeholder="Enter any additional instructions or info..."
                                                value={preferences.additionalInstructions}
                                                onChange={(e) => setPreferences({ ...preferences, additionalInstructions: e.target.value })}
                                            />
                                            <div className="mt-3 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                                {["Leather seats", "Low mileage", "Reliable", "Tech-heavy", "Family friendly"].map((tag) => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => {
                                                            const current = preferences.additionalInstructions;
                                                            const suffix = current ? (current.endsWith(' ') ? '' : ' ') : '';
                                                            setPreferences({
                                                                ...preferences,
                                                                additionalInstructions: current + suffix + tag + ", "
                                                            });
                                                        }}
                                                        className="whitespace-nowrap rounded-full bg-muted/40 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all border border-border/50"
                                                    >
                                                        + {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="mt-auto flex justify-between pt-8 border-t border-border">
                                    <Button
                                        onClick={() => paginate(-1)}
                                        variant="ghost"
                                        className={cn("rounded-xl font-bold", step === 0 && "invisible")}
                                    >
                                        <ChevronLeft className="mr-1 h-4 w-4" /> Back
                                    </Button>

                                    <Button
                                        onClick={() => step === 3 ? savePreferences() : paginate(1)}
                                        className="min-w-[180px] rounded-xl font-black uppercase tracking-wide shadow-lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Finding Deals..." : (step === 3 ? "🚀 Show My Matches" : "Continue")}
                                        {step !== 3 && !isLoading && <ChevronRight className="ml-1 h-4 w-4" />}
                                    </Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </PageTransition>
    );
}
