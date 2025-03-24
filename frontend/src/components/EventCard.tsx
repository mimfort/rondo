import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types';
import { API_URL } from '../api/config';

interface EventCardProps {
    event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const fillPercentage = (event.count_members / event.max_members) * 100;

    return (
        <Link to={`/events/${event.id}`} className="block">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {event.media_url && (
                    <div className="relative h-48">
                        <img
                            src={`${API_URL}${event.media_url}`}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                )}
                <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>

                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(event.start_time).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                        </div>

                        {event.tags && event.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {event.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full"
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600 dark:text-gray-300">
                                    {event.count_members} из {event.max_members} мест занято
                                </span>
                                <span className="text-gray-600 dark:text-gray-300">
                                    {Math.round(fillPercentage)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${fillPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard; 