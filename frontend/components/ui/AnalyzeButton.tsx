'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AnalyzeButtonProps {
    carId: string;
    initialVerdict?: string;
}

import { API_BASE_URL } from '@/lib/api';

export function AnalyzeButton({ carId, initialVerdict }: AnalyzeButtonProps) {
    const [verdict, setVerdict] = useState<string | null>(initialVerdict || null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeWithGemini = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const res = await fetch(`${API_BASE_URL}/cars/${carId}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!res.ok) {
                throw new Error('Analysis failed');
            }
            
            const data = await res.json();
            setVerdict(data.verdict);
        } catch (e) {
            setError('AI analysis failed. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Analyze Button */}
            <button
                onClick={analyzeWithGemini}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:from-violet-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Analyzing with Gemini AI...
                    </>
                ) : (
                    <>
                        <Sparkles className="h-5 w-5" />
                        🧠 Analyze This Deal (AI)
                    </>
                )}
            </button>

            {/* Error State */}
            {error && (
                <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* AI Verdict Display */}
            {verdict && !isLoading && (
                <div className="rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 p-5 border border-violet-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-violet-600" />
                        <h3 className="font-bold text-violet-900">Gemini AI Verdict</h3>
                    </div>
                    <p className="text-violet-800 text-sm leading-relaxed">
                        {verdict}
                    </p>
                </div>
            )}
        </div>
    );
}
