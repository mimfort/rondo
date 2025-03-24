import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService, registrationService } from '../api/services';
import { Event, Registration } from '../types';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { API_URL } from '../api/config';
import EventTags from '../components/EventTags';

const EventDetails = () => {
    const { id } = useParams<{ id: string }>();
    const eventId = parseInt(id || '0');
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();

    const { data: event, isLoading, error } = useQuery<Event>({
        queryKey: ['event', eventId],
        queryFn: async () => {
            const response = await eventService.getEventById(eventId);
            return response.data;
        },
        enabled: !!eventId
    });

    const { data: userRegistrations } = useQuery<Registration[]>({
        queryKey: ['userRegistrations'],
        queryFn: async () => {
            const response = await registrationService.getUserRegistrations();
            return response.data;
        },
        enabled: !!currentUser
    });

    const isRegistered = userRegistrations?.some(reg => reg.event_id === eventId);

    const registerMutation = useMutation({
        mutationFn: () => registrationService.registerForEvent(eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            queryClient.invalidateQueries({ queryKey: ['userRegistrations'] });
            toast.success('Вы успешно зарегистрировались на событие');
        },
        onError: () => {
            toast.error('Ошибка при регистрации на событие');
        }
    });

    const cancelRegistrationMutation = useMutation({
        mutationFn: () => registrationService.cancelRegistration(eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['event', eventId] });
            queryClient.invalidateQueries({ queryKey: ['userRegistrations'] });
            toast.success('Регистрация отменена');
        },
        onError: () => {
            toast.error('Ошибка при отмене регистрации');
        }
    });

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>;
    }

    if (error || !event) {
        return <div className="text-center text-red-500">Ошибка при загрузке события</div>;
    }

    const handleRegistration = () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        registerMutation.mutate();
    };

    const handleCancelRegistration = () => {
        cancelRegistrationMutation.mutate();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
                {event.media_url && (
                    <div className="relative h-96">
                        <img
                            src={`${API_URL}${event.media_url}`}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                )}
                <div className="p-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{event.title}</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">{event.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <svg className="h-6 w-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(event.start_time).toLocaleDateString('ru-RU', {
                                    day: 'numeric',
                                    month: 'long',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <svg className="h-6 w-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {event.location}
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                <svg className="h-6 w-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{event.count_members} из {event.max_members} мест занято</span>
                                        <span>{Math.round((event.count_members / event.max_members) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${(event.count_members / event.max_members) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-end">
                            {currentUser && (
                                <button
                                    onClick={isRegistered ? handleCancelRegistration : handleRegistration}
                                    disabled={!isRegistered && event.count_members >= event.max_members}
                                    className={`w-full py-3 px-6 rounded-lg text-white font-semibold ${isRegistered
                                        ? 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
                                        : event.count_members >= event.max_members
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                                        } transition-colors duration-200`}
                                >
                                    {isRegistered ? 'Отменить регистрацию' : 'Зарегистрироваться'}
                                </button>
                            )}
                            {!currentUser && (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full py-3 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors duration-200 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                                >
                                    Войдите, чтобы зарегистрироваться
                                </button>
                            )}
                        </div>
                    </div>

                    <EventTags
                        tags={event.tags || []}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default EventDetails; 