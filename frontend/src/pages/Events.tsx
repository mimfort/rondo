import React from 'react';
import { motion } from 'framer-motion';

const Events = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    СОТЫ
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Скоро здесь появятся события
                </p>
            </motion.div>
        </div>
    );
};

export default Events; 