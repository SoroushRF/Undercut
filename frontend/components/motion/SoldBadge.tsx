'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export const SoldBadge = () => {
    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-lg">
            <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: -5 }}
                whileHover={{ scale: 1.1, rotate: 0 }}
                className="bg-card border-4 border-primary text-foreground px-6 py-3 rounded-xl shadow-2xl transform"
            >
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-success" />
                        <span className="text-2xl font-black uppercase tracking-widest">Sold</span>
                    </div>
                    <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase mt-1">
                        via Undercut
                    </span>
                </div>
            </motion.div>
        </div>
    );
};
