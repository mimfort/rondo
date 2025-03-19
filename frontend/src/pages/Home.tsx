import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { eventService } from '../api/services';
import type { Event } from '../types';

const Home = () => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const { data: eventsResponse, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: () => eventService.getAllEvents(),
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const now = new Date();
    const upcomingEvents = eventsResponse?.data.filter(
        (event) => new Date(event.start_time) > now
    ) || [];
    const pastEvents = eventsResponse?.data.filter(
        (event) => new Date(event.start_time) <= now
    ) || [];

    const renderEvents = (events: Event[]) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {event.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                        <div className="space-y-2">
                            <div className="flex items-center text-gray-500">
                                <svg
                                    className="h-5 w-5 mr-2"
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
                                {new Date(event.start_time).toLocaleDateString('ru-RU')}
                            </div>
                            <div className="flex items-center text-gray-500">
                                <svg
                                    className="h-5 w-5 mr-2"
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
                            <div className="flex items-center text-gray-500">
                                <svg
                                    className="h-5 w-5 mr-2"
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
                                {event.max_members - event.registration_count} из {event.max_members} мест
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">СОТЫ</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Молодежное пространство в Новом Девяткино. Место для отдыха, вдохновения, развития и работы.
                    Бесплатное посещение для всех желающих.
                </p>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`${activeTab === 'upcoming'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Предстоящие ({upcomingEvents.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`${activeTab === 'past'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Прошедшие ({pastEvents.length})
                    </button>
                </nav>
            </div>

            {activeTab === 'upcoming' ? renderEvents(upcomingEvents) : renderEvents(pastEvents)}
        </div>
    );
};

export default Home; 