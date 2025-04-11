import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { User } from '../types';
import { authService } from '../api/services';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery<User>({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await authService.getCurrentUser();
            return response.data;
        },
        retry: false,
    });

    const handleLogout = async () => {
        try {
            await authService.logout();
            queryClient.setQueryData(['currentUser'], null);
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
            navigate('/');
        }
    };

    return (
        <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 hover:from-blue-600 hover:via-indigo-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                        >
                            РОНДО
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/events"
                            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-semibold"
                        >
                            Соты
                        </Link>
                        <Link
                            to="/coworking"
                            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-semibold"
                        >
                            Коворкинг
                        </Link>
                        {!isLoading && user && (
                            <>
                                <Link
                                    to="/profile"
                                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-semibold"
                                >
                                    Профиль
                                </Link>
                                {user.admin_status === 'admin' && (
                                    <Link
                                        to="/admin-panel"
                                        className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-semibold"
                                    >
                                        Админ
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-semibold"
                                >
                                    Выйти
                                </button>
                            </>
                        )}
                        {!isLoading && !user && (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 font-semibold"
                                >
                                    Войти
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-xl transform hover:scale-105"
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                        <div className="pl-4 border-l border-gray-200 dark:border-gray-700">
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            aria-label="Открыть меню"
                        >
                            <motion.div
                                animate={isMobileMenuOpen ? "open" : "closed"}
                                variants={{
                                    open: { rotate: 180 },
                                    closed: { rotate: 0 }
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isMobileMenuOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </motion.div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <motion.div
                    className="md:hidden absolute w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-lg rounded-b-2xl border-t border-gray-100 dark:border-gray-700"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <div className="px-4 pt-2 pb-3 space-y-2">
                        <Link
                            to="/events"
                            className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Соты
                        </Link>
                        <Link
                            to="/coworking"
                            className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Коворкинг
                        </Link>
                        {!isLoading && user && (
                            <>
                                <Link
                                    to="/profile"
                                    className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Профиль
                                </Link>
                                {user.admin_status === 'admin' && (
                                    <Link
                                        to="/admin-panel"
                                        className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Админ
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400"
                                >
                                    Выйти
                                </button>
                            </>
                        )}
                        {!isLoading && !user && (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Войти
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold text-center shadow-md hover:shadow-xl transform hover:scale-105"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                        <div className="px-4 py-3">
                            <ThemeToggle />
                        </div>
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar; 