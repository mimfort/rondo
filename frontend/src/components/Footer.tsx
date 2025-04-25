import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-background-light dark:bg-background-dark shadow-sm mt-auto py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <Link to="/" className="text-2xl font-bold text-primary-light dark:text-primary-dark">
                        РОНДО
                    </Link>
                    <p className="text-sm text-text-light dark:text-text-dark">
                        © 2025 Все права защищены
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 