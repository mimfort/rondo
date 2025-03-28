import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { eventService } from '../api/services';
import type { Event } from '../types';
import { getImageUrl } from '../api/config';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    // Получаем все события
    const { data: events, isLoading: isLoadingEvents } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const response = await eventService.getAllEvents();
            return response.data;
        }
    });

    if (isLoadingEvents) {
        return <LoadingSpinner />;
    }

    const now = new Date();
    const upcomingEvents = events?.filter(
        (event) => new Date(event.start_time) > now
    ) || [];

    const pastEvents = events?.filter(
        (event) => new Date(event.start_time) <= now
    ) || [];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const renderEvents = (events: Event[]) => (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {events.map((event) => (
                <motion.div
                    key={event.id}
                    variants={item}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Link
                        to={`/events/${event.id}`}
                        className="block h-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                        {event.media_url && (
                            <div className="relative h-48 overflow-hidden">
                                <motion.img
                                    src={getImageUrl(event.media_url) || ''}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                    initial={{ scale: 1.2 }}
                                    whileHover={{ scale: 1.3 }}
                                    transition={{ duration: 0.6 }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </div>
                        )}
                        <div className="p-6">
                            <motion.h2
                                className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {event.title}
                            </motion.h2>
                            <motion.p
                                className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                {event.description}
                            </motion.p>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                    <svg
                                        className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    {new Date(event.start_time).toLocaleDateString('ru-RU', {
                                        day: 'numeric',
                                        month: 'long',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                    <svg
                                        className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    {event.location}
                                </div>
                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                    <svg
                                        className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                    {event.count_members} из {event.max_members} мест занято
                                </div>
                            </div>

                            {/* Отображение тегов */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {event.tags && event.tags.map((tag, index) => (
                                    <div
                                        key={typeof tag === 'string' ? `${event.id}-${index}` : tag.id}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                                    >
                                        {typeof tag === 'string' ? tag : tag.name}
                                    </div>
                                ))}
                                {(!event.tags || event.tags.length === 0) && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Нет тегов
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    События
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    Молодежное пространство в Новом Девяткино
                </p>
            </motion.div>

            <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                <nav className="-mb-px flex justify-center space-x-8">
                    <motion.button
                        onClick={() => setActiveTab('upcoming')}
                        className={`${activeTab === 'upcoming'
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-all duration-200`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Предстоящие ({upcomingEvents.length})
                    </motion.button>
                    <motion.button
                        onClick={() => setActiveTab('past')}
                        className={`${activeTab === 'past'
                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-all duration-200`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Прошедшие ({pastEvents.length})
                    </motion.button>
                </nav>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === 'upcoming' ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTab === 'upcoming' ? -50 : 50 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'upcoming' ? renderEvents(upcomingEvents) : renderEvents(pastEvents)}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Home; 