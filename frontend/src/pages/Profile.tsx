import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService, registrationService, eventService } from '../api/services';
import type { Registration, RegistrationWithEvent } from '../types';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../components/LoadingSpinner';

interface User {
    id: number;
    username: string;
    email: string;
    avatar_url: string | null;
    created_at: string;
}

const Profile = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'registrations'>('profile');

    const { data: user, isLoading: isLoadingUser } = useQuery<User>({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await authService.getCurrentUser();
            return response.data;
        },
    });

    const { data: registrations, isLoading: isLoadingRegistrations, error } = useQuery<RegistrationWithEvent[]>({
        queryKey: ['userRegistrations'],
        queryFn: async () => {
            const response = await registrationService.getUserRegistrations();
            const registrationsWithEvents = await Promise.all(
                response.data.map(async (registration) => {
                    const eventResponse = await eventService.getEventById(registration.event_id);
                    return {
                        ...registration,
                        event: eventResponse.data
                    };
                })
            );
            return registrationsWithEvents;
        },
    });

    const queryClient = useQueryClient();

    const cancelRegistrationMutation = useMutation({
        mutationFn: async (eventId: number) => {
            await registrationService.cancelRegistration(eventId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userRegistrations'] });
            toast.success('Регистрация на событие отменена');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Ошибка при отмене регистрации');
        },
    });

    const handleCancelRegistration = (eventId: number) => {
        cancelRegistrationMutation.mutate(eventId);
    };

    if (isLoadingUser || isLoadingRegistrations) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
            >
                <p className="text-red-600">Ошибка при загрузке регистраций</p>
            </motion.div>
        );
    }

    const tabVariants = {
        inactive: {
            backgroundColor: "rgba(255, 255, 255, 0)",
            color: "rgb(107, 114, 128)",
            transition: { duration: 0.2 }
        },
        active: {
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            color: "rgb(67, 56, 202)",
            transition: { duration: 0.2 }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
            >
                <div className="px-6 py-6">
                    <div className="flex space-x-4">
                        <motion.button
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-3 text-base font-medium rounded-xl transition-all duration-200
                                ${activeTab === 'profile' ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}
                            `}
                            variants={tabVariants}
                            animate={activeTab === 'profile' ? 'active' : 'inactive'}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Профиль
                        </motion.button>
                        <motion.button
                            onClick={() => setActiveTab('registrations')}
                            className={`px-6 py-3 text-base font-medium rounded-xl transition-all duration-200
                                ${activeTab === 'registrations' ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}
                            `}
                            variants={tabVariants}
                            animate={activeTab === 'registrations' ? 'active' : 'inactive'}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Мои регистрации
                        </motion.button>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' ? (
                            <motion.div
                                key="profile"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="p-6"
                            >
                                <div className="space-y-8">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex items-center space-x-6"
                                    >
                                        <div className="relative">
                                            {user?.avatar_url ? (
                                                <motion.img
                                                    src={user.avatar_url}
                                                    alt="Аватар пользователя"
                                                    className="h-24 w-24 rounded-full object-cover ring-4 ring-indigo-50 dark:ring-gray-700"
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                />
                                            ) : (
                                                <motion.div
                                                    className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold"
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    {user?.username.charAt(0).toUpperCase()}
                                                </motion.div>
                                            )}
                                            <motion.div
                                                className="absolute -bottom-1 -right-1 h-8 w-8 bg-green-400 rounded-full border-4 border-white dark:border-gray-800"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.2 }}
                                            />
                                        </div>
                                        <div>
                                            <motion.h2
                                                className="text-2xl font-bold text-gray-900 dark:text-white"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                {user?.username}
                                            </motion.h2>
                                            <motion.p
                                                className="text-gray-500 dark:text-gray-400"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                {user?.email}
                                            </motion.p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                Дата регистрации
                                            </h3>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : 'Не указана'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                Количество регистраций
                                            </h3>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {registrations?.length || 0}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="registrations"
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="p-6"
                            >
                                <div className="space-y-4">
                                    {registrations?.map((registration, index) => (
                                        <motion.div
                                            key={registration.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                <div className="space-y-2">
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                                                        {registration.event.title}
                                                    </h4>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span className="font-medium truncate">{registration.event.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span className="font-medium">{new Date(registration.event.start_time).toLocaleDateString('ru-RU', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                                    <span className="text-sm font-medium text-green-600 dark:text-green-400 whitespace-nowrap">
                                                        Зарегистрирован
                                                    </span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleCancelRegistration(registration.event.id)}
                                                        className="text-sm px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200 flex items-center gap-1 whitespace-nowrap"
                                                    >
                                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Отменить
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {registrations?.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center py-12"
                                        >
                                            <svg
                                                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                                У вас пока нет регистраций на события
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile; 