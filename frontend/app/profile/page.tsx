'use client';

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Slider } from "./Slider";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Step 2 Data: Body Types
const BODY_TYPES = [
    "SUV", "Sedan", "Coupe", "Truck", "Hatchback", "Van", "Convertible", "Wagon"
];

// Step 3 Data: Brands
const BRANDS = [
    "Toyota", "Honda", "Ford", "Chevrolet", "Tesla", "BMW", "Mercedes-Benz", "Audi", 
    "Hyundai", "Kia", "Nissan", "Subaru"
];

export default function ProfilePage() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        // Step 1: Personal
        firstName: "",
        lastName: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        // Step 2: Body Types
        bodyTypes: [] as string[],
        // Step 3: Brands
        brands: [] as string[],
        // Step 4: Financials
        income: 85000,
        buyingPower: 35000
    });

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

    const toggleSelection = (field: 'bodyTypes' | 'brands', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value) 
                ? prev[field].filter(item => item !== value)
                : [...prev[field], value]
        }));
    };

    const variants: Variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95,
            rotate: direction < 0 ? 5 : -5,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }
        })
    };

    const [direction, setDirection] = useState(0);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        if (newDirection === 1) handleNext();
        else handleBack();
    };

    return (
        <div className="min-h-screen bg-zinc-50 overflow-hidden">
            <Navbar />
            
            <main className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-12 lg:min-h-[calc(100vh-80px)]">
                
                {/* Progress Bar */}
                <div className="mb-12 w-full max-w-md">
                    <div className="flex justify-between text-xs font-medium text-zinc-500 mb-2">
                        <span>Profile</span>
                        <span>Preferences</span>
                        <span>Financials</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                        <motion.div 
                            className="h-full bg-zinc-900" 
                            initial={{ width: "0%" }}
                            animate={{ width: `${((step + 1) / 4) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                <div className="relative w-full max-w-2xl perspective-1000">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="w-full rounded-3xl bg-white p-8 shadow-xl border border-zinc-100 min-h-[500px] flex flex-col"
                        >
                            {/* Step 1: Personal Info */}
                            {step === 0 && (
                                <div className="flex flex-col h-full">
                                    <h2 className="text-3xl font-bold text-zinc-900 mb-2">Let's get to know you</h2>
                                    <p className="text-zinc-500 mb-8">We need a few details to create your profile.</p>

                                    <div className="space-y-6 flex-grow">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-900">First Name</label>
                                                <Input 
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                                    placeholder="First Name" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-900">Last Name</label>
                                                <Input 
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                                    placeholder="Last Name" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-900">Street Address</label>
                                                <Input 
                                                    value={formData.street}
                                                    onChange={(e) => setFormData({...formData, street: e.target.value})}
                                                    placeholder="1234 Main St" 
                                                />
                                            </div>
                                            <div className="grid grid-cols-6 gap-4">
                                                <div className="col-span-3 space-y-2">
                                                    <label className="text-sm font-medium text-zinc-900">City</label>
                                                    <Input 
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                                        placeholder="City" 
                                                    />
                                                </div>
                                                <div className="col-span-1 space-y-2">
                                                    <label className="text-sm font-medium text-zinc-900">State</label>
                                                    <Input 
                                                        value={formData.state}
                                                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                                                        placeholder="CA" 
                                                    />
                                                </div>
                                                <div className="col-span-2 space-y-2">
                                                    <label className="text-sm font-medium text-zinc-900">Zip</label>
                                                    <Input 
                                                        value={formData.zip}
                                                        onChange={(e) => setFormData({...formData, zip: e.target.value})}
                                                        placeholder="90210" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Body Types */}
                            {step === 1 && (
                                <div className="flex flex-col h-full">
                                    <h2 className="text-3xl font-bold text-zinc-900 mb-2">What's your style?</h2>
                                    <p className="text-zinc-500 mb-8">Select the vehicle types you are interested in.</p>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-grow content-start">
                                        {BODY_TYPES.map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => toggleSelection('bodyTypes', type)}
                                                className={cn(
                                                    "flex h-24 flex-col items-center justify-center rounded-2xl border-2 transition-all duration-200",
                                                    formData.bodyTypes.includes(type)
                                                        ? "border-zinc-900 bg-zinc-900 text-white shadow-lg scale-105"
                                                        : "border-zinc-100 bg-zinc-50 text-zinc-600 hover:border-zinc-300 hover:bg-white"
                                                )}
                                            >
                                                <span className="text-sm font-bold">{type}</span>
                                                {formData.bodyTypes.includes(type) && (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                                                        <Check size={16} />
                                                    </motion.div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Brands */}
                            {step === 2 && (
                                <div className="flex flex-col h-full">
                                    <h2 className="text-3xl font-bold text-zinc-900 mb-2">Preferred Brands</h2>
                                    <p className="text-zinc-500 mb-8">Which manufacturers do you trust?</p>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 flex-grow overflow-y-auto pr-2 max-h-[400px]">
                                        {BRANDS.map((brand) => (
                                            <button
                                                key={brand}
                                                onClick={() => toggleSelection('brands', brand)}
                                                className={cn(
                                                    "flex h-16 items-center justify-center rounded-xl border-2 transition-all duration-200 px-4",
                                                    formData.brands.includes(brand)
                                                        ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                                                        : "border-zinc-100 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-white"
                                                )}
                                            >
                                                <span className="text-sm font-semibold truncate">{brand}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Financials */}
                            {step === 3 && (
                                <div className="flex flex-col h-full">
                                    <h2 className="text-3xl font-bold text-zinc-900 mb-2">Financial Overview</h2>
                                    <p className="text-zinc-500 mb-12">Help us customize deals to your budget.</p>

                                    <div className="space-y-12 flex-grow">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <label className="text-lg font-semibold text-zinc-900">Annual Income</label>
                                                <span className="text-2xl font-bold text-zinc-900">
                                                    ${formData.income.toLocaleString()}
                                                </span>
                                            </div>
                                            <Slider 
                                                value={[formData.income]}
                                                min={20000}
                                                max={500000}
                                                step={1000}
                                                onValueChange={(val) => setFormData({...formData, income: val[0]})}
                                                formatLabel={(val) => `$${(val/1000).toFixed(0)}k`}
                                            />
                                            <p className="text-sm text-zinc-500">
                                                This helps us calculate your debt-to-income ratio for optimal financing.
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <label className="text-lg font-semibold text-zinc-900">Buying Power</label>
                                                <span className="text-2xl font-bold text-zinc-900">
                                                    ${formData.buyingPower.toLocaleString()}
                                                </span>
                                            </div>
                                            <Slider 
                                                value={[formData.buyingPower]}
                                                min={5000}
                                                max={150000}
                                                step={500}
                                                onValueChange={(val) => setFormData({...formData, buyingPower: val[0]})}
                                                formatLabel={(val) => `$${(val/1000).toFixed(0)}k`}
                                            />
                                            <p className="text-sm text-zinc-500">
                                                Estimated total vehicle price you are looking to spend.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="mt-8 flex justify-between pt-6 border-t border-zinc-100">
                                <Button 
                                    onClick={() => paginate(-1)} 
                                    variant="ghost" 
                                    className={cn("pl-0 hover:bg-transparent", step === 0 && "invisible")}
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                                </Button>
                                
                                <Button 
                                    onClick={() => step === 3 ? alert("Profile Saved!") : paginate(1)}
                                    className="min-w-[140px]"
                                >
                                    {step === 3 ? "Complete" : "Continue"}
                                    {step !== 3 && <ChevronRight className="ml-2 h-4 w-4" />}
                                </Button>
                            </div>

                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
