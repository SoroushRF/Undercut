'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface FreshnessBadgeProps {
    timestamp: string; // e.g., "2 hours ago"
}

export const FreshnessBadge = ({ timestamp }: FreshnessBadgeProps) => {
    return (
        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md border border-blue-100">
            <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <Clock className="w-3 h-3" />
            </motion.div>
            <span>Analyzed {timestamp}</span>
        </div>
    );
};
