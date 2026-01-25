'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging tailwind classes locally since lib/utils is not available
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardHoverProps {
    children: ReactNode;
    className?: string;
}

export const CardHover = ({ children, className }: CardHoverProps) => {
    return (
        <motion.div
            whileHover={{
                scale: 1.02,
                y: -4,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={cn("h-full", className)}
        >
            {children}
        </motion.div>
    );
};
