import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const sidebarContent = (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 shadow-lg z-50
                ${isOpen ? 'w-64' : 'w-0 md:w-64'}`}
        >
            <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8 sticky top-0 bg-white dark:bg-gray-800 py-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        Панель администратора
                    </h2>
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="space-y-4 flex-grow">
                    <NavLink
                        to="/admin-panel/events"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center space-x-2 p-2 rounded-lg transition-colors ${isActive
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`
                        }
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Соты</span>
                    </NavLink>
                    <NavLink
                        to="/admin-panel/coworking"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center space-x-2 p-2 rounded-lg transition-colors ${isActive
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`
                        }
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>Коворкинг</span>
                    </NavLink>
                    <NavLink
                        to="/admin-panel/courts"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center space-x-2 p-2 rounded-lg transition-colors ${isActive
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`
                        }
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m-4 4h8a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Корты</span>
                    </NavLink>
                    <NavLink
                        to="/admin-panel/court-reservations"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center space-x-2 p-2 rounded-lg transition-colors ${isActive
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`
                        }
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m-4 4h8a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Аренда кортов</span>
                    </NavLink>
                </nav>
            </div>
        </motion.div>
    );

    return (
        <>
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 md:hidden bg-indigo-600 text-white p-2 rounded-lg shadow-lg flex items-center space-x-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-sm font-medium">Админ меню</span>
            </button>
            <AnimatePresence>
                {(isOpen || window.innerWidth >= 768) && sidebarContent}
            </AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
};

export default AdminSidebar;