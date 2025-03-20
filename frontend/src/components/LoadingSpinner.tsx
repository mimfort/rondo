import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false }) => {
    const containerClasses = fullScreen
        ? "fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
        : "flex items-center justify-center min-h-[200px]";

    return (
        <div className={containerClasses}>
            <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-gray-700"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="w-16 h-16 rounded-full border-4 border-indigo-500 dark:border-indigo-400 border-t-transparent absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-300 dark:border-t-indigo-600 absolute inset-0"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>
        </div>
    );
};

export default LoadingSpinner; 