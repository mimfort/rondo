import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../api/services';
import type { User } from '../types';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: currentUser, isLoading } = useQuery<User>({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const response = await authService.getCurrentUser();
            return response.data;
        },
        retry: false,
    });

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-indigo-600">Rondo</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                События
                            </Link>
                            {currentUser && (
                                <>
                                    <Link
                                        to="/profile"
                                        className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Профиль
                                    </Link>
                                    {currentUser.admin_status === 'admin' && (
                                        <Link
                                            to="/admin-panel"
                                            className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                        >
                                            Админ
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        {!isLoading && (
                            <>
                                {currentUser ? (
                                    <Link
                                        to="/profile"
                                        className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        {currentUser.username}
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            to="/auth"
                                            className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                                        >
                                            Войти
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
                                        >
                                            Регистрация
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            {isOpen ? (
                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Мобильное меню */}
            {isOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                        >
                            События
                        </Link>
                        {currentUser && (
                            <>
                                <Link
                                    to="/profile"
                                    className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                                >
                                    Профиль
                                </Link>
                                {currentUser.admin_status === 'admin' && (
                                    <Link
                                        to="/admin-panel"
                                        className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                                    >
                                        Админ
                                    </Link>
                                )}
                            </>
                        )}
                        {!isLoading && (
                            <>
                                {currentUser ? (
                                    <Link
                                        to="/profile"
                                        className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                                    >
                                        {currentUser.username}
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            to="/auth"
                                            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                                        >
                                            Войти
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                                        >
                                            Регистрация
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 