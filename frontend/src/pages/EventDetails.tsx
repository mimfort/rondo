import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventService, registrationService } from '../api/services';
import { Event } from '../types';
import toast from 'react-hot-toast';

const EventDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const eventData = await eventService.getEventById(Number(id));
                setEvent(eventData.data);

                // Проверяем, зарегистрирован ли пользователь на событие
                const registrations = await registrationService.getUserRegistrations();
                const isUserRegistered = registrations.data.some(reg => reg.event.id === Number(id));
                setIsRegistered(isUserRegistered);
            } catch (error) {
                console.error('Error fetching event:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleRegister = async () => {
        if (!event) return;

        try {
            await registrationService.registerForEvent(event.id);
            setIsRegistered(true);
            toast.success('Вы успешно зарегистрировались на событие!');
        } catch (error: any) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.detail || 'Ошибка при регистрации на событие');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Событие не найдено</h2>
                    <button
                        onClick={() => navigate('/events')}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Вернуться к списку событий
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">{event.title}</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">О событии</h2>
                                <p className="text-gray-600 mb-6">{event.description}</p>

                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{new Date(event.start_time).toLocaleString('ru-RU', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</span>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{event.location}</span>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span>Свободных мест: {event.max_members - event.registration_count} из {event.max_members}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Условия участия</h2>
                                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                                        <li>Участие бесплатное</li>
                                        <li>Необходима предварительная регистрация</li>
                                        <li>Количество мест ограничено</li>
                                    </ul>
                                </div>

                                <div className="mt-8">
                                    <button
                                        onClick={handleRegister}
                                        disabled={event.max_members === event.registration_count || isRegistered}
                                        className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${event.max_members === event.registration_count
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : isRegistered
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-indigo-600 hover:bg-indigo-700'
                                            }`}
                                    >
                                        {event.max_members === event.registration_count
                                            ? 'Места закончились'
                                            : isRegistered
                                                ? 'Вы уже записаны'
                                                : 'Зарегистрироваться'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EventDetails; 