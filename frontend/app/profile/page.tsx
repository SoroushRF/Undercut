'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Slider } from "./Slider";
import { ChevronRight, ChevronLeft, Check, User, Car, ShieldCheck, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/motion/PageTransition";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Step 2 Data: Body Types
const BODY_TYPES = [
    "SUV", "Sedan", "Coupe", "Truck", "Hatchback", "Van", "Convertible", "Wagon"
];

// Step 3 Data: Brands
const BRANDS = [
    "Toyota", "Honda", "Ford", "Chevrolet", "Tesla", "BMW", "Mercedes-Benz", "Audi",
    "Hyundai", "Kia", "Nissan", "Subaru"
];

const API_URL = 'http://localhost:8000';

export default function ProfilePage() {
    const searchParams = useSearchParams();
    const { user, login, logout } = useAuth();
    
    // Auth Mode State (Login vs Signup tab)
    const [authMode, setAuthMode] = useState<'login' | 'signup'>(
        searchParams.get('mode') === 'signup' ? 'signup' : 'login'
    );

    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    // Check for existing session on mount - handled by AuthContext now
    // Sync profile form data when user loads
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.first_name || "",
                lastName: user.last_name || "",
                street: user.street_address || "",
                city: user.city || "",
                state: user.state || "",
                zip: user.postal_code || "",
                bodyTypes: user.preferred_body_types || [],
                brands: user.preferred_brands || [],
                income: user.annual_income || 85000,
                buyingPower: user.buying_power || 35000
            });
        }
    }, [user]);

    // Auth Form State
    const [authData, setAuthData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    // Profile Data State
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

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            if (authMode === 'signup') {
                if (authData.password !== authData.confirmPassword) {
                    alert("Passwords do not match!");
                    setIsLoading(false);
                    return;
                }
                
                // Create User
                const id = crypto.randomUUID();
                const res = await fetch(`${API_URL}/users/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, email: authData.email })
                });

                if (!res.ok) throw new Error('Failed to create account');
                
                const newUser = await res.json();
                await login(newUser.id);
            } else {
                // Login (Simulated via by-email)
                const res = await fetch(`${API_URL}/users/by-email/${authData.email}`);
                if (!res.ok) {
                    alert('User not found');
                    setIsLoading(false);
                    return;
                }
                const existingUser = await res.json();
                await login(existingUser.id);
            }
        } catch (error) {
            console.error(error);
            alert('Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        // Fake Google Sign In - just login with a mock ID for now or alert
        alert("Google Sign In not implemented yet - use email auth");
    };

    const saveProfile = async () => {
        if (!user?.id) return;
        setIsLoading(true);
        try {
            const payload = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                street_address: formData.street,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zip,
                annual_income: formData.income,
                buying_power: formData.buyingPower,
                preferred_body_types: formData.bodyTypes,
                preferred_brands: formData.brands
            };

            const res = await fetch(`${API_URL}/users/me`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-Id': user.id 
                },
                body: JSON.stringify(payload)
            });
            
            if (res.ok) {
                alert("Profile Saved Successfully!");
                // Refresh user data in context to reflect changes
                await login(user.id);
            } else {
                alert("Failed to save profile");
            }
        } catch (e) {
            console.error(e);
            alert("Error saving profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        setStep(0);
    };

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
            y: direction > 0 ? 20 : -20,
            opacity: 0,
            scale: 0.98
        }),
        center: {
            zIndex: 1,
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        },
        exit: (direction: number) => ({
            zIndex: 0,
            y: direction < 0 ? 20 : -20,
            opacity: 0,
            scale: 0.98,
            transition: {
                duration: 0.2,
                ease: "easeIn"
            }
        })
    };

    const [direction, setDirection] = useState(0);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        if (newDirection === 1) handleNext();
        else handleBack();
    };

    // Step icons for visual progress
    const stepIcons = [User, Car, ShieldCheck, Wallet];

    return (
        <PageTransition>
            <div className="min-h-screen bg-background overflow-hidden">
                <Navbar />

                {/* Dynamic Ambient Background Glows */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px] transition-colors duration-1000" />
                    <div className="absolute top-[30%] -right-[10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px] transition-colors duration-1000" />
                    <div className="absolute -bottom-[10%] left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px] transition-colors duration-1000" />
                </div>

                <main className="relative mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-12 lg:min-h-[calc(100vh-80px)]">
                    
                    {/* Progress Bar - Only show if logged in */}
                    {user && (
                        <div className="mb-12 w-full max-w-md">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-[2px] text-muted-foreground mb-3 px-1">
                                <span>Profile</span>
                                <span>Preferences</span>
                                <span>Financials</span>
                                <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Logout</button>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30 border border-border/20">
                                <motion.div
                                    className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${((step + 1) / 4) * 100}%` }}
                                    transition={{ duration: 0.5, ease: "circOut" }}
                                />
                            </div>
                            {/* Step Icons */}
                            <div className="flex justify-between mt-4">
                                {stepIcons.map((Icon, index) => (
                                    <motion.div
                                        key={index}
                                        className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                                            step >= index
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border bg-card text-muted-foreground"
                                        )}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="relative w-full max-w-2xl">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            {!user ? (
                                <motion.div
                                    key="auth"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="w-full max-w-md mx-auto rounded-[2rem] bg-card p-8 shadow-2xl shadow-black/5 border border-border"
                                >
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-black tracking-tight text-foreground mb-2">
                                            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                                        </h2>
                                        <p className="text-muted-foreground">
                                            {authMode === 'login' 
                                                ? 'Enter your details to access your profile.' 
                                                : 'Sign up to start your journey.'}
                                        </p>
                                    </div>

                                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                                            <Input 
                                                type="email"
                                                className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                                                value={authData.email}
                                                onChange={(e) => setAuthData({...authData, email: e.target.value})}
                                                placeholder="hello@example.com"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="space-y-2.5">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                                            <Input 
                                                type="password"
                                                className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                                                value={authData.password}
                                                onChange={(e) => setAuthData({...authData, password: e.target.value})}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>

                                        {authMode === 'signup' && (
                                            <div className="space-y-2.5">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm Password</label>
                                                <Input 
                                                    type="password"
                                                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                                                    value={authData.confirmPassword}
                                                    onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                        )}

                                        <Button type="submit" className="w-full mt-6 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20" disabled={isLoading}>
                                            {isLoading ? "Please wait..." : (authMode === 'login' ? 'Sign In' : 'Sign Up')}
                                        </Button>
                                    </form>

                                    <div className="relative my-8">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-border" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                        </div>
                                    </div>

                                    <Button 
                                        variant="outline" 
                                        className="w-full rounded-xl"
                                        onClick={handleGoogleSignIn}
                                    >
                                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                        Google
                                    </Button>

                                    <div className="mt-8 text-center text-sm">
                                        <p className="text-muted-foreground">
                                            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                            <button 
                                                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                                className="font-bold text-foreground hover:underline"
                                            >
                                                {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                                            </button>
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key={step}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="w-full rounded-[2rem] bg-card p-8 md:p-12 shadow-2xl shadow-black/5 border border-border min-h-[550px] flex flex-col relative overflow-hidden"
                                >
                                    {/* Step 1: Personal Info */}
                                    {step === 0 && (
                                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <h2 className="text-4xl font-black tracking-tight text-foreground mb-3">Let's get to know you</h2>
                                            <p className="text-muted-foreground font-medium mb-10">We need a few details to create your personalized deal radar.</p>

                                            <div className="space-y-8 flex-grow">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2.5">
                                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">First Name</label>
                                                        <Input
                                                            className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                                                            value={formData.firstName}
                                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                            placeholder="First Name"
                                                        />
                                                    </div>
                                                    <div className="space-y-2.5">
                                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Last Name</label>
                                                        <Input
                                                            className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                                                            value={formData.lastName}
                                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                            placeholder="Last Name"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="space-y-2.5">
                                                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Street Address</label>
                                                        <Input
                                                            className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                                                            value={formData.street}
                                                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                                            placeholder="1234 Main St"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-6 gap-6">
                                                        <div className="col-span-3 space-y-2.5">
                                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">City</label>
                                                            <Input
                                                                className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                                                                value={formData.city}
                                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                                placeholder="City"
                                                            />
                                                        </div>
                                                        <div className="col-span-1 space-y-2.5">
                                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">State</label>
                                                            <Input
                                                                className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                                                                value={formData.state}
                                                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                                placeholder="CA"
                                                            />
                                                        </div>
                                                        <div className="col-span-2 space-y-2.5">
                                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Zip</label>
                                                            <Input
                                                                className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                                                                value={formData.zip}
                                                                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
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
                                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <h2 className="text-4xl font-black tracking-tight text-foreground mb-3">What's your style?</h2>
                                            <p className="text-muted-foreground font-medium mb-10">Select the vehicle types you are interested in.</p>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-grow content-start pb-4">
                                                {BODY_TYPES.map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => toggleSelection('bodyTypes', type)}
                                                        className={cn(
                                                            "group relative flex h-28 flex-col items-center justify-center rounded-[1.5rem] border-2 transition-all duration-300",
                                                            formData.bodyTypes.includes(type)
                                                                ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/5 scale-[1.02]"
                                                                : "border-border/50 bg-muted/20 text-muted-foreground hover:border-primary/30 hover:bg-muted/40 hover:text-foreground"
                                                        )}
                                                    >
                                                        <span className="text-sm font-black tracking-tight">{type}</span>
                                                        {formData.bodyTypes.includes(type) && (
                                                            <motion.div
                                                                initial={{ scale: 0, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                className="mt-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                                                            >
                                                                <Check size={14} strokeWidth={4} />
                                                            </motion.div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Brands */}
                                    {step === 2 && (
                                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <h2 className="text-4xl font-black tracking-tight text-foreground mb-3">Preferred Brands</h2>
                                            <p className="text-muted-foreground font-medium mb-10">Which manufacturers do you trust?</p>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 flex-grow overflow-y-auto pr-3 max-h-[400px] custom-scrollbar pb-4">
                                                {BRANDS.map((brand) => (
                                                    <button
                                                        key={brand}
                                                        onClick={() => toggleSelection('brands', brand)}
                                                        className={cn(
                                                            "flex h-16 items-center justify-center rounded-2xl border-2 transition-all duration-300 px-4",
                                                            formData.brands.includes(brand)
                                                                ? "border-primary bg-primary/10 text-primary shadow-md"
                                                                : "border-border/50 bg-muted/20 text-muted-foreground hover:border-primary/30 hover:bg-muted/40 hover:text-foreground hover:scale-[1.02]"
                                                        )}
                                                    >
                                                        <span className="text-sm font-bold truncate">{brand}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Financials */}
                                    {step === 3 && (
                                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <h2 className="text-4xl font-black tracking-tight text-foreground mb-3">Financial Overview</h2>
                                            <p className="text-muted-foreground font-medium mb-12">Help us customize deals to your specific budget.</p>

                                            <div className="space-y-14 flex-grow px-2">
                                                <div className="space-y-8">
                                                    <div className="flex justify-between items-end">
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Annual Income</label>
                                                            <p className="text-sm font-medium text-muted-foreground/70">Pre-tax gross income</p>
                                                        </div>
                                                        <span className="text-3xl font-black text-primary tracking-tight">
                                                            ${formData.income.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <Slider
                                                        value={[formData.income]}
                                                        min={20000}
                                                        max={500000}
                                                        step={1000}
                                                        onValueChange={(val) => setFormData({ ...formData, income: val[0] })}
                                                        formatLabel={(val) => `$${(val / 1000).toFixed(0)}k`}
                                                    />
                                                </div>

                                                <div className="space-y-8">
                                                    <div className="flex justify-between items-end">
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Buying Power</label>
                                                            <p className="text-sm font-medium text-muted-foreground/70">Ideal vehicle budget</p>
                                                        </div>
                                                        <span className="text-3xl font-black text-primary tracking-tight">
                                                            ${formData.buyingPower.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <Slider
                                                        value={[formData.buyingPower]}
                                                        min={5000}
                                                        max={150000}
                                                        step={500}
                                                        onValueChange={(val) => setFormData({ ...formData, buyingPower: val[0] })}
                                                        formatLabel={(val) => `$${(val / 1000).toFixed(0)}k`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation Buttons */}
                                    <div className="mt-auto flex justify-between pt-8 border-t border-border mt-10">
                                        <Button
                                            onClick={() => paginate(-1)}
                                            variant="ghost"
                                            className={cn("px-4 rounded-xl font-bold bg-muted/20 hover:bg-muted text-muted-foreground transition-all", step === 0 && "invisible")}
                                        >
                                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                                        </Button>

                                        <Button
                                            onClick={() => step === 3 ? saveProfile() : paginate(1)}
                                            className="min-w-[160px] rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Saving..." : (step === 3 ? "Complete Profile" : "Continue")}
                                            {step !== 3 && !isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
                                        </Button>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </PageTransition>
    );
}
