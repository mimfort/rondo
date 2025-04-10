import React from 'react';
import { motion } from 'framer-motion';

const AnimatedLogo = () => {
    return (
        <div className="flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
                <motion.h1
                    className="text-6xl font-bold text-blue-700 mb-4"
                    initial={{ opacity: 0, scale: 0.3, rotateX: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{
                        duration: 0.8,
                        type: "spring",
                        stiffness: 100,
                        damping: 10
                    }}
                >
                    РОНДО
                </motion.h1>
                <motion.h2
                    className="text-4xl font-bold text-blue-700"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    МОЛОДЕЖНЫЙ ЦЕНТР
                </motion.h2>
                <motion.p
                    className="text-xl text-blue-700 tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    НОВОЕ ДЕВЯТКИНО
                </motion.p>
            </motion.div>
        </div>
    );
};

export default AnimatedLogo; 