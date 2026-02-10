'use client';

import { Navbar } from "@/components/ui/Navbar";
import { RecommendationsHero } from "@/components/ui/RecommendationsHero";
import { PageTransition } from "@/components/motion/PageTransition";

export default function ResultsPage() {
    return (
        <PageTransition>
            <Navbar />
            <RecommendationsHero />
        </PageTransition>
    );
}
