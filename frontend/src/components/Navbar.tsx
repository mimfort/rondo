import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { User } from '../types';
import { authService } from '../api/services';

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
        <nav className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-primary-light dark:text-primary-dark">
                            СОТЫ
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/events" className="text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark">
                            События
                        </Link>
                        {!isLoading && user && (
                            <>
                                <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark">
                                    Профиль
                                </Link>
                                {user.admin_status === 'admin' && (
                                    <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark">
                                        Админ
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark"
                                >
                                    Выйти
                                </button>
                            </>
                        )}
                        {!isLoading && !user && (
                            <>
                                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark">
                                    Войти
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-md hover:bg-primary-dark dark:hover:bg-primary-light transition-colors duration-200"
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                        <ThemeToggle />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark"
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
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            to="/events"
                            className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            События
                        </Link>
                        {!isLoading && user && (
                            <>
                                <Link
                                    to="/profile"
                                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Профиль
                                </Link>
                                {user.admin_status === 'admin' && (
                                    <Link
                                        to="/admin-panel"
                                        className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark"
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
                                    className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark"
                                >
                                    Выйти
                                </button>
                            </>
                        )}
                        {!isLoading && !user && (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Войти
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                        <div className="px-3 py-2">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 