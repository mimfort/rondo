import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../../api/services';
import { Event } from '../../types';
import TagsManager from '../../components/TagsManager';
import AdminEventTags from '../../components/AdminEventTags';
import EventForm from './EventForm';

const AdminEvents = () => {
    const queryClient = useQueryClient();

    // Запрос на получение всех событий
    const { data: events } = useQuery<Event[]>({
        queryKey: ['events'],
        queryFn: async () => {
            const response = await eventService.getAllEvents();
            return response.data;
        }
    });

    // Мутация для отправки уведомления
    const sendEventNotificationMutation = useMutation({
        mutationFn: async (eventId: number) => {
            const response = await eventService.sendNotification(eventId);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        }
    });

    // Мутация для удаления события
    const deleteEventMutation = useMutation({
        mutationFn: async (eventId: number) => {
            const response = await eventService.deleteEvent(eventId);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        }
    });

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Форма создания события */}
                <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Создать новое мероприятие</h2>
                    <EventForm />
                </div>

                {/* Управление тегами */}
                <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Управление тегами</h2>
                    <TagsManager />
                </div>

                {/* Существующие мероприятия */}
                <div className="col-span-1 lg:col-span-2 card p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Существующие мероприятия</h2>
                    <div className="space-y-4">
                        {events?.map((event: Event) => (
                            <div
                                key={event.id}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{event.title}</h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => sendEventNotificationMutation.mutate(event.id)}
                                                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                disabled={sendEventNotificationMutation.isPending}
                                            >
                                                {sendEventNotificationMutation.isPending ? 'Отправка...' : 'Уведомить'}
                                            </button>
                                            <button
                                                onClick={() => deleteEventMutation.mutate(event.id)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {new Date(event.start_time).toLocaleString()}
                                        </div>
                                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {event.location}
                                        </div>
                                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            {event.count_members} из {event.max_members} мест
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                                        {event.description}
                                    </p>
                                    <div className="mt-4">
                                        <AdminEventTags eventId={event.id} eventTags={event.tags || []} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEvents; 